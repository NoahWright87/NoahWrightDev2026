# Foundation Setup

## Goal
Establish a runnable Next.js App Router project with the design system installed, the global stylesheet in place, and a first build passing.

## Scope In
- Next.js App Router scaffold with TypeScript and ESLint
- React 18 + compatible Next.js version (aligned to design system peer deps)
- `@noahwright/design` installed as a prod dependency
- Minimal `globals.css` that defers all tokens to the design system
- Root `layout.tsx` that injects theme tokens via `buildThemeCss(theme)` at SSR time
- `src/lib/theme.ts` — typed site-level theme overrides file
- `src/lib/site.ts` — shared site constants (name, email, LinkedIn, resume URL)
- `src/lib/projects.ts` — manually curated project data schema + placeholder entries
- `netlify.toml` — basic build configuration
- `next.config.ts` — bare config with no custom webpack unless needed

## Scope Out
- Actual brand colors/fonts (theme-and-brand.todo.md)
- Page-level content and routing (routing-and-ia.todo.md)
- Analytics scripts (analytics-clarity.todo.md)

## Dependencies
- None — this is the first phase

## Tasks
- [x] Scaffold Next.js App Router with TypeScript at repo root
- [x] Align React/Next.js to React 18 peer requirements
- [x] Install `@noahwright/design`
- [x] Replace scaffold `globals.css` with minimal design-system-first reset
- [x] Update `layout.tsx` with SSR theme injection and site metadata defaults
- [x] Create `src/lib/theme.ts`
- [x] Create `src/lib/site.ts`
- [x] Create `src/lib/projects.ts`
- [x] Create `netlify.toml` with build command
- [ ] Add resume PDF placeholder to `public/` (or document where it should be placed)
- [ ] Run `npm run build` — confirm 0 errors
- [ ] Run `npm run lint` — confirm 0 errors

## Verification
- `npm run build` exits with code 0 locally
- `npm run lint` exits with 0 errors/warnings
- `localhost:3000` renders with design-system header/footer on home page

## Done When
Build passes, lint passes, and home page renders with design-system components in dev mode.
