# Z-SDC Existing Organ Map

**Gate:** Z-SANCTUARY-STEWARD-DIAGNOSTIC-CORE-0 (Z-SDC) Phase 0
**Posture:** Architecture / observer doctrine only · **no runtime**
**Date:** 2026-08-20
**Hub root inspected:** `C:\Cursor Projects Organiser\Z_Sanctuary_Universe`
**Branch (writing):** `cursor/zsanctuary/z-sdc-phase-0-architecture`
**Law:** Prefer CONSUME / LINK / EXTEND over duplication · Z-SDC does not own projects

**Z-SDC action legend:** `CONSUME` · `LINK` · `LEAVE_ALONE` · `DEFER` · `NEVER_DUPLICATE`

---

## A. Identity & citizenship registries

| Name                      | Canonical path                                | Purpose                      | Source of truth | R/W today          | Project scope | Ecosystem        | Governance                  | Runtime authority | Future Z-SDC data                         | Z-SDC action       |
| ------------------------- | --------------------------------------------- | ---------------------------- | --------------- | ------------------ | ------------- | ---------------- | --------------------------- | ----------------- | ----------------------------------------- | ------------------ |
| PC-root projects          | `data/z_pc_root_projects.json`                | Organiser folder citizenship | Hub registry    | Steward/docs edits | Per row       | Full roster (22) | Canonical control root      | None (data)       | id, path, role, hosting, notes, migration | **CONSUME** (read) |
| Universe project registry | `data/z_universe_project_registry.json`       | Census / MC citizenship      | Hub             | Steward            | Census        | Yes              | Separate plane from PC-root | None              | citizenship rows                          | **CONSUME**        |
| Universe ID map           | `data/z_universe_id_map.json`                 | Stable ZSU IDs               | Hub             | Rare Steward       | ID keys       | Yes              | Immutable reuse forbidden   | None              | stable keys                               | **LINK**           |
| Family AI registry        | `data/z_family_ai_registry.json`              | Companion / human identities | Hub             | Steward            | Named AIs     | Yes              | Docs-only identity          | None              | AI roles/status                           | **CONSUME**        |
| Module manifest           | `data/z_module_manifest.json`                 | Module IDs                   | Hub             | Sync tasks         | Modules       | Hub              | ACN/MTEH                    | Sync scripts      | module list                               | **LINK**           |
| Master module registry    | `data/z_master_module_registry.json`          | Module status / paths        | Hub             | Registry sync      | 68 modules    | Hub              | planned_stub ≠ ops          | None              | status histogram                          | **CONSUME**        |
| Growth / sealed systems   | `data/z_ecosystem_growth_stage_registry.json` | Sealed system list           | Hub             | Steward            | Sealed IDs    | 14 sealed        | Seal ≠ deploy               | None              | sealed set                                | **CONSUME**        |
| Z-ZES citizenship         | `data/z_zes_organism_citizenship.json`        | Organism citizenship         | Hub             | Sealed             | Z-ZES         | Special          | Runtime NOT authorized      | None              | citizenship posture                       | **LEAVE_ALONE**    |
| Satellite control-link    | `data/z_satellite_control_link_manifest.json` | Approved bridge targets      | Hub             | dry/apply scripts  | Satellites    | Thin             | NAS_WAIT                    | Dry-run default   | membership                                | **LINK**           |

---

## B. Indicators, freshness, atlases

| Name                     | Canonical path                                                              | Purpose                         | SoT             | R/W                 | Scope            | Runtime           | Z-SDC data             | Action               |
| ------------------------ | --------------------------------------------------------------------------- | ------------------------------- | --------------- | ------------------- | ---------------- | ----------------- | ---------------------- | -------------------- |
| AMK project indicators   | `dashboard/data/amk_project_indicators.json`                                | Capability/system signals (~57) | Hub             | Steward/UI overlays | Hub systems      | Read-only HTML    | signal, go_no_go, docs | **CONSUME**          |
| Indicator Source Atlas   | `docs/Z_SANCTUARY_INDICATOR_SOURCE_ATLAS.md` + `npm run z:indicators:atlas` | Where indicator evidence lives  | Hub docs/script | Report regen        | Indicators       | Report write only | source map             | **LINK**             |
| Freshness cadence        | `docs/Z_SANCTUARY_FRESHNESS_CADENCE.md`                                     | Human rhythm, not cron          | Docs            | None                | OS               | None              | cadence expectations   | **LINK**             |
| Project freshness report | `data/reports/z_project_freshness.json` · `npm run freshness:refresh`       | Report age / project freshness  | Script → report | Report write        | Projects/reports | Refresh script    | ages, staleness        | **CONSUME**          |
| Report freshness         | `data/reports/z_report_freshness.*`                                         | Report corpus freshness         | Script          | Report              | Reports          | Refresh           | ages                   | **CONSUME**          |
| Registry Atlas           | `docs/Z_SANCTUARY_REGISTRY_ATLAS.md`                                        | Where truth lives               | Docs            | None                | Registries       | None              | conflict rules         | **LINK**             |
| Main Control map         | `dashboard/data/amk_control_dashboard_map.json`                             | Compass canvas                  | Hub             | Docs/UI             | Hub              | Fetch JSON        | nodes/health binds     | **LEAVE_ALONE** (UI) |

