# Z-DOORWAY-2 workspace doorway status

**Generated:** 2026-05-11T20:13:40.127Z

**Overall signal:** HOLD

## Cursor CLI

- **Available:** true

## Doorway session telemetry (Z-DOORWAY-3)

- **Log:** `data/reports/z_doorway_session_log.jsonl`
- **Lines (window):** 2
- **Partial file read (tail):** no
- **Window truncated:** no
- **First timestamp:** 2026-05-11T20:12:10.0059993Z
- **Last timestamp:** 2026-05-11T20:13:31.3329191Z
- **By result:** `{"opened":2}`
- **By id:** `{"ssws_hub_workspace":2}`

## Entries

| id | enabled | status | type | path_exists | open_eligible | signal | first issue |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ssws_hub_workspace | true | GREEN | workspace | true | true | GREEN | — |
| ssws_hub_folder | true | GREEN | folder | true | true | GREEN | — |
| example_hold_lane | true | HOLD | folder | true | false | HOLD | HOLD — AMK / operator decision before open. |
| example_red_blocked | false | RED | folder | false | false | DISABLED | Registry entry disabled — skip for open planning. |
| nas_workspace_declaration | false | NAS_WAIT | workspace | false | false | DISABLED | Registry entry disabled — skip for open planning. |

## Law

Doorway metadata only. Open workspace ≠ run project. No npm / git / deploy / NAS write / services.
