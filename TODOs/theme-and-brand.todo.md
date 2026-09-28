# Theme and Brand

## Goal
Finish the site's visual identity. Palette (plum + burnt orange), logo, and heading font (the design system's Wright Sans) are all in. What's left is moving off the design-system prerelease.

## Scope In
- Switching from the `@noahwright/design` PR #25 prerelease to its stable release

## Scope Out
- Changing the palette or fonts

## Dependencies
- NoahWright87/design PR #25 merged and published

## Tasks
- [ ] Replace `1.2.0-pr25.c1eb87c` in `package.json` with the stable version and reinstall
- [ ] Re-check headings, home cards and the phone menu after the switch

## Verification
- `npm run build` passes and the site looks unchanged from the prerelease

## Done When
The site depends on a stable `@noahwright/design` release.
