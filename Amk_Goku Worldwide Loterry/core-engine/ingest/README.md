<!-- Z: Amk_Goku Worldwide Loterry\core-engine\ingest\README.md -->

# Ingestion Helpers

Place new draw history CSVs inside `data/incoming/` (matching the lottery code, e.g., `powerball.csv`). All incoming files are normalized to the canonical schema (draw_date + main_1…main_5 + bonus_1 + bonus_2). Run:

```bash
python core-engine/ingest/ingest_histories.py
```

The script validates the CSV schema, moves the file into `data/histories/`, updates the matching format JSON’s `history` pointer, and prepares the data for the automation pipeline. Use `--overwrite` to replace an existing history or `--dry-run` to preview the files without moving them.

## Downloader helpers

`core-engine/ingest/downloaders/run_all.py` fetches official archives for Powerball, Mega Millions, and the UK Lotto so you can drop them straight into `data/incoming/` before ingestion. The Powerball and Mega Millions downloaders leverage the New York open-data exports (`d6yy-54nr`, `5xaw-6ayf`) to avoid stale 404 paths. Run the aggregator with:

```bash
python core-engine/ingest/downloaders/run_all.py
```

If a feed is unavailable (La Primitiva, Mauritius Loto Vert, UK Lotto, or other regional lotteries), download the CSV manually, name it after the format code (e.g., `la-primitiva.csv`, `mauritius-loto-vert.csv`, `uk-lotto.csv`), place it in `data/incoming/`, and rerun `ingest_histories.py`.

## Automation helpers

The downloader orchestrator now includes automated attempts for La Primitiva and Mauritius Loto Vert. Each fetch tries to scrape the official results page (via BeautifulSoup) before falling back to CSV exports, so you can keep those histories current with a single command:

```bash
python core-engine/ingest/downloaders/run_all.py
```

If automation still fails, the script falls back to its previous “please fetch manually” message.

### Install dependencies

To run the new automation + validation UI, install:

```bash
python -m pip install requests beautifulsoup4 streamlit
```

## Streamlit validation UI

Run `streamlit run core-engine/ingest/streamlit_validate.py` to launch an interactive preview. The UI lists every file in `data/incoming/`, highlights missing canonical columns, infers the “winning numbers” column, and shows normalized sample rows (no file modifications are made).

## CSV validation preview

Before ingesting, you can preview any incoming CSV with the validation helper:

```bash
python core-engine/ingest/validate_csv.py
```

Or use the Streamlit UI launcher to open a visual preview:

```bash
python scripts/preview_streamlit.py
```

The Streamlit app lists every file in `data/incoming/`, shows header mappings and canonical coverage, infers the winning-number column, and displays normalized sample rows so you can detect HTML downloads, renamed columns, or blank columns before the main ingestor runs.
