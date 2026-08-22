# Z-SANCTUARY-MICRO-MESO-MACRO-AGGREGATION-SPEC-1

**Status:** Aggregation architecture · **F2 / partial F3** · **no aggregation engine**  
**Date:** 2026-08-22  
**Baseline HEAD:** `cf86146`  
**Branch:** `cursor/zsanctuary/z-sdc-phase-0-architecture`  
**Mode:** RECOVER · DEFINE GRAINS · DEFINE AGGREGATION CONTRACTS · NO IMPLEMENTATION

## Baseline

| Field | Value |
| --- | --- |
| Expected HEAD | `cf86146` |
| Actual start HEAD | `cf86146` |
| Prior seals | C360 F3+F4 · Shadow taxonomy F2/partial F3 · Z Logic Spec 0 |
| Staged | NONE |
| Dirt | Preserved (~183 porcelain lines) |
| C360 F4 goldens | **NOT MODIFIED** |
| Shadow taxonomy | **NOT MODIFIED** |
| Z Logic spec | **NOT MODIFIED** |
| Identity registry | **NOT MODIFIED** |

## Purpose

Specify how MICRO → MESO → MACRO may structure progressively larger representations **without** erasing source evidence, collapsing provenance/uncertainty, deleting conflicts, mixing Shadow/AI into unlabeled observed Macro, inventing aggregation mathematics, or creating a universal `MACRO_TRUTH`.

## Historical Recovery

| Source | Finding | Class |
| --- | --- | --- |
| C360 Field Spec §Micro/Meso/Macro | Grains proposed; aggregation math **MISSING** | PROPOSED_ARCHITECTURE |
| Shadow Taxonomy Spec | Base / Shadow lanes; Macro Shadow must be traceable; non-mixing law | CURRENT_DOC |
| Z Logic Spec 0 | Logic may apply at MICRO/MESO/MACRO; no aggregation math | CURRENT_DOC |
| Grand Consolidation | Micro→Meso→Macro formal model proposed; Z-AAI-μ/M/Ω scales | PROPOSED_ARCHITECTURE |
| Identity registry `micro-meso-macro-formal-model` | Proposed ID only | CURRENT_REGISTRY |
| QOSMEI fusion (`z_qosmei_signal_fusion.mjs`) | Advisory multi-signal fuse; ≠ field aggregation | CURRENT_EXECUTABLE |
| Insight Lab “micro → macro” | Separate dashboard lane — **quarantined** from this contract | CURRENT_DOC |
| Formula Swarm / Ultra MAGE / 14DRP / Whale Bus | Governance / swarm / bus — no sealed aggregation operators | mixed |

**Law:** Shared vocabulary ≠ shared implementation.

---

## Core Aggregation Laws

```text
MACRO MUST REMAIN TRACEABLE TO MICRO
AGGREGATION ≠ TRUTH CREATION
SUMMARY ≠ OBSERVATION
AGGREGATION ≠ AUTHORIZATION
BROADER VIEW ≠ HIGHER AUTHORITY
```

Preferred Macro terminology (`PROPOSED_SPECIFICATION`):

> **MacroRepresentation** — a higher-level, traceable representation of a broader system/context.  
> Not ground truth. Not automatic authority.

Alternate candidate (Steward may prefer): `MacroState` (lane-tagged, parallel to FieldState vocabulary).  
**Do not invent `MACRO_TRUTH`.**

---

## Micro Definition

```text
MICRO = CONTEXTUAL GRAIN
≠ FIXED UNIVERSAL TYPE
```

> A Micro element is the **smallest independently traceable** evidence/state element used by a **specific aggregation context**.

Examples (illustrative, not exclusive types): FieldObservation · individual FieldState · single relationship · single formula-derived result · single bounded MiniBot report · single ShadowState.

Atomic sealed evidence type remains **FieldObservation** (C360 Steward P0). Micro grain is architectural, not a new universal cell/voxel.

### Micro must retain type

Origin / state class **must not be lost**:

```text
OBSERVED · FORMULA_DERIVED · SHADOW · AI_PROPOSED · SIMULATION · RELATIONSHIP · OTHER_DEFINED
```

