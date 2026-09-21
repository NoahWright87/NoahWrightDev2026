# Resume Page

## Goal
A web resume built as a branching timeline showing the dual USAF/civilian career
and its overlap, plus a downloadable PDF.

## Status
The layout is **settled and shipped** at `/resume`. Eight prototypes were compared
over two rounds; the winner is now the page and the rest are deleted. Two things
are still outstanding, both content rather than design.

## Outstanding
- [ ] **Replace the placeholder content.** Everything in `src/lib/resume.ts` is
      invented — employers, dates, achievements, awards, degree. The home and
      About CTAs point here as Noah's real resume, so this must be done before
      the page is treated as live.
- [ ] **Add the PDF.** The "Download PDF" button points at
      `SITE.resumePdfUrl` (`/noah-wright-resume-2026.pdf`); the file is not in
      the repo yet, so the button 404s. Drop it at
      `public/noah-wright-resume-2026.pdf` (see `public/RESUME_PLACEHOLDER.md`).
      `netlify.toml` already forces `Content-Disposition: attachment` for `/*.pdf`.
- [ ] Test the download across desktop Chrome, desktop Safari or Firefox, and
      mobile Chrome once the file exists.
- [ ] Consider adding `/resume` to the Playwright visual suite
      (`tests/visual.spec.ts`) — it is not covered there. Note the timeline is
      scroll-driven, so a full-page screenshot will not capture it meaningfully;
      it needs a scroll-and-sample approach.

## Settled (do not revisit without a reason)
- One job on screen at a time; a concurrent job sits behind it as a tab, with the
  civilian role on top by default.
- The tree is drawn to scale — vertical distance is elapsed time — and a date
  rides the scroll marker.
- Colors carry the employer, so a promotion and a job change look different.
- Tapping a dot lands the marker on that dot with the job fully readable.
- Mobile keeps the pinned effect on a thin rail rather than falling back to a
  plain list.
- One viewport of scroll per job (chosen after trying faster and slower).
- The scroll marker, the line fill behind it, and the date label all track scroll
  position exactly — no easing, no settling after the scroll stops.

## Done When
`/resume` carries the real history, the PDF downloads correctly, and this file
can be deleted.
