# Phase 1.5 B1.6 — Architecture Report

**Project:** Z-Connect · Experience State Contracts (ESC)  
**Date:** 2026-07-04  
**Authority:** AMK-approved master instruction  
**Posture:** Architecture only · Merge Hold · Runtime NOT AUTHORIZED

---

## 1. Executive summary

Phase 1.5 B1.6 adds the **authoritative state layer** between interaction contracts and future OpenAPI. **7 experience state contracts** define the lifecycle of each Z-Connect experience as explicit state machines, with every governance-sensitive transition gated (Consent · Security · DRP · Shadow · Human).

ESC is designed as a **reusable Z-Sanctuary pattern** — other projects (Compassion Platform, ZILWA, Z-Legal, Zuno Intelligence) may define their own states following the same law and diagram convention.

**No executable code.** No state library, no OpenAPI, no SQL, no runtime.

**Signal:** GREEN for architecture review. Phase 1.6 (OpenAPI + logical database) remains **blocked** behind Merge Hold until the shared VILE foundation reaches its integration point.

---

## 2. Architecture stack (updated per AMK)

```text
Vision                        ✅
AI Constitution               ✅
Scientific Integrity          ✅
Domain Contracts (B1)         ✅
Interaction Contracts (B1.5)  ✅
Experience State Contracts    ✅ (B1.6 — this phase)
OpenAPI Specifications        🔒 Phase 1.6
Logical Database Model        🔒 Phase 1.6
Reference Architecture        🔒
Sprint 0                      🔒
Implementation                🔒
Testing                       🔒
Deployment Review             🔒
Human Approval                🔒
```

---

## 3. Folder structure

```text
docs/z-connect/experience-state-contracts/
├── README.md
├── ESC_LAW.md
├── ESC_REUSABLE_PATTERN.md
├── STATE_INDEX.md
├── PHASE_1_5_B1_6_ARCHITECTURE_REPORT.md
├── PHASE_1_5_B1_6_GREEN_RECEIPT.md
└── states/
    ├── DISCOVERY_JOURNEY_STATE.md
    ├── CONNECTION_REQUEST_STATE.md
    ├── DREAM_BABY_STATE.md
    ├── CONVERSATION_STATE.md
    ├── MEMBERSHIP_STATE.md
    ├── CONSENT_STATE.md
    └── MODERATION_APPEAL_STATE.md
```

---

## 4. State contract inventory

| # | Experience | Terminal state(s) | Sacred / elevated gate |
| - | ---------- | ----------------- | ---------------------- |
| 1 | Discovery Journey | archived | Consent + Shadow |
| 2 | Connection Request | closed | Consent (invite) |
| 3 | Dream Baby Studio | archived | Elevated DRP + all-party consent + Shadow |
| 4 | Conversation | closed | Shadow (AI assist) |
| 5 | Membership | cancelled | **Sacred** — DRP + Human (live pay HOLD) |
| 6 | Consent Record | denied / withdrawn / expired | Consent (explicit) |
| 7 | Moderation & Appeal | resolved | DRP + Human (child safety mandatory) |

Master cross-reference: [STATE_INDEX.md](STATE_INDEX.md)

---

## 5. Canonical decision pipeline

Every gated transition follows the AMK-approved pipeline:

```text
Human Action → Consent → Security → DRP → AI (if any) → Shadow (if AI) → Human Review (if sacred) → New State + Audit
```

Documented in [ESC_LAW.md](ESC_LAW.md). No new authority — the interaction contract gates applied to state transitions.

---

## 6. Reusable pattern (universal value)

[ESC_REUSABLE_PATTERN.md](ESC_REUSABLE_PATTERN.md) defines the copyable shape: header → state diagram → state table → transition table (with gates) → governance notes → out of scope.

| Future project | Example experiences (their own states) |
| -------------- | -------------------------------------- |
| Compassion Platform | support request · aid session |
| ZILWA | booking · stay · experience session |
| Z-Legal | case · document · review cycle |
| Zuno Intelligence | observation · analysis · recommendation |

**No shared runtime or coupling is implied** — this is a design blueprint only.

---

## 7. Alignment

| Layer | Alignment |
| ----- | --------- |
| Domain contracts (B1) | States map to schema status enums |
| Interaction contracts (B1.5) | Each state contract references its flow |
| AI Constitution v1 | Human decides; no auto-transition through gates |
| Scientific Integrity | Dream Baby entertainment disclaimer preserved |
| Merge Hold | Unchanged |

---

## 8. Governance reminder (carried forward)

> Every transition between experience states that changes user rights, privacy, payments, or shared content must remain subject to the appropriate consent and governance checks.

Encoded as the gate taxonomy in [ESC_LAW.md](ESC_LAW.md) and the gate columns in every transition table.

---

## 9. Risks

| Risk | Mitigation |
| ---- | ---------- |
| State drift from domain enums | STATE_INDEX schema column; Phase 1.6 cross-walk |
| Over-modelling before OpenAPI | States describe lifecycle, not endpoints |
| Cross-project misuse as coupling | Pattern doc states "blueprint, not bridge" |
| Sacred state (membership) drift | DRP + Human gate on `→ active`; live pay HOLD |

---

## 10. Next phase (blocked)

Phase 1.6 — OpenAPI + Logical Database:

- Derive routes from state transitions + interaction flows
- Logical schema uses states as status fields + append-only transition log
- Reference architecture ties the layers together
- Still no runtime until Sprint 0 chartered

---

## 11. Rollback

Delete `docs/z-connect/experience-state-contracts/` and revert parent doc links. No runtime teardown.

---

## 12. Verdict

Phase 1.5 B1.6 — Experience State Contracts:

Architecture posture: **GREEN** · Merge Hold · Runtime NOT AUTHORIZED

Await AMK review before Phase 1.6.
