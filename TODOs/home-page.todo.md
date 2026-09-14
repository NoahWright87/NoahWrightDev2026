# Home Page

## Goal
Replace all `[PLACEHOLDER]` content on the home page with real, final copy and confirm recruiter-focused layout and CTAs.

## Scope In
- Real hero heading (name + positioning line)
- Real 2–3 sentence personal pitch, static regardless of which rotating title shows
- Hero CTA: single "My Projects" button to /projects; Resume and LinkedIn reachable via the card group / Contact page instead of hero buttons
- Quick-nav links to /projects, /about, /resume, /contact as a card group
- Page-level OG metadata (image if available)

## Scope Out
- Blog/posts section

## Dependencies
- theme-and-brand.todo.md
- resume-cta-flow.todo.md

## Tasks
- [x] Write final hero heading (name + role/positioning line)
- [x] Write final 2–3 sentence personal pitch for SITE.description and page body
- [ ] (Later) Build `/resume` page and route resume CTA there
- [ ] (Later) Add downloadable PDF after resume page is finalized
- [x] Confirm LinkedIn URL is correct in `SITE.linkedIn`
- [x] Update `SITE.email` if needed
- [x] Remove all `[PLACEHOLDER]` strings from `src/app/page.tsx`
- [ ] (Later) Test resume CTA end-to-end once `/resume` exists
- [x] Test LinkedIn button — now lives on the Contact page rather than the hero; opens correct profile in new tab
- [x] Check home page renders well at 375px, 768px, 1280px
- [x] Hero title rotates through several taglines with a typewriter animation (via `design`'s `TextCarousel`)
- [x] Hero CTA is a single "My Projects" button routing to `/projects`
- [x] Rotating photo carousel beside the hero text now uses real portraits (`public/images/noah/`, ten AI-generated style variations plus the original) with per-image alt text
- [x] Hero has a distinguishing background tint and gradient bottom border (via `design`'s `Hero` `background`/`bottomBorder` props)
- [x] Quick-nav links to /projects, /about, /resume, /contact are now a card group (via `design`'s `Card`/`CardGrid`)

## Verification
- No `[PLACEHOLDER]` text visible in browser
- Resume CTA points to intended destination (`/resume` first, PDF later)
- LinkedIn opens correct profile
- Page renders without layout overflow at all test breakpoints

## Done When
Home page has real copy, CTA paths are intentional, and no placeholder text remains.
