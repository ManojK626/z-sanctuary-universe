# Z-SANCTUARY-MICRO-MESO-MACRO-AGGREGATION-SPEC-1

**Status:** Aggregation architecture · **F3 SPECIFICATION** · **no aggregation engine**
**Date:** 2026-08-22
**Baseline HEAD:** `cf86146` (refined at Steward P0 `36fd38e`+)
**Branch:** `cursor/zsanctuary/z-sdc-phase-0-architecture`
**Mode:** RECOVER · DEFINE GRAINS · DEFINE AGGREGATION CONTRACTS · STEWARD P0 REFINED · NO IMPLEMENTATION
**Steward P0 receipt:** `docs/Z_MICRO_MESO_MACRO_STEWARD_P0_DECISIONS_1_1.md`

## Baseline

| Field | Value |
| --- | --- |
| Expected HEAD | `cf86146` |
| Actual start HEAD | `cf86146` |
| Prior seals | C360 F3+F4 · Shadow taxonomy F2/partial F3 · Z Logic Spec 0 |
| Steward P0 | Recorded in companion receipt 1.1 |
| Staged | NONE |
| Dirt | Preserved (~183 porcelain lines at Spec-1 seal; see P0 note if restore incident) |
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

Canonical Macro terminology (`STEWARD_DEFINED`):

```text
CANONICAL_MACRO_TERM = MacroRepresentation
```

> **MacroRepresentation** — a higher-level, traceable representation of a broader system/context
> (may include state, relationships, summaries, classifications, formula-derived material, or analytical comparisons).

```text
MacroRepresentation ≠ MACRO_TRUTH
MacroRepresentation ≠ OBSERVED_STATE automatically
MacroRepresentation ≠ ObservedState
```

**Do not invent `MACRO_TRUTH`.** `MacroState` remains a non-canonical alternate label only.

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

Every Meso grouping and every non-trivial aggregation declares **why** members belong together (`STEWARD_DEFINED`):

```text
AGGREGATION_GROUPING_BASIS_REQUIRED = YES
```

Valid basis classes (one declared basis may suffice):

```text
RELATIONSHIP · ENTITY · TIME_WINDOW · SEQUENCE · DOMAIN · FORMULA_CONTEXT · EXPLICIT_HUMAN_GROUPING · OTHER_DEFINED_RULE
```

No hidden clustering. No silent similarity grouping. No implicit proximity unless a future domain contract defines it.

## Meso Optionality

```text
MESO = OPTIONAL_WHEN_MEANINGFUL
```

`STEWARD_DEFINED`. **Not** `MESO_REQUIRED_FOR_EVERY_AGGREGATION`. Do not create artificial Meso layers merely to satisfy hierarchy. Both paths remain valid:

```text
Micro → Meso → Macro
Micro → Macro
```

## Macro Definition

> A MacroRepresentation is a higher-level, **traceable** representation of a broader system/context derived from explicitly referenced Micro and/or Meso evidence **without** converting the representation itself into ground truth.

Macro may summarize · classify · organize · expose patterns. Macro must not silently invent evidence.

## Macro Lineage

```text
MACRO_LINEAGE_REQUIRED = YES
MACRO_WITHOUT_TRACEABLE_LINEAGE = INVALID_OR_INCOMPLETE
MACRO MUST REMAIN TRACEABLE TO MICRO
```

`STEWARD_DEFINED`. Lineage may reference Micro directly, Meso groups, or both. Even on Micro→Meso→Macro paths, Macro must ultimately remain traceable to Micro-level evidence.

## Direct Micro → Macro

```text
DIRECT_MICRO_TO_MACRO = ALLOWED
```

`STEWARD_DEFINED`, subject to: explicit aggregation purpose · traceable Micro refs · preserved provenance · uncertainty · conflict · state class · defined operation contract. This does **not** mean all domains should skip Meso.

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
| grouping_basis | Required (`STEWARD_DEFINED`) |
| loss_class | Required (`STEWARD_DEFINED`) |
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
MIXED_ANALYTICAL_VIEW_ALLOWED = YES
MIXED_ANALYTICAL_VIEW ≠ OBSERVED_MACRO
MIXED_ANALYTICAL_VIEW ≠ GROUND_TRUTH
```

`STEWARD_DEFINED`. A deliberately analytical view may reference observed/base · formula-derived · Shadow · AI-proposed **only if** mixed nature is explicit and every contributing lane remains distinguishable. Cannot redefine Base or Shadow source lanes.

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
MATERIAL_CONFLICT_MUST_SURFACE_AT_MACRO = YES
CONFLICT_PRESENT ≠ CONFLICT_RESOLVED
```

