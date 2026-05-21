# Z-OMNISWARM ∞ — Cluster MiniBots (ZCO-1)

**Phase:** ZCO-1 — role definitions only
**Parent:** [Z_COMPUTE_ORGANISM_ARCHITECTURE.md](Z_COMPUTE_ORGANISM_ARCHITECTURE.md)
**Law:** [../Z_SWARM_14DRP_UNIVERSAL_AGENT_LAW.md](../Z_SWARM_14DRP_UNIVERSAL_AGENT_LAW.md)
**Registry:** `../../data/examples/z_compute_swarm_roles.example.json`

## Purpose

**Specialized MiniBots** for federated compute — **observer / planner / explainer first**, not executors. Z-OMNISWARM is a **role registry**, not one giant AI.

## Universal constraints

From [../Z_TRAFFIC_MINIBOTS.md](../Z_TRAFFIC_MINIBOTS.md) and `../../data/z_swarm_14drp_agent_law_registry.json`:

- Declared metadata and approved reports only
- No deploy, merge, provider calls, LAN scan, silent agents
- **GREEN ≠ deploy** · **BLUE → AMK** · **RED → hold**

## Cluster MiniBot roster

| MiniBot | Role |
| --------------- | ------------------------------------------ |
| **ThermalBot** | Heat advisory |
| **PowerBot** | PSU/load; flags unsafe chaining **claims** |
| **MemoryBot** | RAM balance advisory |
| **StorageBot** | NAS health; respects NAS_WAIT |
| **UpgradeBot** | Upgrade planning — AMK for buys/installs |
| **SecurityBot** | Arelium trust checks |
| **ClusterBot** | Federation topology vocabulary |
| **LinkBot** | Declared network topology |
| **CostBot** | Efficiency hints — no billing |
| **RecycleBot** | Dormant hardware reuse |
| **ExplainBot** | Operator education |
| **GuardianBot** | 14 DRP guard |

## Swarm Chief (conceptual, ZCO-1)

```text
Specialist MiniBots → Swarm Chief rollup → Arelium Shield → AMK gate
                              (read-only)
```

## Hub towers (complement, not replace)

| Tower | Command / doc |
| ------------------- | -------------------------------- |
| **Z-Traffic** | `npm run z:traffic` |
| **Z-SWARM-14DRP** | `npm run z:swarm:14drp` |
| **Z-Cycle Observe** | Queue generate only — no execute |

## Operator flow (manual)

1. Study `../../data/examples/z_compute_node_registry.example.json`
2. Copy to local manifest when chartered (prefer gitignored)
3. New node or upgrade → **BLUE** until AMK decides
4. Run `npm run z:traffic` before widening lanes

## Forbidden narratives

- unified motherboard fusion
- infinite scale
- fake quantum speedup
- autonomous self-healing without charter

## ZCO-4 intake expansion (advisory roles)

Documented in [ZCO_4_HARDWARE_INTAKE_POLICY.md](ZCO_4_HARDWARE_INTAKE_POLICY.md):

| MiniBot | Role |
| -------------- | ------------------------------------------------ |
| **IntakeBot** | Schema validation for declared inventory |
| **CoolingBot** | Airflow guidance (extends ThermalBot vocabulary) |
| **NASBot** | NAS strategy and NAS_WAIT |
| **BudgetBot** | Phased affordability — no payments |

Existing MiniBots (UpgradeBot, RecycleBot, PowerBot, ClusterBot, ExplainBot) apply to intake fields.

## Locked law

```text
OMNISWARM ∞ = cooperating validators, not one god-agent.
MiniBot suggestion ≠ permission.
```
