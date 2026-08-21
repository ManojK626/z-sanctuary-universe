# Z-SANCTUARY-CONTINUOUS-360-MULTIDIMENSIONAL-FIELD-SPEC-1

**Status:** Architectural / typed-contract specification · **F3** (after Steward P0 1.1) · **no implementation**  
**Date:** 2026-08-21  
**Baseline HEAD:** `6fa5510` · **P0 refinement after:** `47a8b24`  
**Branch:** `cursor/zsanctuary/z-sdc-phase-0-architecture`  
**Family ID:** `continuous-360-multidimensional-field`  
**Schema artifact:** NOT CREATED (docs-first)  
**Steward P0 receipt:** `docs/Z_CONTINUOUS_360_STEWARD_P0_DECISIONS_1_1.md`

Provenance labels used throughout:

| Label | Meaning |
| --- | --- |
| `STEWARD_DEFINED_ARCHITECTURAL_INTENT` | Explicit Steward intent (gates 0.6 / this charter) |
| `STEWARD_DEFINED` | Explicit Steward P0 design decisions (gate 1.1) |
| `SEALED_CURRENT_TRUTH` | Sealed identity / lineage seals |
| `DERIVED_ARCHITECTURE` | Logical consequence of accepted definitions |
| `PROPOSED_SPECIFICATION` | Spec proposal awaiting Steward confirmation |
| `UNRESOLVED` | Honest gap |

---

## Baseline

| Field | Value |
| --- | --- |
| Expected HEAD | `6fa5510` |
| Actual start HEAD | `6fa5510` |
| Staged | NONE |
| Unrelated dirt | Preserved (~180 porcelain lines) |
| Prior seals | Grand Consolidation · Identity Registry 0.5 · Steward Decisions 0.6 |

## Identity

`SEALED_CURRENT_TRUTH` (Steward 0.6):

```text
continuous-360-multidimensional-field
STATUS: PROPOSED_NEW_FAMILY
STEWARD ACCEPTED: YES
HISTORICAL CANON: NO
IMPLEMENTED: NO
```

Separation contracts (`SEALED_CURRENT_TRUTH`):

```text
continuous-360-multidimensional-field
≠ combat-voxel-field
≠ cubes-ultra-six-x10
≠ kairocell-hub
≠ ring-ultra-360-filter
≠ ring-combat-360
```

No merge authorized. Combat-as-specialization remains `PROPOSED_RELATIONSHIP` only.

## Steward Intent

`STEWARD_DEFINED_ARCHITECTURAL_INTENT`:

The Continuous 360 Multidimensional Field is the **world / state / observation model** for future formula-readable, MiniBot-readable, Swarm-readable, and Z-AAI-readable structured context. It is **not** visualization-first and **not** Combat-first. Combat may later become one specialization.

Primary design law (`DERIVED_ARCHITECTURE` from charter):

```text
REAL-WORLD OBSERVATION
≠ REPRESENTATION
≠ FORMULA INTERPRETATION
≠ AI INTERPRETATION
≠ SHADOW / COUNTERFACTUAL
```

Never mix these layers silently.

```text
REPRESENTATION ≠ AUTHORITY
MORE DIMENSIONS ≠ MORE TRUTH
MORE AI OBSERVERS ≠ MORE AUTHORITY
SWARM CONSENSUS ≠ STEWARD DECISION
SWARM_MAJORITY ≠ GROUND_TRUTH
```

---

## Meaning of 360

`PROPOSED_SPECIFICATION` (generic family) · `STEWARD_DEFINED_ARCHITECTURAL_INTENT` (must not inherit Combat geometry)

| Candidate | Verdict for GENERAL profile |
| --- | --- |
| FULL_SURROUND_CONTEXT | **PRIMARY** — completeness of relevant perspectives around a subject |
| MULTI-PERSPECTIVE_COVERAGE | **INCLUDED** in primary |
| RELATIONSHIP_COMPLETENESS | **INCLUDED** as relational surround |
| FULL_CYCLE_OBSERVATION | **OPTIONAL** domain meaning (sequence/cycle completeness) |
| LITERAL_ANGULAR_COVERAGE | **DOMAIN_OPTIONAL** — Combat / physical profiles only |

