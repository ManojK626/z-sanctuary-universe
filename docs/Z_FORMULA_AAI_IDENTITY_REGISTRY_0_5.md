# Z-SANCTUARY-FORMULA-AAI-IDENTITY-REGISTRY-0.5

**Status:** Identity normalization sealed · **implementation NOT started**  
**Date:** 2026-08-21  
**Baseline HEAD:** `8e3f32b`  
**Branch:** `cursor/zsanctuary/z-sdc-phase-0-architecture`  
**Registry file:** `data/z_formula_aai_identity_registry.json`  
**Mode:** RECONCILE · NORMALIZE · REGISTER IDENTITY ONLY

## Baseline

| Field | Value |
| --- | --- |
| Expected HEAD | `8e3f32b` |
| Actual start HEAD | `8e3f32b` |
| Staged | NONE |
| Unrelated dirt | Preserved (~180 porcelain lines) |
| Prior seal | Grand Consolidation `docs/Z_FORMULA_AAI_GRAND_CONSOLIDATION_0.md` |

## Purpose

Give every Z-Formula / AAI architecture identity **one canonical ID**, keep historical names recoverable, keep separate technologies separate, keep proposed technologies explicitly non-runtime, and leave formula mathematics / authority unchanged.

```text
Identity normalization ≠ mathematical readiness.
Capability ≠ authority.
```

## Registry Schema

Each identity carries: `canonical_id`, `display_name`, `category`, `family`, `lineage`, `generation`, `formula_type[]`, `maturity`, `lifecycle_status`, `runtime_status`, `authority_ceiling`, `canonical_source[]`, `historical_sources[]`, `implementation_paths[]`, `test_paths[]`, `golden_paths[]`, `parent_ids[]`, `child_ids[]`, `related_ids[]`, `separate_from[]`, `historical_aliases[]`, `provenance_class`, `scientific_claim_class`, `notes`.

Empty arrays mean **no evidence recorded**, not a denial of existence elsewhere.

## Canonical Naming Law

1. One `canonical_id` per technology identity (kebab-case).
2. Display names and historical spellings live in `historical_aliases` — never silently replace the ID.
3. Collision pairs must list each other in `separate_from`.
4. Proposed architecture uses lifecycle `PROPOSED_ARCHITECTURE` or `PROPOSED_NEW_FAMILY` with `authority_ceiling = NONE` and `runtime_status = NONE`.

## Provenance Law

Allowed `provenance_class` values match Grand Consolidation trust classes. Older text does not override sealed current evidence.

## Formula Maturity Law

`F0`…`F9` as formula maturity only. **Maturity does not imply deploy authority.**

This gate does **not** promote `NEEDS_FORMULA_SPEC` to `READY_FOR_IMPLEMENTATION`.

## Authority Law

Every identity states an `authority_ceiling` (`NONE` … `BOUNDED_EXECUTION` / `HUMAN_GATED`). Capability in another repo surface does not raise this ceiling.

## Current Canonical Identities

Recovered / sealed / executable / governance identities (not proposed):

