# Z-SANCTUARY-SHADOW-STEWARD-P0-DECISIONS-1.1

**Status:** Steward P0 decisions recorded · **F3 SPECIFICATION** · **no Shadow engine**  
**Date:** 2026-08-22  
**Baseline HEAD:** `20fea2f`  
**Branch:** `cursor/zsanctuary/z-sdc-phase-0-architecture`  
**Spec refined:** `docs/Z_SHADOW_TAXONOMY_AND_CONTRACT_SPEC_1.md`  
**C360 F4 / MMM F4 / Z Logic / formulas:** untouched

All decisions below are **`STEWARD_DEFINED`**. They refine the Reasoning Shadow contract; they invent **no** Shadow mathematics, scores, probabilities, or runtime.

## Baseline

| Field | Value |
| --- | --- |
| Expected HEAD | `20fea2f` |
| Actual start HEAD | `20fea2f` |
| Prior | Shadow Taxonomy Spec 1 (`cf86146`) · MMM F4 (`20fea2f`) · C360 F4 |
| Staged | NONE |
| Dirt | Preserved |
| Mode | STEWARD DECISION RECORD · SHADOW CONTRACT REFINEMENT ONLY |
| Docs recovery HOLD | **RELEASED** (`DOCS_RECOVERY_HOLD_RELEASED = YES`) — no mass restore/format |

## Canonical Shadow Classes

```text
CANONICAL_REASONING_SHADOW_CLASSES_V1 =
COUNTERFACTUAL
ALTERNATIVE_STATE
AI_PROPOSED
```

Architectural classes only. No runtime enums or schemas in this gate.

## Deferred Shadow Classes

Kept **DEFERRED / PROPOSED** (not deleted; future possible):

```text
RISK · FORMULA · SIMULATION · HISTORICAL · COMBAT · ADVERSARIAL · IMPACT
```

Reason: precise semantics or module placement not yet sufficiently sealed as distinct base classes.

## Base Reference

```text
BASE_REFERENCE_REQUIRED = YES
SHADOW_WITHOUT_BASE_REFERENCE = INVALID / INCOMPLETE
```

Base may be: state · event · formula result · candidate · relationship · MacroRepresentation · other explicitly defined base. No orphan Shadows. Creating Shadow does not mutate base.

## Assumptions

```text
SHADOW_ASSUMPTIONS_REQUIRED = YES
HIDDEN_ASSUMPTIONS → INCOMPLETE SHADOW
```

Field may explicitly state `NO_ADDITIONAL_ASSUMPTIONS`. Do not invent assumptions automatically.

## Purpose

```text
SHADOW_PURPOSE_REQUIRED = YES
```

Purpose ≠ class. Initial vocabulary:

```text
COMPARE · CHALLENGE · COUNTERFACTUAL · RISK_ANALYSIS · ADVERSARIAL_CHALLENGE · IMPACT_ANALYSIS · AI_ALTERNATIVE · DOMAIN_SPECIFIC
```

## Provenance

```text
PROVENANCE_REQUIRED = YES
```

Candidate origins: HUMAN_PROPOSED · FORMULA_DERIVED · SIMULATION_DERIVED · AI_PROPOSED · RULE_DERIVED · IMPORTED · UNKNOWN  

Provenance ≠ truth rank.

## Difference Contract

```text
SHADOW_DIFFERENCE_EXPLANATION_REQUIRED = YES
```

WHAT differs · WHY · which assumptions changed · shared evidence · differing evidence. No automated diff engine.

## Shadows of Shadows

```text
SHADOW_OF_SHADOW = DEFERRED
UNBOUNDED_SHADOW_DEPTH = NOT_AUTHORIZED
Z_INFINITY ≠ UNBOUNDED_SHADOW_RECURSION
```

Reason: combinatorial explosion · harder provenance · harder explainability · unclear semantic value · no current evidence requiring nesting. Future domain may reopen.

## Retention

```text
SHADOW_AUDIT_RETENTION_DEFAULT = PRESERVE_WHERE_GOVERNANCE_PERMITS
```

Not infinite retention. Rejected ≠ automatic delete; may remove under privacy/minimization policy. Auditability subject to governance.

## CREATE_SHADOW Primitive

```text
SHADOW_CONTROL_PRIMITIVE_REQUIRED = YES
CREATE_SHADOW = ARCHITECTURAL_PRIMITIVE_ONLY
RUNTIME = NONE
SYNTAX = UNDEFINED
CREATE_SHADOW ≠ ELSE
CONTROL_BRANCH ≠ SHADOW
```

Conceptual preconditions: base · purpose · assumptions · provenance · bounded creation · base not mutated · authority ceiling preserved. **Z Logic spec not modified.**

## Adversarial Placement

```text
z-adversarial-shadow = PROPOSED_ARCHITECTURE
```

Prefer purpose/specialization: class = COUNTERFACTUAL or ALTERNATIVE_STATE; purpose = ADVERSARIAL_CHALLENGE. Not a v1 canonical base class.

## Impact Placement

```text
z-impact-shadow = PROPOSED_ARCHITECTURE
```

