# ZCO-4 — Hardware Inventory Intake Policy

**Phase:** ZCO-4 — manual-entry / observe-only / **no scanning**
**Parent:** [Z_COMPUTE_ORGANISM_ARCHITECTURE.md](Z_COMPUTE_ORGANISM_ARCHITECTURE.md)
**Schema:** [ZCO_4_HARDWARE_SCHEMA.md](ZCO_4_HARDWARE_SCHEMA.md)
**Planning:** [ZCO_4_UPGRADE_PLANNING_GUIDE.md](ZCO_4_UPGRADE_PLANNING_GUIDE.md)

## Purpose

Govern how operators **manually describe** hardware so the compute organism learns:

- what hardware exists (declared, not probed)
- what role each asset serves
- what can be upgraded, is dormant, risky, or reusable
- which sanctuary lane owns the asset

ZCO-4 is the **intake bridge** between human knowledge and ZCO-1–3 awareness — **without touching machines**.

## Standing law (mandatory)

### ZCO-4 MUST NOT

| Forbidden | Reason |
| -------------------------------------------------- | ------------------------- |
| Scan hardware (LAN, WMI, SMB, SNMP auto-inventory) | No silent discovery |
| Execute shell commands from intake | No remote control |
| Access BIOS / firmware | Human-only |
| Install drivers | Human-only |
| Auto-benchmark or stress test | No undeclared load |
| Control fans, clocks, voltages | No hardware control plane |
| Open network ports or probe routers | No scan |
| Claim **live telemetry** | Declared fields only |

### ZCO-4 MUST

| Required | Meaning |
| --------------------------- | --------------------------------------------- |
| User-declared inventory | Operator types or imports **their** truth |
| Explainability | Every risky field has human-readable notes |
| Planning vocabulary | Upgrade paths, budgets, goals as **declared** |
| Architecture guidance | Docs + schema — not execution |
| Sanctuary compute awareness | Links to Z-Arelium, OMNISWARM, 14 DRP |

```text
Declared inventory ≠ live inventory.
Intake schema ≠ orchestration.
Upgrade suggestion ≠ purchase order.
BLUE → AMK for power, wiring, spend, deploy.
```

## What operators may declare

| Category | Examples (coarse strings OK) |
| ------------------- | ------------------------------------------- |
| **Nodes / PCs** | Workstation, server, SBC |
| **Motherboards** | Vendor, model, socket, form factor |
| **CPU / RAM / GPU** | Model, capacity — no serials required |
| **Storage** | NVMe, SATA, NAS bays, capacity |
| **NAS** | Device role, mount posture, NAS_WAIT |
| **UPS** | VA tier, runtime notes |
| **Network** | Switch, router, link speed (declared) |
| **Cooling** | Airflow notes, radiator size, case class |
| **Monitors** | Count, resolution tier (optional) |
| **Workloads** | AI, dev, media, storage, edge |
| **Goals** | Business, creative, research, sanctuary hub |
| **Constraints** | Power, budget, thermal, space |
| **Lifecycle** | active, dormant, recycle_candidate |

## Relationship to ZCO-1–3

| Phase | ZCO-4 relationship |
| --------- | ----------------------------------------------------------------------------- |
| **ZCO-1** | Coarse `z_compute_node_registry.example.json` — federation roles |
| **ZCO-2** | Status observer validates **examples** — not operator inventory files |
| **ZCO-3** | Dashboard shows rollup — not live hardware poll |
| **ZCO-4** | **Rich intake schema** — copy to **local gitignored** manifest when chartered |

Operators may map `node_id` in intake to `node_id` in node registry — IDs must match **by operator choice**, not hub scan.

## Z-Arelium Shield (intake layer)

| Area | ZCO-4 meaning |
| ---------------------- | ------------------------------------------------------- |
| **Hardware trust** | known vs provisional vs unknown nodes |
| **Upgrade safety** | PSU watt declared vs GPU/CPU tier |
| **Thermal posture** | cooling notes + airflow — planning only |
| **Power integrity** | overload **warnings** from declared math, not live draw |
| **Cluster boundaries** | safe federation — no unified-motherboard claim |
| **Recovery planning** | NAS, UPS, backup role fields |

See [Z_ARELIUM_SHIELD_INFRASTRUCTURE_ROLE.md](Z_ARELIUM_SHIELD_INFRASTRUCTURE_ROLE.md).

## OMNISWARM expansion (ZCO-4 advisory roles)

| MiniBot | Role (advisory only) |
| -------------- | -------------------------------------------- |
| **IntakeBot** | Validates declared inventory shape vs schema |
| **UpgradeBot** | Staged upgrade suggestions — AMK for buys |
| **RecycleBot** | Dormant hardware revival checklist |
| **PowerBot** | Unsafe PSU combination **narrative** flags |
| **CoolingBot** | Airflow and thermal planning hints |
| **NASBot** | Storage strategy and NAS_WAIT respect |
| **ClusterBot** | Node role and federation planning |
| **BudgetBot** | Phased affordability path — no payments |
| **ExplainBot** | Teaches hardware concepts |

Still: **no auto-action**, **no purchases**, **no control plane**. Extends [Z_OMNISWARM_CLUSTER_MINIBOTS.md](Z_OMNISWARM_CLUSTER_MINIBOTS.md).

## Example artifacts (committed)

| File | Role |
| --------------------------------------------------- | -------------------------------- |
| `data/examples/zco_hardware_inventory.example.json` | Single-site inventory sample |
| `data/examples/zco_multi_node_cluster.example.json` | Federation / cluster plan sample |
| `data/examples/zco_upgrade_path.example.json` | Staged upgrade path sample |

**EXAMPLE ONLY** — copy to operator-local path (e.g. `data/local/zco_hardware_inventory.json` gitignored) when a future phase charters personal inventory.

## Signals (intake review)

| Signal | When |
| ---------- | ------------------------------------------------------------------------ |
| **GREEN** | Schema-valid, trust declared, no forbidden claims |
| **YELLOW** | Missing optional cooling/PSU notes |
| **BLUE** | Major upgrade, new node, power topology change |
| **RED** | Unified-motherboard claim, unsafe power chain narrative, secrets in file |

## Locked law

```text
ZCO-4 teaches the organism what humans declare — not what machines hide.
Intake ≠ scan.
Arelium classifies; AMK decides.
```
