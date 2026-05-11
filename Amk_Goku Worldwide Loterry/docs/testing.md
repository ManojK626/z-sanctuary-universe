<!-- Z: Amk_Goku Worldwide Loterry\docs\testing.md -->

# Testing & Verification

1. Run `python core-engine/history/fetch_mock.py` to cache the draw CSVs.
2. Generate predictions for every format:

   ```bash
   python core-engine/prediction/engine.py --format euromillions --history data/histories/euromillions.csv
   python core-engine/prediction/engine.py --format eurojackpot --history data/histories/eurojackpot.csv
   python core-engine/prediction/engine.py --format global-sevens --history data/histories/global-sevens.csv
   ```

3. Evaluate the cached lines with `python core-engine/analytics/verify_cache.py` (add `--output docs/prediction-verification.json` to persist the summary).
4. Or run the full pipeline with `python core-engine/pipeline.py` to ingest history, refresh every cache, and recreate the verification report (`docs/prediction-verification.json`).

The verification script reports a trust score per format and how many times each predicted number appeared inside your cached history; use those trust percentages to tune `LPBSConfig` (`hot_bias`, `cold_bias`, depths, etc.) per lottery.

The full pipeline now also emits:

- `data/metrics/<lottery>.metrics.json` (entropy readings)

- `data/reports/deltas/<lottery>.delta.json` (simulation vs real deltas)

- `data/reports/trust/trust_bundle_<run_id>.json` (trust bundle)

- `data/reports/commentary/<lottery>.<run_id>.commentary.json` / `.md` (AI commentary tied to the bundle)
