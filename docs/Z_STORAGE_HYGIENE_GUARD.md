# Z Storage Hygiene Guard

## Purpose

Detect and safely contain storage risks:

- duplicate files (same content hash)
- repeated names across folders
- empty files/folders
- potentially unrelated data artifacts

## Script

- `scripts/z_storage_hygiene_guard.mjs`

## Policy

- `config/z_storage_hygiene_policy.json`

## Reports

- `data/reports/z_storage_hygiene_audit.json`
- `data/reports/z_storage_hygiene_audit.md`

## Modes

- Default: `audit` (no file changes)
- Safe cleanup: `--apply --confirm`
  - moves duplicate copies, empty files, and unrelated flags to:
  - `safe_pack/z_sanctuary_vault/storage_hygiene/quarantine/<timestamp>/...`
  - removes empty directories only after safe moves

## Commands

- `npm run storage:hygiene`
- `npm run storage:hygiene:apply`

## Rule

Audit runs automatically with SSWS. Cleanup is always explicit and confirm-gated.
