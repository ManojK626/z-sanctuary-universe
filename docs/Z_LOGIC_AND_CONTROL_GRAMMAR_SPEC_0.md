# Z-SANCTUARY-Z-LOGIC-AND-CONTROL-GRAMMAR-SPEC-0

**Status:** Architectural control grammar · **F3 SPECIFICATION** · **no runtime / no DSL / no parser**  
**Date:** 2026-08-22  
**Baseline HEAD:** `0daf6c2` (refined at Steward P0 `eca21d3`+)  
**Branch:** `cursor/zsanctuary/z-sdc-phase-0-architecture`  
**Mode:** RECOVER · CLASSIFY · SPECIFY · STEWARD P0 REFINED · NO IMPLEMENTATION  
**Steward P0 receipt:** `docs/Z_LOGIC_STEWARD_P0_DECISIONS_1_1.md`

## Baseline

| Field | Value |
| --- | --- |
| Expected HEAD | `0daf6c2` (original) · Steward refine from `eca21d3` |
| Prior | Continuous 360 · Micro/Meso/Macro · Shadow F4 sealed |
| Steward P0 | Recorded in companion receipt 1.1 |
| Staged | NONE |
| Dirt | Preserved |
| C360 / MMM / Shadow F4 packs | **NOT MODIFIED** |
| Artifacts | Spec refinement + Steward receipt only |

## Purpose

Define a **common control vocabulary** so future Z-Formulas and architectures can express conditions, alternatives, Boolean combinations, guarded transitions, state machines, iteration, events, constraints, failure handling, Shadow branching (as a distinct concept), human/Steward gates, authority ceilings, and provenance requirements.

```text
This is NOT a super-formula.
This is NOT a programming language.
This is NOT a runtime engine.
```

It is the architectural bridge:

```text
FORMULA SEMANTICS  →  CONTROL LOGIC  →  PROGRAMMING SYNTAX
                              ↓
                     GOVERNANCE AUTHORITY
```

## Formula vs Logic vs Programming vs Governance

| Layer | Answers | Example |
| --- | --- | --- |
| FORMULA SEMANTICS | What meaning holds? | `AI_PROPOSED ≠ OBSERVED` |
| CONTROL LOGIC | Which pathway is eligible under which conditions? | `IF provenance == AI_PROPOSED THEN MUST NOT classify OBSERVED` |
| PROGRAMMING SYNTAX | How a language executes it | future JS/TS/etc. concern |
| GOVERNANCE AUTHORITY | Whether the pathway is permitted | Steward / release / STOP_GATE |

**Permanent separation.** Do not collapse layers.

---

## Recovered Existing Control Patterns

| Pattern | Location (evidence) | Class | Notes |
| --- | --- | --- | --- |
| GGAESP `GO\|PREPARE\|HOLD\|BLOCK` | `core_engine/ggaesp_pipeline.ts` | CURRENT_EXECUTABLE | Advisory decision enum; **not** release authority |
| GGAESP polarity | same pipeline | CURRENT_EXECUTABLE | negative/neutral/positive/verified — **≠ boolean** |
| GGAESP goldens | `data/formula_semantic_goldens/ggaesp_v11_v19_goldens.json` | CURRENT_EXECUTABLE | Decision vectors sealed |
| Release `manual_release` / final HOLD | `data/z_release_control.json`, release governance scripts | CURRENT_EXECUTABLE | Technical ready ∧ manual_release |
| Execution enforcer ALLOW/BLOCK/FORCE_DIAGNOSTICS | `scripts/z_execution_enforcer*.mjs` | CURRENT_EXECUTABLE | Separate from GGAESP |
| STOP_GATE PASS\|BLOCK | Zuno-4root docs · signal-bus types | CURRENT_DOC + CURRENT_EXECUTABLE | Hard pause lane — **≠** GGAESP HOLD |
| Turtle observe→verify→suggest→human | Constitution · turtle-mode rules | CURRENT_GOVERNANCE | readiness ≠ deploy |
| Cycle Observe suggest-only | control-root awareness | CURRENT_GOVERNANCE | no auto-exec of queue |
| C360 authority / provenance invariants | C360 field spec · goldens design | CURRENT_DOC | Representation ≠ authority; AI≠observed |
| Replica Fabric lifecycle | Replica Fabric doctrine | CURRENT_GOVERNANCE | validator only; GREEN ≠ deploy |
| 14DRP / swarm ≠ truth | Swarm 14DRP law | CURRENT_GOVERNANCE | majority ≠ ground truth |
| Traffic GREEN/YELLOW/BLUE/RED | Traffic / Replica signals | CURRENT_GOVERNANCE | signal vocabulary ≠ boolean |
| Ultra 360 Ring polarity prose | Ultra Instincts / Ultra 360 recon | CURRENT_DOC | RELATED_VOCABULARY only to GGAESP |

