# Z-SANCTUARY-Z-LOGIC-STEWARD-P0-DECISIONS-1.1

**Status:** Steward P0 decisions recorded · **F3 SPECIFICATION** · **no runtime / no DSL / no parser**  
**Date:** 2026-08-22  
**Baseline HEAD:** `eca21d3`  
**Branch:** `cursor/zsanctuary/z-sdc-phase-0-architecture`  
**Spec refined:** `docs/Z_LOGIC_AND_CONTROL_GRAMMAR_SPEC_0.md`  
**C360 / MMM / Shadow F4 packs:** untouched

All decisions below are **`STEWARD_DEFINED`**. They refine control semantics; they invent **no** parser, DSL, runtime, scores, or mathematics.

## Baseline

| Field | Value |
| --- | --- |
| Expected HEAD | `eca21d3` |
| Actual start HEAD | `eca21d3` |
| Prior | Z Logic Spec 0 (`432ad97`) · Shadow F4 (`eca21d3`) |
| Staged | NONE |
| Dirt | Preserved |
| Mode | STEWARD DECISION RECORD · CONTROL-SEMANTIC REFINEMENT ONLY |
| Docs recovery HOLD | **RELEASED** — no mass restore/format |

## Existing Logic Contract

Preserved: IF/ELSE · AND/OR/NOT · inclusive OR · MATCH · GUARD/REQUIRE · state machines · bounded loops · EVENT→CONDITION→CANDIDATE→GOVERNANCE · TRY/CATCH/FINALLY · CONTROL_BRANCH ≠ SHADOW · TRUE ≠ AUTHORIZATION · READY/GO ≠ DEPLOY.

## Binary Predicate Decision

```text
BOOLEAN_PREDICATES = YES
BINARY_PREDICATES = YES
CUSTOM_MULTI_VALUED_TRUTH_TABLE = NO
```

Predicate → TRUE / FALSE under a declared rule. No custom MAYBE / UNKNOWN_TRUTH / PARTIAL_TRUE truth table.

## Multi-Valued Outcome Decision

```text
MULTI_VALUED_STATE_OUTCOMES = YES
MULTI_VALUED_TRUTH_TABLE = NO
```

Binary predicates; multi-valued **control/state outcomes** (HOLD · BLOCK · STOP · domain states) where explicit. No universal Sanctuary outcome enum.

## Unknown / Missing / Conflict Decision

```text
UNKNOWN ≠ FALSE · MISSING ≠ FALSE · CONFLICTING ≠ FALSE
UNKNOWN ≠ TRUE · MISSING ≠ TRUE · CONFLICTING ≠ TRUE
INSUFFICIENT_EVIDENCE MUST_NOT_BE_SILENTLY_COERCED_TO_BOOLEAN
```

Handle via precondition · GUARD · REQUIRE · domain outcome · HOLD · explicit failure. No third Boolean truth value.

## IF Decision

```text
IF_TRUE ≠ AUTHORIZATION
```

TRUE satisfies declared condition only — does not authorize · deploy · mutate evidence · activate runtime · elevate authority.

## ELSE Decision

```text
ELSE ≠ SILENT_FAILURE
ELSE ≠ SHADOW
ELSE ≠ BOOLEAN_NOT
ELSE ≠ MATHEMATICAL_INVERSE
```

## AND Decision

```text
AND = logical conjunction
AND ≠ MULTIPLICATION
AND_EVALUATION_ORDER = DEFERRED_TO_RUNTIME_GRAMMAR
```

## OR Decision

```text
OR = INCLUSIVE_OR
```

## NOT Decision

```text
NOT = BOOLEAN_NEGATION_ONLY
NOT ≠ SHADOW
NOT ≠ MATHEMATICAL_INVERSE
NOT ≠ COUNTERFACTUAL
NOT ≠ ELSE
```

## XOR Deferral

```text
XOR = DEFERRED
XOR_NOT_REQUIRED_FOR_V1 = YES
```

## MATCH Decision

```text
UNHANDLED_MATCH ≠ SUCCESS
```

Cover declared domain **or** explicit fallback / HOLD / failure policy.

## REQUIRE Decision

```text
REQUIRE = eligibility / prerequisite contract
REQUIRE_FAILURE ≠ SILENT_CONTINUE
```

Failure outcome (HOLD/BLOCK/STOP/invalid/…) is domain-contract-specific — not universal BLOCK.

## GUARD Decision

```text
GUARD = protective boundary check
GUARD_FAILURE ≠ SILENT_CONTINUE
REQUIRE ≠ GUARD
```

## HOLD Decision

```text
HOLD = preserve current relevant state + pause progression
  pending evidence / decision / dependency / review / release
HOLD ≠ BLOCK ≠ STOP ≠ SUCCESS ≠ AUTHORIZATION
```

## BLOCK Decision

```text
BLOCK = explicitly prohibit current candidate / transition / action
BLOCK ≠ HOLD ≠ STOP
```

Does not necessarily terminate every surrounding process.

## STOP Decision

```text
STOP = terminate current bounded process/path
STOP ≠ HOLD ≠ BLOCK
STOP ≠ delete state / erase evidence / terminate Sanctuary / revoke unrelated
```

