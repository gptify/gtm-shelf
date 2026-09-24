# Tool data research guide

The directory is only as good as its data. This guide tells a researcher (a person or an agent) exactly how to fill `data/tools_template.csv` so each row can be published.

The 42 tools in `data/tools_seed_UNVERIFIED.csv` are **sample data from the prototype**. Descriptions, pricing models, integrations, and setup ratings are illustrative and may be wrong. Treat every field as unverified.

## What counts as a listing

Include a tool only if all are true:
- It is built for, or mainly used for, **sales or marketing**.
- It uses AI in a way the vendor states on its own site (not just a feature label).
- It is a live product with a working website and a public way to sign up or contact sales.
- It fits one of the 14 categories (see `starter/content/taxonomy.json`).

Exclude: dead or acquired-and-closed products, tools with no public site, pure agencies or services, tools mainly for engineering, HR, or finance, and anything that only calls itself AI without describing what it does.

## Targets for launch

At least **100 tools**, with at least **6 per category** (14 categories, 5 stages). Cover both well-known and newer tools. Aim for a mix of free-plan, paid, and quote-based tools.

## Fields and rules

| Field | Rule |
|---|---|
| `slug` | Lowercase letters, numbers, hyphens. From the name. Unique. |
| `name` | The vendor's own spelling and capitalization. |
| `website_url` | The vendor's main site, `https`. No tracking parameters. |
| `stage`, `category` | Stage number 1 to 5 and the exact category name. The category must belong to the stage. |
| `tagline` | 120 characters or fewer. What it does, in plain words. Written by us, not copied. |
| `description` | 600 characters or fewer, one or two sentences. Only facts you can source. Written in our own words. |
| `best_for` | A short phrase for who it suits ("Outbound teams sending at volume"). Judgment, but it must follow from the sources. |
| `pricing_model` | `free_plan`: the vendor publishes a permanent free tier (a time-limited trial is **not** a free plan). `paid`: prices are published and there is no permanent free tier. `custom_quote`: prices are not public ("contact sales", "book a demo"). |
| `price_note` | Optional, one line with the published entry price and the date, for example "Paid plans from $X per month (pricing page, 2026-10-01)". Leave empty if unsure. |
| `setup_effort` | 1, 2, or 3. See the rubric below. |
| `integrations` | Only from: HubSpot, Salesforce, Slack, Zapier, Google Workspace. Include one only if the vendor's own integrations page or docs list it. Separate with semicolons. |
| `featured` | `true` only for tools the editors choose to highlight. Never for payment. |
| `source_urls` | At least one URL per row. Preferably the pricing page and the integrations page. Separate with semicolons. |
| `verified_at` | Date you checked, `YYYY-MM-DD`. |
| `verified_by` | Your name or handle. |
| `status` | Keep `draft`. Only an editor changes it to `published`. |
| `notes` | Anything odd (recent rebrand, acquisition, unclear pricing). Internal only. |

### Setup effort rubric

- **1, quick to start:** sign up and get value within an hour without help. Self-serve, minimal configuration.
- **2, some setup:** needs configuration such as connecting mailboxes or a CRM, building workflows, or importing data. A day or two for one person.
- **3, needs admin or technical help:** implementation project, admin rights, SSO, data engineering, or vendor onboarding. Usually sold with a sales process.

Base the rating on the vendor's own onboarding and docs, not a guess. When unsure between two levels, pick the higher effort and note it.

## Source priority

1. The vendor's pricing page, docs, and integrations page.
2. The vendor's help center and changelog.
3. Reputable review sites (G2, Capterra) to cross-check pricing model and category, never as the only source.
4. Never use forums, social posts, or AI summaries as the only source.

## Checks before a row is ready

- [ ] The site loads and the product is live
- [ ] The category and stage fit
- [ ] Pricing model checked on the vendor's page today
- [ ] Every listed integration appears on the vendor's page
- [ ] Setup rating has a reason in the notes if it is not obvious
- [ ] Tagline and description are original wording, within the length limits
- [ ] At least one source URL, and `verified_at` and `verified_by` filled in
- [ ] No duplicate of another row (same domain)

## Keeping it fresh

- Re-verify every published tool every 90 days.
- If a tool is acquired, renamed, or shut down, set the status to `archived` and record why in the notes.
- Log changes to pricing model or integrations in the notes with the date.

## Selecting the first 100

Suggested order of work:
1. Verify the 42 sample tools (fix or replace anything wrong).
2. Add tools until each category has at least 6.
3. Add 20 or more newer tools that are getting attention, checking they meet the listing rules.
4. Have a second person spot-check 20 random rows against the vendors' pages.
