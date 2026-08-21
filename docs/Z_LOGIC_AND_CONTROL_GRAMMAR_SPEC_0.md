# Z-SANCTUARY-Z-LOGIC-AND-CONTROL-GRAMMAR-SPEC-0

**Status:** Architectural control grammar · **F2 / partial F3** · **no runtime / no DSL / no parser**  
**Date:** 2026-08-21  
**Baseline HEAD:** `0daf6c2`  
**Branch:** `cursor/zsanctuary/z-sdc-phase-0-architecture`  
**Mode:** RECOVER · CLASSIFY · SPECIFY · NO IMPLEMENTATION

## Baseline

| Field | Value |
| --- | --- |
| Expected HEAD | Do not assume — verified `0daf6c2` |
| Prior | Continuous 360 Semantic Goldens Design 1.2 |
| Staged | NONE |
| Dirt | Preserved (~182 porcelain lines) |
| Artifacts | This document only |

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

**Distinct systems, not one unified enum yet:**

| Term | Recovered sense | Do not alias |
| --- | --- | --- |
| HOLD | GGAESP advisory pause; release `final_status`; operational wait | ≠ STOP_GATE |
| BLOCK | GGAESP deny candidate; enforcer BLOCK; StopGate state BLOCK | same word, multiple lanes |
| STOP / STOP_GATE | Hard policy/consent pause | ≠ GGAESP HOLD |

Unifying them requires Steward charter — **not** done silently here.

---

## Conditional Statements

### IF

**Purpose:** Conditional gate.  
**Z role:** Evaluate eligibility/truth of a condition; select THEN pathway.  
**Does not grant authority.**

```text
IF condition
THEN pathway
```

Example: `IF provenance_valid THEN continue analysis`.

### ELSE

**Purpose:** Explicit alternative pathway.  
**Rule:** ELSE must not silently mean failure. May resolve to HOLD / REVIEW / UNKNOWN / ALTERNATIVE_PATH / NOT_APPLICABLE per governing contract.

### ELSE IF / multi-branch

Prefer explicit multi-state classification over forced binary where states are enumerated (GO/PREPARE/BLOCK; OBSERVED/DERIVED/PREDICTED/SHADOW).

---

## Boolean Operators

### AND

All required conditions satisfy their contract.  
**AND ≠ multiplication (×).** Keep separate from formula operators.

### OR

One or more accepted alternatives satisfy.  
Default: **INCLUSIVE_OR**.  
**EXCLUSIVE_OR:** DEFERRED until Steward requests.

### NOT

Boolean exclusion.  
**NOT ≠ mathematical inverse ≠ Shadow operator.**

---

## Multi-Branch Logic (MATCH)

Preferred over deep nested IF for enumerated states:

```text
MATCH state
  RAW_STATE     → normalization pathway
  FORMULA_STATE → formula pathway
  SHADOW_STATE  → Shadow pathway
  AI_PROPOSAL   → Steward-review pathway
  UNKNOWN       → HOLD / evidence pathway
```

---

## Guards

High-priority early exits:

```text
GUARD / REQUIRE precondition
otherwise HOLD | STOP | REVIEW
```

Pattern: CHECK → FAIL EARLY → PRESERVE REASON → DO NOT CONTINUE UNSAFELY.  
Maps to Turtle / STOP_GATE / release doctrine.

---

## Stop / Hold / Block

Architectural definitions for **future unified grammar** (labels `PROPOSED_SPECIFICATION` where not already executable):

| Construct | Meaning |
| --- | --- |
| STOP | Terminate current pathway (hard) |
| HOLD | Preserve state; wait for resolution/human |
| BLOCK | Explicitly deny candidate transition/action |

**Do not silently alias** across GGAESP / enforcer / STOP_GATE without Steward bridge.

---

## GO / PREPARE / BLOCK Relationship

GGAESP executable semantics **preserved unchanged**.

Grammar may **reference** externally supplied GGAESP decisions:

```text
MATCH GGAESP decision
  GO      → continue to next authorized gate
  PREPARE → request unresolved prerequisites
  BLOCK   → deny current candidate path
```

(Also GGAESP HOLD — advisory wait.)  
**GO ≠ DEPLOY.** Do not redefine GGAESP.