Names above are illustrative. Invariant: **MICRO ORIGIN / STATE CLASS MUST NOT BE LOST**.

## Micro Identity / Provenance

| Property | Status |
| --- | --- |
| micro_ref | REQUIRED |
| source_ref | REQUIRED |
| state_class | REQUIRED |
| provenance | REQUIRED |
| time | REQUIRED (concept; see Event/Ingest) |
| uncertainty | REQUIRED concept (C360 structures) |
| domain | OPTIONAL |

No schema implemented.

## Meso Definition

> A Meso representation is a **bounded grouping or relational structure** composed from **explicitly referenced** Micro elements for a **declared purpose/context**.

Not automatically a numerical average. No aggregation formula.

Possible examples: local sequence · relationship cluster · entity neighborhood · time-window group · formula-result group · bounded domain cluster.

## Meso Membership

```text
MESO_MEMBERSHIP_MUST_BE_INSPECTABLE
```

Membership retains references to contributing Micro elements. Do not erase Micro values merely to simplify.

### Grouping contract

Every Meso grouping declares **why** members belong together:

```text
RELATIONSHIP · ENTITY · TIME_WINDOW · SEQUENCE · DOMAIN · FORMULA_CONTEXT · EXPLICIT_HUMAN_GROUPING · OTHER_DEFINED_RULE
```

No implicit proximity/similarity grouping unless a future domain contract defines it.

## Meso Optionality

```text
MESO_OPTIONAL_WHEN_MEANINGFUL
```

**Not** `MESO_REQUIRED_FOR_EVERY_AGGREGATION`. Simplicity test: do not force artificial Meso where it adds no inspectable value. (`PROPOSED_SPECIFICATION` pending Steward seal.)

## Macro Definition

> A MacroRepresentation is a higher-level, **traceable** representation of a broader system/context derived from explicitly referenced Micro and/or Meso evidence **without** converting the representation itself into ground truth.

Macro may summarize · classify · organize · expose patterns. Macro must not silently invent evidence.

## Macro Lineage

```text
MACRO_WITHOUT_TRACEABLE_LINEAGE = INVALID / INCOMPLETE
```

**P0 candidate — sealed as architectural intent:** every MacroRepresentation must identify contributing Meso groups and/or Micro elements (and transformations).

## Direct Micro → Macro

```text
DIRECT MICRO → MACRO = ALLOWED
```

when a simple case needs no intermediate grouping (`DOMAIN_DEFINED` profiles may restrict). Artificial Meso is not required. (`PROPOSED_SPECIFICATION`.)

---

## Aggregation Operation Contract

Aggregation is **not** one universal mathematical operator.

Conceptual `AggregationOperation` metadata (architecture only):

| Field | Role |
| --- | --- |
| operation_id | Identity |
| purpose | Declared why |
| input_refs | Traceable inputs |
| input_classes | State/origin classes |
| output_grain | MICRO / MESO / MACRO |
| transformation_class | See below |
| provenance_policy | How provenance propagates |
| uncertainty_policy | Traceable; no invented average |
| conflict_policy | Preserve / surface |
| authority_ceiling | Never self-elevate |
| traceability_requirement | Mandatory lineage |

```text
MICRO_MESO_MACRO_MATH = NOT YET ESTABLISHED
UNIVERSAL AGGREGATE(A,B,C) = NOT DEFINED
```

## Aggregation Classes

Transformation classes (`DEFINED` as conceptual vocabulary; not operators):

```text
GROUPING
RELATIONSHIP_PROJECTION
SUMMARY
CLASSIFICATION
SEQUENCE_WINDOW
FORMULA_DERIVATION
DOMAIN_DEFINED
COMPARE
```

Justified terms only. No numeric semantics invented.

---

## Base Lane

```text
BASE MICRO → BASE MESO → BASE MACRO
```

Observed/base evidence aggregates only within the base lane (plus explicitly base-classified inputs). Formula-derived results that are **not** Shadow remain distinguishable (see Formula-Derived Lane) and must not be silently labeled OBSERVED.

## Shadow Lane

```text
SHADOW MICRO → SHADOW MESO → SHADOW MACRO
```

Then:

