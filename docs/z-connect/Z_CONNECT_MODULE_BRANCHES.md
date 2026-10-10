# Z-Connect — Module Branches (Connection Tree Alignment)

**Purpose:** Each major capability is a **branch** — modular, consent-bound, and independently charterable — not one monolithic application.

**Authority:** [Z-CONNECTION-TREE-PHILOSOPHY.md](../Z-CONNECTION-TREE-PHILOSOPHY.md) · [Z_CONNECT_ARCHITECTURE_DECISIONS_V1.md](Z_CONNECT_ARCHITECTURE_DECISIONS_V1.md)

---

## Branch tree (v1 conceptual)

```text
🌍 Z-Connect (platform root — governance + shared services)
├── ❤️ Universal Soulmate      — long-term partnership discovery (no destiny claims)
├── 🤝 Friendship              — platonic connection discovery
├── 💕 Couples                 — existing relationship tools & growth
├── 👨‍👩‍👧 Family                  — family-oriented connection & planning
├── 👶 Dream Baby Studio       — creative AI (entertainment; all-party consent)
├── 🧠 AI Discovery Journey    — conversational onboarding ([spec](Z_CONNECT_AI_DISCOVERY_JOURNEY.md))
├── 💬 Messaging               — consent-first communication (future phase)
├── 🎉 Events                  — shared experiences & gatherings
├── 🌎 Communities             — group belonging (no leaderboard)
└── ⚙ Shared Services          — security, DRP, shadow, observability hooks
```

---

## Branch rules

| Rule | Meaning |
| ---- | ------- |
| **One branch ≠ one repo required** | Monorepo packages may map 1:1 to branches over time |
| **Each branch has boundaries** | Charter or child doc before runtime |
| **No branch bypasses hub gates** | Shadow + DRP on all AI and sacred paths |
| **Branches do not rank users** | No “top soulmates” across branches |
| **Shared Services is not optional** | Reuse `zuno-*` — no per-branch security copies |

---

## Branch status (Phase 1)

| Branch | Phase 1 status |
| ------ | -------------- |
| Platform root + governance docs | **Complete** (this pack) |
| AI Discovery Journey | Spec complete |
| Connection Confidence | Spec complete |
| Progressive Discovery | Spec complete |
| Universal Soulmate | Concept only — contracts Phase 1.5 |
| Friendship | Concept only |
| Couples | Concept only |
| Family | Concept only |
| Dream Baby Studio | Charter boundary in master doc — implementation HOLD |
| Messaging | Roadmap only |
| Events | Roadmap only |
| Communities | Roadmap only |
| Shared Services | Reuse hub packages — no Z-Connect fork |

---

## Implementation sequencing (recommended)

1. Shared Services alignment (after VILE 2A merge)  
2. Domain contracts — profiles, consent, insights ([roadmap](Z_CONNECT_PHASE_1_5_ROADMAP.md))  
3. AI Discovery Journey mock (read-only UI)  
4. Friendship + Universal Soulmate read-only surfaces  
5. Messaging — only after moderation + safety charter  
6. Dream Baby Studio — AMK sacred gate  

---

## Related

- [Z_CONNECT_MASTER_BUILD_CHARTER.md](Z_CONNECT_MASTER_BUILD_CHARTER.md)  
- [Z_CONNECT_STACK_PLACEMENT.md](Z_CONNECT_STACK_PLACEMENT.md)
