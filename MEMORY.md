# Project Memory

This file is the cross-chat handoff record for this repository.

## Purpose

Use this file to keep short, durable notes that help future chat sessions resume quickly.

## What To Store Here

- Current implementation decisions that should persist across chats
- Known constraints and non-obvious tradeoffs
- Deferred work and sequencing decisions
- Important environment/deploy assumptions

## Current Decisions

- Resume flow is phased:
  - Phase 1 (done): `/resume` is the web resume and the resume CTA destination.
  - Phase 2 (outstanding): the PDF itself still needs to be produced and committed.
- Resume is a **branching timeline** at `/resume`, not a flat job list: Noah had a dual career (USAF active duty, then USAF Reserve part-time alongside a full-time civilian job). The reference was the *look* of a git branch graph, not literal git semantics — that framing was explicitly rejected.
  - The design is **settled**. Eight prototypes (`/resume1`–`/resume8`) were compared over two rounds and then deleted; the winner is now the real page. Do not reopen the comparison.
  - Code lives in `src/components/resume/` (`ResumeTimeline`, `JobCard`, `scrollRail`, and their CSS). Content is `src/lib/resume.ts`.
  - Content in `src/lib/resume.ts` is **real**, transcribed verbatim from Noah's LinkedIn profile (Sep 2026). Four things carried over as-is and still want his pass, all noted in that file's header: `usaf-trainee` has no summary or highlights (cut off in the source); `signify-manager` still holds his "*More to come*" placeholder bullet; `signify-senior` (to Sep 2025) overlaps `signify-manager` (from Aug 2024) because LinkedIn has it that way; and LinkedIn truncates skill tags, so `skills` holds only the visible ones. `RESUME_SUMMARY` is the one piece of prose not from the profile.
  - The "Download PDF" button points at `SITE.resumePdfUrl` (`/noah-wright-resume-2026.pdf`). **That file is not in the repo yet** — see `public/RESUME_PLACEHOLDER.md`. The button 404s until it is added.
  - How it behaves: the tree pins to the left for the whole section, a marker tracks scroll position and the lanes fill in behind it, and one job at a time fades in beside it. The tree is drawn to scale, so vertical distance is elapsed time and a date rides the marker. Pacing is one viewport of scroll per job.
  - Concurrent jobs are handled by **stacking with tabs**: the stop's own job is on top (so the civilian role wins through the overlap) and anything running alongside sits behind as a tab. This works because reserve service is dated slightly *before* the first civilian job, so the reserve stop finds nothing running yet and stands alone while each civilian stop picks it up as a tab.
  - Jobs are **colored by employer**: one flat blue for all Air Force service, then a hue per civilian employer with a shade per role within it — so a promotion reads as a shade change and a new company as a hue change. Values live in `job-colors.css` with light and dark variants; the rail is drawn in per-job segments to carry it. The palette covers five employers and three roles each, and `jobColorVar` clamps to that — a sixth employer silently reuses the fifth's hue, so widen the palette rather than letting two companies share a color.
  - The real career is **not a single fork**: civilian work (2008–2011) came first, merged into service when he enlisted, then forked again in 2020 into Reserve plus civilian. So rail segments span each job's own start and end rather than running node to node — otherwise a lane would draw straight through years when he held no job on it. A civilian job ending exactly when service begins draws a merge curve back into the service lane, mirroring the fork.
  - Four behaviours that are easy to regress:
    - Crossfading *text* needs staggered ramps, not a true cross-dissolve — two cards at 50% opacity superimposed is unreadable mush. `scrollRail.ts` fades the outgoing card out before the incoming one rises.
    - The scroll marker and its date label must have **no CSS transition**. They are readouts of scroll position; a transition makes them chase every frame, lagging during a scroll and gliding to catch up after it stops.
    - The marker interpolates across a stop's *whole* slice (`fade.local`), not just the crossfade band. Tying it to the band parks it on a node for most of the slice and then sprints — the same "waits then jumps" bug from a different cause.
    - Jump targets land the marker exactly *on* a job's dot; the card is readable there because the crossfade finishes slightly earlier in the previous slice (`SETTLE` in `scrollRail.ts`). Dot tap targets are sized from the measured gap between lanes, since two jobs starting weeks apart sit only pixels apart on a to-scale rail. On a phone that gap is small, so the tab strip rather than the dots is the practical way to reach a concurrent job.

## Layout Gotchas

- `globals.css` uses `overflow-x: clip` (not `hidden`) on `html, body`. Both stop horizontal overflow, but `hidden` makes the element a scroll container — it also forces `overflow-y` to `auto` — which silently breaks `position: sticky` for every descendant on the page. This was found when a pinned pane refused to pin despite a computed `position: sticky`. Do not change it back to `hidden`; verified with no horizontal overflow on any route at 1280px and 390px.

## Portrait Assets

- The original photograph and ten generated portrait styles live in `public/images/noah/`; that directory's README records provenance, filenames and art direction.
- The image-generation tool did not expose its exact backend model/version; do not invent an attribution.
- Home page hero now uses these as its rotating `Carousel` media (`HomePageClient.tsx`), replacing the earlier icon+label placeholder. Serves resized (max 600px) WebP derivatives from `public/images/noah/web/` rather than the full-resolution originals directly — the carousel mounts all slides at once (crossfade, not on-demand), so the raw ~17MB set would otherwise load eagerly on every visit. Regenerate `web/` (command in that folder's README) if a source portrait is ever replaced or added.
- The hero photo links to `/portraits` (a plain `<a>`, not the design system's `Link`, since it needs an `aria-label` the design-system component doesn't support — the carousel it wraps is `decorative`/aria-hidden, so without one the link would have no accessible name at all). That page lists all eleven portraits as `Card`s (style + short description) — content lives in `src/lib/portraits.ts`, and links out to `public/images/noah/README.md` on GitHub for anyone wanting the full generation notes/prompts.
- Portraits page copy is intentionally brief and informal (one short note that it's all ChatGPT-generated and that tinkering with his own profile picture is a small way Noah experiments with AI) — an earlier draft used long, clinical-sounding paragraphs (including an unflattering physical description of Noah) that read like unedited AI notes; don't reintroduce that tone. Each portrait's per-image `description` (in `portraits.ts`) is the one piece of longer copy that's meant to stay as-is.
- Cards on that page are not expandable — only the photo itself is interactive. Clicking it opens a lightbox (`PortraitLightbox` in `PortraitsPageClient.tsx`, a `createPortal` overlay, closes via Escape/backdrop/×) showing the full-resolution original (`fullImageSrc()` in `portraits.ts`, pointing at `public/images/noah/*.png`/`.jpg`, not the `web/` thumbnails) — loaded only on click, so unlike the hero carousel this doesn't need a resized derivative.

## Update Rule

Keep notes short and factual. Update this file when a decision would matter to a new chat.