```text
BASE ↔ COMPARE ↔ SHADOW
```

**Forbidden:**

```text
BASE + SHADOW → UNLABELED MACRO
```

Shadow Meso/Macro preserve: `shadow_id` · `base_reference` · `assumptions` · `provenance` (where applicable).

```text
SHADOW INPUT MUST NOT SILENTLY CHANGE BASE AGGREGATION
```

Comparison outputs are **comparison / analysis**, not OBSERVED Macro.

## Formula-Derived Lane

```text
OBSERVED BASE → FORMULA ENGINE → FORMULA_DERIVED
```

Macro containing formula-derived components retains formula identity/version. Never relabel as observed evidence.

## AI-Proposed Lane

AI Micro/Meso/Macro candidates retain `AI_PROPOSED` (or equivalent explicit AI origin). No AI Macro becomes HUMAN_CONFIRMED / OBSERVED / CANONICAL without the acceptance pathway. Steward acceptance of an **action** does not rewrite original provenance to SENSOR_OBSERVED.

## Mixed Analytical Views

```text
MIXED_ANALYTICAL_VIEW = ALLOWED (PROPOSED_SPECIFICATION)
```

when comparison intentionally combines observed · formula-derived · Shadow · AI-proposed.  
**Must not** be labeled `OBSERVED_MACRO`. Must declare contributing classes and lanes.

Conceptual `MacroComparison` (if used): base_macro_ref · shadow_macro_ref(s) · differences · assumptions · provenance · uncertainty — **no score, no winner**.

---

## Provenance Propagation

Macro provenance **references contributor provenance** — it does not collapse to `"trusted"`.

```text
PROVENANCE LINEAGE REQUIRED
PROVENANCE SCORE / TRUST AVERAGE = NOT INVENTED
```

## Uncertainty Propagation

```text
UNCERTAINTY_AGGREGATION_OPERATOR = UNDEFINED
```

Do not average uncertainties. Macro uncertainty remains **traceable** to contributing conditions (C360 structures: NOT_ASSESSED · QUALITATIVE · QUANTIFIED).

## Conflict Propagation

```text
UNRESOLVED MICRO CONFLICT MUST REMAIN REPRESENTABLE AT HIGHER GRAIN
```

No majority vote. No average. No silent single-side choice.

Meso may signal `CONFLICT_PRESENT` without claiming resolution.  
Macro must not claim clean consensus when material lower-level conflict is unresolved (**P0**).

## Unknown / Missing Handling

```text
UNKNOWN / MISSING / NOT_APPLICABLE ≠ ZERO
```

Do not drop them solely to simplify Macro. Macro may represent coverage incomplete / missing / unknown / N/A dimensions **without** inventing a completeness percentage.

Preserve:

```text
360_COMPLETENESS_METRIC = UNDEFINED
```

No “100% complete system view” claims.

---

## Time / Sequence Aggregation

Architecture may group by event time · sequence · window · history · current state.  
**No window sizes invented.**

Example pattern: Micro events → bounded temporal Meso → historical Macro view.

## Event Time / Ingest Time

```text
EVENT_TIME ≠ INGEST_TIME ≠ SEQUENCE_INDEX
```

Explicit distinction is a **P0/P1 requirement** for aggregation (C360 remaining gap). Semantics beyond field support are not invented here.

## Relationship Aggregation

Higher-grain relationship views preserve: source · target · type · time/version · provenance.

```text
CORRELATION ≠ CAUSATION
GRAPH TOPOLOGY ≠ TRUTH
CONNECTED ≠ CAUSAL
```

Hybrid field: graphs may support grouping; event streams may provide temporal lineage. Neither required for every element. No graph runtime.

## Versioning

```text
AGGREGATION UPDATE ≠ SILENT OVERWRITE
```

Macro(n) → Macro(n+1) preserves prior versions where retention permits.

If Micro evidence changes or is retracted: Macro v1 remains historical; Macro v2 reflects corrected evidence with explicit reason.

## Reproducibility / Recomputation

Future Macro views should be reproducible from: input refs · aggregation contract/version · relevant configuration. Architecture invariant — **not implemented**.

## Formula Version Traceability

