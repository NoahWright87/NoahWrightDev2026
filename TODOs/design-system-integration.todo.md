# Design System Integration

## Goal
Ensure `@noahwright/design` styles, components, and theme utilities all load correctly in the Next.js App Router context with no runtime errors and no extra custom CSS workarounds.

## Scope In
- Confirm `@noahwright/design/dist/index.css` is imported in root layout and styles reach the browser
- Verify `buildThemeCss(theme)` outputs valid CSS and the `<style id="nw-theme">` tag is present in SSR output
- Confirm all components used across site pages render without console errors
- Add any `transpilePackages` or config workarounds needed for Next.js to handle the ESM package

## Scope Out
- Adding custom components beyond what the design system provides (build those in individual page TODOs if needed)
- Visual polish of the design system defaults (theme-and-brand.todo.md)

## Dependencies
- foundation-setup.todo.md ✅

## Tasks
- [x] Import `@noahwright/design/dist/index.css` in root layout
- [ ] Verify CSS actually reaches browser in dev mode (check DevTools for component class names like `nw-button`)
- [ ] Run `npm run build` — confirm no "can't resolve" or CSS import errors
- [ ] If ESM resolution errors occur, add `transpilePackages: ["@noahwright/design"]` to `next.config.ts`
- [ ] Confirm `<style id="nw-theme">` is present in page source (SSR injection working)
- [ ] Smoke-test each component type used site-wide: Header, Footer, Layout, Container, Heading, Text, Button, Link, Card, Pill, Menu, MenuItem, HamburgerMenu

## Verification
- DevTools shows design-system CSS classes on rendered elements
- No `Module not found` or ESM-related build errors
- Theme token CSS variables are present on `:root` in DevTools

## Done When
All pages render design-system components with no import/style errors in dev and production builds.
