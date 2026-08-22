# Z-SANCTUARY-SHADOW-TAXONOMY-CONTRACT-SPEC-1

**Status:** Shadow taxonomy + architectural contract · **F3 SPECIFICATION** · **no Shadow engine**  
**Date:** 2026-08-22  
**Baseline HEAD:** `08875f2` (refined at Steward P0 `20fea2f`+)  
**Branch:** `cursor/zsanctuary/z-sdc-phase-0-architecture`  
**Mode:** RECOVER · CLASSIFY · SPECIFY · STEWARD P0 REFINED · NO IMPLEMENTATION  
**Steward P0 receipt:** `docs/Z_SHADOW_STEWARD_P0_DECISIONS_1_1.md`

## Baseline

| Field | Value |
| --- | --- |
| Expected HEAD | `08875f2` |
| Actual start HEAD | `08875f2` |
| Prior seals | C360 F3+F4 · Z Logic Spec 0 · Identity Registry 0.5/0.6 |
| Steward P0 | Recorded in companion receipt 1.1 |
| Later preserved | Micro/Meso/Macro F4 (`20fea2f`) untouched by this refinement |
| Staged | NONE |
| Dirt | Preserved |
| C360 F4 goldens | **NOT MODIFIED** |
| MMM F4 goldens | **NOT MODIFIED** |
| Z Logic spec | **NOT MODIFIED** |
| Identity registry | **NOT MODIFIED** |

## Purpose

Define what qualifies as a Shadow, what does not, how historical meanings stay separate, and the minimum reasoning-Shadow contract — without creating a Shadow engine, operator, score, or runtime.

## Historical Recovery

Recovered Shadow-bearing systems include: OTel/OPA Shadow Foundation · SSWS shadow workspaces/spines · Shadow HODP/workbench mirrors · ZSX shadow preview · VILE / zuno-shadow validation · QOSMEI `shadow: true` families · Ultra “Z-Shadow Guardians” metaphor · EDII Shadow Instances · Replica Fabric “shadow replica” vocabulary · C360 `SHADOW_STATE` / goldens · proposed adversarial/impact Shadows · Formula Shadow contract (undefined operator).

## Existing Shadow Meanings

| Name / ID | Meaning | Runtime? | Class | Trust |
| --- | --- | --- | --- | --- |
| shadow-family | Umbrella only | No | OTHER | CURRENT_DOC |
| C360 SHADOW_STATE | Alternate/counterfactual representation | No | REASONING | CURRENT_DOC / F4 goldens |
| SHADOW_FUTURE | Alternate future time class | No | REASONING | CURRENT_DOC |
| AI_SHADOW | AI write class | No | REASONING | PROPOSED |
| formula-shadow-contract | Typed formula Shadow | No | PROPOSED | PROPOSED_ARCHITECTURE |
| shadow-foundation-otel-opa | Advisory OTel + OPA | Bounded advisory | OPERATIONAL / GOVERNANCE | CURRENT_EXECUTABLE |
| SSWS shadow workspaces | Assignment-scoped workspace files | Scripts/verify | OPERATIONAL | CURRENT_REGISTRY |
| Shadow HODP / workbench | Observe-only dashboard mirror | Static HTML | OPERATIONAL | CURRENT_DOC |
| Shadow preview (ZSX) | Read-only capability preview | No live bridge | GOVERNANCE | CURRENT_DOC |
| VILE / zuno-shadow | Validation pipeline / framework | Package/framework | OPERATIONAL / GOVERNANCE | CURRENT_DOC |
| QOSMEI shadow:true | Non-production family hooks | Advisory fusion | OTHER | CURRENT_REGISTRY |
| Ultra Z-Shadow Guardians | Doctrine metaphor | No | OTHER | CURRENT_DOC |
| EDII Shadow Instances | Per-project EDII instance design | Conceptual | GOVERNANCE | CURRENT_DOC |
| Replica “shadow replica” vocab | Governed replica language reuse | Validator only | GOVERNANCE | CURRENT_DOC |
| z-adversarial-shadow | Security checklist | No | PROPOSED | PROPOSED_ARCHITECTURE |
| z-impact-shadow | Impact questions | No | PROPOSED | PROPOSED_ARCHITECTURE |

**Law:** Shared word ≠ shared implementation.

## Naming Collision Matrix

