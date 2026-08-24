# Z-COMPOSED-AWARENESS-READ-MODEL-SPEC-1

**Status:** Specification only · **no adapters** · **no dashboard** · **no database**
**Date:** 2026-08-24
**Baseline HEAD:** `3e0a881`
**Branch:** `cursor/zsanctuary/z-sdc-phase-0-architecture`

Charter: `docs/Z_COMPOSED_MULTI_PROJECT_AWARENESS_VIEW_CHARTER_1.md`

## Baseline

| Field | Value |
| ----- | ----- |
| START HEAD | `3e0a881` |
| F5B | Separate · not opened |
| F5A / F4 | Untouched |

## Purpose

Define a **federated, read-first, provenance-preserving** projection so existing sources can feed the composed awareness view **without** becoming a master database, CRM, control plane, or AI memory.

```text
READ ≠ OWN
NORMALIZE ≠ REWRITE SOURCE
AGGREGATE ≠ ERASE PROVENANCE
DISPLAY ≠ AUTHORIZE
REFRESH ≠ SOURCE MUTATION
READ MODEL = DERIVED PROJECTION
SOURCE RECORDS = AUTHORITATIVE INPUT
AWARENESS READ MODEL ≠ C360
READ MODEL ≠ HODP IMPLEMENTATION
```

## Charter Authority

Binding: composition not new AI; HODP extend; Crystal DNA no auto-repair; Quadruple Spine unchanged; OctoNero partial/separate; Virtual Motherboard simulation; Roulette/MirrorSoul sovereign; Business AIs doctrine-only; F5A not the dashboard.

## Read-Model Doctrine

The model is **FEDERATED · READ-FIRST · SOURCE-AWARE · SOVEREIGNTY-AWARE**.

It is **not**: system of record for everything, write API, CRM/ERP, PM engine, AI memory, command bus, or control plane.

Rebuild concept (unproven until implemented): `SOURCE SET + ADAPTER VERSION → READ MODEL`.

## Source-of-Truth Rules

Every displayed claim must keep an **identifiable source**. Derived values must be labeled **DERIVED** and never silently become source facts.

Source **priority is qualitative**, not a numerical truth score.

## Source Inventory

| Family | Examples (read-only) |
| ------ | -------------------- |
| Identity | `data/z_pc_root_projects.json` (`id`, `name`, `role`: hub/member/external) · `docs/PROJECT_IDENTITY_RECONCILIATION.md` (`SEPARATE_PROJECT`, `SAME_PROJECT`, `SUBSYSTEM`, `UNRESOLVED`) · monster registry · doorway registry |
| Awareness | `data/z_ecosystem_awareness_registry.json` · `data/z_sanctuary_universe_awareness_capsule.json` (`z_project_awareness_capsule_v1`) · growth registry · awareness reports |
| Crystal DNA | `data/z_crystal_dna_asset_manifest.json` · drift reports · DNA colours |
| AI Ecosphere | `data/z_ai_ecosphere_config.json` · `data/reports/z_ai_ecosphere_ledger.json` |
| Structure | Hierarchy Chief · API Spine registry · tree_spine · F5A receipts |
| Business | `docs/Z-STAKEHOLDERS-AND-BUSINESS-AI.md` (sparse records) |
| Governance | receipts, `manual_release`, HOLD/BLOCK/STOP, deployment HOLD rows |

No source modifications this gate.

## Source Classes

Qualitative (no ranking score):

`CANONICAL_REGISTRY` · `SEALED_RECEIPT` · `CURRENT_MACHINE_REPORT` · `CURRENT_DOCTRINE` · `PROJECT_CAPSULE` · `DASHBOARD_DERIVED` · `LEGACY_CORPUS` · `VISUAL_ARCHIVE` · `UNKNOWN`

## Read-Model Layers