**Defined meaning (GENERAL):**

> **360** means *multi-perspective surround completeness* of context relevant to an entity or state — not automatically literal angular degrees.

Literal geometry is **optional by domain profile**. Combat may define angular coverage; GENERAL must not require it.

### Steward P0-1 addendum (`STEWARD_DEFINED`)

```text
GENERAL_360_MEANING = MULTI_PERSPECTIVE_SURROUND_COMPLETENESS
LITERAL_360_DEGREES_REQUIRED = NO
DOMAIN_SPECIFIC_GEOMETRY_ALLOWED = YES
360_COMPLETENESS_METRIC = UNDEFINED
```

GENERAL 360 = complete-enough multi-perspective contextual observation.  
COMBAT 360 (profile) may additionally use literal angular/spatial geometry.  
Do not modify Combat 360 or Ultra 360 by this decision.

## Meaning of Continuous

`PROPOSED_SPECIFICATION`:

| Sense | Status |
| --- | --- |
| MATHEMATICALLY_CONTINUOUS | **NOT CLAIMED** |
| EVENT_STREAM_CONTINUOUS | ALLOWED (domain) |
| SEQUENTIALLY_UPDATED | **REQUIRED** capability |
| TEMPORALLY_PERSISTENT | **REQUIRED** capability (versioned states) |
| CONTINUOUSLY_OBSERVABLE | OPTIONAL aspiration |
| ADAPTIVE_RESOLUTION | OPTIONAL (domain) |
| CONCEPTUAL_CONTINUITY | **PRIMARY** for GENERAL — evolving state without silent overwrite |

```text
MATHEMATICAL_CONTINUITY_NOT_CLAIMED
```

**Defined meaning (GENERAL):** continuous = *conceptually continuous, sequentially updatable, temporally versioned observation* — not ℝ-continuity of space.

## Meaning of Multidimensional

`PROPOSED_SPECIFICATION` — informational ≠ physical.

Accepted dimension classes for the architecture:

| Class | Status |
| --- | --- |
| SPATIAL | OPTIONAL (domain) |
| TEMPORAL | REQUIRED capability |
| SEQUENTIAL | REQUIRED capability |
| STATE | REQUIRED capability |
| RELATIONAL | REQUIRED capability |
| CONTEXTUAL | OPTIONAL |
| BEHAVIORAL | DOMAIN_SPECIFIC |
| PROVENANCE | REQUIRED capability |
| CONFIDENCE / UNCERTAINTY | REQUIRED capability (representation TBD) |
| SHADOW | REQUIRED capability as alternate state class |
| FREQUENCY | DOMAIN_SPECIFIC / DEFERRED |
| DOMAIN_SPECIFIC | EXTENSION mechanism |

No fake higher-dimensional physics.

---

## Physical vs Informational Dimensions

| Kind | Examples (when a domain defines them) | Rule |
| --- | --- | --- |
| PHYSICAL | x, y, z, angle, distance, velocity, mass | Real-world / sensor / physics-profile only |
| INFORMATIONAL | time, state, sequence, relationship, confidence, provenance | Never described as physical |

`DERIVED_ARCHITECTURE`: informational dimensions are **not** physical dimensions.

---

## Minimum Field Model Concepts

| Concept | Label | Why |
| --- | --- | --- |
| ENTITY | **REQUIRED** | Something observed |
| OBSERVATION | **REQUIRED** | Atomic recorded claim about a dimension/value |
| DIMENSION | **REQUIRED** | Typed axis of meaning |
| VALUE | **REQUIRED** | Payload of an observation (typed; may be UNKNOWN) |
| RELATIONSHIP | **REQUIRED** | Links between entities/states |
| TIME | **REQUIRED** | Timestamp / temporal placement |
| SEQUENCE | **REQUIRED** | Ordered evolution S(n)→S(n+1) without transition math |
| PROVENANCE | **REQUIRED** | Source honesty |
| STATE | **REQUIRED** | Bundle of observations at a version |
| CONFIDENCE / UNCERTAINTY | **REQUIRED** as concept; representation **DEFERRED** | Need without inventing 0–1 scale |
| FIELD UNIT / CELL | **DEFERRED** → Steward decision | Useful but not mandatory yet |

