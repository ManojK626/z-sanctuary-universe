<!-- Z: Amk_Goku Worldwide Loterry\core-engine\history\README.md -->

# History Module

Provides lightweight ingestion helpers for sample draw history. `fetch_mock.py` reads `data/histories/euromillions.csv`, limits by optional draw count, and caches a JSON snapshot. Use `load_cache` to share the same dataset with prediction engines or analytics.
