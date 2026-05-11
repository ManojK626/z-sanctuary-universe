<!-- Z: Amk_Goku Worldwide Loterry\docs\automation.md -->

# Automation & scheduling

`core-engine/pipeline.py` orchestrates the entire prediction lifecycle:

1. Re-runs `core-engine/history/fetch_mock.py` (unless `--skip-ingest`) to refresh the cached draw history.
2. Executes `core-engine/prediction/engine.py` for every JSON in `core-engine/config/global-formats/`, writing `{code}_predictions.json` snapshots under `core-engine/prediction/cache/`.
3. Launches `core-engine/analytics/verify_cache.py --output docs/prediction-verification.json` to compute trust percentages and optionally store the summary.

Example:

```bash
python core-engine/pipeline.py --lines 5 --lookback 20 --main-depth 16 --lucky-depth 10 --hot-bias 0.08 --cold-bias 1.2
```

This command rewrites every cache file, recomputes metrics, simulation deltas, regional summaries, and publishes `docs/prediction-verification.json` plus the trust bundle (and AI commentary artifacts in `data/reports/commentary/`), powering the dashboards, AI assistant, and trust reporting layers.

## Scheduling

- **Windows Task Scheduler**: create a daily task that runs your Python interpreter with the pipeline script as shown above. Ensure the working directory is the repo root.

- **Cron / Linux**: add a cron entry such as `0 0 * * * /usr/bin/python3 /path/to/core-engine/pipeline.py --lines 5 ... >> /path/to/log`.

- **Streamlit / background workers**: call the pipeline via `[subprocess.run](https://docs.python.org/3/library/subprocess.html)` from a background thread, or wrap it into a `run_pipeline.sh` script invoked by Streamlit’s `add_script_run_ctx`.

## Automation tips

- Keep real draw CSVs in `data/histories/` and update each format JSON’s `history` field to point there. When you receive new draw files, drop them into `data/incoming/` and run `python core-engine/ingest/ingest_histories.py` to validate, normalize to the canonical schema (draw_date + mains + bonus_1/bonus_2), compute schema and history hashes, and sync the JSON reference automatically. After that completes, rerun `python core-engine/pipeline.py`, which now also emits AI commentary into `data/reports/commentary/`.

- After every automatic run, surface `docs/prediction-verification.json` into the UI/dashboards so players understand the confidence.

- Reuse the pipeline script from CI/CD (GitHub Actions, etc.) so nightly builds back up the latest caches.
