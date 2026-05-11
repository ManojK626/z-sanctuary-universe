# Z-DOORWAY-3 — Doorway telemetry and session receipts

**Purpose.** Observation and **local** reporting around **Z-DOORWAY-2** workspace doorway use: what the operator asked to open, whether the path existed at receipt time, and whether the IDE launch was attempted. This phase **does not** run projects, builds, installs, deploys, background services, or touch secrets.

## Scope

| In scope | Out of scope |
| --- | --- |
| Optional JSON Lines session file on **`-Apply -SessionLog`** | npm install / start / build |
| Summary embedded in `z:doorway:status` when a log file exists | Deploy, DNS, Wrangler |
| Operator policy and examples | Git read/write |
| | Extension installation |
| | NAS writes or mount automation |
| | Arbitrary disk scans beyond registry paths |
| | Tokens, env dumps, command output, project file contents |

## Session log (JSON Lines)

**Runtime path (local, gitignored):** `data/reports/z_doorway_session_log.jsonl`  
**Committed example (shape only):** `data/reports/z_doorway_session_log.example.jsonl`

### Allowed fields (normative)

Each line is one JSON object with **only** these keys:

| Field | Type | Meaning |
| --- | --- | --- |
| `timestamp` | string (ISO-8601 UTC) | When the receipt was written. |
| `id` | string | Registry entry `id`. |
| `name` | string | Registry display `name` (no paths). |
| `path_exists` | boolean | Whether the registry `path` existed on disk at receipt time. |
| `status` | string | Registry `status` at receipt time. |
| `action` | string | Always **`open_workspace_only`**. |
| `result` | string | e.g. `opened`, `skipped`, `ide_unavailable`, `error` (no stack traces). |
| `operator_mode` | string | **`apply`** when logging from `-Apply` (dry-run does not append). |

**Forbidden in the log:** filesystem paths beyond what is implied by `id`/`name` (do **not** record the registry `path` string), secrets, tokens, env values, shell output, stack traces, personal files, or project contents.

## PowerShell opener

- **Default:** dry-run (no writes, no session log).
- **`-Apply`:** still requires explicit **`-Id`** (same as Z-DOORWAY-2).
- **`-SessionLog`:** valid **only** with **`-Apply`**; appends one JSON line per processed registry row (including `skipped` outcomes).

```powershell
npm run z:doorway:dry
powershell -ExecutionPolicy Bypass -File scripts/z_open_workspace_safe.ps1 -Apply -Id ssws_hub_workspace -SessionLog
```

## Status report

`npm run z:doorway:status` (`scripts/z_doorway_workspace_status.mjs`) includes a **`doorway_telemetry`** summary when `data/reports/z_doorway_session_log.jsonl` exists: counts by `result` and `id`, first/last timestamps, and read bounds (recent lines only; no full-file scan of huge logs).

## Law line

**Telemetry observes doorway assists only. Opening a workspace is not running the project.**
