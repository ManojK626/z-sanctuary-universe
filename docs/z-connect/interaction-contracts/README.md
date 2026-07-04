# Z-Connect — Interaction Contracts (Phase 1.5 B1.5)

**Status:** Architecture only · **Merge Hold** · **no runtime**  
**Authority:** AMK-approved · Stream B  
**Version:** 1.0  
**Date:** 2026-07-04

## Purpose

**Domain contracts** describe *what data exists*.  
**Interaction contracts** describe *how humans and AI are allowed to use that data*.

```text
Domain Contracts (B1)     →  data shapes
Interaction Contracts (B1.5)  →  behaviour, gates, journeys
OpenAPI (Phase 1.6)       →  HTTP surface (blocked)
Logical Database (1.6)    →  persistence model (blocked)
Sprint 0                  →  code (blocked)
```

## Law

- No executable code  
- No API routes · no SQL · no UI components  
- Every flow respects [AI Constitution v1](../Z_CONNECT_AI_CONSTITUTION_V1.md)  
- Shadow + DRP gates documented — not bypassed  
- GREEN ≠ deploy  

## Flow catalog

| # | Flow | Doc |
| - | ---- | --- |
| 1 | AI Discovery | [flows/AI_DISCOVERY_FLOW.md](flows/AI_DISCOVERY_FLOW.md) |
| 2 | Connection Request | [flows/CONNECTION_REQUEST_FLOW.md](flows/CONNECTION_REQUEST_FLOW.md) |
| 3 | Compatibility Insight | [flows/COMPATIBILITY_INSIGHT_FLOW.md](flows/COMPATIBILITY_INSIGHT_FLOW.md) |
| 4 | Messaging | [flows/MESSAGING_FLOW.md](flows/MESSAGING_FLOW.md) |
| 5 | Dream Baby Studio | [flows/DREAM_BABY_FLOW.md](flows/DREAM_BABY_FLOW.md) |
| 6 | Consent | [flows/CONSENT_FLOW.md](flows/CONSENT_FLOW.md) |
| 7 | Premium Upgrade | [flows/PREMIUM_UPGRADE_FLOW.md](flows/PREMIUM_UPGRADE_FLOW.md) |
| 8 | Account Deletion | [flows/ACCOUNT_DELETION_FLOW.md](flows/ACCOUNT_DELETION_FLOW.md) |
| 9 | Privacy Export | [flows/PRIVACY_EXPORT_FLOW.md](flows/PRIVACY_EXPORT_FLOW.md) |
| 10 | Moderation | [flows/MODERATION_FLOW.md](flows/MODERATION_FLOW.md) |
| 11 | Appeal | [flows/APPEAL_FLOW.md](flows/APPEAL_FLOW.md) |

Master index: [FLOW_INDEX.md](FLOW_INDEX.md)

## Cross-cutting gates (all flows)

| Gate | When |
| ---- | ---- |
| **Consent** | Before storing or sharing sensitive data |
| **Shadow** | Before showing or persisting AI-generated content |
| **DRP** | Before sacred moves, child data, payments, export at scale |
| **Human approval** | Premium live pay, public launch, policy exceptions |

## Domain contract alignment

All flows reference schemas in [platform-contracts/](../platform-contracts/CONTRACT_INVENTORY.md).

## Reports

- [PHASE_1_5_B1_5_ARCHITECTURE_REPORT.md](PHASE_1_5_B1_5_ARCHITECTURE_REPORT.md)  
- [PHASE_1_5_B1_5_GREEN_RECEIPT.md](PHASE_1_5_B1_5_GREEN_RECEIPT.md)  

## Next (blocked)

**Phase 1.6** — OpenAPI + logical database — await B1.5 review + Merge Hold release.
