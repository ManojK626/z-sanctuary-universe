# Z-CRYSTAL-DNA-GOVERNED-AUTONOMOUS-RECOVERY-EXCEPTION-CHARTER-1

**Status:** Governance / architecture charter · **no runtime** · **no executor** · **no DNA adapter implementation**
**Date:** 2026-08-24
**Baseline HEAD:** `4b3634c`
**Branch:** `cursor/zsanctuary/z-sdc-phase-0-architecture`

Envelope name: **GARE** — Governed Autonomous Recovery Envelope  
(No prior `GARE` identity found in hub search; this is the first canonical use.)

## Baseline

| Field | Value |
| ----- | ----- |
| START HEAD | `4b3634c` |
| DNA read-adapter spec | `docs/Z_COMPOSED_AWARENESS_CRYSTAL_DNA_READ_ADAPTER_SPEC_1.md` |
| That spec's meaning | **CURRENT PRE-EXCEPTION BASELINE** (historically correct) |
| This charter | **GOVERNED EXCEPTION OVERLAY** — does not declare `4b3634c` wrong |
| Runtime / executor | NOT IMPLEMENTED |

## Steward Decision

Steward authorizes **architectural specification** of a bounded exception: some repairs may eventually execute **without an event-time human approval click**, only when already permitted by policy, deterministic, bounded, reversible, independently checked, fully receipted, and unable to expand their own authority.

This gate does **not** implement that exception.

## Prior Canon

Crystal DNA (`docs/Z_CRYSTAL_DNA_MESH.md`, seal path through `4b3634c`):

```text
detect → compare → report → propose restore → human approval
automatic_repair = forbidden
```

That remains the **safe default** and the **historical baseline**.

## Reason for Evolution

Event-time approval for **every** restore blocked unattended recovery of **already-declared**, **pre-authorized**, **reversible** classes (for example regenerating a derived report, or restoring a manifest-approved file from a verified known-good copy). The evolution is **narrower than the default**, not a repeal of DNA-1.

## Default Human-Gated Rule

**DEFAULT:** HUMAN-GATED restore / mutation.

**EXCEPTION:** PRE-AUTHORIZED GOVERNED AUTONOMOUS RECOVERY inside **GARE**.

```text
NO HUMAN AT EVENT TIME ≠ NO HUMAN GOVERNANCE
AUTONOMOUS REPAIR ≠ AUTONOMOUS AUTHORITY
REPAIR CAPABILITY ≠ POLICY-MODIFICATION CAPABILITY
SELF-RECOVERY ≠ SELF-GOVERNANCE
```

## Governed Autonomous Exception

Unattended APPLY is eligible **only** if a **PRE-AUTHORIZED REPAIR RECIPE** exists and every GARE gate passes. No free-form “fix whatever seems wrong.”

## Self-Awareness Definition

**SELF-AWARENESS** here means **system-state awareness**: observability, dependency, drift, history, integrity, capacity.

It does **not** claim consciousness or sentience.

## Repairs Everything Doctrine

```text
REPAIRS EVERYTHING
= every declared asset may participate in diagnosis and recovery planning,
  and every repairable class may have a governed pathway.

UNIVERSAL RECOVERY AWARENESS ≠ UNIVERSAL MUTATION AUTHORITY
REPAIRS EVERYTHING ≠ MUTATES EVERYTHING
```

## Governed Autonomous Recovery Envelope

**GARE** is the eligibility box: class + recipe + twins + formulas + Overseer + Hierarchy Chief + rollback + verify + receipt + local/bounded scope.

Outside GARE → **HOLD** (recovery-domain HOLD; **not** automatically Z Logic HOLD) + human.

## Repair Classes

| Class | Name | Mutation | Event-time human |
| ----- | ---- | -------- | ---------------- |
| **AR-0** | OBSERVE | NONE (detect, compare, verify, report, propose) | NO |
| **AR-1** | REBUILD DERIVED | Derived/disposable only; sources unchanged | NO (if recipe exists; default deny if metadata absent) |
| **AR-2** | VERIFIED EXACT RESTORE | Manifest-approved target from verified known-good source | NOT REQUIRED **if** all GARE conditions pass |
| **AR-3** | CONTROLLED RUNTIME RECOVERY | Bounded local restart / exact approved bytes | Default **HOLD**; autonomous only if recipe **explicitly** says eligible |
| **AR-4** | STEWARD REQUIRED | Governance, identity, secrets, money, deploy, etc. | YES |

## Pre-Authorized Repair Recipes