---

## Entity Model

Conceptual `FieldEntity` (`PROPOSED_SPECIFICATION` — not a runtime schema):

| Field | Required? |
| --- | --- |
| entity_id | REQUIRED |
| entity_type | REQUIRED |
| domain | REQUIRED (e.g. GENERAL / COMBAT / …) |
| timestamp_created | REQUIRED |
| source | REQUIRED |
| provenance | REQUIRED |
| display_label | OPTIONAL |
| profile_id | OPTIONAL |

No implementation schema.

## Observation Model

Conceptual `FieldObservation`:

| Field | Required? |
| --- | --- |
| observation_id | REQUIRED |
| entity_id | REQUIRED |
| dimension_id | REQUIRED |
| value | REQUIRED (may be UNKNOWN / NULL / NOT_APPLICABLE — distinct) |
| unit | OPTIONAL (domain-defined; may be UNITLESS / UNKNOWN) |
| timestamp | REQUIRED |
| sequence_index | OPTIONAL |
| source | REQUIRED |
| confidence / uncertainty | OPTIONAL until representation sealed |
| provenance | REQUIRED |
| validity | REQUIRED (VALID / INVALID / CONFLICTING / …) |

**Do not invent measurement scales.** Units remain domain-defined.

## Dimension Model

Conceptual `FieldDimension`:

| Metadata | Required? |
| --- | --- |
| dimension_id | REQUIRED |
| name | REQUIRED |
| class | REQUIRED (physical / informational subclasses) |
| data_type | REQUIRED (string / number / enum / structured / unknown) |
| unit | OPTIONAL / domain policy |
| domain | REQUIRED |
| range | OPTIONAL — **do not invent** |
| resolution | OPTIONAL — domain |
| continuous_or_discrete | REQUIRED when known; else UNKNOWN |
| nullable | REQUIRED |
| source | REQUIRED |

Report-only dimension registry proposal (not created as runtime):

```text
dimension_id | display_name | dimension_class | data_type
unit_policy | range_policy | domain | provenance_requirement
```

## Relationship Model

Conceptual `FieldRelationship`:

Allowed relationship *kinds* (architecture vocabulary):

spatial · temporal · sequential · causal_candidate · correlation · dependency · membership · neighbor · historical · shadow_of · domain_specific

Laws:

```text
CORRELATION ≠ CAUSATION
causal_candidate ≠ proven causal
```

## Time Model

Distinguish (`PROPOSED_SPECIFICATION`):

| Class | Meaning |
| --- | --- |
| OBSERVED_PAST | Recorded past fact (with provenance) |
| OBSERVED_PRESENT | Current confirmed observation window |
| PREDICTED_FUTURE | Forecast — never presented as observed |
| SHADOW_FUTURE | Counterfactual / alternate future |

Also recordable: event timestamp, observation timestamp, sequence order, duration, window, previous/current/candidate future state.

**Future state must never be presented as observed fact.**

## Sequence Model

Conceptual evolution without transition mathematics:

```text
S(n) → S(n+1)
```

Field records: previous state id · current state id · sequence_index · change description (optional) · transition provenance.

May later *context* LPBS / GGAESP / Combat / heat analysis — **no formula linkage activated**.

```text
TRANSITION_MATHEMATICS = NOT DEFINED
```

## State Model

Recommended state classes (`PROPOSED_SPECIFICATION`):

| Class | Role |
| --- | --- |
| RAW_STATE | Direct ingest |
| NORMALIZED_STATE | Representation-normalized |
| DERIVED_STATE | Computed non-formula transforms |
| FORMULA_STATE | Formula-derived |
| SHADOW_STATE | Alternate / counterfactual |
| PREDICTED_STATE | Forecast |
| HUMAN_CONFIRMED_STATE | Steward/human accepted |
| AI_ANALYSIS / AI_PROPOSAL / AI_SHADOW / AI_EXPLANATION | Z-AAI / MiniBot outputs |
| CONFLICTING_OBSERVATIONS | Explicit disagreement container |

Formula-derived values must never look like measurements without provenance.

## Provenance Model

Required provenance classes:

