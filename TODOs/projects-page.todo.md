# Projects Page

## Goal
Replace placeholder project data with real project entries and ensure the card grid renders correctly at all breakpoints.

## Scope In
- Real title, summary, tags, status, and links for each featured project
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
- [x] Replace scaffold project list with real featured projects
- [x] Add summaries, tags, and live/repo links for each project
- [x] Add project imagery and card layout updates
- [x] Remove all `[PLACEHOLDER]` strings from `src/app/projects/page.tsx` and `src/lib/projects.ts`
- [x] Write brief intro paragraph for the Projects page
- [x] Visual check: card grid at 375px, 768px, 1280px
- [x] Confirm external links open in new tab with safe rel attributes

## Verification
- No `[PLACEHOLDER]` text visible
- All project links work
- Cards render without overflow at mobile and desktop

## Done When
All active projects have real content and the page has no placeholder text.
