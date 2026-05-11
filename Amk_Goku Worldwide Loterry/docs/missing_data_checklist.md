<!-- Z: Amk_Goku Worldwide Loterry\docs\missing_data_checklist.md -->

# Missing Lottery Data Checklist

## Current Status

- Powerball: header-only (no draws)
- Mega Millions: header-only (no draws)
- UK Lotto: missing
- La Primitiva: missing
- Mauritius Loto Vert: missing
- Eurojackpot: missing
- Euromillions: missing
- Global Sevens: missing

## Required Files (drop into data/incoming/)

- uk-lotto.csv
- la-primitiva.csv
- mauritius-loto-vert.csv
- eurojackpot.csv
- euromillions.csv
- global-sevens.csv

## Replace Existing (data/histories/)

- powerball.csv (must include draw rows)
- mega-millions.csv (must include draw rows)

## After Data Drop (run in order)

1. python core-engine/ingest/ingest_histories.py
2. python core-engine/pipeline.py
3. python scripts/jailcell_public_summary.py
4. python scripts/validate_inspection.py --validate

## Validation Targets

- data/histories/\*.csv contains > 1 line
- data/metrics/\*.metrics.json shows draws_count > 0
- data/reports/trust/trust*bundle*<run_id>.json updated
- docs/prediction-verification.json updated
