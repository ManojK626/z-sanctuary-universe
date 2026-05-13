# Z-DOORWAY-2 — Workspace open policy (Z-SSWS governed layer)

**Governance.** Z-DOORWAY-2 is an **operator-assist launcher only** for Z-SSWS and related hub work. It uses **registry metadata first**, **dry-run by default**, and **manifest-driven paths only**. Opening a Cursor workspace or folder **does not** run installs, dev servers, deployments, or git.

## Canonical artifacts

| Role | Path |
| --- | --- |
| Workspace/folder registry | `data/z_doorway_workspace_registry.json` |
| Read-only status + reports | `scripts/z_doorway_workspace_status.mjs` → `data/reports/z_doorway_workspace_status.{json,md}` |
| Safe opener (PowerShell) | `scripts/z_open_workspace_safe.ps1` |
| npm (hub root) | `npm run z:doorway:status`, `npm run z:doorway:dry` |

## Registry fields (normative)

| Field | Meaning |
| --- | --- |
| `id` | Stable key; required for `-Apply -Id`. |
| `name` | Human label. |
| `path` | Absolute path to a `.code-workspace` file or folder. |
| `type` | `workspace` or `folder`. |
| `enabled` | When `false`, status and opener **skip** the row. |
| `status` | `GREEN` (open allowed after checks), `YELLOW` (review warning), `HOLD` (no open), `RED` (blocked), `NAS_WAIT` (no open until NAS posture cleared). |
| `tags` | Optional filter chips (e.g. `ssws`, `hub`); opener `-Tag` filters by exact tag match. |
| `preferred_entry` | `cursor` (default), `vscode`, or `none` (never launch IDE for this row). |
| `notes` | Operator and governance notes only. |
| `nas_required` | When `true` and the path is missing, treat as **NAS_WAIT** (no writes, no mount automation). |

## Hard prohibitions

The doorway layer and opener **must never**:

- run `npm install`, `npm start`, or other package lifecycle commands
- deploy, bind DNS/domains, or touch Wrangler / edge production
- mutate git state (commit, push, reset, etc.)
- install IDE extensions
- create background daemons, services, or tunnels
- write to NAS volumes or create NAS directory trees
- recursively scan disks outside registry-declared paths
- auto-open more targets than the operator explicitly passes to `-Apply -Id` (batch cap: **12** ids per invocation)

## Operator flow

1. **Read metadata:** `npm run z:doorway:status` (JSON + Markdown under `data/reports/`).
2. **Plan opens:** `npm run z:doorway:dry` (PowerShell dry-run; optional `-Tag ssws`).
3. **Open (explicit):** `powershell -ExecutionPolicy Bypass -File scripts/z_open_workspace_safe.ps1 -Apply -Id ssws_hub_workspace`  
   Prefer **Cursor** for workspace files; fall back to **VS Code** (`code`) if Cursor is unavailable. **Folder** entries open the folder in the IDE, not Explorer, unless policy is extended later.

## Relationship to other doorways

- **Z-SSWS-DOOR-1 / AMK workspace doorway:** `data/amk_workspace_doorway_registry.json` and `scripts/amk_open_workspace_doors.ps1` — profile-based AMK sessions (see `docs/AMK_WORKSPACE_DOORWAY.md`).
- **AMK project doorway:** `data/amk_project_doorway_registry.json` and `scripts/amk_open_project_doors.ps1` — PC-root project groups (see `docs/AMK_PROJECT_DOORWAY_LAUNCHER.md`).

Z-DOORWAY-2 is the **SSWS-focused** registry slice for **workspace vs folder** typing and **explicit `-Id` apply** semantics.

## Law line

**Doorway metadata first. Dry-run default. Apply is explicit. Open workspace ≠ run project.**
