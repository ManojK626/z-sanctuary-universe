# VILE Package Catalog

**Location:** `packages/` (monorepo)  
**Posture:** Planned catalog · implement per phase charter only

## Status legend

| Status | Meaning |
| ------ | ------- |
| **EXISTS** | On disk in hub today |
| **PLANNED** | Documented; no implementation without charter |
| **HOLD** | Sacred or high-governance — AMK gate |

## Core packages

| Package | Status | Responsibility |
| ------- | ------ | -------------- |
| `zuno-core` | PLANNED (partial: `z-sanctuary-core`) | Shared types, hub loaders, formula refs |
| `zuno-orchestrator` | PLANNED (contracts: **EXISTS**) | Task routing, agent dispatch |
| `zuno-security` | PLANNED | Zero trust helpers, RBAC, audit |
| `zuno-drp` | PLANNED | 14 DRP middleware + decision records |
| `zuno-shadow` | PLANNED | Shadow validation pipeline |
| `zuno-verification` | PLANNED | Schema + policy verification |
| `zuno-identity` | PLANNED | Identity abstraction — no duplicate auth per app |
| `zuno-observability` | PLANNED | Logging, metrics, tracing interfaces |
| `zuno-knowledge` | PLANNED | RAG / steward knowledge boundaries |
| `zuno-ai` | PLANNED | Provider adapters — no vendor lock-in prompts |
| `zuno-payments` | **HOLD** | Provider interfaces only — see payment doc |
| `zuno-health` | **HOLD** | Medical guidance boundaries — human + compliance |
| `zuno-travel` | PLANNED | Destinations, itineraries, offline bundles |

## Existing hub packages (reuse, do not duplicate)

| Package | Notes |
| ------- | ----- |
| `packages/zuno-orchestrator-contracts` | TypeScript contracts + examples — **extend, don't fork** |
| `packages/z-sanctuary-core` | AI metadata JSON loaders |
| `packages/z-sanctuary-mirrorsoul-slice` | Privacy-gated slice — not VILE product |
| `packages/z-sanctuary-zuno-transformation-slice` | Flow tests — reference patterns |

## Package requirements (when implemented)

Each package must ship:

- `README.md`  
- Architecture section (or link to `docs/vile/`)  
- Public API surface (typed exports)  
- Unit tests  
- DRP middleware hook points  
- No hardcoded secrets  

## Do not create

- `traveller-auth`, `vendor-auth` — use `zuno-identity`  
- `vile-drp-engine` — use `zuno-drp`  
- Per-agent security copies — use `zuno-security` + `zuno-shadow`  
