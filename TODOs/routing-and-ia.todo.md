# Routing and IA

## Goal
Confirm all launch routes exist, are reachable, and return correct HTTP status codes and metadata.

## Scope In
- 5 launch routes: `/`, `/projects`, `/about`, `/contact`, `/history`
- Each route has a unique `<title>` and `<meta name="description">`
- 404 page (Next.js default is acceptable for launch; custom 404 is post-launch)
- Footer and header nav are consistent across all pages
- History page includes link to previous site

## Scope Out
- Blog or posts routing (excluded at launch)
- Nested project routes or detail pages (card-depth only at launch)
- Custom 404 design (post-launch)

## Dependencies
- foundation-setup.todo.md ✅

## Tasks
- [x] `/` — Home page created
- [x] `/projects` — Projects page created
- [x] `/about` — About page created
- [x] `/contact` — Contact page created
- [x] `/history` — History page created
- [x] Confirm `/history` appears in footer or secondary nav (decide placement)
- [x] Verify each page has unique title and description metadata
- [x] Navigate all routes in dev mode — confirm no 404s or broken links
- [x] Confirm nav items in Header match the defined `NAV_ITEMS` in `src/lib/site.ts`
- [x] Smoke-test mobile nav (hamburger opens, links work, closes after tap)

## Verification
- Visiting each route returns a rendered page (not blank, not 404)
- Page titles show correctly in browser tab
- Mobile hamburger nav opens and is keyboard navigable

## Done When
All 5 routes render, metadata is unique per route, and nav is consistent at desktop and mobile widths.
