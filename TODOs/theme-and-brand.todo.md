# Theme and Brand

## Goal
Finish the site's visual identity. The palette is settled: plum + burnt orange in both light and dark (`src/lib/theme.ts`). The logo is in (header on phones, favicon, iOS icon). Typography is what's left.

## Scope In
- Font strategy: keep the system stack, or pick a signature heading font

## Scope Out
- Changing the palette

## Dependencies
- NoahWright87/design#22: a font-family token in the design system, so every one of Noah's sites shares the choice

## Tasks
- [ ] Decide the font strategy (system stack vs. a signature heading font)
- [ ] If custom: set it through the design system's token (design#22), loaded via `next/font`, and drop the local `font-family` rule in `globals.css`

## Verification
- Headings render in the chosen font in light and dark mode at 390px and 1280px

## Done When
Typography is settled and live.
