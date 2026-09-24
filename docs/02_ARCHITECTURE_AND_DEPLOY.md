# Architecture and deployment

## Recommended stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js (App Router) with TypeScript | Server rendering for SEO, route handlers for forms, easy on Vercel. |
| Database and auth | Supabase (Postgres, Auth, Storage) | The schema in `db/schema.sql` is written for it, with row level security. |
| Email | Resend | Simple API, good deliverability, free tier is enough at launch. |
| Spam protection | Cloudflare Turnstile | Free, privacy-friendly. |
| Analytics | Plausible or PostHog (cookies off) | No cookie banner needed for analytics. |
| Hosting | Vercel | Preview deploys for every pull request. |
| DNS and CDN | Cloudflare (DNS only is fine) | Cheap, fast, one place for records. |
| Error tracking | Sentry (optional) | Catch form and server errors early. |

Any equivalent stack is fine if it keeps the same behavior. The schema and finder module are the parts that must not change.

Prices change often. Check current pricing for each service before committing. At launch scale, most of these have free tiers that are enough.

## Repository layout (suggested)

```
/app                 routes (see docs/01_BUILD_BRIEF.md, section 5)
/components          UI: FunnelSelector, ToolList, ToolGrid, ToolTable, ToolDrawer, Filters, Finder, Forms
/lib
  finder/            copy of starter/finder (keep the tests)
  db/                typed queries
  email/             templates
  validation/        zod schemas
/styles              starter/styles/gtm-shelf.css split into CSS modules or kept global
/public/brand        reference/brand-kit files
/supabase/migrations schema.sql and seeds as migrations
/scripts             import_tools.ts (CSV to database)
```

## Data flow

- **Reads:** server components query `tools_public` (a view of published tools with integrations aggregated). Cache with revalidation on publish (on-demand `revalidateTag`) plus an hourly fallback.
- **Finder:** the finder module runs in the browser for speed and on the server to record the run. Both use the same tool list. Only send the fields the module needs (`id, name, stage, cat, price, ints, setup, feat`); map from the database: `stage_id`, `category_name`, `pricing_model` to `'Free plan' | 'Paid' | 'Custom quote'`, `integrations`, `setup_effort`, `featured`.
- **Writes:** forms post to server actions or route handlers. They validate, check Turnstile and rate limits, then write with the service role. Never expose the service key.
- **Outbound clicks:** `/out/[slug]` inserts a `tool_events` row, then redirects with a 302. Add `rel="nofollow"` to organic links only if you decide to; sponsored and affiliate links must use `rel="sponsored"`.

## Environment variables

```
NEXT_PUBLIC_SITE_URL=https://gtmshelf.com        # final domain
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=                        # server only
RESEND_API_KEY=
EMAIL_FROM="GTM Shelf <hello@gtmshelf.com>"
ADMIN_NOTIFY_EMAIL=                               # where new requests and submissions are sent
TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
IP_HASH_SALT=                                     # long random string
PLAUSIBLE_DOMAIN=gtmshelf.com                     # or the PostHog keys
```

Keep secrets in Vercel project settings, never in the repository.

## What the human owner must set up (the agent cannot)

1. **Domain.** Register the final domain. Optionally also register `gmtshelf` and common misspellings as redirects.
2. **Accounts.** GitHub, Vercel, Supabase, Resend, Cloudflare (Turnstile and DNS), Plausible or PostHog, Sentry (optional). Give the builder agent access to the repository and a Vercel and Supabase project, but keep billing and owner rights with the human.
3. **Email DNS records.** In the domain's DNS add the SPF, DKIM, and DMARC records Resend shows. Start DMARC with `p=none`, then tighten after a few weeks. Without these, confirmation emails land in spam.
4. **Supabase.** Create the project in an EU region if most visitors are in Europe. Enable email login for admins only. Turn off public sign-ups.
5. **First admin.** Create the admin user, then run `insert into profiles (user_id, role) values ('<auth user id>', 'admin');`.

## Database setup

1. Run `db/schema.sql` on the empty project. **It has not been run against a real database yet.** Fix anything the server rejects and keep the fixed file as the source of truth.
2. Run `db/seed_reference.sql` (stages, categories, integrations).
3. Optionally run `db/seed_tools_unverified.sql` in a **staging** project. It inserts the 42 prototype tools as drafts. Do not publish them without verification.
4. Import verified tools from CSV with a script that reads `data/tools_template.csv` (columns match the table; `integrations` is semicolon separated; `stage` is 1 to 5; `category` is the category name).
5. Move the SQL into `supabase/migrations` so changes are tracked.

## Environments

- **Preview:** every pull request gets a Vercel preview URL with `noindex`.
- **Staging:** optional separate Supabase project with sample data.
- **Production:** the real domain. Set `robots.txt` to allow crawling only in production.

## Launch-day steps

1. Verified tool data is imported and published (see the data guide for the minimum: 100 tools, at least 6 per category).
2. Legal pages are filled in and reviewed.
3. Email sending works from the production domain (send a test to Gmail, Outlook, and one company mailbox).
4. Turnstile keys are the production ones.
5. Analytics is receiving events.
6. Sitemap is submitted in Google Search Console and Bing Webmaster Tools.
7. Backups: enable Supabase daily backups (paid plan) or schedule a `pg_dump` to storage.
8. Run `docs/08_QA_CHECKLIST.md` end to end.

## After launch

- Weekly: review submissions and custom requests; check the top finder answers; fix broken outbound links.
- Monthly: re-verify the 20 most-viewed tools; review analytics; refresh two guides.
- Every 90 days: re-verify every published tool. Flag tools with a `verified_at` older than 120 days in the admin.

## Costs

Rough monthly cost at launch scale is a domain (about 10 to 15 dollars a year) plus free or entry tiers of the services above. Costs rise with traffic and email volume. Check each vendor's current pricing page before deciding.
