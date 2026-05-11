# Z-SUSBV — Project benchmark capsule policy

**Goal:** Give each project a **small JSON capsule** instead of a full duplicate benchmark engine. The **hub** runs the **Benchmark Overseer** validator.

## Schema

- **Current:** `z_project_benchmark_capsule_v1` (see `z-questra/data/z_project_benchmark_capsule.json` and `data/examples/z_project_benchmark_capsule.example.json`).

## Required capsule root fields

| Field | Meaning |
| ------------------- | ------------------------------------------------------------------- |
| `schema` | Must be `z_project_benchmark_capsule_v1`. |
| `project_id` | Stable id; must match the owning project and the project index row. |
| `project_name` | Human label. |
| `pricing_owner` | Who owns pricing decisions (human/org), not a SKU engine. |
| `entitlement_owner` | Who owns entitlement truth vs hub catalog hints. |
| `bridge_status` | e.g. `reference_only`, `not_connected`, future-gated states. |
| `memory_status` | e.g. `local_only`, future-gated cloud — metadata only in O1. |
| `benchmark_posture` | Short posture string (non-commercial, metadata-only, etc.). |

## Required `services[]` row fields

Each row must include:

`service_id`, `module_ids` (array), `service_name`, `segment`, `commercial_status`, `benchmark_required`, `cost_floor_required`, `public_price_allowed`, `entitlement_status`, `related_docs`, `related_reports`.

## Truth rules

1. **`service_id` must exist** in `data/z_susbv_benchmark_registry.json` for hub validation in O1.
2. **`benchmark_required` and `public_price_allowed` must match the registry** for that `service_id` (mismatch is a **YELLOW** drift flag).
3. **If `public_price_allowed` is true** in the registry, the overseer requires **sufficient** evidence metadata in `z_susbv_service_price_validation.json` (same rule family as `z_susbv_validate.mjs`).
4. **No superlative or fake certification language** in the capsule JSON text (validator flags **RED** for common risky patterns).
5. **Capability ≠ entitlement ≠ billing** — language that implies paid hub entitlement while the entitlement catalog is reference-only triggers **RED** when detected (same spirit as Phase 1 validator).

## Optional hub capsule

`ZSanctuary_Universe` may omit a capsule when marked `optional_capsule: true` in `z_susbv_project_benchmark_index.json` — expect a **YELLOW** “optional capsule not declared” signal until a hub capsule is added.

## Rollback

Remove or revert capsule files and index rows; overseer reports are regenerable.
