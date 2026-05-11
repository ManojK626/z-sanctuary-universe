# Sandbox Capability Envelope

Purpose:

- Keep the sandbox useful while the system is in a controlled pause.
- Preserve strict separation from core until explicit NAS-ready bridge approval.

## Operating State

- `paused_pending_nas_sync`
- New phase expansion is frozen.
- Existing guard/report flow remains active.

## Allowed Operations

- Load manually exported snapshots.
- Run deterministic simulations in sandbox only.
- Generate sandbox-only reports and deltas.
- Run guard scripts and refresh reports.
- Update sandbox docs/manifests with explicit audit notes.

## Forbidden Operations

- No writes to core runtime or core data lanes.
- No module registration in core registries.
- No auto-bridge or background sync to core.
- No route wiring into production dashboard.
- No hidden coupling across sandbox/core boundaries.

## Human Bridge Requirements

- Manual export/import only.
- Explicit owner approval before any promotion.
- Bridge protocol doc update required before enabling any sync lane.
- Guard validation must be green at the same timestamp as bridge decision.
