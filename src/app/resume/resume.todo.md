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
- [ ] **Engineering Enablement wins.** `signify-enablement` is the current role
      and has only two bullets. It needs the team's results since Aug 2025,
      with numbers.
- [ ] **Fill in `usaf-trainee`** — no summary or highlights; it was cut off in
      the source screenshots and nothing was invented to fill it.
- [ ] **Confirm the Signify dates.** LinkedIn had `signify-senior` running to
      Sep 2025; it now ends at the Aug 2024 promotion, and the manager role is
      split at Aug 2025 into Scheduling & Optimization and Engineering
      Enablement.
- [ ] **Review `RESUME_SUMMARY`**, the one line of prose at the top.
- [ ] **Add the PDF.** The "Download PDF" button points at
      `SITE.resumePdfUrl` (`/noah-wright-resume-2026.pdf`); the file is not in
      the repo yet, so the button 404s. Drop it at
      `public/noah-wright-resume-2026.pdf` (see `public/RESUME_PLACEHOLDER.md`).
      `netlify.toml` already forces `Content-Disposition: attachment` for `/*.pdf`.
- [ ] Test the download across desktop Chrome, desktop Safari or Firefox, and
      mobile Chrome once the file exists.
- [ ] Two cards (`usaf-instructor`, `usaf-team-lead`) still overflow a 390px
      phone, by 130px and 100px, and scroll inside the pinned pane.

## Settled (do not revisit without a reason)
- Newest job first. Time runs *up* the rail, like `git log --graph`: the
  branch leaves the service lane below the CGI node, and Art Clem rises into
  the service lane.
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
  it.
- The scroll marker, the line fill behind it, and the date label all track scroll
  position exactly — no easing, no settling after the scroll stops.

## Done When
`/resume` carries the real history, the PDF downloads correctly, and this file
can be deleted.
