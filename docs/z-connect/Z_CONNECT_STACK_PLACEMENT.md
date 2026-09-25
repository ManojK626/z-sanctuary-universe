# Z-Connect — Stack Placement

**Purpose:** Show where Z-Connect sits relative to Z-Sanctuary shared packages and governance layers.

---

## Request path (target runtime)

```text
User / Client
    ↓
Security (zuno-security — classify, trust, I/O guards)
    ↓
DRP (zuno-drp — governance, sacred moves, pending_human)
    ↓
Handler / Orchestrator
    ↓
[If AI output] Shadow (zuno-shadow — verify before show/store)
    ↓
Observability (zuno-observability — audit events, correlation)
    ↓
Response
```

**Note:** DRP evaluates **whether an action may proceed**. Shadow validates **AI-generated content**. Both are required on AI paths; neither replaces the other.

---

## Z-Connect vs Z-Connection Tree

| | Z-Connection Tree | Z-Connect |
| - | ----------------- | --------- |
| Primary metaphor | Memory of presence · forest | Relationship discovery ecosystem |
| Ranking | Forbidden | Forbidden (same philosophy) |
| Scope | Belonging across time | Friendships, romance, family, community |
| Shared law | Optional presence, no referral pressure | Same + scientific integrity charter |

See [Z-CONNECTION-TREE-PHILOSOPHY.md](../Z-CONNECTION-TREE-PHILOSOPHY.md).

---

## Package reuse (do not duplicate)

| Capability | Use |
| ---------- | --- |
| Security contracts | `@z-sanctuary/zuno-security` |
| AI output verification | `@z-sanctuary/zuno-shadow` |
| 14 DRP decisions | `@z-sanctuary/zuno-drp` (when implemented) |
| Audit events | `@z-sanctuary/zuno-observability` |
| Orchestrator shapes | `zuno-orchestrator-contracts` |

---

## Phase alignment with VILE

Z-Connect **waits** for VILE Phase 2A foundation merge before platform-specific packages. Z-Connect Phase 1.5 should **extend** platform contracts — not fork security/DRP/shadow types.

---

## Hub authority

When unsure: [Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md](../Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md)
