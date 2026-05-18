# Z-SSWS workspace spine (Z-SSWS-LINK-1)

## Purpose

**Z-SSWS** is the **main workspace and server task spine**: scripts, tasks, extensions, install and start command strings, and launch order **metadata** the hub tracks for operators and AI builders. **Z-SSWSs** (plural) are **shadow, staging, and mirror** workspace spines used for review, staging posture, or mirrored HTML — still **metadata only** in LINK-1.

**Z-SSWS-LINK-1** links this spine to **Z-API-SPINE-1** and **Z-API-GATE** readiness: each project row records `api_spine_ref`, `api_readiness_ref`, smoke and verify command strings, ports, extension requirements, and shadow rules **without** executing anything.

## Artifacts

| Artifact | Role |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `data/z_ssws_workspace_spine_registry.json` | Canonical launch-requirements registry |
| `data/z_ssws_launch_requirements_policy.json` | Signals, extension and launch rules, alert policy |
| `data/examples/z_ssws_project_launch_capsule.example.json` | Per-project capsule shape |
| `scripts/z_ssws_launch_requirements_check.mjs` | Validator; writes `data/reports/z_ssws_launch_requirements_report.{json,md}` |

## Command

```bash
npm run z:ssws:requirements
```

## Ladder (future)

| Phase | Capability |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SSWS-LINK-1 | Registry + validator + AMK indicator (this phase) |
| SSWS-DOOR-1 | AMK Workspace Doorway — local folder/workspace opener + `amk:doorway:status` (see [AMK_WORKSPACE_DOORWAY.md](AMK_WORKSPACE_DOORWAY.md)) |
| SSWS-LAB-1 | Main Cursor cockpit + Z_Lab workspace control — `npm run amk:workspace:profiles` ([AMK_CURSOR_WORKSPACE_STRATEGY.md](AMK_CURSOR_WORKSPACE_STRATEGY.md)) |
| SSWS-COCKPIT-1 | Cockpit vs deep-work registry + dry-run plan — `npm run z:ssws:cockpit` ([Z_SSWS_SUPER_SAIYAN_WORKSPACE_COCKPIT.md](Z_SSWS_SUPER_SAIYAN_WORKSPACE_COCKPIT.md)) |
| SSWS-LINK-2 | Visual launch board on AMK dashboard |
| SSWS-LINK-3 | Manual checklist generator |
| SSWS-LINK-4 | Controlled local start for approved dev services (AMK) |
| SSWS-LINK-5 | Shadow workspace orchestration (charter) |
| SSWS-LINK-6 | Full auto-launch (sacred lane) |

## Law

```text
Launch requirement ≠ launch permission.
Extension requirement ≠ auto-install.
Start command ≠ execution.
Shadow workspace ≠ deploy.
GREEN ≠ auto-launch.
BLUE requires AMK.
RED blocks movement.
AMK-Goku owns sacred moves.
```

## Related

- [Z_SSWS_LAUNCH_REQUIREMENTS_POLICY.md](Z_SSWS_LAUNCH_REQUIREMENTS_POLICY.md)
- [Z_SSWS_SHADOW_SPINES_POLICY.md](Z_SSWS_SHADOW_SPINES_POLICY.md)
- [Z_API_SPINE_POWER_CELL.md](Z_API_SPINE_POWER_CELL.md)
- [Z_API_READINESS_AND_SMOKE_GATE.md](Z_API_READINESS_AND_SMOKE_GATE.md)
- [Z_IDE_FUSION_WORKFLOW_CONTROL.md](Z_IDE_FUSION_WORKFLOW_CONTROL.md)
- [PHASE_Z_SSWS_LINK_1_GREEN_RECEIPT.md](PHASE_Z_SSWS_LINK_1_GREEN_RECEIPT.md)
