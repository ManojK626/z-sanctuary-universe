# AMK Project Doorway Launcher (Phase Z-DOORWAY-2)

**Purpose.** Governed **local-only** launcher that opens hub and sibling PC project folders or workspace files **from** `data/amk_project_doorway_registry.json`. Distinct from Z-SSWS-DOOR-1 (`amk_workspace_doorway_registry.json` + `amk_open_workspace_doors.ps1`), which profiles multi-workspace doorway sessions.

**Authority.** AMK sacred moves stay human-gated (merge, deploy, secrets, billing). This tool **never** runs lifecycle commands - it only invokes Cursor, VS Code, or Explorer with a resolved path.

## Registry (`data/amk_project_doorway_registry.json`)

| Field | Meaning |
| --- | --- |
| `id` | Stable key for the row. |
| `name` | Human label. |
| `path` | Primary folder target (declaration-only NAS paths skip open until mount exists). |
| `workspace` | Optional `.code-workspace` opened first when `allowed_action` is `cursor_workspace_first`. |
| `status` | One of GREEN, YELLOW, BLUE, RED, NAS_WAIT (see Status meanings). |
| `open_group` | Which `-Group` filters include this row: `deployment_ready`, `review`, `all_safe` (JSON string or array of strings). Legacy key `open_groups` is accepted by the launcher. |
| `deployment_posture` | Label only (preview hold, charter, NAS wait - not an automated deploy cue). |
| `nas_required` | If true and path missing, launcher skips (`NAS_WAIT` posture). |
| `allowed_action` | `cursor_workspace_first`, `cursor`, `explorer_when_mounted`, `none_until_amk`, `none`. String or JSON array (**first** element wins via `Get-AllowedActionToken` in the script). |
| `forbidden_actions` | Normative list for humans / future linters; launcher has **no** executable hooks for npm, deploy, Wrangler, git push, secrets, domain bind, or background services. |

### Status meanings

| Status | Launcher behavior |
| --- | --- |
| `GREEN` | Safe to open per `allowed_action`. |
| `YELLOW` | Eligible in `review` when tagged; shows a **review warning** before open. **Not** included in `all_safe` or `deployment_ready` until status is `GREEN`. |
| `BLUE` | Hold / AMK decision; **no** IDE open unless posture explicitly allows explorer-only (rare). |
| `RED` | **Blocked** - never opens. |
| `NAS_WAIT` | Skips until path exists (`nas_required=true` typical). |

## PowerShell launcher (`scripts/amk_open_project_doors.ps1`)

| Flag | Behavior |
| --- | --- |
| `-Group deployment_ready` | Rows tagged `deployment_ready` with **GREEN** status, `deployment_posture` ≠ `blocked`, not `NAS_WAIT`, and **`nas_required` paths must exist** before they appear here (respects Synology HOLD). |
| `-Group review` | Rows tagged `review` for awareness (GREEN/YELLOW may open; BLUE holds; RED blocked; NAS skips if missing). |
| `-Group all_safe` | **GREEN** rows tagged `all_safe`. Default group when omitted. |
| `-DryRun` | Print intended opens only - no Cursor/Code/Explorer. |

**Forbidden (by design — never implemented):** `npm install`, `npm start`, deploy, Wrangler, `git push`, secret writes / secret rotation, domain bind / DNS moves, spawning background servers or tunnels. The launcher only starts **Cursor**, **VS Code**, or **Explorer**.

### npm shortcuts

From repository root:

- `npm run amk:doors:dry` — `-DryRun` with default `-Group all_safe`.
- `npm run amk:doors:open` — live open with default `-Group all_safe`.

Other groups:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/amk_open_project_doors.ps1 -Group deployment_ready -DryRun
powershell -ExecutionPolicy Bypass -File scripts/amk_open_project_doors.ps1 -Group review
```

## NAS / Synology

Paths under future NAS drive letters are **declaration-only**. Until the mount exists, `NAS_WAIT` + missing path rows are skipped with a console note.

## Related

- Z-SSWS-DOOR-1: `docs/` + `npm run amk:doorway:status` / `amk:doorway:open`
- Green receipt: `docs/PHASE_Z_DOORWAY_2_GREEN_RECEIPT.md`
