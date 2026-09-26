# Resume Page

## Goal
A web resume built as a branching timeline showing the dual USAF/civilian career
and its overlap, plus a downloadable PDF.

## Status
The layout is **settled and shipped** at `/resume`. Eight prototypes were compared
over two rounds; the winner is now the page and the rest are deleted. Real
content is in, transcribed from LinkedIn — what remains is content cleanup and
the PDF, not design.

## Outstanding
- [x] **Real content is in**, transcribed from LinkedIn (Sep 2026).
- [ ] **Fill in `usaf-trainee`** — no summary or highlights; it was cut off in
      the source screenshots and nothing was invented to fill it.
- [ ] **Remove the "*More to come*" bullet** from `signify-manager`, or finish
      the thought.
- [ ] **Decide the Signify overlap.** `signify-senior` runs to Sep 2025 while
      `signify-manager` starts Aug 2024, so the two overlap by a year on
      LinkedIn and therefore on the timeline. Transcribed as given.
- [ ] **Add the current role.** Noah noted LinkedIn is missing his latest one.
- [ ] **Fill out truncated skills.** LinkedIn hides most tags behind "+N
      skills", so each entry carries only the two or three that were visible.
- [ ] **Replace `RESUME_SUMMARY`** — the one line of prose not taken from the
      profile.
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
