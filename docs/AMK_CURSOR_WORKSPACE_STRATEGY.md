# AMK Cursor workspace strategy (Z-SSWS-LAB-1)

## Purpose

**Z-SSWS-LAB-1** merges **Z-SSWS** and **Z-Lab at the workspace / control layer only**: one **main Cursor cockpit** for awareness and governance work, plus **separate deep-work** windows when a single project needs full focus. It does **not** merge repositories, move codebases, or change runtime.

## Roles

| Layer | Role |
| --------------------------- | --------------------------------------------------------------------------------------------------- |
| **Z-SSWS** | Workspace and server **spine** (metadata, tasks, launch strings) — unchanged as authority |
| **Z-Lab** | Experiment and prototype **lane** on disk (`Z_Labs` at PC root) |
| **Main `.code-workspace`** | Cockpit: hub root + Z_Labs as a second root, with heavy folders excluded from search where possible |
| **Z-Lab `.code-workspace`** | Deep work: Z_Labs only |
| **Doorway deep profiles** | Franed, Lumina, Questra, creative-deep — one folder or hub window via `npm run amk:doorway:open` |

## Workspace files (hub)

| File | Use |
| ------------------------------------------------------ | --------------------------- |
| `workspaces/AMK-Goku-Super-Saiyan-Main.code-workspace` | Main cockpit (hub + Z_Labs) |
| `workspaces/AMK-Goku-Z-Lab.code-workspace` | Z_Lab-only deep work |

## How to open (examples)

From PC (adjust only if your hub folder name differs):

```powershell
cursor "C:\Cursor Projects Organiser\Z_Sanctuary_Universe\workspaces\AMK-Goku-Super-Saiyan-Main.code-workspace"
cursor "C:\Cursor Projects Organiser\Z_Sanctuary_Universe\workspaces\AMK-Goku-Z-Lab.code-workspace"
```

**Doorway fallback** (profiles `main_control`, `z_lab`, `morning`, etc.):

```text
npm run amk:doorway:open -- -Profile main_control -DryRun
npm run amk:doorway:open -- -Profile z_lab
```

Evidence and gates:

```bash
npm run amk:workspace:profiles
npm run amk:doorway:status
```

## Registry

- `data/amk_cursor_workspace_profiles.json` — LAB-1 profile map, laws, links to docs and reports.
- `data/amk_workspace_doorway_registry.json` — DOOR-1 profiles updated with `main_control`, `z_lab`, `questra`, `creative_deep`, and morning → main cockpit workspace.

## Law

```text
Workspace merge ≠ repo merge.
Open workspace ≠ run project.
Z-Lab experiment ≠ production.
Main cockpit ≠ deployment.
Cursor open ≠ code execution.
AMK-Goku owns sacred moves.
```

## Related

- [AMK_WORKSPACE_DOORWAY.md](AMK_WORKSPACE_DOORWAY.md)
- [Z_SSWS_WORKSPACE_SPINE.md](Z_SSWS_WORKSPACE_SPINE.md)
- [PHASE_Z_SSWS_LAB_1_GREEN_RECEIPT.md](PHASE_Z_SSWS_LAB_1_GREEN_RECEIPT.md)
