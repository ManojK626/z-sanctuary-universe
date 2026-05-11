# 05 — Z-Creator Orchestra generator lite

## Status

`BLOCKED`

## Goal

Future: optional **generator lite** for Creator Orchestra artefacts — requires charter: scope, safety class, and whether it touches products or public surfaces.

## Context

- [docs/Z-CREATOR-ORCHESTRA.md](../../Z-CREATOR-ORCHESTRA.md) (if present in tree)

## Dependencies

- Written charter + `REVIEW_NEEDED` → `READY` transition recorded in [../Z_TASK_STATUS_BOARD.md](../Z_TASK_STATUS_BOARD.md).

## Strict rules

- **FORBIDDEN_NOW:** codegen that implies payments, health, gambling, or deploy hooks.
- No new npm scripts that call network without hub approval.

## Files to touch

- None while `BLOCKED`.

## Acceptance criteria

- N/A until unblocked.

## Verification commands

```bash
npm run z:maos-status
```

## Handoff response format

Use [../Z_HANDOFF_TEMPLATE.md](../Z_HANDOFF_TEMPLATE.md).

## Next linked task

When unblocked → split into smaller READY prompts (docs vs scripts) with separate acceptance.