| Layer | Meaning |
| ----- | ------- |
| L0 | SOURCE (untouched) |
| L1 | SOURCE ADAPTER (read/validate/map) |
| L2 | NORMALIZED READ ENTITY |
| L3 | RELATIONSHIP / DEPENDENCY COMPOSITION |
| L4 | WORLD SUMMARIES |
| L5 | EXECUTIVE VIEW (data meaning only; no UI) |

Adapter flow: SOURCE → READ → PARSE/VALIDATE → MAP → ATTACH PROVENANCE → COMPOSE.

Adapters **may not** modify source, repair, authorize, deploy, guess unknowns, or silently invent fields.

**Fail-safe:** incomplete source → **PARTIAL RECORD** + missing-field list + evidence. Never a fabricated complete project.

**Proposed** adapter error postures (not runtime enums yet): `SOURCE_MISSING` · `SOURCE_INVALID` · `SCHEMA_MISMATCH` · `IDENTITY_AMBIGUOUS` · `STALE_SOURCE` · `CONFLICT_PRESENT` · `UNSUPPORTED_SOURCE_VERSION`

## Entity Families

Conceptual names (no runtime classes). No existing type already owns this envelope.

`AwarenessProject` · `AwarenessProduct` · `AwarenessEcosystem` · `AwarenessBusinessEntity` · `AwarenessRelationship` · `AwarenessCommunication` · `AwarenessService` · `AwarenessSystemComponent` · `AwarenessAIIdentity` · `AwarenessEvidence` · `AwarenessGate` · `AwarenessReceipt` · `AwarenessDependency` · `AwarenessCapacityState`

## Common Identity Envelope

`entity_id` · `entity_kind` · `canonical_name` · `display_name` · `source_identity` · `source_path` · `source_version` / commit when available · `provenance` · `maturity` · `runtime_posture` · `sovereignty_posture` · `last_verified`

Also retain: `canonical_id` · `aliases[]` · `source_ids[]` (namespaced `source_namespace + source_id`).

Missing fields: **not** false, **not** zero, **not** “null as fact.” Use UNKNOWN / MISSING / NOT_APPLICABLE / UNVERIFIED.

Identity collisions: **never** merge on similar labels (`id` vs `project_id`) unless equivalence is demonstrated. Prefer hub canonical IDs **and** keep source-local aliases.

## Project World Model

Identity, ecosystem membership, sovereignty, steward where known (`owner_or_steward` on awareness registry), class (`project_type` / pc_root `role`), maturity, health (`current_signal` on capsules — **do not rename** to HOLD/BLOCK/STOP), runtime/deployment posture (`deployment_status` HOLD is **not** Z Logic HOLD), dependencies, gates, latest evidence, AI/business/comms summaries, services, freshness, conflict indicators, source refs.

Not a project-management engine.

## Product / Sovereignty Model

Use **actual** repo terms first:

| Source | Vocabulary |
| ------ | ---------- |
| pc_root | `hub` · `member` · `external` (+ `hosting: link-only`) |
| identity map | `SEPARATE_PROJECT` · `SAME_PROJECT` · `SUBSYSTEM` · `UNRESOLVED` |
| Charter overlay | INTERNAL · MEMBER · SOVEREIGN · SEPARATE · EXTERNAL LINKED · UNKNOWN |

Map overlay **onto** source terms; do not overwrite source `role`.

**CONNECTED ≠ MERGED.** Dashboard presence ≠ Z-Sanctuary ownership. Roulette / Z-Wheel remain **SEPARATE_PROJECT / EXTERNAL**.

## Business Entity Model

Fields (conceptual): `business_entity_id` · category · display_name · organization/person posture · linked projects/products · relationship stage · evidence · comms summary · requests · commitments · agreements · deliverables · risks · next human review · visibility · freshness.

**Do not invent records.** Zero verified investors ≠ “no investor interest exists.”

