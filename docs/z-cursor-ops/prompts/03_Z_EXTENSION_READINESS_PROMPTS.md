# 03 — Z extension readiness prompts

## Status

`READY`

## Goal

Reconcile **extension/tool readiness doctrine** with operator behaviour: recommendations vs install, and where to look in-repo.

## Context

- [docs/z-maos/EXTENSION_AND_TOOL_READINESS.md](../../z-maos/EXTENSION_AND_TOOL_READINESS.md)
- Hub `.vscode/extensions.json` (if present)
- [docs/Z_SANCTUARY_BUILD_RULES.md](../../Z_SANCTUARY_BUILD_RULES.md)

## Dependencies

- [02_Z_OPENING_CYCLE_PROMPTS.md](02_Z_OPENING_CYCLE_PROMPTS.md) `DONE` or waived.

## Strict rules

- **Never** document or script “auto-install extensions” from hub prompts.
- Read-only review of `.vscode/` unless AMK approved an edit ticket.

## Files to touch

- None by default.

## Acceptance criteria

- [ ] Confirmed policy: recommend in `extensions.json`; install is manual / AMK consent.
- [ ] Listed which hub files are the source of truth for readiness messaging.

## Verification commands

```bash
npm run z:maos-status
```

Optional file check (PowerShell from hub root):

```powershell
Test-Path .vscode/extensions.json
```

## Handoff response format

Use [../Z_HANDOFF_TEMPLATE.md](../Z_HANDOFF_TEMPLATE.md).

## Next linked task

When `DONE` → next **READY** prompt when added; otherwise return to [../Z_MASTER_REQUIREMENTS_QUEUE.md](../Z_MASTER_REQUIREMENTS_QUEUE.md). **Do not** start prompt 04 until gate clears.