### HOLD / BLOCK / STOP recovery verdict

**Historical recovery** (distinct systems, not one unified enum):

| Term | Recovered sense | Do not alias |
| --- | --- | --- |
| HOLD | GGAESP advisory pause; release `final_status`; operational wait | ≠ STOP_GATE |
| BLOCK | GGAESP deny candidate; enforcer BLOCK; StopGate state BLOCK | same word, multiple lanes |
| STOP / STOP_GATE | Hard policy/consent pause | ≠ GGAESP HOLD |

**Steward P0** seals **generic Z Logic meanings** below without collapsing GGAESP / enforcer / STOP_GATE into one executable enum. GGAESP semantics **unchanged**.

---

## Conditional Statements

### IF

**Purpose:** Conditional gate.  
**Z role:** Evaluate eligibility/truth of a condition; select THEN pathway.  
**Does not grant authority.**

```text
IF predicate
THEN candidate path
IF_TRUE ≠ AUTHORIZATION
```

`STEWARD_DEFINED`. A TRUE predicate merely satisfies its declared condition. It does **not** authorize · deploy · mutate evidence · activate runtime · elevate authority.

Example: `IF provenance_valid THEN continue analysis`.

### ELSE

**Purpose:** Explicit alternative pathway.  
**Rule:** ELSE must not silently mean failure.

```text
ELSE ≠ SILENT_FAILURE
ELSE ≠ SHADOW
ELSE ≠ BOOLEAN_NOT
ELSE ≠ MATHEMATICAL_INVERSE
CREATE_SHADOW ≠ ELSE
```

`STEWARD_DEFINED`. An ELSE path may later explicitly create a Shadow **only** through the separate `CREATE_SHADOW` architectural primitive — ELSE is not itself a Shadow.

### ELSE IF / multi-branch

Prefer explicit multi-state classification over forced binary where states are enumerated (GO/PREPARE/BLOCK; OBSERVED/DERIVED/PREDICTED/SHADOW).

---

## Boolean Operators

### Predicates (`STEWARD_DEFINED`)

```text
BOOLEAN_PREDICATES = YES
BINARY_PREDICATES = YES
MULTI_VALUED_STATE_OUTCOMES = YES
CUSTOM_MULTI_VALUED_TRUTH_TABLE = NO
```

A predicate asks a bounded yes/no question under a declared rule → TRUE / FALSE.  
Do **not** invent TRUE/FALSE/MAYBE/UNKNOWN_TRUTH/PARTIAL_TRUE as a custom logical truth table.

```text
UNKNOWN ≠ FALSE · MISSING ≠ FALSE · CONFLICTING ≠ FALSE
UNKNOWN ≠ TRUE · MISSING ≠ TRUE · CONFLICTING ≠ TRUE
INSUFFICIENT_EVIDENCE MUST_NOT_BE_SILENTLY_COERCED_TO_BOOLEAN
```

Handle via precondition · GUARD · REQUIRE · domain outcome · HOLD · explicit failure — **not** a third Boolean truth value.

### AND

All required Boolean predicates satisfy conjunction.

```text
AND ≠ MULTIPLICATION
AND_EVALUATION_ORDER = DEFERRED_TO_RUNTIME_GRAMMAR
SHORT_CIRCUIT_RUNTIME_SEMANTICS = DEFERRED
```

`STEWARD_DEFINED` meaning; evaluation order/short-circuit deferred.

### OR

```text
OR = INCLUSIVE_OR
```

`STEWARD_DEFINED`. Permits either or both. Do not silently redefine as XOR.

### XOR

```text
XOR = DEFERRED
XOR_NOT_REQUIRED_FOR_V1 = YES
```

### NOT

Boolean exclusion only.

```text
NOT = BOOLEAN_NEGATION_ONLY
NOT ≠ SHADOW
NOT ≠ MATHEMATICAL_INVERSE
NOT ≠ COUNTERFACTUAL
NOT ≠ ELSE
```

`STEWARD_DEFINED`. No Formula Shadow semantics from NOT.

---

