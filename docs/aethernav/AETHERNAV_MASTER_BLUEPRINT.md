# AetherNav — Master Blueprint (Phase 0)

**Status:** Phase 0 — documentation only. **Lane ID:** `aethernav` (separate from LinguaCore).

**Purpose:** Define a **privacy-first spatial intelligence and map guidance** concept for Z-Sanctuary: how people orient, plan, and explore **without** surrendering location sovereignty, emergency authority, or hub governance to a map vendor or silent runtime.

---

## Identity — own lane, not LinguaCore

| Concern | AetherNav | LinguaCore |
| ------------------- | --------------------------------------------------------------------- | ------------------------------------------------------ |
| Primary domain | Spatial orientation, routes, place context, accessibility of movement | Language learning, phrasebooks, cultural communication |
| Phase 0 deliverable | Blueprint pack under `docs/aethernav/` | Separate blueprint under `docs/linguacore/` |
| Runtime in Phase 0 | **None** | **None** |
| Merge discipline | Turtle branch `cursor/zsanctuary/aethernav-*` | Turtle branch `cursor/zsanctuary/linguacore-*` |

**Rule:** Do **not** nest AetherNav inside LinguaCore modules, registries, or dashboards. Future **optional bridges** (phrase + place labels, tourism copy) are documented in [AETHERNAV_Z_SANCTUARY_INTEGRATION_MAP.md](AETHERNAV_Z_SANCTUARY_INTEGRATION_MAP.md) — not implemented in Phase 0.

---

## Vision (one paragraph)

AetherNav is a **governed spatial companion**: mock-first map cockpits, local-only routing demos, and encrypted preference vaults — always **visible**, **consent-led**, and **subordinate** to Z-Sanctuary hierarchy (Z-Hierarchy Chief, 14 DRP, human gates). It helps operators and future users **think about space** without live tracking, biometric stress inference, or emergency-routing claims.

---

## Standing laws (AetherNav)

```text
navigation assistance is not emergency authority
mock readiness does not equal production approval
user consent is required for any location or personal data
```

Align with hub builder spine where applicable ([Z_OPERATIONAL_TECHNOLOGY_LAYERS.md](../Z_OPERATIONAL_TECHNOLOGY_LAYERS.md) when merged):

```text
observe → verify → suggest → human decides
readiness ≠ deploy
layered tools ≠ the soul
```

---

## Hard exclusions (all phases until explicitly chartered)

| Exclusion | Rationale |
| ----------------------------------- | ----------------------------------------------------------------- |
| Live user location tracking | No silent GPS/network geolocation pipelines |
| Child tracking | No minor surveillance or guardian bypass surfaces |
| Biometric stress detection | No affect inference from movement or vitals |
| Emergency-routing claims | No “fastest ambulance” or crisis authority UI |
| Hospital / airport live integration | No real-time facility feeds without charter + legal review |
| Pricing commitments | No fare/ticket promises in mock or product copy |
| Federated learning | No cross-user model training on movement data |
| Deployment | No Cloudflare bind, public NAS, or production map APIs in Phase 0 |

---

## Phase ladder (summary)

Full detail: [AETHERNAV_PHASE_LADDER.md](AETHERNAV_PHASE_LADDER.md).

| Phase | Scope |
| ----- | ---------------------------------------------------------------------------- |
| **0** | Docs only (this pack) |
| **1** | Static mock map cockpit (HTML/CSS/JS + mock JSON; no live maps) |
| **2** | Local graph routing demo (offline graph; no network geolocation) |
| **3** | Local encrypted preference vault (operator device; no cloud sync by default) |
| **4** | Optional AR prototype (simulation / charter; no production AR authority) |
| **5** | Governed enterprise integrations (charter + receipts per connector) |

---

## Builder posture (Cursor)

- **Docs / mock / registry hooks** only until Phase receipts say otherwise.
- **No** APIs, map tile processors, AR runtimes, or location SDKs in Phase 0.
- **PR-sized** work on `cursor/zsanctuary/aethernav-*`; human merge on `main`.

---

## Doc pack (Phase 0)

| Doc | Role |
| ---------------------------------------------------------------------------------------------- | ----------------------------- |
| This file | Master blueprint |
| [AETHERNAV_Z_SANCTUARY_INTEGRATION_MAP.md](AETHERNAV_Z_SANCTUARY_INTEGRATION_MAP.md) | Hub, dashboard, sibling lanes |
| [AETHERNAV_PRIVACY_SAFETY_AND_14_DRP_POLICY.md](AETHERNAV_PRIVACY_SAFETY_AND_14_DRP_POLICY.md) | Privacy, safety, 14 DRP |
| [AETHERNAV_PHASE_LADDER.md](AETHERNAV_PHASE_LADDER.md) | Phased delivery |
| [PHASE_AETHERNAV_0_GREEN_RECEIPT.md](PHASE_AETHERNAV_0_GREEN_RECEIPT.md) | Phase 0 acceptance |

---

## Authority

When unsure: [Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md](../Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md) → [AI_BUILDER_CONTEXT.md](../AI_BUILDER_CONTEXT.md) → [Z_SWARM_14DRP_UNIVERSAL_AGENT_LAW.md](../Z_SWARM_14DRP_UNIVERSAL_AGENT_LAW.md).
