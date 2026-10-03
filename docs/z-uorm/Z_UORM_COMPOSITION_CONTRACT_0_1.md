# Z-UORM 0.1 — Composition Contract

**System ID:** Z-UORM-0.1  
**Title:** Z-Universal Operational Readiness Mesh  
**Owner:** Z-Sanctuary Universe  
**Status:** DOCUMENTATION ONLY · LOCAL DRAFT · NOT SEALED TO MAIN · NOT PUBLISHED  
**Date:** 2026-10-03  
**Authority:** AMK-Goku / Steward  
**Class:** thin composition standard / contract family  
**Base:** `origin/main` `7bc5ad60d78e1eb578e1b92c005eab5634a986ea`  
**Predecessors:** Z-SANCTUARY-UNIVERSAL-OPERATIONAL-READINESS-RECONCILIATION-0 · Z-UORM-0.1-CANONICAL-DOCTRINE-MERGE-DESIGN-1  

**Implementation:** NONE · **Runtime:** NONE · **Database:** NONE · **Dashboard:** NONE · **Dispatcher:** NONE  

Z-UORM is an organism-wide **standard**. It is **not** an organ. It is **not** owned by ZWheel. ZWheel is **reference evidence only**.

Canonical home of this contract:

`docs/z-uorm/Z_UORM_COMPOSITION_CONTRACT_0_1.md`  
inside `Z_Sanctuary_Universe`.

A ZWheel copy, if present, is **incubation provenance** only.

```text
Z-UORM = THIN_COMPOSITION_STANDARD
Z-UORM != CORE_ENGINE
Z-UORM != OVERSEER
Z-UORM != SUPER_OVERSEER
Z-UORM != MINIBOT
Z-UORM != SCHEDULER
Z-UORM != DISPATCHER
Z-UORM != DATABASE
Z-UORM != RUNTIME
Z-UORM != PROJECT_REGISTRY
Z-UORM != HEALTH_ENGINE
Z-UORM != DASHBOARD
```

No daemon, process, registry row, schema, evidence store, or second dashboard is authorized by 0.1.

---

## 1. Purpose

Z-UORM is the organism-wide vocabulary for answering, **per project and per capability**, by **pointing at** existing evidence and owners:

| Question | Capsule field |
| --- | --- |
| What project / capability is this? | `PROJECT_ID` · `CAPABILITY_ID` |
| What canonical identity is current? | `CANONICAL_ROOT` · `CANONICAL_SHA` |
| What environments apply? | `APPLICABLE_ENVIRONMENT_PROFILES` |
| What has been proven? | per-capability proof + `EVIDENCE_REFERENCE` |
| At what evidence class / U-level? | §6 · §7 |
| How fresh is that evidence? | `EVIDENCE_FRESHNESS` |
| What remains blocked / deferred? | `BLOCKER_STATE` |
| What physical / real-integration proof remains? | `PHYSICAL_ACCEPTANCE_STATE` |
| What recovery / security / deployment proof exists? | scoped proof-state fields |
| What human authority is still required? | `AUTHORITY_REQUIRED` |

One overall GREEN cannot answer all of these.

Z-UORM does **not** own project identity, calculate health, authorize deployment or production, create incidents, or create execution queues.

---

## 2. Doctrine

```text
COMPOSE BEFORE INVENTING.
```

| Question | Existing owner | Z-UORM may |
| --- | --- | --- |
| What is this project or capability? | PID / existing registries | Cite identity. Not mint a second ID |
| What has been proven? | This standard + cited receipts | Name proof class and the receipt |
| What is happening now? | Existing health / Traffic / sentinel / dashboard claims | Not create an incident |
| What may need attention next? | Cycle Observe · Z-MAOS | Not own a second queue |
| What advancement rules apply? | 14 DRP · Execution Enforcer | Not waive `manual_release` |
| What is advisory deploy posture? | Deployment Readiness Overseer | Not treat a percent as certification |
| What may be shown? | AMK / Mission Control / Morning Cockpit | Supply fields only |
| What is authorized? | AMK-Goku / human steward | Not grant that authority |

---

## 3. Composition model

Layers are **roles**. A box is not a new file, service, or directory.

```text
REGISTRY / IDENTITY
        ↓
READINESS CAPSULE          ← logical shape only
        ↓
EVIDENCE + FRESHNESS
        ↓
EXISTING HEALTH REPORTING  ← sibling, not child
        ↓
ORCHESTRATION CONSUMERS    ← Cycle Observe / Z-MAOS / advisory only
        ↓
MISSION CONTROL / AMK STEWARD
```