---

## Iteration

| Construct | Role | Bound |
| --- | --- | --- |
| FOR EACH | Iterate observations/entities/Shadows/reports | required |
| WHILE | Repeat while condition | termination + resource + authority + failure |
| REPEAT UNTIL | Goal-seeking bounded loop | same |
| SEQUENCE / EVENT STREAM ITERATION | Field S(n) walks | versioned |

```text
Z_INFINITY ≠ UNBOUNDED_RUNTIME_LOOP
```

### BREAK

Terminate current bounded iteration for inspectable reason (gate fail / goal / safety / human stop / resource).

### CONTINUE

Skip to next eligible iteration.  
**CONTINUE ≠ AUTHORIZATION_TO_PROCEED.**

---

## Event Logic

```text
WHEN event occurs
  evaluate rule(s)
```

Pattern:

```text
EVENT → CONDITION → ACTION CANDIDATE → GOVERNANCE
```

Not: EVENT → UNCONTROLLED ACTION.  
Events do not grant authority by occurring.

---

## State Machines

```text
STATE A → (guard) → STATE B
```

Transition should eventually carry: source · target · guard · reason · provenance · authority · timestamp · human_gate · failure_path.

### Transition law

```text
STATE_TRANSITION ≠ STATE_OVERWRITE
```

Continuous 360: S(n) → transition → S(n+1) while retaining S(n).

---

## Failure Handling

| Construct | Role |
| --- | --- |
| TRY | Attempt bounded operation |
| CATCH | Capture failure with identity, operation, input ref, time, provenance, partial state, recovery decision |
| FINALLY | Cleanup / receipt — must not convert failure into success |
| THROW / ERROR | Explicit signaling |

Differentiate: ERROR · INVALID_INPUT · UNKNOWN · CONFLICT · BLOCKED · UNAUTHORIZED · NOT_APPLICABLE.

### ASSERT

Spec/test invariants (e.g. `ASSERT AI_PROPOSED != OBSERVED`). Not a substitute for safety-critical input validation.

### REQUIRE

Mandatory precondition; unmet → defined HOLD/failure path.

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
```

Ordinary ELSE is not a Shadow. Shadow needs future taxonomy.  
`IF selected THEN retain unselected as Shadow candidates` = **PROPOSED_ARCHITECTURE** only.

---

## Human / Steward Gates

| Primitive (conceptual) | Role |
| --- | --- |
| REQUIRE_HUMAN | Non-autonomous transition |
| REQUIRE_STEWARD | Steward-specific approval (≠ any human) |

Examples: canon changes · authority elevation · deploy · replication · high-risk domains.  
No auth implementation.

## Authority Ceiling

Operations declare ceiling: OBSERVE · REPORT · SUGGEST · SIMULATE · HUMAN_GATED · BOUNDED_EXECUTION …

```text
CONTROL_FLOW CANNOT SELF-ELEVATE AUTHORITY
```

Invariants:

```text
TRUE ≠ AUTHORIZED
VALID ≠ AUTHORIZED
READY ≠ DEPLOY
GO ≠ DEPLOY
CAPABLE ≠ AUTHORIZED
FEASIBLE ≠ AUTHORIZED
```

ALLOW / DENY are governance — separate from formula truth.

---

## MiniBot Logic

```text
READ scoped state
IF relevant THEN produce observation/proposal (AI_PROPOSED)
ELSE return NO_RELEVANT_SIGNAL
```

Proposal → canon only via human/governance. MiniBots not activated.

## Swarm Logic

Collect MiniBot reports; preserve disagreement; record agreement if supported.

```text
agreement ≠ truth
agreement ≠ authority
SWARM_MAJORITY ≠ GROUND_TRUTH
```

No majority-decision rule invented. Swarm not activated.

## QOSMEI Logic

Collect · compare · fuse · report — advisory.

```text
FUSION_RESULT ≠ AUTHORIZATION
```

## Z-AAI Logic

Explain · expose conflict · propose → governance → human decision.  
Not self-modification. Z-AAI not implemented.

## Replica Fabric Logic

Preserve:

```text
OBSERVE → PROPOSE → SANDBOX → VERIFY → GOVERNANCE
→ HUMAN AUTHORIZATION → BOUNDED CREATION → RECEIPT
```

```text
Z_INFINITY ≠ UNBOUNDED_REPLICATION
UNBOUNDED_SELF_REPLICATION = NOT AUTHORIZED
```

## Combat Logic

```text
IF Combat profile active AND physical data available
THEN enable applicable spatial analysis
ELSE do not fabricate physical state
```

Do not change Combat formulas/physics.

## Continuous 360 Integration

Grammar operates on ENTITY · TIME · SEQUENCE · STATE · RELATIONSHIPS · PROVENANCE · UNCERTAINTY.

Example:

```text
IF state == AI_PROPOSAL AND provenance == AI_PROPOSED
THEN prevent OBSERVED classification
```

C360 semantics unchanged by this gate.

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
```

