# Z-Nexus Engine — Mock Dashboard Specification

**Phase:** Z-NEXUS-ENGINE-0
**Status:** Doctrine only — Turtle Mode
**Hub:** Z-Sanctuary Universe

---

## Mission

Document the **conceptual specification** for a Z-Nexus Engine awareness dashboard — a mock design that shows what an ethical, compassion-first resource-awareness view could look like, without deploying any runtime, Streamlit app, API, or live data connection.

---

## What this spec is

This document is a **paper mock** — a design intention record. No code is written. No server is started. No data is ingested. The spec exists so AMK-Goku can review the concept before any Phase 1 static mock is approved.

---

## Dashboard concept: overview

| Panel | Purpose |
| --- | --- |
| **Resource pulse** | Illustrative conceptual view of energy/water/food flows across regions |
| **Human-energy capacity** | Dignified rest-and-work cycle indicator — not productivity tracking |
| **Community surplus map** | Conceptual overlay of surplus and deficit for mutual aid routing |
| **Hold registry panel** | Live list of features gated at HOLD/BLUE status pending AMK gate |
| **Verification status strip** | Minibot signal row showing current doctrine verification state |

---

## Panel specifications (concept)

### Panel 1 — Resource pulse

| Field | Value |
| --- | --- |
| Type | Static mock visual (no live data) |
| Data source | Conceptual / illustrative ranges only |
| Refresh | None in Phase 0 |
| Claim posture | All figures labelled "illustrative only" |
| Blocked lanes | Real-time grid sensors, API polling, database reads |

### Panel 2 — Human-energy capacity

| Field | Value |
| --- | --- |
| Type | Concept card (no tracking, no logging) |
| Data source | None — framing only |
| Privacy posture | Zero PII; no user identification |
| Blocked lanes | Productivity scoring, time-tracking, biometric data |

### Panel 3 — Community surplus map

| Field | Value |
| --- | --- |
| Type | Static conceptual map sketch |
| Data source | Anonymised, consent-noted community patterns only |
| Blocked lanes | Real inventory, legal ownership data, live matching |

### Panel 4 — Hold registry panel

| Field | Value |
| --- | --- |
| Type | Rendered from `Z_NEXUS_ENGINE_FUTURE_HOLDS_REGISTRY.md` |
| Purpose | Transparent display of all gated/HOLD features |
| Blocked lanes | Auto-approval, auto-release of HOLD items |

### Panel 5 — Verification status strip

| Field | Value |
| --- | --- |
| Type | Static badge row |
| Source | Last `npm run z:traffic` / `verify:md` / `z:car2` results |
| Blocked lanes | CI auto-deployment trigger |

---

## Technology posture (Phase 0)

| Technology | Phase 0 status |
| --- | --- |
| Streamlit | HOLD — not installed, not started |
| Python runtime | HOLD — not required |
| External APIs | HOLD — not connected |
| Database | HOLD — not provisioned |
| Static HTML mock | BLUE — permitted only after AMK gate on Phase 1 |
| Live deploy | HOLD — blocked until AMK charter |

---

## Locked law

```text
Mock spec ≠ deployed dashboard.
Dashboard concept ≠ runtime application.
Panel spec ≠ live data feed.
Streamlit hold ≠ Streamlit approved.
GREEN ≠ Phase 1 auto-start.
BLUE requires AMK gate before static mock begins.
RED blocks movement.
AMK-Goku owns sacred moves.
```

---

## Next steps (gated)

Phase 1 (static HTML mock) may only begin after:

1. AMK-Goku reviews and approves this Phase 0 spec
2. A new branch is opened specifically for Phase 1
3. `npm run verify:md` and `z:traffic` are GREEN on that branch
4. No Streamlit or Python runtime is included in Phase 1

---

## Hub alignment

- [Z_NEXUS_ENGINE_GLOBAL_RESOURCE_AWARENESS.md](Z_NEXUS_ENGINE_GLOBAL_RESOURCE_AWARENESS.md)
- [Z_NEXUS_ENGINE_FUTURE_HOLDS_REGISTRY.md](Z_NEXUS_ENGINE_FUTURE_HOLDS_REGISTRY.md)
- [PHASE_Z_NEXUS_ENGINE_0_GREEN_RECEIPT.md](PHASE_Z_NEXUS_ENGINE_0_GREEN_RECEIPT.md) — phase receipt
