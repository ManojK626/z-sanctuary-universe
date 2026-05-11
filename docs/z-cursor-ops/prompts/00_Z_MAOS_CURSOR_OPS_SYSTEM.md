# 00 — Z-MAOS + Z-Cursor Ops alignment

## Status

`READY`

## Goal

Confirm the **ecosystem supervisor** (Z-MAOS) and this **Cursor Ops** folder tell the same story: orientation commands, consent posture, and no merge/deploy fiction.

## Context

- Z-MAOS charter: [docs/z-maos/Z_MAOS_CHARTER.md](../../z-maos/Z_MAOS_CHARTER.md)
- Cursor Ops index: [../README.md](../README.md)
- MAOS manifests: `tools/z-maos/`

## Dependencies

- None (bootstrap prompt).

## Strict rules

- **Docs and read-only checks only.** No registry JSON edits unless AMK asked for a specific correction in the same session.
- No dashboard feature work; optional: verify links still resolve (read paths only).

## Files to touch

- Prefer **none**. Optional: small cross-link from [../README.md](../README.md) to MAOS opening runbook if a link is missing (skip if already present).

## Acceptance criteria

- [ ] `npm run z:maos-status` exits 0 and output is understood (operator note in handoff).
- [ ] Operator can name the three MAOS npm commands and what they do **not** do (no merge/deploy/install).

## Verification commands

```bash
npm run z:maos-status
```

Optional (if time):

```bash
npm run z:maos-open
```

## Handoff response format

Use [../Z_HANDOFF_TEMPLATE.md](../Z_HANDOFF_TEMPLATE.md).

## Next linked task

When `DONE` → [01_Z_PROJECT_REGISTRY_REVIEW.md](01_Z_PROJECT_REGISTRY_REVIEW.md)
