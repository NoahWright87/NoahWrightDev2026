# Home Page

## Goal
Replace all `[PLACEHOLDER]` content on the home page with real, final copy and confirm recruiter-focused layout and CTAs.

## Scope In
- Real hero heading (name + positioning line)
- Real 2–3 sentence personal pitch
- Resume CTA strategy (resume page first; PDF deferred)
- LinkedIn secondary CTA pointing to correct profile URL
- Quick-nav links to /projects, /about, /contact
- Page-level OG metadata (image if available)

## Scope Out
- Blog/posts section
- Animated hero or scroll-reveal effects (post-launch)
- Profile photo (add only if available and sized correctly)

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
- [x] Test LinkedIn button — opens correct profile in new tab
- [x] Check home page renders well at 375px, 768px, 1280px

## Verification
- No `[PLACEHOLDER]` text visible in browser
- Resume CTA points to intended destination (`/resume` first, PDF later)
- LinkedIn opens correct profile
- Page renders without layout overflow at all test breakpoints

## Done When
Home page has real copy, CTA paths are intentional, and no placeholder text remains.
