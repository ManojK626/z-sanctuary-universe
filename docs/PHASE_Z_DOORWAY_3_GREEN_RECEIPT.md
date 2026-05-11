# Phase Z-DOORWAY-3 — Green receipt (doorway telemetry and session receipts)

**Formal scope:** Local **observation only** for workspace doorway **`-Apply`** use: optional JSON Lines receipts and a **read-only telemetry summary** in `z:doorway:status`. No npm lifecycle, deploy, git mutation, extensions, services, NAS writes, secrets, env capture, or arbitrary disk scans.

## Deliverables

| Item | Location |
| --- | --- |
| Policy | [`docs/Z_DOORWAY_3_TELEMETRY_POLICY.md`](Z_DOORWAY_3_TELEMETRY_POLICY.md) |
| Example log (shape) | [`data/reports/z_doorway_session_log.example.jsonl`](../data/reports/z_doorway_session_log.example.jsonl) |
| Opener updates | [`scripts/z_open_workspace_safe.ps1`](../scripts/z_open_workspace_safe.ps1) (`-SessionLog` with `-Apply` only) |
| Status updates | [`scripts/z_doorway_workspace_status.mjs`](../scripts/z_doorway_workspace_status.mjs) (`doorway_telemetry` when log exists) |
| Local log ignore | [`.gitignore`](../.gitignore) (`data/reports/z_doorway_session_log.jsonl`) |

## npm scripts (unchanged)

- `npm run z:doorway:status`
- `npm run z:doorway:dry`

## Gates run (required)

- `npm run verify:md`
- `npm run z:doorway:status`
- `npm run z:doorway:dry`
- `npm run z:traffic`
- `npm run z:car2`

Evidence (hub gates from repo root):

```text
2026-05-11: verify:md pass; z:doorway:status ok (overall_signal HOLD); z:doorway:dry ok; z:traffic overall_signal GREEN; z:car2 ok (files_scanned: 3260)
```

## Posture checklist

| Check | Confirm |
| --- | --- |
| Dry-run remains default | Yes |
| `-Apply` still requires explicit `-Id` | Yes |
| Session lines omit paths, secrets, env, tokens, output, project contents | Yes |
| No npm / deploy / git / extensions / services / NAS writes | Yes |
| No arbitrary scans (status reads tail of log only) | Yes |

## Rollback

Remove or revert the files above; delete local `data/reports/z_doorway_session_log.jsonl` if present. Opener behavior without `-SessionLog` matches Z-DOORWAY-2.