## Multi-Branch Logic (MATCH)

Preferred over deep nested IF for enumerated states:

```text
MATCH state
  CASE A
  CASE B
  CASE C
```

```text
UNHANDLED_MATCH ≠ SUCCESS
```

`STEWARD_DEFINED`. Unmatched case must **not** silently become success. Domain must cover declared cases **or** provide explicit fallback / default / HOLD / failure policy. No executable syntax.

Example:

```text
MATCH state
  RAW_STATE     → normalization pathway
  FORMULA_STATE → formula pathway
  SHADOW_STATE  → Shadow pathway
  AI_PROPOSAL   → Steward-review pathway
  UNKNOWN       → HOLD / evidence pathway
```

---

## Guards and Requirements

```text
REQUIRE ≠ GUARD
REQUIRE_FAILURE ≠ SILENT_CONTINUE
GUARD_FAILURE ≠ SILENT_CONTINUE
```

`STEWARD_DEFINED`:

| Construct | Role |
| --- | --- |
| REQUIRE | Eligibility / prerequisite contract for candidate path |
| GUARD | Protective boundary check before transition/action |

Failure must be **visible**. Failure does **not** universally mean BLOCK — calling/domain contract chooses HOLD · BLOCK · STOP · invalid · incomplete · other explicit bounded failure. Neither creates authority.

```text
REQUIRE precondition
GUARD condition
```

Pattern: CHECK → FAIL VISIBLY → PRESERVE REASON → DO NOT CONTINUE UNSAFELY.  
Maps to Turtle / STOP_GATE / release doctrine.

---

## HOLD / BLOCK / STOP (`STEWARD_DEFINED`)

Canonical **generic** Z Logic meanings (do not erase recovered lane distinctions above):

| Construct | Core meaning | Preserves history | Automatically authorizes? |
| --- | --- | --- | --- |
| HOLD | Preserve current relevant state; pause forward progression pending evidence / decision / dependency / review / release condition | YES | NO |
| BLOCK | Explicitly prohibit the current candidate, transition, or action under current evaluated conditions | YES | NO |
| STOP | Terminate the current **bounded** process/path according to its declared control boundary | YES | NO |

```text
HOLD ≠ BLOCK ≠ STOP
HOLD ≠ SUCCESS
HOLD ≠ AUTHORIZATION
BLOCK ≠ terminate every surrounding process (necessarily)
STOP ≠ delete state
STOP ≠ erase evidence
STOP ≠ terminate the entire Sanctuary
STOP ≠ revoke unrelated capabilities
```

STOP scope must be explicit. History not erased by HOLD/BLOCK/STOP.

**Do not silently alias** across GGAESP / enforcer / STOP_GATE without Steward bridge. GGAESP outcomes remain GGAESP-defined.

---

## GO / PREPARE / BLOCK Relationship

GGAESP executable semantics **preserved unchanged**.

```text
GGAESP_GO ≠ DEPLOY
GGAESP_GO ≠ PRODUCTION_AUTHORITY
```

`STEWARD_DEFINED`. Grammar may **reference** externally supplied GGAESP decisions; it does **not** redefine them:

```text
MATCH GGAESP decision
  GO      → continue to next authorized gate
  PREPARE → request unresolved prerequisites
  BLOCK   → deny current candidate path
```

(Also GGAESP HOLD — advisory wait.)

---

## Iteration

| Construct | Role | Bound |
| --- | --- | --- |
| FOR EACH | Iterate observations/entities/Shadows/reports | required (bounded collection) |
| WHILE | Repeat while condition | termination contract required |
| REPEAT UNTIL | Goal-seeking bounded loop | same |
| SEQUENCE / EVENT STREAM ITERATION | Field S(n) walks | versioned |

```text
LOOPS MUST BE BOUNDED
Z_INFINITY ≠ UNBOUNDED_LOOP
Z_INFINITY ≠ UNBOUNDED_RUNTIME_LOOP
WHILE WITHOUT BOUND / TERMINATION CONTRACT = NOT AUTHORIZED
```

`STEWARD_DEFINED`. Bound may eventually be: finite collection · termination predicate · resource/iteration/domain policy · Steward-defined bound. No numeric values invented. No automatic parallelism.

### BREAK

Terminate current bounded iteration for inspectable reason (gate fail / goal / safety / human stop / resource).

### CONTINUE

Skip to next eligible iteration.  
**CONTINUE ≠ AUTHORIZATION_TO_PROCEED.**

