# Agent Handoff Convention

This repository uses `MEMORY.md` at the root as the source of truth for cross-chat handoff context.

## Required Behavior For New Chat Sessions

1. Read `MEMORY.md` before making planning decisions.
2. Treat `MEMORY.md` as the canonical summary of durable project context.
3. Update `MEMORY.md` when significant decisions are made that future sessions should inherit.

## Related Docs

- `TODOs/README.md` for active task files and workflow
- `README.md` for high-level project status