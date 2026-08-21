# Z-SANCTUARY-CONTINUOUS-360-STEWARD-P0-DECISIONS-1.1

**Status:** Steward P0 decisions recorded · **no implementation**  
**Date:** 2026-08-21  
**Baseline HEAD:** `47a8b24`  
**Branch:** `cursor/zsanctuary/z-sdc-phase-0-architecture`  
**Spec refined:** `docs/Z_CONTINUOUS_360_MULTIDIMENSIONAL_FIELD_SPEC_1.md`  
**Registry:** untouched

All decisions below are **`STEWARD_DEFINED`** for the **new family** `continuous-360-multidimensional-field`. They are **not** recovered historical canon.

## Baseline

| Field | Value |
| --- | --- |
| Expected HEAD | `47a8b24` |
| Actual start HEAD | `47a8b24` |
| Prior | Continuous 360 Field Spec 1 (`47a8b24`) |
| Staged | NONE |
| Dirt | Preserved |
| Mode | STEWARD DECISION RECORD · SPECIFICATION REFINEMENT ONLY |

## P0-1 General 360

**Decision:** ACCEPT

```text
GENERAL_360_MEANING = MULTI_PERSPECTIVE_SURROUND_COMPLETENESS
LITERAL_360_DEGREES_REQUIRED = NO
DOMAIN_SPECIFIC_GEOMETRY_ALLOWED = YES
360_COMPLETENESS_METRIC = UNDEFINED
```

GENERAL = complete-enough multi-perspective contextual observation.  
COMBAT (and other physical domains) may add literal angular/spatial geometry in their own profiles.  
Combat 360 and Ultra 360 are **not** redefined.

## P0-2 Field Unit

**Decision:** NO UNIVERSAL FIXED CELL

```text
GENERAL_FIXED_FIELD_CELL = NO
HISTORICAL_Z_UNIT_CREATED = NO
FIELD_OBSERVATION_AS_ATOMIC_EVIDENCE = YES
```

Atomic evidence remains `FieldObservation`. Domains may define specialized units later. Representation follows the domain. No new Z-Unit invented for naming preference.

## P0-3 General Profile

**Decision:** Minimal GENERAL core

```text
ENTITY
+ TIME
+ SEQUENCE
+ STATE
+ RELATIONSHIPS
+ PROVENANCE
+ UNCERTAINTY
```

```text
SPATIAL_DIMENSION_REQUIRED = NO
FREQUENCY_DIMENSION_REQUIRED = NO
SHADOW_DIMENSION_REQUIRED = NO
COMBAT_DIMENSION_REQUIRED = NO
```

Core dimension classes: TEMPORAL · SEQUENTIAL · STATE · RELATIONAL.  
Mandatory metadata: PROVENANCE · UNCERTAINTY.  
Provenance/uncertainty are not physical dimensions.

## P0-4 Uncertainty

**Decision:** Structured non-numeric default

Conceptual `FieldUncertainty`: assessment_status · uncertainty_kind · basis · evidence_refs · optional domain_value/unit.

assessment_status: `NOT_ASSESSED` · `QUALITATIVE` · `QUANTIFIED`  
uncertainty_kind: `MISSING_EVIDENCE` · `CONFLICTING_EVIDENCE` · `MODEL_ESTIMATE` · `MEASUREMENT_LIMITATION` · `UNKNOWN_SOURCE` · `OTHER`

```text
UNIVERSAL_NUMERIC_CONFIDENCE = NO
DOMAIN_NUMERIC_UNCERTAINTY_ALLOWED = YES
UNKNOWN ≠ ZERO
MISSING ≠ ZERO
CONFLICTING ≠ UNKNOWN
NOT_ASSESSED ≠ CERTAIN
```

## P0-5 Hybrid Representation

**Decision:** ACCEPT HYBRID

```text
GENERAL_FIELD_REPRESENTATION = HYBRID
UNIVERSAL_SPATIAL_LATTICE = NO
UNIVERSAL_GRAPH_ONLY = NO
UNIVERSAL_EVENT_STREAM_ONLY = NO
```

```text
VERSIONED STATE / EVENT STREAM
        +
RELATIONSHIP GRAPH
        +
OPTIONAL DOMAIN-SPECIFIC FIELD REPRESENTATION
```

## Preserved invariants (unchanged)

State classes: RAW · NORMALIZED · DERIVED · FORMULA · SHADOW · PREDICTED · HUMAN_CONFIRMED · AI_* · CONFLICTING  

```text
OBSERVATION ≠ DERIVATION ≠ PREDICTION ≠ SHADOW ≠ AI PROPOSAL
```

Provenance classes unchanged; AI must not silently become observed evidence.  
Combat 4–5 cm remains `COMBAT_SPECIFIC`. Ultra Cubes / KairoCell not merged.

## Revised Specification Completeness

| Item | Result |
| --- | --- |
| Maturity | **F3 SPECIFICATION** |
| Implementation readiness | `FIELD_SPEC_READY_FOR_GOLDEN_DESIGN` |
| Implementation authorized | **NO** |
| Completeness metric | Still UNDEFINED |

## Golden Readiness

```text
CONTINUOUS_360_GOLDEN_PARTIAL
FIELD_SPEC_READY_FOR_GOLDEN_DESIGN
```

Structural semantic goldens may be **designed** next (representation laws). Golden pack **not** created in this gate. No invented numerical answers.

## Remaining P1 Questions

- Shadow taxonomy / operator
- Micro→Meso→Macro formal model
- CombatFieldProfile specialization charter
- Adapter contracts (GGAESP, KairoCell, LPBS, QOSMEI, Z-AAI)
- Non-runtime dimension registry artifact
- Whether useful measurable 360-completeness criteria can ever exist (TEVV later)

## ONE Recommended Next Gate

```text
Continuous 360 Semantic Goldens Design
(representation invariants · docs/tests design only · no runtime)
```

Alternate: Formula Shadow taxonomy / specification.  
Still no MiniBot / Swarm / Z-AAI / QOSMEI activation.
