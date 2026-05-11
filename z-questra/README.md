# Z-QUESTRA

Local workstation UI — **Phase 2.3 / 2.3B**: living color, Visual Structure flow, **AT Love Zebra / Z-Zebras Family** inspector (Comfort Zone), optional device memory, Sanctuary route metadata — **readiness language only**, no certification claims.

## Rules (this phase)

- No backend, auth, shared storage, LLM calls, hub APIs, analytics, or live Z-Sanctuary coupling.
- **Optional “Remember on this device”** uses **browser `localStorage` only** (age mode + Comfort bar). Uncheck to clear. Not synced to the hub.
- `sanctuaryRouteMap.js` is **metadata only** for future bridges.

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview   # serve production build locally (default http://127.0.0.1:4173)
npm test
```

Open the dev server URL from Vite (default `http://127.0.0.1:5173`).

### Hub static server (5502)

After `npm run build`, with the hub served from repo root (e.g. port 5502), you can open:

`http://127.0.0.1:5502/z-questra/dist/index.html`

## Docs

See `docs/` — Phase 2.1 accessibility / route readiness; Phase 2.3 (`PHASE_2_3_*`, `VISUAL_STRUCTURE_PANEL_POLICY.md`); **Phase 2.3B** (`PHASE_2_3B_AT_LOVE_ZEBRA_Z_ZEBRAS_FAMILY.md`, `Z_ZEBRAS_FAMILY_SERVICE_POLICY.md`, `PHASE_2_3B_GREEN_RECEIPT.md`).

### Cross-project access (QX-1)

Hub operators discover Z-QUESTRA via **`data/z_questra_capability_manifest.json`** (reference-only bridge posture) and:

- [docs/Z_QUESTRA_PORTABILITY_AND_BRIDGE_POLICY.md](docs/Z_QUESTRA_PORTABILITY_AND_BRIDGE_POLICY.md)
- [docs/Z_QUESTRA_UNIVERSAL_ACCESS_ROADMAP.md](docs/Z_QUESTRA_UNIVERSAL_ACCESS_ROADMAP.md)
- [docs/Z_VISUAL_INTERACTION_LANGUAGE.md](docs/Z_VISUAL_INTERACTION_LANGUAGE.md)
- [docs/PHASE_QX_1_CROSS_PROJECT_ACCESS_GREEN_RECEIPT.md](docs/PHASE_QX_1_CROSS_PROJECT_ACCESS_GREEN_RECEIPT.md)