Formula contributions retain engine/version identity (e.g. GGAESP vX). No formula semantics changed in this gate.

---

## Continuous 360 Relationship

C360 core (ENTITY · TIME · SEQUENCE · STATE · RELATIONSHIPS · PROVENANCE · UNCERTAINTY) remains the field substrate. Aggregation sits **above** grains without changing F3/F4.

**F4 compatibility:** C360-D1/D2/C1 support separate lanes and forbid silent merge — **no C360_F4 conflict discovered**.

## Shadow Relationship

Shadow taxonomy unchanged. Accepted reasoning classes (Counterfactual · Alternative-State · AI-Proposed) remain SUPPORTED_NEW_SPEC. Shadow engine still NONE.

## Z Logic Relationship

Z Logic may later govern FOR EACH / IF conflict / IF Shadow lane / IF AI_PROPOSED / MATCH state_class routing. Recommendations only — **Z Logic spec not amended**. Runtime NONE.

## GGAESP Relationship

| Direction | Status |
| --- | --- |
| MacroRepresentation → adapter → GGAESP | PROPOSED |
| GGAESP result → formula-derived Micro/Meso | PROPOSED / partial CURRENT (GGAESP as formula engine) |

GO / PREPARE / HOLD / BLOCK remain attributable to GGAESP (or named engine). **GO ≠ Macro truth ≠ deploy authority.** GGAESP semantics **unchanged**.

## LPBS Relationship

```text
LPBS_AGGREGATION_RELATIONSHIP = NOT_ESTABLISHED
```

No LPBS∞ / Z-Mega definitions.

## MiniBot Relationship

READ ONLY by default. MiniBot output may become a Micro element **only** with AI provenance. Cannot rewrite aggregation base. Not activated.

## Swarm Relationship

```text
SWARM MAJORITY ≠ GROUND TRUTH
SWARM VOTE → MACRO = NOT DEFINED
```

Swarm may supply multiple AI-proposed candidates. No algorithm. Not activated.

## QOSMEI vs Aggregation

| | Aggregation | QOSMEI fusion |
| --- | --- | --- |
| Role | Structures / rolls up **traceable field grains** | Advisory fusion across **signal families** |
| Output | MacroRepresentation (or lower grain) | Advisory fusion result |
| Authority | None | None (`≠ AUTHORIZATION`) |

```text
QOSMEI OUTPUT ≠ MACRO STATE AUTOMATICALLY
QOSMEI FUSION ≠ GENERIC AGGREGATION
```

QOSMEI may contribute derived/advisory input to a MIXED_ANALYTICAL_VIEW. No implementation change.

## Z-AAI Relationship

Future Z-AAI may consume Micro/Meso/Macro · Shadow lanes · conflicts · uncertainty · provenance.

```text
Z-AAI MACRO EXPLANATION SHOULD BE TRACEABLE TO SUPPORTING MESO / MICRO REFS
```

No AI implementation. Z-AAI ≠ AGI/autonomy.

## Combat / Domain Profiles

Combat remains DOMAIN_SPECIFIC. 4–5 cm voxels stay Combat-local. Generic architecture defines **contracts**, not universal measurements. Domain profiles may specialize Micro grain / Meso grouping / Macro purpose (Combat ≠ project governance ≠ resource monitoring).

---

## Explainability Contract

P0 candidate — every non-trivial Meso/MacroRepresentation should eventually answer:

WHAT represented? WHICH contributors? WHY grouped? WHICH transformation? Conflicts? Uncertainty? Observed vs derived vs Shadow vs AI? Authority ceiling?

## Authority Contract

```text
MICRO ≠ AUTHORITY
MESO ≠ AUTHORITY
MACRO ≠ AUTHORITY
AGGREGATION ≠ AUTHORIZATION
BROADER VIEW ≠ HIGHER AUTHORITY
MORE MICRO ≠ MORE TRUTH
MORE MESO ≠ MORE TRUTH
LARGER MACRO ≠ CERTAINTY
CONSENSUS ≠ AUTHORITY
HIGH PRIORITY ≠ HIGH CONFIDENCE
LARGE MACRO IMPACT ≠ CERTAIN RESULT
```

## Aggregation Receipt

