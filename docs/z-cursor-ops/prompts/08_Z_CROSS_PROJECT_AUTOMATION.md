# 08 — Z cross-project automation

## Status

`BLOCKED`

## Goal

Future: automation that spans **multiple repos** (Organiser, XL2, hub) — highest coupling risk; requires MAOS + coupling charter + consent matrix alignment.

## Context

- [docs/z-maos/CROSS_PROJECT_LINKING_POLICY.md](../../z-maos/CROSS_PROJECT_LINKING_POLICY.md)
- [docs/z-maos/Z_MAOS_CHARTER.md](../../z-maos/Z_MAOS_CHARTER.md)

## Dependencies

- Approved coupling charter for any repo pair affected.
- `REVIEW_NEEDED` → `READY` with file-scoped prompt split.

## Strict rules

- **FORBIDDEN_NOW:** cross-repo file sync bots, shared secrets, unified merge bots, “auto route PRs” across products.
- XL2 remains **reference-only** in Z-Sanctuary automation until XL2↔hub charter exists.

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

When unblocked → create **one repo per prompt** child tasks; never mix domains in one autonomous run.