| canonical_id | lifecycle | maturity | authority |
| --- | --- | --- | --- |
| z-foundational | CURRENT | F1 | DOCUMENT_ONLY |
| z-power | CONCEPTUAL | F1 | DOCUMENT_ONLY |
| lpbs-infinite-compassion | SPEC_PARTIAL | F2 | DOCUMENT_ONLY |
| lpbs-lottery-config | EXECUTABLE | F5 | BOUNDED_EXECUTION |
| lpbs-roulette-loss-progression | GOVERNANCE_ONLY | F1 | DOCUMENT_ONLY |
| z-mega (+ 3 provisional contexts) | NEEDS_FORMULA_SPEC / CONCEPTUAL | F1 | NONE |
| ggaesp-pipeline-v11-v19 | EXECUTABLE | F6 | ADVISORY |
| ggaesp-ultra-chambers | CONCEPTUAL | F1 | DOCUMENT_ONLY |
| ggaesp-historical-generalyser-family | CONCEPTUAL | F1 | DOCUMENT_ONLY |
| ring-ultra-360-filter | NEEDS_FORMULA_SPEC | F1 | DOCUMENT_ONLY |
| ring-combat-360 | CURRENT | F3 | SIMULATE |
| cubes-ultra-six-x10 | NEEDS_FORMULA_SPEC | F1 | DOCUMENT_ONLY |
| combat-voxel-field | CURRENT | F3 | SIMULATE |
| kairocell-hub | SIMULATION_ONLY | F5 | SIMULATE |
| z-ui-ultra-decision | NEEDS_FORMULA_SPEC | F2 | DOCUMENT_ONLY |
| z-uil-universal-interaction-language | CURRENT | F1 | DOCUMENT_ONLY |
| omega-ultra-drp | NEEDS_FORMULA_SPEC | F2 | DOCUMENT_ONLY |
| omega-omnai-rsi-tiers | SIMULATION_ONLY | F6 | SIMULATE |
| ultra-mage-governance | GOVERNANCE_ONLY | F3 | REPORT |
| formula-swarm | GOVERNANCE_ONLY | F2 | SUGGEST |
| swarm-14drp | GOVERNANCE_ONLY | F3 | HUMAN_GATED |
| shadow-family | CURRENT | F1 | DOCUMENT_ONLY |
| shadow-foundation-otel-opa | EXECUTABLE | F5 | ADVISORY |
| z-mini-bots | CURRENT | F2 | OBSERVE |
| qosmei-core-signal-fusion | EXECUTABLE | F5 | ADVISORY |
| whale-bus-spine | CURRENT | F2 | REPORT |
| quadruple-spine-doctrine | CONCEPTUAL | F2 | SUGGEST |
| qosmei-spine-vocabulary | CONCEPTUAL | F1 | DOCUMENT_ONLY |
| octo-ant-neuro-flex | CONCEPTUAL | F2 | SUGGEST |
| replica-fabric-governed | GOVERNANCE_ONLY | F3 | HUMAN_GATED |

## Historical Identities

| canonical_id | status |
| --- | --- |
| z1-z18-family | HISTORICAL_HOLD · math unresolved |
| zn-pattern-family | HISTORICAL_HOLD |
| zx-pattern-family | HISTORICAL_HOLD |
| lpbs-ssr-long-progression | HISTORICAL_HOLD |

## Executable Identities

| canonical_id | implementation_paths (evidence) | goldens |
| --- | --- | --- |
| ggaesp-pipeline-v11-v19 | `core_engine/ggaesp_pipeline.ts`, browser JS | `data/formula_semantic_goldens/ggaesp_v11_v19_goldens.json` |
| lpbs-lottery-config | Lottery `engine.py` `LPBSConfig` | — |
| omega-omnai-rsi-tiers | `core/omnai/omega_formula.js` | `omnai_omega_rsi_goldens.json` |
| qosmei-core-signal-fusion | `scripts/z_qosmei_signal_fusion.mjs` | — |
| shadow-foundation-otel-opa | OTel YAML + OPA rego | — |
| kairocell-hub | `core/z_kairocell_engine.js` | — |
| whale-bus-spine | `scripts/z_whale_bus_comms_run.mjs` (partial) | — |

Executable ≠ production authority.

## Conceptual Formula Identities

Ultra chambers, Ultra Ω, Ultra 360, Cubes ×10, Z-UI, hub LPBS∞ (spec partial), Z-Mega contexts, Quadruple Spine doctrine, Octo convention, Formula Swarm / Ultra-MAGE governance surfaces.

## Shadow Identities

| ID | Meaning | Status |
| --- | --- | --- |
| shadow-family | Umbrella only | CURRENT |
| shadow-foundation-otel-opa | OTel + OPA advisory | EXECUTABLE advisory |
| formula-shadow-contract | Formal operator | **PROPOSED_ARCHITECTURE** |
| z-adversarial-shadow | Security checklist | **PROPOSED_ARCHITECTURE** |
| z-impact-shadow | Impact questions | **PROPOSED_ARCHITECTURE** |

No universal Formula Shadow engine claimed.

## Spatial / Cube Identities

| ID | Status |
| --- | --- |
| cubes-ultra-six-x10 | NEEDS_FORMULA_SPEC |
| combat-voxel-field | CURRENT (Combat-specific; 4–5 cm recommended) |
| continuous-360-multidimensional-field | **PROPOSED_NEW_FAMILY** (not historical package) |

**Z-Unit** is **not** registered as historical canon (absent). Alias retained only under proposed Continuous 360 field.

## Combat Identities

`ring-combat-360` · `combat-voxel-field` · `kairocell-hub` — separate from Ultra Ring / Ultra Cubes.

## Swarm / MiniBot Identities

`formula-swarm` · `swarm-14drp` · `z-mini-bots` — observe/suggest/governance. **Not activated** as autonomous swarm.

## QOSMEI Identity

