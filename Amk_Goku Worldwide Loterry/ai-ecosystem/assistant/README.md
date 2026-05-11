<!-- Z: Amk_Goku Worldwide Loterry\ai-ecosystem\assistant\README.md -->

# Assistant Integration

Use `ai-ecosystem/assistant/prediction_adapter.py` to load the latest cached predictions and feed them into polite assistant responses, AI tuning prompts, or avatar narratives.

Example usage:

```python
from ai_ecosystem.assistant import prediction_adapter

entry = prediction_adapter.latest_prediction("euromillions")
if entry:
    print(prediction_adapter.summarize(entry))
```

The adapter exposes:

- `load_cached_predictions([format_code])` – returns every cache entry (filtered by format if requested).

- `latest_prediction(format_code)` – quickly grabs the newest snapshot for a specific lottery.

- `summarize(entry)` – builds human-friendly copy for UI/assistant prompts.

Pair these with `docs/testing.md` to explain how trust scores were computed so the assistant can report both predictions and confidence.
