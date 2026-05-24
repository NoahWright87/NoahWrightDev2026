# Contact Page

## Goal
Finalize the contact page with real copy and confirmed working links. Launch target is link-only (no form).

## Scope In
- Real welcome/context sentence for visitors reaching out
- Email link (`mailto:`) pointing to correct address
- LinkedIn link pointing to correct profile
- Clear visual hierarchy (email is primary, LinkedIn is secondary or equal)

## Scope Out
- Contact form (post-launch)
- Calendly or scheduling link (post-launch)
- X/Twitter link (excluded in decision; add back only if desired)

## Dependencies
- foundation-setup.todo.md ✅
- design-system-integration.todo.md

## Tasks
- [x] Write real welcome message sentence(s)
- [x] Confirm `SITE.email` is correct
- [x] Confirm `SITE.linkedIn` is correct
- [x] Remove all `[PLACEHOLDER]` strings from `src/app/contact/page.tsx`
- [x] Test email link opens mail client correctly
- [x] Test LinkedIn button opens in new tab

## Verification
- No `[PLACEHOLDER]` text visible
- Both contact methods are functional
- Page renders correctly at mobile breakpoint

## Done When
Real copy is in place, both links work, and no placeholders remain.
