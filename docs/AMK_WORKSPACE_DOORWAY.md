# AMK Workspace Doorway (Z-SSWS-DOOR-1)

## Purpose

The **AMK-Goku PC Gateway Doorway** is a **controlled local layer**: one registry, one read-only status script, and one PowerShell helper so you can **open the right folders or `.code-workspace` files** in Cursor (then VS Code, then Explorer) **without** starting servers, running installs, mounting NAS, writing secrets, deploying, or auto-launching sacred systems.

It sits **after Z-SSWS-LINK-1**: Z-SSWS already carries install/start/verify strings, ports, and posture as **metadata**. DOOR-1 adds **which disk doors exist** and **which profile opens which projects** — still metadata plus **explicit human-run** open commands.

**Z-SSWS-LAB-1** layers a **main Cursor cockpit** (hub + Z_Lab workspace file) and **deep-work** splits without merging repos — see [AMK_CURSOR_WORKSPACE_STRATEGY.md](AMK_CURSOR_WORKSPACE_STRATEGY.md). Doorway profiles `main_control`, `z_lab`, `questra`, and `creative_deep` open the mapped workspace or folder paths only.

## Law

```text
Doorway ≠ auto-launch full system.
Open folder ≠ start server.
Workspace profile ≠ deployment.
NAS reference ≠ credential access.
Cursor open ≠ code execution.
AMK-Goku owns sacred moves.
```

## Artifacts

| Artifact | Role |
| ----------------------------------------------------- | ------------------------------------------------ |
| `data/amk_workspace_doorway_registry.json` | Canonical doorway registry (profiles + projects) |
| `scripts/amk_workspace_doorway_status.mjs` | Read-only checks; writes JSON + Markdown reports |
| `scripts/amk_open_workspace_doors.ps1` | Local opener only (`-DryRun` supported) |
| `data/reports/amk_workspace_doorway_status.{json,md}` | Evidence for indicators and operators |

## IDE PATH health (Z-PC-IDE-PATH-1)

Before trusting **Explorer “Open with …” menus**, AMK can run a **read-only** probe that verifies `code` / `cursor` on PATH (where available), common VS Code/Cursor `.exe` locations, hub + Labs folders, and whether `cwd` mistakenly sits under `.cursor/projects`. See [Z_PC_IDE_PATH_HEALTH_CHECK.md](Z_PC_IDE_PATH_HEALTH_CHECK.md).

```bash
npm run z:pc:ide-path
```

Explorer context drift (e.g. missing “Open with Code”) does **not** prove the IDE is broken — prioritize **installer/PATH repair** over ad-hoc registry edits.

**Operator one-pager:** [AMK_IDE_PATH_AND_FUSION_OPERATOR_RHYTHM.md](AMK_IDE_PATH_AND_FUSION_OPERATOR_RHYTHM.md) — path check + fusion + gate rhythm in one place.

**Cockpit orchestration (Z-SSWS-COCKPIT-1):** [Z_SSWS_SUPER_SAIYAN_WORKSPACE_COCKPIT.md](Z_SSWS_SUPER_SAIYAN_WORKSPACE_COCKPIT.md) + `npm run z:ssws:cockpit` summarize **main cockpit vs deep-work** roots with a **dry-run** CLI plan only — it does **not** replace doorway open commands and does **not** auto-launch editors.

## Commands

```bash
node -e "JSON.parse(require('fs').readFileSync('data/amk_workspace_doorway_registry.json','utf8')); console.log('AMK doorway JSON OK')"
npm run amk:doorway:status
```

PowerShell (from hub root; pass profile after `--` when using npm):

```powershell
powershell -ExecutionPolicy Bypass -File scripts/amk_open_workspace_doors.ps1 -Profile morning -DryRun
powershell -ExecutionPolicy Bypass -File scripts/amk_open_workspace_doors.ps1 -Profile morning -OpenDashboard
```