---

## C. Observation / awareness / readiness

| Name                          | Canonical path                                                                                                    | Purpose                                     | SoT             | Writes              | Authority     | Z-SDC data                         | Action                                                                |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | --------------- | ------------------- | ------------- | ---------------------------------- | --------------------------------------------------------------------- |
| Cycle Observe                 | `docs/Z_CYCLE_OBSERVE_SYSTEM.md` · `scripts/z_cycle_observe_status.mjs` · `data/reports/z_cycle_observe_status.*` | Observation tower + **non-executing** queue | Hub             | Status reports only | Suggest only  | signals, task_queue, coverage      | **EXTEND** candidate feed · **NEVER_DUPLICATE** as executor           |
| Ecosystem Awareness           | `docs/Z_ECOSYSTEM_AWARENESS_SPINE.md` · `npm run z:ecosystem:awareness` · registry + report                       | Capsules → report → indicators              | Hub             | Awareness report    | Observe       | deployment_status, autonomy, holds | **CONSUME** / **EXTEND**                                              |
| Cross-project observer report | `data/reports/z_cross_project_observer.*`                                                                         | Cross-project posture                       | Scripts/reports | Report              | Advisory      | probe results                      | **CONSUME**                                                           |
| Deployment readiness          | `docs/Z_DEPLOYMENT_READINESS_OVERSEER.md` · `npm run z:deployment:readiness`                                      | Readiness rollup                            | Hub             | Status only         | Observe       | maturity %, OBSERVE_ONLY           | **CONSUME**                                                           |
| PC activation receipt         | `docs/Z_PC_ACTIVATION_AWARENESS.md` · `npm run z:pc:activation`                                                   | Session/activation snapshot                 | Hub             | Receipt only        | Visibility    | branch/HEAD/signals                | **CONSUME**                                                           |
| Traffic minibots              | `npm run z:traffic` · reports                                                                                     | Traffic signals                             | Hub             | Status              | Advisory      | traffic status                     | **CONSUME**                                                           |
| Twin Roots Phase 1            | mock JSON + panel + status                                                                                        | Routing-memory **mock**                     | Mock            | Status regen        | Advisory only | Not live health                    | **LEAVE_ALONE** as product · **LINK** principle via Twin Roots review |
| Twin Roots challenge review   | `docs/TWIN_ROOTS_ECOSYSTEM_CHALLENGE_REVIEW.md`                                                                   | Challenge principle seal                    | Docs            | None                | Steward       | DANGEROUS_ASSUMPTION lessons       | **LINK**                                                              |
| Scheduled observer scripts    | `scripts/z_register_observer_scheduled_task.ps1` etc.                                                             | Optional OS task registration               | Scripts         | Local task          | Human-run     | —                                  | **DEFER** · no auto watchdogs for Z-SDC V0                            |

---

## D. Steward / governance / gates