### RETRY / TIMEOUT

```text
RETRY = DEFERRED_P1
TIMEOUT = DEFERRED_P1
```

No numeric duration · no global default · no universal failure/block/stop mapping invented.

---

## Event Logic

```text
EVENT → CONDITION → CANDIDATE → GOVERNANCE
EVENT ≠ COMMAND
EVENT ≠ AUTHORIZATION
EVENT ≠ AUTOMATIC_ACTION
```

`STEWARD_DEFINED`. Receiving an event may initiate evaluation; it cannot bypass governance.

```text
EVENT_TIME ≠ INGEST_TIME ≠ SEQUENCE_INDEX
EVENT_TIME_BINDING = DEFERRED_P1
```

No precedence invented here.

---

## State Machines

```text
STATE A → (guard) → STATE B
S(n) → transition → S(n+1)
```

Transition should eventually carry: source · target · guard · reason · provenance · authority · timestamp · human_gate · failure_path · version/order.

### Transition law

```text
STATE_TRANSITION ≠ SILENT_OVERWRITE
STATE_CHANGE ≠ AUTHORITY_CHANGE
```

`STEWARD_DEFINED`. Historical state remains traceable where governance permits. Authority changes require their own governed mechanism. Continuous 360: retain S(n).

---

## Failure Handling

| Construct | Role |
| --- | --- |
| TRY | Attempt bounded operation |
| CATCH | Capture failure with identity, operation, input ref, time, provenance, partial state, recovery decision |
| FINALLY | Cleanup / receipt — must not convert failure into success |
| THROW / ERROR | Explicit signaling |

```text
ERROR ≠ SILENT_SUCCESS
CATCH ≠ SWALLOW_ERROR_SILENTLY
```

`STEWARD_DEFINED`. Differentiate: ERROR · INVALID_INPUT · UNKNOWN · CONFLICT · BLOCKED · UNAUTHORIZED · NOT_APPLICABLE. Failure should conceptually preserve failure class · operation · input refs · rule/gate · reason · stage/state · provenance.

### ASSERT

Spec/test invariants (e.g. `ASSERT AI_PROPOSED != OBSERVED`). Not a substitute for safety-critical input validation.

### REQUIRE

See Guards and Requirements (`STEWARD_DEFINED`).

---

## Return Semantics

Possible return classes: RESULT · UNKNOWN · HOLD · BLOCK · PROPOSAL · ERROR · CONFLICT · NOT_APPLICABLE.

```text
NULL ≠ UNKNOWN ≠ ZERO ≠ ERROR ≠ BLOCK
```

---

## Pure vs Effectful Operations

| Kind | Rule |
| --- | --- |
| PURE LOGIC | Same valid input → same output; no external mutation |
| EFFECTFUL | May mutate / call / create / act |

Formula calculations pure where practical. Authority-heavy actions must never hide inside pure-looking formulas.

Conceptual `ZOperation` contract (no code): operation_id · input/output contracts · side_effect_policy · authority_ceiling · provenance_policy · failure_contract · determinism_status.

---

## Provenance Guards

```text
IF provenance == UNKNOWN THEN do not silently treat as trusted
IF provenance == AI_PROPOSED THEN do not classify as OBSERVED
IF evidence is IMPORTED THEN retain import source
```

Architecture only.

## Uncertainty Logic

No universal thresholds. Allowed:

```text
IF uncertainty_status == NOT_ASSESSED THEN represent uncertainty explicitly
```

Not: invent `confidence < 0.5`.

## Conflict Logic

```text
IF observation A conflicts with observation B
THEN preserve A AND preserve B AND mark CONFLICTING
```

Do not auto-delete weaker, average, majority-vote, or declare truth without domain contract.

## Versioning Logic

```text
WHEN accepted state changes
CREATE new version AND retain previous version
```

## Shadow Branching

```text
CONTROL_BRANCH ≠ SHADOW
CREATE_SHADOW ≠ ELSE
CREATE_SHADOW ≠ CONTROL_BRANCH
CREATE_SHADOW = ARCHITECTURAL_PRIMITIVE_ONLY
SYNTAX = UNDEFINED
PARSER = NONE
RUNTIME = NONE
Z_LOGIC_MUST_EVENTUALLY_SUPPORT_EXPLICIT_SHADOW_CREATION = YES
```

`STEWARD_DEFINED` (aligned with Shadow F4). Ordinary IF/ELSE does not create Reasoning Shadows.

