# Phase Z-DOORWAY-2 — Green receipt (AMK Project Doorway Launcher)

**Formal scope:** Registry-driven launcher that opens **Cursor / VS Code / Explorer only**. No installs, deploys, Wrangler, git push, secrets, domain binds, or background services.

## Deliverables

| Item | Location |
| --- | --- |
| Registry | [`data/amk_project_doorway_registry.json`](../data/amk_project_doorway_registry.json) |
| Launcher | [`scripts/amk_open_project_doors.ps1`](../scripts/amk_open_project_doors.ps1) |
| Operator doc | [`docs/AMK_PROJECT_DOORWAY_LAUNCHER.md`](AMK_PROJECT_DOORWAY_LAUNCHER.md) |
| npm shortcuts | `amk:doors:dry`, `amk:doors:open` (both pass `-Group all_safe`; other groups via direct `powershell -File scripts/amk_open_project_doors.ps1`) |

## Registry columns (normative)

`id`, `name`, `path`, `workspace`, `status`, `open_group`, `deployment_posture`, `nas_required`, `allowed_action`, `forbidden_actions`.

- **`allowed_action`:** Launcher token (`cursor_workspace_first`, `cursor`, `explorer_when_mounted`, `none_until_amk`, `none`). May be a string or JSON array (`Get-AllowedActionToken` uses the **first** element if an array).

- **`status`:** `GREEN` safe open · `YELLOW` open with warning · `BLUE` HOLD / AMK · `RED` blocked · `NAS_WAIT` wait for Synology mount.
- **`open_group`:** Tags which `-Group` values include the row (`all_safe`, `deployment_ready`, `review`). Launcher accepts legacy **`open_groups`** only as a fallback.
- **`deployment_posture` / `nas_required`:** Inform filters; `deployment_ready` excludes blocked / NAS_WAIT / missing `nas_required` paths until the mount exists.

## Gates run (required)

- `npm run verify:md`
- `npm run z:traffic`
- `npm run z:car2`

Evidence (hub gates from repo root):

```text
2026-05-11: verify:md pass; z:traffic overall_signal GREEN; z:car2 ok (files_scanned: 3241)
```

Re-run and refresh this block after registry, script, or receipt edits.

## Posture checklist

| Check | Confirm |
| --- | --- |
| Launcher never invokes npm install / npm start / deploy / Wrangler / git push / secrets / domain bind | Yes — open-only paths |
| NAS paths declaration-only until mount | Yes — skips when path missing (`NAS_WAIT` / `nas_required`) |
| Distinct from Z-SSWS-DOOR-1 workspace doorway | Yes — separate registry + script |

## Manual smoke (operator)

```powershell
npm run amk:doors:dry
powershell -ExecutionPolicy Bypass -File scripts/amk_open_project_doors.ps1 -Group deployment_ready -DryRun
powershell -ExecutionPolicy Bypass -File scripts/amk_open_project_doors.ps1 -Group review -DryRun
```

**Seal:** Z-DOORWAY-2 is a **local doorway** only; GREEN hub checks do not authorize cloud production moves.
