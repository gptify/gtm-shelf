# SEO and content plan

Search is the main long-term traffic source for a directory. The prototype has no crawlable pages (it uses hash routes), so this is the biggest thing the real build changes.

## Page types and templates

| Page | Title (max 60 chars) | Meta description (max 155) | H1 |
|---|---|---|---|
| Home | GTM Shelf: AI tools for sales and marketing | A curated directory of AI tools built only for sales and marketing. Browse by funnel stage or answer a few questions to get three picks. | Pick the AI tool for the stage where your funnel leaks. |
| Tool | {Name}: what it does, pricing, and alternatives | {Tagline}. {Pricing model in words}. Works with {top 3 integrations}. Verified {Month Year}. | {Name} |
| Stage | AI tools to {verb} ({N} tools) | The {N} AI tools in the {Stage} stage of the sales and marketing funnel: {category list}. | {Stage} tools |
| Category | Best AI tools for {category phrase} | {N} AI tools for {category phrase}, compared by pricing, setup effort, and integrations. | Best AI tools for {category phrase} |
| Guide (best of) | {Guide title} | The guide's description, plus the count of tools. | The guide title |
| Guide (vs) | {A} vs {B}: which should you choose? | Side-by-side comparison of {A} and {B}: pricing, setup, integrations, and who each suits. | {A} vs {B} |
| Finder | Find my AI tools: answer a few questions | Answer 3 to 10 questions and get three ranked AI tool picks for your goal, team, and budget. | Find my tools |
| Custom | Custom AI tools and automations | If no tool fits, GPTify builds custom AI tools and automations for sales and marketing teams. | Need something no tool does yet? |

Stage verbs for titles: Attract "attract visitors", Prospect "find leads", Engage "reach and convert leads", Close "close deals", Grow "grow revenue".

## Rules

- **Server-render** every public page. Tool, stage, category, and guide pages must be fully readable with JavaScript off.
- One `<h1>` per page. Descriptive link text. Alt text on logos ("{Name} logo").
- Canonical URL on every page. Pages with `?filter`, `?sort`, or `?view` parameters are `noindex, follow` and canonical to the clean URL.
- **Sitemap** (`/sitemap.xml`) lists published tools, stages, categories, guides, and static pages, with `lastmod` from `updated_at` (tools use `verified_at` if newer). Split into several files above 5,000 URLs.
- `robots.txt`: allow everything in production, block `/admin`, `/out/`, and query-string duplicates; disallow all on preview deployments.
- **Open Graph and Twitter images:** generate one per page (logo, page title, and for tools the tool name). Size 1200 by 630.
- **Speed:** logos as small SVG or WebP, self-hosted fonts, images with width and height set, no layout shift.
- Keep `llms.txt` at the root with a short description and links to the main pages.

## Structured data (JSON-LD)

- **All pages:** `Organization` (name GTM Shelf, logo, "run by GPTify" as `parentOrganization` or `founder`) and `WebSite`.
- **Tool pages:** `SoftwareApplication` with `name`, `applicationCategory` (BusinessApplication), `url`, `description`, and `offers` only when the price is verified. Do **not** add `aggregateRating` (there are no reviews).
- **Category, stage, and guide pages:** `ItemList` of the tools shown, plus `BreadcrumbList`.
- **Comparison pages:** `ItemList` of the two tools and a `FAQPage` only if the page really has visible questions and answers.

## Internal linking

- Every tool page links to its category, its stage, up to 3 similar tools, and every guide it appears in.
- Every category page links to matching guides and to the finder.
- Guides link to tool pages, related guides, the finder, and (softly) the custom page.
- The footer links to the main static pages and the five stages.
- Breadcrumbs on all inner pages.

## Content plan

**Launch: 12 guides** (defined in `starter/content/guides.json`, generated from the database).

**Next 20 guides**, in priority order (high buyer intent first):
1. Best AI tools for cold email outreach
2. Best AI CRM tools for small teams
3. Best AI tools for LinkedIn outreach
4. Best AI note takers for sales calls
5. Best AI tools for lead enrichment
6. Best AI tools for ad creative
7. Best AI tools for social media scheduling
8. Best AI tools for email marketing
9. Best AI chatbots for lead generation
10. Best AI tools for sales forecasting
11. Best AI tools for SEO audits
12. Best AI tools for content briefs
13. Best free AI tools for startups selling B2B
14. Best AI tools that work with Salesforce
15. Best AI tools that work with Slack
16. Best AI tools for agencies
17. Apollo alternatives
18. Instantly alternatives
19. HubSpot alternatives
20. Clay alternatives

Every guide needs: a short intro, the criteria used, the shortlist with reasons, and a "how to choose" section. Only include facts that are sourced in the database. Update a guide when any tool in it is re-verified.

**Programmatic pages (v1.1):** `/alternatives/[tool]` lists tools in the same category, with a comparison table. Generate them only for tools with at least 3 real alternatives.

## Links and outreach (basic)

- Each published tool page gets a "Claim this listing" line in v1.1. Vendors who claim usually link back.
- Submit the site to Product Hunt, AI tool directories, and relevant "awesome" lists after launch.
- Keep a list of every place the site is mentioned.

## Measurement

Set up Google Search Console and Bing Webmaster Tools on day one. Watch impressions and clicks by page type, indexed pages versus published pages, and the queries that lead to tool pages. Review monthly.
