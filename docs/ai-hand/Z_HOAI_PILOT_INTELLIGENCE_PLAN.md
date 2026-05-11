# Z-HOAI — Hand-On AI Pilot Intelligence Layer (Hub Doctrine)

**Purpose:** A **lightweight, internal doctrine** for pilot-era triage: collect signals, classify them, draft tracker-ready findings, suggest minimal patches, and **escalate to the human chief** when risk is real. This document lives in **ZSanctuary_Universe** so any pilot project (including apps that are **not** opened in this workspace) can reuse the same structure without importing XL2 or other sibling code into the hub.

**Authority and fit:** When unsure about where decisions live, read [Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md](../Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md). Operational roof: Z-Super Overseer (Z-EAII + auto-run + Z-SSWS). Z-HOAI is **not** a new roof; it is a **disciplined helper pattern** for pilots.

**Communications alignment:** Full completions and comms-flow discipline remain the source of truth: [Z-COMPLETIONS-TEST-AND-COMMUNICATIONS-FLOW.md](../Z-COMPLETIONS-TEST-AND-COMMUNICATIONS-FLOW.md), [Z-SANCTUARY-VERIFICATION-CHECKLIST.md](../Z-SANCTUARY-VERIFICATION-CHECKLIST.md). Z-HOAI outputs (triage rows, reports) may be **referenced** in Zuno or project trackers when you choose; the hub’s existing verify tasks and registry are **unchanged** unless you later follow [Z-ACN-MTEH-AUTO-CREATIONS-NEW-MODULES-TOOLS-EXTENSIONS.md](../Z-ACN-MTEH-AUTO-CREATIONS-NEW-MODULES-TOOLS-EXTENSIONS.md) to register a real module.

---

## 1. What Z-HOAI is (and is not)

**Z-HOAI is:**

- A **private internal helper organism** for pilot feedback: watch signals, classify, assign logical “shadow” roles, draft fixes, run or list checks, escalate when needed.
- **Doctrine + templates + optional report files** in this repo (`docs/ai-hand/`, `scripts/z_hoai_pilot_triage_template.mjs`).
- Explicitly **recommend-only** for anything that touches money, legal copy, safety, privacy, or launch scope.

**Z-HOAI is not:**

- Auto-merge, auto-deploy, auto-pricing, or auto-editing of legal/safety wording.
- A live external service, data pipe, or new network integration in the hub.
- A replacement for Z-EAII, Overseer approval, or your project’s own pilot gates (e.g. project-local `pilot-patch-gate` scripts stay in **that** repo).

---

## 2. Operating flow (doctrine)

```text
Collect signals
→ classify them
→ assign mini-bots (logical roles)
→ create tracker-ready findings
→ suggest minimal patch
→ run or remind verification commands (in the consumer project)
→ escalate to Amk-Goku when gates say so
```

**Final rule:**

```text
Z-HOAI handles the noise.
Amk-Goku handles the sacred decisions.
Cursor handles the patch.
The checks protect the merge.
```

---

## 3. Hub vs consumer project

| Location | Role |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ZSanctuary_Universe** (`docs/ai-hand/`) | Canonical doctrine, shadow roles, matrices, flow; optional blank triage JSON/MD via `npm run hoai:pilot-triage-template`. |
| **Pilot app repo** (e.g. on disk only) | Tracker file path, `pilot-patch-gate`, lint/build/test, product routes — **owned by that repo**. Copy or adapt templates; do not require the hub to contain app source. |

This separation **protects** hub health: no fake XL2 scripts in root `package.json`, no registry churn for a non-hub app.

---

## 4. Cursor builder prompt (portable)

Use this when working in **any** pilot repo (adjust product name and paths):

```text
You are Cursor Builder on <PILOT_APP_NAME>.

Mission: Apply Z-HOAI — Hand-On AI Pilot Intelligence Layer for internal pilot triage only.

Posture: stabilization and clarity; no feature creep; serious findings logged in the project’s P0/P1 tracker (path defined in that repo).

Strict rules: No auto-merge. No auto-activation of payments. Do not change legal/pricing/safety wording without human review. Do not connect Z-Sanctuary hub code into the app unless explicitly approved.

Use hub doctrine: ZSanctuary_Universe docs/ai-hand/ (clone or open hub for reference).
```

---

## 5. Related documents (this folder)

| Document | Content |
| ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| [MULTI_SHADOW_BOT_ROLES.md](MULTI_SHADOW_BOT_ROLES.md) | Nine shadow roles: inputs, rules, allowed actions, escalation, forbidden actions. |
| [FEEDBACK_TRIAGE_RULES.md](FEEDBACK_TRIAGE_RULES.md) | From raw tester text to structured fields. |
| [AMK_INTERVENTION_GATES.md](AMK_INTERVENTION_GATES.md) | When the human must decide. |
| [PATCH_DECISION_MATRIX.md](PATCH_DECISION_MATRIX.md) | Signal → AI vs human action. |
| [PILOT_SIGNAL_TO_TRACKER_FLOW.md](PILOT_SIGNAL_TO_TRACKER_FLOW.md) | End-to-end path to tracker rows and verification. |
| [PHASE_3N1_HOAI_TRIAGE_LAYER_REPORT.md](PHASE_3N1_HOAI_TRIAGE_LAYER_REPORT.md) | Acceptance report for this layer (hub). |

**Related (hub operator canvas doctrine):** [Z-UCCR Charter](../universal-canvas/Z_UCCR_CHARTER.md) — Universal Canvas Control Realm; read-first ecosystem map and consent gates (not pilot triage, not XL2).

---

## 6. Optional automation later

After enough real pilot signals, you may add a small script in a **consumer** repo to append to `data/reports/…` or the project tracker. The hub stays the **doctrine owner** until you explicitly promote tooling via ACN/MTEH and registry updates.