Categories (awareness, not permissions): INVESTOR · MANUFACTURER · DISTRIBUTOR · SUPPLIER · SERVICE_PROVIDER · PARTNER · INSTITUTION · LEGAL · FINANCE · HR · REGULATOR · OPERATOR · CUSTOMER · USER.

**Proposed** stages (not sealed): IDENTIFIED · CONTACTED · DISCUSSION · PROPOSAL · REVIEW · AGREEMENT · DELIVERY · ACCEPTANCE · CLOSED · UNKNOWN.

Relationship labels must not upgrade law: `MANUFACTURER_CANDIDATE` ≠ `MANUFACTURER_CONTRACTED`.

## Relationship Model

First-class edges, not stuffed objects. Examples: PROJECT `--USES-->` SERVICE; PRODUCT `--MANUFACTURED_BY_CANDIDATE-->` ENTITY; INVESTOR `--INTERESTED_IN-->` PROJECT; AI `--ADVISES-->` PROJECT; COMPONENT `--DEPENDS_ON-->` COMPONENT; PROJECT `--HAS_GATE-->` GATE.

## Communication Model

Types (read-only): MESSAGE · REQUEST · RESPONSE · MEETING · FOLLOW_UP · DECISION · APPROVAL · COMMITMENT · SERVICE_EVENT.

Fields: id · type · actors · project/product/entity refs · source · timestamp · direction · status · evidence · follow_up · decision_required · steward_attention.

Laws: NO RESPONSE ≠ REJECTION · NO MESSAGE ≠ NO INTEREST · OLD MESSAGE ≠ CURRENT POSITION · **AI SUMMARY ≠ ORIGINAL COMMUNICATION**.

No messaging engine. Sparse today → many UNKNOWN.

## Service Model

`service_id` · provider · recipient · linked project/product · type · status · deliverables · dependencies · agreement refs · evidence · risk · review. Primary source: API Spine catalog. No execution.

## System Component Model

Quadruple Spine (Cognitive · Data · Build · Oversight — **unchanged**) · OctoNero (**PARTIAL**, separate, **no invented eight logic paths**) · Crystal DNA · Awareness Spine · AI Ecosphere · Doorway · Control-Link · API Spine · Virtual Motherboard (**SIMULATION / VISUALIZATION**) · F4/F5A · NAS/backup (`NAS_WAIT`).

Each: identity, role, maturity, runtime status, health evidence, dependencies, authority posture, source refs.

F5A representation: 148 F4 vectors · 26/26 F5A · TEVV PASS · FULL F5 **NO** · F6 **NO**. **Not wired** to awareness inputs.

## Governance Model

Gate · decision · receipt · HOLD · BLOCK · STOP (distinct; **never** collapse to ERROR) · Steward/human requirement · deployment posture · authority posture.

HOLD = pause/preserve · BLOCK = prohibit candidate · STOP = terminate bounded path.

No authorization runtime.

## Evidence Model

`evidence_id` · `source_path` · `source_type` · `source_version` · created/modified/generated/observed/last_verified **as distinct times when present** · provenance · classification · linked_entities · raw reference (pointer, not full dump).

Drill: SUMMARY → ENTITY → RELATIONSHIP → EVIDENCE → SOURCE.

## Crystal DNA Adapter Contract

Contributes: identity, dependency, status, drift, verification posture, **propose restore** (human-gated).

**Must not** expose `AUTO_REPAIR = TRUE`.

Preserve DNA colours: GREEN · YELLOW · BLUE · RED · QUARANTINE · NAS_WAIT as **their own dimension** — never map onto Z Logic HOLD/BLOCK/STOP.

**Relationship:** SUPPORTED.

## Awareness Capsule Adapter Contract

Preferred compact project feed. Preserve `schema`, `project_id`, `project_name`, `current_signal`, gates, `autonomy_level`, related docs/reports, notes, freshness.

Uneven coverage **visible**. **No synthetic capsules.**

`growth_percent` is **capsule-declared**; treat as source field, not a universal health score.

