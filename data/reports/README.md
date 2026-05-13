# Z-Sanctuary Reports Vault

This folder is the official history ledger for the Z-Sanctuary Universe.
It stores all system status outputs, audits, merge logs, and reflection reports.

## What belongs here

- Status snapshots (e.g., `z_final_status.json`)
- Autopilot and SSWS reports
- Zuno daily/weekly reflections
- Vault audits and integrity logs
- Merge records and system change notes

## What does NOT belong here

- Source code
- Large raw datasets
- Build artifacts

## Naming conventions

- `z_*.json` for machine-readable status
- `z_*.md` for human-readable reports
- `*_log.md` for merge/change records

## Auto-indexing

The vault is indexed via:

- `reports_manifest.json` (machine-readable)
- `INDEX.md` (human-readable)

## Canonical References (Unified)

Single-source references used across reports, docs, and schedules to reduce drift:

<!-- Z:CANONICAL_START -->

- `z_final_status.json` (overall status)
- `z_zuno_daily_report.md` (daily human summary)
- `z_weekly_reflection.md` (weekly reflection)
- `z_ssws_daily_report.json` (SSWS health)
- `z_autorun_audit.json` (autopilot state)
- `formula_vault_audit.txt` (vault audit)
- `reports_manifest.json` (reports inventory)
- `z_html_security_audit.md` (html security audit)
- `z_html_security_audit.json` (html security audit data)
- `z_core_engine_audit.md` (core engine audit)
- `z_core_engine_audit.json` (core engine audit data)
<!-- Z:CANONICAL_END -->

## Tags

Reports are tagged automatically (health, trust, autopilot, ai, reflection, index).
Tagging is derived from filename patterns in `reports_vault_refresh.py`.

## Retention

Reports older than 90 days are archived into:
`data/reports/_archive/`
Core index files are never archived.

## Principle

If it affects system truth, it must be recorded here.
