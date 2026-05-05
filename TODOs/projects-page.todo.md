# Projects Page

## Goal
Replace placeholder project data with real project entries and ensure the card grid renders correctly at all breakpoints.

## Scope In
- Real title, summary (1–2 sentences), tags, status, and link for each project
- At minimum: Level Up Learning, Let's Make a Program, Games Done Wright
- Add/remove projects as needed
- Card depth only — no detail/case-study pages at launch

## Scope Out
- Full case studies or dedicated project routes
- GitHub API auto-fetch (manual data file only)
- Project filtering or search

## Dependencies
- foundation-setup.todo.md ✅
- design-system-integration.todo.md

## Tasks
- [ ] Write real summary for Level Up Learning
- [ ] Write real summary for Let's Make a Program
- [ ] Write real summary for Games Done Wright
- [ ] Confirm/update `href` and `hrefLabel` for each project
- [ ] Add any additional projects to `src/lib/projects.ts`
- [ ] Remove all `[PLACEHOLDER]` strings from `src/app/projects/page.tsx` and `src/lib/projects.ts`
- [ ] Write brief intro paragraph for the Projects page
- [ ] Visual check: card grid at 375px, 768px, 1280px
- [ ] Confirm external links open in new tab with `rel="noreferrer"`

## Verification
- No `[PLACEHOLDER]` text visible
- All project links work
- Cards render without overflow at mobile and desktop

## Done When
All active projects have real content and the page has no placeholder text.
