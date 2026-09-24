-- GTM Shelf database schema (PostgreSQL 15+, written for Supabase).
-- NOT YET RUN against a live database: apply it to an empty project, fix anything the
-- server rejects, and keep this file as the source of truth (or move it into migrations).
--
-- Access model: the public site reads published data through the views below.
-- All writes from visitors (submissions, requests, leads, events) go through server code
-- that uses the service role key after validation, spam checks, and rate limiting.
-- RLS is enabled everywhere so a leaked anon key cannot read or write private data.

create extension if not exists pg_trgm;

-- ---------------------------------------------------------------- enums
create type pricing_model   as enum ('free_plan', 'paid', 'custom_quote');
create type tool_status     as enum ('draft', 'pending', 'published', 'rejected', 'archived');
create type guide_type      as enum ('best', 'vs');
create type request_status  as enum ('new', 'contacted', 'qualified', 'won', 'lost', 'spam');
create type request_source  as enum ('finder', 'search', 'guide', 'direct');
create type event_kind      as enum ('visit', 'detail', 'save', 'sponsor_view', 'sponsor_click');

-- ---------------------------------------------------------------- helpers
create or replace function set_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------------------------------------------------------------- taxonomy
create table stages (
  id          smallint primary key check (id between 1 and 5),
  slug        text not null unique,
  name        text not null,
  hint        text not null,
  sort        smallint not null
);

create table categories (
  id          serial primary key,
  stage_id    smallint not null references stages (id),
  slug        text not null unique,
  name        text not null unique,
  phrase      text not null,            -- used in finder reasons: "Focused on <phrase>"
  sort        smallint not null default 0
);

create table integrations (
  id          serial primary key,
  slug        text not null unique,
  name        text not null unique
);

-- ---------------------------------------------------------------- tools
create table tools (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  name             text not null,
  domain           text not null,                          -- "jasper.ai", used for display
  website_url      text not null check (website_url ~ '^https?://'),
  tagline          text not null check (char_length(tagline) <= 120),
  description      text not null check (char_length(description) <= 600),
  best_for         text,
  stage_id         smallint not null references stages (id),
  category_id      integer  not null references categories (id),
  pricing_model    pricing_model not null,
  price_note       text,                                   -- e.g. "Free plan; paid from $X per month (verified 2026-10-01)"
  setup_effort     smallint check (setup_effort between 1 and 3),  -- 1 quick, 2 some setup, 3 needs admin or technical help
  featured         boolean not null default false,
  featured_until   date,                                   -- paid placement end date, null when not paid
  sponsored        boolean not null default false,         -- must be labelled "Sponsored" in the UI when true
  affiliate_url    text check (affiliate_url is null or affiliate_url ~ '^https?://'),
  logo_path        text,                                   -- storage path, see docs
  status           tool_status not null default 'draft',
  source_urls      text[] not null default '{}',           -- pages used to verify the facts above
  verified_at      date,
  verified_by      text,
  submitted_by     text,                                   -- email of the submitter, if it came through the form
  notes            text,                                   -- internal only
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  search           tsvector generated always as (
                     setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
                     setweight(to_tsvector('english', coalesce(tagline, '')), 'B') ||
                     setweight(to_tsvector('english', coalesce(description, '')), 'C')
                   ) stored,
  -- a tool cannot go live without verification data
  constraint published_needs_verification check (
    status <> 'published' or (verified_at is not null and cardinality(source_urls) >= 1)
  )
);

create index tools_stage_idx    on tools (stage_id) where status = 'published';
create index tools_category_idx on tools (category_id) where status = 'published';
create index tools_status_idx   on tools (status);
create index tools_search_idx   on tools using gin (search);
create index tools_name_trgm    on tools using gin (name gin_trgm_ops);

create trigger tools_updated_at before update on tools
  for each row execute function set_updated_at();

create or replace function check_tool_category_stage() returns trigger language plpgsql as $$
begin
  if (select stage_id from categories where id = new.category_id) is distinct from new.stage_id then
    raise exception 'category % does not belong to stage %', new.category_id, new.stage_id;
  end if;
  return new;
end $$;

create trigger tools_category_stage before insert or update of category_id, stage_id on tools
  for each row execute function check_tool_category_stage();

create table tool_integrations (
  tool_id         uuid    not null references tools (id) on delete cascade,
  integration_id  integer not null references integrations (id) on delete cascade,
  primary key (tool_id, integration_id)
);