A recipe must identify: `repair_recipe_id` · eligible asset type · target scope · expected source · recovery source · preconditions · verification · rollback · blast-radius · prohibited side effects · authority ceiling · maximum attempts · failure posture.

Absent `autonomous_eligible` (future metadata) → **AUTONOMOUS ELIGIBLE = NO** (default deny). **Do not edit the current DNA manifest in this gate.**

## Best Eligible Repair

Not an open “do what is best.”

**BEST ELIGIBLE REPAIR** = governance-compliant AND evidence-supported AND inside envelope AND minimum sufficient mutation AND declared blast radius minimized AND reversible AND verifiable.

Equal validity or material disagreement → **NO WINNER → HOLD**. No numerical “best” score. No new mathematics.

## Twin Roots

Canonical identities (`docs/Z-TWIN-ROOTS-ARCHITECTURE.md`):

| Root | Canonical name | GARE conceptual role |
| ---- | -------------- | -------------------- |
| Proposer / reconstructor | **Mango Tree Core** (memory, receipts, identity, activity refs) | Reconstruction / candidate from evidence |
| Challenger / verifier | **Tarzan Tree Core** (pathways, touch-zones, blocked/risk paths) | Challenge / contradiction / route legality |

Phase 1 Twin Roots remains **mock / `advisory_only_no_auto_execution`**. This charter **does not** promote the mock to a live repair oracle. Future GARE must use two **independent** roles with those jobs; disagreement is preserved.

**Material Twin disagreement → no autonomous repair → HOLD.**

Z-Fusion Grove remains a collaboration contract, **not** a third authorizer.

## Z-Formula Role

Classification, eligibility, comparison, risk interpretation, boundary checks. **FORMULA RESULT ≠ REPAIR AUTHORIZATION.** F5A remains unwired to GARE in this charter.

## Overseer Role

Z-Super Overseer (Hierarchy Chief doc: operational roof — Z-EAII + auto-run + Z-SSWS): **policy / safety / risk boundary**. **Overseer PASS alone does not authorize mutation.**

## Hierarchy Chief Role

`docs/Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md`: **scope ceiling, authority envelope, governance precedence**. Autonomous repair **must not** modify Hierarchy Chief rules in the same action.

## Repair Plan

Conceptual (not executable): `plan_id`, `recipe_id`, target, observed problem, evidence, expected state, recovery source, operations, preconditions, verification, rollback, blast radius, repair class, authority envelope.

## Two-Phase Repair

**PHASE A** PREPARE / VERIFY (identity, backup, source, policy, authority, eligibility).  
**PHASE B** APPLY — only after A.

## Canary

Where meaningful: APPLY → canary verify → ACCEPT. Canary fail → **ROLLBACK**. No continued experimentation on a damaged target.

## Rollback

AR-2 / AR-3 require an explicit rollback story. If rollback cannot be established → **not autonomously eligible**, unless the asset is fully disposable/derived (AR-1).

**REPAIR ≠ ERASE HISTORY.** Preserve pre-state for rollback and evidence.

## Maximum Attempts

Bounded attempts per recipe. **`Z_INFINITY` ≠ unbounded retry** (existing control doctrine). No infinite self-repair loop. On repeated failure: HOLD + escalate.

## Provenance

Record: what/why, proposer, evidence, Twin challenge, formula outcomes, Overseer, Hierarchy Chief, class, recipe, pre/post state, verification, rollback, authority, **policy version**.

## Receipts

Every autonomous repair must emit immutable/read-only evidence. **NO RECEIPT → NO TRUSTED AUTONOMOUS REPAIR CLAIM.**

## Crystal DNA Role

Identity, dependency, expected location, recovery hints, drift/integrity, future repairability metadata.

**CRYSTAL DNA ≠ REPAIR EXECUTOR.** Read adapter (`4b3634c`) stays read-only.

## Executor Separation

Future executor is a **distinct** bounded capability. It must not own policy, authority, goldens, identity canon, or governance.

## Repairability Metadata

Future (not applied now): `repair_class`, `autonomous_eligible`, `repair_recipe_id`, `rollback_required`, `verification_required`.

## Default Deny

Missing metadata → not autonomously eligible.

## Secrets Boundary

No unattended secret / credential / vault-key recovery or mutation. Existing vault governance stands.

## Governance Boundary

Constitutional / repair-policy / Hierarchy Chief / Overseer authority files default **AR-4**. Restoring governance can alter authority.

## Goldens Boundary

Goldens may be **verified** automatically. They must **not** be rewritten to make implementation pass.