---

## Multi-Valued Logic Question

Sanctuary already distinguishes TRUE / FALSE / UNKNOWN / MISSING / CONFLICTING / NOT_APPLICABLE (and HOLD/BLOCK return classes).

**Verdict:**

```text
STEWARD_DECISION_REQUIRED
```

**Recommendation (not sealed):** keep **binary Boolean** for pure guards where inputs are well-defined; use **multi-valued outcome classes** for returns and field states. Do not invent truth tables in this gate.

Also:

```text
TRUE ≠ CERTAIN
FALSE ≠ IMPOSSIBLE
```

## Evaluation / Side-Effect Rules

- Prefer **PURE CONDITIONS** (no side effects inside IF predicates).
- Prefer **EXPLICIT_GROUPING** `(A AND (B OR C))`.
- Short-circuit: DEFERRED for runtime; avoid effectful B in `A AND B`.
- Preferred pattern: `result = check_state()` then `IF result THEN request transition`.

### Determinism class (future declaration)

DETERMINISTIC · DOMAIN_DEPENDENT · AI_ASSISTED · HUMAN_DECIDED · STOCHASTIC · UNKNOWN  
AI-assisted ≠ deterministic.

### Defaults / OPTIONAL / FALLBACK / RETRY / TIMEOUT / QUEUE / PRIORITY

| Construct | Rule |
| --- | --- |
| OPTIONAL | Absence ≠ zero / trusted / certain |
| DEFAULT | Only where spec defines; prohibited defaults listed below |
| FALLBACK | Controlled degrade; must not weaken safety |
| RETRY | Needs max attempts / classes / delay / idempotency / authority / stop — **no numbers invented** |
| TIMEOUT | Explicit TIMEOUT / HOLD / UNKNOWN — not silent success/fail |
| QUEUE | Order ≠ authority priority unless defined |
| PRIORITY | ≠ confidence · ≠ authorized |

**Prohibited defaults:**

