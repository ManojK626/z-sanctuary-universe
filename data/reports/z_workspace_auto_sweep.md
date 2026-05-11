# Z Workspace Auto Sweep

- Generated: 2026-03-18T19:44:17.140Z
- Status: GREEN
- Workspace: CORE
- Role: production
- Checks: 8
- Passed: 8
- Failed: 0
- Summary: all checks passed

## Checks

- [x] workspace_guard | exit=0 | Multi-Workspace Guard
- [x] extension_guard | exit=0 | VS Code Extension Guard
- [x] web_readiness | exit=0 | Web Readiness Check
- [x] lab_task_guard | exit=0 | Lab Task Structure Guard
- [x] workspace_timeguard | exit=0 | Workspace Timeguard
- [ ] slo_guard | exit=1 | SLO Guard
- [x] provenance_check | exit=0 | Provenance Check
- [x] incident_triage | exit=0 | Incident Triage

## Broadcast

- Status: OK
- Command: `C:\Program Files\nodejs\node.exe scripts/z_workspace_broadcast_publish.mjs --notice=CORE auto-sweep GREEN: all checks passed --version=0.2 --impact=low --review=false`
