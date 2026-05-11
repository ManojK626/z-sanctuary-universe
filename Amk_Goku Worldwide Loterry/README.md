<!-- Z: Amk_Goku Worldwide Loterry\README.md -->

# Z-Sanctuary Universe

A living ecosystem of prediction tools, AI assistants, eco campaigns and marketplace services centered on the **AMK-Goku Saiyan Lottery Prediction** experience.

## Structure overview

- `core-engine/`: prediction logic, global lottery formats, draw history ingestion, analytics and reporting modules.

- `ai-ecosystem/`: assistants, avatars, calendars, wellness and finance companions, behavioral feedback loops.

- `marketplace/`: campaigns, referral engines, eco-impact initiatives, vendor dashboards, payments, and monetization.

- `ui/`: mockups, manual text, multilingual assets for lottery, eco, and AI-focused experiences.

- `data/`: historical draw CSVs, mock datasets, ingestion helpers.

- `docs/`: architectural notes, data sources, security guides and launch checklist, plus `global_lotteries.md` that catalogs the formats the pipeline can cover today.

- `roadmap/`: phased plan for upgrades, MVP launches, and global expansion sequences.

Every submodule should carry its own README to explain purpose and entry points.

## Validation helper

Use `python scripts/validate_inspection.py` to print a quick summary of `data/incoming/`, `data/histories/`, and the most recent metrics, deltas, and trust bundles. Add `--validate` to also run `core-engine/ingest/validate_csv.py` (with the default sample size) so you can preview canonical rows before ingesting new histories.

## Editor governance

Review the editor/tooling authority map in `docs/Z_EDITOR_COVENANT.md` to keep `.vscode/` files stable and prevent formatter conflicts.

## Learning spine

Orientation and Learning Cards are available at:

- `ui/education/orientation.html`
- `ui/education/learning_cards.html`

## Z-Audiology (voice governance)

The Z-Audiology v1.0 charter and policies live in `docs/audiology/`. Core manifests and schemas are in `core/audiology/`.

## Lottery app entry

Open `ui/lottery_app.html` to access the unified HTML entry point for the Lottery Vault, Observatory, Learning, and Trust surfaces.

## Delivery hub

Open `ui/delivery.html` for the single delivery surface (Lottery App, Trust Portal, Trust Walkthrough, and export packs).

## Operations runbook

Use `docs/OPERATIONS_RUNBOOK.md` for daily/weekly/release cadence (no Core v1.0 changes required).

## Observatory reliability

- Mirror every artifact via `python scripts/dual_run.py`; the mirrored copy lives under `data/mirror/` for audits.

- Rebuild reports from raw histories with `python scripts/offline_rebuild.py`.

- Build the Docker container with `docker build -t z-sanctuary:latest .` and run it with `docker run --rm -v $(pwd)/data:/app/data z-sanctuary:latest`; the process installs `requirements.txt` and executes `scripts/deploy_zsanctuary.py`.

- Visualize drift history with `python scripts/drift_watch_viz.py` and open `ui/drift_watch.html` to see the entropy climate; see `docs/drift_watch.md` for details.

## Lottery registry notice

Listed lotteries represent registered formats known to the Z-Sanctuary Observatory.
Registration indicates structural awareness only.

Historical draw data, predictions, or analytics are produced only when verified datasets are ingested and validated.
Absence of data is explicitly tracked and reported as "manual / missing" to preserve integrity.

## Micro-cause logging

- The root cause recorder writes `data/root_causes/root_causes.json` whenever ingestion hits future draws, duplicates, missing columns, or missing configs.

- The Streamlit preview now displays the latest micro-cause events, so analysts can see exactly which low-level checks tripped.

## KAIROCELL overlays & audits

- KAIROCELL summaries are written to `data/kairocell/summary.json` each time the pipeline completes. Use `python core-engine/pipeline.py` (or `core-engine/pipeline.py` options) to refresh the observatory before opening overlays.

- View the new overlay at `ui/kairocell_overlay.html` to see per-lottery micro phases, confidence bars, and ring-level averages that mirror the KAIROCELL advisory logic.

- Tests covering the KAIROCELL invariants live under `tests/`; run `python -m pytest -q` to exercise the phase/cell helpers plus summary generation.