Conceptual future preconditions (no syntax):

```text
REQUIRE base_reference
REQUIRE assumptions
REQUIRE purpose
REQUIRE provenance
REQUIRE bounded scope
GUARD base_non_mutation
GUARD authority_ceiling
```

```text
SHADOW_OF_SHADOW = DEFERRED
NESTED_SHADOW_CONTROL_MAPPING = DEFERRED
```

If base is already Shadow and nested semantics are not authorized → do not create nested Shadow. Do not predetermine HOLD vs BLOCK for that future mapping.

---

## Human / Steward Gates

| Primitive (conceptual) | Role |
| --- | --- |
| HUMAN_GATE / REQUIRE_HUMAN | Non-autonomous transition requiring human decision |
| STEWARD_GATE / REQUIRE_STEWARD | Steward-role decision (≠ any human) |

```text
HUMAN_GATE ≠ STEWARD_GATE
GATE_PASS ≠ DEPLOY
GATE_PASS ≠ PRODUCTION_AUTHORITY
```

`STEWARD_DEFINED`. Examples: canon changes · authority elevation · deploy · replication · high-risk domains. No auth implementation · no identity protocol.

## Authority Ceiling

Operations declare ceiling: OBSERVE · REPORT · SUGGEST · SIMULATE · HUMAN_GATED · BOUNDED_EXECUTION …

```text
CONTROL_FLOW CANNOT SELF-ELEVATE AUTHORITY
TRUE ≠ AUTHORITY
FALSE ≠ AUTHORITY
MATCH ≠ AUTHORITY
GUARD PASS ≠ AUTHORITY
REQUIRE PASS ≠ AUTHORITY
HOLD ≠ AUTHORITY
BLOCK ≠ AUTHORITY
STOP ≠ AUTHORITY
STATE TRANSITION ≠ AUTHORITY
EVENT ≠ AUTHORITY
CONTROL RESULT ≠ AUTHORITY
```

`STEWARD_DEFINED`. Control semantics route candidates; they do not create authority.

```text
TRUE ≠ AUTHORIZED
VALID ≠ AUTHORIZED
READY ≠ DEPLOY
GO ≠ DEPLOY
CAPABLE ≠ AUTHORIZED
FEASIBLE ≠ AUTHORIZED
```

ALLOW / DENY are governance — separate from formula truth. No `logic_score` / `branch_confidence` / `gate_confidence` / `control_strength` / `authority_score`.

---

## MiniBot Logic

```text
MINIBOT_OUTPUT ≠ TRUTH
MINIBOT_OUTPUT ≠ AUTHORITY
```

`STEWARD_DEFINED`. Future MiniBot output may enter evaluation as explicitly typed/provenanced input. Proposal → canon only via human/governance. MiniBots not activated.

## Swarm Logic

```text
SWARM_MAJORITY ≠ TRUTH
SWARM_CONSENSUS ≠ STEWARD_DECISION
agreement ≠ truth
agreement ≠ authority
```

No majority-decision rule invented. Swarm not activated.

## QOSMEI Logic

Collect · compare · fuse · report — advisory.

```text
QOSMEI_FUSION ≠ AUTHORIZATION
FUSION_RESULT ≠ AUTHORIZATION
```

## Z-AAI Logic

Explain · expose conflict · propose conditions/branches/Shadows → governance → human/Steward.

```text
Z_AAI_PROPOSAL ≠ CANON
Z_AAI_PROPOSAL ≠ AUTHORIZATION
```

Not self-modification. Z-AAI not implemented.

## Replica Fabric Logic

Preserve:

```text
OBSERVE → PROPOSE → SANDBOX → VERIFY → GOVERNANCE
→ HUMAN AUTHORIZATION → BOUNDED CREATION → RECEIPT
CONTROL_FLOW ≠ REPLICA_AUTHORIZATION
Z_INFINITY ≠ UNBOUNDED_REPLICATION
UNBOUNDED_SELF_REPLICATION = NOT AUTHORIZED
```

Z Logic cannot introduce a bypass. No activation.

## Combat Logic

```text
IF Combat profile active AND physical data available
THEN enable applicable spatial analysis
ELSE do not fabricate physical state
```

Do not change Combat formulas/physics.

## Continuous 360 Integration

Grammar operates on ENTITY · TIME · SEQUENCE · STATE · RELATIONSHIPS · PROVENANCE · UNCERTAINTY.

