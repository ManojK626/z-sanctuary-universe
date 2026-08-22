# Z-SANCTUARY-SHADOW-TAXONOMY-CONTRACT-SPEC-1

**Status:** Shadow taxonomy + architectural contract · **F2 / partial F3** · **no Shadow engine**  
**Date:** 2026-08-22  
**Baseline HEAD:** `08875f2`  
**Branch:** `cursor/zsanctuary/z-sdc-phase-0-architecture`  
**Mode:** RECOVER · CLASSIFY · SPECIFY · CONTRACT ONLY

## Baseline

| Field | Value |
| --- | --- |
| Expected HEAD | `08875f2` |
| Actual start HEAD | `08875f2` |
| Prior seals | C360 F3+F4 · Z Logic Spec 0 · Identity Registry 0.5/0.6 |
| Staged | NONE |
| Dirt | Preserved |
| C360 F4 goldens | **NOT MODIFIED** |
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

### Reasoning Shadow (proposed refined definition)

`PROPOSED_SPECIFICATION` (refined from charter candidate):

> A **Reasoning Shadow** is a separately identified, provenance-preserving **alternative relative to an explicit base reference**, maintained for comparison, challenge, counterfactual exploration, risk analysis, formula-alternative reasoning, or another explicitly declared reasoning purpose — and **never treated as observed fact merely because it exists**.

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
| Counterfactual Shadow | **SUPPORTED_NEW_SPEC** | Base + explicit changed assumption(s); ≠ causal proof |
| Alternative-State Shadow | **SUPPORTED_NEW_SPEC** | Plausible alternate relative to shared base |
| Risk Shadow | **PROPOSED** | Adverse-oriented alternative; not proof harm will occur |
| Formula Shadow | **PROPOSED** | Operator **UNDEFINED** |
| Simulation Shadow | **PROPOSED** | Simulation result registered for comparison |
| AI-Proposed Shadow | **SUPPORTED_NEW_SPEC** | Must retain AI provenance |
| Historical Shadow | **DEFERRED / REJECTED as automatic class** | History ≠ Shadow by default |
| Combat Shadow | **DOMAIN_SPECIFIC_FUTURE_SPECIALIZATION** | Needs physics contracts |

## Operational / Governance Shadow Taxonomy

| Class | Status | Notes |
| --- | --- | --- |
| OTel/OPA advisory Shadow | **RECOVERED_CANON** | Separate technology |
| SSWS shadow workspace / spine | **RECOVERED_CANON** | Separate |
| Shadow preview / HODP mirror | **RECOVERED_CANON** | Separate |
| VILE / zuno-shadow validation | **RECOVERED_CANON** | Separate |
| QOSMEI shadow:true flag | **RECOVERED_CANON** (manifest) | Separate |
| EDII Shadow Instances | **RECOVERED_CANON** (design) | Separate |
| Adversarial Shadow | **PROPOSED_ARCHITECTURE** | Prefer purpose/module — Steward decide |
| Impact Shadow | **PROPOSED_ARCHITECTURE** | Prefer impact layer using Shadow-like compare — Steward decide |

---

## Base Reference Contract

| Property | Verdict |
| --- | --- |
| Every Reasoning Shadow requires base reference? | **YES** (`REQUIRED`) |
| `SHADOW_WITHOUT_BASE_REFERENCE` | **INVALID** for Reasoning Shadows |
| Base preserved? | **YES** |

Base may be: base state · base formula application · base candidate · base event — explicit ref required.

## Assumptions Contract

| Property | Verdict |
| --- | --- |
| Assumptions inspectable? | **REQUIRED** for Counterfactual; **REQUIRED** recommended P0 for all Reasoning Shadows |
| Hidden assumptions | **INVALID / INCOMPLETE** |

## Provenance Contract

Origin classes: HUMAN_PROPOSED · FORMULA_DERIVED · SIMULATION_DERIVED · AI_PROPOSED · RULE_DERIVED · IMPORTED · UNKNOWN  

Origin ≠ truth. AI Shadows retain AI provenance.

## Uncertainty Contract

No universal Shadow probability. Use C360 uncertainty: NOT_ASSESSED · QUALITATIVE · QUANTIFIED (+ domain value only when justified).

## Lifecycle Contract

Candidate lifecycle states (`PROPOSED_SPECIFICATION`): CANDIDATE · ACTIVE_FOR_COMPARISON · REJECTED · RETAINED · SUPERSEDED · ACCEPTED_AS_PROPOSAL · EXPIRED  

Useful ≠ observed. Promotion path:

```text
SHADOW → evidence/test → proposal → governance → human → accepted future state
```

Historical Shadow identity remains preserved.

## Authority Contract

```text
SHADOW ≠ AUTHORITY
SHADOW ≠ PERMISSION
SIMULATE ALLOWED ≠ EXECUTE ALLOWED
SHADOW PATH CANNOT BYPASS BASE AUTHORITY REQUIREMENTS
```

Ceiling: inform · challenge · compare · warn · propose — **never** authorize/deploy/rewrite canon/delete base/override Steward.

