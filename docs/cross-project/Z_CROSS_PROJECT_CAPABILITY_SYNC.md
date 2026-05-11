# Z-Sanctuary — Cross-project capability sync (ZSX-1)

## Purpose

Establish a **service synchronization layer** in metadata only: the hub can **know** what sibling surfaces (for example Z-QUESTRA and future ZQuestCraft) offer, how reuse is gated, and how entitlements differ from raw capability — **without** executing those projects or wiring live bridges.

## Authority inputs (read, do not override)

| Artifact | Role |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `z-questra/data/z_questra_capability_manifest.json` | Source truth for Questra capabilities |
| `dashboard/data/z_universe_service_catalog.json` | NAV-1 workstation catalog |
| `data/z_cross_project_capability_index.json` | Hub-side index aligned to manifests |
| `data/z_service_entitlement_catalog.json` | Capability vs entitlement vs billing posture |
| `data/z_shadow_preview_policy.json` | Machine-readable shadow preview law |
| `data/z_magical_visual_capability_registry.json` | Magical / canvas **presentation** lineage (ZMV-1A) — not product access; includes **Z Magical Canvas PlayKit** (ZMC-1) row |
| `docs/dashboard/Z_UNIVERSE_WORKSTATION_NAVIGATOR.md` | Navigator behavior (read-only cockpit) |
| `docs/AI_BUILDER_CONTEXT.md` | Builder doctrine pointers |
| `docs/orchestration/README.md` | Orchestration contracts context |
| `data/z_master_module_registry.json` | Module registry cross-check |
| `data/reports/z_zuno_coverage_audit.json` | Zuno audit artifacts |
| `data/reports/z_car2_similarity_report.json` | CAR² similarity artifacts |

## How Questra stays visible

1. **Project manifest** declares capabilities, bridge posture, and forbidden lanes.
2. **Hub catalog row** (`z_questra_workstation`) lists the workstation for humans and NAV-1.
3. **Cross-project index** duplicates capability rows for routing, overseer docs, and future knowledge bases — always labeled **reference_only**.

The hub **ingests by reference** (paths and JSON), not by loading Questra runtime code.

## Reuse modes (summary)

| Mode | Allowed now |
| -------------------------- | ---------------------------------------: |
| `catalog_reference` | Yes |
| `doc_link` | Yes |
| `manual_launch` | Yes |
| `shadow_preview` | Future gated — must follow shadow policy |
| `shared_component_package` | Later — versioning + charter |
| `iframe_embed` | Later — security/privacy review |
| `local_file_bridge` | Later — import/export policy |
| `live_api_bridge` | Later — backend + auth + DRP |
| `cross_project_memory` | Later — consent + deletion + audit |

Detail: [Z_SERVICE_ENTITLEMENT_AND_PRICING_POLICY.md](./Z_SERVICE_ENTITLEMENT_AND_PRICING_POLICY.md), [Z_SHADOW_PREVIEW_POLICY.md](./Z_SHADOW_PREVIEW_POLICY.md).

## Governance

- **14 DRP** (harm reduction / safety habits) and **14 DOP** (operational discipline: charters, sign-off, phased rollout) apply before any live bridge or automated reuse.
- **XL2** stays separate and reference-only unless a charter explicitly integrates it.

## Operator tooling

- Validate JSON locally: `npm run z:cross-project:sync`

## Related

- [PHASE_ZSX_1_GREEN_RECEIPT.md](./PHASE_ZSX_1_GREEN_RECEIPT.md)
- [ZUNO_SUPER_SAIYAN_KNOWLEDGE_GUIDE.md](./ZUNO_SUPER_SAIYAN_KNOWLEDGE_GUIDE.md)
