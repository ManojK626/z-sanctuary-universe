# Z Data Layout Governance

## Purpose

Keep all folders and file formats organized into stable groups so discovery, automation, and audits stay reliable as modules scale.

## Source of Truth

- Policy: `config/z_data_layout_policy.json`
- Audit script: `scripts/z_data_layout_audit.mjs`
- Reports:
  - `data/reports/z_data_layout_audit.json`
  - `data/reports/z_data_layout_audit.md`

## Operating Rule

- Audit-only by default (`mode: audit-only`).
- No automatic file moves.
- Fix structure using review -> verify -> apply.

## Grouping Model

- `code`: runtime and automation logic
- `docs`: human-readable governance and guidance
- `data`: machine-readable reports and registries
- `web`: UI and presentation files
- `config`: operational policy/settings
- `archive`: compressed outputs
- `binary`: static artifacts
- `unknown`: requires review

## Daily Habit

Run `Z: Data Layout Audit` and keep:

- unknown files under threshold
- ungrouped files under threshold
- status at `green`
