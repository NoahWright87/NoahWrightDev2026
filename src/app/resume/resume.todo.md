# Resume Page

## Goal
Ship a web resume built as a branching timeline that shows the dual USAF/civilian career and its overlap, then add PDF export/download support in a later phase.

## Current Phase — pick a layout
Throwaway prototypes are live and linked from `/resume`. They all render the same
fake data (`src/lib/resumeDemo.ts`) so only the presentation differs.

### Round 2 — pinned tree, one job at a time
Combines Branch Rail's tree with Metro Map's single-focus detail, driven by scroll.
Each carries an in-page pace control (snappy / standard / cinematic).

| Route | Name | Idea |
|---|---|---|
| `/resume6` | Pinned Rail | Strictly one job per stop, even through the overlap |
| `/resume7` | Dual Focus | Identical, but splits into two cards through the overlap |
| `/resume8` | Time Reel | To-scale tree; scroll maps to a year, so concurrency falls out of the model |

### Round 1 — the original five
| Route | Name | Idea |
|---|---|---|
| `/resume1` | Branch Rail | Graph in a narrow rail, content in one column at every width; sticky minimap doubles as jump nav |
| `/resume2` | Parallel Tracks | Two real columns with a year spine; overlapping roles share a row |
| `/resume3` | Time Scrubber | Horizontal axis, segment width is real duration, detail panel below |
| `/resume4` | Metro Map | Schematic transit diagram with a 45° interchange; map holds still, detail swaps |
| `/resume5` | Quiet Spine | Restrained; glance strip up top, then three chapters with collapsed details |

## Settled
- Mobile keeps the pinned effect on a thin rail rather than falling back to a plain list.
- Scroll pacing is tunable in-page instead of being guessed up front.

## Tasks
- [x] Build round 1 layout prototypes against placeholder data
- [x] Build round 2 pinned/scroll-driven prototypes
- [ ] Pick a direction (or a hybrid) from the five
- [ ] Rebuild the winner as a reusable primitive in the `design` repo (per the design-system-first rule in `MEMORY.md`)
- [ ] Replace `resumeDemo.ts` with real resume content
- [ ] Delete `/resume1`–`/resume8`, `src/lib/resumeDemo.ts`, and `src/components/pages/resume-variants/`
- [ ] Restore `/resume` to the real resume page and confirm the home/About CTAs still land correctly
- [ ] Decide if CTA should stay on `/resume` or switch to direct PDF download
- [ ] (Phase 2) Add versioned PDF to `public/`
- [ ] (Phase 2) Wire download button and verify browser behavior

## Open Questions
- Does the USAF track end cleanly, or should it visually rejoin the civilian track?
- Does education want its own track, or stay a marker on an existing one?
- Is the web view canonical with a separate plain PDF, or should the PDF mirror the timeline?

## Done When
The `/resume` page has final content on the chosen layout, the prototype routes are gone,
and the CTA strategy is finalized.