```text
unknown evidence → zero
unknown provenance → trusted
missing authority → allowed
missing uncertainty → certain
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
| SHADOW (as control) | PROPOSED_Z_PRIMITIVE — needs taxonomy; ≠ ELSE | Yes |
| STEWARD_GATE | PROPOSED_Z_PRIMITIVE | Yes vs generic human |
| PROVENANCE_GUARD | PROPOSED_Z_PRIMITIVE | Yes |
| AUTHORITY_CEILING | PROPOSED_Z_PRIMITIVE | Yes |
| STATE_VERSION | PROPOSED_Z_PRIMITIVE | Yes (C360) |
| CONFLICT_PRESERVE | PROPOSED_Z_PRIMITIVE | Yes |

Prefer standard terminology (IF/THEN/MATCH/…) unless a unique Z problem needs a primitive. **No syntax invented.**

### Proposed vocabulary (readable)

WHEN · IF · THEN · ELSE · MATCH · AND · OR · NOT · REQUIRE · GUARD · ALLOW · DENY · HOLD · STOP · RETURN · FOR EACH · FALLBACK

---

## Statement Matrix

| Statement / Construct | Standard meaning | Z role | Authority effect | Ready? |
| --- | --- | --- | --- | --- |
| IF | Conditional | Eligibility gate | None by itself | DEFINED |
| ELSE | Alternative | Explicit alt path | None | DEFINED |
| ELSE IF | Multi-branch | Classification | None | DEFINED |
| AND | Conjunction | All conditions | None | DEFINED |
| OR | Inclusive disjunction | Alternatives | None | DEFINED |
| NOT | Negation | Exclusion | None | DEFINED |
| MATCH | Dispatch | Multi-state | None | DEFINED |
| GUARD | Early exit | Fail-safe | May force HOLD/STOP | DEFINED |
| REQUIRE | Precondition | Mandatory gate | May force HOLD | DEFINED |
| ALLOW | Permit | Governance | Yes | DEFINED |
| DENY | Forbid | Governance | Yes | DEFINED |
| HOLD | Wait/preserve | Pause pathway | Preserves; no elevate | PARTIAL |
| STOP | Terminate | Hard stop | Deny continue | PARTIAL |
| BLOCK | Deny transition | Explicit denial | Deny | PARTIAL |
| FOR EACH | Iterate | Bounded scan | None | DEFINED |
| WHILE | Loop | Bounded repeat | None | DEFINED |
| BREAK | Exit loop | Inspectable stop | None | DEFINED |
| CONTINUE | Next iter | Skip | ≠ authorize | DEFINED |
| RETURN | Output class | Typed result | None | DEFINED |
| WHEN/EVENT | On event | Trigger evaluate | None | DEFINED |
| TRY | Attempt | Bounded try | None | DEFINED |
| CATCH | Handle fail | Preserve failure | None | DEFINED |
| FINALLY | Cleanup | Receipt/cleanup | Must not fake success | DEFINED |
| ASSERT | Invariant check | Spec/test | None | DEFINED |
| FALLBACK | Degrade path | Safety degrade | Must not weaken safety | DEFINED |
| RETRY | Re-attempt | Bounded retry | Deferred policy | DEFERRED |
| TIMEOUT | Bound wait | Explicit timeout state | Deferred policy | DEFERRED |
| XOR | Exclusive or | — | — | DEFERRED |
| QUEUE | Ordered work | Work ordering | ≠ priority authority | DEFINED |
| PRIORITY | Urgency | Scheduling | ≠ truth/auth | DEFINED |

---

## Control Invariants

```text
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
CONTROL_BRANCH ≠ SHADOW

Z_INFINITY ≠ INFINITE_RUNTIME_LOOP
Z_INFINITY ≠ UNBOUNDED_REPLICATION

AI_PROPOSAL ≠ FACT
SWARM_MAJORITY ≠ GROUND_TRUTH
FIELD_REPRESENTATION ≠ AUTHORITY
FUSION_RESULT ≠ AUTHORIZATION

STATE_TRANSITION ≠ STATE_OVERWRITE
CONTROL_FLOW CANNOT SELF-ELEVATE AUTHORITY
```

---

## Micro / Meso / Macro Logic

Grammar must apply at MICRO / MESO / MACRO without inventing aggregation mathematics.

## Maturity

```text
F2 / PARTIAL F3 ARCHITECTURAL SPEC
NO parser · NO compiler · NO DSL · NO interpreter · NO rule engine
```

## Missing Decisions

| Decision | Why |
| --- | --- |
| Unify HOLD/BLOCK/STOP across GGAESP / enforcer / STOP_GATE? | Naming collision |
| Multi-valued decision logic seal | STEWARD_DECISION_REQUIRED |
| XOR needed? | Deferred |
| Retry/timeout numeric policies | Domain-specific later |
| Shadow-as-control primitive syntax | Needs Shadow taxonomy |
| Encode first logic goldens from C360 pack | After Steward accepts encode gate |

## ONE Recommended Next Gate

```text
Accept + encode Continuous 360 semantic goldens (24 P0 pack)
```

**Why:** Control grammar is now specified enough to *consume* field invariants as future logic goldens (`FIELD_GOLDENS_CAN_SEED_LOGIC_GOLDENS`). Encoding C360 goldens first gives deterministic DNA before any parser/DSL.  

Alternate: Steward decision on multi-valued logic + HOLD/BLOCK/STOP unification.  
**Not opened here.**

## Terminal

```text
Z_LOGIC_AND_CONTROL_GRAMMAR_SPEC_0 = SEALED_DOCS
RUNTIME = NONE
CUSTOM_LANGUAGE = NO
PRODUCTION_AUTHORITY = NONE
```