## Shadow Difference Contract

P0 explainability candidate — every Reasoning Shadow should answer:

WHAT base? WHAT changed? WHY created? WHO/WHAT created? WHICH assumptions differ? Shared vs unique evidence? Uncertainty? Authority? Outcome?

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

| Layer | Posture |
| --- | --- |
| Micro | Shadow may attach to one observation/state/relationship/formula result |
| Meso | Shadow alternatives for local clusters — parallel to base, not mixed into “truth” |
| Macro | Macro Shadow must be **traceable** to lower-level evidence/assumptions |

**Critical aggregation law for next gate:**

```text
DO NOT aggregate OBSERVED + SHADOW + AI_PROPOSED into a single Macro truth.
Aggregate OBSERVED (and other base classes) separately from SHADOW lanes; then COMPARE.
```

## Formula Shadow

Operator: **`FORMULA_SHADOW_OPERATOR = UNDEFINED`**

```text
FORMULA_SHADOW ≠ MATHEMATICAL_INVERSE
FORMULA_SHADOW ≠ BOOLEAN_NOT
FORMULA_SHADOW ≠ ELSE
```

Meaning of Formula Shadow (parameter/input/interpretation/output/competing formula) remains **UNRESOLVED** pending recovery/Steward.

## GGAESP Relationship

**PROPOSED only:** base + Shadows → adapter/compare → GGAESP, or GGAESP result → Shadow challenge. GGAESP **unchanged**.

## Z Logic Relationship

```text
SHADOW_CONTROL_PRIMITIVE = DEFERRED_PENDING_SHADOW_SPEC
```

Updated after this taxonomy: primitive remains **DEFERRED** until Steward accepts classes + optional CREATE_SHADOW conceptual op. Recommendation:

```text
SHADOW_CONTROL_PRIMITIVE_DEFERRED
```

Explicit CREATE_SHADOW may become justified later; do not amend Z Logic spec in this gate.

## MiniBot / Swarm / QOSMEI / Z-AAI

| Actor | Posture |
| --- | --- |
| MiniBot | May suggest Shadow candidate → AI provenance; not OBSERVED_FACT; not activated |
| Swarm | Multiple candidates; majority ≠ truth; not activated |
| QOSMEI | May fuse observed + formula + Shadow + MiniBot → advisory; fusion ≠ authorization |
| Z-AAI | Generate/compare/explain Shadows; AI Shadow ≠ observation/canon/authorization |

## Adversarial Shadow

Remains `PROPOSED_ARCHITECTURE`. Prefer: **purpose** (`CHALLENGE`/`RISK`) and/or **separate security module** — Steward decide. Not activated.

## Impact Shadow

Remains `PROPOSED_ARCHITECTURE`. Prefer: **separate impact-assessment layer** that may *use* Shadow comparisons — not forced into core reasoning taxonomy by naming alone.

## Combat Shadow

`DOMAIN_SPECIFIC_FUTURE_SPECIALIZATION` — alternate trajectory/energy/stability etc. require physics contracts. No biomechanical superiority claimed.

## Governance / Replica Safety

Replica Fabric lifecycle preserved. Shadow cannot authorize replication/deploy. Unbounded self-replication still forbidden.

## Boundedness

```text
SHADOW_GENERATION_MUST_BE_BOUNDED
Z_INFINITY ≠ UNBOUNDED_SHADOW_BRANCHING
SHADOW_SPACE_COMPLETENESS = UNDEFINED GENERALLY
SHADOW_COUNT ≠ CONFIDENCE
MORE_SHADOWS ≠ MORE_TRUTH
SHADOW_EQUIVALENCE_OPERATOR = UNDEFINED
```

Shadows-of-Shadows: **DEFERRED** — conservative recommendation **DISALLOW by default** until Steward/domain defines depth.

## Explainability Contract

See Difference Contract (P0 candidate). Future Shadow receipt: shadow_id · base_ref · class · purpose · assumptions · origin · provenance · uncertainty · created_at · status · comparison_result · authority_ceiling — **not implemented**.

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
| Reasoning Shadow (core) | Alternate vs base for compare/challenge | Required | SUPPORTED_NEW_SPEC | No | Operational Shadows |
| Counterfactual | Changed assumptions | Required | SUPPORTED_NEW_SPEC | No | Causal proof |
| Alternative-State | Plausible alternate | Required | SUPPORTED_NEW_SPEC | No | Prediction auto |
| AI-Proposed Shadow | AI-origin alternate | AI_PROPOSED | SUPPORTED_NEW_SPEC | No | OBSERVED |
| Risk Shadow | Adverse-oriented alternate | Required | PROPOSED | No | Harm certainty |
| Formula Shadow | Formula alternative | TBD | PROPOSED | No | Inverse/NOT/ELSE |
| Simulation Shadow | Registered sim result | SIMULATION_DERIVED | PROPOSED | No | Raw sim alone |
| OTel/OPA Shadow | Advisory observe/policy | System | RECOVERED_CANON | Advisory | Reasoning Shadow |
| SSWS/HODP/Preview | Workspace/mirror/preview | System | RECOVERED_CANON | Partial | Reasoning Shadow |
| VILE/zuno-shadow | Validation framework | System | RECOVERED_CANON | Framework | Reasoning Shadow |
| Adversarial / Impact | Proposed modules | Proposed | PROPOSED | No | Core taxonomy pending Steward |

