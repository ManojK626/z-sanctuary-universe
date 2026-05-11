<!-- Z: Amk_Goku Worldwide Loterry\data\lottery_vault\README.md -->

# Lottery Storage Vault

This vault stores raw and normalized lottery histories in a stable structure.

Structure:

- `region/lottery/raw/` contains source CSVs as downloaded or dropped.
- `region/lottery/normalized/` contains canonical CSVs with:
  `draw_date, main_1..main_5, bonus_1, bonus_2`.

Update workflow:

1. Auto sync (supported sources):
   - Run: `python scripts/lottery_vault_sync.py --stage-incoming`
2. Manual sources:
   - Drop the official CSV into `raw/`.
   - Run: `python scripts/lottery_vault_sync.py --normalize-only --stage-incoming`

Notes:

- This vault is read-only by default for pipelines.
- Ingest uses `data/incoming/*.csv` as the staging area.
- Source status and method are declared in `registry.json`.
