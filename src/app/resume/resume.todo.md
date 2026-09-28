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
- [ ] **Consider shortening the long cards.** Four entries overflow a 390px
      phone and now scroll inside the pinned pane. That is honest but it costs
      the "one job, one screen" reading the design is built around; trimming the
      summaries and bullets would be the better fix if the content allows it.

## Deferred: newest job first

Noah would like the most recent position first. It isn't a list reversal: the
rail is drawn to scale with time running *down*, and several pieces assume it:

- `yearToFraction` maps older years to smaller y; flip it (`END - year`).
- `STOPS` is built from `ENTRIES_CHRONOLOGICAL`; reverse it.
- `buildRailPaths`: the branch leaves the service lane *above* its first node
  (`branchToY - span`) and is clamped against `topY`. Newest-first, it leaves
  *below* and is clamped against `bottomY`. This matches `git log --graph`,
  which is newest-first anyway.
- `mergeCurve` and the merge segment bend *down* into service (`endY - bend`);
  reverse both.
- The "passed" fill is a rect from y=0 to the marker, and dots count as passed
  when `y <= markerY`. Both still mean "already scrolled past", so they should
  hold. Check them anyway.

Then re-verify every behavior listed under "Settled" and in `MEMORY.md` at
390px and 1280px: marker/date with no easing, jump targets landing on dots,
tabs for concurrent jobs, clipped cards scrolling inside the pane.

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
- The track a job runs on is never named on screen. The rail and the colors
  already carry it; a "Track 2" label was tried and removed.
- A card taller than the pinned pane scrolls inside it rather than growing past
  it. Four of the ten do at 390px, by 47–471px.
- The scroll marker, the line fill behind it, and the date label all track scroll
  position exactly — no easing, no settling after the scroll stops.

## Done When
`/resume` carries the real history, the PDF downloads correctly, and this file
can be deleted.
