# Home Page

## Goal
Replace all `[PLACEHOLDER]` content on the home page with real, final copy and confirm the recruiter-focused layout and resume CTA work end-to-end.

## Scope In
- Real hero heading (name + positioning line)
- Real 2–3 sentence personal pitch
- Resume CTA button pointing to correct PDF in `public/`
- LinkedIn secondary CTA pointing to correct profile URL
- Quick-nav links to /projects, /about, /contact
- Page-level OG metadata (image if available)

## Scope Out
- Blog/posts section
- Animated hero or scroll-reveal effects (post-launch)
- Profile photo (add only if available and sized correctly)

## Dependencies
- foundation-setup.todo.md ✅
- design-system-integration.todo.md
- theme-and-brand.todo.md
- resume-cta-flow.todo.md

## Tasks
- [ ] Write final hero heading (name + role/positioning line)
- [ ] Write final 2–3 sentence personal pitch for SITE.description and page body
- [ ] Upload resume PDF to `public/` with versioned filename (e.g., `noah-wright-resume-2026.pdf`)
- [ ] Update `SITE.resumeUrl` in `src/lib/site.ts` to correct filename
- [ ] Confirm LinkedIn URL is correct in `SITE.linkedIn`
- [ ] Update `SITE.email` if needed
- [ ] Remove all `[PLACEHOLDER]` strings from `src/app/page.tsx`
- [ ] Test Download Resume button — file downloads correctly in browser
- [ ] Test LinkedIn button — opens correct profile in new tab
- [ ] Check home page renders well at 375px, 768px, 1280px

## Verification
- No `[PLACEHOLDER]` text visible in browser
- Resume PDF downloads on button click
- LinkedIn opens correct profile
- Page renders without layout overflow at all test breakpoints

## Done When
Home page has real copy, resume CTA works end-to-end, and no placeholder text remains.
