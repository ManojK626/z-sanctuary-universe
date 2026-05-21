# Z-Sanctuary Compute Organism Infrastructure — Architecture (ZCO-1)

**Phase:** ZCO-1 — doctrine, topology, and safety only
**Lane:** `Z-COMPUTE-ORGANISM-1` / **Z-Compute Forge**
**Status:** **no runtime**, **no orchestration**, **no auto-control**

**Builder spine:** [Z_SSWS_AI_TOWER_BUILDER_INSTRUCTIONS.md](Z_SSWS_AI_TOWER_BUILDER_INSTRUCTIONS.md) — read first for Cursor/AI Tower work.

## Purpose

Connect the **compute-organism** vision to the existing Z-Sanctuary stack: **Z-Arelium Shield**, **Z-OMNI**, **Z-OMNISWARM**, **Z-Formulas**, **MiniBots**, **Twin Roots**, **Ghost / Alien backup cores**, and hub governance — as a **governed physical infrastructure layer** for AI-guided hardware, motherboard, NAS, cluster, and upgrade intelligence.

## Standing law (reality check)

We are **not** inventing magical hardware physics. This platform must **never** claim:

| Forbidden claim | Safe replacement |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Random motherboards fuse into one literal unified motherboard | **Distributed compute organism** — clustered nodes with explicit OS boundaries |
| Infinite scaling | **Bounded federation** — manifest-declared nodes only |
| Impossible CPU/RAM fusion | **Workload routing** across separate machines |
| Fake quantum compute | **Symbolic** swarm labels only ([../Z_FORMULA_SWARM_CO_DESIGN_ENGINE.md](../Z_FORMULA_SWARM_CO_DESIGN_ENGINE.md)) |
| Unsafe power chaining | **Operator-declared** power/thermal fields; human wiring discipline |
| AI self-governance without humans | **14 DRP + AMK** sacred authority ([../Z_SWARM_14DRP_UNIVERSAL_AGENT_LAW.md](../Z_SWARM_14DRP_UNIVERSAL_AGENT_LAW.md)) |

**Allowed posture:** distributed compute organism, AI-assisted infrastructure **intelligence** (observe → verify → suggest → human decides), node federation, hardware lifecycle optimization, educational transparency, governed autonomy under Turtle Mode.