| Class | Meaning |
| --- | --- |
| HUMAN_DECLARED | Human entered |
| SENSOR_OBSERVED | Instrument / sensor |
| SYSTEM_OBSERVED | Hub / system automated observation |
| FORMULA_DERIVED | Executable or symbolic formula output |
| SIMULATION | Simulated |
| SHADOW | Alternate-state generation |
| AI_PROPOSED | MiniBot / Z-AAI proposal |
| IMPORTED | External import |
| UNKNOWN | Honest unknown |

Every value should answer: observed? calculated? inferred? simulated? human? MiniBot? formula?

## Uncertainty Model

Need for uncertainty: **DEFINED** as requirement.

### Steward P0-4 addendum (`STEWARD_DEFINED`)

Structured **non-numeric** uncertainty by default. No universal 0–1 score. No universal LOW/MEDIUM/HIGH thresholds.

Conceptual contract `FieldUncertainty`:

| Field | Role |
| --- | --- |
| assessment_status | `NOT_ASSESSED` \| `QUALITATIVE` \| `QUANTIFIED` |
| uncertainty_kind | categorical condition (not a score) |
| basis | why this assessment |
| evidence_refs | supporting refs |
| domain_value | OPTIONAL future/domain |
| domain_unit | OPTIONAL |

Initial `uncertainty_kind` values: `MISSING_EVIDENCE` · `CONFLICTING_EVIDENCE` · `MODEL_ESTIMATE` · `MEASUREMENT_LIMITATION` · `UNKNOWN_SOURCE` · `OTHER`

```text
UNIVERSAL_NUMERIC_CONFIDENCE = NO
DOMAIN_NUMERIC_UNCERTAINTY_ALLOWED = YES
UNKNOWN ≠ ZERO
MISSING ≠ ZERO
CONFLICTING ≠ UNKNOWN
NOT_ASSESSED ≠ CERTAIN
```

## Field Unit Decision

Historical **Z-Unit** is **not** resurrected as canon (`SEALED_CURRENT_TRUTH`).

### Steward P0-2 addendum (`STEWARD_DEFINED`)

```text
GENERAL_FIXED_FIELD_CELL = NO
HISTORICAL_Z_UNIT_CREATED = NO
FIELD_OBSERVATION_AS_ATOMIC_EVIDENCE = YES
```

No universal voxel, cube, Z-Unit, or fixed spatial cell. Atomic evidence remains `FieldObservation`. Domain profiles may define specialized units (Combat voxel/cell · graph node/edge · temporal event/state · spatial coordinate/sample). Representation follows the domain.

## Resolution Model

```text
GLOBAL_FIXED_RESOLUTION = NOT AUTHORIZED
```

Combat **4–5 cm** remains `COMBAT_SPECIFIC` — **not** globalized.

Generic field may carry domain-specific: resolution · sampling interval · spatial/temporal/relationship granularity — all **UNRESOLVED** as universal values.

## Representation (discrete vs continuous)

### Steward P0-5 addendum (`STEWARD_DEFINED`)

```text
GENERAL_FIELD_REPRESENTATION = HYBRID
UNIVERSAL_SPATIAL_LATTICE = NO
UNIVERSAL_GRAPH_ONLY = NO
UNIVERSAL_EVENT_STREAM_ONLY = NO
```

Hybrid starting architecture:

```text
VERSIONED STATE / EVENT STREAM
        +
RELATIONSHIP GRAPH
        +
OPTIONAL DOMAIN-SPECIFIC FIELD REPRESENTATION
```

Domain forms (coordinates / lattices / voxels / other) only where appropriate. Do not force Sanctuary into graph-only, cube-only, or event-log-only.

---

## General Profile

### Steward P0-3 addendum (`STEWARD_DEFINED`)

Minimum GENERAL profile:

```text
ENTITY
+ TIME
+ SEQUENCE
+ STATE
+ RELATIONSHIPS
+ PROVENANCE
+ UNCERTAINTY
```

| Flag | Value |
| --- | --- |
| SPATIAL_DIMENSION_REQUIRED | NO |
| FREQUENCY_DIMENSION_REQUIRED | NO |
| SHADOW_DIMENSION_REQUIRED | NO |
| COMBAT_DIMENSION_REQUIRED | NO |