Future conceptual receipt (not implemented): aggregation_id · grain_from · grain_to · input_refs · grouping_basis · operation_class · output_ref · provenance · uncertainty · conflicts · shadow_lane · operation_version · authority_ceiling.

## Boundedness

```text
Z_INFINITY ≠ UNBOUNDED_AGGREGATION
```

Bounded entity set · time window · relationship scope · query scope · domain — numbers not invented.

## Performance / TEVV Questions

Future measures (no targets): Micro/Meso/Macro counts · relationships · traceability cost · memory · latency · update/recompute cost · Shadow-lane overhead.

## Information Loss

```text
AGGREGATION_LOSS_MUST_NOT_BE_HIDDEN
```

Disclose what was omitted · summarized · preserved. No numerical loss metric yet.

## Lossless vs Lossy

| Class | Meaning |
| --- | --- |
| LOSSLESS_REFERENCE_AGGREGATION | Grouping/linking with full membership refs |
| LOSSY_SUMMARY | Compressed view that **must retain source refs** |

First-class classification = **PROPOSED** (Steward may seal).

## Traceability vs Reversibility

```text
TRACEABILITY REQUIRED
REVERSIBILITY NOT UNIVERSALLY REQUIRED
```

## Privacy / Retention

```text
AUDITABILITY subject to PRIVACY / RETENTION GOVERNANCE
```

Traceability ≠ infinite retention. No periods invented.

---

## Side-effect / Determinism

```text
AGGREGATION MUST NOT MUTATE INPUT EVIDENCE
```

Produces a new higher-grain representation.

Per-operation determinism class (declare when known): DETERMINISTIC · DOMAIN_DEPENDENT · AI_ASSISTED · HUMAN_DECIDED · UNKNOWN.  
AI-assisted aggregation retains AI_ASSISTED / AI_PROPOSED provenance.

---

## P0 Invariants

| Invariant | Status |
| --- | --- |
| MACRO MUST REMAIN TRACEABLE TO MICRO | **YES** |
| MESO MEMBERSHIP MUST BE INSPECTABLE | **YES** |
| AGGREGATION ≠ TRUTH CREATION | **YES** |
| SUMMARY ≠ OBSERVATION | **YES** |
| AGGREGATION ≠ AUTHORIZATION | **YES** |
| BROADER VIEW ≠ HIGHER AUTHORITY | **YES** |
| BASE AND SHADOW AGGREGATE IN SEPARATE LANES | **YES** |
| SHADOW INPUT MUST NOT SILENTLY ALTER BASE | **YES** |
| AI-PROPOSED RETAINS AI PROVENANCE | **YES** |
| FORMULA-DERIVED RETAINS FORMULA PROVENANCE | **YES** |
| CONFLICT MUST NOT BE SILENTLY ERASED | **YES** |
| UNKNOWN / MISSING MUST NOT BECOME ZERO | **YES** |
| STATE UPDATE ≠ SILENT OVERWRITE | **YES** |
| AGGREGATION SHOULD NOT MUTATE SOURCE EVIDENCE | **YES** |
| LOSSY SUMMARY MUST RETAIN SOURCE TRACEABILITY | **YES** |
| TRACEABILITY ≠ REVERSIBILITY | **YES** |
| QOSMEI FUSION ≠ GENERIC AGGREGATION | **YES** |
| SWARM MAJORITY ≠ MACRO TRUTH | **YES** |
| Z_INFINITY ≠ UNBOUNDED AGGREGATION | **YES** |

## Formal Contract Matrix

