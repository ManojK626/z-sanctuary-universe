# Z-IDE-FUSION-1 — Shared Workflow Control

**Goal:** Cursor IDE and VS Code/Copilot work from one shared evidence spine, not silent background autonomy.

This phase is coordination-only:

- docs
- registry JSON
- examples
- read-only validator reports
- AMK indicator metadata

No runtime IDE control, no backend bridge, no auto-launch, no deploy.

## Core model

1. Sessions declare themselves in local evidence files.
2. Sessions read the latest state reports before work.
3. Sessions write handoff notes after work.
4. AMK dashboard reflects coordination signal.

## Shared files

- `data/ide-fusion/active_sessions.json` (optional local)
- `data/ide-fusion/handoff_journal.jsonl` (optional local)
- `data/reports/z_ide_fusion_report.json`
- `data/reports/z_ide_fusion_report.md`

## Session law

- Confirm real repo root before action.
- Never use `.cursor/projects` as build root.
- Read latest reports before work.
- Write handoff after work.
- Respect forbidden actions.
- Escalate BLUE/RED to AMK.

## Handoff minimum fields

- what changed
- why it changed
- files touched
- commands run
- signal result
- rollback
- next recommended lane

## Signals

| Signal | Meaning | Action |
| ------ | --------------------------------------------------- | -------------------- |
| GREEN | Sessions aligned | Continue normal work |
| YELLOW | Advisory gap (missing handoff/stale optional state) | Quiet watch |
| BLUE | AMK decision required | Notify AMK |
| RED | Wrong root/unsafe conflict/forbidden lane | Stop |
| GOLD | Sealed baseline | Hold |
| PURPLE | Future-gated automation | Do not run |

## Future ladder

1. FUSION-1 read-only coordination
2. FUSION-2 dashboard panel
3. FUSION-3 handoff generator
4. FUSION-4 controlled local queue for L1/L2
5. FUSION-5 supervised auto-launch with AMK approval

## Locked law

```text
IDE fusion ≠ IDE remote control.
Shared handoff ≠ execution.
Shadow workspace ≠ deploy.
Active session ≠ permission.
Auto-launch remains future-gated.
GREEN ≠ deploy.
BLUE requires AMK.
RED blocks movement.
AMK-Goku owns sacred moves.
```

## Triple-check companion

Use [Z_SEC_TRIPLECHECK_COMMUNICATION_FLOW_AUDIT.md](Z_SEC_TRIPLECHECK_COMMUNICATION_FLOW_AUDIT.md) as the calm pre-lane audit to detect path confusion, report drift, indicator mismatches, and scope expansion before widening IDE lanes.