Arrows are **narrative / relational**. They are **not** a mandatory runtime pipeline and **not** a required sequence.

Deployment Readiness and Execution Enforcer sit **beside** Steward authority. Health reporting sits **beside** readiness.

---

## 4. Project Readiness Capsule

**LOGICAL_VIEW / CONTRACT_SHAPE ONLY.**  
Not a persistent store, identity authority, scorer, health engine, scheduler, or database. No schema or writer is authorized in 0.1.

### 4.1 Project header

| Field | Meaning |
| --- | --- |
| `PROJECT_ID` | Stable organism id when registered; else explicit `UNREGISTERED` + local name |
| `PROJECT_NAME` | Human label (not identity) |
| `CANONICAL_ROOT` | Declared filesystem root |
| `CANONICAL_SHA` | Declared commit / version when a git tree exists |
| `LIFECYCLE_STATE` | Project lifecycle (not a U-level) |
| `APPLICABLE_ENVIRONMENT_PROFILES` | One or more declared profiles from §5 |
| `CAPABILITIES[]` | Capability rows |

`FOLDER NAME ≠ PROJECT IDENTITY`. Unregistered ≠ nonexistent.

There is **no** project-wide U-level field.

### 4.2 Capability row

| Field | Meaning |
| --- | --- |
| `CAPABILITY_ID` | Stable id **within** the project |
| `CAPABILITY_NAME` | Human label |
| `CURRENT_PROOF_LEVEL` | Optional **per-capability** highest-proof **summary** only |
| `EXPECTED_PROOF_LEVEL` | Target U-level for the declared profile |
| `EVIDENCE_REFERENCE` | Path or receipt id of **existing** evidence |
| `EVIDENCE_SHA` | SHA of that receipt or of the tree it certifies, when known |
| `EVIDENCE_FRESHNESS` | `CURRENT` · `RETAINED_VALID` · `STALE` · `DATE_UNKNOWN` |
| `HEALTH_STATE` | From existing health reporting only; may be `NOT_APPLICABLE` |
| `BLOCKER_STATE` | `NONE` · `BLOCKED` · `DEFERRED` · `HOLD` |
| `KNOWN_DEBT` | Severity-tagged debt that did **not** fail the proof |
| `PHYSICAL_ACCEPTANCE_STATE` | `NOT_APPLICABLE` · `DEFERRED` · `HOLD` · `PROVEN` · `MISSING` |
| `RECOVERY_PROOF_STATE` | Scoped (UI restore ≠ disaster recovery) |
| `SECURITY_PROOF_STATE` | Cite existing sentinel / policy evidence |
| `DEPLOYMENT_READINESS_STATE` | Cite Deployment Readiness / doorway / product gates |
| `AUTHORITY_REQUIRED` | What a human must still decide |

`CURRENT_PROOF_LEVEL` is **per-capability only**.  
`PROJECT = Un` is invalid. Averaging, scoring, and synthetic roll-up are forbidden in 0.1.

A capability may hold a **dimensional proof set**. Independent fields remain authoritative when a single U-level would hide BLOCKED, DEFERRED, or debt.

---

## 5. Environment profiles

**Declared first.** 0.1 does not create an inheritance tree.

| Profile | Typical meaning |
| --- | --- |
| `UNIVERSAL_BASE` | Identity, docs, custody, authority boundary |
| `WEB_PWA` | Browser / PWA workstation |
| `MOBILE` | Narrow / mobile layout and interaction |
| `DESKTOP` | Wide / desktop workstation |
| `AI_SERVICE` | Model / assistance path |
| `BACKEND_API` | Server / hub / API runtime |
| `LOCAL_AI` | Localhost or on-device AI without implied cloud authority |
| `HARDWARE_PHYSICAL` | Real device or physical acceptance |
| `DATA_PIPELINE` | Ingest, transform, fixture, export (declared name only) |

A project may declare multiple profiles. Bounded inference, if used, must be marked `INFERRED` and drawn only from a sealed registry field.

Do **not** infer:

- responsive CSS → `MOBILE`
- a browser test → physical device
- a synthetic / AnyDevice scenario → U5
- local runtime → deployment ready
- successful execution → a security pass

---

