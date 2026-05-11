# Z project dependency map (Cursor Ops)

**Purpose:** Show which hub artefacts depend on which others so prompts do not run in the wrong order.

## Upstream (run or refresh before dependent work)

| Artefact | Depends on | Notes |
| ------------------------------------------------- | ------------------------------------------------ | ----------------------------------- |
| `data/reports/z_zuno_coverage_audit.json` | `data/z_master_module_registry.json`, repo files | `npm run zuno:coverage` |
| `data/reports/z_zuno_phase3_completion_plan.json` | coverage audit JSON | `npm run zuno:phase3-plan` |
| AI Builder module pages | master registry + optional Zuno JSON | `npm run z:docs:modules` |
| Z-MAOS manifests | operator edits + `tools/z-maos/*.json` | `npm run z:maos-status` |
| Dashboard registry verify | dashboard HTML / data wiring | `npm run dashboard:registry-verify` |

## Cross-repo (reference-only)

| Satellite | Coupling allowed | Proof |
| -------------------------- | --------------------------------- | ------------------------------------ |
| XL2 / XXXtreme Lightning 2 | `reference_only` in MAOS registry | `tools/z-maos/project_registry.json` |
| Other PC-root projects | EAII / roster pointers | `data/z_pc_root_projects.json` |

## Downstream (consumers)

| Consumer | Reads |
| ------------------ | --------------------------------------- |
| Z Blueprint panel | `docs/**/*.md` links, hub commands |
| Z-CAR² | generated reports under `data/reports/` |
| Cursor Ops prompts | this folder + MAOS + AI Builder context |

## Forbidden edges (without charter)

- Z-Sanctuary repo **importing** XL2 source trees.
- Shared deploy keys or environment files across products.
- Silent cross-repo CI triggers.
