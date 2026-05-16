# AetherNav — Phase Ladder

**Status:** Governed delivery sequence. **Phase 0 = current.**

Align with hub Turtle Mode: one phase per branch, PR review, `npm run verify:md` minimum.

---

## Overview

| Phase | Name | Deliverable | Runtime |
| ----- | -------------------------------- | --------------------------------------------- | ----------------------------- |
| **0** | Blueprint | `docs/aethernav/*` + INDEX + AI_BUILDER hooks | **None** |
| **1** | Static mock map cockpit | HTML/CSS/JS + mock JSON under `dashboard/` | Local file / HTTP static only |
| **2** | Local graph routing demo | Offline graph JSON + client-side path find | No network geolocation |
| **3** | Local encrypted preference vault | Device-local storage; encryption charter | No cloud sync by default |
| **4** | Optional AR prototype | Simulation / lab UI; charter required | No production AR authority |
| **5** | Governed enterprise integrations | Per-connector receipts, Z-XBUS gate | Human-gated only |

---

## Phase 0 — Docs only (sealed by receipt)

**Branch:** `cursor/zsanctuary/aethernav-phase-0-blueprint`

**Includes:**

- [AETHERNAV_MASTER_BLUEPRINT.md](AETHERNAV_MASTER_BLUEPRINT.md)
- [AETHERNAV_Z_SANCTUARY_INTEGRATION_MAP.md](AETHERNAV_Z_SANCTUARY_INTEGRATION_MAP.md)
- [AETHERNAV_PRIVACY_SAFETY_AND_14_DRP_POLICY.md](AETHERNAV_PRIVACY_SAFETY_AND_14_DRP_POLICY.md)
- This ladder + [PHASE_AETHERNAV_0_GREEN_RECEIPT.md](PHASE_AETHERNAV_0_GREEN_RECEIPT.md)
- [INDEX.md](../INDEX.md) and [AI_BUILDER_CONTEXT.md](../AI_BUILDER_CONTEXT.md) links

**Excludes:** APIs, map processing, AR, location tracking, biometrics, deployment, registry manifest rows.

**Verify:** `npm run verify:md`

---

## Phase 1 — Static mock map cockpit

**Goal:** Operator-visible **fake** map surface for layout, accessibility, and narrative testing.

**May include:**

- `dashboard/Html/aethernav-mock-map-cockpit.html` (name TBD in Phase 1 PR)
- Mock places/routes JSON (no real coordinates from device)
- NAV-1 catalog row + AMK control link (read-only)
- Phase 1 green receipt

**Must not include:**

- Map tile APIs (Google, Mapbox, OSM network tiles)
- Live GPS or browser geolocation API
- “You are here” from device sensors

---

## Phase 2 — Local graph routing demo

**Goal:** Teach routing **logic** on an offline graph (nodes/edges in JSON).

**May include:**

- Client-side Dijkstra/A\* on static graph
- Export/import graph files from operator disk

**Must not include:**

- Real-world road network live feeds
- Turn-by-turn voice driving authority
- Emergency fastest-path claims

---

## Phase 3 — Local encrypted preference vault

**Goal:** Saved places, accessibility prefs, mock “home” — **encrypted at rest on device**.

**Requires before start:**

- Charter for crypto approach (no secrets in repo)
- AMK approval for storage keys handling
- Privacy policy update in receipt

**Must not include:**

- Cloud sync by default
- Account system with server-side location history

---

## Phase 4 — Optional AR prototype

**Goal:** Lab-only augmented preview — **simulation**, not production navigation.

**Requires:**

- Explicit AR charter + 14 DRP review
- No camera/mic background capture without consent UI
- Receipt: `PHASE_AETHERNAV_4_*` (to be authored in phase)

**Default:** **Skip** unless operator requests and approves.

---

## Phase 5 — Governed enterprise integrations

**Goal:** Optional connectors (venues, transit **static** datasets, partner POI) through [Z_XBUS_EXTERNAL_CONNECTOR_GATE.md](../Z_XBUS_EXTERNAL_CONNECTOR_GATE.md).

**Each connector needs:**

- Its own green receipt
- Allowed/forbidden action table
- Rollback plan
- No pricing commitments without commercial charter

---

## Merge queue relative to other lanes

Recommended hub order (operator may adjust):

```text
Operational Technology Layers on main
→ LinguaCore phases per standing queue
→ AetherNav Phase 0 (this pack) — may parallel docs-only with LinguaCore if no file conflict
→ AetherNav Phase 1 after mock discipline proven
→ Mauritius / device walks before live spatial claims
```

**AetherNav Phase 1+ does not block LinguaCore** unless the same PR touches both domains — keep **one domain per PR**.

---

## Rollback

Revert the phase branch commit set; run `npm run verify:md`. Remove catalog/registry rows added in that phase.