Core dimension classes: TEMPORAL · SEQUENTIAL · STATE · RELATIONAL.  
Mandatory evidence metadata: PROVENANCE · UNCERTAINTY.  
Identity anchor: ENTITY.  
Spatial / frequency / Shadow / Combat / physical coordinates are extensions — not GENERAL requirements.  
Provenance and uncertainty are **not** physical dimensions.

## Combat Profile

Architecture-only future `CombatFieldProfile` (`PROPOSED_RELATIONSHIP`):

May include physical dimensions such as: x, y, z, orientation, gravity relationship, trajectory, body segment, balance, breath phase, rhythm — **domain-defined**.

Preserve cm voxels as **COMBAT_SPECIFIC**.

```text
CONTINUOUS 360 GENERAL FIELD ≠ COMBAT FIELD PROFILE
```

## Ultra Cube Relationship

`cubes-ultra-six-x10` remains separate.

Relationship class: **`PROPOSED_RELATIONSHIP` / `POSSIBLE_FUTURE_ADAPTER`** — not physical field cells.

## KairoCell Relationship

Separate technology. Future `KAIROCELL → FIELD ADAPTER` = **`PROPOSED_RELATIONSHIP`** only.

---

## Shadow Representation

Capability required: store alternate states without defining Shadow operator.

| Concept | Rule |
| --- | --- |
| ObservedState | Provenance observed / confirmed |
| ShadowState | Alternate; never silently promoted |

Suggested Shadow metadata (spec only): shadow_id · parent_state_id · shadow_type · assumptions · generated_by · evidence

```text
OBSERVED ≠ SHADOW
SHADOW_OPERATOR = NOT FORMALLY DEFINED
```

Formula Shadow future hook (`PROPOSED_SPECIFICATION`):

```text
BASE STATE
  ├─ Formula A
  ├─ Formula A Shadow 1
  ├─ Formula A Shadow 2
  └─ Human comparison
```

No Shadow mathematics.

## Micro Model

`PROPOSED_SPECIFICATION` — minimum useful Micro:

> One observation, one entity-local state, one formula output, or one bounded relationship cluster — at the lowest inspectable grain of the field.

No Micro formula mathematics invented.

## Meso Model

`PROPOSED_ARCHITECTURE`:

> Local cluster of Micro states and relationships.

No aggregation formula.

## Macro Model

`PROPOSED_ARCHITECTURE`:

> Larger system-level representation derived from verified lower-level evidence.

```text
MICRO→MESO→MACRO_AGGREGATION_MATH = MISSING
```

---

## MiniBot Access

Conceptual `MiniBotFieldView` (`PROPOSED_SPECIFICATION`):

```text
READ ONLY BY DEFAULT
SCOPED DIMENSIONS
SCOPED ENTITIES
PROVENANCE REQUIRED
NO SILENT MUTATION
```

Write law: MiniBots may produce OBSERVATION / ANALYSIS / PROPOSAL marked `AI_PROPOSED` (or non-observed class) — **not** overwrite measured/observed state.

**MiniBots not activated.**

## Swarm Relationship

Different MiniBots may receive same state / different roles, scoped slices, Shadow states, temporal windows — architecture only.

```text
SWARM_MAJORITY ≠ GROUND_TRUTH
```

**Swarm not activated.**

## GGAESP Adapter Relationship

GGAESP v11→v19 unchanged.

Proposed:

```text
FIELD → GGAESP ADAPTER → GGAESP
```

Adapter would need to map field observations into existing advisory pipeline inputs **without** changing GGAESP semantics. Adapter **not** implemented.

## LPBS Relationship

LPBS∞ unchanged. Proposed only:

```text
FIELD SEQUENCE → LPBS CONTEXT
```

Field may later supply `n` / state *context* without defining LPBS mathematics.

## Z-Mega Relationship

Z-Mega remains deferred (`DEFERRED_PENDING_FORMULA_SPEC`).

Field must **not** define Z-Mega. May store a future result as `FORMULA_DERIVED` without unit/range/shared meaning.

## QOSMEI Relationship

QOSMEI remains advisory fusion; does **not** own the field.

Proposed:

```text
Field observations + Formula outputs + Shadow outputs + MiniBot reports → QOSMEI
```

=`PROPOSED_ARCHITECTURE`

