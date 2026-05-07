# QA and Accessibility

## Goal
Confirm the site is production-ready: responsive, accessible, and free of obvious functional defects across target devices.

## Scope In
- Responsive layout check at 375px (mobile), 768px (tablet), 1280px (desktop)
- Keyboard navigation smoke test for all interactive elements
- Screen reader landmark check (nav, main, footer)
- Heading order check (h1 > h2 > h3 — no skipped levels)
- Focus visible state on all interactive elements
- Color contrast spot-check on primary text and CTA buttons
- All external links open in new tab with `rel="noreferrer"`
- Production build lint pass (0 errors)

## Scope Out
- Full WCAG 2.1 AA audit (post-launch)
- Screen reader cross-browser testing (post-launch)
- Automated Lighthouse CI (post-launch)

## Dependencies
- All page TODOs completed
- netlify-deploy.todo.md

## Tasks
- [x] Run `npm run lint` — 0 errors
- [x] Run `npm run build` — 0 errors
- [ ] Responsive check: Home at 375/768/1280 — no overflow, no broken layout
- [x] Responsive check: Projects, About, Contact, History at 375px
- [x] Keyboard nav: Tab through Home — all interactive elements reachable and focusable
- [ ] Check heading order on each page with DevTools or browser extension
- [ ] Verify `<nav>` landmark wraps primary navigation in Header
- [ ] Verify `<main>` landmark wraps page content in Layout
- [ ] Verify `<footer>` landmark in Footer
- [ ] Color contrast check: primary button text on button background (target ≥ 4.5:1)
- [ ] Color contrast check: body text on background (target ≥ 4.5:1)
- [ ] Verify no `[PLACEHOLDER]` strings appear in any page at production URL
- [ ] Verify resume download works on live URL

## Verification
- 0 lint errors
- 0 build errors
- All breakpoint screenshots look intentional
- Tab order makes logical sense on all pages

## Done When
All tasks above pass. Site is ready to announce as live.
