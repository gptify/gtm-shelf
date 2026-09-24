# QA checklist

Run this on a preview deployment, then again on production. Tick every box or write down why not.

## Functional
- [ ] Home loads with Attract selected and its tools listed
- [ ] Every stage button works; visited stages get the tint; "Next stage" and "See the N tools" work
- [ ] Clicking the selected stage clears it; "Show all stages" works
- [ ] Search finds tools by name, tagline, category, and integration; typing clears the stage
- [ ] Every filter works; counts match the results; Clear all resets everything
- [ ] List, Grid, and Table views show the same tools; the view survives a reload
- [ ] Table sorting works both ways, keyboard included; sort dropdown matches
- [ ] Details panel opens from every view, from a row click, and from the finder; Escape closes it; focus returns
- [ ] Save toggles everywhere and the Saved count is right; Saved-only filter works
- [ ] Share a filtered URL to a new tab and the same state loads
- [ ] Tool, stage, category, guide, and static pages all load with real URLs
- [ ] Finder: all five goals, the "not sure" path, "None of these fit", Back button, restart
- [ ] Finder results match `docs/03_FINDER_SPEC.md` scenarios (with the sample data)
- [ ] Custom build form: validation, prefill from finder, prefill from search, success state, admin email arrives
- [ ] Submit a tool form: validation, duplicate check, success state, appears in the admin queue only
- [ ] "Email my picks": confirmation email arrives, link works once, picks email follows, unsubscribe works
- [ ] Outbound links go through `/out/[slug]` and record a click
- [ ] Draft and pending tools never appear anywhere public (pages, search, sitemap, finder)

## Data
- [ ] Every published tool has `verified_at` and source URLs
- [ ] Each category has at least 6 published tools
- [ ] No sample data is published
- [ ] Logos load and are the right ones; fallbacks look right
- [ ] Sponsored tools show the label and use `rel="sponsored"`

## Accessibility
- [ ] Keyboard only: every action possible, focus always visible, no traps
- [ ] Screen reader spot check: headings, landmarks, dialogs, table headers, live regions
- [ ] Color contrast passes AA in light and dark
- [ ] Reduced motion turns off all animation
- [ ] 200 percent zoom and 400 percent reflow work

## Responsive and browsers
- [ ] 390 px, 768 px, 1280 px, 1920 px: no sideways page scroll
- [ ] Table scrolls inside its container on phones
- [ ] Latest Chrome, Safari, Firefox, Edge; iOS Safari; Android Chrome
- [ ] Dark mode on every page

## Performance and SEO
- [ ] Lighthouse 90 or more (performance, accessibility, best practices, SEO), mobile
- [ ] Titles, descriptions, canonicals, and Open Graph images on every page type
- [ ] Sitemap and robots.txt correct; preview deployments are noindex
- [ ] Structured data validates (Google Rich Results test)
- [ ] No console errors; no broken links (crawl the site once)

## Security and privacy
- [ ] Anonymous requests cannot read draft data, leads, requests, or events (test with the anon key)
- [ ] Service role key is not in any client bundle
- [ ] Honeypot and Turnstile work; rate limit blocks the sixth request in an hour
- [ ] No email addresses in logs or analytics events
- [ ] CSP header set and the site still works
- [ ] Legal pages are live and linked in the footer

## Email
- [ ] SPF, DKIM, DMARC pass (check with a mail tester)
- [ ] Emails render in Gmail, Outlook, and a phone client
- [ ] Unsubscribe link works and the postal address is present
