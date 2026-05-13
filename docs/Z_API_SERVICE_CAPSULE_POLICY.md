# Z-API service capsule policy

## Purpose

A **service capsule** is a small JSON document a project can maintain (or the hub can mirror) so **Z-API-SPINE-1** knows how that project’s surface fits the multiverse: routes, dependencies, smoke gate command strings, sensitivity, deployment labels, and doc or report links.

The hub example lives at `data/examples/z_api_service_capsule.example.json`. Capsules are **declarative**; they do not grant cross-repo execution rights.

## Fields (example-aligned)

| Area | Intent |
| --------------------------------------------- | ------------------------------------------------------------------------------------ |
| `service_id` / `project_id` | Stable identifiers for aggregation |
| `health` | Path or mode metadata; live probes are future-gated |
| `routes` | Route families or entry paths for collision checks |
| `dependencies` | Other services or data stores (metadata only) |
| `smoke_gate` | Command string or label — **operator-run** unless a separate chartered runner exists |
| `data_sensitivity` / `deployment_status` | Posture for indicators and BLUE candidates |
| `allowed_auto_checks` / `human_gated_actions` | Align with `data/z_autonomy_task_policy.json` |

## Hub vs project

- **Hub canonical:** `data/z_api_spine_registry.json` is the **aggregate** catalog for multiverse awareness.
- **Per-project:** Prefer a capsule path referenced from ecosystem or spine rows when the file exists in the workspace; external siblings stay `reference_only` until chartered.

## Law

Similar name or shared route string in a capsule does **not** imply shared auth, billing, or entitlement. Explicit relationship rows (`explicit_route_sharing_with` on spine services) exist only to document intentional coupling.

## Related

- [Z_API_SPINE_POWER_CELL.md](Z_API_SPINE_POWER_CELL.md)
- [Z_PROJECT_AWARENESS_CAPSULE_POLICY.md](Z_PROJECT_AWARENESS_CAPSULE_POLICY.md) (ecosystem capsules)
- [Z_ECOSYSTEM_AWARENESS_SPINE.md](Z_ECOSYSTEM_AWARENESS_SPINE.md)
