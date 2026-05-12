# Z-Cycle observe system (Z-CYCLE-OBSERVE-1)

**Purpose:** A **read-only observation tower** and **safe task queue** for the Z-Sanctuary ecosystem. Cursor AI Builder, Z-SSWS, AI Tower, overseers, Z-Lab, Cloudflare governance, AnyDevice, Doorway, Control-Link, and Crystal DNA can **see** current posture, coverage, and suggested next work — **without executing** queued tasks.

## Law

- **Read** registries and prior reports; **summarize** and **classify**; **suggest** tasks.
- **Write only** `data/reports/z_cycle_observe_status.json` and `data/reports/z_cycle_observe_status.md`.
- **Never** from this lane: deploy, git push, merge, install packages, start services, scan arbitrary PC folders, secrets, NAS mutation, real device connect, automatic file repair, or production Cloudflare changes.

**Turtle Mode:** This phase is an **observation tower and safe task organizer only**. It **must not** execute the task queue. Use `cursor/zsanctuary/` branches and one domain per PR for real changes elsewhere.

## Artifacts

| Artifact | Role |
| ------------------------------------------ | -------------------------------------------------------------------------------------- |
| `data/z_cycle_observe_task_policy.json` | Categories **L1**–**L5**, allowed/forbidden observer actions, output field names. |
| `scripts/z_cycle_observe_status.mjs` | Builds the observe report from inputs (no side effects except those two report files). |
| `data/reports/z_cycle_observe_status.json` | Machine-readable status, signals, coverage, and **task_queue** rows. |
| `data/reports/z_cycle_observe_status.md` | Short human summary. |

## Command

```bash
npm run z:cycle:observe
```

**Companion read-only rollup:** `npm run z:deployment:readiness` — writes only `z_deployment_readiness_status.{json,md}` (separate overseer); see [Z_DEPLOYMENT_READINESS_OVERSEER.md](Z_DEPLOYMENT_READINESS_OVERSEER.md).

## Inputs (read-only)

| Input | Use in observer |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `package.json` `scripts` | Discover **active verify / observe** npm script names (allowlisted filter). |
| `data/z_ecosystem_growth_stage_registry.json` | **Current ecosystem stage**, **sealed systems**, communication posture, feedback, turtle lanes. |
| `data/z_crystal_dna_asset_manifest.json` | **Crystal** shard count / coverage (registry paths only). |
| `data/z_anydevice_ai_capsule_registry.json` | AnyDevice policy presence check. |
| `data/z_anydevice_synthetic_devices.json` | Synthetic scenario **count** (fiction-only). |
| `data/z_satellite_control_link_manifest.json` | Satellite roster **count**. |
| `data/z_doorway_workspace_registry.json` | Doorway entry **count**. |
| `data/reports/z_traffic_minibots_status.json` | **Traffic** signal. |
| `data/reports/z_car2_similarity_report.json` | **CAR2** scan receipt. |
| `data/reports/z_crystal_dna_drift_report.json` | **Drift** rollup signal. |
| `data/reports/z_anydevice_simulation_report.json` | **AnyDevice** simulation summary. |

Missing optional reports produce **warnings** in JSON and do not crash the observer.

## Report contents (summary)

- **current_ecosystem_stage** — from growth registry.
- **sealed_systems** — same registry list (ids, labels, roles).
- **active_verify_scripts** — filtered npm script keys aligned to verify / observe receipts.
- **latest_report_signals** — compact rollup from the four report JSON files when present.
- **project_folder_coverage** — counts from **known registries only** (no disk walk).
- **ai_ecosystem_communication_posture** — `communication_rules` block from growth registry.
- **safe_autonomous_task_candidates** — task_ids in **L1** / safe **L2** (still operator/CI triggered, not “auto-run by observer”).
- **blocked_hold_blue_red_tasks** — summary rows for **L4**, **L5**, and non-GREEN signals where applicable.
- **next_recommended_turtle_mode_lanes** — growth registry lanes plus observer turtle hints.
- **task_queue** — each row includes: `task_id`, `title`, `category`, `source_system`, `signal`, `recommended_next_action`, `requires_human`, `forbidden_auto_actions`, `related_files`.

## Task categories (policy)

| Id | Meaning |
| ---------------------------- | -------------------------------------------------------------------- |
| L1_READ_ONLY_OBSERVE | Read and summarize only. |
| L2_REPORT_REFRESH | Allowlisted npm report refresh (e.g. `verify:md`, `z:traffic`). |
| L3_DOC_SYNC_PROPOSAL | Human doc/manifest alignment after drift or signals — no auto-apply. |
| L4_HUMAN_APPROVED_APPLY | Apply paths (e.g. control-link apply) — **AMK/human** gate. |
| L5_FORBIDDEN_WITHOUT_CHARTER | Must not automate without charter. |

## Related

| Doc | Role |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| [Z_ECOSYSTEM_GROWTH_STATUS.md](Z_ECOSYSTEM_GROWTH_STATUS.md) | Sealed growth stages and comms posture. |
| [Z_CYCLE_DASHBOARD_SYSTEM.md](Z_CYCLE_DASHBOARD_SYSTEM.md) | Z-CYCLE-DASHBOARD-1 read-only nervous system dashboard (UI only). |
| [AI_BUILDER_CONTEXT.md](AI_BUILDER_CONTEXT.md) | Primary AI Builder briefing. |
| [PHASE_Z_CYCLE_OBSERVE_1_GREEN_RECEIPT.md](PHASE_Z_CYCLE_OBSERVE_1_GREEN_RECEIPT.md) | Phase receipt. |
| [Z_DEPLOYMENT_READINESS_OVERSEER.md](Z_DEPLOYMENT_READINESS_OVERSEER.md) | Z-DEPLOYMENT-READINESS-OVERSEER-1 deployment posture rollup (read-only; separate reports). |
