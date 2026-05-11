# Z Security Sentinel Pack

## Scope

Security hardening bundle for continuous alertness:

- token revocation controls
- canonical/alias integrity checks
- placeholder-directory integrity checks
- quad-lane runtime dispatch profile
- non-destructive attack simulation checks

## Components

- `core/z_request_access_gate.js` (revocation-aware)
- `config/z_request_access_revocations.json`
- `scripts/z_access_token_revoke.mjs`
- `scripts/z_canonical_alias_audit.mjs`
- `scripts/z_placeholder_dir_audit.mjs`
- `scripts/z_security_sentinel.mjs`
- `scripts/z_security_attack_sim.mjs`
- `scripts/z_runtime_lane_dispatch.mjs`

## Reports

- `data/reports/z_security_sentinel.json`
- `data/reports/z_security_alerts.json`
- `data/reports/z_security_alerts.jsonl`
- `data/reports/z_security_attack_sim.json`
- `data/reports/z_canonical_alias_audit.json`
- `data/reports/z_placeholder_dir_audit.json`
- `data/reports/z_runtime_lane_dispatch.json`

## Operating Rule

Everything runs audit-first and report-first.
No destructive response is automatic.