Must not collapse: Observed · Predicted · Shadow · AI-Proposed · Conflicting · Unknown · Missing.

Example:

```text
IF state == AI_PROPOSAL AND provenance == AI_PROPOSED
THEN prevent OBSERVED classification
```

C360 F4 goldens **unchanged** by this gate.

```text
FIELD_GOLDENS_CAN_SEED_LOGIC_GOLDENS
```

---

## Formula Operators vs Control Operators

| Control | Formula / math |
| --- | --- |
| AND · OR · NOT | + · − · × · ÷ · ^ · recurrence · domain ops |
| IF · ELSE · MATCH | — |
| GUARD · REQUIRE | — |

Never confuse:

```text
AND ≠ ×
OR ≠ +
NOT ≠ inverse
ELSE ≠ Shadow
BOOLEAN_TRUTH ≠ Z_POLARITY
BOOLEAN_NOT ≠ SHADOW
CONTROL MATCH ≠ FORMULA MATCHING OPERATOR
```

```text
OPERATOR_PRECEDENCE = DEFERRED_TO_FUTURE_GRAMMAR
```

---

## Multi-Valued Logic (`STEWARD_DEFINED`)

```text
BINARY_PREDICATES = YES
MULTI_VALUED_STATE_OUTCOMES = YES
CUSTOM_MULTI_VALUED_TRUTH_TABLE = NO
```

Predicates are binary TRUE/FALSE. Resulting control/state outcomes may be domain-specific (HOLD · BLOCK · STOP · …). No universal Sanctuary outcome enum in this gate. No third Boolean truth value.

Also:

```text
TRUE ≠ CERTAIN
FALSE ≠ IMPOSSIBLE
```

## Evaluation / Side-Effect Rules

```text
PREDICATE_EVALUATION ≠ EVIDENCE_MUTATION
BRANCH_SELECTION ≠ SOURCE_REWRITE
CONTROL_EVALUATION_MUST_NOT_SILENTLY_MUTATE_SOURCE_EVIDENCE
CONTROL_SIDE_EFFECT_MODEL = DEFERRED_TO_RUNTIME_CHARTER
SHORT_CIRCUIT_RUNTIME_SEMANTICS = DEFERRED
```

`STEWARD_DEFINED` non-mutation. Prefer **PURE CONDITIONS** (no side effects inside IF predicates). Prefer **EXPLICIT_GROUPING** `(A AND (B OR C))`. Preferred pattern: `result = check_state()` then `IF result THEN request transition`. A later explicitly authorized transition may create new state/version — separate from silently mutating input evidence.

### Determinism class (future declaration)

DETERMINISTIC · DOMAIN_DEPENDENT · AI_ASSISTED · HUMAN_DECIDED · STOCHASTIC · UNKNOWN  
AI-assisted ≠ deterministic.

### Defaults / OPTIONAL / FALLBACK / RETRY / TIMEOUT / QUEUE / PRIORITY

| Construct | Rule |
| --- | --- |
| OPTIONAL | Absence ≠ zero / trusted / certain |
| DEFAULT | Only where spec defines; prohibited defaults listed below |
| FALLBACK | Controlled degrade; must not weaken safety |
| RETRY | DEFERRED_P1 — needs max attempts / classes / delay / idempotency / authority / stop — **no numbers invented** |
| TIMEOUT | DEFERRED_P1 — Explicit TIMEOUT / HOLD / UNKNOWN — not silent success/fail |
| QUEUE | Order ≠ authority priority unless defined |
| PRIORITY | ≠ confidence · ≠ authorized |

**Prohibited defaults:**

```text
unknown evidence → zero
unknown provenance → trusted
missing authority → allowed
missing uncertainty → certain
insufficient evidence → FALSE (or TRUE)
```

---

## Explainability Contract

Non-trivial decisions should eventually answer: what condition · what result · which branch · why · evidence · alternatives · authority · state change.

## Control Receipt

Future architecture: rule_id · input_refs · condition_results · selected_branch · unselected_branches · reason · provenance · uncertainty · authority · timestamp · state_transition.  
**Not implemented.**

## TEVV Relationship

Future tests: branch/guard correctness · transition validity · failure · authority · history · provenance · unknown handling.  
No tests created here.

## Semantic Golden Relationship

Continuous 360 goldens (UNKNOWN≠ZERO · AI≠OBSERVED · CONFLICT PRESERVED · HISTORY RETAINED) may seed future logic goldens.  
**Do not modify C360 goldens in this gate.**