| Collision | Verdict |
| --- | --- |
| OTel/OPA Shadow vs C360 SHADOW_STATE | **SEPARATE** — operational advisory ≠ reasoning alternate state |
| SSWS / HODP / preview “shadow” | **OPERATIONAL / GOVERNANCE** — mirror/workspace — ≠ reasoning Shadow |
| VILE / zuno-shadow “Shadow Validation” | **VALIDATION FRAMEWORK** — ≠ Formula Shadow operator |
| Replica “shadow replica” | **VOCABULARY REUSE** — Replica ≠ Reasoning Shadow |
| QOSMEI shadow:true | **MANIFEST FLAG** — ≠ typed Shadow contract |
| Ultra guardians “Shadow” | **METAPHOR** |
| IF/ELSE control branch | **≠ SHADOW** (sealed) |
| Mirror (SSWS/HODP) | **RELATED operational language**; no formal Mirror=Shadow law |

## Core Shadow Definition

### Umbrella split (`DERIVED_ARCHITECTURE`)

```text
REASONING_SHADOW
≠ OPERATIONAL_SHADOW
≠ GOVERNANCE_VALIDATION_SHADOW
≠ METAPHOR_SHADOW
```

### Reasoning Shadow (`STEWARD_DEFINED`)

> A **Reasoning Shadow** is a separately identified, provenance-preserving **alternative relative to an explicit base reference**, maintained for comparison, challenge, counterfactual exploration, risk analysis, AI-alternative reasoning, or another explicitly declared reasoning purpose — and **never treated as observed fact merely because it exists**.

```text
CANONICAL_REASONING_SHADOW_CLASSES_V1 =
COUNTERFACTUAL
ALTERNATIVE_STATE
AI_PROPOSED
```

### Minimum distinguishing properties

A Reasoning Shadow is **not** merely “another possibility.” Minimum distinctions:

| Compared to | Distinguisher |
| --- | --- |
| Observation | Not observed evidence; may be *derived from* observed base |
| Prediction | Not automatically “what will happen”; may be alternate/non-forecast |
| Simulation | Simulation is a *production method*; Shadow is a *reasoning role* |
| Control branch | ELSE/path ≠ Shadow unless explicitly registered |
| Backup / failover | Operational redundancy ≠ counterfactual reasoning |
| Replica | Bounded instance/copy ≠ alternate reasoning state |
| AI proposal | May *become* AI-proposed Shadow only with AI provenance + base + purpose |
| Formula output | Formula result is FORMULA_DERIVED; Shadow is alternate relative to a base |
| Historical version | Prior accepted state is history, not automatically a Shadow |

## Shadow vs Observation

```text
OBSERVED_STATE ≠ SHADOW_STATE
```

Creating a Shadow **does not mutate** the base. Even if a Shadow later matches reality, the historical Shadow remains a Shadow; a **new observation** represents what occurred (`SEALED` via C360 F4 D1/D2/E2 spirit).

```text
CREATING SHADOW DOES NOT MUTATE BASE
BASE ≠ SHADOW(BASE)
```

## Shadow vs Prediction

**Verdict:** `PREDICTION_SEPARATE_FROM_SHADOW` with `RELATIONSHIP_PARTIAL` allowance.

| | Prediction | Shadow |
| --- | --- | --- |
| Role | Candidate estimate of what may occur | Explicit alternative for compare/challenge/explore |
| Class | PREDICTED_STATE | SHADOW_STATE |
| May interact | Prediction may *seed* a Shadow if explicitly registered | Shadow may contain forecast-like content without becoming PREDICTED |

Do not auto-equate.

## Shadow vs Simulation

```text
SIMULATION ≠ SHADOW
```

unless a simulation result is **explicitly registered** as a Shadow. Simulation = how produced; Shadow = reasoning role.

## Shadow vs Control Branch

```text
CONTROL_BRANCH ≠ SHADOW
IF / ELSE ≠ SHADOW
```

Promotion of an unselected branch to Shadow candidate must be **explicit** (`PROPOSED_ARCHITECTURE`).

## Shadow vs Mirror

Mirror (HODP/SSWS/preview) = observe-only / workspace / capability mirror.  
**RELATED_VOCABULARY** to operational Shadow; **SEPARATE** from Reasoning Shadow. No `Mirror = Shadow` law sealed.

## Shadow vs Replica

```text
REPLICA ≠ SHADOW
```

`SUPPORTED_NEW_SPEC` from architecture + Replica Fabric doctrine (Replica ≠ authority; vocabulary reuse ≠ identity).

---

## Reasoning Shadow Taxonomy