## 6. Proof levels

U-levels are **evidence-classification aliases**. They are **not** a mandatory climb and **not** a replacement for AMK colors, Deployment % bands, doorway colors, Strategist stages, or Z-OTF states.

```text
U_LEVEL != HEALTH
U_LEVEL != SEVERITY
U_LEVEL != PROJECT_LIFECYCLE
U_LEVEL != READINESS_PERCENT
U_LEVEL != SIGNAL_COLOR
U_LEVEL != DEPLOYMENT_AUTHORITY
U_LEVEL != STEWARD_APPROVAL
```

| Level | Name | Honest meaning |
| --- | --- | --- |
| U0 | UNKNOWN | No classified evidence |
| U1 | STRUCTURAL | Source / architecture / classifier / declaration |
| U2 | STATIC_VERIFIED | Automated verify / lint / schema / contract test |
| U3 | SIMULATED_OR_EMULATED | Emulation, synthetic device, fixture lab |
| U4 | LIVE_ENVIRONMENT | Live local or declared live software environment |
| U5 | REAL_DEVICE_OR_REAL_INTEGRATION | Physical device or genuine external integration |
| U6 | FAILURE_AND_RECOVERY_PROVEN | Named failure + restore proven **in scope** |
| U7 | DEPLOYMENT_READY | Evidence complete enough to be **considered at** an **existing** deployment/release gate |
| U8 | PRODUCTION_OBSERVED | **Authorized** production observation after a Steward/AMK-authorized ship |

**U7** does **not** authorize deploy, open a gate, or allow production.  
**U8** is not “running somewhere” and not a production-like environment. A U7 label alone is not U8.

Support a **dimensional proof set**. Optionally record a **highest-proof summary** per capability.  
No project-wide aggregation. No averaging. No scoring. No synthetic roll-up.

`GREEN != deploy`. `HOLD != incident`. `SIMULATED != physical`. `LIVE != production ready`.

---

## 7. Evidence classes

Z-UORM **cites** evidence. It does **not** copy canonical evidence into a UORM store.

| Class | Meaning |
| --- | --- |
| `CURRENT` | Matches declared identity and is in-date |
| `RETAINED_VALID` | Prior evidence still stands; newer equivalent not rerun |
| `STALE` | Identity may match; age or serving-target no longer trusted |
| `BLOCKED` | Required probe could not run |
| `MISSING` | Expected evidence not found |
| `NOT_APPLICABLE` | Profile or capability does not require this proof |
| `NON_VERDICT_ARTIFACT` | Process/tool failure with **no** product verdict |
| `NON_CANONICAL` | Dirty, unsealed, or untrusted input (PID trusted-input law) |

Examples:

- Hung / killed test (`4294967295`) → `NON_VERDICT_ARTIFACT` · not `FAIL`
- Browser engine not installed → `BLOCKED` · not `FAIL`
- Physical-device acceptance deferred → `BLOCKED` / `DEFERRED` · not `INCIDENT`

`FAIL` is a product or proof outcome, not the default for “we could not run it.”

---

## 8. Health / readiness separation

**HEALTH** answers: is the **active** system healthy **now**?  
**READINESS** answers: what has been **proven**, and what may **advance next**?

Use **existing health reporting** (hub health/alert bots, sentinel, Traffic, dashboard claims).  
Do **not** invent `health-mesh/`.

Health may **consume** readiness as context. Readiness does **not** create incidents.

### Readiness-gap law

```text
EXPECTED_PROOF: U5
CURRENT_PROOF: U3
BLOCKER: physical device unavailable
→ READINESS_GAP / HOLD
```

That state is **not** `INCIDENT`, `DEGRADED_HEALTH`, or `FAILURE`.

Also not incidents by themselves: `STALE_EVIDENCE`, `DEPLOYMENT_HOLD`, `KNOWN_LOW_UI_DEBT`, `BLOCKED_NOT_INSTALLED`, `NON_VERDICT_ARTIFACT`.

---

## 9. Authority

Z-UORM **may**: OBSERVE · CLASSIFY · REFERENCE EVIDENCE · REPORT FRESHNESS · REPORT BLOCKERS · REPORT REQUIRED PROOF · PROPOSE ELIGIBLE NEXT ACTION.

Z-UORM **may not** autonomously: MERGE · DEPLOY · CHANGE PROJECT PHASE · ALTER GOVERNANCE · CREATE CREDENTIALS · CHANGE PRODUCTION AUTHORITY · DISPATCH UNBOUNDED WORK.

