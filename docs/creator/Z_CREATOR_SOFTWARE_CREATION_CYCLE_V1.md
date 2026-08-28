# Native software-creation cycle (v1)

**Artefact of:** `req-z-creator-p2a-001` / `plan-z-creator-p2a-001`  
**Charter:** `Z-CREATOR-P2A-FIRST-CREATION-CHARTER`  
**Domain:** documentation/specification only  
**Status:** local, human-chartered, merge **pending**

This page is the **one** bounded output of the first governed Creator cycle. It is not a product manual and not a factory specification.

---

## Cycle

```text
Human Intent
  → Creation Intake Binding
  → ZunoRequest
  → ZunoTaskPlan
  → Turtle scope
  → bounded artefact
  → aafrtc:ci
  → receipt
  → human decision
```

Intake adapter: `scripts/z_creator_intake_bind.mjs`  
Intake instance: `data/reconciliation/z_creator_p2a_first_creation_intake.json`

The adapter **binds and rejects**. It does **not** execute the task plan.

---

## What the cycle does

Represents one Steward-approved software-creation request with **existing** Zuno field shapes, limits it to one domain and one artefact, checks that verify command is `npm run aafrtc:ci`, and leaves merge to a human.

---

## What it does not do

Autonomous generation; general app/site generation; production or commercial proof; providers; Atoms; Cloudflare; R2; deploy; full-core; executing generated code; mutating child projects.

---

## Human gates

Charter required. Request ID and plan ID required. At least one plan step `requiresHumanApproval: true`. `authority.human_approval_required` must be true. GitHub merge remains AMK-only.

---

## Safety boundaries

`_non_executable: true` on intake, request, and plan. Runtime and deployment authority must be `NONE`. Paths must stay on the P2A allow-list. `docs/INDEX.md` and `package.json` are always forbidden.

---

## Evidence boundaries

This cycle proves **intake binding + one docs artefact + `aafrtc:ci`**. It does not prove full-core, resolve, Foundry, or a second Creator verify command.

---

## Failure behavior

Invalid intake is **rejected with visible errors**. Missing charter, missing IDs, unsupported domain, runtime/deploy authority, or forbidden paths are **not** coerced into a valid bind.

---

## STOP behavior

After one bound intake, one artefact, one `aafrtc:ci` result, and one receipt: **stop**. Do not open P2B. Do not expand to scripts-as-product or apps.
