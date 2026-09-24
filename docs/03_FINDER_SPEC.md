# Finder spec

The finder is the site's main feature. Its logic is **already written and tested** in `starter/finder/finder.mjs`. This document explains the behavior so you can build the interface and keep the rules intact.

**Do not reimplement the scoring.** Copy the module, keep the tests, and build the UI around it. If you convert it to TypeScript, the golden test (`fixtures/prototype-runs.json`, 80 recorded runs of the prototype) must still pass.

Run the tests: `cd starter/finder && node --test` (Node 20 or newer). Expected: 10 tests, all passing.

## How it works, in plain terms

1. Ask **what the person wants more of** (the goal, which maps to a funnel stage). Offer "I am not sure", which asks a second, plainer question. "None of these fit" there falls back to the CRM category and shows a note.
2. Ask **what the tool should help them do** (the need, which maps to a category in that stage).
3. Ask **adaptive questions** from this pool: budget, team size, CRM, setup comfort, must-connect (Slack or Zapier), and priority.
4. After each answer, decide whether more questions are worth asking.
5. Show three ranked picks with reasons, warnings, and alternatives.

### Adaptive rule (the part that makes it "smart")

For each unanswered question, the module tries every answer option and checks whether the **top three tools** would change. A question that cannot change the top three is skipped. The next question asked is the one that could produce the most different top-three results (ties go to the fixed order budget, size, CRM, tech, must, priority).

- **Minimum:** at least one adaptive question is always asked, so the visitor answers at least 3 questions.
- **Maximum:** 10 in total. With the current pool the real maximum is 9.
- **Stop:** when no remaining question could change the top three, or the pool is empty.

### Scoring, per tool

Only tools in the chosen stage are scored. Points are added or removed as follows (the module is the exact reference):

| Signal | Points |
|---|---|
| Category equals the chosen need | +80 |
| Same stage, different category | +8 |
| Editorial `featured` | +3 |
| Budget "free only": free plan / paid / quote | +20 / -25 / -40 |
| Budget "up to $100": free plan / paid / quote | +15 / +10 / -30 |
| Budget "$100 to $500": free plan / paid / quote | +5 / +15 / -10 |
| Budget "$500 or more": quote / paid | +15 / +5 |
| Team "just me": setup 1 / setup 3 / quote | +10 / -15 / -10 |
| Team "2 to 10": setup 1 or 2 / setup 3 | +5 / -5 |
| Team "more than 50": quote / setup 3 / setup 1 | +8 / +8 / -3 |
| CRM is HubSpot or Salesforce: works with it / does not | +15 / -6 |
| CRM is Google Workspace and tool works with it | +8 |
| Setup comfort "start today": setup 1 / setup 3 | +12 / -18 |
| Setup comfort "some workflows": setup 1 / 2 / 3 | +4 / +6 / -5 |
| Setup comfort "have technical help": setup 3 / 2 | +8 / +4 |
| Must connect with Slack or Zapier: yes / no | +10 / -10 |
| Priority price: free plan / paid / quote | +10 / +4 / -8 |
| Priority speed: setup 1 / 2 / 3 | +10 / +3 / -8 |
| Priority depth: quote or setup 3 / featured | +8 / +2 |

Ties break by editorial `featured`, then name A to Z.

### The exact-category guarantee

A tool in the exact category the person asked for **always appears in the top three**, even if budget or team size count against it. Without this, one tool in a thin category (for example, the only call-intelligence tool) could be ranked out of sight. It then carries a "Keep in mind" warning such as "No free plan listed".

### Reasons and warnings

Each pick has up to three reasons ("Focused on sending outreach emails", "Works with HubSpot", "Quick to set up") plus a "Best for" line from the tool record, and up to two warnings ("Pricing is by quote"). They are generated from templates, not by an AI, so the same answers always produce the same explanation. A later version may let an AI model rewrite the reasons, but only from the fields the scoring already used, so it can never recommend a tool that is not in the database.

## Data the finder needs per tool

| Field | Values |
|---|---|
| `id` | any stable string (use the database UUID or the slug) |
| `name` | text (also used for the "It is the HubSpot CRM you already use" case) |
| `stage` | 1 to 5 |
| `cat` | category name, must match a name in `NEED` |
| `price` | `'Free plan'`, `'Paid'`, or `'Custom quote'` |
| `ints` | integration names, from the fixed list |
| `setup` | 1, 2, or 3 (see the rubric in `data/DATA_RESEARCH_GUIDE.md`) |
| `feat` | boolean, **editorial** featured only |
| `published` | omit or true. Drafts are excluded. |

**Never** feed paid placement (`sponsored`, `featured_until`) into the finder.

## Interface requirements

- One question per screen, a progress bar, "Question N" text, a **Back** button (undo the last answer), and answer buttons that are large and keyboard friendly.
- The heading of each question is the page's `<h1>`. Focus moves to it after each answer, and the page scrolls to the top.
- Do not show a fixed "of N" total; the number of questions varies. Show only "Question N".
- On the first question, add: "Answer 3 to 10 short questions and get three picks from the directory. The questions adapt to your answers, and stop once more answers would not change the result."
- The results page has the sections in `docs/01_BUILD_BRIEF.md`, section 7.
- Copy comes from `QUESTIONS` in the module. Keep it in sentence case, with no arrows.

## Test scenarios (sample data)

| Answers | Expected |
|---|---|
| goal 3, need Email outreach, size solo | lemlist, Instantly, Smartlead. 3 questions. |
| goal 4, need Meeting notes, budget high | Fireflies, Fathom, Otter. 3 questions. |
| goal 4, need Call intelligence, budget free, team solo, CRM HubSpot | Fireflies, Fathom, and Gong (Gong forced in by the category guarantee, with warnings). 5 questions. |
| goal 0 (unsure), then "None of these fit" | CRM fallback with the note "Nothing stood out, so we started with a CRM...". |

These expected results are for the 42 sample tools. With the real database the picks will differ, and that is fine. The rules and question flow must not.

## Future improvements (not v1)

- Let people pick more than one need.
- Add a "team already uses" integration list that is not limited to five.
- Learn from `finder_runs` which questions people abandon.
- AI-written explanations constrained to the scoring fields.
