# ZCO-4 — Hardware Inventory Intake Schema

**Phase:** ZCO-4 — machine-readable vocabulary (examples only in repo)
**Policy:** [ZCO_4_HARDWARE_INTAKE_POLICY.md](ZCO_4_HARDWARE_INTAKE_POLICY.md)
**Example:** `data/examples/zco_hardware_inventory.example.json`

## Schema ID

```text
zco_hardware_inventory_v1
```

## Root object

| Field | Type | Required | Description |
| ------------- | -------- | -------- | ------------------------------------- |
| `schema` | string | yes | Must include `zco_hardware_inventory` |
| `phase` | string | yes | `ZCO-4` |
| `updated_at` | ISO-8601 | yes | Operator refresh timestamp |
| `operator_id` | string | no | Opaque label (not email/password) |
| `site_id` | string | no | Home lab, studio, office — declared |
| `law` | string[] | yes | Intake law reminders |
| `inventory` | object[] | yes | Nodes and attached assets |

## Inventory entry (`inventory[]`)

### Identity and role

| Field | Type | Required | Notes |
| ---------------- | ------ | -------- | -------------------------------------------------------------- |
| `node_id` | string | yes | Stable ID; align with node registry if used |
| `label` | string | yes | Human label |
| `role` | enum | yes | See `node_roles` below |
| `location_type` | enum | no | `home_lab`, `office`, `studio`, `edge`, `unknown` |
| `status` | enum | yes | `active`, `dormant`, `recycle_candidate`, `retired`, `planned` |
| `sanctuary_lane` | enum | no | `hub`, `worker`, `nas`, `edge`, `recycle`, `backup` |
| `trust_status` | enum | yes | `trusted`, `provisional`, `unknown`, `degraded` |

### Platform

| Block | Fields |
| ------------- | -------------------------------------------------------------------------------------- |
| `motherboard` | `vendor`, `model`, `chipset`, `form_factor`, `socket` (all strings, declared) |
| `cpu` | `vendor`, `model`, `cores_declared`, `tdp_w_declared` |
| `ram` | `capacity_gb`, `modules`, `ddr_generation` |
| `gpu` | array of `{ model, vram_gb_declared, power_w_declared }` |
| `storage` | array of `{ type, capacity_tb, role, mount_note }` — `type`: NVMe, SATA, HDD, NAS_POOL |
| `network` | `nic_speed_declared`, `switch_model`, `router_model`, `vlan_notes` |
| `cooling` | `cpu_cooler`, `case_airflow`, `fan_count_declared`, `thermal_notes` |
| `power` | `psu_w_declared`, `ups_va_declared`, `ups_runtime_note`, `power_chain_safe_declared` |
| `display` | `monitors_count`, `primary_resolution` (optional) |

### Planning

| Field | Type | Description |
| ---------------- | -------- | ------------------------------------------------------------- |
| `workloads` | string[] | e.g. AI inference, dev builds, NAS, media |
| `declared_goals` | string[] | Business, creative, research, sanctuary |
| `upgrade_goals` | string[] | What operator wants next — not auto-generated |
| `constraints` | object | `budget_tier`, `power_limit_note`, `space_note`, `noise_note` |
| `risk_notes` | string[] | Human free-text — thermal, PSU, NAS_WAIT, etc. |
| `receipts_note` | string | Pointer to external change log — not live sync |

### Enums (reference)

```json
{
  "node_roles": [
    "ai_workstation",
    "control_hub",
    "compute_worker",
    "inference_edge",
    "storage_nas",
    "network_bridge",
    "recycle_dormant",
    "backup_standby",
    "planned_build"
  ],
  "storage_types": ["NVMe", "SATA", "HDD", "NAS_POOL", "external_usb_declared"],
  "location_types": ["home_lab", "office", "studio", "edge", "unknown"]
}
```

## Minimal valid node (example shape)

```json
{
  "node_id": "z-node-001",
  "label": "Primary AI workstation (example)",
  "role": "ai_workstation",
  "location_type": "home_lab",
  "status": "active",
  "sanctuary_lane": "hub",
  "trust_status": "trusted",
  "motherboard": { "vendor": "ASUS", "model": "X670E (declared)" },
  "cpu": { "model": "Ryzen 9 7950X (declared)", "cores_declared": 16 },
  "ram": { "capacity_gb": 64, "ddr_generation": "DDR5" },
  "gpu": [{ "model": "RTX 4090 (declared)", "vram_gb_declared": 24 }],
  "storage": [{ "type": "NVMe", "capacity_tb": 2, "role": "boot_and_projects" }],
  "network": { "nic_speed_declared": "10GbE (declared)" },
  "cooling": {
    "case_airflow": "positive_pressure_declared",
    "thermal_notes": "Operator-maintained"
  },
  "power": { "psu_w_declared": 1200, "power_chain_safe_declared": true },
  "workloads": ["AI workloads", "Z-Sanctuary hub development"],
  "declared_goals": ["Sanctuary orchestration", "media generation"],
  "constraints": {
    "budget_tier": "medium",
    "power_limit_note": "Single circuit — no unsafe chaining"
  }
}
```

## Cluster schema (companion)

File: `data/examples/zco_multi_node_cluster.example.json`
Schema: `zco_multi_node_cluster_v1`

| Field | Description |
| ---------------- | ----------------------------------------------------------- |
| `cluster_id` | Federation label |
| `node_refs` | `{ node_id, organism_role, priority }` — refs inventory IDs |
| `federation` | `mode`, `unified_motherboard_claim_allowed: false` |
| `nas_wait_nodes` | IDs not to treat as mounted |

## Upgrade path schema (companion)

File: `data/examples/zco_upgrade_path.example.json`
Schema: `zco_upgrade_path_v1`

| Field | Description |
| ---------------- | ----------------------------------------------------------------------- |
| `path_id` | Plan identifier |
| `target_node_id` | Which node |
| `phases` | array of `{ phase, item, estimated_cost_tier, amk_gate: true, signal }` |
| `rollback_note` | Human revert plan |

## Validation rules (manual / future script)

1. `node_id` unique within file.
2. `federation.unified_motherboard_claim_allowed` must be `false` if present.
3. No MAC, serial, IP, password, or API keys in committed examples.
4. `power_chain_safe_declared: false` → classify **BLUE** minimum for PowerBot narrative.
5. NAS nodes with `nas_wait: true` → StorageBot/NASBot respect NAS_WAIT law.

## Forbidden JSON claims

- `live_telemetry`, `last_probe`, `wmi_scan`, `auto_discovered: true`
- `unified_memory_fusion`, `quantum_speedup`, `infinite_scale`

## Related

| Doc | Role |
| ------------------------------------------------------------------ | ---------------------- |
| [ZCO_4_UPGRADE_PLANNING_GUIDE.md](ZCO_4_UPGRADE_PLANNING_GUIDE.md) | Human upgrade workflow |
| [PHASE_ZCO_4_GREEN_RECEIPT.md](PHASE_ZCO_4_GREEN_RECEIPT.md) | Phase seal |