| Class | Status | Notes |
| --- | --- | --- |
| Counterfactual Shadow | **CANONICAL_V1** (`STEWARD_DEFINED`) | Base + explicit changed assumption(s); ≠ causal proof |
| Alternative-State Shadow | **CANONICAL_V1** (`STEWARD_DEFINED`) | Distinct alternative relative to same explicit base |
| AI-Proposed Shadow | **CANONICAL_V1** (`STEWARD_DEFINED`) | Must retain AI provenance; ≠ observation/canon/authorization |
| Risk Shadow | **DEFERRED / PROPOSED** | Prefer COUNTERFACTUAL or ALTERNATIVE_STATE + purpose=RISK_ANALYSIS |
| Formula Shadow | **DEFERRED** | Operator **UNDEFINED** |
| Simulation Shadow | **DEFERRED / PROPOSED** | Simulation = method; Shadow only if explicitly registered |
| Historical Shadow | **DEFERRED** | History ≠ Shadow by default |
| Combat Shadow | **DEFERRED** | Domain-specific future specialization |

## Operational / Governance Shadow Taxonomy

| Class | Status | Notes |
| --- | --- | --- |
| OTel/OPA advisory Shadow | **RECOVERED_CANON** | Separate technology |
| SSWS shadow workspace / spine | **RECOVERED_CANON** | Separate |
| Shadow preview / HODP mirror | **RECOVERED_CANON** | Separate |
| VILE / zuno-shadow validation | **RECOVERED_CANON** | Separate |
| QOSMEI shadow:true flag | **RECOVERED_CANON** (manifest) | Separate |
| EDII Shadow Instances | **RECOVERED_CANON** (design) | Separate |
| Adversarial Shadow | **PROPOSED_ARCHITECTURE** | Purpose/specialization — not v1 base class (`STEWARD_DEFINED`) |
| Impact Shadow | **PROPOSED_ARCHITECTURE** | Impact-assessment module/purpose — not v1 base class (`STEWARD_DEFINED`) |

---

## Base Reference Contract

```text
BASE_REFERENCE_REQUIRED = YES
SHADOW_WITHOUT_BASE_REFERENCE = INVALID / INCOMPLETE
```

`STEWARD_DEFINED`. Base may refer to eligible state · event · formula result · candidate · relationship · MacroRepresentation · other explicitly defined base object. Orphan Shadows not allowed. Base preserved; creating Shadow does not mutate base.

## Assumptions Contract

```text
SHADOW_ASSUMPTIONS_REQUIRED = YES
HIDDEN_ASSUMPTIONS → INCOMPLETE SHADOW
```

`STEWARD_DEFINED` for every Reasoning Shadow. Field may explicitly state `NO_ADDITIONAL_ASSUMPTIONS` where appropriate. Do not invent assumptions automatically.

## Purpose Contract

```text
SHADOW_PURPOSE_REQUIRED = YES
```

`STEWARD_DEFINED`. Purpose ≠ class. Compact vocabulary:

```text
COMPARE · CHALLENGE · COUNTERFACTUAL · RISK_ANALYSIS · ADVERSARIAL_CHALLENGE · IMPACT_ANALYSIS · AI_ALTERNATIVE · DOMAIN_SPECIFIC
```

## Provenance Contract

```text
PROVENANCE_REQUIRED = YES
```

Origin classes: HUMAN_PROPOSED · FORMULA_DERIVED · SIMULATION_DERIVED · AI_PROPOSED · RULE_DERIVED · IMPORTED · UNKNOWN  

Origin ≠ truth. AI Shadows retain AI provenance.

## Uncertainty Contract

No universal Shadow probability. Use C360 uncertainty: NOT_ASSESSED · QUALITATIVE · QUANTIFIED (+ domain value only when justified). No `shadow_probability` / `shadow_confidence_score`.

## Lifecycle Contract

Architecture-level states (`STEWARD_DEFINED`):

```text
CANDIDATE · ACTIVE_FOR_COMPARISON · RETAINED · REJECTED · SUPERSEDED
```

Do **not** use OBSERVED as a lifecycle transition. If a Shadow later matches reality, create a **new observation**; historical Shadow remains a Shadow.

Promotion path:

```text
SHADOW → evidence/test → proposal → governance → human/Steward decision
```

Never automatic SHADOW → OBSERVED or SHADOW → CANON.

## Authority Contract

