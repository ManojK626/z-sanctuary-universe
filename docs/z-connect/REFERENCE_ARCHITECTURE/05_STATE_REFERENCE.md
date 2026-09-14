# 05 — State Reference

**Handbook chapter** · [INDEX](INDEX.md)  
**Authority:** [experience-state-contracts/](../experience-state-contracts/) — **7 state machines**

## What experience state contracts answer

> How do experiences evolve over time?

Each ESC is the **authoritative lifecycle** for one experience — the single source for API transitions, DB status fields, analytics funnels, notifications, and AI orchestration checkpoints.

## Permanent doctrine

> A state transition changes the status of an experience — not the autonomy of the user. Users remain in control, and governance exists to protect rights, consent, and safety, not to make personal decisions on their behalf.

Every transition table marks **gates**; no gate may auto-decide on the user's behalf.

## State contract catalog

| Experience | Terminal | Sacred / elevated | Doc |
| ---------- | -------- | ----------------- | --- |
| Discovery Journey | archived | Consent + Shadow | [DISCOVERY_JOURNEY_STATE.md](../experience-state-contracts/states/DISCOVERY_JOURNEY_STATE.md) |
| Connection Request | closed | Consent (invite) | [CONNECTION_REQUEST_STATE.md](../experience-state-contracts/states/CONNECTION_REQUEST_STATE.md) |
| Dream Baby Studio | archived | Elevated DRP + all-party consent | [DREAM_BABY_STATE.md](../experience-state-contracts/states/DREAM_BABY_STATE.md) |
| Conversation | closed | Shadow (AI assist) | [CONVERSATION_STATE.md](../experience-state-contracts/states/CONVERSATION_STATE.md) |
| Membership | cancelled | **Sacred** — live pay HOLD | [MEMBERSHIP_STATE.md](../experience-state-contracts/states/MEMBERSHIP_STATE.md) |
| Consent Record | withdrawn / expired | Explicit consent | [CONSENT_STATE.md](../experience-state-contracts/states/CONSENT_STATE.md) |
| Moderation & Appeal | resolved | DRP + Human (child safety) | [MODERATION_APPEAL_STATE.md](../experience-state-contracts/states/MODERATION_APPEAL_STATE.md) |

Master index: [STATE_INDEX.md](../experience-state-contracts/STATE_INDEX.md)

## Example — Discovery Journey (AMK reference model)

```text
created → started → learning → paused → resumed → completed → archived
```

## Example — Connection Request (AMK reference model)

```text
draft → sent → received → accepted → active → dormant → closed
```

## Example — Dream Baby Studio (AMK reference model)

```text
created → consent_pending → approved → generating → completed → shared → archived
```

## Gate taxonomy

| Gate | Meaning |
| ---- | ------- |
| Consent | User permission required |
| Security | Trust-boundary classification |
| DRP | Sacred / child / payment / bulk |
| Shadow | AI output validation |
| Human | AMK/operator sign-off |

[ESC_LAW.md](../experience-state-contracts/ESC_LAW.md)

## Reusable pattern (Z-Sanctuary)

Other projects may define **their own states** using the same law and diagram convention:

[ESC_REUSABLE_PATTERN.md](../experience-state-contracts/ESC_REUSABLE_PATTERN.md)

## Reports

[PHASE_1_5_B1_6_ARCHITECTURE_REPORT.md](../experience-state-contracts/PHASE_1_5_B1_6_ARCHITECTURE_REPORT.md) · [PHASE_1_5_B1_6_GREEN_RECEIPT.md](../experience-state-contracts/PHASE_1_5_B1_6_GREEN_RECEIPT.md)