```text
Z_UORM_EXECUTION_AUTHORITY: NONE
Z_UORM_DEPLOYMENT_AUTHORITY: NONE
Z_UORM_GOVERNANCE_AUTHORITY: NONE
```

This document does not execute, score, deploy, or authorize.

---

## 10. Orchestration relationship

**Z-MCO** is a **conceptual consumer only**. 0.1 does not create a Z-MCO file, folder, service, registry, or dispatcher.

Cycle Observe and Z-MAOS may consume readiness for **planning**.  
No second queue. No second dispatcher. Z-UORM does not schedule.

Supplied fields: `CURRENT_PROOF` · `EXPECTED_PROOF` · `EVIDENCE_FRESHNESS` · `BLOCKER_REASON` · `ELIGIBLE_NEXT_ACTION` · `AUTHORITY_REQUIRED`.

---

## 11. Display / Mission Control relationship

Existing AMK / Mission Control / Morning Cockpit surfaces own **display interpretation**, freshness-of-claim, and whether a health claim may be shown.

UORM may **supply** fields: `PROJECT` · `CAPABILITY` · `CURRENT_PROOF` · `EXPECTED_PROOF` · `HEALTH` · `FRESHNESS` · `BLOCKER` · `AUTHORITY_STATE`.

UORM does **not** create a truth adapter, a new dashboard, a new Morning Cockpit, or a new freshness authority.

Indicator ≠ permission. Percentage ≠ certification. Confirmation does not execute work.

---

## 12. Anti-duplication rules

If a capability already exists: **REFERENCE / COMPOSE IT.**

| Forbidden | Reuse |
| --- | --- |
| `SECOND_PROJECT_REGISTRY` | EAII · PC-root · Universe · PID |
| `SECOND_HEALTH_ENGINE` | Existing hub health / alert / sentinel reports |
| `SECOND_SUPER_OVERSEER` | Existing Overseer / Hierarchy Chief doctrine |
| `SECOND_MISSION_CONTROL` | AMK Main Control · existing MC / Cockpit lane |
| `SECOND_SCHEDULER` | Cycle Observe (observe-only) |
| `SECOND_DISPATCHER` | None — humans / existing gates |
| `SECOND_DEPLOYMENT_AUTHORITY` | Deployment Readiness · Execution Enforcer · Steward |
| `SECOND_EVIDENCE_DATABASE` | Existing receipts, reports, proof-mesh files |
| `SECOND_READINESS_PERCENT` | Deployment Readiness Overseer (cap 95) |
| `PROJECT_WIDE_U_LEVEL` | Capability rows only |

---

## 13. Standing owners

Cite only. Do not replace. Paths listed exist on this `main` snapshot; owners without a path on this tip are named only.

| Owner | Citation on this tip |
| --- | --- |
| Deployment Readiness | [docs/Z_DEPLOYMENT_READINESS_OVERSEER.md](../Z_DEPLOYMENT_READINESS_OVERSEER.md) |
| Cycle Observe | [docs/Z_CYCLE_OBSERVE_SYSTEM.md](../Z_CYCLE_OBSERVE_SYSTEM.md) |
| Z-Traffic | [docs/Z_TRAFFIC_MINIBOTS.md](../Z_TRAFFIC_MINIBOTS.md) |
| Z-MAOS | [docs/z-maos/Z_MAOS_CHARTER.md](../z-maos/Z_MAOS_CHARTER.md) |
| 14 DRP | [docs/Z_SWARM_14DRP_UNIVERSAL_AGENT_LAW.md](../Z_SWARM_14DRP_UNIVERSAL_AGENT_LAW.md) |
| AnyDevice | [docs/Z_ANYDEVICE_AI_CAPSULE.md](../Z_ANYDEVICE_AI_CAPSULE.md) |
| AMK indicators | [docs/AMK_PROJECT_INDICATORS_AND_GO_NO_GO.md](../AMK_PROJECT_INDICATORS_AND_GO_NO_GO.md) |
| AMK Main Control | `dashboard/Html/amk-goku-main-control.html` |
| Execution Enforcer | `scripts/z_execution_enforcer_gate.mjs` |
| PID | Named standing owner (contract path not on this `main` snapshot) |
| PID trusted-input map | Named standing owner (path not on this `main` snapshot) |
| Strategist layer types | Named standing owner (path not on this `main` snapshot) |
| Existing health / sentinel | Hub `bots/health/`, `bots/alerts/`, `scripts/z_security_sentinel.mjs` |

