# Z-Connect — Experience State Contracts (Phase 1.5 B1.6)

**Status:** Architecture only · **Merge Hold** · **no runtime**  
**Authority:** AMK-approved · Stream B  
**Version:** 1.0  
**Date:** 2026-07-04

## The three contract layers

| Layer | Answers | Phase |
| ----- | ------- | ----- |
| Domain contracts | *What data exists?* | B1 |
| Interaction contracts | *How do participants interact?* | B1.5 |
| **Experience State contracts** | ***What states can an experience move through?*** | **B1.6** |

```text
Domain Contracts (B1)          →  data shapes
Interaction Contracts (B1.5)   →  behaviour, gates, journeys
Experience State Contracts     →  authoritative state machines
  (B1.6)
OpenAPI (Phase 1.6)            →  HTTP surface (blocked)
Logical Database (1.6)         →  persistence model (blocked)
Sprint 0                       →  code (blocked)
```

## Purpose

Experience State Contracts (ESC) are the **authoritative reference** for the lifecycle of each experience. Every state machine here becomes the single source of truth for:

- API route design (which transitions are allowed)
- Database status fields and transition logs
- Analytics and funnel definitions
- Notification triggers
- AI orchestration checkpoints

## Reusable across Z-Sanctuary

ESC is designed as a **universal pattern**, not Z-Connect-only. Other projects — Compassion Platform, ZILWA, Z-Legal, Zuno Intelligence — may define their **own** states while following the same law and diagram conventions.

Pattern spec: [ESC_REUSABLE_PATTERN.md](ESC_REUSABLE_PATTERN.md)

## Law

- No executable code · no state machine libraries · no runtime
- Every **governance-sensitive** transition (rights, privacy, payment, shared content) is marked and gated
- States align to [platform-contracts/](../platform-contracts/) status enums and [interaction-contracts/](../interaction-contracts/) flows
- GREEN ≠ deploy

Full law: [ESC_LAW.md](ESC_LAW.md)

## State contract catalog

| # | Experience | Doc |
| - | ---------- | --- |
| 1 | Discovery Journey | [states/DISCOVERY_JOURNEY_STATE.md](states/DISCOVERY_JOURNEY_STATE.md) |
| 2 | Connection Request | [states/CONNECTION_REQUEST_STATE.md](states/CONNECTION_REQUEST_STATE.md) |
| 3 | Dream Baby Studio | [states/DREAM_BABY_STATE.md](states/DREAM_BABY_STATE.md) |
| 4 | Conversation / Messaging | [states/CONVERSATION_STATE.md](states/CONVERSATION_STATE.md) |
| 5 | Membership (Premium) | [states/MEMBERSHIP_STATE.md](states/MEMBERSHIP_STATE.md) |
| 6 | Consent Record | [states/CONSENT_STATE.md](states/CONSENT_STATE.md) |
| 7 | Moderation & Appeal | [states/MODERATION_APPEAL_STATE.md](states/MODERATION_APPEAL_STATE.md) |

Master index: [STATE_INDEX.md](STATE_INDEX.md)

## Governance reminder (carried into every phase)

> Every transition between experience states that changes user rights, privacy, payments, or shared content must remain subject to the appropriate consent and governance checks (Consent · Security · DRP · Shadow).

## Reports

- [PHASE_1_5_B1_6_ARCHITECTURE_REPORT.md](PHASE_1_5_B1_6_ARCHITECTURE_REPORT.md)
- [PHASE_1_5_B1_6_GREEN_RECEIPT.md](PHASE_1_5_B1_6_GREEN_RECEIPT.md)

## Next (blocked)

**Phase 1.6** — OpenAPI + logical database — await B1.6 review + Merge Hold release.
