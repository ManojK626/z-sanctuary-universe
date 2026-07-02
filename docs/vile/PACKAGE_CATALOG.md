# VILE Package Catalog

**Location:** `packages/` (monorepo)  
**Posture:** Planned catalog · implement per phase charter only

**Phase 1.5 schemas (source of truth until 2A):** [platform-contracts/schemas/v1/](platform-contracts/schemas/v1/)

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
| `zuno-security` | PLANNED — **Phase 2A** | Zero trust helpers, RBAC, audit |
| `zuno-drp` | PLANNED — **Phase 2A** | 14 DRP middleware + decision records |
| `zuno-shadow` | PLANNED — **Phase 2A** | Shadow validation pipeline |
| `zuno-observability` | **EXISTS** — Phase 2A Pkg 1 | Logging, metrics, tracing interfaces — `@z-sanctuary/zuno-observability` |
| `zuno-verification` | PLANNED — Phase 2A+ | Schema + policy verification |
| `zuno-identity` | PLANNED — Phase 2B+ | Identity abstraction — no duplicate auth per app |
| `zuno-knowledge` | PLANNED — Phase 2B+ | RAG / steward knowledge boundaries |
| `zuno-ai` | PLANNED — Phase 3 | Provider adapters — no vendor lock-in prompts |
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
