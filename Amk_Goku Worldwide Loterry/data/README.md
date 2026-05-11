<!-- Z: Amk_Goku Worldwide Loterry\data\README.md -->

# Data Assets

Store every lottery history CSV in `data/histories/` so the ingestion + prediction pipeline can access them. Drop incoming files into `data/incoming/`; run `core-engine/ingest/ingest_histories.py` to normalize them to the canonical column order (draw_date, main_1…main_5, bonus_1, bonus_2), validate the schema, compute hashes, and refresh the format’s `"history_file"` + `"history_hash"` pointer. Before ingesting, you can preview each CSV with `python core-engine/ingest/validate_csv.py` to check headers and normalized samples without altering any files.

- `data/histories/euromillions.csv`, `eurojackpot.csv`, `global-sevens.csv`, etc., are your primary draw sources.

- Each CSV must include `draw_date`, `main_1` through `main_5`, and `bonus_1` through `bonus_2` columns (legacy `lucky_*` names are aliased during ingest).

- When you add a new format JSON in `core-engine/config/global-formats/`, set its `"history"` attribute to the matching path in `data/histories/`.

- Use `core-engine/pipeline.py` (or run ingestion/prediction manually) after replacing the sample files so caches and verification stay in sync.

- World-observer news is stored under `data/world_observer/`. The pipeline refreshes it when you run, or you can trigger `python core-engine/world_observer/fetch.py` manually; open `ui/world_observer.html` in your browser to read the latest observational headlines. The fetch tries the InShorts API first and automatically falls back to Reddit’s `r/worldnews/top` feed if the primary endpoint returns a 402.
