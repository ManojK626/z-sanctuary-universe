# Zuno Stack Placement

**Law:** One AI Core · Many Platforms

## Zuno roles in VILE

| Role | Today | Target |
| ---- | ----- | ------ |
| **Observer** | `npm run zuno:snapshot`, state reports | Ecosystem truth compression |
| **Contracts** | `packages/zuno-orchestrator-contracts` | Request, task plan, DRP decision, verification result types |
| **Orchestrator runtime** | **CLOSED** — contracts only | Routes agent swarm; no direct agent mesh |
| **Knowledge** | Hub docs + ZILWA exhibits | `zuno-knowledge` package (future) |

## Placement in stack

```text
Z-Sanctuary Universe (governance roof)
    │
    ├── Zuno Core ─────────── observe · snapshot · policy JSON
    │
    ├── Universal Orchestrator ─── single entry for all agent work
    │         │
    │         └── Agent Swarm (planner, logistics, culture, …)
    │
    └── VILE Platform ─────────── travel · marketplace · emergency
              │
              └── App surfaces (traveller, vendor, …)
```

## What Zuno is not

- Not a replacement for AMK human gate on sacred moves  
- Not an always-on daemon (unless explicitly chartered and verified)  
- Not duplicated per app (`apps/traveller` must not embed its own orchestrator)  

## Integration points (existing hub)

| Hub asset | VILE use |
| --------- | -------- |
| `data/zuno_state_snapshot.json` | Builder context ritual |
| `packages/zuno-orchestrator-contracts` | Phase 2 code starts here |
| `docs/Z_SWARM_14DRP_UNIVERSAL_AGENT_LAW.md` | DRP authority |
| Cycle observe queue | Suggest-only — no auto-execute |

## Package naming

Target shared packages live under `packages/zuno-*`. See [PACKAGE_CATALOG.md](PACKAGE_CATALOG.md) for planned vs existing.