`STEWARD_DEFINED`. No majority vote. No average. No silent single-side choice.

A MacroRepresentation materially affected by unresolved lower-level conflict must surface:

```text
conflict_status = CONFLICT_PRESENT
conflict_refs = [...]
```

(conceptual only — no schema). No majority vote · no averaging · no AI selection · no provenance-based automatic winner.

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
EVENT_INGEST_BINDING = DEFERRED_P1
```

`STEWARD_DEFINED` deferral. Distinction preserved; ordering precedence **not** invented in Steward P0.

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

Future conceptual receipt (not implemented): aggregation_id · grain_from · grain_to · input_refs · grouping_basis · operation_class · output_ref · provenance · uncertainty · conflicts · shadow_lane · operation_version · authority_ceiling · loss_class.

## Boundedness

```text
Z_INFINITY ≠ UNBOUNDED_AGGREGATION
```

Bounded entity set · time window · relationship scope · query scope · domain — numbers not invented.

## Performance / TEVV Questions

Future measures (no targets): Micro/Meso/Macro counts · relationships · traceability cost · memory · latency · update/recompute cost · Shadow-lane overhead.

## Information Loss

```text
AGGREGATION_LOSS_MUST_NOT_BE_HIDDEN = YES
```

`STEWARD_DEFINED`. Disclose what was omitted · summarized · preserved. No `information_loss_score` · percentage · compression_ratio unless a future domain specification supports one.

## Lossless vs Lossy

```text
AGGREGATION_LOSS_CLASS_REQUIRED = YES
```

`STEWARD_DEFINED`. Every future aggregation operation declares one of:

| Class | Meaning |
| --- | --- |
| LOSSLESS_REFERENCE_AGGREGATION | Higher-level structure preserves refs so contributors remain fully available through lineage (≠ mathematical reversibility) |
| LOSSY_SUMMARY | Detail intentionally omitted/compressed; underlying source refs remain traceable where governance permits |
| DOMAIN_DEFINED | Domain supplies loss character |
| UNASSESSED | Loss character not yet classified |

## Traceability vs Reversibility

```text
TRACEABILITY REQUIRED
REVERSIBILITY NOT UNIVERSALLY REQUIRED
TRACEABILITY ≠ REVERSIBILITY
```

## Privacy / Retention

```text
AUDITABILITY subject to PRIVACY / RETENTION GOVERNANCE
```

Traceability ≠ infinite retention. No periods invented.

---

## Side-effect / Determinism

```text
AGGREGATION_MUST_NOT_MUTATE_SOURCE_EVIDENCE = YES
```

`STEWARD_DEFINED` (constitutional purity). Aggregation creates a **new** Meso/MacroRepresentation; it does not rewrite contributing Micro evidence in place. Source remains independently inspectable subject to privacy/retention governance.

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
| AGGREGATION MUST NOT MUTATE SOURCE EVIDENCE | **YES** (`STEWARD_DEFINED`) |
| LOSSY SUMMARY MUST RETAIN SOURCE TRACEABILITY | **YES** |
| AGGREGATION_LOSS_CLASS_REQUIRED | **YES** (`STEWARD_DEFINED`) |
| GROUPING BASIS REQUIRED | **YES** (`STEWARD_DEFINED`) |
| MATERIAL CONFLICT MUST SURFACE AT MACRO | **YES** (`STEWARD_DEFINED`) |
| TRACEABILITY ≠ REVERSIBILITY | **YES** |
| QOSMEI FUSION ≠ GENERIC AGGREGATION | **YES** |
| SWARM MAJORITY ≠ MACRO TRUTH | **YES** |
| Z_INFINITY ≠ UNBOUNDED AGGREGATION | **YES** |

## Formal Contract Matrix

| Property | Definition | Status | Provenance |
| --- | --- | --- | --- |
| Micro | Contextual smallest traceable grain | DEFINED | C360 + this spec |
| Meso | Bounded grouping from Micro refs | DEFINED | this spec |
| Macro | Traceable MacroRepresentation | DEFINED (`STEWARD_DEFINED` term) | this + P0 1.1 |
| Micro identity | micro_ref · source · class · provenance · time · uncertainty | DEFINED | this spec |
| Meso membership | Inspectable Micro refs + grouping basis | DEFINED | this + P0 |
| Macro lineage | Trace to Meso and/or Micro | DEFINED (`STEWARD_DEFINED`) | this + P0 |
| Direct Micro→Macro | ALLOWED with contract preconditions | DEFINED (`STEWARD_DEFINED`) | P0 1.1 |
| Shadow lane | Parallel aggregate then COMPARE | DEFINED | Shadow + this |
| Formula-derived lane | Retain formula provenance | DEFINED | this spec |
| AI-proposed lane | Retain AI provenance | DEFINED | this spec |
| Mixed analytical view | ALLOWED; ≠ OBSERVED_MACRO | DEFINED (`STEWARD_DEFINED`) | P0 1.1 |
| Provenance propagation | Lineage refs; no trust score | DEFINED | this spec |
| Uncertainty propagation | Traceable; operator UNDEFINED | PARTIAL | this spec |
| Conflict propagation | CONFLICT_PRESENT + conflict_refs at Macro | DEFINED (`STEWARD_DEFINED`) | P0 1.1 |
| Versioning | No silent overwrite | DEFINED | this spec |
| Time aggregation | Windows/sequence conceptual | PARTIAL | this spec |
| Event/ingest binding | Distinction preserved; precedence deferred | DEFERRED_P1 | P0 1.1 |
| Relationship aggregation | Preserve endpoints/type/provenance | DEFINED | C360 + this |
| Loss disclosure | Loss class required; must not hide | DEFINED (`STEWARD_DEFINED`) | P0 1.1 |
| Authority | None at any grain | DEFINED | this spec |
| Boundedness | Required; no numeric limits | DEFINED | this spec |
| Non-mutation | Aggregation creates new representation | DEFINED (`STEWARD_DEFINED`) | P0 1.1 |

## Missing Mathematics

- Aggregation numeric operators (Σ, average, weights)
- Uncertainty aggregation operator
- Conflict scoring
- Completeness / coverage %
- Information-loss metric
- MICRO_MESO_MACRO_MATH

## Missing Canon

- Event/ingest/sequence formal field binding (`DEFERRED_P1`)
- Uncertainty aggregation operator (still UNDEFINED)
- Semantic goldens for aggregation (next design gate)
- Runtime schemas / engines (hard closed)

## Steward Decisions Required

**P0 closed** — see `docs/Z_MICRO_MESO_MACRO_STEWARD_P0_DECISIONS_1_1.md`. Remaining questions are P1+ (event/ingest binding, uncertainty math, golden encoding).

## Maturity

```text
MICRO→MESO→MACRO AGGREGATION = F3 SPECIFICATION
NO engine · NO math · NO goldens encoded
```

P0 architectural ambiguity closed by Steward. Remaining gaps are P1 binding and F4 golden design — not blocking F3 classification.

## Golden Readiness

```text
MICRO_MESO_MACRO_GOLDEN_READY
```

P0 decisions now sealed; P0 expected vectors may be **designed** (not encoded in this gate).

## ONE Recommended Next Gate

```text
Z-MICRO-MESO-MACRO-SEMANTIC-GOLDENS-DESIGN-1
```

**Why:** Steward P0 closed Macro term, Meso optionality, lanes, purity, loss class, and conflict surface — goldens can now test accepted decisions rather than open questions.

## Future Mathematical Questions (unanswered)

Which operations preserve invariants? What is lost? Which summaries are stable? How do conflicts/uncertainty propagate numerically? When is Meso useful? When may Micro→Macro directly? How do Shadow lanes aggregate? When do Macro views converge/diverge?

## Terminal

```text
MICRO_MESO_MACRO_AGGREGATION_SPEC_1 = SEALED_DOCS
STEWARD_P0_1_1 = RECORDED
AGGREGATION_ENGINE = NONE
MICRO_MESO_MACRO_MATH = NOT YET ESTABLISHED
C360_F4 = PRESERVED
SHADOW_PARALLELISM = PRESERVED
PRODUCTION_AUTHORITY = NONE
```
