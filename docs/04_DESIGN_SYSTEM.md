# Design system

The prototype's stylesheet is `starter/styles/gtm-shelf.css`. It contains every token and component style. Keep the look; restructure the code however the framework prefers (CSS modules, Tailwind config from these tokens, or keep the file global).

## Brand

- **Name:** GTM Shelf. Always written with capital G, T, M and a capital S. Never "GMT Shelf" (a common typo, the time zone).
- **Logo:** the stepped trio (a checked block beside two lighter blocks, standing on a shelf line). Files in `reference/brand-kit/`. The wordmark uses two weights: **GTM** ExtraBold (800), Shelf Medium (500), tracking -0.025em.
- **Voice:** plain, direct, sentence case. No arrows in button or link text. No all-caps labels. No filler like "Unlock" or "Supercharge". Say what something is or does.

## Colors

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#F2F3F8` | `#0F1122` | Page background |
| `--surface` | `#FFFFFF` | `#171A31` | Cards, panels, inputs |
| `--ink` | `#15172B` | `#ECEEF9` | Text |
| `--muted` | `#5B5F7A` | `#A0A5C2` | Secondary text |
| `--line` | `#D9DCEA` | `#2B2F4F` | Borders |
| `--brand` | `#2F45E0` | `#8393FF` | Primary actions, selected states, logo |
| `--brand-ink` | `#FFFFFF` | `#0F1122` | Text on brand |
| `--brand-soft` | `#E5E9FF` | `#242A58` | Tints, chips, visited stages |
| `--accent` | `#F5C542` | `#F5C542` | Featured badge, hero highlight |
| `--accent-ink` | `#3A2A00` | `#3A2A00` | Text on accent |
| `--danger` | `#B3261E` | `#FF8A80` | Form errors |

Dark mode works two ways: automatically from the system setting, and forced with `data-theme="dark"` or `"light"` on the root element. Keep both. Check contrast for every text and background pair; the values above were chosen for AA.

## Type

- **Display and logo:** Bricolage Grotesque, weights 500 to 800. Used for headings, the wordmark, numbers in the funnel, and card titles.
- **Body and UI:** Figtree, weights 400 to 600.
- **Scale:** h1 `clamp(2.1rem, 4.8vw, 3.5rem)`, line-height 1.04, tracking -0.025em. Section headings 1.375 to 1.5rem. Body 1rem, line-height 1.5. Small text 0.8125 to 0.9375rem.
- Self-host both fonts with `font-display: swap` and a system fallback stack.
- Line length under 80 characters for body text.

## Layout and shape

- Max content width 1200 px, side padding `clamp(16px, 4vw, 32px)`.
- Breakpoints: 860 px (hero stacks, filters collapse into a toggle), 720 px (header wraps, nav goes under the logo), 600 px (funnel bars use the narrow widths, table pins only the first column).
- Radii: pills 999px for buttons and chips, 12px for cards and inputs, 8px for funnel bars, 14 to 16px for dialogs and boards. Do not use one radius for everything.
- No drop shadows on cards. Borders carry the structure. The only shadow is the drawer's.
- Structural rules are used where they mean something: a 1.5px ink line under the toolbar, hairlines between list rows.

## Components

| Component | Notes |
|---|---|
| **Header** | Logo (mark plus wordmark), nav (Tools, Guides, Find my tools) with the current page marked `aria-current`, and Submit a tool. Not sticky. |
| **Hero** | h1 with the phrase "where your funnel leaks." highlighted like a marker stroke (`.hl`, accent at 62% in light and 30% in dark, lower 42% of the line). Lede with two bold phrases. Search field, popular searches, "Not sure where to start? Find my tools". |
| **Funnel selector** | Five buttons with `aria-pressed`. Selected is solid brand, visited is `--brand-soft`, others are surface with a border. Numbers and names in the display font. |
| **Buttons** | Primary (brand), soft (`--brand-soft`, bold, used for "See the N tools"), ghost (border only). 999px radius. |
| **Chips** | Small pills for stage and category. Stage chips are outlined, category chips are filled soft. |
| **Filters** | Fieldsets with checkboxes and faceted counts. |
| **View switch** | Segmented control with icons and labels: List, Grid, Table. |
| **List row** | Logo tile, name, "Featured" badge, tagline, chips, "Works with" text, price pill, save button. Whole row clickable through a stretched button. |
| **Card (grid)** | Logo tile, save button, name, two-line tagline, chips, price and setup. |
| **Table** | Sortable headers, pinned columns, row click. |
| **Details drawer** | Native `<dialog>`, 480 px wide, slides in from the right (full width on phones). |
| **Dialogs** | Submit a tool uses a native `<dialog>` with inline validation. |
| **Guides** | Text pages max 860 px wide with a "How we chose" box and a shortlist. Comparison pages have a table plus two "Best for" cards. |
| **Finder** | One question per screen, large answer buttons, thin progress bar. Results use numbered picks (the numbers are a real ranking). |
| **Custom-build card** | Surface card with a 4px brand left border. Always states that GTM Shelf is run by GPTify. |
| **Toast** | Bottom center, ink background. |

## Logos of tools

Use the vendor's logo in a rounded-square tile (52px in lists, 36px in tables, 64px in details). If none exists, show the first letter on a tile whose color is a hue derived from the name (`hsl(hue 52% 40%)`, white letter). Never hotlink.

## Motion

Only these, and all off under `prefers-reduced-motion: reduce`:
- Funnel bars grow in once on load (staggered 90 ms).
- One pulse on stage 2 after load, removed after the first interaction.
- The details drawer slides in (250 ms).
- Progress bar width transition.

No entrance animations on sections, no hover animations on every card.

## Accessibility rules

- Visible focus ring on everything (3px brand outline, 2px offset). Stretched-link rows show the ring on the row.
- Use native elements: `<dialog>`, `<button>`, `<a>`, `<label>`, `<table>` with `<th scope>`.
- Toggles use `aria-pressed`; sortable headers use `aria-sort`; counts and toasts use `aria-live="polite"`.
- Every form field has a real label and errors linked with `aria-describedby`; invalid fields get `aria-invalid`.
- Icon-only buttons have an `aria-label`.
- Do not rely on color alone: selected funnel stages also change fill and text color, saved tools also change the icon fill.

## Writing rules

- Sentence case everywhere.
- Buttons say what happens: "Send request", "Submit tool", not "Submit".
- Use the same word for the same action everywhere (Save, Saved).
- Empty and error states say what happened and what to do next.
- Never invent facts or claims about tools. If a fact has no source, it is not published.
