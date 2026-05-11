<!-- Z: Amk_Goku Worldwide Loterry\core-engine\prediction\README.md -->

# Prediction Module

`engine.py` orchestrates the AMK-Goku prediction workflow with LPBS tuning knobs, local caches, and format-driven configuration.

1. Load all JSON definitions from `core-engine/config/global-formats/` so the engine knows each draw’s `main`/`lucky` counts, ranges, and optional `draw_schedule`.
2. Read history CSVs (a sample lives at `data/euro_draws_sample.csv`) and compute cold/hot frequencies per format.
3. Generate LPBS suites with adjustable depth, hot bias, and main/lucky weighting, then cache the results per format under `core-engine/prediction/cache/`.

## Running predictions

```bash
python engine.py \
  --history ../../data/euro_draws_sample.csv \
  --config-dir ../../core-engine/config/global-formats \
  --format euromillions \
  --lookback 20 \
  --lines 5 \
  --main-depth 16 \
  --lucky-depth 10
```

Extra flags:

- `--no-hot`: drop the hot-number bias to focus strictly on cold shelves.

- `--hot-bias` / `--cold-bias`: fine-tune the scoring formula.

- `--cache-dir`: override the cache folder (default: `core-engine/prediction/cache`).

### Cache and history

Each run writes `{format_code}_predictions.json` under the cache folder with the generated lines, settings, timestamp, and source history. Reuse those caches from dashboards or AI agents so you never reprocess the same draws twice.

Add more JSON formats to `core-engine/config/global-formats` to extend coverage — each file must declare `name`, `code`, `main`, `lucky`, and optional `draw_schedule`.

You can now target other formats with the same CLI:

```bash
python engine.py --format eurojackpot --history ../../data/eurojackpot_sample.csv --lines 3
python engine.py --format global-sevens --history ../../data/global_sevens_sample.csv --lines 3
```

Each run writes `core-engine/prediction/cache/{format}_predictions.json`, making it trivial for dashboards or AI modules to pick up the latest output.
