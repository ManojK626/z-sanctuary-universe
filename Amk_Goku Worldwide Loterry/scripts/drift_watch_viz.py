"""Generate a simple Plotly visualization for the drift watch summaries."""

from __future__ import annotations

import json
from pathlib import Path

import pandas as pd
import plotly.express as px


DRIFT_DIR = Path("data") / "drift_watch"
OUTPUT = Path("ui") / "drift_watch.html"


def load_drift_data() -> pd.DataFrame:
    rows = []
    for path in sorted(DRIFT_DIR.glob("drift_*.json")):
        payload = json.loads(path.read_text())
        run_id = payload.get("run_id")
        timestamp = payload.get("generated_at")
        entries = payload.get("entries", [])

        if not entries:
            continue

        freq = sum(entry["frequency"] for entry in entries) / len(entries)
        gap = sum(entry["gap"] for entry in entries) / len(entries)
        pair = sum(entry["pair"] for entry in entries) / len(entries)
        rows.append({"run_id": run_id, "timestamp": timestamp, "frequency": freq, "gap": gap, "pair": pair})

    return pd.DataFrame(rows)


def build_plot(df: pd.DataFrame) -> None:
    if df.empty:
        print("No drift files found in data/drift_watch/. Run the pipeline to generate them.")
        return

    df = df.sort_values("timestamp")
    fig = px.line(
        df,
        x="timestamp",
        y=["frequency", "gap", "pair"],
        markers=True,
        title="Drift Watch: entropy over runs",
        labels={"value": "mean entropy", "timestamp": "run timestamp"},
    )
    fig.update_layout(legend_title_text="Entropy signal")
    fig.write_html(OUTPUT, include_plotlyjs="cdn")
    print(f"Drift visualization exported to {OUTPUT}")


def main() -> None:
    df = load_drift_data()
    build_plot(df)


if __name__ == "__main__":
    main()
