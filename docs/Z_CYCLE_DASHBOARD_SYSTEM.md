# Z-Cycle Dashboard — read-only ecosystem nervous system (Z-CYCLE-DASHBOARD-1)

**Mission:** A **strictly read-only** operational dashboard layer that reduces operator overload by visualizing ecosystem health, observer signals, safe task queues, growth stages, coordination context, and **Turtle Mode governance posture** — **without** becoming a control plane.

## Governance law (mandatory)

The dashboard **MUST NOT**:

- execute tasks, apply fixes, or launch scripts automatically
- create branches, deploy, or mutate registries
- rewrite docs or perform autonomous actions
- become a control plane or gain execution authority

It **MAY**:

- visualize, aggregate, observe, and assist **prioritization** in the UI only (human still runs commands outside this page).

**AMK / human** remains sacred authority for merge, deploy, NAS-class moves, and all execution.

## Artifacts

| Artifact | Role |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `dashboard/panels/z-cycle-dashboard-readonly.html` | Standalone read-only panel (open via local HTTP server or file protocol where fetches work). |
| `dashboard/scripts/z-cycle-dashboard-readonly.js` | **GET** JSON only: `z_cycle_observe_status.json` plus optional direct reads for receipts. |
| `dashboard/styles/z-cycle-dashboard-readonly.css` | Presentation only. |
| `data/z_cycle_dashboard_manifest.json` | Machine pointer to panel paths and law summary (`z_cycle_dashboard_manifest_v1`). |
| `data/reports/z_deployment_readiness_status.json` | Optional supplemental **deployment-readiness** rollup (Z-DEPLOYMENT-READINESS-OVERSEER-1) for same-origin GET when wired in UI. |

## Data flow

1. Operator refreshes reports from the hub (e.g. `npm run z:pc:activation`, `npm run z:cycle:observe`, `npm run z:deployment:readiness`, `npm run z:traffic`, …).
2. Dashboard **reads** `data/reports/z_cycle_observe_status.json` as the **primary bundle** (stage, sealed systems, rollup signal, embedded `latest_report_signals`, coverage counts, `task_queue`, turtle lanes).
3. **Refresh data** on the page repeats **GET** only — it does not run npm or write files.

**BLUE** `overall_observer_signal` in the observe report means **informational / governed awareness**, not “dashboard failed.”

## Turtle Mode

Use **`cursor/zsanctuary/…`** branches for real changes; one domain per PR. This dashboard is **UI + visibility only** — not a branch factory.

## Related

| Doc | Role |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| [Z_CYCLE_OBSERVE_SYSTEM.md](Z_CYCLE_OBSERVE_SYSTEM.md) | Observation tower and safe task queue source. |
| [PHASE_Z_CYCLE_DASHBOARD_1_GREEN_RECEIPT.md](PHASE_Z_CYCLE_DASHBOARD_1_GREEN_RECEIPT.md) | Phase receipt. |
| [AI_BUILDER_CONTEXT.md](AI_BUILDER_CONTEXT.md) | AI Builder briefing (includes sealed systems table). |
| [Z_DEPLOYMENT_READINESS_OVERSEER.md](Z_DEPLOYMENT_READINESS_OVERSEER.md) | Z-DEPLOYMENT-READINESS-OVERSEER-1 read-only deployment posture rollup (separate JSON/MD reports). |