## Ecosystem Awareness Adapter Contract

Read-only. Preserve AWARENESS ≠ EXECUTION. Surface known projects, `deployment_status`, alerts (RED/BLUE vs YELLOW policy), capsule presence, `known_hold_reason`, steward.

## AI Ecosphere Adapter Contract

Current evidence (`data/z_ai_ecosphere_config.json`, `data/reports/z_ai_ecosphere_ledger.json`) is **advisory**: rings, `band` (green/yellow), `potential_label`, `sync_score`, `actor_classes`. Ledger `governance_note` already forbids overriding Hierarchy Chief / DRP / Enforcer.

Preserve those **source-declared** fields with provenance. Do **not** promote `overall.sync_score` into a composed `AI_score`.

Conceptual runtime/authority overlay (user gate list) remains **PROPOSED** until mapped from evidence: REGISTERED · DESIGNED · DORMANT · READ_ONLY · DETERMINISTIC_TOOL · LIVE_MODEL · UNKNOWN.

**REGISTERED ≠ ACTIVE** (and **band green ≠ live model**). Capability, maturity, runtime state, and authority remain **four dimensions**. Display creates **no** AI authority.

## Structure Adapter Contract

Tree_spine siblings remain siblings. API Spine = catalog. OctoNero = guardian convention label PARTIAL. Quadruple Spine = four canonical names only.

## Business Evidence Adapter Contract

Doctrine + sparse commercial/ZILWA docs. Empty sets allowed. Module distributor **≠** goods distributor (name collision preserved).

## Communication Evidence Adapter Contract

Notifications + Cycle Observe queue as **operator** comms only. Map to types only where evidence matches. Do not invent investor threads.

## Capacity Evidence Adapter Contract

API Spine metadata. Charter capacity states remain **PROPOSED**: DORMANT · ECO · NORMAL · BOOST · HIGH_DEMAND · DEGRADED · HOLD.

Graceful degradation **PROPOSED**: FULL · REDUCED · ESSENTIAL · READ_ONLY · HOLD_HUMAN.

**MORE COMPUTE ≠ MORE AUTHORITY.** No autoscaling.

## Provenance

Source class + path + version + observed/generated times. Derived counts labeled DERIVED.

## Freshness

**GREEN ≠ CURRENT.** Separate SOURCE STATE from SOURCE FRESHNESS.

**Proposed** freshness (not sealed; no thresholds): CURRENT · AGING · STALE · UNKNOWN.

Do not invent event-time precedence.

## Unknown / Missing / Unverified

Preserve UNKNOWN · MISSING · NOT_APPLICABLE · UNVERIFIED · CONFLICTING. Align with F5A non-coercion.

## Conflict Representation

Conceptual: `conflict_id` · entity · field/topic · source_a · source_b · values · freshness · `resolution_status`.

**No automatic winner.** CONFLICT ≠ FALSE · ≠ hide · ≠ majority vote.

## Identity / Alias Handling

Namespace source IDs. Prefer canonical hub id when mapped. Keep aliases. No source-record migration.

## Real / Derived / Mock / Legacy Distinction

`REAL_SOURCE` · `DERIVED_REAL` · `MOCK` · `PROPOSED` · `LEGACY` · `SIMULATION` · `UNKNOWN`

Future P3 mocks **must** be labeled MOCK/PROPOSED/DEMO and never mixed unmarked with registry data.

SIMULATION ≠ RUNTIME (Virtual Motherboard). LEGACY ≠ CURRENT CANON.

## Visibility Metadata Boundary

Conceptual: STEWARD_ONLY · OPERATOR · PARTNER_SCOPED · PUBLIC · RESTRICTED · UNKNOWN.

**visibility metadata ≠ enforced authorization.** No classifying real records without source evidence. Auth not implemented.

## Non-Mutation Contract

Ordinary refresh **must not** write sources. No command bus (deploy, repair, message, pay, edit repo).

