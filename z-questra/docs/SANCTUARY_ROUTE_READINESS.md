# Sanctuary route readiness (metadata only)

## Intent

Z-QUESTRA carries **Sanctuary-shaped identifiers** so a future, explicitly chartered bridge can map panels to hub surfaces — **without** opening network calls today.

## Source of truth

File: `src/theme/sanctuaryRouteMap.js`

| Field | Meaning |
| -------------- | -------------------------------- |
| `localApp` | Application id (`z-questra`) |
| `bridgeStatus` | `not_connected` — no live bridge |
| `posture` | `frontend_metadata_only` |
| `routes[]` | Per-panel metadata |

## Per-route fields

| Field | Example |
| ------------------- | ------------------------------------------------ |
| `panelId` | `zuno-guide` |
| `routeKey` | `zuno.guide.local` |
| `sanctuaryFamily` | `zuno_guidance`, `education`, … |
| `guardianLevel` | `standard`, `age_mode_filtered`, … |
| `ageModes` | Which age themes apply |
| `accessibilityRole` | `region` / `main` |
| `futureBridge` | String hint only (e.g. `z-sanctuary/zuno-guide`) |
| `status` | `local_only` |

## Panel wiring

`PanelFrame` reads metadata via `getRouteMeta(panelId)` and exposes `data-*` attributes for debugging and future adapters.

## Explicit non-goals

No fetch to Z-Sanctuary, no shared memory, no MAOS, no orchestrator execution.