```text
IMPLEMENTATION MUST CONFORM TO GOLDEN
GOLDEN MUST NOT CONFORM TO BROKEN IMPLEMENTATION
```

## Identity / Sovereignty Boundary

Unattended repair must not merge identities, change SAME_PROJECT / SEPARATE_PROJECT, sovereignty, or ownership. **AR-4.**

## Git Boundary

Unattended **forbidden**: force push, history rewrite, `git clean`, `git reset --hard`, branch/tag deletion. Exact-file restore via git only if a **separate** pre-authorized recipe exists later.

## Dependency Boundary

No unattended package install. New dependencies = Steward.

## Network Boundary

No arbitrary Internet retrieval as recovery source. Declared trusted sources only. Network repair = future separate charter.

## Production Boundary

This charter **does not** authorize production repair or deploy. Initial GARE scope: **LOCAL / GOVERNED / BOUNDED**.

## Business Boundary

No autonomous email/legal/payment/investor/manufacturer/supplier commitments.

## Capacity Boundary

High-demand / scaling remains separate. Capacity events may notify; they must **not** expand repair authority.

## Fail-Safe Rules

UNKNOWN / MISSING / CONFLICTING / UNVERIFIED evidence → autonomous mutation **NO**, unless the recipe defines that exact state.

## Degraded Governance

If Overseer, Hierarchy Chief, Twin verification, required formula check, receipt mechanism, or rollback is unavailable → **no** AR-2/AR-3 autonomous APPLY. HOLD.

## Repairing Repair Infrastructure

Executor must not autonomously repair its own policy, gates, or class definitions. **AR-4.** Disaster bootstrap = later separate charter.

## Self-Development Boundary

```text
RESTORE EXPECTED STATE  (AR-1/2/3 possible)
≠
CREATE NEW BETTER STATE  (governed development; not silent self-rewrite)
```

Autonomous repair **must not** rewrite objectives, expand authority, change constitutional law, invent permissions, change eligibility, promote experimental code, or rewrite goldens.

## Exceptional Circumstance Definition

A detected condition **already covered** by a pre-authorized recipe, where continued failure would materially degrade the declared ecosystem, and bounded autonomous recovery is **safer than waiting**. **Urgency does not bypass eligibility.**

## Event-Time Human Approval

- AR-0 / eligible AR-1: not required.
- Eligible AR-2: not required **if** GARE fully passes.
- AR-3: default HOLD; waive only if recipe explicitly autonomous-eligible.
- AR-4: required.
- **EVENT-TIME HUMAN APPROVAL REQUIRED FOR ALL REPAIRS: NO** (the point of this overlay).

## Human Visibility

Distinguish **APPROVAL** vs **VISIBILITY**. AR-2/AR-3: event-time approval NO; **receipt / Steward visibility YES**.

## Emergency Stop

Future runtime must provide Steward **AUTONOMOUS REPAIR OFF**. Not implemented here.

## Policy Versioning

Receipts name the **immutable policy snapshot** that authorized the action. No mid-repair policy mutation. Autonomous repair **cannot modify the policy that authorized it** and **cannot expand its own class**.

## Future Golden Requirements

Eligible AR-1/AR-2 execute; ineligible HOLD; Twin disagreement HOLD; missing rollback/verify/conflict/unknown authority block; governance/secret/sovereignty = Steward; golden rewrite prohibited; fail → rollback; fail rollback → escalate; receipt produced; policy cannot self-modify.

## Future TEVV Requirements

Attack: authority escalation, recipe/source spoof, hash mismatch, rollback/partial write, double execution, stale policy, Twin false consensus, status-namespace collision, re-entry, infinite loop, omitted receipt. TEVV before widening class.

## Non-Goals

No executor · no DNA adapter in this gate · no manifest field adds · no production · no consciousness claim · no GARE as a new AI identity · no F5A mix-in · no dashboard.

## Maturity

**GOVERNED AUTONOMOUS RECOVERY EXCEPTION CHARTER: READY**

Runtime: **NOT IMPLEMENTED**. Authority: **BOUNDED REPAIR ENVELOPE ONLY** (specified, not granted as live power). Production: **NONE**.

## ONE Recommended Next Gate

**Z-SANCTUARY-COMPOSED-AWARENESS-CRYSTAL-DNA-READ-ADAPTER-P0-IMPLEMENTATION-1**

Keep DNA **read-only** (still conforms to `4b3634c` + this overlay: DNA ≠ executor). GARE executor remains a **later** gated engine after the read projection exists.
