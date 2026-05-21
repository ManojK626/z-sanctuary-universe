# ZCO-5 — Validation Rules (read-only)

**Phase:** ZCO-5 — machine-checkable rules for declared inventory JSON
**Policy:** [ZCO_5_LOCAL_INTAKE_VALIDATOR.md](ZCO_5_LOCAL_INTAKE_VALIDATOR.md)
**Schema:** [ZCO_4_HARDWARE_SCHEMA.md](ZCO_4_HARDWARE_SCHEMA.md)

## Signal semantics

| Signal | Meaning |
| ---------- | ------------------------------------------------------------------------- |
| **GREEN** | Declared inventory structurally valid; no forbidden fields or RED wording |
| **YELLOW** | Clarify optional fields, unknown enums, sparse upgrade context |
| **RED** | Forbidden telemetry/control fields, unsafe topology claims, read failure |

**Exit code:** `npm run z:compute:intake` exits **1** only when `overall_signal` is **RED**.

## Required structure

| Rule | Severity |
| ---------------------------------- | ---------------- |
| Root is object | RED if not |
| `inventory[]` exists and non-empty | RED |
| Each entry has `node_id` | RED |
| Each entry has `role` | RED |
| Each entry has `status` | RED |
| Each entry has `trust_status` | RED |
| `node_id` unique across file | RED on duplicate |

## Recommended (YELLOW if missing)

| Field | Note |
| ------------------------------------------------------------ | ---------------------------------- |
| `label` | Human readability |
| `motherboard` or `cpu` | At least one coarse hardware block |
| `constraints` / `receipts_note` when `upgrade_goals` present | Planning discipline |

## Forbidden JSON keys (RED)

Exact key names (case-insensitive) anywhere in tree:

| Key | Why |
| ----------------------------------------------------- | ------------------------ |
| `telemetry_stream` | Implies live telemetry |
| `live_scan` | Scan forbidden |
| `bios_access` | BIOS forbidden |
| `fan_control` | Hardware control |
| `gpu_overclock` | Hardware control |
| `shell_exec` | Shell forbidden |
| `auto_discovery` | Auto-discovery forbidden |
| `remote_wake` | Remote control |
| `auto_cluster_join` | Autonomous join |
| `live_telemetry` | Live probe claim |
| `wmi_scan` | Scan forbidden |
| `auto_discovered` | Discovery claim |
| `port_scan` / `lan_scan` / `arp_sweep` | Network probe |
| `fan_pwm` | Fan control |
| `remote_exec` / `kubectl_apply` / `scheduler_execute` | Execution |

## Forbidden string patterns (RED)

Scanned in **all string values** (recursive):

| Pattern ID | Examples matched |
| ----------------------- | -------------------------------------- |
| `unified_motherboard` | unified motherboard, fused motherboard |
| `fake_quantum` | fake quantum speedup |
| `orchestration_control` | auto-orchestrate, k8s apply |
| `shell_runtime` | shell exec, bios access |
| `live_telemetry` | live telemetry, auto-discover |
| `unsafe_power` | unsafe power chain, daisy-chain PSU |
| `infinite_scale` | infinite scale |
| `gpu_overclock` | gpu overclock |

## Topology rules

| Rule | Severity |
| -------------------------------------------------------------------------------------- | ---------------------- |
| `federation.unified_motherboard_claim_allowed` must be `false` if `federation` present | RED |
| `power_chain_safe_declared: false` | YELLOW — AMK review |
| `nas_wait: true` with `status: active` | YELLOW — clarify mount |

## Known roles (YELLOW if unknown)

`ai_workstation`, `control_hub`, `compute_worker`, `inference_edge`, `storage_nas`, `network_bridge`, `recycle_dormant`, `backup_standby`, `planned_build`

## Environment

| Variable | Meaning |
| -------------------- | -------------------------------------------------------- |
| `ZCO_INVENTORY_PATH` | Absolute or hub-relative path to operator inventory JSON |
| _(unset)_ | `data/examples/zco_hardware_inventory.example.json` |

## Example fixtures

| File | Expected signal |
| --------------------------------------------- | ------------------- |
| `zco_hardware_inventory.example.json` | GREEN (default run) |
| `zco_hardware_inventory.minimal.example.json` | GREEN |
| `zco_hardware_inventory.invalid.example.json` | RED |

## Locked law

```text
Validator reads JSON only.
Validator ≠ scanner.
RED finding ≠ auto-fix.
AMK-Goku owns sacred moves.
```