---

## 14. Phase boundary

0.1 authorizes **this document** and later Steward review / seal.

0.1 does **not** authorize: runtime, schema implementation, dashboard implementation, automatic project scanning, background workers, cross-project test execution, health-alert generation, Z-MCO scheduling, or deployment.

```text
RUNTIME_OPENED: NO
```

---

## 15. ZWheel reference mapping

**Illustrative · non-authoritative.** Does not rewrite ZWheel receipts.  
`ZWheel != Z-UORM owner`. Do not store the **canonical** standard under ZWheel.

Identity at mapping time: `C:\Z-Wheel Cracker` · `df7450adeb45b752c2fb0da6454ceed7a4de5db7`.  
ZWheel is **not** a first-class EAII / PC-root row. `UNREGISTERED` ≠ missing product.

| Field | Illustrative value |
| --- | --- |
| `PROJECT_ID` | `UNREGISTERED:zwheel-cracker` |
| Profiles | `UNIVERSAL_BASE` · `WEB_PWA` · `MOBILE` · `DESKTOP` · `LOCAL_AI` · `HARDWARE_PHYSICAL` |

**Capability:** Responsive UI

| Axis | Mapping |
| --- | --- |
| Structural audit | U1 |
| Static / e2e verify | U2 |
| Chromium live matrix | U4 · `CURRENT` at serving-target match |
| Firefox | `BLOCKED` (`BLOCKED_NOT_INSTALLED`) · not FAIL |
| WebKit | `BLOCKED` (`BLOCKED_NOT_INSTALLED`) · not FAIL |
| Touch emulation | U3 supplemental · not physical |
| Samsung S21 / PD14 | awaiting U5 · `DEFERRED` / `HOLD` · not incident |
| 844×390 Orb / Live-switch occlusion | `KNOWN_DEBT` LOW |
| ZW-FC-LIVE-1 @ 200% | `KNOWN_DEBT` LOW · `RETAINED_VALID` |
| Hung matrix PIDs | `NON_VERDICT_ARTIFACT` |
| Deployment | `CLOSED` / closed-with-notes · **not** U7/U8 authority |

Does **not** claim: all devices tested, full cross-browser pass, physical acceptance pass, or production readiness.

---

## 16. Cross-project example

**NON-NORMATIVE.** No invented evidence.

For a declared `WEB_PWA` + `AI_SERVICE` project:

- first-class registry membership only if present in EAII / PC-root
- docs / `verify:md` → U1 / maybe U2 when that verifier actually ran
- live serve → U4 only if a live environment was exercised and cited
- URL or PaaS preview → deploy **posture**, not U7 by itself
- `HARDWARE_PHYSICAL` → `NOT_APPLICABLE` unless declared
- missing live-matrix evidence stays `MISSING` or `BLOCKED`, not inferred from ZWheel

---

## 17. Integration

| Consumer | May read |
| --- | --- |
| Cycle Observe | `ELIGIBLE_NEXT_ACTION` · `BLOCKER_REASON` · `AUTHORITY_REQUIRED` |
| Z-MAOS | Same planning fields; no second queue |
| Existing health reports | Debt / stale / blocked-proof as **non-incident** classes |
| Deployment Readiness Overseer | Capsule deploy/proof fields as overlay inputs |
| AMK / Mission Control / Morning Cockpit | Display fields in §11; interpretation stays in that lane |
| Execution Enforcer | Nothing automatic from UORM |
| 14 DRP | Agent-law classification of any future **human** UORM task |

---

## 18. Close

This slice is a **local canonical draft** on a fresh branch from current hub `main`. It is **not** merged, pushed, or published by this gate.

```text
RUNTIME_OPENED: NO
NEW_ENGINE: NO
NEW_DATABASE: NO
NEW_DASHBOARD: NO
NEW_QUEUE: NO
NEW_DISPATCHER: NO
NEW_HEALTH_MESH: NO
NEW_Z_MCO_ARTIFACT: NO
Z_UORM_EXECUTION_AUTHORITY: NONE
Z_UORM_DEPLOYMENT_AUTHORITY: NONE
Z_UORM_GOVERNANCE_AUTHORITY: NONE
```
