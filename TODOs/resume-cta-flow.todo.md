# Resume CTA Flow (Deferred)

## Goal
Define and ship resume UX in two phases: publish a `/resume` page first, then add downloadable PDF support.

## Scope In
- `/resume` page with current resume content
- `SITE.resumeUrl` pointing to `/resume` in phase 1
- PDF export/upload in phase 2
- `Content-Disposition: attachment` support ready in Netlify for phase 2

## Scope Out
- Dynamic resume generation

## Dependencies
- home-page.todo.md

## Tasks
- [ ] Create `/resume` page with final content
- [ ] Update `SITE.resumeUrl` in `src/lib/site.ts` to `/resume`
- [ ] Verify home CTA routes correctly to `/resume`
- [ ] (Phase 2) Export resume as PDF — filename: `noah-wright-resume-2026.pdf`
- [ ] (Phase 2) Copy PDF to `public/noah-wright-resume-2026.pdf`
- [ ] (Phase 2) Update CTA to support direct download if desired
- [ ] (Phase 2) Test download: desktop Chrome, desktop Safari or Firefox, mobile Chrome
- [x] Add `[[headers]]` in `netlify.toml` for `/*.pdf` to force `Content-Disposition: attachment` if download attribute alone isn't sufficient

## Verification
- Phase 1: Clicking the home CTA opens `/resume`
- Phase 2: PDF download works across target browsers

## Done When
Phase 1 resume page is live; PDF flow can be enabled later without infrastructure changes.