Prefer impact-assessment module/purpose using Shadow comparison. Do not collapse impact into Shadow engine. Not a v1 base class.

## Risk Placement

```text
RISK = DEFERRED as standalone class
```

May use COUNTERFACTUAL or ALTERNATIVE_STATE with purpose = RISK_ANALYSIS until evidence justifies a distinct class. No risk scoring.

## Formula Shadow

```text
FORMULA_SHADOW = DEFERRED
FORMULA_SHADOW_OPERATOR = UNDEFINED
```

Not defined as inverse · Boolean NOT · ELSE · parameter flip · competing formula unless future formula-specific evidence defines it.

## Simulation Shadow

```text
SIMULATION = METHOD
SHADOW = REASONING ROLE
SIMULATION_OUTPUT ≠ SHADOW AUTOMATICALLY
```

Simulation output becomes a Shadow only when explicitly registered under the Shadow contract.

## Prediction Boundary

```text
PREDICTION_SEPARATE_FROM_SHADOW
PREDICTION ≠ SHADOW AUTOMATICALLY
```

A prediction may seed or relate to a Shadow; a Shadow may explore future alternatives — identities remain distinct.

## AI-Proposed Shadow

Canonical class **AI_PROPOSED** requires explicit AI provenance.

```text
AI_SHADOW ≠ OBSERVATION
AI_SHADOW ≠ CANON
AI_SHADOW ≠ AUTHORIZATION
```

No trust uplift because AI generated it.

### Counterfactual / Alternative-State (class seals)

- **COUNTERFACTUAL:** must identify explicit changed assumption(s); **COUNTERFACTUAL ≠ CAUSAL PROOF**
- **ALTERNATIVE_STATE:** distinct alternative vs same explicit base; retains base · assumptions · provenance · purpose · uncertainty; no probability implied

## Lifecycle

Architecture-level (no runtime):

```text
CANDIDATE · ACTIVE_FOR_COMPARISON · RETAINED · REJECTED · SUPERSEDED
```

Do not use OBSERVED as lifecycle transition. Match to reality → new observation; historical Shadow remains Shadow.

Promotion:

```text
SHADOW → evidence/test → proposal → governance → human/Steward decision
```

Never automatic SHADOW → OBSERVED or SHADOW → CANON.

## Authority

```text
SHADOW_AUTHORITY_ELEVATION = NONE
```

May inform · compare · challenge · warn · propose. Cannot authorize · deploy · rewrite canon · mutate base · override Steward · activate runtime.

## Boundedness

```text
SHADOW_GENERATION_MUST_BE_BOUNDED = YES
SHADOW_SPACE_COMPLETENESS = UNDEFINED GENERALLY
MORE_SHADOWS ≠ MORE_TRUTH
```

No numeric limits invented. No completeness claim unless a bounded formal domain defines the search space. No winner / majority truth / universal distance metric.

## Continuous 360 Relationship

Preserve `ShadowState` distinct from ObservedState · PredictedState · AIProposal. **No C360 changes. No F4 golden changes.**

## Micro/Meso/Macro Relationship

Preserve F4 parallel lanes:

```text
BASE MICRO → BASE MESO → BASE MACRO
SHADOW MICRO → SHADOW MESO → SHADOW MACRO
COMPARE between lanes
```

Macro Shadow must remain traceable to lower-grain Shadow evidence. **No MMM F4 golden changes. No aggregation runtime.**

## Z Logic Relationship

Z Logic spec **unchanged**. Recommendation only: future explicit Shadow creation primitive with REQUIRE base_reference · purpose · assumptions · provenance. No syntax chosen.

## Revised Maturity

```text
BEFORE: F2 / partial F3
AFTER:  F3 SPECIFICATION
NOT:    F4 (no machine-readable Shadow goldens yet)
```

## Golden Readiness

```text
SHADOW_GOLDEN_READY
```

P0 contract sufficiently closed for Shadow Semantic Goldens Design next. Do not encode in this gate.

## Remaining P1 Questions

- Formula Shadow semantics
- Domain-specific Risk class need
- Simulation specialization
- Shadow equivalence / deduplication
- Nested Shadow support in future
- Domain-specific retention periods
- Shadow comparison mathematics
- Shadow quality metrics
- Combat specialization
- CREATE_SHADOW syntax (when Z Logic is chartered)

Do not solve these here.

## ONE Recommended Next Gate

```text
Z-SANCTUARY-SHADOW-SEMANTIC-GOLDENS-DESIGN-1
```

Design expected semantic vectors for Reasoning Shadow v1 (Counterfactual · Alternative-State · AI-Proposed + required fields / hard walls) — parallel to C360/MMM design path — without Shadow engine or mathematics.

## Terminal

```text
SHADOW P0 STEWARD DECISIONS = RECORDED
SHADOW ENGINE = NONE
CREATE_SHADOW = ARCHITECTURAL ONLY
C360_F4 = PRESERVED
MMM_F4 = PRESERVED
Z_LOGIC = PRESERVED
NEW_MATHEMATICS = NONE
PRODUCTION_AUTHORITY = NONE
STEWARD_REVIEW = REQUIRED
```
