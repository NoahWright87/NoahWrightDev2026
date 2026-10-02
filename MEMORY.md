# Project Memory

This file is the cross-chat handoff record for this repository.

## Purpose

Use this file to keep short, durable notes that help future chat sessions resume quickly.

## What To Store Here

- Current implementation decisions that should persist across chats
- Known constraints and non-obvious tradeoffs
- Deferred work and sequencing decisions
- Important environment/deploy assumptions

## Site Direction (Sep 2026 review with Noah)

- **Audience is balanced**: fast credibility for recruiters/hiring managers, with projects and personality one click away. The site is his online business card, portfolio, and side-project showcase.
- **Whimsy = voice + easter eggs.** Pages stay clean and professional; personality lives in copy and discoverable surprises (Doors 97 blue-screen 404, Konami code, console greeting). Don't turn the site itself into a toy.
- **Palette is plum + burnt orange in both light and dark** (`src/lib/theme.ts`).
- **Lean on `@noahwright/design`** so Noah's sites look alike. When something belongs in the design system, file an issue in `NoahWright87/design` and keep only a small, commented local workaround here that names the issue.
- **Hero taglines** are to be reworked *with* Noah; don't rewrite them unilaterally. The session is parked mid-draft: the findings, the rules and the latest draft are in `TODOs/hero-taglines.todo.md`.
- **Writing section: maybe later.** Don't build it, but don't design it out.
- The work plan is five batches: (1) bug fixes, (2) business-card essentials (inline desktop nav with Resume, hero rewrite and second CTA, footer contact links, GitHub on Contact, og:image), (3) real project screenshots, resume PDF and current role, (4) whimsy pack, (5) tagline session.

## Current Decisions

- Resume flow is phased:
  - Phase 1 (done): `/resume` is the web resume and the resume CTA destination.
  - Phase 2 (done): `public/noah-wright-resume.pdf`, exported from Noah's one-page Google Doc. Undated filename, replaced in place on each update; downloads as `Noah-Wright-Resume.pdf`. **Export it without the phone number**: Noah agreed the public file shouldn't carry it.