## Reasoning Shadow Contract Matrix

| Contract property | Required? | Definition | Status |
| --- | --- | --- | --- |
| shadow_id | REQUIRED | Stable identity | DEFINED |
| base_reference | REQUIRED | Explicit base | DEFINED |
| class | REQUIRED | Taxonomy class | PARTIAL (classes pending Steward seal) |
| purpose | REQUIRED | Controlled purpose | DEFINED (vocab PROPOSED) |
| assumptions | REQUIRED (esp. counterfactual) | Inspectable deltas | DEFINED |
| provenance | REQUIRED | Origin class | DEFINED |
| uncertainty | REQUIRED concept | C360 structures | DEFINED |
| lifecycle | OPTIONAL→future | Status enum | DEFERRED details |
| authority | REQUIRED | Ceiling NONE elevate | DEFINED |
| difference explanation | REQUIRED P0 candidate | Explainability answers | PARTIAL |

Purpose vocab (controlled, not over-expanded): COMPARE · CHALLENGE · COUNTERFACTUAL · RISK · SIMULATION_REVIEW · FORMULA_ALTERNATIVE · AI_ALTERNATIVE · DOMAIN_SPECIFIC

---

## P0 Invariants

| Invariant | Status |
| --- | --- |
| SHADOW ≠ OBSERVED | **YES** (sealed via C360 + this contract) |
| SHADOW ≠ AUTHORITY | **YES** |
| SHADOW DOES NOT MUTATE BASE | **YES** |
| SHADOW RETAINS BASE REFERENCE | **YES** |
| SHADOW RETAINS PROVENANCE | **YES** |
| SHADOW RETAINS ASSUMPTIONS | **YES** (P0 for reasoning) |
| SHADOW ≠ CONTROL_BRANCH | **YES** |
| SHADOW ≠ BOOLEAN_NOT | **YES** |
| SHADOW ≠ MATHEMATICAL_INVERSE | **YES** |
| SHADOW ≠ REPLICA | **YES** (architectural seal) |
| AI SHADOW RETAINS AI PROVENANCE | **YES** |
| MORE SHADOWS ≠ MORE TRUTH | **YES** |
| SHADOW CONSENSUS ≠ STEWARD DECISION | **YES** |
| SHADOW GENERATION MUST BE BOUNDED | **YES** (architecture) |
| SHADOW SPACE COMPLETENESS NOT GENERALLY CLAIMED | **YES** |

## Maturity

```text
SHADOW TAXONOMY / CONTRACT ≈ F2 / PARTIAL F3
NO engine · NO operator · NO score · NO goldens encoded
```

## Golden Readiness

```text
SHADOW_GOLDEN_PARTIAL
```

Enough for later design of Shadow semantic goldens; **not** ready to encode until Steward seals class list + assumptions/depth decisions.

## Missing Mathematics

- Formula Shadow operator
- Shadow distance / equivalence
- Shadow probability / score
- Branching transition math
- Micro→Meso→Macro Shadow aggregation math

## Missing Canon

- Steward seal of which PROPOSED classes become canonical
- Shadows-of-Shadows depth policy
- Retention default vs privacy
- Whether CREATE_SHADOW becomes Z Logic primitive
- Adversarial/Impact placement
- Formula Shadow meaning

## Steward Decisions Required

| Decision | Choices |
| --- | --- |
| Canonical reasoning classes | Confirm Counterfactual + Alternative + AI-Proposed; accept/reject Risk/Formula/Simulation |
| Assumptions mandatory for all Reasoning Shadows? | YES (recommended) / Counterfactual-only |
| Shadows-of-Shadows | DISALLOW default (recommended) / DOMAIN_DEFINED / ALLOW |
| Rejected Shadow audit retention default | YES with privacy supersede (recommended) / domain |
| First-class Z Logic Shadow primitive | Remain DEFERRED (recommended) / charter later |
| Adversarial / Impact | Purpose vs separate modules |

## ONE Recommended Next Gate

```text
Z-MICRO-MESO-MACRO-AGGREGATION-SPEC-1
```

**Why:** Shadow contract now supplies the non-mixing law required before aggregation. Next specify how Micro→Meso→Macro aggregates **base** evidence separately from **Shadow** lanes, then COMPARE — without inventing aggregation mathematics or opening runtime.

Alternate: Steward P0 answers for Shadow classes (if Steward wants taxonomy sealed before aggregation).  
**Not opened here.**

## Terminal

```text
SHADOW_TAXONOMY_AND_CONTRACT_SPEC_1 = SEALED_DOCS
SHADOW_ENGINE = NONE
FORMULA_SHADOW_OPERATOR = UNDEFINED
C360_F4 = PRESERVED
PRODUCTION_AUTHORITY = NONE
```
