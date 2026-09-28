# Theme and Brand

## Goal
Finish the site's visual identity. The palette is settled: plum + burnt orange in both light and dark (`src/lib/theme.ts`). Typography is what's left.

## Scope In
- Font strategy: keep the system stack, or pick a signature heading font
- A site logo (header + favicon) once Noah provides the SVG

## Scope Out
- Changing the palette

## Dependencies
- NoahWright87/design#22: a font-family token in the design system, so every one of Noah's sites shares the choice

## Tasks
- [ ] Decide the font strategy (system stack vs. a signature heading font)
- [ ] If custom: set it through the design system's token (design#22), loaded via `next/font`, and drop the local `font-family` rule in `globals.css`
- [ ] Add the logo to the header (mobile) and use it as the favicon

## Verification
- Headings render in the chosen font in light and dark mode at 390px and 1280px
- The favicon shows in the browser tab, and the logo shows in the phone header

## Done When
Typography and logo are settled and live.
