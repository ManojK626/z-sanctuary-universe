# Z-Sanctuary — Duplicate Intelligence Report (Phase 1)

**System ID:** Z-DUPLICATE-INTELLIGENCE-1  
**Date:** 2026-07-10  
**Posture:** Report only · **NO merges · NO deletions · human gate on every MERGE_CANDIDATE**

**Prior audit:** `docs/root-discovery-audit/DUPLICATES_AND_OVERLAPS.md`

---

## Classification legend

| Category | Meaning |
| -------- | ------- |
| **ACTIVE** | In daily use |
| **CANONICAL** | Authoritative copy — cite this |
| **DUPLICATE** | Redundant copy — drift risk |
| **MERGE_CANDIDATE** | Human may consolidate later |
| **ARCHIVED** | Retained for memory only |
| **EXPERIMENTAL** | Charter / stub |
| **UNKNOWN** | Needs AMK classification |

---

## High priority clusters

### Module registries

| Item | Category | Paths | Recommendation |
| ---- | -------- | ----- | -------------- |
| Master module registry | **CANONICAL** | `data/z_master_module_registry.json` | Audit truth |
| Module manifest (ZModules) | **ACTIVE** | `data/z_module_manifest.json` | Sync from master |
| Z_module_registry | **DUPLICATE** | `data/Z_module_registry.json`, `core/data/Z_module_registry.json`, `core/core/data/Z_module_registry.json` | **MERGE_CANDIDATE** — retire nested copies after human review |
| Labs indicators copy | **DUPLICATE** | `ZSanctuary_Labs/dashboard/data/amk_project_indicators.json` | **MERGE_CANDIDATE** — align or mark archived |

### Awareness & observer rollups

| Item | Category | Paths | Recommendation |
| ---- | -------- | ----- | -------------- |
| Traffic minibots | **CANONICAL** | `z_traffic_minibots_status.*` | Daily lane signal |
| Cycle Observe | **CANONICAL** | `z_cycle_observe_status.*` | Queue + BLUE signal |
| Deployment Readiness | **ACTIVE** | `z_deployment_readiness_status.*` | Deploy posture |
| Universe Status | **ACTIVE** | `z_universe_status_report.*` | MC departments |
| Universe Census | **ACTIVE** | `z_universe_census_report.*` | HCI profiles |
| PC Activation | **ACTIVE** | `z_pc_activation_receipt.*` | Session snapshot |
| Ecosystem Awareness | **ACTIVE** | `z_ecosystem_awareness_report.*` | Capsules |

**Overlap:** All read same underlying reports — **not duplicates** but **lens proliferation**. Human picks canonical "daily posture" surface.

### Folder managers

| Item | Category | Paths | Recommendation |
| ---- | -------- | ----- | -------------- |
| Folder Manager guard script | **CANONICAL** | `scripts/z_folder_manager_guard.mjs` | Runtime guard |
| Folder Manager panel | **ACTIVE** | `core/z_folder_manager_panel.js` | UI |
| FolderManagerBot (symbolic) | **EXPERIMENTAL** | `core/z_miniai_boot.js` | Boot registry |
| Lab folder manager boost | **ACTIVE** | `scripts/z_lab_folder_manager_boost.mjs` | SSWS helper |
| Labs AI_FOLDER_MANAGER.md | **CANONICAL** | `ZSanctuary_Labs/AI_FOLDER_MANAGER.md` | Doctrine in Labs |

**Verdict:** **ACTIVE** family — not merge; document roles.

### Validators & triple-check

| Item | Category | Paths | Recommendation |
| ---- | -------- | ----- | -------------- |
| Z-SEC Triple-Check | **CANONICAL** | `z_sec_triplecheck_audit.mjs` | Comms audit |
| 14 DRP validator | **CANONICAL** | `z_swarm_14drp_validate.mjs` | Governance |
| Traffic minibots | **ACTIVE** | Re-runs subset of validators | Document dependency graph |
| Cadence full verify | **ACTIVE** | `npm run verify:full:technical` | Superset |

**Verdict:** **MERGE_CANDIDATE** for documentation only — single validator catalog doc (Phase 2).

### AI persona overlap

| Item | Category | Paths | Recommendation |
| ---- | -------- | ----- | -------------- |
| Formula swarm roles | **ACTIVE** | `z_formula_swarm_role_registry.json` | Symbolic |
| AI Tower agents | **EXPERIMENTAL** | `docs/modules/ai_tower_agents/` | Planned |
| Super Ghost code + role | **EXPERIMENTAL** | `core/ai_tower/` + swarm registry | **MERGE_CANDIDATE** naming |
| Zuno state vs orchestrator | **ACTIVE** | Reports vs `zuno-orchestrator-contracts` | **CANONICAL** separate namespaces — document |

### Hub naming (resolved)

| Item | Category | Note |
| ---- | -------- | ---- |
| Z_Sanctuary_Universe vs ZSanctuary_Universe | **CANONICAL** vs **ARCHIVED** | Hub = underscore; stub archive only |
| Z_Sanctuary_Universe 2 | **MERGE_CANDIDATE** | Successor review — MC census |

### Dashboard surfaces

| Item | Category | Paths | Recommendation |
| ---- | -------- | ----- | -------------- |
| Z-HODP | **CANONICAL** | `index-skk-rkpk.html` | Operator workhorse |
| AMK Main Control | **CANONICAL** | `amk-goku-main-control.html` | Executive OS / command book |
| Shadow workbench | **EXPERIMENTAL** | dashboard panels | Read-only |

**Verdict:** **Not duplicates** — document ownership per panel.

### Traffic & reflection engines

| Item | Category | Note |
| ---- | -------- | ---- |
| Z-Traffic minibots | **ACTIVE** | Tower |
| Zuno Advisor AAL-1 | **ACTIVE** | Deterministic Q&A |
| Steward AI charter | **EXPERIMENTAL** | Future executive rollup |

### ÉirMind vs Aisling Sol

| Item | Category | Note |
| ---- | -------- | ---- |
| ÉirMind | **UNKNOWN** / missing disk | Discovery: path missing |
| Aisling Sol | **ACTIVE** | `aisling-sol.json` |

**Recommendation:** AMK classifies ÉirMind as archived or successor.

### Pending foundation names

| Item | Category | Note |
| ---- | -------- | ---- |
| Arelium Shield | **EXPERIMENTAL** | Consolidation Phase 2 charter |
| OMNISWARM | **EXPERIMENTAL** | Relate to 14 DRP — charter TBD |
| ZCO | **UNKNOWN** | Not found |

---

## Summary counts (Phase 1 scan)

| Category | Approx. items flagged |
| -------- | --------------------- |
| ACTIVE | 40+ |
| CANONICAL | 25+ |
| DUPLICATE | 5 |
| MERGE_CANDIDATE | 8 |
| ARCHIVED | 3 |
| EXPERIMENTAL | 20+ |
| UNKNOWN | 3 |

---

## Human gate required

All **MERGE_CANDIDATE** and **DUPLICATE** rows require AMK approval before any file move, merge, or delete — per Turtle Mode and Foundation Consolidation charter.

---

## Related

- [Z_SANCTUARY_CANONICAL_REGISTRY.md](Z_SANCTUARY_CANONICAL_REGISTRY.md)
- [Z_SANCTUARY_FOUNDATION_CONSOLIDATION.md](../governance/Z_SANCTUARY_FOUNDATION_CONSOLIDATION.md)
