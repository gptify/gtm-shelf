# Paste this to the builder agent

You are building the production version of **GTM Shelf**, a directory of AI tools for sales and marketing. A complete handoff kit is in this folder. Read `README.md`, then `docs/01_BUILD_BRIEF.md`, then the other docs as you need them.

Ground rules:
1. The prototype `reference/gtm-shelf-prototype.html` is the source of truth for look and behavior. Open it in a browser and use it.
2. Do not rewrite the finder logic. Copy `starter/finder/` and keep `node --test` passing.
3. Use `db/schema.sql` as the starting schema. It has **not** been run against a real database. Apply it to an empty Supabase project first and fix anything the server rejects. Keep the fixed file as the source of truth.
4. Never publish the 42 sample tools. They are unverified. The schema blocks publishing without `verified_at` and a source URL.
5. Paid placement must never affect finder results or organic ordering.
6. No tracking cookies, no third-party trackers, self-hosted fonts.
7. When something in the docs is unclear or a decision is listed under "Decisions the human owner still has to make", stop and ask instead of guessing.

Work in this order and show me a working result after each step:
1. Project scaffold, deploy a "hello" page to a Vercel preview, apply the schema and seeds to Supabase.
2. Home page with the funnel selector, filters, and the three views, reading from the database (use the sample tools as drafts in staging only).
3. Tool, stage, and category pages with real URLs, sitemap, robots, and structured data.
4. Finder page using the finder module.
5. Guides (12), custom build page and form, submit tool form, email my picks with double opt-in.
6. Admin area.
7. Legal pages (from the drafts, with placeholders left visible), analytics, dark mode and accessibility pass.
8. Run `docs/08_QA_CHECKLIST.md` and report every item that fails.

At each step, tell me what you built, what you tested, and what you could not test. Do not claim something works unless you ran it.
