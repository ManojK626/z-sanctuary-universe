# Z-Sanctuary Universal Workstation Navigator (NAV-1)

## Purpose

The **Universal Workstation Navigator** is a **read-only** cockpit on the main unified dashboard (`dashboard/Html/index-skk-rkpk.html`). It links major hubs — Zuno audit spine, Z-CAR², AI Builder context, orchestration contracts, Z-QUESTRA, governance indexes, MAOS charter, and receipt/visual lanes — **without** executing workflows, calling APIs, or enabling cloud memory.

## UI

| Surface | Behavior |
| ------------ | -------------------------------------------------------------------------------------------------------------- |
| Left rail | Collapsible category strip (icons + labels when expanded) |
| Service rows | Metadata pill + name; click opens detail |
| Right panel | Purpose, safety, bridge/memory posture, DRP gate, workflow map, allowed vs forbidden actions, doc/report links |
| Links | `target="_blank"` markdown / JSON under repo root only |

## Data

| File | Role |
| ---------------------------------------------------- | --------------------------------------------------------------- |
| `dashboard/data/z_universe_service_catalog.json` | Categories + services (`schema: z_universe_service_catalog_v1`) |
| `dashboard/scripts/z-universe-service-map.js` | Accent map + catalog URL |
| `dashboard/scripts/z-universe-navigator-readonly.js` | Fetch, render, keyboard (Escape closes panel) |

## Serving

`fetch()` requires HTTP(S). From hub root:

```bash
npx http-server . -p 5502
```

Open `http://127.0.0.1:5502/dashboard/Html/index-skk-rkpk.html`.

**Shadow workbench (same navigator, iteration copy):** `http://127.0.0.1:5502/dashboard/Html/shadow/index-skk-rkpk.workbench.html` — see `dashboard/Html/shadow/README.md`.

## Related policy & receipt

- [Z_UNIVERSE_SERVICE_CATALOG_POLICY.md](./Z_UNIVERSE_SERVICE_CATALOG_POLICY.md)
- [Z_UNIVERSE_NAVIGATOR_GREEN_RECEIPT.md](./Z_UNIVERSE_NAVIGATOR_GREEN_RECEIPT.md)
- **Z-QUESTRA QX-1:** canonical capability manifest `z-questra/data/z_questra_capability_manifest.json` — hub catalog row `z_questra_workstation` mirrors capabilities and reuse gates for discoverability only (reference-only bridge).
- **ZSX-1B — Cross-project sync visibility:** catalog row `zsx_cross_project_sync` (**Cross-project bridges** rail) links the three ZSX JSON artifacts under `data/` plus `docs/cross-project/` policy docs — metadata only; no execution buttons.
- **ZMV-1A — Magical Visual Bridge:** catalog row `zmv_magical_visual_bridge` (**Magical Visual Bridge** rail) links `data/z_magical_visual_capability_registry.json` and cross-project policy docs — presentation lineage only; no ÉirMind SKU, entitlement, or live service merge.
- **ZMV-1B — Living Ecosphere Map:** catalog row `zmv_ecosphere_map_readonly` (**Overview**) and page `dashboard/Html/z-universe-ecosphere-map.html` — fetch-only visualization of catalogs (serve hub root); see [Z_SANCTUARY_LIVING_ECOSPHERE_MAP.md](./Z_SANCTUARY_LIVING_ECOSPHERE_MAP.md).
- **ZMV-1C — Header deep-link:** `dashboard/Html/index-skk-rkpk.html` header contains an anchor **Living Ecosphere Map** → `./z-universe-ecosphere-map.html` (read-only navigation).

## NAV-2 — Operator law pointers (sibling repos)

NAV-1 is **implemented only** in **ZSanctuary_Universe** (this hub). Other projects in the ecosystem should:

- **Treat the hub navigator as the canonical cockpit** for seeing services and doc/report paths — not as something they inherit at runtime.
- **Copy discipline, not code**, unless a charter explicitly merges UI: add a short paragraph in their operator docs matching **visibility without act capability**; link here or to [Z_UNIVERSE_SERVICE_CATALOG_POLICY.md](./Z_UNIVERSE_SERVICE_CATALOG_POLICY.md).
- **Assume no live bridge** until **charter + 14 DRP gate** (same rule as XL2 / cross-project policy).

Hub pointers: [AGENTS.md](../../AGENTS.md), [docs/z-cursor-ops/README.md](../z-cursor-ops/README.md), [docs/AI_BUILDER_CONTEXT.md](../AI_BUILDER_CONTEXT.md).
