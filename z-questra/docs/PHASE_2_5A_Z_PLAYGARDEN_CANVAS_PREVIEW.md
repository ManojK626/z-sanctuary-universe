# Phase 2.5A — Z PlayGarden Canvas Preview

## Purpose

Z PlayGarden is a **local-only** entertainment and learning surface inside Z-QUESTRA. It celebrates comfort, notes, zebras, and guardian posture with **Canvas 2D + SVG** previews — no external game engine, no 3D pipeline in this slice.

## Scope (this phase)

| In scope | Out of scope |
| -------- | ------------ |
| SVG + Canvas 2D visuals | Realtime multiplayer |
| Badge previews (non-monetary) | Payments, loot boxes, gambling |
| Route explorer labels | Live Z-Sanctuary bridge |
| Notebook page count hint from app state | Cloud sync, accounts, analytics APIs |
| Reduced motion / photophobia softening | Heavy 3D, external WASM engines |

## Files

| Path | Role |
| ---- | ---- |
| `src/components/ZPlayGardenPanel.jsx` | Shell, safety copy, layout |
| `src/components/ZCanvasGarden.jsx` | Star canvas + SVG orbit “planets” |
| `src/components/ZBadgeStudio.jsx` | Five badge preview cards |
| `src/theme/playGardenTokens.js` | Badge list, motion/glow helpers |
| `src/game/playGardenMap.js` | Route explorer data |

## Notebook linkage

`App` passes `notebookPageCount` from `LocalNotebookPanel` so the garden reflects **how many notebook pages** exist (clamped visually). No extra persistence layer.

## Route metadata

`SanctuaryRouteMap` includes `play-garden` / `questra.playgarden.local` as **frontend metadata only** — same “local_only” posture as other panels.

## Related docs

- [Z_PLAYGARDEN_SAFETY_POLICY.md](./Z_PLAYGARDEN_SAFETY_POLICY.md)
- [PHASE_2_5A_GREEN_RECEIPT.md](./PHASE_2_5A_GREEN_RECEIPT.md)
