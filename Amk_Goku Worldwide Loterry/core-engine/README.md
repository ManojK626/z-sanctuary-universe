<!-- Z: Amk_Goku Worldwide Loterry\core-engine\README.md -->

# Core Engine

This folder hosts the prediction transforms, ingestion helpers, and analytics needed to keep the AMK-Goku lottery logic grounded in real draws and patterns.

- `prediction/`: cold-number engine, LPBS layering, and quick CLI harness.

- `config/global-formats/`: format definitions for EuroMillions-style tickets (number ranges, lucky numbers, draw cadence).

- `history/`: mock ingestion helper (`fetch_mock.py`) that caches a JSON snapshot derived from `data/histories/euromillions.csv`.

- `analytics/`: heatmap reporting + category frequency scaffolding to compare cold/hot bands.

## Quick start

1. Run the history ingestor to cache the sample draws:

   ```bash
   python history/fetch_mock.py
   ```

   This writes `core-engine/history_cache.json` and prints the draw count.

2. Generate a prediction report:

   ```bash
   python prediction/engine.py --history ../data/histories/euromillions.csv --lookback 12
   ```

   That command highlights cold numbers, lucky numbers, and LPBS-generated lines.

3. Explore analytics:

   ```bash
   python analytics/heatmap.py --history ../data/histories/euromillions.csv
   ```

   Heatmap bands show how numbers distribute across A-D categories.

## Supporting datasets

Place every lottery’s draw history CSV inside `data/histories/` and point each format’s `"history"` field to that file (e.g., `data/histories/euromillions.csv`). The CSV should include `draw_date`, `main_1..5`, and the canonical `bonus_1..bonus_2` columns (legacy `lucky_*` names are aliased automatically). You can now drop Mauritius Loto Vert, La Primitiva, UK Lotto, and additional formats by adding a matching JSON under `core-engine/config/global-formats/` and referencing the normalized CSV path.

Automation for La Primitiva and Mauritius Loto Vert lives in `core-engine/ingest/downloaders`. Those scripts attempt to scrape the official results pages before downloading CSV exports, so you can keep the folders current via `python core-engine/ingest/downloaders/run_all.py`. If automation still fails, you can rely on the validation UI (`streamlit run core-engine/ingest/streamlit_validate.py`) to inspect the manual CSV before ingestion.

## World Observer feed

The pipeline now refreshes a lightweight global news feed after each run. Run `python core-engine/world_observer/fetch.py` manually (or let the pipeline call it) to populate `data/world_observer/news.json` and `summary.json`. View the latest observational stories in a dedicated UI at `ui/world_observer.html` (open it in a browser pointing to the repo root or serve the directory). The fetch first tries the InShorts API and, if it returns a 402, falls back to Reddit’s `/r/worldnews/top` feed; both sources are observational only, no predictions.

Combined with additional JSON definitions (e.g., `core-engine/config/global-formats/eurojackpot.json` and `global-sevens.json`) and the automation pipeline, this makes the prediction engine ready for every lottery once your real histories land under `data/histories/`.
