# Z-SANCTUARY-MICRO-MESO-MACRO-STEWARD-P0-DECISIONS-1.1

**Status:** Steward P0 decisions recorded · **no implementation**  
**Date:** 2026-08-22  
**Baseline HEAD:** `36fd38e`  
**Branch:** `cursor/zsanctuary/z-sdc-phase-0-architecture`  
**Spec refined:** `docs/Z_MICRO_MESO_MACRO_AGGREGATION_SPEC_1.md`  
**Registry / C360 F4 / Shadow / Z Logic:** untouched

All decisions below are **`STEWARD_DEFINED`**. They refine the aggregation specification; they are **not** recovered historical canon and invent **no** aggregation mathematics.

## Baseline

| Field | Value |
| --- | --- |
| Expected HEAD | `36fd38e` |
| Actual start HEAD | `36fd38e` |
| Prior | Micro→Meso→Macro Aggregation Spec 1 (`36fd38e`) |
| Staged | NONE |
| Dirt | Preserved where possible; see Validation note |
| Mode | STEWARD DECISION RECORD · SPECIFICATION REFINEMENT ONLY |

**Validation note:** During lint prep, a broad `docs/` table-compact + restore briefly touched unrelated tracked docs. Unauthorized paths were restored toward HEAD; **Steward should re-check any intentional dirty docs under `docs/`** that were open before this gate. Authorized seal paths only: this receipt + Aggregation Spec 1.

## Macro Term

**Decision:** ACCEPT `MacroRepresentation`

```text
CANONICAL_MACRO_TERM = MacroRepresentation
MacroRepresentation ≠ MACRO_TRUTH
MacroRepresentation ≠ OBSERVED_STATE automatically
MacroRepresentation ≠ ObservedState
```

Reason: higher-grain output may include state, relationships, summaries, classifications, formula-derived material, or analytical views — not automatically an observed State.

## Meso Optionality

**Decision:** OPTIONAL

```text
MESO = OPTIONAL_WHEN_MEANINGFUL
MESO_REQUIRED_FOR_EVERY_AGGREGATION = NO
```

Both paths valid: `Micro → Meso → Macro` and `Micro → Macro`. No artificial Meso.

## Direct Micro → Macro

**Decision:** ALLOWED

```text
DIRECT_MICRO_TO_MACRO = ALLOWED
```

Subject to: explicit purpose · Micro refs · provenance · uncertainty · conflict · state class · operation contract. Domains may still require Meso.

## Mixed Analytical Views

**Decision:** ALLOWED with explicit label

```text
MIXED_ANALYTICAL_VIEW_ALLOWED = YES
MIXED_ANALYTICAL_VIEW ≠ OBSERVED_MACRO
MIXED_ANALYTICAL_VIEW ≠ GROUND_TRUTH
```

May reference base · formula-derived · Shadow · AI-proposed only when mixed nature is explicit and lanes remain distinguishable.

## Aggregation Non-Mutation

**Decision:** Constitutional purity

```text
AGGREGATION_MUST_NOT_MUTATE_SOURCE_EVIDENCE = YES
```

Aggregation creates a **new** representation; it does not rewrite source evidence in place.

## Grouping Basis

**Decision:** Required and explicit

```text
AGGREGATION_GROUPING_BASIS_REQUIRED = YES
```

One declared basis from: RELATIONSHIP · ENTITY · TIME_WINDOW · SEQUENCE · DOMAIN · FORMULA_CONTEXT · EXPLICIT_HUMAN_GROUPING · OTHER_DEFINED_RULE. No hidden clustering.

## Lossless / Lossy Classification

**Decision:** First-class metadata

```text
AGGREGATION_LOSS_CLASS_REQUIRED = YES
TRACEABILITY ≠ REVERSIBILITY
```

Declare one of: LOSSLESS_REFERENCE_AGGREGATION · LOSSY_SUMMARY · DOMAIN_DEFINED · UNASSESSED. No numeric loss metric.

## Macro Conflict Surface

**Decision:** Surface unresolved material conflict

```text
MATERIAL_CONFLICT_MUST_SURFACE_AT_MACRO = YES
CONFLICT_PRESENT ≠ CONFLICT_RESOLVED
```

Conceptual: `conflict_status = CONFLICT_PRESENT` + `conflict_refs`. No majority · average · AI pick · provenance auto-winner.

## Event / Ingest Deferral

```text
EVENT_TIME ≠ INGEST_TIME ≠ SEQUENCE_INDEX
EVENT_INGEST_BINDING = DEFERRED_P1
```

Ordering precedence not invented here.

## Preserved (unchanged by this gate)

| Law | Status |
| --- | --- |
| UNCERTAINTY_AGGREGATION_OPERATOR = UNDEFINED | Preserved |
| Base / Shadow separate lanes → COMPARE | Preserved |
| FORMULA_DERIVED ≠ OBSERVED | Preserved |
| AI_PROPOSED ≠ OBSERVED | Preserved |
| MESO_MEMBERSHIP_MUST_BE_INSPECTABLE | Preserved |
| MACRO_LINEAGE_REQUIRED / MACRO TRACEABLE TO MICRO | Sealed `STEWARD_DEFINED` |
| AGGREGATION_LOSS_MUST_NOT_BE_HIDDEN | Sealed `STEWARD_DEFINED` |
| MICRO/MESO/MACRO ≠ AUTHORITY | Preserved |
| AGGREGATION ≠ AUTHORIZATION | Preserved |
| BROADER VIEW ≠ HIGHER AUTHORITY | Preserved |

## Revised Maturity

```text
BEFORE: F2 / partial F3
AFTER:  F3 SPECIFICATION
```

P0 architectural ambiguity closed. Still: no engine · no aggregation math · no F4 goldens · event/ingest P1 open · uncertainty operator UNDEFINED.

## Golden Readiness

```text
MICRO_MESO_MACRO_GOLDEN_READY
```

Future design vectors may test (not encoded here): Macro↔Micro lineage · Meso membership · Meso optional · Direct Micro→Macro lineage · Base/Shadow separation · Mixed ≠ OBSERVED_MACRO · non-mutation · grouping basis · lossy declares loss · conflict surfaced · unknown ≠ zero · formula/AI ≠ observed · broader ≠ authority.

## Remaining P1 Questions

- Formal EVENT_TIME / INGEST_TIME / SEQUENCE_INDEX binding and precedence
- Uncertainty aggregation operator (domain-defined later)
- Exact Macro conflict_refs representation (golden design may refine)
- Domain profiles that require Meso despite global optionality

## ONE Recommended Next Gate

```text
Z-MICRO-MESO-MACRO-SEMANTIC-GOLDENS-DESIGN-1
```

Design P0 expected vectors against these Steward decisions — parallel to Continuous 360 goldens path — **without** implementing an aggregation engine.

## Terminal

```text
STEWARD_P0_MMM_1_1 = RECORDED
AGGREGATION_ENGINE = NONE
PRODUCTION_AUTHORITY = NONE
```
