<!-- Z: Amk_Goku Worldwide Loterry\docs\integration.md -->

# Integration Notes

## Prediction outputs

- Store every run of `core-engine/prediction/engine.py` in `core-engine/prediction/cache/{format}_predictions.json` so all downstream modules have the same atomic data.

- Run `core-engine/analytics/verify_cache.py` after updates; it summarizes the trust score that should be displayed alongside prediction lines.

## AI assistant

- Import `ai-ecosystem/assistant/prediction_adapter.py` to pull the latest cached lines and generate conversational copy. The adapter already understands the cache layout and produces simple summaries (main/lucky combos, history file, timestamp).

- Tie the trust metrics from step 1 into the AI response so the assistant can explain the confidence level in human terms.

## UI/dashboard

- The lottery dashboard loads the cache files and verification results to show up-to-date lines with trust percentages. For live deployments, schedule the prediction engine to refresh caches and rerun the verification script, then refresh the UI data store.

- The Eco/AI dashboards can reuse the same adapter to display predictions in localized languages or avatar personas.

## Documentation & manuals

- Link `docs/testing.md` and `docs/integration.md` (this file) inside the user manual (`ui/manual/` assets) so operators know how to regenerate predictions, inspect caches, and see trust scores.

## Automation & Next steps

1. Expand the cache directory with real global datasets for each desired lottery.
2. Run `core-engine/pipeline.py` (see `docs/automation.md`) on a schedule to ingest, predict, and verify before refreshing the UI/AI dashboards.
3. Connect these caches to automation (AI assistant, avatar, scheduler) so the entire Z-Sanctuary stack relies on the same single source of truth.
