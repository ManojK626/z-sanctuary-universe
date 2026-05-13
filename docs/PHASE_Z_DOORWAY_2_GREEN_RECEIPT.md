# Phase Z-DOORWAY-2 — Green receipt (governed workspace opening)

**Formal scope:** Z-DOORWAY-2 is an **operator-assist launcher only** — registry-driven **metadata first**, **dry-run by default**, **Cursor / VS Code open only** for approved workspace files and folders. **No** npm lifecycle, deploy, git mutation, extensions, background services, NAS writes, or arbitrary disk scans.

## SSWS governed layer (this phase)

| Item | Location |
| --- | --- |
| Policy | [`docs/Z_DOORWAY_2_WORKSPACE_OPEN_POLICY.md`](Z_DOORWAY_2_WORKSPACE_OPEN_POLICY.md) |
| Registry | [`data/z_doorway_workspace_registry.json`](../data/z_doorway_workspace_registry.json) |
| Status (read-only) | [`scripts/z_doorway_workspace_status.mjs`](../scripts/z_doorway_workspace_status.mjs) |
| Safe opener | [`scripts/z_open_workspace_safe.ps1`](../scripts/z_open_workspace_safe.ps1) |
| npm | `z:doorway:status`, `z:doorway:dry` |

## Companion doorway lanes (same phase family)

| Lane | Location |
| --- | --- |
| AMK project doorway (PC-root groups) | [`data/amk_project_doorway_registry.json`](../data/amk_project_doorway_registry.json), [`scripts/amk_open_project_doors.ps1`](../scripts/amk_open_project_doors.ps1), [`docs/AMK_PROJECT_DOORWAY_LAUNCHER.md`](AMK_PROJECT_DOORWAY_LAUNCHER.md) |
| AMK workspace doorway profiles (Z-SSWS-DOOR-1) | [`data/amk_workspace_doorway_registry.json`](../data/amk_workspace_doorway_registry.json), [`scripts/amk_open_workspace_doors.ps1`](../scripts/amk_open_workspace_doors.ps1) |

## Gates run (required)

- `npm run verify:md`
- `npm run z:doorway:dry`
- `npm run z:traffic`
- `npm run z:car2`

Evidence (hub gates from repo root):

```text
2026-05-11: verify:md pass; z:doorway:dry ok (dry-run); z:traffic overall_signal GREEN; z:car2 ok (files_scanned: 3258)
```

## Posture checklist

| Check | Confirm |
| --- | --- |
| Read-only metadata first (`z:doorway:status`) | Yes |
| Dry-run default (`z:doorway:dry` / opener without `-Apply`) | Yes |
| `-Apply` requires explicit `-Id` (max 12) | Yes |
| Respects RED / HOLD / NAS_WAIT / disabled | Yes |
| No npm install / npm start / deploy / git / extensions / services / NAS writes | Yes |
| No recursive arbitrary disk scans | Yes |
| Open workspace ≠ run project | Yes |

## Manual smoke (operator)

```powershell
npm run z:doorway:status
npm run z:doorway:dry
powershell -ExecutionPolicy Bypass -File scripts/z_open_workspace_safe.ps1 -Tag ssws
powershell -ExecutionPolicy Bypass -File scripts/z_open_workspace_safe.ps1 -Apply -Id ssws_hub_workspace
```

**Seal:** GREEN hub checks do not authorize production deploys; doorway tools are **open-only** assists.