## Z-AAI Relationship

Identity accepted; still proposed architecture.

```text
FIELD → scoped evidence → Z-AAI → explanation / comparison / proposal
```

Z-AAI must not mutate source observations silently.

Write classes: `AI_ANALYSIS` · `AI_PROPOSAL` · `AI_SHADOW` · `AI_EXPLANATION` — never `OBSERVED_FACT` unless independently verified.

## Human Confirmation

Conceptual: PROPOSED → ACCEPTED without deleting prior proposal; provenance history preserved.

## Learning Provenance

Supported path (`PROPOSED_SPECIFICATION`):

```text
OBSERVATION → ANALYSIS → SHADOW → PROPOSAL → TEST → HUMAN DECISION → ACCEPTED VERSION
```

## Versioning / Immutability Principle

Prefer `StateVersion n` over silent overwrite. Preserve previous state · new state · reason · source · timestamp.

No implementation.

## Error / Unknown Model (mandatory)

Support explicitly:

```text
UNKNOWN · MISSING · NOT_OBSERVED · NOT_APPLICABLE · CONFLICTING · INVALID
```

```text
NULL ≠ ZERO ≠ UNKNOWN ≠ NOT_APPLICABLE
```

Conflict model: represent `CONFLICTING_OBSERVATIONS` with per-source provenance — do not overwrite.

---

## Security / Privacy Boundaries

Architecture questions (not implemented): who may read / propose / confirm / export / delete.

Principles:

```text
MINIMUM NECESSARY DATA
PURPOSE LIMITATION
RETENTION BOUNDARY
CONSENT WHERE REQUIRED
DOMAIN-SPECIFIC ACCESS
```

Safety extension mechanism: high-risk domains (Combat, children, health, finance, personal data) may attach additional constraints via profile — **domain rules not defined here**.

## Graceful Degradation

```text
FIELD works without Z-AAI
FIELD works without Swarm
FIELD works without MiniBots
```

Minimum: validated deterministic observations + human inspection.

## Performance / Scaling Questions

Future measurable properties (no targets invented): entity/observation/dimension/relationship counts · update frequency · memory · query/aggregation latency · Shadow count · MiniBot count.

Scaling law: as resolution increases, future TEVV should test information gain, latency, memory, noise, redundancy, formula stability, Shadow/Swarm usefulness — **no claims yet**.

```text
360_COMPLETENESS_METRIC = UNDEFINED
```

## Field Adapter Law

Existing engines are not rewritten to fit the field. Conceptual adapters only: GGAESP · Combat · KairoCell · LPBS · QOSMEI · Z-AAI.

---

## Formal Specification Matrix

| Property | Status | Definition | Provenance |
| --- | --- | --- | --- |
| Family identity | DEFINED | `continuous-360-multidimensional-field` | SEALED_CURRENT_TRUTH |
| 360 meaning | DEFINED | MULTI_PERSPECTIVE_SURROUND_COMPLETENESS; literal degrees not required generally | STEWARD_DEFINED |
| continuous meaning | DEFINED | Conceptual continuity + sequential/temporal versioning; math continuity not claimed | PROPOSED_SPECIFICATION |
| multidimensional meaning | PARTIAL | Class taxonomy; GENERAL mandatory set sealed | STEWARD_DEFINED + open extensions |
| entity | DEFINED | Conceptual FieldEntity; GENERAL identity anchor | STEWARD_DEFINED |
| observation | DEFINED | Atomic evidence = FieldObservation | STEWARD_DEFINED |
| dimension | DEFINED | Conceptual FieldDimension; GENERAL core classes sealed | STEWARD_DEFINED |
| relationship | PARTIAL | Kinds listed; no causal assertion; RELATIONAL required in GENERAL | STEWARD_DEFINED |
| time | DEFINED | Past/present/predicted/shadow-future separation | PROPOSED_SPECIFICATION |
| sequence | PARTIAL | S(n)→S(n+1) recording; no transition math | PROPOSED_SPECIFICATION |
| state | DEFINED | State class separation preserved | PROPOSED_SPECIFICATION |
| provenance | DEFINED | Provenance class set | PROPOSED_SPECIFICATION |
| uncertainty | DEFINED | FieldUncertainty structured non-numeric default | STEWARD_DEFINED |
| field unit | DEFINED | No universal fixed cell | STEWARD_DEFINED |
| resolution | DEFINED (policy) | No global fixed resolution | DERIVED_ARCHITECTURE |
| representation | DEFINED | HYBRID = event/state stream + graph + optional domain | STEWARD_DEFINED |
| Shadow representation | PARTIAL | Storage capability; no operator | PROPOSED_SPECIFICATION |
| Micro | PARTIAL | Architectural grain | PROPOSED_SPECIFICATION |
| Meso | DEFERRED | Cluster concept only | PROPOSED_ARCHITECTURE |
| Macro | DEFERRED | Aggregate concept only | PROPOSED_ARCHITECTURE |
| MiniBot read | DEFINED (rules) | Read-only scoped views | PROPOSED_SPECIFICATION |
| QOSMEI relationship | DEFERRED | Proposed fusion input | PROPOSED_ARCHITECTURE |
| Z-AAI relationship | DEFERRED | Consumer of scoped evidence | PROPOSED_ARCHITECTURE |
| Combat specialization | PARTIAL | Profile architecture; cm Combat-specific | SEALED + PROPOSED |

