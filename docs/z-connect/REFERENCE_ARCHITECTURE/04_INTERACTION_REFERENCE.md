# 04 — Interaction Reference

**Handbook chapter** · [INDEX](INDEX.md)  
**Authority:** [interaction-contracts/](../interaction-contracts/) — **11 behavioural flows**

## What interaction contracts answer

> How do humans and AI interact with the data?

Interaction contracts define **journeys, gates, and forbidden shortcuts** — not data shapes, not state enums.

## Flow catalog

| # | Flow | Primary actors | Shadow | DRP |
| - | ---- | -------------- | ------ | --- |
| 1 | [AI Discovery](../interaction-contracts/flows/AI_DISCOVERY_FLOW.md) | User, AI guide | Required | Standard |
| 2 | [Compatibility Insight](../interaction-contracts/flows/COMPATIBILITY_INSIGHT_FLOW.md) | User, AI guide | Required | Standard |
| 3 | [Connection Request](../interaction-contracts/flows/CONNECTION_REQUEST_FLOW.md) | User A, B | N/A | Standard |
| 4 | [Messaging](../interaction-contracts/flows/MESSAGING_FLOW.md) | Users | On AI assist | Standard |
| 5 | [Dream Baby](../interaction-contracts/flows/DREAM_BABY_FLOW.md) | Users (2+) | Required | Elevated |
| 6 | [Consent](../interaction-contracts/flows/CONSENT_FLOW.md) | User | N/A | Standard |
| 7 | [Premium Upgrade](../interaction-contracts/flows/PREMIUM_UPGRADE_FLOW.md) | User | N/A | **Sacred** |
| 8 | [Account Deletion](../interaction-contracts/flows/ACCOUNT_DELETION_FLOW.md) | User | N/A | Elevated |
| 9 | [Privacy Export](../interaction-contracts/flows/PRIVACY_EXPORT_FLOW.md) | User | N/A | Elevated |
| 10 | [Moderation](../interaction-contracts/flows/MODERATION_FLOW.md) | User, reviewer | N/A | Elevated |
| 11 | [Appeal](../interaction-contracts/flows/APPEAL_FLOW.md) | User, reviewer | N/A | Elevated |

Master index: [FLOW_INDEX.md](../interaction-contracts/FLOW_INDEX.md)

## Standard AI path

```text
User intent → Consent → DRP → AI generate → Shadow → User review → Persist → Audit
```

[INTERACTION_CONTRACT_LAW.md](../interaction-contracts/INTERACTION_CONTRACT_LAW.md)

## Cross-cutting gates

| Gate | When |
| ---- | ---- |
| Consent | Before storing or sharing sensitive data |
| Shadow | Before showing or persisting AI-generated content |
| DRP | Sacred moves, child data, payments, export at scale |
| Human | Premium live pay, public launch, policy exceptions |

## Forbidden everywhere

- Auto-accept connections  
- Auto-send messages  
- Compatibility percentages or destiny language  
- Skipping consent for shared experiences  
- Bypassing Shadow for AI output  
- Live payment without sacred gate  

## Diagram types per flow

Each flow includes mermaid **sequence diagrams**. Cross-cutting **state diagrams** for connection lifecycle and Progressive Discovery live in [FLOW_INDEX.md](../interaction-contracts/FLOW_INDEX.md).

## Reports

[PHASE_1_5_B1_5_ARCHITECTURE_REPORT.md](../interaction-contracts/PHASE_1_5_B1_5_ARCHITECTURE_REPORT.md) · [PHASE_1_5_B1_5_GREEN_RECEIPT.md](../interaction-contracts/PHASE_1_5_B1_5_GREEN_RECEIPT.md)