`qosmei-core-signal-fusion` — advisory signal fusion · `scientific_claim_class = ARCHITECTURAL_METAPHOR` · separate from `z-quantum-research` and `z-post-quantum-security`.

## Whale Bus / Spine Identities

| ID | Notes |
| --- | --- |
| whale-bus-spine | Routing ≠ authority; missing cited `docs/Z-WHALE-BUS-SPINE.md` |
| quadruple-spine-doctrine | Cognitive · Data · Build · Oversight |
| qosmei-spine-vocabulary | safety · registry · comms · observability — **CONFLICTING** naming |
| octo-ant-neuro-flex | Eight-guardian convention / helper |

## Replica Fabric Identity

`replica-fabric-governed` — HUMAN_GATED · validator only · `UNBOUNDED_SELF_REPLICATION = NOT AUTHORIZED`.

## Z-AAI Proposed Identity

`z-aai` — category `AAI_ARCHITECTURE` · lifecycle `PROPOSED_ARCHITECTURE` · runtime `NONE` · authority `NONE` · not AGI · not autonomous.

## Proposed Architecture Identities

| canonical_id | lifecycle |
| --- | --- |
| continuous-360-multidimensional-field | PROPOSED_NEW_FAMILY |
| micro-meso-macro-formal-model | PROPOSED_ARCHITECTURE |
| formula-shadow-contract | PROPOSED_ARCHITECTURE |
| z-adversarial-shadow | PROPOSED_ARCHITECTURE |
| z-impact-shadow | PROPOSED_ARCHITECTURE |
| z-learning-provenance-spine | PROPOSED_ARCHITECTURE |
| z-tevv-spine | PROPOSED_ARCHITECTURE |
| z-graceful-degradation-spine | PROPOSED_ARCHITECTURE |
| z-quantum-research | FUTURE_RESEARCH |
| z-post-quantum-security | FUTURE_RESEARCH |
| z-aai | PROPOSED_ARCHITECTURE |

## Separation Contracts

| Contract | IDs |
| --- | --- |
| LPBS four-way | `lpbs-infinite-compassion` ≠ lottery ≠ ssr ≠ roulette |
| Omega | `omega-ultra-drp` ≠ `omega-omnai-rsi-tiers` |
| 360 | `ring-ultra-360-filter` ≠ `ring-combat-360` ≠ GGAESP exec |
| Cubes | `cubes-ultra-six-x10` ≠ `combat-voxel-field` ≠ proposed Continuous 360 |
| Z-UI | `z-ui-ultra-decision` ≠ `z-uil-universal-interaction-language` |
| QOSMEI | ≠ quantum research ≠ PQC |
| Z-AAI | ≠ AGI ≠ autonomous authority |

## Naming Collision Matrix

| Collision | Verdict |
| --- | --- |
| LPBS acronym | Four IDs — resolved by separation |
| 360 | Ultra / Combat / GGAESP vocab — separated |
| Cubes | Ultra organs / Combat voxels / proposed field — separated |
| Omega | Ultra vs OMNAI — separated |
| Z-UI vs Z-UIL | Separated |
| Shadow | Multi-meaning umbrella + specific children |
| Quadruple Spines | **STEWARD_NAMING_DECISION_REQUIRED** |
| Z-Mega shared parameter | **UNRESOLVED** — provisional contexts |

## Z-Mega Collision Review

| Field | Result |
| --- | --- |
| Result | `UNRESOLVED_SHARED_PARAMETER` |
| Umbrella | `z-mega` |
| Provisional contexts | `z-mega-context-omega`, `z-mega-context-lpbs`, `z-mega-context-zui` |
| Invented ranges | **NO** |
| Steward choice | SHARED \| SEPARATE \| remain UNRESOLVED |

## Spine Naming Review

| Field | Value |
| --- | --- |
| TERM | Quadruple Spines |
| SOURCE A | Ultra Instincts / ecosystem spine docs |
| MEANING A | Cognitive · Data · Build · Oversight |
| SOURCE B | QOSMEI manifest |
| MEANING B | safety · registry · comms · observability |
| SAME TECHNOLOGY? | UNRESOLVED |
| VERDICT | `STEWARD_NAMING_DECISION_REQUIRED` |

## Current vs Proposed Matrix