**Maturity after Steward P0 1.1:** **F3 SPECIFICATION** on GENERAL typed contracts — **not** F4–F6. Implementation not authorized.

## Missing Mathematics

- Transition function S(n)→S(n+1)
- Micro→Meso→Macro aggregation
- Shadow operator
- Z-Mega / LPBS / Ultra formulas (out of scope)
- 360 completeness metric (remains UNDEFINED)
- Universal numeric uncertainty (forbidden; domain numeric allowed later)
- Global resolution values

## Missing Canon / P1

- Dimension registry as governed non-runtime artifact
- Shadow taxonomy / operator
- Micro→Meso→Macro formal model
- Combat specialization charter
- Adapter charters (GGAESP / KairoCell / LPBS / …)
- Structural semantic golden pack (design next — not created here)

## Steward Decisions Required (P0)

| # | Decision | Status |
| --- | --- | --- |
| 1 | GENERAL 360 meaning | **CLOSED** — MULTI_PERSPECTIVE_SURROUND_COMPLETENESS |
| 2 | Universal field unit | **CLOSED** — NO fixed cell; FieldObservation atomic |
| 3 | GENERAL minimum profile | **CLOSED** — ENTITY+TIME+SEQUENCE+STATE+RELATIONSHIPS+PROVENANCE+UNCERTAINTY |
| 4 | Uncertainty representation | **CLOSED** — FieldUncertainty structured non-numeric |
| 5 | Starting representation | **CLOSED** — HYBRID |

P1 remains open (see Missing Canon / P1).

## Golden Readiness

```text
CONTINUOUS_360_GOLDEN_PARTIAL
FIELD_SPEC_READY_FOR_GOLDEN_DESIGN
```

P0 blockers cleared. Structural semantic goldens may now be **designed** (representation invariants), not numerical answers. Golden pack **not created** in this gate.

Allowed future golden themes (examples only):

- observed remains OBSERVED; AI proposal remains AI_PROPOSED
- Shadow ≠ observed; missing ≠ zero; conflict preserved
- history retained after update; Combat spatial stays domain-specific
- more observers ≠ more authority

## Implementation Readiness

```text
FIELD_SPEC_READY_FOR_GOLDEN_DESIGN
IMPLEMENTATION = NOT_AUTHORIZED
```

**Implementation not authorized.** Ready for a golden-design charter only.

## Recommended Next Gate

```text
ONE: Continuous 360 Semantic Goldens Design
     (representation invariants · no runtime · no invented numbers)

Alternate: Formula Shadow taxonomy / specification
```

Still **no** Z-AAI / Swarm / MiniBot activation.

---

## Terminal Classification

```text
CONTINUOUS_360_MULTIDIMENSIONAL_FIELD_SPEC_1 = REFINED_BY_STEWARD_P0_1_1
MATURITY = F3
GOLDEN_DESIGN = READY
GOLDEN_PACK = NOT_CREATED
IMPLEMENTATION = NOT_STARTED
PRODUCTION_AUTHORITY = NONE
```
