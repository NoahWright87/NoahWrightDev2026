# Card: Add support for right-pinned image and footer actions

## Problem
The Card component in @noahwright/design does not currently support:
- Pinning an image to the right side of the card content (for a more visually appealing project card layout)
- A dedicated footer slot for right-aligned action buttons (e.g., "Live Site", "GitHub")

## Proposal
- Add an `image` or `media` prop to Card that allows an image (or any node) to be pinned to the right (or left) of the main content, with responsive layout support.
- Add a `footer` prop or slot for Card actions, with recommended alignment and spacing for button groups.
- Consider a layout prop (e.g., `layout="media-right"`) for common use cases.

## Context
See the current implementation in the portfolio site (src/components/pages/ProjectsPageClient.tsx) for a workaround using flexbox and manual layout. Native support in Card would simplify usage and ensure design consistency.

---

**Bonus:** Consider adding built-in support for button variants (ghost, solid, etc.) and icon support for action buttons in Card footers.
