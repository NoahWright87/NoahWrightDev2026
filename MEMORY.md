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

## Update Rule

Keep notes short and factual. Update this file when a decision would matter to a new chat.