| Name                          | Path                                            | Purpose                       | Authority           | Z-SDC action                                                          |
| ----------------------------- | ----------------------------------------------- | ----------------------------- | ------------------- | --------------------------------------------------------------------- |
| Steward Decision Log          | `docs/Z_SANCTUARY_STEWARD_DECISION_LOG.md`      | Chronological decisions       | Human               | **CONSUME** (patterns) · **NEVER_DUPLICATE** as court                 |
| Steward receipts (D2/EMK/REP) | `docs/STEWARD_DECISION_*.md` · Pass rollup      | Identity decisions            | Human               | **CONSUME**                                                           |
| Consolidation Era             | `docs/Z_SANCTUARY_CONSOLIDATION_ERA_CHARTER.md` | Understand before invent      | Constitutional roof | **LINK** · Z-SDC must obey                                            |
| Z-CPU Spine Phase 0           | charter + evidence review                       | Index/map of planes           | Docs                | **LINK** · Z-SDC is diagnostic layer **over** planes, not replacement |
| Quality Gate / Turtle         | docs + rules                                    | Acceptance before citizenship | Human               | **LEAVE_ALONE**                                                       |
| AAFRTC                        | `data/z_aafrtc_policy.json` · docs/scripts      | Hub verify pipeline           | Gate, not waiver    | **NEVER_DUPLICATE**                                                   |
| Execution enforcer            | `scripts/z_execution_enforcer*.mjs` · reports   | Blocks verify:full/ci         | Technical firewall  | **NEVER_DUPLICATE**                                                   |
| Release control               | `data/z_release_control.json`                   | manual_release                | Human               | **NEVER_DUPLICATE**                                                   |
| Autonomy policy               | `data/z_autonomy_task_policy.json`              | L0–sacred ladder              | Policy              | **CONSUME** labels                                                    |
| Steward Gate Logic            | `docs/Z_STEWARD_GATE_LOGIC.md`                  | Outline only                  | Human               | **LEAVE_ALONE**                                                       |
| Alpha A4 Steward Intelligence | charter reserved                                | Advise synthesis              | Not building        | **DEFER** · Z-SDC feeds SI later; SI ≠ Z-SDC                          |
| XBUS                          | docs + registry                                 | External connector metadata   | No live bus         | **NEVER_DUPLICATE** as firewall                                       |
| Visual automation boundary    | `data/z_visual_automation_boundary.json`        | No RPA approvals              | Policy              | **LEAVE_ALONE**                                                       |

---

## E. Doorway / workspace / SSWS

| Name                            | Path                                                     | Purpose               | Action                                                            |
| ------------------------------- | -------------------------------------------------------- | --------------------- | ----------------------------------------------------------------- |
| Project Doorway                 | `data/amk_project_doorway_registry.json` · launcher docs | Open folders (subset) | **CONSUME** open/posture metadata · **NEVER_DUPLICATE** as opener |
| Workspace doorway / SSWS spines | workspace registries · SSWS docs                         | Cockpit routing       | **LINK**                                                          |
| Main Control HTML               | `dashboard/Html/amk-goku-main-control.html`              | Read-only compass     | **LEAVE_ALONE** (no dashboard mutation this gate)                 |

---

## F. Health / AI / bridge / continuity

| Name                                            | Path                                             | Purpose                          | Action                                                                  |
| ----------------------------------------------- | ------------------------------------------------ | -------------------------------- | ----------------------------------------------------------------------- |
| System / bot / communication / AI signal health | `data/reports/z_*_health.*` · scripts            | Local health JSON                | **CONSUME**                                                             |
| Guardian report                                 | guardian scripts/reports                         | Guard posture                    | **CONSUME**                                                             |
| Z-Bridge                                        | `scripts/z_bridge/*` · reports                   | Local observability              | **LINK**                                                                |
| Operator notifications                          | `data/amk_operator_notifications.json`           | Interrupt queue                  | **CONSUME** · **NEVER_DUPLICATE** as notify bus                         |
| Zuno                                            | snapshots · state reports · observer module docs | Reflection                       | **LINK** as future **consumer** of Z-SDC context · no Zuno mutation now |
| Project Lifeboat                                | `docs/project-lifeboat/*`                        | Continuity/stewardship foresight | **LINK**                                                                |
| Backup readiness inventory                      | reports under backup docs                        | Continuity evidence              | **CONSUME** when present                                                |
| Crystal DNA drift                               | drift reports                                    | Topology awareness               | **CONSUME**                                                             |
| VHealth / movement modules                      | docs/reports                                     | Domain health (not org health)   | **LEAVE_ALONE** unless scoped diagnostic                                |

---

## G. Explicit non-organs for Z-SDC V0

| Item                             | Reason                                                 |
| -------------------------------- | ------------------------------------------------------ |
| ZWheel / Z-DIAG product tree     | Architectural descendant only · **NEVER** source child |
| Roulette engines / Q&A / history | Not transferred                                        |
| OpenAI / cloud telemetry         | Forbidden                                              |
| Background Z-SDC service         | Phase 1+ not opened                                    |

---

## Summary counts (inspected 2026-08-20)

| Organ class                           | Approx present                                                                |
| ------------------------------------- | ----------------------------------------------------------------------------- |
| PC-root citizens                      | 22                                                                            |
| Indicators                            | 57                                                                            |
| Sealed growth systems                 | 14                                                                            |
| Master modules                        | 68 (mixed stub/implemented)                                                   |
| Observation/readiness report families | Multiple (cycle, awareness, deployment, freshness, health, twin roots status) |

**Map complete for Phase 0.** Runtime consumers not built.