```text
SHADOW_AUTHORITY_ELEVATION = NONE
SHADOW ≠ AUTHORITY
SHADOW ≠ PERMISSION
SIMULATE ALLOWED ≠ EXECUTE ALLOWED
SHADOW PATH CANNOT BYPASS BASE AUTHORITY REQUIREMENTS
```

Ceiling: inform · challenge · compare · warn · propose — **never** authorize/deploy/rewrite canon/delete base/override Steward.

## Shadow Difference Contract

```text
SHADOW_DIFFERENCE_EXPLANATION_REQUIRED = YES
```

`STEWARD_DEFINED`. Every canonical Reasoning Shadow must be able to state: WHAT differs from base? WHY? WHICH assumptions changed? WHICH evidence shared? WHICH evidence differs? No automated diff engine.

## Retention Contract

```text
SHADOW_AUDIT_RETENTION_DEFAULT = PRESERVE_WHERE_GOVERNANCE_PERMITS
```

`STEWARD_DEFINED`. Not infinite retention. Rejected Shadow ≠ automatic deletion; may be removed where policy requires. Auditability subject to privacy/retention governance.

---

## Continuous 360 Relationship

C360 already includes `SHADOW_STATE`. Conceptual:

```text
FieldState
  ├─ ObservedState
  ├─ PredictedState
  └─ ShadowState
```

**C360 semantics unchanged. F4 goldens unchanged.**

Conceptual ShadowState fields (architecture only): shadow_id · base_state_ref · shadow_class · purpose · assumptions · provenance · uncertainty.

## Time / Sequence Relationship

Shadows may refer to PAST COUNTERFACTUAL · PRESENT ALTERNATIVE · FUTURE ALTERNATIVE without collapse. Future Shadow ≠ Prediction automatically.

Sequence architecture: branch from S(n) to S_shadow(n+1) while observed S(n+1) proceeds — **no branching engine**.

## Micro / Meso / Macro Relationship

Preserve sealed MMM F4 aggregation behavior (`STEWARD_DEFINED` alignment; MMM goldens **not modified**):

```text
BASE MICRO → BASE MESO → BASE MACRO
SHADOW MICRO → SHADOW MESO → SHADOW MACRO
COMPARE between lanes
```

| Layer | Posture |
| --- | --- |
| Micro | Shadow may attach to one observation/state/relationship/formula result |
| Meso | Shadow alternatives for local clusters — parallel to base, not mixed into “truth” |
| Macro | Macro Shadow must remain **traceable** to lower-level Shadow refs · relevant base refs · assumptions · provenance |

```text
DO NOT merge lanes.
DO NOT aggregate OBSERVED + SHADOW + AI_PROPOSED into a single Macro truth.
No aggregation runtime in this gate.
```

## Formula Shadow

```text
FORMULA_SHADOW = DEFERRED
FORMULA_SHADOW_OPERATOR = UNDEFINED
```

```text
FORMULA_SHADOW ≠ MATHEMATICAL_INVERSE
FORMULA_SHADOW ≠ BOOLEAN_NOT
FORMULA_SHADOW ≠ ELSE
FORMULA_SHADOW ≠ parameter flip / competing formula (unless future formula evidence defines it)
```

Meaning of Formula Shadow remains **UNRESOLVED** — deferred, not rejected.

## GGAESP Relationship

**PROPOSED only:** base + Shadows → adapter/compare → GGAESP, or GGAESP result → Shadow challenge. GGAESP **unchanged**.

## Z Logic Relationship

```text
SHADOW_CONTROL_PRIMITIVE_REQUIRED = YES
CREATE_SHADOW = ARCHITECTURAL_PRIMITIVE_ONLY
RUNTIME = NONE
SYNTAX = UNDEFINED
CREATE_SHADOW ≠ ELSE
CONTROL_BRANCH ≠ SHADOW
```

`STEWARD_DEFINED`. Conceptual preconditions: base reference · purpose · assumptions · provenance · creation bounded · base not mutated · authority ceiling preserved. **Z Logic spec not amended in this gate.**

## MiniBot / Swarm / QOSMEI / Z-AAI

| Actor | Posture |
| --- | --- |
| MiniBot | May suggest Shadow candidate → AI provenance; not OBSERVED_FACT; not activated |
| Swarm | Multiple candidates; SHADOW_CONSENSUS ≠ STEWARD_DECISION; SWARM_SHADOW_MAJORITY ≠ TRUTH; not activated |
| QOSMEI | May fuse observed + formula + Shadow + MiniBot → advisory; fusion ≠ authorization; Shadow interpretation ≠ observed fact |
| Z-AAI | Generate/compare/explain Shadows; AI Shadow ≠ observation/canon/authorization |

