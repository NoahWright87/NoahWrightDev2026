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

## Update Rule

Keep notes short and factual. Update this file when a decision would matter to a new chat.