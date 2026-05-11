<!-- Z: Amk_Goku Worldwide Loterry\docs\release_notes.md -->

# Release Notes — Z-Sanctuary Observatory

## Key deliverables

- **End-to-end pipeline lock-in** — ingestion (including automated downloaders + pre-ingest validation helper), predictions, metrics, region summaries, simulation delta reports, trust bundles, commentary, and the world-observer feed now run sequentially via `core-engine/pipeline.py`.

- **KAIROCELL observability** — core metrics now feed `data/kairocell/summary.json`, which the new overlay page (`ui/kairocell_overlay.html`) renders to show per-lottery phases, confidence meters, micro-cell badges, and aggregate ring averages. Everything is logged immutably for Chronicle / Super Ghost review.

- **Validation & QA tooling** — `scripts/validate_inspection.py` summarizes incoming/historic data and can trigger `core-engine/ingest/validate_csv.py`; `tests/` guard key invariants for the KAIROCELL logic and summary generator. A helper deployment script (`scripts/deploy_zsanctuary.py`) now runs downloader → ingest → pipeline for repeatable deliveries.

- **Micro-cause & drift watch** — root causes are captured under `data/root_causes/root_causes.json` and shown inside the Streamlit validator, while `data/drift_watch/` records entropy changes across runs so KAIROCELL understands long-term movement.

- **Reliability & packaging** — `scripts/dual_run.py` mirrors every artifact, `scripts/offline_rebuild.py` refreshes reports from histories, and a `Dockerfile` with `requirements.txt` enables containerized deployments described in `docs/deployment.md`.

- **Documentation refresh** — README highlights the validation helper, new overlay, and test command so stakeholders can re-run the full observatory with confidence.

## Testing

- `python -m pytest -q` (5 tests) — passes, ensuring the KAIROCELL invariants behave as expected.

```bash
python scripts/deploy_zsanctuary.py
```

- For production pushes run the deployment script after refreshing history downloads.
