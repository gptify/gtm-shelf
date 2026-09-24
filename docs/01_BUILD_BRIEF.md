# GTM Shelf: build brief

Read this first. The working prototype (`reference/gtm-shelf-prototype.html`) is the source of truth for how the product looks and behaves. This brief says what to build for real, what to keep, and what to replace.

## 1. What we are building

**GTM Shelf** is a directory of AI tools for sales and marketing only. Visitors find tools three ways:

1. **Browse by funnel stage.** Five stages (Attract, Prospect, Engage, Close, Grow) with categories under each.
2. **Search and filter.** By category, pricing model, and integrations, in list, grid, or table view.
3. **The finder.** 3 to 10 adaptive questions that return three ranked picks with reasons.

The site earns from custom build requests to GPTify (the owner's AI automation business), then from featured listings and sponsored slots, then from affiliate links. It is run by GPTify and must say so.

**Audience:** sales and marketing people at small and mid-size companies who do not yet know which tool they need. English first. Uzbek later.

**Trust rule:** rankings are editorial. Paid placements are labelled and never change the finder's results or the organic order.

## 2. Reference material in this kit

| Path | What it is |
|---|---|
| `reference/gtm-shelf-prototype.html` | Single-file working prototype. Open it in a browser. Behavior source of truth. |
| `reference/brand-kit/` | Logo files, favicon, colors, wordmark rules. |
| `starter/styles/gtm-shelf.css` | The prototype's full stylesheet with design tokens at the top. |
| `starter/finder/` | The finder as a pure, tested module. **Reuse it as is.** |
| `starter/content/` | Stages, categories, guide definitions as JSON. |
| `db/` | Postgres schema, reference seed, unverified sample tools. |
| `data/` | Tool spreadsheet template, unverified sample data, research guide. |
| `docs/` | This brief and the other specs. |

## 3. What the prototype fakes (replace all of it)

| Prototype shortcut | Real version |
|---|---|
| Hash routes like `#/guides` | Real URLs, see section 5. Server-rendered so search engines see the content. |
| 42 tools hardcoded in JavaScript, all sample data | Database. Only verified tools are published. |
| Submit form adds the tool to the page in memory | Saves a `submissions` row, emails the admin, shows a confirmation. |
| Custom build form and "email my picks" show a fake confirmation | Save to the database, send emails, spam protection. |
| Saved tools in `localStorage` | Keep `localStorage` for v1. Accounts are out of scope. |
| Monogram tiles instead of logos | Real logos, see section 9. |
| "Pending review" badge | Not shown publicly. Pending items are admin-only. |
| Fonts from Google Fonts | Self-host the fonts (privacy and speed). |

## 4. Scope

### v1 (launch)
- Home with the funnel selector, search, filters, list/grid/table views, sorting, and the details view.
- Tool pages, stage pages, category pages.
- Finder with the exact behavior in `docs/03_FINDER_SPEC.md`.
- 12 guides (8 best-of, 4 comparisons) generated from the database, see `starter/content/guides.json`.
- Custom build page and form. Prefill from the finder and from search.
- Submit a tool form and an admin review queue.
- "Email me my picks" with double opt-in.
- Admin area: tools, submissions, custom requests, leads, guides, featured flags.
- Legal pages, sitemap, robots, structured data, analytics.
- Dark mode and full mobile support.

### v1.1
- Alternatives pages (`/alternatives/[tool]`), vendor claim flow, sponsored slots UI, weekly digest, Uzbek translation.

### Out of scope
- User accounts, reviews, comments, payments in the app, a public API.

## 5. Routes

| Route | Content |
|---|---|
| `/` | Hero, funnel selector, results with filters and views. Default stage Attract. |
| `/tools/[slug]` | Full tool page (the prototype's details panel, as a page). The panel still opens from lists as a drawer, with the tool page as its permalink. |
| `/stage/[slug]` | Tools in one stage (`attract`, `prospect`, `engage`, `close`, `grow`). |
| `/category/[slug]` | Tools in one category. |
| `/guides` and `/guides/[slug]` | Guides index and pages. |
| `/find` | The finder. |
| `/custom` | Custom build request. |
| `/submit` | Submit a tool. |
| `/out/[slug]` | Outbound redirect that records the click, then sends the visitor to the tool. |
| `/about`, `/privacy`, `/terms`, `/imprint` | Static pages. Drafts in `docs/06_LEGAL_DRAFTS.md`. |
| `/admin/*` | Behind login. |
| `/sitemap.xml`, `/robots.txt` | Generated. |

Filter and sort choices go in the query string (`?category=seo&pricing=free_plan&view=table&sort=price`) so links are shareable. Pages with query parameters are `noindex` and canonical to the clean URL.

## 6. The home page, in detail

Match the prototype exactly unless a line here says otherwise.

**Funnel selector**
- Five stacked bars narrowing (widths 100, 90, 80, 70, 60 percent; on phones 100, 94, 88, 82, 76). Each shows number, name, hint, and the count of matching tools.
- **Attract is selected by default.** Clicking the selected stage clears the selection (all stages).
- Stages the visitor has viewed get a soft tint. The selected one is solid.
- Buttons under the funnel: **See the N [Stage] tools** (soft style, scrolls to results), **Next stage: [Name]** (at stage 5 it says "Back to Attract"; with no stage selected it says "Start with Attract"), and a text link **Show all stages**.
- Intro animation on the funnel bars once, and one gentle pulse on stage 2 that stops after the first interaction. Both off under `prefers-reduced-motion`.
- Counts ignore the stage and category filters but respect search, pricing, integrations, and Saved.

**Search**
- Case-insensitive, every word must match somewhere in name, tagline, description, category, stage name, or integrations.
- **Typing in search clears the stage selection**, so search always covers all stages. In production use Postgres full-text search on `tools.search` plus trigram matching on name for typos.
- Popular searches: cold email, meeting notes, SEO, CRM.

**Filters** (left column on desktop, a "Filters" toggle on mobile)
- Category (grouped by stage; only the selected stage's categories when a stage is selected), Pricing (Free plan, Paid, Custom quote), Works with (HubSpot, Salesforce, Slack, Zapier, Google Workspace).
- Every option shows a **faceted count**: how many tools match if that option is added to the other current filters. Options with 0 are dimmed but stay clickable.
- Integrations combine with AND (the tool must support all selected). Other groups combine with OR within the group.

**Toolbar**
- Left: `[Stage] stage: N of TOTAL tools` (live region).
- Right: Filters (mobile), Clear all (only when something is active), Saved (n), the List/Grid/Table switch, and Sort (Featured first, Name A to Z, Funnel stage, Category, Pricing, Setup effort).
- The view choice is remembered in `localStorage`.

**Views**
- **List:** one row per tool. **Grid:** cards. **Table:** columns Tool, Funnel stage, Category, Pricing, Setup, Works with, and actions; sortable headers with `aria-sort`; first and last columns stay pinned on desktop; on phones only the first column is pinned; clicking a row opens the details panel unless the click was on a link or button.

**Details panel** (native `<dialog>`, slides in from the right)
- Logo, name, domain link, tagline, description, facts (stage, category, pricing, setup, works with, best for), **Visit** and **Save** buttons, and up to 3 similar tools (same category first, then same stage).
- Add "Verified [date]" and the sources link (new in production).

**Empty state:** "No tools match these filters", with Clear all filters, Submit a tool, and Request a custom build (prefilled with the search text).

## 7. Finder

Full spec in `docs/03_FINDER_SPEC.md`. Use `starter/finder/finder.mjs` directly, on the server and in the browser, so both always agree. The 10 tests in `starter/finder/finder.test.mjs` must keep passing, including the golden test built from 80 recorded runs of the prototype.

Product rules:
- Results show **three ranked picks** with 3 reasons and a "Best for" line each, up to two "Keep in mind" warnings, and **Visit / Details / Save**.
- Then three alternatives, a custom-build card, and the email capture.
- If fewer than three tools match the exact category, say so ("Only 1 tool matches ...").
- If the finder stopped early, say why ("We stopped after 3 questions because the others would not change your top three").
- Record an anonymous `finder_runs` row per completed run.

## 8. Forms

All forms: server-side validation (zod or equivalent), Cloudflare Turnstile, a hidden honeypot field, rate limit of 5 submissions per hour per IP hash, inline error messages tied to the field with `aria-describedby`, and a confirmation state. Never log email addresses.

**Custom build request** (`custom_requests`)
- Fields: what it should do (15 to 800 characters), tools used (optional), team size, project budget, timing, language (English or Uzbek), name, email.
- Prefill from the finder answers (need, stage, CRM, team size) or from the search text. Show "Prefilled from your finder answers. Edit anything you like." Prefill is used once and not stored in the browser.
- On submit: save, email the admin, send the requester a plain confirmation.

**Submit a tool** (`submissions`)
- Fields: name, website, stage, category (depends on stage), pricing, one-line summary (90 characters), optional description, email, "I represent this vendor" checkbox.
- Duplicate check on name and domain. New submissions are never public until an admin publishes a tool.

**Email my picks** (`leads`)
- One email field and a consent checkbox with the exact consent text stored. **Double opt-in:** send a confirmation link first; send the picks only after confirmation. Every later email has an unsubscribe link. Template in `docs/07_LAUNCH_KIT.md`.

## 9. Data and images

- The database is the only source of tools. Import from `data/tools_template.csv`. Keep the 42 sample tools as `draft`; they are unverified.
- **A tool cannot be published without `verified_at` and at least one source URL.** The schema enforces this.
- Verify with `data/DATA_RESEARCH_GUIDE.md`. Re-verify every 90 days; show "Verified [month year]" on tool pages.
- Logos: use each vendor's press or brand kit where possible. Store optimized SVG or 128 px PNG in storage. Fall back to the monogram tile (first letter on a hashed hue, as in the prototype) when no logo is available.
- Never hotlink vendor images.

## 10. Admin

Simple and fast. Login with Supabase Auth, roles in `profiles` (viewer, editor, admin).
- **Tools:** table with search and status filter, edit form, CSV import and export, "Mark verified" that stamps `verified_at` and `verified_by`, and the publish switch (blocked without sources).
- **Submissions:** review queue with Accept (creates a draft tool), Reject, Spam.
- **Custom requests:** list with status and internal notes, and a CSV export.
- **Leads:** list with confirmed status. No bulk emailing from here.
- **Guides:** edit text and filter JSON, publish switch.

## 11. Analytics

Use a cookieless tool (Plausible or PostHog with cookies off). Events: `finder_started`, `finder_completed`, `finder_custom_click`, `tool_detail_open`, `tool_visit`, `guide_view`, `submit_tool`, `custom_request`, `lead_confirmed`. Outbound clicks go through `/out/[slug]`, which also writes `tool_events`.

## 12. Paid placements (design now, build later)

- `tools.sponsored` and `featured_until` exist in the schema.
- Sponsored items always show a "Sponsored" badge, sit in clearly separated slots, and use `rel="sponsored"`.
- **Sponsored and paid-featured status must never change the finder score, filters, counts, or organic order.** The finder's `feat` flag means the **editorial** `featured` column only.
- Affiliate links use `rel="sponsored noopener noreferrer"` and are disclosed on the page.

## 13. Non-functional requirements

- **Performance:** Lighthouse 90+ for performance, accessibility, best practices, and SEO on the home page and a tool page, on a mid-range phone profile. Home page under 200 KB of JavaScript.
- **Accessibility:** WCAG 2.2 AA. Keyboard reachable everywhere, visible focus, native dialogs, `aria-pressed` on toggles, `aria-sort` on table headers, live regions for counts, reduced motion respected, contrast checked in both themes.
- **Browsers:** last two versions of Chrome, Safari, Firefox, Edge; iOS Safari; Android Chrome.
- **Security:** RLS on every table (already in the schema), service role key only on the server, strict CSP, no secrets in the client, dependency audit in CI.
- **Privacy:** no third-party trackers, no cookies except what login needs, self-hosted fonts.

## 14. Acceptance criteria

1. Given a new visitor, when the home page loads, then Attract is selected, its tools are listed, and the count reads "Attract stage: 12 of N tools" (N being the real total).
2. Given the home page, when the visitor clicks "Next stage: Prospect", then Prospect becomes selected, Attract gets the soft tint, and the count updates.
3. Given a stage is selected, when the visitor types "cold email", then the stage clears and results come from all stages.
4. Given filters and a view are chosen, when the URL is copied to a new tab, then the same state loads.
5. Given the table view, when a column heading is clicked twice, then the order reverses and `aria-sort` changes.
6. Given a row in any view, when it is activated by keyboard or mouse, then the details panel opens and focus moves into it; Escape closes it and returns focus.
7. Given the finder, when the visitor answers "More replies and booked calls", "Send outreach emails at scale", and "Just me", then the result is lemlist, Instantly, Smartlead in that order with the questions stopping at 3 (with the sample data).
8. Given the finder result page, when the visitor chooses "Request a custom build", then `/custom` opens with the answers prefilled.
9. Given a tool with `status = 'draft'`, when any public page, sitemap, search, or the finder runs, then the tool never appears.
10. Given an admin tries to publish a tool without a source URL, then the database rejects it and the admin sees a clear message.
11. Given a submission from the form with a filled honeypot, then nothing is stored and the response looks successful.
12. Given the "email my picks" form, when submitted, then no picks email is sent until the confirmation link is clicked.
13. Given a tool has `sponsored = true`, then it shows a "Sponsored" badge and does not affect finder results.
14. Given dark mode is on at the system level, then every page uses the dark tokens with no unreadable text.
15. Given a 390 px wide screen, then no page scrolls sideways (the table scrolls inside its own container).

## 15. Decisions the human owner still has to make

- Final domain, and whether to register misspelling redirects (gmtshelf).
- Legal entity, address, and country for the imprint and privacy policy.
- Sender domain and address for email.
- Whether featured listings launch in v1 or later, and their price.
- Who verifies the tool data and how often.
