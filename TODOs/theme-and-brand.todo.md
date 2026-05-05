# Theme and Brand

## Goal
Establish the visual identity of the new site by configuring real brand colors and typography in `src/lib/theme.ts`, replacing all design-system defaults with Noah Wright–specific values.

## Scope In
- Choose and commit final color palette (primary, secondary, foreground, background, confirm, danger)
- Light and dark mode token values
- Optional: typography overrides (font family via CSS variable if design system supports it)
- Update `src/lib/theme.ts` with final token values
- Any additional micro-style tweaks added as minimal global CSS rules only

## Scope Out
- Component-level visual polish (that belongs in individual page TODOs)
- Custom font loading with next/font (evaluate during this phase, implement only if needed)

## Dependencies
- design-system-integration.todo.md

## Tasks
- [ ] Decide final light-mode color palette — primary, secondary, background, foreground
- [ ] Decide dark-mode color palette (or defer dark mode entirely)
- [ ] Populate `src/lib/theme.ts` with final values
- [ ] Visual check: home page looks intentional in both light and dark system preference
- [ ] Decide on font strategy (system stack vs. custom font)
- [ ] If custom font: load via `next/font` and inject family token into theme
- [ ] Remove any remaining scaffold CSS classes from `page.module.css` (or delete the file)

## Verification
- Theme tokens appear in DevTools `:root` with correct values
- No scaffold placeholder colors remain in the rendered site
- Home page looks intentional at 375px, 768px, and 1280px viewport widths

## Done When
Visual identity is set, `src/lib/theme.ts` contains real values, and all placeholder-style defaults are gone.
