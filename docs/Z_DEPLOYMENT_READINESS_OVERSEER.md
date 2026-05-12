# Z-DEPLOYMENT-READINESS-OVERSEER-1

**Purpose.** A **read-only deployment-readiness overseer** for `Z_Sanctuary_Universe` that rolls up posture across **registry-known PC projects**, **hub module manifest rows**, verification script inventory, report freshness, Cloudflare contingency doctrine, dashboard registry receipts, documentation signals, AI Builder briefing alignment, Cycle Observe, AnyDevice simulation, Crystal DNA drift, Doorway / Control-Link manifests, and AMK dashboard indicators — **without** deploying, executing unsafe actions, or claiming production readiness.

## Law (non-bypass)

- **Do not** deploy or run Cloudflare production deploys.
- **Do not** mutate external services, connect real devices, or touch secrets.
- **Do not** scan arbitrary PC folders — only paths declared in `data/z_pc_root_projects.json` (and hub-relative files inside this repo).
- **Do not** auto-fix, auto-merge, or create autonomous agents.
- **Do not** treat percentages as certification; **do not** claim production readiness (96–100 band) from script output alone — that band is for **human / legal / security** signed posture outside this observer.

**Turtle Mode.** This overseer **recommends** readiness percentages, blockers, and safe task text; **AMK / human** chooses every build, merge, deploy, and external action.

## Artifacts

| Artifact | Role |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `docs/Z_DEPLOYMENT_READINESS_OVERSEER.md` | Doctrine (this file). |
| `docs/PHASE_Z_DEPLOYMENT_READINESS_OVERSEER_1_GREEN_RECEIPT.md` | Phase seal receipt. |
| `data/z_deployment_readiness_project_registry.json` | Overseer defaults and per-`project_id` overrides (`owner_overseer`, related docs). |
| `data/z_deployment_readiness_scoring_policy.json` | Readiness bands, seeds, ecosystem caps, confidence rules, automated score cap (95 — script never enters 96–100 alone). |
| `scripts/z_deployment_readiness_status.mjs` | Builds reports from registries + existing JSON receipts only. |
| `data/reports/z_deployment_readiness_status.json` | Machine-readable rollup + per-entity rows. |
| `data/reports/z_deployment_readiness_status.md` | Short human summary table. |

## Command

```bash
npm run z:deployment:readiness
```

## Inputs (read-only)

| Input | Use |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `data/z_pc_root_projects.json` | **Known project folders only** (deduped by `id`). Optional `package.json` probe **only** when a non-empty registry path exists on disk. |
| `data/z_module_manifest.json` | **Module status** rows (`ZStatus`, `ZLayer`, `ZOwner`). |
| `package.json` `scripts` | **Verification / observe** script inventory (filtered list). |
| `docs/AI_BUILDER_CONTEXT.md` mtime | **AI Builder awareness** freshness hint. |
| `docs/PHASE_*GREEN_RECEIPT.md` | **Docs readiness** — count + newest mtime. |
| `data/z_ecosystem_growth_stage_registry.json` | Sealed systems roster size (awareness spine). |
| `data/z_cloudflare_contingency_identity.json` | **Cloudflare posture** — contingency / preview framing (no tokens). |
| `data/z_satellite_control_link_manifest.json` | **Control-Link** satellite roster (`NAS_WAIT`, enabled counts). |
| `data/z_doorway_workspace_registry.json` | **Doorway** registry entry count. |
| `data/reports/z_cycle_observe_status.json` | **Cycle Observe** rollup + staleness. |
| `data/reports/z_pc_activation_receipt.json` | **PC activation** receipt presence. |
| `data/reports/z_crystal_dna_drift_report.json` | **Crystal DNA drift** signal. |
| `data/reports/z_anydevice_simulation_report.json` | **AnyDevice** synthetic simulation summary. |
| `data/reports/z_traffic_minibots_status.json` | **Traffic** posture. |
| `data/reports/z_dashboard_registry_verify.json` | **Dashboard readiness** verify receipt. |
| `data/reports/z_doorway_workspace_status.json` | **Doorway** read-only status signal (when present). |
| `data/reports/z_control_link_sync_report.json` | **Control-Link** sync report presence (optional). |
| `dashboard/data/amk_project_indicators.json` | **AMK indicators** — overseer doc cites overlay wiring (`z_deployment_readiness` dynamic overlay). |

## Entity output (per PC project or hub module row)

Each entity in `data/reports/z_deployment_readiness_status.json` includes:

- `project_id`, `project_name`, `path`, `owner_overseer`, `maturity_stage`, `readiness_percent`, `confidence_percent`, `deployment_status`, `blockers`, `next_safe_tasks`, `estimated_build_phase`, `required_human_gate`, `related_reports`, `related_docs`, plus `entity_kind` (`pc_project` | `hub_module`).

## Readiness bands (policy)

| Range | Label |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0–20 | seed / concept |
| 21–40 | early build |
| 41–60 | governed prototype |
| 61–80 | pilot candidate |
| 81–95 | release candidate |
| 96–100 | production-ready **only** after human / legal / security approval (never asserted by this script’s formulas alone; see `automated_readiness_cap` in scoring policy) |

## Related

| Doc | Role |
| -------------------------------------------------------------------------------- | ----------------------------------------- |
| [Z_ECOSYSTEM_GROWTH_STATUS.md](Z_ECOSYSTEM_GROWTH_STATUS.md) | Growth posture + verify bundle. |
| [Z_CYCLE_OBSERVE_SYSTEM.md](Z_CYCLE_OBSERVE_SYSTEM.md) | Observation tower + safe queue. |
| [Z_CYCLE_DASHBOARD_SYSTEM.md](Z_CYCLE_DASHBOARD_SYSTEM.md) | Read-only dashboard UI. |
| [AI_BUILDER_CONTEXT.md](AI_BUILDER_CONTEXT.md) | Builder briefing + verify bundle. |
| [AMK_PROJECT_INDICATORS_AND_GO_NO_GO.md](AMK_PROJECT_INDICATORS_AND_GO_NO_GO.md) | Indicator overlays and advisory Go/No-Go. |
