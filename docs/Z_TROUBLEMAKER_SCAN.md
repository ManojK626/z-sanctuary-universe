# Z Trouble Maker Scan

Advisory disturbance watch for Z-Sanctuary.  
This scan is read-only and does not mutate runtime behavior.

## Purpose

- Detect startup/task-chain disturbances.
- Detect protocol drift from `internal-only` posture.
- Detect stale critical reports.
- Feed Super Ghost and AI status with disturbance signals.

## Outputs

- `data/reports/z_troublemaker_scan.json`
- `data/reports/z_troublemaker_scan.md`
- `data/reports/z_super_ghost_disturbance_feed.json`

## Task

- `Z: Trouble Maker Scan`

Included in `Z: SSWS Auto Boot` for automatic daily posture checks.