With npm wrapper:

```text
npm run amk:doorway:open -- -Profile franed -DryRun
```

The npm script **does not** append a profile; always pass `-Profile` (and optional `-DryRun` / `-OpenDashboard`) after `--`.

## Profiles (v1)

| Profile | Intent |
| ------------------ | ---------------------------------------------------------------------------------- |
| `morning` | Z-SSWS-LAB-1 main cockpit `.code-workspace` + optional AMK HTML (`-OpenDashboard`) |
| `main_control` | Same as morning focus: Super-Saiyan main workspace file |
| `z_lab` | Z_Lab-only `.code-workspace` for experiment deep work |
| `questra` | Z-QUESTRA folder only (`z-questra` under hub) |
| `creative_deep` | Hub root only for Z-OMNAI / creative evidence deep pass |
| `franed` | AT Princess & Blackie / Franed AI sibling folder |
| `lumina` | Z-Saiyan Lumina browser lane (path optional until folder exists) |
| `creative` | Hub + Z-OMNI-Sanctuary sibling (OMNAI docs/reports live in hub) |
| `dashboard_review` | Hub + optional AMK HTML via `-OpenDashboard` |
| `full_review_safe` | Several folders/workspace file — **no servers** |

## Status signals

The status script assigns per-row and overall signals:

- **GREEN** — required paths (and required workspace files where tier is required) exist.
- **YELLOW** — optional path missing, optional workspace missing, duplicate path hints, or Cursor CLI not found on PATH.
- **BLUE** — NAS declaration, secrets flag, or human gate on a row (manual AMK posture).
- **RED** — required path or required workspace file missing.

Exit code: **0** for GREEN/YELLOW/BLUE; **1** only for overall **RED**.

## Relation to Z-SSWS, Z-SSWSs, Z-API-GATE, indicators

- **Z-SSWS-LINK-1** remains the launch-requirements spine (`npm run z:ssws:requirements`). DOOR-1 **does not** execute those strings.
- **Z-API-SPINE-1** stays read-only registry; the doorway may reference `related_api_ref` for traceability only.
- **AMK indicators** include `amk_workspace_doorway`; when the dashboard is served over HTTP, `amk-project-indicators-readonly.js` may overlay **signal** from `data/reports/amk_workspace_doorway_status.json`.

## NAS / Synology

Rows may declare `nas_dependency: true` **without** a path. The doorway **never** mounts volumes or reads credentials. If you use a NAS, you mount it **outside** this tool and optionally add a real path later under AMK control.

## Why HTML does not open folders by itself

Browser security blocks arbitrary `file://` or local path opens from untrusted pages. The AMK dashboard should show **copy-command** / **profile status** / **report links** first. A **future** local-only protocol or signed helper would be a **separate chartered lane** (not part of DOOR-1).

## Future ladder

| Phase | Capability |
| ------ | --------------------------------------------------------------------- |
| DOOR-1 | Registry + `amk:doorway:status` + PowerShell open (this phase) |
| DOOR-2 | Dashboard copy-command / profile helper UX |
| DOOR-3 | Controlled local server start for **approved** dev services (charter) |
| DOOR-4 | NAS-aware sync readiness (no silent credential use) |
| DOOR-5 | Full local session launcher with explicit AMK approval |

## Related

- [Z_SSWS_WORKSPACE_SPINE.md](Z_SSWS_WORKSPACE_SPINE.md)
- [Z_SSWS_LAUNCH_REQUIREMENTS_POLICY.md](Z_SSWS_LAUNCH_REQUIREMENTS_POLICY.md)
- [AMK_PROJECT_INDICATORS_AND_GO_NO_GO.md](AMK_PROJECT_INDICATORS_AND_GO_NO_GO.md)
- [PHASE_Z_SSWS_DOOR_1_GREEN_RECEIPT.md](PHASE_Z_SSWS_DOOR_1_GREEN_RECEIPT.md)