Industry alignment (reference only): homelab clusters, edge compute, NAS ecosystems, energy-aware scheduling, composable memory research ([Compute Express Link](https://computeexpresslink.org/)) — **education only** in ZCO-1.

## Authority and hierarchy

When unsure, read [../Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md](../Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md) first.

| Layer | Role in compute organism |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **14 DRP** | Supreme moral law; overrides all formulas |
| **Z-SSWS + AI Tower** | Builder instruction spine ([Z_SSWS_AI_TOWER_BUILDER_INSTRUCTIONS.md](Z_SSWS_AI_TOWER_BUILDER_INSTRUCTIONS.md)) |
| **Z-Super Overseer / Z-EAII** | Operational roof; registry and project identity |
| **Hub (`Z_Sanctuary_Universe`)** | Canonical control root ([../Z_SANCTUARY_CANONICAL_CONTROL_ROOT.md](../Z_SANCTUARY_CANONICAL_CONTROL_ROOT.md)) |
| **Z-Arelium Shield** | Protective nervous system ([Z_ARELIUM_SHIELD_INFRASTRUCTURE_ROLE.md](Z_ARELIUM_SHIELD_INFRASTRUCTURE_ROLE.md)) |
| **Z-OMNISWARM** | Specialized read-only minibots ([Z_OMNISWARM_CLUSTER_MINIBOTS.md](Z_OMNISWARM_CLUSTER_MINIBOTS.md)) |
| **Z-OMNI** | Overseer intelligence — not OS replacement ([../Z_OMNI_VISUAL_WORKSTATION_ENGINE_CHARTER.md](../Z_OMNI_VISUAL_WORKSTATION_ENGINE_CHARTER.md)) |
| **Z-Formula engine** | Optimization vocabulary ([Z_FORMULA_INFRASTRUCTURE_ENGINE.md](Z_FORMULA_INFRASTRUCTURE_ENGINE.md)) |
| **AMK-Goku** | Sacred moves: deploy, merge, power, wiring, purchases, bridges |

```text
Hardware (declared)
  ↓
Node awareness (registry + receipts)
  ↓
Swarm coordination (read-only roles)
  ↓
AI routing (suggest only)
  ↓
Security shields (Arelium boundaries)
  ↓
Distributed memory / storage (declared topology)
  ↓
Z-Formula optimization (advisory scoring)
  ↓
Human governance (14 DRP + Turtle Mode)
```

## Seven architecture layers

| Layer | Name | ZCO-1 posture |
| ----- | ----------------- | ------------------------------------------------------------------------------ |
| **1** | Physical hardware | Operator-declared — `../../data/examples/z_compute_node_registry.example.json` |
| **2** | Node OS | Per-node OS; no fictional unified OS |
| **3** | Z-Arelium Shields | Trust, isolation, health **policy** |
| **4** | Z-OMNISWARM | MiniBots — observe / classify / report |
| **5** | Z-OMNI Overseer | Topology and upgrade **docs** |
| **6** | Z-Formula engine | Fairness, receipts, balance vocabulary |
| **7** | Human governance | 14 DRP, Z-ATE, Turtle Mode PRs |

## Ecosystem connections

| Engine / concept | Compute-organism tie-in |
| ------------------------------ | -------------------------------------------------------------------------------------------------- |
| **Z-Arelium Shield Core** | Cluster trust membrane, quarantine policy |
| **Z-OMNI Architecture** | Observer, verifier, planner, explainer |
| **Z-OMNISWARM ∞** | Federated MiniBot roles |
| **Z-Traffic Minibots** | Hub runway — [../Z_TRAFFIC_MINIBOTS.md](../Z_TRAFFIC_MINIBOTS.md) |
| **Z-Formulas** | Infrastructure fairness — [Z_FORMULA_INFRASTRUCTURE_ENGINE.md](Z_FORMULA_INFRASTRUCTURE_ENGINE.md) |
| **Twin Roots / Ghost / Alien** | Backup doctrine — separate failover charter |
| **Z-ATE** | Trust ladder — [../Z_AUTONOMY_TRUST_ENGINE.md](../Z_AUTONOMY_TRUST_ENGINE.md) |

## Node model

- stable `node_id`, coarse declared hardware, `trust_status`, `organism_role`
- **no** auto-discovery, LAN scan, or silent agent install in ZCO-1

## Swarm and signals

Roles: `../../data/examples/z_compute_swarm_roles.example.json`
Law: [../Z_SWARM_14DRP_UNIVERSAL_AGENT_LAW.md](../Z_SWARM_14DRP_UNIVERSAL_AGENT_LAW.md)

| Signal | Meaning |
| ---------- | ---------------------------------------- |
| **GREEN** | Governance posture pass — **not deploy** |
| **YELLOW** | Caution |
| **BLUE** | AMK decides |
| **RED** | Hold |

## Phase roadmap

| Phase | Deliverable | Execution |
| ------------------ | ------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| **ZCO-1** | Doctrine pack + examples + this receipt | **None** |
| **ZCO-2** (sealed) | `npm run z:compute:organism` → status reports | Observer only — [PHASE_ZCO_2_GREEN_RECEIPT.md](PHASE_ZCO_2_GREEN_RECEIPT.md) |
| **ZCO-3** (sealed) | Read-only dashboard — GET JSON only | [Z_COMPUTE_ORGANISM_DASHBOARD_SYSTEM.md](Z_COMPUTE_ORGANISM_DASHBOARD_SYSTEM.md) |
| **ZCO-4** (sealed) | Hardware intake schema — manual declare only | [ZCO_4_HARDWARE_INTAKE_POLICY.md](ZCO_4_HARDWARE_INTAKE_POLICY.md) |
| **ZCO-5** (sealed) | Local intake validator — `npm run z:compute:intake` | [ZCO_5_LOCAL_INTAKE_VALIDATOR.md](ZCO_5_LOCAL_INTAKE_VALIDATOR.md) |
| **ZCO-6** (sealed) | Upgrade plan draft — `npm run z:compute:upgrade-draft` | [ZCO_6_AI_ASSISTED_UPGRADE_PLAN_DRAFT.md](ZCO_6_AI_ASSISTED_UPGRADE_PLAN_DRAFT.md) |
| **ZCO-7** (sealed) | Dashboard embed — intake + draft GET in cockpit | [ZCO_7_DASHBOARD_INTAKE_DRAFT_EMBED.md](ZCO_7_DASHBOARD_INTAKE_DRAFT_EMBED.md) |
| **ZCO-8** (sealed) | Probe charter doctrine — no runtime | [ZCO_8_PROBE_CHARTER_DOCTRINE.md](ZCO_8_PROBE_CHARTER_DOCTRINE.md) |
| **ZCO-9+** | Consented probe implementation (if ever) | Z-ATE + AMK + new receipt |

## Related artifacts (ZCO-1)

| Artifact | Path |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| Builder spine | [Z_SSWS_AI_TOWER_BUILDER_INSTRUCTIONS.md](Z_SSWS_AI_TOWER_BUILDER_INSTRUCTIONS.md) |
| Arelium | [Z_ARELIUM_SHIELD_INFRASTRUCTURE_ROLE.md](Z_ARELIUM_SHIELD_INFRASTRUCTURE_ROLE.md) |
| OMNISWARM | [Z_OMNISWARM_CLUSTER_MINIBOTS.md](Z_OMNISWARM_CLUSTER_MINIBOTS.md) |
| Formulas | [Z_FORMULA_INFRASTRUCTURE_ENGINE.md](Z_FORMULA_INFRASTRUCTURE_ENGINE.md) |
| Node example | `../../data/examples/z_compute_node_registry.example.json` |
| Swarm example | `../../data/examples/z_compute_swarm_roles.example.json` |
| Receipt (ZCO-1) | [PHASE_ZCO_1_GREEN_RECEIPT.md](PHASE_ZCO_1_GREEN_RECEIPT.md) |
| Status observer (ZCO-2) | `npm run z:compute:organism` — [PHASE_ZCO_2_GREEN_RECEIPT.md](PHASE_ZCO_2_GREEN_RECEIPT.md) |
| Dashboard (ZCO-3) | `dashboard/panels/z-compute-organism-dashboard-readonly.html` — [PHASE_ZCO_3_GREEN_RECEIPT.md](PHASE_ZCO_3_GREEN_RECEIPT.md) |
| Hardware intake (ZCO-4) | [ZCO_4_HARDWARE_SCHEMA.md](ZCO_4_HARDWARE_SCHEMA.md) — `data/examples/zco_hardware_inventory.example.json` |
| Intake validator (ZCO-5) | `npm run z:compute:intake` — [PHASE_ZCO_5_GREEN_RECEIPT.md](PHASE_ZCO_5_GREEN_RECEIPT.md) |
| Upgrade draft (ZCO-6) | `npm run z:compute:upgrade-draft` — [PHASE_ZCO_6_GREEN_RECEIPT.md](PHASE_ZCO_6_GREEN_RECEIPT.md) |
| Dashboard embed (ZCO-7) | `dashboard/panels/z-compute-organism-dashboard-readonly.html` — [PHASE_ZCO_7_GREEN_RECEIPT.md](PHASE_ZCO_7_GREEN_RECEIPT.md) |
| Probe charter (ZCO-8) | [ZCO_8_PROBE_CHARTER_DOCTRINE.md](ZCO_8_PROBE_CHARTER_DOCTRINE.md) — [PHASE_ZCO_8_GREEN_RECEIPT.md](PHASE_ZCO_8_GREEN_RECEIPT.md) |

## Locked law

```text
Compute organism ≠ autonomous datacenter.
Node registry ≠ live inventory scan.
Swarm role ≠ running process.
Formula score ≠ permission to act.
Readiness ≠ deploy.
AMK-Goku owns sacred moves.
```