| Layer | Current / recovered | Proposed only |
| --- | --- | --- |
| Formulas | Ultra Instincts text, sealed specs | — |
| GGAESP | v11→v19 + goldens; chambers conceptual | — |
| LPBS∞ | Spec partial | measurements / goldens later |
| Continuous 360 field | **absent as package** | `continuous-360-multidimensional-field` |
| Z-Unit | **not registered as canon** | alias under proposed field only |
| Formula Shadow operator | undefined | `formula-shadow-contract` |
| Micro→Meso→Macro | micro doctrine only | `micro-meso-macro-formal-model` |
| Z-AAI | name absent historically | `z-aai` |
| Adversarial / Impact Shadow | — | proposed |
| TEVV / learning / degradation spines | partial anchors (goldens) | full spines proposed |
| Quantum / PQC lanes | — | future research IDs |

## Relationship Graph

```text
FOUNDATIONAL FORMULAS (z-foundational)
        ↓ EXPLICIT doctrine
FORMULA FAMILIES (LPBS∞, Ω, Z-UI, Cubes, Ultra 360, chambers)
        ↓ VOCABULARY_ONLY / RELATED
ANALYSIS / GGAESP EXEC (ggaesp-pipeline-v11-v19)
        ↓ RUNTIME advisory
SHADOW / SWARM / FUSION (shadow-foundation, formula-swarm, qosmei)
        ↓ PROPOSED
AAI PROPOSAL (z-aai)
        ↓ PROPOSED
GOVERNANCE (14DRP, Replica Fabric, Ultra-MAGE)
        ↓ EXPLICIT
STEWARD
```

Edges not listed as EXPLICIT/RUNTIME above remain HISTORICAL, PROPOSED, VOCABULARY_ONLY, AMBIGUOUS, or NONE per Grand Consolidation.

## Identity Health Matrix

| Check | Result |
| --- | --- |
| One canonical ID each | PASS (48 unique) |
| Display collisions handled via aliases/separate_from | PASS / REVIEW (Z-Mega, Spines) |
| Purpose overlap prevented for sealed collisions | PASS |
| Status honesty (proposed ≠ executable) | PASS |
| Authority explicit | PASS |
| No false implementation claims | PASS |
| QOSMEI not claimed as quantum hardware | PASS |
| Historical ancestry retained | PASS |

Entries needing Steward REVIEW: `z-mega*`, `qosmei-spine-vocabulary` vs `quadruple-spine-doctrine`.

## Missing Identity Evidence

- Typed Z-Unit / Spatial Lattice as recovered canon
- Whale Bus human doc path `docs/Z-WHALE-BUS-SPINE.md`
- `data/z_whale_bus_spine.json` (absent at seal)
- Formal Formula Shadow operator
- Meso/Macro aggregation
- Steward measurements for LPBS∞ / Z-Mega / Ultra families
- Shared vs separate Z-Mega decision
- Spine naming decision
- Z-AAI acceptance / rename / defer

## Steward Decisions Required

| Decision | Priority |
| --- | --- |
| Accept / rename / defer `z-aai` | P0 for AAI lane |
| Open Continuous 360 as NEW_FAMILY vs Combat-only spatial | P0 for spatial lane |
| Z-Mega SHARED vs SEPARATE | P1 |
| Spine naming reconciliation | P1 |
| Which ONE formula-spec next (if any) | P0 roadmap |
| Shadow taxonomy charter | P1 |

## Recommended ONE Next Gate

```text
Steward choice (pick one — not pre-authorized):

A. Accept/defer Z-AAI identity + Continuous 360 NEW_FAMILY posture (decision seal only)
B. ONE P0 formula-spec lane (e.g. LPBS∞ Steward measurements)
C. Shadow taxonomy charter (formal meanings only)
D. Hold — registry remains reference; no further formula/AAI work
```

**Cursor recommendation without pre-authorizing a chain:**  
**A (decision-only)** if Steward wants the organism named cleanly; else **B** if continuing formula truth; else **D**.

No implementation. No Swarm/MiniBot/QOSMEI/AAI activation.

## Counts

| Bucket | Count |
| --- | --- |
| TOTAL | 48 |
| CURRENT (lifecycle) | 7 |
| EXECUTABLE (lifecycle) | 4 |
| CONCEPTUAL | 9 |
| HISTORICAL_HOLD | 4 |
| PROPOSED_ARCHITECTURE | 8 |
| PROPOSED_NEW_FAMILY | 1 |
| FUTURE_RESEARCH | 2 |
| Other (governance / needs-spec / simulation / partial) | 13 |

## Terminal

```text
FORMULA_AAI_IDENTITY_REGISTRY_0_5 = SEALED
IMPLEMENTATION = NOT_STARTED
PRODUCTION_AUTHORITY = NONE
```