## Adversarial Shadow

Remains `PROPOSED_ARCHITECTURE` (`STEWARD_DEFINED` placement). Prefer purpose/specialization:

```text
class = COUNTERFACTUAL or ALTERNATIVE_STATE
purpose = ADVERSARIAL_CHALLENGE
```

Not a v1 canonical base class. Not activated.

## Impact Shadow

Remains `PROPOSED_ARCHITECTURE` (`STEWARD_DEFINED` placement). Prefer impact-assessment module/purpose using Shadow comparison — not collapsed into Shadow engine / not v1 base class.

## Combat Shadow

`DOMAIN_SPECIFIC_FUTURE_SPECIALIZATION` — alternate trajectory/energy/stability etc. require physics contracts. No biomechanical superiority claimed.

## Governance / Replica Safety

Replica Fabric lifecycle preserved. Shadow cannot authorize replication/deploy. Unbounded self-replication still forbidden.

## Boundedness

```text
SHADOW_GENERATION_MUST_BE_BOUNDED = YES
Z_INFINITY ≠ UNBOUNDED_SHADOW_BRANCHING
Z_INFINITY ≠ UNBOUNDED_SHADOW_RECURSION
SHADOW_SPACE_COMPLETENESS = UNDEFINED GENERALLY
SHADOW_COUNT ≠ CONFIDENCE
MORE_SHADOWS ≠ MORE_TRUTH
SHADOW_EQUIVALENCE_OPERATOR = UNDEFINED
SHADOW_OF_SHADOW = DEFERRED
UNBOUNDED_SHADOW_DEPTH = NOT_AUTHORIZED
```

`STEWARD_DEFINED`: no unrestricted recursive Shadow generation in v1. Future domain may reopen.

## Explainability Contract

See Difference Contract (`STEWARD_DEFINED`). Future Shadow receipt: shadow_id · base_ref · class · purpose · assumptions · origin · provenance · uncertainty · created_at · status · comparison_result · authority_ceiling — **not implemented**.

## Graceful Degradation

```text
SHADOW CAPABILITY = OPTIONAL ADVANCED REASONING LAYER
```

Core Continuous 360 + human inspection remain usable without Shadows.

## Privacy / Security

Minimum necessary data · purpose limitation · retention bounds. Hostile Shadow cannot bypass base authority.

---

## Master Shadow Taxonomy

| Identity / class | Meaning | Provenance | Canon status | Runtime | Separate from |
| --- | --- | --- | --- | --- | --- |
| Reasoning Shadow (core) | Alternate vs base for compare/challenge | Required | **CANONICAL_V1** (`STEWARD_DEFINED`) | No | Operational Shadows |
| Counterfactual | Changed assumptions | Required | **CANONICAL_V1** | No | Causal proof |
| Alternative-State | Plausible alternate | Required | **CANONICAL_V1** | No | Prediction auto |
| AI-Proposed Shadow | AI-origin alternate | AI_PROPOSED | **CANONICAL_V1** | No | OBSERVED |
| Risk Shadow | Adverse-oriented alternate | Required | DEFERRED | No | Harm certainty |
| Formula Shadow | Formula alternative | TBD | DEFERRED | No | Inverse/NOT/ELSE |
| Simulation Shadow | Registered sim result | SIMULATION_DERIVED | DEFERRED | No | Raw sim alone |
| OTel/OPA Shadow | Advisory observe/policy | System | RECOVERED_CANON | Advisory | Reasoning Shadow |
| SSWS/HODP/Preview | Workspace/mirror/preview | System | RECOVERED_CANON | Partial | Reasoning Shadow |
| VILE/zuno-shadow | Validation framework | System | RECOVERED_CANON | Framework | Reasoning Shadow |
| Adversarial / Impact | Purpose/module (not v1 class) | Proposed | PROPOSED_ARCHITECTURE | No | Core v1 taxonomy |

## Reasoning Shadow Contract Matrix

