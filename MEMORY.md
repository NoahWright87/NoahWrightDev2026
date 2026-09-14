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
  - Phase 1: `/resume` page exists as placeholder and is the current resume CTA destination.
  - Phase 2: downloadable PDF can be added later.
- Netlify is the deployment platform; `netlify.toml` is configured for Next.js plugin usage.
- Clarity integration is implemented in code and controlled by `NEXT_PUBLIC_CLARITY_ID`.
- Portfolio site direction is design-system-first:
  - The site is both Noah's engineer "business card" and primary showcase for `@noahwright/design`.
  - New UI/interaction "juice" should come from shared design-system capabilities where possible.
  - When major interaction/polish primitives are missing, open issues in the `design` repository and add them there instead of implementing one-off local CSS/JS behavior.
  - In progress: home page hero (rotating title, photo carousel, styled background/border) and the quick-nav-links-as-cards treatment were built as reusable `design` primitives (`Hero`, `TextCarousel`, `useTypewriter`/`usePrefersReducedMotion` atoms, `Carousel` `showControls`/`decorative` props; `Card`/`CardGrid` already existed) rather than one-off local code, per the rule above.
  - Release flow while `design` changes are unreleased: open a PR in `design` (triggers an ephemeral pre-release publish under an `pr-<N>` npm dist-tag, commented on that PR), pin this site's `@noahwright/design` dependency to that exact pre-release version in a PR here so Netlify builds a real deploy preview against it, then once the `design` PR is reviewed and merged (publishing the real version to npm), bump this site's dependency to that real version before merging this site's PR.
  - `design` PR #20 (Hero organism, TextCarousel, typewriter rework, mobile menu fix) merged and published the real `1.2.0` to npm; this site is re-pinned to `1.2.0` (no longer the `1.2.0-pr20.c0077c0` preview).

## Portrait Assets

- The original photograph and ten generated portrait styles live in `public/images/noah/`; that directory's README records provenance, filenames and art direction.
- The image-generation tool did not expose its exact backend model/version; do not invent an attribution.
- Home page hero now uses these as its rotating `Carousel` media (`HomePageClient.tsx`), replacing the earlier icon+label placeholder. Serves resized (max 600px) WebP derivatives from `public/images/noah/web/` rather than the full-resolution originals directly — the carousel mounts all slides at once (crossfade, not on-demand), so the raw ~17MB set would otherwise load eagerly on every visit. Regenerate `web/` (command in that folder's README) if a source portrait is ever replaced or added.
- The hero photo links to `/portraits` (a plain `<a>`, not the design system's `Link`, since it needs an `aria-label` the design-system component doesn't support — the carousel it wraps is `decorative`/aria-hidden, so without one the link would have no accessible name at all). That page lists all eleven portraits as `Card`s (style + short description) — content lives in `src/lib/portraits.ts`, and links out to `public/images/noah/README.md` on GitHub for anyone wanting the full generation notes/prompts.
- Portraits page copy is intentionally brief and informal (one short note that it's all ChatGPT-generated and that tinkering with his own profile picture is a small way Noah experiments with AI) — an earlier draft used long, clinical-sounding paragraphs (including an unflattering physical description of Noah) that read like unedited AI notes; don't reintroduce that tone. Each portrait's per-image `description` (in `portraits.ts`) is the one piece of longer copy that's meant to stay as-is.
- Cards on that page are not expandable — only the photo itself is interactive. Clicking it opens a lightbox (`PortraitLightbox` in `PortraitsPageClient.tsx`, a `createPortal` overlay, closes via Escape/backdrop/×) showing the full-resolution original (`fullImageSrc()` in `portraits.ts`, pointing at `public/images/noah/*.png`/`.jpg`, not the `web/` thumbnails) — loaded only on click, so unlike the hero carousel this doesn't need a resized derivative.

## Update Rule

Keep notes short and factual. Update this file when a decision would matter to a new chat.
