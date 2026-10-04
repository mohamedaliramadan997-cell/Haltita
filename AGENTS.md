# Agent instructions: حالتيتا (Haltita)

This file is the entry point for AI coding tools other than Claude Code (which reads `CLAUDE.md`). The rules are the same.

Before any task, read in this order:

1. `docs/rules.md`: how to work, architecture, security, libraries and content rules
2. `docs/memory.md`: current status, decisions (ADRs) and the session log
3. `docs/tasks.md`: the next unchecked task

Then consult, as needed:

- `docs/prd.md`: scope and game rules (implement exactly)
- `docs/architecture.md`: structure, data, security, cloud and CI/CD
- `docs/design.md`: visual style, theme tokens and copy tone (for any UI work)

Key rules:

- One task from `docs/tasks.md` at a time, on its own branch `t/T-0xx-slug`.
- When done: run `npm run typecheck`, `npm run lint` and `npm test`; tick the task; add a session entry to `docs/memory.md`.
- Don't change the tech stack, folder structure, game rules or design tokens without asking the owner. If a change is agreed, update the owning doc and log an ADR in `docs/memory.md`.
- `src/content/content.json` is read-only. Never edit, translate or invent game content.
- Fixes: give exact find-and-replace instructions, not full-file rewrites.
