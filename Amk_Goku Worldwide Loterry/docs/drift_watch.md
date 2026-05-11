<!-- Z: Amk_Goku Worldwide Loterry\docs\drift_watch.md -->

# Drift Watch Visualization

Use `python scripts/drift_watch_viz.py` to turn the historical `data/drift_watch/drift_*.json` summaries into a simple Plotly chart. The script writes `ui/drift_watch.html`, which plots the average frequency/gap/pair entropy over every pipeline run. The chart is read-only: it presents the “climate” of the observatory without any automated actions.

Steps:

1. Run the pipeline at least once so `data/drift_watch/drift_<run_id>.json` files exist.
2. Execute `python scripts/drift_watch_viz.py`; the script aggregates each run and writes the interactive HTML.
3. Open `ui/drift_watch.html` in your browser (serve the repo or open via file://). The Plotly chart shows the drift signal per run, helping analysts interpret the observatory without touching predictions.

The HTML file is static and safe to share; every new pipeline run should be followed by this script if you want an updated view.