---

## Proposed Z-Specific Primitives

| Primitive | Status | Unique problem? |
| --- | --- | --- |
| CREATE_SHADOW | ARCHITECTURAL_PRIMITIVE_ONLY (`STEWARD_DEFINED`) — ≠ ELSE | Yes |
| STEWARD_GATE | DEFINED conceptually (`STEWARD_DEFINED`) | Yes vs generic human |
| HUMAN_GATE | DEFINED conceptually (`STEWARD_DEFINED`) | Yes |
| PROVENANCE_GUARD | PROPOSED_Z_PRIMITIVE | Yes |
| AUTHORITY_CEILING | DEFINED conceptually | Yes |
| STATE_VERSION | PROPOSED_Z_PRIMITIVE | Yes (C360) |
| CONFLICT_PRESERVE | PROPOSED_Z_PRIMITIVE | Yes |

Prefer standard terminology (IF/THEN/MATCH/…) unless a unique Z problem needs a primitive. **No syntax invented.**

### Proposed vocabulary (readable)

WHEN · IF · THEN · ELSE · MATCH · AND · OR · NOT · REQUIRE · GUARD · ALLOW · DENY · HOLD · BLOCK · STOP · RETURN · FOR EACH · FALLBACK · CREATE_SHADOW · HUMAN_GATE · STEWARD_GATE

---

## Statement Matrix

| Construct | Semantic status | Runtime | Key invariant |
| --- | --- | --- | --- |
| IF | DEFINED | NONE | IF_TRUE ≠ AUTHORIZATION |
| ELSE | DEFINED | NONE | ELSE ≠ Shadow |
| ELSE IF | DEFINED | NONE | None by itself |
| AND | DEFINED | NONE | AND ≠ multiplication |
| OR | DEFINED | NONE | Inclusive OR |
| NOT | DEFINED | NONE | NOT ≠ inverse/Shadow |
| XOR | DEFERRED | NONE | XOR_NOT_REQUIRED_FOR_V1 |
| MATCH | DEFINED | NONE | UNHANDLED_MATCH ≠ SUCCESS |
| REQUIRE | DEFINED | NONE | Failure ≠ silent continue |
| GUARD | DEFINED | NONE | Failure ≠ silent continue; REQUIRE ≠ GUARD |
| HOLD | DEFINED | NONE | Pause / preserve; ≠ BLOCK/STOP |
| BLOCK | DEFINED | NONE | Prohibit candidate/path; ≠ HOLD/STOP |
| STOP | DEFINED | NONE | Terminate bounded path; ≠ HOLD/BLOCK |
| EVENT | DEFINED | NONE | EVENT ≠ command/authorization |
| FOR EACH | DEFINED (architecture) | NONE | Bounded collection |
| WHILE | PARTIAL | NONE | Termination contract required |
| BREAK / CONTINUE | DEFINED | NONE | CONTINUE ≠ authorize |
| TRY / CATCH / FINALLY | DEFINED | NONE | No silent swallow |
| STATE TRANSITION | DEFINED | NONE | ≠ silent overwrite; ≠ authority change |
| RETRY | DEFERRED_P1 | NONE | Domain policy needed |
| TIMEOUT | DEFERRED_P1 | NONE | No global default |
| HUMAN_GATE | DEFINED conceptually | NONE | Scoped; ≠ Steward unless mapped |
| STEWARD_GATE | DEFINED conceptually | NONE | Distinct governance gate |
| CREATE_SHADOW | ARCHITECTURAL PRIMITIVE | NONE | Explicit; ≠ ELSE; runtime NONE |
| ALLOW / DENY | DEFINED (governance) | NONE | Separate from formula truth |
| ASSERT | DEFINED | NONE | Spec/test invariant |
| FALLBACK | DEFINED | NONE | Must not weaken safety |
| QUEUE / PRIORITY | DEFINED | NONE | ≠ authority/truth |

---

## Control Invariants

