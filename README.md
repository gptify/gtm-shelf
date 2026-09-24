# GTM Shelf: handoff kit

Everything needed to build the production site, prepared from the working prototype.

## Start here
1. `docs/00_AGENT_PROMPT.md` : paste this to the builder agent.
2. `docs/01_BUILD_BRIEF.md` : what to build, page by page, with acceptance criteria.
3. The other docs as needed (architecture, finder, design system, SEO, legal drafts, launch kit, QA).

## What is in the kit

```
README.md
docs/
  00_AGENT_PROMPT.md            first message for the builder agent
  01_BUILD_BRIEF.md             product spec and acceptance criteria
  02_ARCHITECTURE_AND_DEPLOY.md stack, env vars, setup steps for the human owner
  03_FINDER_SPEC.md             how the finder works and its scoring rules
  04_DESIGN_SYSTEM.md           brand, tokens, components, accessibility, writing rules
  05_SEO_AND_CONTENT.md         URLs, metadata, structured data, guide plan
  06_LEGAL_DRAFTS.md            privacy, terms, imprint, disclosures (drafts, need a lawyer)
  07_LAUNCH_KIT.md              vendor emails, newsletter, LinkedIn, Product Hunt, timeline
  08_QA_CHECKLIST.md            pre-launch checks
db/
  schema.sql                    Postgres/Supabase schema with row level security
  seed_reference.sql            stages, categories, integrations
  seed_tools_unverified.sql     the 42 sample tools as DRAFT rows
data/
  tools_template.csv            columns for the real tool data
  tools_seed_UNVERIFIED.csv     the 42 sample tools (unverified)
  DATA_RESEARCH_GUIDE.md        how to verify and fill tool data
starter/
  finder/                       tested finder module (reuse as is)
  styles/gtm-shelf.css          the prototype stylesheet with design tokens
  content/                      guides.json, taxonomy.json
reference/
  gtm-shelf-prototype.html      the working prototype
  brand-kit/                    logos, icons, favicon, README
```

## What is done and tested
- **Finder module:** ported from the prototype and tested. 10 tests pass (`cd starter/finder && node --test`), including a golden test that replays 80 random answer paths recorded from the prototype and requires identical questions, picks, alternatives, and reasons.
- **Prototype:** tested in a headless browser for routes, forms, views, sorting, prefill, and phone layouts.
- **Brand kit:** vector marks, icons, favicon files exported and checked visually.

## What is NOT done or NOT tested
- **`db/schema.sql` has never been run against a real Postgres or Supabase.** It was written carefully but is untested. Apply it to an empty project first.
- **No Next.js app exists yet.** There is no scaffold, and nothing here has been deployed.
- **Tool data is unverified.** The 42 sample tools have illustrative details. The research guide explains how to verify them and reach 100.
- **Legal texts are drafts** and need a lawyer's review.
- **Lockup SVGs use live text** in Bricolage Grotesque and need to be converted to outlines with the font installed before print or partner use.
- **Domain and trademark checks for "GTM Shelf" are not finished.** Do them before spending on the launch.
- **Email deliverability, analytics, and Turnstile** need real accounts and keys, which only the owner can create.

## What the owner has to do
Register the domain, create the accounts (GitHub, Vercel, Supabase, Resend, Cloudflare, analytics), add the email DNS records, decide the open questions at the end of the brief, and get the legal texts reviewed. Details in `docs/02_ARCHITECTURE_AND_DEPLOY.md`.