| Contract property | Required? | Definition | Status |
| --- | --- | --- | --- |
| shadow_id | REQUIRED | Stable identity | DEFINED |
| base_reference | REQUIRED | Explicit base | DEFINED (`STEWARD_DEFINED`) |
| class | REQUIRED | COUNTERFACTUAL · ALTERNATIVE_STATE · AI_PROPOSED | DEFINED (`STEWARD_DEFINED`) |
| purpose | REQUIRED | Controlled purpose | DEFINED (`STEWARD_DEFINED`) |
| assumptions | REQUIRED | Inspectable; may be NO_ADDITIONAL_ASSUMPTIONS | DEFINED (`STEWARD_DEFINED`) |
| provenance | REQUIRED | Origin class | DEFINED (`STEWARD_DEFINED`) |
| uncertainty | REQUIRED concept | C360 structures | DEFINED |
| lifecycle | Architecture | CANDIDATE…SUPERSEDED | DEFINED (`STEWARD_DEFINED`) |
| authority | REQUIRED | Ceiling NONE elevate | DEFINED (`STEWARD_DEFINED`) |
| difference explanation | REQUIRED | Explainability answers | DEFINED (`STEWARD_DEFINED`) |

---

## P0 Invariants

| Invariant | Status |
| --- | --- |
| SHADOW ≠ OBSERVED | **YES** (sealed via C360 + this contract) |
| SHADOW ≠ AUTHORITY | **YES** |
| SHADOW DOES NOT MUTATE BASE | **YES** |
| SHADOW RETAINS BASE REFERENCE | **YES** |
| SHADOW RETAINS PROVENANCE | **YES** |
| SHADOW RETAINS ASSUMPTIONS | **YES** (`STEWARD_DEFINED`) |
| SHADOW PURPOSE REQUIRED | **YES** (`STEWARD_DEFINED`) |
| SHADOW DIFFERENCE EXPLANATION REQUIRED | **YES** (`STEWARD_DEFINED`) |
| SHADOW ≠ CONTROL_BRANCH | **YES** |
| SHADOW ≠ BOOLEAN_NOT | **YES** |
| SHADOW ≠ MATHEMATICAL_INVERSE | **YES** |
| SHADOW ≠ REPLICA | **YES** |
| AI SHADOW RETAINS AI PROVENANCE | **YES** |
| COUNTERFACTUAL ≠ CAUSAL PROOF | **YES** (`STEWARD_DEFINED`) |
| MORE SHADOWS ≠ MORE TRUTH | **YES** |
| SHADOW CONSENSUS ≠ STEWARD DECISION | **YES** |
| SHADOW GENERATION MUST BE BOUNDED | **YES** |
| SHADOW SPACE COMPLETENESS NOT GENERALLY CLAIMED | **YES** |
| UNBOUNDED SHADOW RECURSION NOT AUTHORIZED | **YES** (`STEWARD_DEFINED`) |
| CREATE_SHADOW ARCHITECTURAL PRIMITIVE REQUIRED | **YES** (`STEWARD_DEFINED`) |
| CREATE_SHADOW IMPLEMENTED | **NO** |

## Maturity

```text
SHADOW TAXONOMY / CONTRACT = F3 SPECIFICATION
NO engine · NO operator · NO score · NO goldens encoded
```

## Golden Readiness

```text
SHADOW_GOLDEN_READY
```

P0 contract closed enough to design semantic goldens (not encode in this gate).

## Missing Mathematics

- Formula Shadow operator
- Shadow distance / equivalence
- Shadow probability / score
- Branching transition math
- Nested Shadow semantics (deferred)

## Missing Canon / P1+

- Formula Shadow meaning
- Whether Risk becomes a distinct class later
- Simulation specialization details
- Shadow equivalence/deduplication
- Domain-specific retention periods
- Combat specialization
- CREATE_SHADOW syntax (Z Logic later)

## Steward Decisions Required

**P0 closed** — see `docs/Z_SHADOW_STEWARD_P0_DECISIONS_1_1.md`.

## ONE Recommended Next Gate

```text
Z-SANCTUARY-SHADOW-SEMANTIC-GOLDENS-DESIGN-1
```

**Why:** Canonical classes + required fields sealed; next design expected vectors for Reasoning Shadow v1 — parallel to C360/MMM goldens path — without Shadow engine.

**Not opened here.**

## Terminal

```text
SHADOW_TAXONOMY_AND_CONTRACT_SPEC_1 = F3_STEWARD_REFINED
SHADOW_ENGINE = NONE
FORMULA_SHADOW_OPERATOR = UNDEFINED
CREATE_SHADOW = ARCHITECTURAL_ONLY
C360_F4 = PRESERVED
MMM_F4 = PRESERVED
PRODUCTION_AUTHORITY = NONE
```