```text
BINARY_PREDICATES = YES
MULTI_VALUED_STATE_OUTCOMES = YES
CUSTOM_MULTI_VALUED_TRUTH_TABLE = NO
INSUFFICIENT_EVIDENCE MUST_NOT_BE_SILENTLY_COERCED_TO_BOOLEAN

IF_TRUE ≠ AUTHORIZATION
ELSE ≠ SHADOW
AND ≠ MULTIPLICATION
OR = INCLUSIVE_OR
NOT ≠ SHADOW
NOT ≠ MATHEMATICAL_INVERSE
UNHANDLED_MATCH ≠ SUCCESS
REQUIRE_FAILURE ≠ SILENT_CONTINUE
GUARD_FAILURE ≠ SILENT_CONTINUE
REQUIRE ≠ GUARD
HOLD ≠ BLOCK ≠ STOP
STATE_TRANSITION ≠ SILENT_OVERWRITE
STATE_CHANGE ≠ AUTHORITY_CHANGE
EVENT ≠ COMMAND
EVENT ≠ AUTHORIZATION
LOOPS MUST BE BOUNDED
Z_INFINITY ≠ UNBOUNDED_LOOP
ERROR ≠ SILENT_SUCCESS
CONTROL_BRANCH ≠ SHADOW
CREATE_SHADOW ≠ ELSE
CREATE_SHADOW = ARCHITECTURAL_ONLY
HUMAN_GATE ≠ STEWARD_GATE
GATE_PASS ≠ DEPLOY
PREDICATE_EVALUATION ≠ EVIDENCE_MUTATION
BRANCH_SELECTION ≠ SOURCE_REWRITE
CONTROL RESULT ≠ AUTHORITY

TRUE ≠ AUTHORIZED
VALID ≠ AUTHORIZED
READY ≠ DEPLOY
GO ≠ DEPLOY
CAPABILITY ≠ AUTHORITY
FEASIBLE ≠ AUTHORIZED

BOOLEAN_TRUTH ≠ Z_POLARITY
BOOLEAN_NOT ≠ SHADOW
AND ≠ MULTIPLICATION
OR ≠ ADDITION

Z_INFINITY ≠ UNBOUNDED_REPLICATION

AI_PROPOSAL ≠ FACT
SWARM_MAJORITY ≠ GROUND_TRUTH
FIELD_REPRESENTATION ≠ AUTHORITY
FUSION_RESULT ≠ AUTHORIZATION

CONTROL_FLOW CANNOT SELF-ELEVATE AUTHORITY
```

---

## Micro / Meso / Macro Logic

Grammar may later route Micro · Meso · MacroRepresentation without inventing aggregation mathematics.

```text
BROADER VIEW ≠ HIGHER AUTHORITY
```

MMM F4 goldens **unchanged**.

## Maturity

```text
Z LOGIC / CONTROL GRAMMAR = F3 SPECIFICATION
NO runtime · NO DSL · NO parser · NO goldens encoded
```

## Golden Readiness

```text
Z_LOGIC_GOLDEN_READY
```

P0 control semantics sufficiently stable for Z Logic Semantic Goldens Design next. Do not encode in this gate.

## Missing / P1+ Decisions

| Topic | Status |
| --- | --- |
| XOR | DEFERRED · not required for v1 |
| RETRY / TIMEOUT | DEFERRED_P1 |
| Operator precedence / associativity | DEFERRED_TO_FUTURE_GRAMMAR |
| Short-circuit runtime | DEFERRED |
| Side-effect model | DEFERRED_TO_RUNTIME_CHARTER |
| Event-time binding | DEFERRED_P1 |
| Nested Shadow control mapping | DEFERRED |
| CREATE_SHADOW syntax / runtime | Architectural only |
| Parallel / async / cancellation | Unresolved |
| Loop resource numeric limits | Not invented |
| Error taxonomy detail | Architecture only |
| Executable HOLD/BLOCK/STOP bridge across GGAESP / enforcer / STOP_GATE | Recovered lanes remain separate |

## ONE Recommended Next Gate

```text
Z-SANCTUARY-Z-LOGIC-SEMANTIC-GOLDENS-DESIGN-1
```

**Why:** Core P0 Steward decisions sealed; next design expected-behavior vectors for IF/ELSE/AND/OR/NOT/MATCH/REQUIRE/GUARD/HOLD/BLOCK/STOP/CREATE_SHADOW walls — parallel to C360/MMM/Shadow path — without parser or runtime.

**Not opened here.**

## Terminal

```text
Z_LOGIC_AND_CONTROL_GRAMMAR_SPEC_0 = F3_STEWARD_REFINED
PARSER = NONE
DSL = NONE
RUNTIME = NONE
CREATE_SHADOW = ARCHITECTURAL_ONLY
C360_F4 = PRESERVED
MMM_F4 = PRESERVED
SHADOW_F4 = PRESERVED
PRODUCTION_AUTHORITY = NONE
```
