# P1 Execution Plan

Generated: 2026-02-13T18:14:51Z  
Selected item: `P1-001` — **Stabilize recurring dashboard warnings**

## Scope (single-lane only)

- Target area: `dashboard/` and `core/` panel/overlay warning surfaces.
- Allowed change type: micro-fixes only (visibility, overlap, stale warning rendering, warning noise).
- Not allowed in this lane:
  - new modules
  - refactors outside dashboard warning path
  - behavior expansion beyond warning stabilization

## Entry gate (must pass before edits)

- [ ] `npm run lint`
- [ ] `npm test`
- [ ] `node scripts/z_hygiene_cycle.mjs`
- [ ] `python scripts/z_ssws_verify.py`

## Implementation checklist

1. [ ] Reproduce warning states in dashboard (`warn`, `quiet`, `trust certificate`, panel overlays).
2. [ ] Fix highest-visibility issue first:
   - overlay collision on panel text
   - unreadable panel title labels
   - repeated warning chips not clearing on calm state
3. [ ] Keep changes localized to dashboard warning files only.
4. [ ] Re-run entry gate commands.
5. [ ] Refresh reports:
   - `node scripts/z_pending_audit.mjs`
   - `node scripts/z_hygiene_cycle.mjs`
   - `python scripts/reports_vault_refresh.py`
6. [ ] Mark completion:
   - `node scripts/z_priority_queue.js done P1-001`
   - `node scripts/z_priority_audit.mjs`

## Exit criteria

- No recurring warning overlap in target panels.
- No stale warning badge after calm/quiet state refresh.
- Lint/test/hygiene all green.
- Priority queue reflects `P1-001` as done.

## Notes

- This plan is intentionally narrow to preserve Zuno Stability Hold posture.
- If a fix requires non-local refactor, stop and raise as new P1 item (do not branch in this lane).