Scope must be explicit. History preserved.

## State Transition Decision

```text
STATE_TRANSITION ≠ SILENT_OVERWRITE
STATE_CHANGE ≠ AUTHORITY_CHANGE
```

Prior state · candidate · result · reason · provenance · rule/gate · version/order conceptually retained.

## Event Decision

```text
EVENT → CONDITION → CANDIDATE → GOVERNANCE
EVENT ≠ COMMAND ≠ AUTHORIZATION ≠ AUTOMATIC_ACTION
EVENT_TIME_BINDING = DEFERRED_P1
```

## Loop / Iteration Decision

```text
LOOPS MUST BE BOUNDED
Z_INFINITY ≠ UNBOUNDED_LOOP
WHILE WITHOUT BOUND / TERMINATION CONTRACT = NOT AUTHORIZED
```

FOR EACH over bounded collection permitted architecturally. No automatic parallelism. No numeric limits invented.

## Retry / Timeout Deferral

```text
RETRY = DEFERRED_P1
TIMEOUT = DEFERRED_P1
```

## Error Handling Decision

```text
ERROR ≠ SILENT_SUCCESS
CATCH ≠ SWALLOW_ERROR_SILENTLY
```

TRY / CATCH / FINALLY architecture preserved. FINALLY cannot rewrite truth or authority.

## Human / Steward Gates

```text
HUMAN_GATE ≠ STEWARD_GATE
GATE_PASS ≠ DEPLOY
GATE_PASS ≠ PRODUCTION_AUTHORITY
```

## CREATE_SHADOW Integration

```text
Z_LOGIC_MUST_EVENTUALLY_SUPPORT_EXPLICIT_SHADOW_CREATION = YES
CREATE_SHADOW = ARCHITECTURAL_PRIMITIVE_ONLY
SYNTAX = UNDEFINED · PARSER = NONE · RUNTIME = NONE
CREATE_SHADOW ≠ ELSE ≠ CONTROL_BRANCH
NESTED_SHADOW_CONTROL_MAPPING = DEFERRED
```

Conceptual preconditions: REQUIRE base/assumptions/purpose/provenance/bounded scope · GUARD non-mutation · GUARD authority ceiling.

## Shadow Boundary

```text
CONTROL_BRANCH ≠ SHADOW
```

Shadow F4 pack **unchanged**.

## C360 Relationship

Control must not collapse Observed · Predicted · Shadow · AI-Proposed · Conflicting · Unknown · Missing. C360 F4 **unchanged**.

## Micro/Meso/Macro Relationship

```text
BROADER VIEW ≠ HIGHER AUTHORITY
```

MMM F4 **unchanged**.

## GGAESP Relationship

```text
GGAESP_GO ≠ DEPLOY ≠ PRODUCTION_AUTHORITY
```

GGAESP semantics **unchanged**; Z Logic may route/inspect, not reinterpret.

## MiniBot / Swarm Boundary

```text
MINIBOT_OUTPUT ≠ TRUTH ≠ AUTHORITY
SWARM_MAJORITY ≠ TRUTH
SWARM_CONSENSUS ≠ STEWARD_DECISION
```

No activation.

## QOSMEI Boundary

```text
QOSMEI_FUSION ≠ AUTHORIZATION
```

## Z-AAI Boundary

```text
Z_AAI_PROPOSAL ≠ CANON ≠ AUTHORIZATION
```

## Replica Fabric Boundary

```text
CONTROL_FLOW ≠ REPLICA_AUTHORIZATION
```

Governed lifecycle preserved. No activation.

## Authority Ceiling

```text
TRUE/FALSE/MATCH/GUARD PASS/REQUIRE PASS/HOLD/BLOCK/STOP/STATE TRANSITION/EVENT
≠ AUTHORITY
PREDICATE_EVALUATION ≠ EVIDENCE_MUTATION
BRANCH_SELECTION ≠ SOURCE_REWRITE
```

No control scores invented.

## Revised Maturity

```text
BEFORE: F2 / partial F3
AFTER:  F3 SPECIFICATION
NOT:    F4 (no machine-readable Z Logic goldens yet)
```

## Golden Readiness

```text
Z_LOGIC_GOLDEN_READY
```

## Remaining P1 Questions

XOR · RETRY · TIMEOUT · operator precedence · short-circuit · side-effect model · event-time binding · nested Shadow control mapping · CREATE_SHADOW syntax/runtime · parallel/async/cancellation · loop resource limits · error taxonomy detail · executable HOLD/BLOCK/STOP bridge across recovered lanes.

## ONE Recommended Next Gate

```text
Z-SANCTUARY-Z-LOGIC-SEMANTIC-GOLDENS-DESIGN-1
```

## Terminal

```text
Z LOGIC P0 STEWARD DECISIONS = RECORDED
PARSER = NONE
DSL = NONE
RUNTIME = NONE
CREATE_SHADOW = ARCHITECTURAL_ONLY
C360_F4 = PRESERVED
MMM_F4 = PRESERVED
SHADOW_F4 = PRESERVED
NEW_MATHEMATICS = NONE
PRODUCTION_AUTHORITY = NONE
STEWARD_REVIEW = REQUIRED
```