## Deterministic Rebuild Contract

Same sources + same adapter version → same projection (future test). Unproven until P0.

## Read / Write Boundary

Read model is disposable. Writes require a **separate** governed action layer (not this spec).

## World-Level Summaries

`ProjectWorldSummary` · `BusinessWorldSummary` · `SystemWorldSummary` · `GovernanceWorldSummary`

Counts only from evidence. **No universal health/AI/business/truth score.**

Project summary (if sources exist): known ecosystems/projects/sovereign products, open gates, HOLD/BLOCK items (governance dimension), stale capsules, conflicts.

Business: known entities, open relationships, comms awaiting review, evidenced agreements, unverified claims. **No revenue assumptions.**

System: components, runtime vs dormant vs simulation-only, alerts, F4/F5A maturity.

Governance: Steward decisions, human gates, HOLD/BLOCK/STOP, receipts, deployment authority posture.

## Dashboard Compatibility

Data meaning only. No CSS, cards, React, routes. Usable **without** HODP. HODP remains future host (EXTEND).

## Deterministic Foundation Future Seam

P4 later: READ ENTITY → explicit adapter → C360 → MMM → Shadow → Z Logic. **Not wired.** **Not F5B mix-in.**

## AI Future Seam

Optional later: consume **verified projection** → summary/explanation/proposal. Output **AI_PROPOSED**, never source fact. No AI now.

## Source Composition Matrix

| Capability | Source | Type | Maturity | Adapter | Missing | Authority |
| ---------- | ------ | ---- | -------- | ------- | ------- | --------- |
| Project identity | `z_pc_root_projects.json` | CANONICAL_REGISTRY | REGISTRY | ProjectRegistryAdapter | Uneven paths | NONE |
| Ecosystem identity | awareness registry | CANONICAL_REGISTRY | REGISTRY | EcosystemAwarenessAdapter | — | NONE |
| Sovereignty | identity reconciliation + `role` | DOCTRINE + REGISTRY | DOCS+JSON | ProjectRegistryAdapter | Overlay mapping | NONE |
| Health | capsule `current_signal` + reports | CAPSULE / REPORT | PARTIAL | AwarenessCapsuleAdapter | Uneven capsules | NONE |
| Dependencies | DNA manifest | CANONICAL_REGISTRY | REGISTRY | CrystalDNAAdapter | Not all projects are shards | NONE |
| Gates | capsule + awareness `human_gated_actions` | CAPSULE / REGISTRY | PARTIAL | GovernanceAdapter | Not all gates listed | NONE |
| Crystal DNA | manifest + drift | REGISTRY + REPORT | IMPLEMENTED detect | CrystalDNAAdapter | — | NONE (no repair) |
| Capsules | `z_project_awareness_capsule_v1` | PROJECT_CAPSULE | PARTIAL | AwarenessCapsuleAdapter | Many empty | NONE |
| AI ecosphere | config + ledger | REGISTRY + REPORT | ADVISORY | AIEcosphereAdapter | Overlay REGISTERED≠ACTIVE is PROPOSED; scores stay source-declared | NONE |
| Business entities | Stakeholders doc | CURRENT_DOCTRINE | DOCS | BusinessEvidenceAdapter | Almost no records | NONE |
| Communications | notifications / cycle queue | REPORT | PARTIAL operator | CommunicationEvidenceAdapter | No actor CRM | NONE |
| Services | API Spine | CANONICAL_REGISTRY | CATALOG | CapacityEvidenceAdapter | Not a mesh | NONE |
| Structure | monster + Hierarchy Chief | REGISTRY + DOCTRINE | METADATA | StructureAdapter | OctoNero partial | NONE |
| Governance | receipts / HOLD rows | RECEIPT / REGISTRY | MIXED | GovernanceAdapter | — | NONE |
| Capacity | API Spine | REGISTRY | CATALOG | CapacityEvidenceAdapter | States PROPOSED | NONE |
| Evidence | all of above | mixed | mixed | Evidence envelope | — | NONE |
| Freshness | report mtimes / `updated_at` | REPORT | PARTIAL | all adapters | No sealed thresholds | NONE |

