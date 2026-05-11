# Z Trouble Maker Scan

Generated: 2026-04-17T16:54:54.344Z
Status: GREEN
Risk class: low
Disturbance score: 0

## Summary

- Checks pass: 6/6
- Folder-open autoruns: 1

## Checks

- PASS single_folder_open_autorun: folder-open tasks=1
- PASS workspace_root_canonical: hub_ok=C:\Cursor Projects Organiser\ZSanctuary_Universe
- PASS boot_chain_no_dangerous_tokens: no --force/--apply-actions in boot chain
- PASS formula_registry_internal_only: status=internal-only
- PASS folder_policy_internal_only: mode=internal-only
- PASS critical_reports_fresh: critical reports within freshness window

## Freshness

- z_ssws_daily_report.json: 2.82h
- z_ai_status.json: 2.82h
- z_autorun_audit.json: 0.01h
- z_policy_shadow_gate.json: 0.01h
- z_otel_shadow_status.json: 0h

Operational note: advisory scan only, no runtime mutation.
