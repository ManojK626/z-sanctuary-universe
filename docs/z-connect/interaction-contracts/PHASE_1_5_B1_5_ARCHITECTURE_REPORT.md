# Phase 1.5 B1.5 — Architecture Report

**Project:** Z-Connect · Interaction Contracts & Experience Flows  
**Date:** 2026-07-04  
**Authority:** AMK-approved master instruction  
**Posture:** Architecture only · Merge Hold · Runtime NOT AUTHORIZED

---

## 1. Executive summary

Phase 1.5 B1.5 adds the **behavioural layer** between domain contracts and future API design. **11 interaction flows** define how humans and AI may use Z-Connect data — with consent checkpoints, Shadow validation, DRP gates, and governance touchpoints documented in sequence and state diagrams.

**No executable code.** No OpenAPI, SQL, UI components, or payment integration.

**Signal:** GREEN for architecture review. Phase 1.6 (OpenAPI + logical database) remains **blocked** until B1.5 review completes.

---

## 2. Architecture stack (updated)

```text
Vision + Principles + Governance          ✅
Scientific Integrity + AI Constitution    ✅
Domain Contracts (B1)                     ✅ 61 schemas
Interaction Contracts (B1.5)              ✅ 11 flows
OpenAPI (Phase 1.6)                       🔒 blocked
Logical Database (Phase 1.6)              🔒 blocked
Sprint 0                                  🔒 blocked
```

---

## 3. Folder structure

```text
docs/z-connect/interaction-contracts/
├── README.md
├── INTERACTION_CONTRACT_LAW.md
├── FLOW_INDEX.md
├── PHASE_1_5_B1_5_ARCHITECTURE_REPORT.md
├── PHASE_1_5_B1_5_GREEN_RECEIPT.md
└── flows/
    ├── AI_DISCOVERY_FLOW.md
    ├── COMPATIBILITY_INSIGHT_FLOW.md
    ├── CONNECTION_REQUEST_FLOW.md
    ├── MESSAGING_FLOW.md
    ├── DREAM_BABY_FLOW.md
    ├── CONSENT_FLOW.md
    ├── PREMIUM_UPGRADE_FLOW.md
    ├── ACCOUNT_DELETION_FLOW.md
    ├── PRIVACY_EXPORT_FLOW.md
    ├── MODERATION_FLOW.md
    └── APPEAL_FLOW.md
```

---

## 4. Flow inventory

| # | Flow | AI path | Sacred / elevated |
| - | ---- | ------- | ----------------- |
| 1 | AI Discovery | Yes — Shadow required | Standard DRP |
| 2 | Compatibility Insight | Yes — Shadow required | Standard DRP |
| 3 | Connection Request | No | Standard DRP |
| 4 | Messaging | AI assist only | Standard DRP |
| 5 | Dream Baby Studio | Yes — Shadow required | Elevated DRP |
| 6 | Consent | No | Standard DRP |
| 7 | Premium Upgrade | No | **Sacred** — live pay HOLD |
| 8 | Account Deletion | No | Elevated DRP |
| 9 | Privacy Export | No | Elevated DRP |
| 10 | Moderation | No | Elevated DRP |
| 11 | Appeal | No | Elevated DRP |

Master cross-reference: [FLOW_INDEX.md](FLOW_INDEX.md)

---

## 5. Cross-cutting gates

All flows inherit [INTERACTION_CONTRACT_LAW.md](INTERACTION_CONTRACT_LAW.md):

| Gate | Role |
| ---- | ---- |
| **Consent** | Before capture, sharing, or persistence of sensitive data |
| **Shadow** | Before user-facing AI output |
| **DRP** | Before sacred moves, child data, bulk export, deletion |
| **Human approval** | Premium live pay, policy exceptions, child safety escalation |

Standard AI path:

```text
User → Consent → DRP → AI guide → Shadow → User review → Persist → Audit
```

---

## 6. Domain contract alignment

Each flow references schemas from [platform-contracts/CONTRACT_INVENTORY.md](../platform-contracts/CONTRACT_INVENTORY.md). Interaction contracts **do not redefine** data shapes — they specify **allowed transitions** and **forbidden shortcuts**.

Example mapping:

| Flow | Primary schemas |
| ---- | --------------- |
| AI Discovery | `ai-discovery-session`, `discovery-*`, `consent-record` |
| Compatibility Insight | `compatibility-insight`, `connection-confidence` |
| Premium Upgrade | `membership`, `plan`, `entitlement` |
| Moderation | `report`, `review`, `safety-action` |

---

## 7. Diagram coverage

| Diagram type | Location |
| ------------ | -------- |
| Sequence (mermaid) | All 11 flow docs |
| State — connection lifecycle | [FLOW_INDEX.md](FLOW_INDEX.md) |
| State — Progressive Discovery | [FLOW_INDEX.md](FLOW_INDEX.md) |
| State — membership (premium) | [PREMIUM_UPGRADE_FLOW.md](flows/PREMIUM_UPGRADE_FLOW.md) |
| State — report / appeal | [MODERATION_FLOW.md](flows/MODERATION_FLOW.md), [APPEAL_FLOW.md](flows/APPEAL_FLOW.md) |

---

## 8. Compliance

| Standard | Status |
| -------- | ------ |
| [AI Constitution v1](../Z_CONNECT_AI_CONSTITUTION_V1.md) | Aligned — no objective truth, human decides |
| [Scientific Integrity](../Z_CONNECT_SCIENTIFIC_INTEGRITY.md) | Aligned — entertainment labeled |
| [Connection Confidence](../Z_CONNECT_CONNECTION_CONFIDENCE.md) | Aligned — no percentages in flows |
| [Progressive Discovery](../Z_CONNECT_PROGRESSIVE_DISCOVERY.md) | Aligned — phased state diagram |
| Merge Hold | Unchanged |
| Sacred moves | Premium, launch, live pay — HOLD |

---

## 9. Risks

| Risk | Mitigation |
| ---- | ---------- |
| Flow drift from domain schemas | FLOW_INDEX schema column; Phase 1.6 cross-walk |
| Over-specification before OpenAPI | Flows describe behaviour, not HTTP verbs |
| Legal copy gaps | Stream B legal drafts (B15–B16) separate |
| Commercial assets lag engineering | [Z_CONNECT_COMMERCIAL_PREP_ASSETS.md](../Z_CONNECT_COMMERCIAL_PREP_ASSETS.md) parallel track |

---

## 10. Next phase (blocked)

Phase 1.6 — OpenAPI + Logical Database:

- Derive routes from interaction flows + domain schemas  
- Logical schema respects consent append-only and export/delete flows  
- Still no runtime until Sprint 0 chartered  

---

## 11. Rollback

Delete `docs/z-connect/interaction-contracts/` folder. No runtime teardown.

---

## 12. Verdict

Phase 1.5 B1.5 — Interaction Contracts & Experience Flows

Architecture posture: **GREEN** · Merge Hold · Runtime NOT AUTHORIZED

Await AMK review before Phase 1.6.
