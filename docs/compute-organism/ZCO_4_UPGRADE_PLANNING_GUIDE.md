# ZCO-4 — Upgrade Planning Guide (manual / observe-only)

**Phase:** ZCO-4 — planning doctrine only
**Policy:** [ZCO_4_HARDWARE_INTAKE_POLICY.md](ZCO_4_HARDWARE_INTAKE_POLICY.md)
**Schema:** [ZCO_4_HARDWARE_SCHEMA.md](ZCO_4_HARDWARE_SCHEMA.md)
**Example path:** `data/examples/zco_upgrade_path.example.json`

## Purpose

Help operators turn **declared inventory** into **staged, safe, affordable upgrade pathways** — with Z-Arelium shield checks and OMNISWARM MiniBot **vocabulary** — without auto-purchasing, auto-installing, or live benchmarks.

## Who decides

| Move | Authority |
| ------------------------------- | --------------------------------- |
| Document inventory | Operator |
| Suggest staged plan | UpgradeBot / BudgetBot (advisory) |
| Approve spend, wiring, power | **AMK** (**BLUE**) |
| Install drivers, BIOS, hardware | **Human** only |
| Deploy or orchestrate | **Forbidden** without charter |

## Planning workflow (recommended)

```text
1. Copy zco_hardware_inventory.example.json → local gitignored manifest
2. Fill nodes honestly (coarse strings OK)
3. Run npm run z:compute:organism (hub posture — ZCO-2)
4. Run npm run z:compute:intake then npm run z:compute:upgrade-draft (ZCO-5/6 advisory)
5. Draft or refine upgrade path JSON (see zco_upgrade_path.example.json)
6. Review with Arelium concerns: PSU, cooling, NAS_WAIT, trust
7. AMK gate on any BLUE phase before purchase or power-on dormant gear
8. Record Z-Δ style change notes externally or in receipts_note
```

## Upgrade dimensions (checklist)

| Dimension | Declared fields | Arelium / MiniBot |
| ------------------ | --------------------------- | ----------------------------------------- |
| **CPU / platform** | cpu, motherboard socket | UpgradeBot — BLUE for platform change |
| **RAM** | capacity_gb, ddr_generation | MemoryBot — mismatch vs workload |
| **GPU** | gpu[], power_w_declared | PowerBot + ThermalBot |
| **Storage** | storage[], NAS | NASBot, StorageBot |
| **Power** | psu_w_declared, ups | PowerBot — RED on unsafe chain **claims** |
| **Cooling** | cooling.\* | CoolingBot / ThermalBot |
| **Network** | network.\* | LinkBot — declared topology only |
| **Budget** | constraints.budget_tier | BudgetBot — phased tiers only |

## Phased upgrade pattern

Use `phases[]` in upgrade path JSON:

| Phase label | Typical content | Signal |
| ------------ | ---------------------------------------------- | ---------------------- |
| **assess** | Verify PSU, airflow, backups | GREEN/YELLOW |
| **prepare** | NAS mount verify, UPS test (human) | BLUE if NAS_WAIT |
| **acquire** | Purchase list — AMK approves | BLUE |
| **install** | Physical install — human only | BLUE |
| **validate** | Run hub verify commands — not auto from intake | GREEN when evidence ok |

**Never** skip AMK gate on power topology or dormant revival.

## Dormant and recycle

| Status | Guidance |
| ------------------- | -------------------------------------------------- |
| `dormant` | RecycleBot checklist — no auto power-on |
| `recycle_candidate` | Document reuse intent; thermal and PSU audit first |
| `planned` | ClusterBot role assignment before buy |

## Multi-node clusters

Use `zco_multi_node_cluster.example.json`:

- Assign **one OS per node** — federation only
- Mark inference vs storage vs hub explicitly
- List `nas_wait_nodes` until operator confirms mount

## Budget reality (BudgetBot)

Declare `budget_tier`: `minimal`, `medium`, `comfortable`, `stretch` — **not** exact currency in committed repo examples unless operator chooses local files.

BudgetBot suggests **order** of phases, not payment execution.

## Business / creative / research goals

Map `declared_goals` to workload fit:

| Goal type | Planning hint |
| ----------------- | ------------------------------------------------------------- |
| **Sanctuary hub** | control_hub role, trusted, hub verify discipline |
| **AI workloads** | GPU power + cooling + RAM; edge vs workstation split |
| **Media** | Storage bandwidth, GPU VRAM declared |
| **Research** | Document reproducibility in receipts_note — no fake telemetry |

## What success looks like (ZCO-4)

- Operator can explain their lab without opening dangerous tools
- Upgrade path is **readable by AMK** in one sitting
- Organism docs reference same `node_id` across inventory, cluster, and node registry
- No claim that sanctuary **controls** hardware

## Locked law

```text
Upgrade plan ≠ executed upgrade.
Budget tier ≠ payment.
Recycle suggestion ≠ power on.
AMK-Goku owns sacred moves.
```