-- ---------------------------------------------------------------- guides
create table guides (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  type         guide_type not null,
  title        text not null,
  description  text not null,
  intro        text,
  criteria     text,                       -- shown under "How we chose"
  choose       text[] not null default '{}',
  filter       jsonb,                      -- for type 'best', e.g. {"category":"SEO","exclude_pricing":["Custom quote"]}
  tool_a       uuid references tools (id), -- for type 'vs'
  tool_b       uuid references tools (id),
  published    boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint vs_has_two_tools check (type <> 'vs' or (tool_a is not null and tool_b is not null and tool_a <> tool_b))
);
create trigger guides_updated_at before update on guides
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------- visitor submissions
-- Tools suggested by visitors or vendors. An admin reviews each one and, if accepted,
-- creates or updates a row in tools (status 'draft', then 'published' after verification).
create table submissions (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  website_url   text not null check (website_url ~ '^https?://'),
  stage_id      smallint references stages (id),
  category_id   integer references categories (id),
  pricing_model pricing_model,
  tagline       text,
  description   text,
  contact_email text not null,
  is_vendor     boolean not null default false,   -- submitter says they represent the vendor
  status        text not null default 'new' check (status in ('new', 'accepted', 'rejected', 'spam')),
  tool_id       uuid references tools (id),       -- set when accepted
  ip_hash       text,                             -- salted hash, never the raw IP
  created_at    timestamptz not null default now()
);
create index submissions_status_idx on submissions (status, created_at desc);

-- ---------------------------------------------------------------- custom build requests
create table custom_requests (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text not null,
  what          text not null check (char_length(what) between 15 and 800),
  tools_used    text,
  team_size     text,
  budget        text,
  timing        text,
  language      text check (language in ('English', 'Uzbek')),
  source        request_source not null default 'direct',
  prefill       jsonb,                       -- finder answers or search text that started the request
  status        request_status not null default 'new',
  internal_note text,
  ip_hash       text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index custom_requests_status_idx on custom_requests (status, created_at desc);
create trigger custom_requests_updated_at before update on custom_requests
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------- newsletter and finder-result leads
-- Double opt-in: a row is only "confirmed" after the person clicks the link in the first email.
create table leads (
  id               uuid primary key default gen_random_uuid(),
  email            text not null,
  source           text not null default 'finder',
  finder_answers   jsonb,
  pick_tool_ids    uuid[] not null default '{}',
  consent_text     text not null,            -- the exact wording shown next to the checkbox
  consent_at       timestamptz not null default now(),
  confirm_token    text unique,              -- random, single use
  confirmed_at     timestamptz,
  unsubscribed_at  timestamptz,
  created_at       timestamptz not null default now(),
  unique (email, source)
);

-- ---------------------------------------------------------------- analytics
-- Anonymous finder runs: what people asked for and what they were shown.
create table finder_runs (
  id              uuid primary key default gen_random_uuid(),
  answers         jsonb not null,
  question_count  smallint not null,
  top_tool_ids    uuid[] not null default '{}',
  clicked_custom  boolean not null default false,
  created_at      timestamptz not null default now()
);

-- Clicks on tools, for click counts, sponsor reports, and ranking sanity checks.
create table tool_events (
  id          bigserial primary key,
  tool_id     uuid not null references tools (id) on delete cascade,
  kind        event_kind not null,
  source      text,                          -- 'list', 'grid', 'table', 'guide', 'finder', 'detail'
  created_at  timestamptz not null default now()
);
create index tool_events_tool_idx on tool_events (tool_id, kind, created_at desc);

-- ---------------------------------------------------------------- admin access
create table profiles (
  user_id  uuid primary key references auth.users (id) on delete cascade,
  role     text not null default 'viewer' check (role in ('viewer', 'editor', 'admin'))
);

create or replace function is_editor() returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where user_id = auth.uid() and role in ('editor', 'admin'));
$$;

-- ---------------------------------------------------------------- public views
-- What the public site reads. Internal columns (notes, submitted_by, affiliate_url when not needed) stay out.
create or replace view tools_public as
select
  t.id, t.slug, t.name, t.domain, t.website_url, t.tagline, t.description, t.best_for,
  t.stage_id, s.name as stage_name, t.category_id, c.name as category_name, c.slug as category_slug,
  t.pricing_model, t.price_note, t.setup_effort, t.featured, t.featured_until, t.sponsored,
  t.logo_path, t.verified_at,
  coalesce(
    (select array_agg(i.name order by i.name)
       from tool_integrations ti join integrations i on i.id = ti.integration_id
      where ti.tool_id = t.id), '{}') as integrations
from tools t
join stages s on s.id = t.stage_id
join categories c on c.id = t.category_id
where t.status = 'published';

-- ---------------------------------------------------------------- row level security
alter table stages            enable row level security;
alter table categories        enable row level security;
alter table integrations      enable row level security;
alter table tools             enable row level security;
alter table tool_integrations enable row level security;
alter table guides            enable row level security;
alter table submissions       enable row level security;
alter table custom_requests   enable row level security;
alter table leads             enable row level security;
alter table finder_runs       enable row level security;
alter table tool_events       enable row level security;
alter table profiles          enable row level security;