## Entity Field Matrix

| Entity | Required core | Optional | Provenance | Main source |
| ------ | ------------- | -------- | ---------- | ----------- |
| AwarenessProject | envelope + sovereignty + source_ids | health, gates, AI links | YES | pc_root + awareness registry |
| AwarenessProduct | envelope + product class | manufacturer candidate | YES | monster / identity map |
| AwarenessEcosystem | envelope | growth | YES | awareness registry hub |
| AwarenessBusinessEntity | envelope + category | all relationship fields | YES | doctrine until records exist |
| AwarenessRelationship | endpoints + label | stage | YES | derived from sources |
| AwarenessCommunication | type + source | actors | YES | notifications (sparse) |
| AwarenessService | envelope | agreement | YES | API Spine |
| AwarenessSystemComponent | envelope + role | health | YES | structure sources |
| AwarenessAIIdentity | envelope + runtime vs registered | capability | YES | ecosphere ledger |
| AwarenessEvidence | path + class | times | YES | pointer |
| AwarenessGate | name + posture | owner | YES | capsules / policy |
| AwarenessReceipt | path | seal HEAD | YES | PHASE_* docs |
| AwarenessDependency | from/to | DNA status | YES | DNA manifest |
| AwarenessCapacityState | component + PROPOSED tag | demand | YES | API Spine |

## Adapter Matrix

Conceptual (non-binding names): ProjectRegistryAdapter · AwarenessCapsuleAdapter · EcosystemAwarenessAdapter · CrystalDNAAdapter · AIEcosphereAdapter · StructureAdapter · GovernanceAdapter · BusinessEvidenceAdapter · CommunicationEvidenceAdapter · CapacityEvidenceAdapter.

## Adapter Priority (P0 order)

1. Project identity / sovereignty  
2. Project awareness capsules  
3. Ecosystem awareness  
4. Crystal DNA  
5. AI Ecosphere  
6. Governance / gates / receipts  
7. Structure  
8. Business evidence  
9. Communications  
10. Capacity  

## First Implementable Slice

**PROJECT WORLD ONLY** — in-memory/JSON projection later, **no DB, no HTTP, no HODP change**.

Sources: pc_root identity + sovereignty overlay + capsule (if present) + ecosystem awareness row + provenance.

Must prove: known project identity preserved · sovereignty preserved · source refs · missing fields explicit · freshness distinct from health · conflict explicit if two sources disagree · **no source mutation** · deterministic rebuild.

## Testing Strategy (future)

Same sources → same projection · source mutation none · unknown preserved · conflict preserved · sovereignty preserved · aliases don’t collide · mock ≠ real · stale ≠ automatically unhealthy · derived ≠ observed · display cannot create authority.

## Non-Goals

No Postgres/SQLite/Redis/graph/vector · no API · no frontend · no CRM/ERP/messaging/payments · no live Business AI · no autoscaling · no new AI ID · no F5B/kernel edits · no command bus · no universal health score.

## Remaining Gaps

Identity id schemes differ (`z-sanctuary-universe` vs `ZSanctuary_Universe`) — **namespace, don’t guess merge**. Business/comms almost empty. Capacity/degradation vocab **PROPOSED**. Octo-Neuro eight logic paths unrecovered. Capsule `growth_percent` must not become a universe score.

## ONE Recommended Next Gate

**Z-SANCTUARY-COMPOSED-AWARENESS-READ-MODEL-P0-IMPLEMENTATION-1**

Thin Project-World projection only. Not dashboard mock. Not F5B. Not business/comms.

## Spec readiness

**COMPOSED_AWARENESS_READ_MODEL_SPEC_READY**
