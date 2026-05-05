# Resume CTA Flow

## Goal
Ensure the resume PDF is in place, the CTA on the home page works end-to-end, and the download experience is clean in both desktop and mobile browsers.

## Scope In
- Resume PDF file uploaded to `public/` with versioned filename
- `SITE.resumeUrl` pointing to correct file
- Download button on home page uses `download` attribute
- `Content-Disposition: attachment` served correctly by Netlify for the PDF

## Scope Out
- Resume page (no hosted HTML resume at launch)
- Dynamic resume generation

## Dependencies
- home-page.todo.md

## Tasks
- [ ] Export resume as PDF — filename: `noah-wright-resume-2026.pdf`
- [ ] Copy PDF to `public/noah-wright-resume-2026.pdf`
- [ ] Confirm `SITE.resumeUrl` in `src/lib/site.ts` matches filename exactly
- [ ] Confirm home page `<Button as="a" href={SITE.resumeUrl} download>` renders a real `<a download>` tag in the HTML
- [ ] Test download: desktop Chrome, desktop Safari or Firefox, mobile Chrome
- [ ] Add `[[headers]]` in `netlify.toml` for `/*.pdf` to force `Content-Disposition: attachment` if download attribute alone isn't sufficient

## Verification
- Clicking the button on home page downloads the correct PDF file
- Mobile browsers prompt to download or open the PDF
- Downloaded file is not corrupted

## Done When
Resume PDF downloads correctly on the primary CTA from the home page.
