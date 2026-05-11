# Z Hygiene Status

Generated: 2026-04-26T01:56:10.035Z
Status: HOLD

## Checks

- [x] privacy_raw_empty: uploads/raw files=0
- [x] privacy_report_recent: privacy report age=0m
- [x] pending_audit_clear: pending total=0
- [x] autorun_enabled: task.allowAutomaticTasks=on
- [x] autorun_tasks_present: auto tasks=1
- [x] procurement_daily_present: procurement report=present
- [ ] data_layout_green: layout status=hold
- [ ] storage_hygiene_green: storage status=hold
- [x] canonical_alias_green: alias status=green
- [x] placeholder_dirs_green: placeholder status=green
- [ ] extension_guard_green: extension guard status=hold
- [x] data_leak_audit_green: data leak status=green
- [x] security_sentinel_not_critical: sentinel status=warn
- [x] anydevices_analyzer_recent: anydevices analyzer age=7m
- [x] anydevices_security_not_blocked: anydevices security status=green
- [x] anydevices_security_recent: anydevices security age=7m

## Metrics

- raw_files: 0
- privacy_report_age_min: 0
- pending_total: 0
- auto_tasks: 1
- anydevices_analyzer_age_min: 7
- anydevices_security_age_min: 7

Notes: Hygiene drift detected. Resolve failed checks before running heavy processing.
