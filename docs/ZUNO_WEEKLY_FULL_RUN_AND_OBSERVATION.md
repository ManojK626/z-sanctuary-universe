# Zuno + AMK — weekly full run and observation (7-day window)

## Purpose

After **material hub upgrades** (for example Z-SSWS-DOOR-1, Z-SSWS-LAB-1, indicator overlays, or doc/registry churn), run a **7-day observation window**: same commands on a steady rhythm so **you and Zuno** build a clear picture from **reports and JSON**, not from memory. This is **read-only posture** unless you explicitly open a fix lane.

## Law

```text
Observation ≠ auto-fix.
Report RED ≠ npm failure.
Full run ≠ deploy.
Zuno JSON follows human-edited truth — refresh snapshots when doctrine moves.
AMK-Goku owns sacred moves.
```

## Daily rhythm (~5–12 minutes)

Run from **hub root** (`Z_Sanctuary_Universe`). Order is intentional: **doorway → workspaces → spine → traffic → strategy rollup → optional Zuno**.

| Step | Command | What to glance at |
| ---- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 1 | `npm run amk:doorway:status` | `data/reports/amk_workspace_doorway_status.md` — paths, BLUE/YELLOW |
| 2 | `npm run amk:workspace:profiles` | `data/reports/amk_cursor_workspace_profiles_report.md` — cockpit vs deep split |
| 3 | `npm run z:ssws:requirements` | `data/reports/z_ssws_launch_requirements_report.md` — launch metadata only |
| 4 | `npm run z:traffic` | `data/reports/z_traffic_minibots_status.md` — **overall_signal** may be RED while exit code is still 0; read _why_ in the MD |
| 5 | `npm run z:amk:strategy` | `data/reports/z_amk_gtai_strategy_report.md` — council brief before next lane |
| 6 | Optional | `npm run z:car2` after large doc edits |
| 7 | Optional | `npm run zuno:snapshot` if you changed `docs/z_zuno_technology_snapshot.md` |

**Note:** `z:traffic` can exit **0** and still write **RED** in JSON — the script completed; the **tower** is telling you to inspect a lane before treating the week as “all green.”

## Twice in the week (deeper, ~20–45 minutes)

Pick **mid-week** and **end-week** (same local machine, hub root):

| Pass | Commands | Intent |
| ---- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| A | `npm run verify:md` | Markdown + table hygiene |
| B | `npm run dashboard:registry-verify` | Dashboard / indicator wiring |
| C | `npm run z:ecosystem:awareness` | Optional — if you touched cross-project capsules |
| D | `npm run z:api:spine` | Optional — if API registry moved |
| E | `npm run verify:full:technical` | **Only** when you want depth **without** the execution enforcer first gate (see [AGENTS.md](../AGENTS.md)); skip if `manual_release` blocks you |

Do **not** treat a long verify as “production shipped” — it is **evidence for Zuno and you**.

## What to log (lightweight)

Keep a **single note** (paper, Obsidian, or `data/reports/` scratch you manage outside git if you prefer not to commit):

| Day | Date | Doorway signal | Workspace profiles signal | Traffic signal | One sentence insight |
| --- | ---- | -------------- | ------------------------- | -------------- | -------------------- |

After 7 days, one paragraph answers: _What stayed stable? What flickered YELLOW/RED? What deserves a chartered fix slice?_

## Zuno alignment

- **Structured truth:** `npm run zuno:snapshot` after you change the technology snapshot MD.
- **Coverage / phase plan:** `npm run zuno:coverage`, `npm run zuno:phase3-plan` when registry or modules moved (see [AI_BUILDER_CONTEXT.md](AI_BUILDER_CONTEXT.md)).
- **State report:** `npm run zuno:state` when you want a fresh `data/reports` style pass (per existing hub scripts).

Zuno does not replace **your** judgment on RED/BLUE — it **compresses** evidence so the next session starts warm.

## Related

- [AMK_CURSOR_WORKSPACE_STRATEGY.md](AMK_CURSOR_WORKSPACE_STRATEGY.md) — LAB-1 cockpit
- [AMK_WORKSPACE_DOORWAY.md](AMK_WORKSPACE_DOORWAY.md) — DOOR-1 doorway
- [Z_TRAFFIC_MINIBOTS.md](Z_TRAFFIC_MINIBOTS.md) — traffic tower semantics
- [Z_AMK_GTAI_STRATEGY_COUNCIL.md](Z_AMK_GTAI_STRATEGY_COUNCIL.md) — Z-AMK-GTAI-1 strategy council rollup
- [docs/Z-SANCTUARY-VERIFICATION-CHECKLIST.md](Z-SANCTUARY-VERIFICATION-CHECKLIST.md) — full completions posture (when you run a formal pass)
