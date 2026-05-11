<!-- Z: Amk_Goku Worldwide Loterry\ui\lottery-dashboard\README.md -->

# Lottery Dashboard

This UI should pull cached lines from `core-engine/prediction/cache/{format}_predictions.json` and trust scores from `docs/prediction-verification.json` (or run `core-engine/analytics/verify_cache.py` on demand). Use `ai-ecosystem/assistant/prediction_adapter.py` to surface friendly copy (primary lines, history file, generation timestamp).

A rendering pipeline could:

1. Read `prediction_adapter.load_cached_predictions(format)` to display the most recent lines.
2. Show the lockstep trust percentage from `analytics/verify_cache.py` output to explain confidence to users.
3. Provide controls for `lookback`, `hot_bias`, and `cold_bias` (mirroring `LPBSConfig`) to let power users tune their predictions.