- Resume is a **branching timeline** at `/resume`, not a flat job list: Noah had a dual career (USAF active duty, then USAF Reserve part-time alongside a full-time civilian job). The reference was the *look* of a git branch graph, not literal git semantics — that framing was explicitly rejected.
  - The design is **settled**. Eight prototypes (`/resume1`–`/resume8`) were compared over two rounds and then deleted; the winner is now the real page. Do not reopen the comparison.
  - Code lives in `src/components/resume/` (`ResumeTimeline`, `JobCard`, `scrollRail`, and their CSS). Content is `src/lib/resume.ts`.
  - Content in `src/lib/resume.ts` is **real**. The source of truth for facts *and voice* is Noah's one-page resume, a Google Doc titled "Noah Wright Resume (Sept 2026)", with LinkedIn as the fallback. His style: terse, number-first, strong verbs, "&" and "⇒" are fine, no narrative. The page may run a little longer than the one-pager but must stay punchy — "not a damn novel". **Never invent a metric**, and leave out implementation details (e.g. which AI tool or infrastructure runs the agents). Titles follow the one-pager where it differs from LinkedIn. The 2011 trainee months are folded into `usaf-programmer`, as on the one-pager.
  - **Newest job first.** `yearToFraction` maps today to the top, and `STOPS` is built from `ENTRIES_NEWEST_FIRST`. Colors and concurrency are still computed oldest-first (`ENTRIES_CHRONOLOGICAL`), so hues don't depend on reading order.
  - **Milestones** (`RESUME_MARKERS`: awards, degrees, training, certs) are grouped by date (`MILESTONE_GROUPS`, gap ≤ 0.45 yr), and each group is drawn as **one node with a count**, on a short git-style branch to the **outside** of its job's lane (away from the other lane). One diamond per item was tried and rejected: on a to-scale rail the six 2015–16 items bled together, and branches between the lanes looked odd. Year labels sit on the rail's right edge; on a wide rail the left 64px (`READOUT_GUTTER`) is reserved for the date riding the marker so it never covers a node.
  - **The stage is two fixed slots** (job 3fr, milestone 2fr) that never resize, and **both are the same component**, `TabbedSlot` (`src/components/resume/TabbedSlot.tsx`): a tab strip over a card. The slots differ only in position and which card they render. Building them as two separate implementations was a mistake Noah called out; keep them one component. Behaviour: the tab strip is always shown, even with one tab, and stays put while the card changes. Cards **crossfade in place with no sliding**, staggered (out, then in) and time-based rather than scroll-driven. Tabs fade and slide in and out, and their neighbours ease aside (spacing is a margin so a leaving tab takes its space with it). A hidden slot fades out keeping its last content. The milestone slot is blank when nothing is near (Noah's choice). Tab strips are one row and scroll sideways, keeping the selected tab in view.
  - Noah's guidance on milestone copy: brief, decoded for civilians (USAF courses get a one-line "what this is"), official citations win over LinkedIn on facts, and civilianized names (e.g. "Team of the Quarter") are fine. He doesn't remember the Lt Gen Harold Grant award in his AFCM citation, so it is deliberately not listed.
  - Award citations live in `public/documents/` with the signing-official DoD ID / special-order footer **redacted** (true removal, not an overlay); see that folder's README. The summary lists under the timeline (education, skills) were removed at Noah's request; the PDF is the summary.
  - How it behaves: the tree pins to the left for the whole section, a marker tracks scroll position and the lanes fill in behind it, and one job at a time fades in beside it. The tree is drawn to scale, so vertical distance is elapsed time and a date rides the marker. Pacing is one viewport of scroll per job.
  - Concurrent and neighbouring jobs are tabs in the job slot: the stop's own job is selected by default, and any job within 3 months of the scroll date (`NEARBY_YEARS`) gets a tab, so a concurrent posting or the next/previous job is one click away.
  - Jobs sit on **numbered tracks**, not named lanes. `ResumeEntry.track` is a number (1 is the leftmost line); there is no "service"/"civilian" concept in the model, so another concurrent job just goes on the next track. The geometry still draws two tracks — the model generalises, the rail drawing would need a pass for a third.
  - The track number is **internal only and never rendered**. Naming it ("Track 2") on the card and the tabs was tried and rejected: the rail's two lines and the per-job colors already say which job is on which, and the label only invites the reader to wonder what a track is. Don't reintroduce it. `full-time` is likewise never shown — it is the default and says nothing — while `part-time` is, since that is what lets a job share a stretch of the timeline.
  - Jobs are **colored by color group**: a hue per group, a shade per role within it, so a promotion reads as a shade change and a move to a new company as a hue change. A group is the employer by default; `ResumeEntry.colorGroup` overrides it where one employer appears under several names (the Air Force entries share one group so active duty → Reserve does not read as changing companies). Values live in `job-colors.css` with light and dark variants; the rail is drawn in per-job segments to carry it. The palette covers six groups; only groups needing a fourth shade define one, and `jobColorVar`'s fallback drops back to the group's own base color rather than the theme primary, so an extra role never shows up as an unrelated hue.
  - Time runs **up** the rail. The branch leaves the service lane **below** the first node of the new lane (slightly earlier in time) and arrives at that node from underneath, the way `git log --graph` reads. Curving away at the node's own height instead leaves the dot sitting over a line that starts beside it, so the new lane looks like it appears from nowhere. The dot still sits exactly on its date.
  - The real career is **not a single fork**: civilian work (2008–2011) came first, merged into service when he enlisted, then forked again in 2020 into Reserve plus civilian. So rail segments span each job's own start and end rather than running node to node — otherwise a lane would draw straight through years when he held no job on it. A civilian job ending exactly when service begins draws a curve rising into the service lane, mirroring the fork.
  - Four behaviours that are easy to regress:
    - Crossfading *text* needs staggered ramps, not a true cross-dissolve — two cards at 50% opacity superimposed are unreadable mush. `TabbedSlot`'s card fade does out-then-in.
    - The scroll marker and its date label must have **no CSS transition**. They are readouts of scroll position; a transition makes them chase every frame, lagging during a scroll and gliding to catch up after it stops.
    - The marker interpolates across a stop's *whole* slice (`fade.local`), not just the crossfade band. Tying it to the band parks it on a node for most of the slice and then sprints — the same "waits then jumps" bug from a different cause.
    - Each stop's slice is that job's **own stretch of time**: the marker runs from the newer job's dot (or today) down to this job's dot. So the scroll date is always inside the job whose card is up, which is what pairs milestones with the right job. The card handover is centred on the slice boundary (`CARD_LAG` in `scrollRail.ts`); running it earlier, as the old `SETTLE` did, showed a job's card up to a year into the next job's dates. Jumps land just past the handover (`LAND_OFFSET`). Dot tap targets are sized from the measured gap between lanes, since two jobs starting weeks apart sit only pixels apart on a to-scale rail.
    - Sizes must be **capped, not content-sized**, all the way down, or a tall card stretches its slot and moves the other one: `.rt__sticky` has `grid-template-rows: minmax(0, 1fr)`, the stage `minmax(0, 3fr) minmax(0, 2fr)`, and `.ts__cards` `minmax(0, 1fr)`. Each was an implicit `auto` row at some point and silently grew to fit content (a 764px pane once had a 1206px row on a phone). The card then scrolls inside its slot.

## Layout Gotchas

- `globals.css` uses `overflow-x: clip` (not `hidden`) on `html, body`. Both stop horizontal overflow, but `hidden` makes the element a scroll container — it also forces `overflow-y` to `auto` — which silently breaks `position: sticky` for every descendant on the page. This was found when a pinned pane refused to pin despite a computed `position: sticky`. Do not change it back to `hidden`; verified with no horizontal overflow on any route at 1280px and 390px.

- The dark theme block from `buildThemeCss` must use `:root[data-theme="dark"]`. The design system's own dark defaults use that selector, so a bare `[data-theme="dark"]` loses on specificity and dark mode silently shows the design system's navy/blue instead of the site palette.
- Easter eggs live in `src/components/EasterEggs.tsx` (mounted by `SiteShell`): a console greeting, and the Konami code rains portraits for 6s (reduced motion keeps only the toast). The hero photo also shows a "psst… N more of me" hover hint pointing at /portraits.
- The 404 (`src/app/not-found.tsx`) is a Doors 97 blue screen; any key except Tab/modifiers goes home. Its fixed blue/grey colors are deliberate, not missed theme tokens.

- The header uses `Header`'s `left`/`right` slots (logo/name left; `MobileNav` + theme toggle right). Since design PR #25, slots without a tooltip aren't `position: relative`, so the phone dropdown spans the full header, and `aria-current="page"` links are styled by the design system.
- Depends on `@noahwright/design` **1.3.0** (exact pin), which shipped the fixes for design#21 (CardGrid height), #22 (font tokens + Wright Sans headings) and #23 (MobileNav). The site's local workarounds for those were removed, so don't downgrade below 1.3.0. Card titles render as `h3` by default; pages whose cards sit directly under the `h1` (Projects, History, Portraits) pass `titleAs="h2"` so heading levels aren't skipped.
- Headings use the design system's Wright Sans via `--font-family-heading`; body text uses its system stack. Don't set `font-family` on `body` locally.

## Site History

- `/history` renders `src/lib/siteHistory.ts`: only versions that **launched** (this site; the 2021–2023 Jekyll blog, now at 2023.noahwright.dev, repo NoahWright87/NoahWrightDev). Noah explicitly doesn't want the never-launched rebuilds (NoahWrightDev-React, -Next, -Redux) listed.

## Icons

- Email, LinkedIn and GitHub icons are Font Awesome's free icons (the LinkedIn and GitHub marks are the official brand marks), rendered as plain inline SVG by `components/icons/FaIcon.tsx`, without Font Awesome's React runtime or its global CSS. The earlier hand-drawn ones were replaced because the LinkedIn one read as "im".

## Logo

- Noah's avatar logo (silhouette, collar, tie, glasses) lives as path data in `src/lib/logo.ts`, with its embedded C2PA metadata stripped. It is painted from the theme, not fixed colors: silhouette = secondary, collar = secondary mixed 55% with background, tie = primary, glasses = background. `components/Logo.tsx` + `logo.css` do this with live CSS variables; `app/icon.tsx` (SVG favicon, with a `prefers-color-scheme` swap) and `app/apple-icon.tsx` (180px PNG on the light background) compute the same colors from `theme.ts`.
- The header shows the logo **at every width**, with the name beside it on wider screens (>768px, the MobileNav breakpoint); on phones the name stays in the link's accessible text. Noah asked for the logo to always be there (it used to be phones-only). The old `favicon.ico` was the create-next-app default and was deleted.

## Project Screenshots

- `public/images/projects/{id}/{1..3}.webp` are real captures made by running each project locally (the live sites were blocked by the build environment's network policy). Provenance and how to replace them are in that folder's README; per-image alt text lives in `src/lib/projects.ts`.

## Portrait Assets

- The original photograph and ten generated portrait styles live in `public/images/noah/`; that directory's README records provenance, filenames and art direction.
- The image-generation tool did not expose its exact backend model/version; do not invent an attribution.
- Home page hero now uses these as its rotating `Carousel` media (`HomePageClient.tsx`), replacing the earlier icon+label placeholder. Serves resized (max 600px) WebP derivatives from `public/images/noah/web/` rather than the full-resolution originals directly — the carousel mounts all slides at once (crossfade, not on-demand), so the raw ~17MB set would otherwise load eagerly on every visit. Regenerate `web/` (command in that folder's README) if a source portrait is ever replaced or added.
- The hero photo links to `/portraits` (a plain `<a>`, not the design system's `Link`, since it needs an `aria-label` the design-system component doesn't support — the carousel it wraps is `decorative`/aria-hidden, so without one the link would have no accessible name at all). That page lists all eleven portraits as `Card`s (style + short description) — content lives in `src/lib/portraits.ts`, and links out to `public/images/noah/README.md` on GitHub for anyone wanting the full generation notes/prompts.
- Portraits page copy is intentionally brief and informal (one short note that it's all ChatGPT-generated and that tinkering with his own profile picture is a small way Noah experiments with AI) — an earlier draft used long, clinical-sounding paragraphs (including an unflattering physical description of Noah) that read like unedited AI notes; don't reintroduce that tone. Each portrait's per-image `description` (in `portraits.ts`) is the one piece of longer copy that's meant to stay as-is.
- Cards on that page are not expandable — only the photo itself is interactive. Clicking it opens a lightbox (`PortraitLightbox` in `PortraitsPageClient.tsx`, a `createPortal` overlay, closes via Escape/backdrop/×) showing the full-resolution original (`fullImageSrc()` in `portraits.ts`, pointing at `public/images/noah/*.png`/`.jpg`, not the `web/` thumbnails) — loaded only on click, so unlike the hero carousel this doesn't need a resized derivative.

## Update Rule

Keep notes short and factual. Update this file when a decision would matter to a new chat.
