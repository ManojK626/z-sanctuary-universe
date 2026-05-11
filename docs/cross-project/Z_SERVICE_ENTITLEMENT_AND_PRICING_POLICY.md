# Service entitlement and pricing policy (ZSX-1)

## Core law

```text
Capability ≠ entitlement.
Reference ≠ access.
Access ≠ billing permission.
Billing permission ≠ live bridge.
```

A row in `data/z_cross_project_capability_index.json` means **the ecosystem acknowledges that a capability exists somewhere**. It does **not** grant:

- A license to embed or execute it in another repo,
- A right to bill under the hub’s name,
- A live API or shared-memory bridge.

## Three independent concepts

### 1. Project tier

Each project defines its own plans (example labels only):

```text
Z-QUESTRA — Free / Student / Creator / Enterprise (when published by source)
XL2 — Observer / Workstation / Elite
Z-Sanctuary Hub — Operator / Enterprise / Founder
```

The hub **does not auto-merge** tier names or prices across projects.

### 2. Capability tier

Features have access posture inside their source project, for example:

```text
comfort_modes — baseline / typically local free
local_notebook — local tooling tier defined by source
future AI visual designer — future gated premium (not shipped here)
```

Illustrative rows live in `data/z_service_entitlement_catalog.json` under `capability_entitlements`.

### 3. Bundle charter

When two projects intentionally share or bundle offerings:

```text
Bundle record — proposed / active / retired
Billing owner — explicit
Legal + pricing sign-off — required before marketing combined entitlement
```

Example stub: `bundle_charters` in `data/z_service_entitlement_catalog.json`.

## Conflict prevention

| Situation | Rule |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Another project wants to “include” Questra PlayGarden | Needs **charter** + compatibility review; pricing stays with **z-questra** unless bundle says otherwise |
| Hub lists a capability | **Catalog reference only** — see entitlement catalog |
| Shadow copy in a sibling repo | Must carry **source project, version, pricing owner, not-live** label — [Z_SHADOW_PREVIEW_POLICY.md](./Z_SHADOW_PREVIEW_POLICY.md) |

## ZQuestCraft

Until a `source_manifest` path is registered, entitlements for ZQuestCraft remain **`manifest_required`** — see placeholder rows in the JSON catalogs.

## Related

- `data/z_service_entitlement_catalog.json`
- `data/z_cross_project_capability_index.json`
- [Z_CROSS_PROJECT_CAPABILITY_SYNC.md](./Z_CROSS_PROJECT_CAPABILITY_SYNC.md)
