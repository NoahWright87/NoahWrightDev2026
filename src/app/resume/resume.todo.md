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
- [ ] **Numbers from Noah.** Still thin: `google` (no metrics) and
      `signify-senior` (two bullets).
- [ ] **Confirm the Enablement dashboard tracks DORA metrics and velocity** —
      worded that way at Noah's request for those keywords; the one-pager
      doesn't mention the dashboard.
- [ ] **Review `RESUME_SUMMARY`**, the one line of prose at the top.
- [ ] **PDF and site disagree on one figure.** The PDF says "Fixed 262
      security risks"; the site follows the Achievement Medal citation (190+
      critical vulnerabilities found, 72 coding flaws fixed). Worth matching on
      the next export.
- [ ] Recheck which cards overflow a 390px phone after each content pass.

## Ideas (not started)
- An interactive view of Noah's ribbon rack.

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