| Property | Definition | Status | Provenance |
| --- | --- | --- | --- |
| Micro | Contextual smallest traceable grain | DEFINED | C360 + this spec |
| Meso | Bounded grouping from Micro refs | DEFINED | this spec |
| Macro | Traceable higher-level MacroRepresentation | DEFINED (term PROPOSED) | this spec |
| Micro identity | micro_ref · source · class · provenance · time · uncertainty | DEFINED | this spec |
| Meso membership | Inspectable Micro refs + grouping basis | DEFINED | this spec |
| Macro lineage | Trace to Meso and/or Micro | DEFINED | this spec |
| Direct Micro→Macro | Allowed for simple cases | PARTIAL (Steward seal) | this spec |
| Shadow lane | Parallel aggregate then COMPARE | DEFINED | Shadow + this |
| Formula-derived lane | Retain formula provenance | DEFINED | this spec |
| AI-proposed lane | Retain AI provenance | DEFINED | this spec |
| Mixed analytical view | Allowed; not OBSERVED_MACRO | PARTIAL | this spec |
| Provenance propagation | Lineage refs; no trust score | DEFINED | this spec |
| Uncertainty propagation | Traceable; operator UNDEFINED | PARTIAL | this spec |
| Conflict propagation | Representable; no silent erase | DEFINED | C360 F4 + this |
| Versioning | No silent overwrite | DEFINED | this spec |
| Time aggregation | Windows/sequence conceptual | PARTIAL | this spec |
| Relationship aggregation | Preserve endpoints/type/provenance | DEFINED | C360 + this |
| Loss disclosure | Must not hide loss | DEFINED | this spec |
| Authority | None at any grain | DEFINED | this spec |
| Boundedness | Required; no numeric limits | DEFINED | this spec |

## Missing Mathematics

- Aggregation numeric operators (Σ, average, weights)
- Uncertainty aggregation operator
- Conflict scoring
- Completeness / coverage %
- Information-loss metric
- MICRO_MESO_MACRO_MATH

## Missing Canon

- Steward seal of Macro term (`MacroRepresentation` vs `MacroState`)
- Steward seal of Meso optionality + direct Micro→Macro
- Mixed analytical view naming finalization
- Lossless/lossy as first-class
- Event/ingest/sequence formal field binding
- Macro conflict surface representation details
- Semantic goldens for aggregation

## Steward Decisions Required

| Decision | Options |
| --- | --- |
| Canonical Macro term | MacroRepresentation (recommended) / MacroState / other |
| Meso optionality | OPTIONAL_WHEN_MEANINGFUL (recommended) / always required |
| Direct Micro→Macro | ALLOWED (recommended) / DISALLOWED / domain-only |
| Mixed analytical views | ALLOWED with label (recommended) / restricted |
| Aggregation purity | MUST NOT MUTATE inputs (recommended sealed) |
| Minimum grouping-basis metadata | Confirm RELATIONSHIP…OTHER list |
| Lossless/lossy first-class | YES (recommended) / later |
| Macro conflict surface form | Domain-defined later / early golden design |

## Maturity

```text
MICRO→MESO→MACRO AGGREGATION ≈ F2 / PARTIAL F3
NO engine · NO math · NO goldens encoded
```

## Golden Readiness

```text
MICRO_MESO_MACRO_GOLDEN_PARTIAL
```

Enough structure to **design** P0 expected vectors (lane separation, lineage, conflict, AI/Shadow non-collapse). Not ready to encode until Steward seals Macro term + Meso optionality (thin P0).

## ONE Recommended Next Gate

```text
Z-MICRO-MESO-MACRO-SEMANTIC-GOLDENS-DESIGN-1
```

**Why:** Aggregation structure is now specified; next design P0 expected vectors for lane separation, lineage, conflict preservation, and non-truth Macro — parallel to C360 goldens path — **without** implementing an engine.

Alternate if Steward wants term/optionality sealed first: thin Steward P0 answers (same session or short doc).  
**Not opened here.** Shadow P0 and Z Logic goldens remain valid later lanes; aggregation goldens best unlock Micro/Meso/Macro semantic regression before runtime.

## Future Mathematical Questions (unanswered)

Which operations preserve invariants? What is lost? Which summaries are stable? How do conflicts/uncertainty propagate numerically? When is Meso useful? When may Micro→Macro directly? How do Shadow lanes aggregate? When do Macro views converge/diverge?

## Terminal

```text
MICRO_MESO_MACRO_AGGREGATION_SPEC_1 = SEALED_DOCS
AGGREGATION_ENGINE = NONE
MICRO_MESO_MACRO_MATH = NOT YET ESTABLISHED
C360_F4 = PRESERVED
SHADOW_PARALLELISM = PRESERVED
PRODUCTION_AUTHORITY = NONE
```
