# AetherNav — Z-Sanctuary Integration Map

**Status:** Phase 0 — **future connection points only**. No registry writes, dashboard assets, or runtime bridges in this phase.

---

## Hub placement

| Layer | AetherNav relationship |
| --------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Z-Sanctuary Universe (hub)** | Canonical docs live in `docs/aethernav/`; module manifest entry **deferred** until Phase 1 receipt |
| **Hierarchy Chief** | Spatial features are **visibility / guidance** — not operational authority |
| **Z-EAII / Monster registry** | Optional future `aethernav` row after Phase 1 mock; not Phase 0 |
| **Operational technology layers** | Map tooling layers on hub; AetherNav does not replace PC/NAS governance |

---

## Separate lane vs LinguaCore

```text
LinguaCore  = language / culture / phrase surfaces
AetherNav   = space / orientation / route posture (mock-first)
```

**Future bridge (Phase 2+ only, chartered):**

- Shared **tourism** copy keys (place names + phrase hints) via read-only JSON references — no merged codebase.
- **No** shared runtime, auth, or user profile store by default.

---

## Future dashboard surfaces (not built in Phase 0)

| Surface | Intended role | Phase |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------- | ----- |
| [Z_UNIVERSE_WORKSTATION_NAVIGATOR.md](../dashboard/Z_UNIVERSE_WORKSTATION_NAVIGATOR.md) (NAV-1) | Read-only catalog row linking to AetherNav mock cockpit | 1+ |
| `dashboard/Html/index-skk-rkpk.html` | Optional link chip to static map cockpit | 1+ |
| `dashboard/Html/amk-goku-main-control.html` | Operator visibility link (no execution) | 1+ |
| `dashboard/data/z_universe_service_catalog.json` | Service metadata + doc links only | 1+ |
| `data/z_mdg_dashboard_registry.json` | MDGEV registry row when mock exists | 1+ |
| Z-Cycle dashboard | **No** control plane; receipts only | — |

**Rule:** NAV-1 and AMK dashboards remain **GET / visibility** — AetherNav must not add execute buttons, APIs, or cloud memory from catalog rows.

---

## Sibling and thematic lanes

| Lane | Connection | Phase 0 |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| **LinguaCore** | Optional label/phrase overlays for places; separate repo folder and branch prefix | Doc pointer only |
| **Tourism / Mauritius civic** | [Z_MAURITIANS_UNITE_CIVIC_TRUTH_ENGINE.md](../Z_MAURITIANS_UNITE_CIVIC_TRUTH_ENGINE.md), travel learning gates in OTL | No live map data |
| **Accessibility** | [Z_UNIVERSAL_INTERACTION_LANGUAGE.md](../design/Z_UNIVERSAL_INTERACTION_LANGUAGE.md), Z-VIL photophobia/motion discipline | Mock UI must honor UIL/VIL in Phase 1+ |
| **AT Princess & Blackie** | Warm companion framing; `AT_Princess_Blackie_Franed` in module distributor registry — **emotional support ≠ navigation authority** | Boundary doc only |
| **Z-QUESTRA** | Exploration/wonder ethos; reference-only catalog bridge policy | No cross-runtime |
| **Z-ADTF** | Federation **topology** awareness after real device walks; not AetherNav GPS | Park until OTL queue |

---

## AT Princess & Blackie — boundary

- Princess / Blackie guardians provide **comfort and rhythm** language — not turn-by-turn emergency commands.
- Any future “gentle nudge” copy in AetherNav mock UI must avoid clinical, coercive, or child-surveillance framing.
- Product boundary: [design/Z_UNIVERSAL_INTERACTION_LANGUAGE.md](../design/Z_UNIVERSAL_INTERACTION_LANGUAGE.md) (AT Princess & Blackie row).

---

## Satellite projects

Satellites keep **`docs/Z_SANCTUARY_CONTROL_LINK.md`** only. AetherNav doctrine stays in the **hub** unless a chartered satellite phase is approved.

**Do not** sync long AetherNav policy into sibling repos in Phase 0.

---

## Verification hooks (future)

| Command | When |
| ----------------------------------- | ----------------------------------- |
| `npm run verify:md` | Every docs/mock phase |
| `npm run dashboard:registry-verify` | After Phase 1 registry/catalog rows |
| `npm run z:monster:registry-verify` | If Monster Project row added |

Phase 0: **`npm run verify:md` only**.
