# Z-Sanctuary — Core Engine Registry (Phase 1 Census)

**System ID:** Z-CORE-ENGINE-CENSUS-1  
**Date:** 2026-07-10  
**Machine registry:** `data/z_core_engines_registry.json` (3 rows — presence ≠ full implementation)  
**Posture:** Read-only audit

---

## Registry law

> Presence in a registry does **not** prove production runtime. Pair with green receipts, scripts, and canonical registry.

---

## Machine registry (hub)

| ID | Name | Status (registry) | Role | Future role |
| -- | ---- | ----------------- | ---- | ----------- |
| `z_sanctuary_core` | Z-Sanctuary Core | active_or_partial | Hub verify, multi-root coordination | Remains operational roof helper |
| `ghost_core` | Ghost Core | doctrine_or_partial | Reflection, archive trails | Bounded memory — no vault exfil |
| `alien_core` | Alien Core | doctrine_or_partial | Off-angle pattern discovery | Advisory only |

---

## Foundation & trust engines

| Engine | Purpose | Inputs | Outputs | Dependencies | Duplicates? | Future |
| ------ | ------- | ------ | ------- | ------------ | ----------- | ------ |
| **VILE zuno-*** | Observability, security, shadow validation | Schemas, events, policies | Validation results | Track A packages | Distinct packages — no circular deps | Merge to `main` → apps consume |
| **ZES (stub)** | Economic/spiritual advisory | Journal consistency (stub) | Trust score stub | MirrorSoul slice | vs trust_products docs | Stay stub until chartered |
| **Trust products** | Product-line trust packs | Docs/exports | Marketing artifacts | Lottery modules | Separate from ZES stub | Product lane |
| **HCI + LCD** | Human connection doctrine | B2 docs | Reflection dimensions | Compassion charter | vs RKPK (intentional stack) | B2.3 wireframes |
| **Compassion charter** | Shared ethics | Governance | Adoption refs | Foundation | — | Canonical |

---

## Formula & governance engines

| Engine | Purpose | Inputs | Outputs | Dependencies | Duplicates? | Future |
| ------ | ------- | ------ | ------- | ------------ | ----------- | ------ |
| **Ω / Z-Ultra formulas** | Doctrine + partial code | `rules/Z_FORMULA_REGISTRY.json` | OMNAI omega_formula.js | Z-Ultra MAGE registry | Formula swarm roles overlap | Consolidation Phase 2+ |
| **Formula Swarm Co-Design** | Symbolic role classifier | `z_formula_swarm_role_registry.json` | Role metadata | AI Tower personas | **MERGE_CANDIDATE** with tower docs | Inventory first |
| **14 DRP validator** | Hub governance swarm law | `z_swarm_14drp_agent_law_registry.json` | Validate report | Traffic, cadence | vs zuno-drp package (future) | Keep separate namespaces |
| **Governance HUD / panel** | Dashboard governance UI | `core/z_governance_hud.js` | Panel state | Module manifest | SEPC governance rows | UI only |
| **Z-SEC Triple-Check** | Comms flow audit | Policy JSON | Audit report | Traffic minibots | Validator family overlap | Canonical auditor |

---

## Simulation & experimental engines

| Engine | Purpose | Inputs | Outputs | Status | Future |
| ------ | ------- | ------ | ------- | ------ | ------ |
| **OMNAI Core Engine** | Matrix simulation | `z_omnai_core_engine_scenario_default.json` | Simulate report | 🔵 Experimental | Bounded scenarios only |
| **Z-Nexus Engine** | Resource / human-energy awareness | Phase 0 docs | Mock dashboard spec | 🔵 Experimental | No UI built |
| **Autopilot engine** | Super Saiyan control plane UI | `core/autopilot/` | Sim UI | 🔵 Experimental | Not production autopilot |
| **Z-Experience Intelligence** | Experience report | Hub data | MD/JSON report | 🟡 Active | Read-only |

---

## Observer / rollup engines (read-only)

| Engine | Purpose | Inputs | Outputs | Overlap |
| ------ | ------- | ------ | ------- | ------- |
| **Universe Status** | MC department rollup | Registries, reports | `z_universe_status_report` | MC, census |
| **Universe Discovery** | PC-root scan | Manifest, disk | Project registry | Census base |
| **Universe Census** | HCI enrichment | Discovery + policy | Census report | Steward, MC |
| **Deployment Readiness** | Deploy posture | Hub reports | DR status | Traffic, cycle |
| **VILE Foundation Readiness** | Track A posture | Packages, receipts | Foundation report | Track A panel |
| **Ecosystem Awareness** | Project capsules | `z_ecosystem_awareness_registry.json` | Awareness report | Cycle observe |
| **PC Activation Receipt** | Session snapshot | Git, reports | Activation MD | Cursor onboarding |
| **Cycle Observe** | Task queue generation | Many reports | Observe status | Traffic |

**Consolidation note:** All read-only — clarify **which rollup is "daily posture"** for operators (human choice).

---

## Validation engine family (scripts)

| Script family | Purpose | Potential duplicate |
| ------------- | ------- | ------------------- |
| `z_swarm_14drp_validate.mjs` | 14 DRP | Cadence cycle bundles |
| `z_susbv_validate.mjs` | Commercial benchmarks | SUSBV overseer |
| `z_formula_validator.mjs` | Formula registry | Swarm roles |
| `z_prediction_validator.mjs` | Prediction claims | Scientific integrity |
| `z_omnai_blueprint_validate.mjs` | OMNAI blueprint | — |
| `z_project_passport_validator.mjs` | Project passports | EAII |
| `z_bridge_validator.mjs` | Bridge logs | — |
| `z_traffic_minibots_status.mjs` | Re-runs subset of checks | **Overlaps cadence** |
| Package tests (zuno-*) | Foundation unit tests | VILE integration |

---

## Not found / pending

| Name | Status |
| ---- | ------ |
| **ZCO** (as named system) | Not found in hub — no artifact |
| **Arelium** (engine) | Doctrine name only — charter TBD |
| **OMNISWARM** (runtime) | Doctrine name only — relate to 14 DRP |

---

## Related

- [Z_SPINE_MAP.md](Z_SPINE_MAP.md)
- [Z_AI_AND_MINIBOT_ATLAS.md](Z_AI_AND_MINIBOT_ATLAS.md)
