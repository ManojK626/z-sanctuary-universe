# 02 — Z opening cycle prompts

## Status

`READY`

## Goal

Align daily operator **opening ritual** docs with Cursor Ops: MAOS open script, runbook section 5 (daily vs serious verify), and when to refresh AI Builder docs.

## Context

- [docs/z-maos/OPENING_CYCLE_RUNBOOK.md](../../z-maos/OPENING_CYCLE_RUNBOOK.md)
- `npm run z:maos-open` (optional `--write` per runbook)
- AI Builder refresh: `npm run z:ai-builder:refresh` (see [../../AI_BUILDER_CONTEXT.md](../../AI_BUILDER_CONTEXT.md))

## Dependencies

- [01_Z_PROJECT_REGISTRY_REVIEW.md](01_Z_PROJECT_REGISTRY_REVIEW.md) `DONE` or waived.

## Strict rules

- Do **not** pass `--write` to `z:maos-open` unless the operator asked for a local report file in this session.
- No changes to execution enforcer or release JSON.

## Files to touch

- None required. Optional doc tweak only if operator requests (single domain: `docs/z-maos/` **or** `docs/z-cursor-ops/`, not both in one go without approval).

## Acceptance criteria

- [ ] Operator can recite: daily → `z:maos-status`; serious → `verify:full:technical` when stakes warrant (per runbook).
- [ ] `npm run z:maos-open` runs without error (read-only path).

## Verification commands

```bash
npm run z:maos-open
```

## Handoff response format

Use [../Z_HANDOFF_TEMPLATE.md](../Z_HANDOFF_TEMPLATE.md).

## Next linked task

When `DONE` → [03_Z_EXTENSION_READINESS_PROMPTS.md](03_Z_EXTENSION_READINESS_PROMPTS.md)
