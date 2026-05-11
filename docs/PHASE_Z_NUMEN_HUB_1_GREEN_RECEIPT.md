# Phase Z-NUMEN-HUB-1 Green Receipt

## Completed in this phase

- Hub reference registry `data/z_numen_hub_reference.json` for Labs Z-NUMEN.
- Read-only validator `scripts/z_numen_hub_reference_check.mjs` and report outputs under `data/reports/`.
- AMK indicator row `z_numen_hub_reference`.
- Autonomy policy entry for `z:numen:hub` as L1 evidence (no execution).
- Cross-links in hub docs index, AI Builder context, and Logical Brains hub/cadence docs.

## Acceptance intent

- `npm run z:numen:hub` returns **GREEN** when reference-only posture is intact.
- **RED** only if runtime bridge, deploy, provider, profiling, scraping, psychological targeting, canvas runtime, or public release lane is incorrectly opened.
- **Exit 0** for GREEN, YELLOW, and BLUE; **exit 1** only for RED.

## Locked law

- Hub reference is not a runtime bridge.
- Labs GREEN is not public release.
- GREEN is not deploy.
- BLUE requires AMK.
- RED blocks movement.

## Rollback steps

1. Remove `docs/Z_NUMEN_HUB_REFERENCE.md`.
2. Remove `docs/PHASE_Z_NUMEN_HUB_1_GREEN_RECEIPT.md`.
3. Remove `data/z_numen_hub_reference.json`.
4. Remove `scripts/z_numen_hub_reference_check.mjs`.
5. Remove `data/reports/z_numen_hub_reference_report.json` and `.md`.
6. Remove `z:numen:hub` from `package.json`.
7. Remove `z_numen_hub_reference` from `dashboard/data/amk_project_indicators.json`.
8. Revert additions to `docs/INDEX.md`, `docs/AI_BUILDER_CONTEXT.md`, `docs/Z_LOGICAL_BRAINS_HUB_REFERENCE.md`, `docs/Z_LOGICAL_BRAINS_MONITORING_CADENCE.md`, and `data/z_autonomy_task_policy.json`.
