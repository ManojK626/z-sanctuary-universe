# 01 — Z project registry review

## Status

`READY`

## Goal

Produce a **read-only** snapshot of project/registry posture: PC-root roster presence, MAOS registry entries, and whether paths look external vs hub-local — without mutating registries.

## Context

- `data/z_pc_root_projects.json`
- `data/z_master_module_registry.json`
- `tools/z-maos/project_registry.json`
- [../Z_PROJECT_DEPENDENCY_MAP.md](../Z_PROJECT_DEPENDENCY_MAP.md)

## Dependencies

- [00_Z_MAOS_CURSOR_OPS_SYSTEM.md](00_Z_MAOS_CURSOR_OPS_SYSTEM.md) should be `DONE` or explicitly skipped by operator.

## Strict rules

- **No edits** to registries in this prompt unless AMK supplied a correction list in the same message.
- Do not add XL2 absolute paths to shared JSON without explicit operator action (local paths stay off shared commits per MAOS guidance).

## Files to touch

- None for default run. Handoff may **propose** edits as a numbered list for human apply.

## Acceptance criteria

- [ ] Confirmed `data/z_pc_root_projects.json` exists and parses (or documented missing).
- [ ] Noted MAOS `path_ok` semantics (`n/a (external)` vs present paths).
- [ ] Listed any **obvious** stale IDs as _candidates_ for human review (not auto-fixed).

## Verification commands

```bash
npm run z:maos-status
node scripts/z_registry_omni_verify.mjs
```

If the second command is too heavy for the session, note in handoff and run `npm run z:maos-status` only.

## Handoff response format

Use [../Z_HANDOFF_TEMPLATE.md](../Z_HANDOFF_TEMPLATE.md).

## Next linked task

When `DONE` → [02_Z_OPENING_CYCLE_PROMPTS.md](02_Z_OPENING_CYCLE_PROMPTS.md)