-- Public read of reference data and published content.
create policy "public read stages"       on stages            for select using (true);
create policy "public read categories"   on categories        for select using (true);
create policy "public read integrations" on integrations      for select using (true);
create policy "public read published tools" on tools          for select using (status = 'published');
create policy "public read tool integrations" on tool_integrations for select
  using (exists (select 1 from tools t where t.id = tool_id and t.status = 'published'));
create policy "public read published guides" on guides        for select using (published);

-- Editors and admins manage content and see everything.
create policy "editors manage tools"        on tools            for all using (is_editor()) with check (is_editor());
create policy "editors manage tool integrations" on tool_integrations for all using (is_editor()) with check (is_editor());
create policy "editors manage guides"       on guides           for all using (is_editor()) with check (is_editor());
create policy "editors manage submissions"  on submissions      for all using (is_editor()) with check (is_editor());
create policy "editors manage requests"     on custom_requests  for all using (is_editor()) with check (is_editor());
create policy "editors read leads"          on leads            for select using (is_editor());
create policy "editors read finder runs"    on finder_runs      for select using (is_editor());
create policy "editors read events"         on tool_events      for select using (is_editor());
create policy "own profile"                 on profiles         for select using (user_id = auth.uid());

-- No public insert policies on purpose. Visitor writes use the service role in server code.

grant select on tools_public to anon, authenticated;
-- Reference data: stages, categories, integrations. Safe to run once after schema.sql.
begin;
insert into stages (id, slug, name, hint, sort) values (1, 'attract', 'Attract', 'Content, SEO, ads, social', 1);
insert into stages (id, slug, name, hint, sort) values (2, 'prospect', 'Prospect', 'Find and enrich leads', 2);
insert into stages (id, slug, name, hint, sort) values (3, 'engage', 'Engage', 'Outreach, SDR agents, chat', 3);
insert into stages (id, slug, name, hint, sort) values (4, 'close', 'Close', 'Calls, meetings, CRM', 4);
insert into stages (id, slug, name, hint, sort) values (5, 'grow', 'Grow', 'Lifecycle and forecasting', 5);
insert into categories (stage_id, slug, name, phrase, sort) values (1, 'content-writing', 'Content writing', 'writing marketing content', 1);
insert into categories (stage_id, slug, name, phrase, sort) values (1, 'seo', 'SEO', 'improving search rankings', 2);
insert into categories (stage_id, slug, name, phrase, sort) values (1, 'ad-creative', 'Ad creative', 'making ad creative', 3);
insert into categories (stage_id, slug, name, phrase, sort) values (1, 'social-media', 'Social media', 'managing social media', 4);
insert into categories (stage_id, slug, name, phrase, sort) values (2, 'lead-data', 'Lead data', 'finding contact data', 1);
insert into categories (stage_id, slug, name, phrase, sort) values (2, 'intent-signals', 'Intent signals', 'spotting buying intent', 2);
insert into categories (stage_id, slug, name, phrase, sort) values (3, 'email-outreach', 'Email outreach', 'sending outreach emails', 1);
insert into categories (stage_id, slug, name, phrase, sort) values (3, 'ai-sdr-agents', 'AI SDR agents', 'automated outbound with AI agents', 2);
insert into categories (stage_id, slug, name, phrase, sort) values (3, 'chat-and-conversion', 'Chat and conversion', 'chatting with website visitors', 3);
insert into categories (stage_id, slug, name, phrase, sort) values (4, 'call-intelligence', 'Call intelligence', 'analyzing sales calls', 1);
insert into categories (stage_id, slug, name, phrase, sort) values (4, 'meeting-notes', 'Meeting notes', 'capturing meeting notes', 2);
insert into categories (stage_id, slug, name, phrase, sort) values (4, 'crm', 'CRM', 'managing contacts and deals', 3);
insert into categories (stage_id, slug, name, phrase, sort) values (5, 'email-and-lifecycle', 'Email and lifecycle', 'lifecycle email and messaging', 1);
insert into categories (stage_id, slug, name, phrase, sort) values (5, 'revenue-forecasting', 'Revenue forecasting', 'forecasting revenue', 2);
insert into integrations (slug, name) values ('hubspot', 'HubSpot');
insert into integrations (slug, name) values ('salesforce', 'Salesforce');
insert into integrations (slug, name) values ('slack', 'Slack');
insert into integrations (slug, name) values ('zapier', 'Zapier');
insert into integrations (slug, name) values ('google-workspace', 'Google Workspace');
commit;
