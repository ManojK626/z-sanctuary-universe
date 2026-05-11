"""Bridge for AI assistants and UI modules to consume cached predictions."""
from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from typing import List, Dict, Optional

CACHE_DIR = Path(__file__).resolve().parents[2] / "core-engine" / "prediction" / "cache"


@dataclass
class PredictionEntry:
    format: str
    generated: str
    history: str
    lines: List[Dict[str, List[int]]]


def load_cached_predictions(format_code: Optional[str] = None) -> List[PredictionEntry]:
    results: List[PredictionEntry] = []
    for cache_file in sorted(CACHE_DIR.glob("*.json")):
        payload = json.loads(cache_file.read_text())
        if format_code and payload.get("format") != format_code:
            continue
        results.append(PredictionEntry(
            format=payload.get("format", cache_file.stem.replace("_predictions", "")),
            generated=payload.get("generated", ""),
            history=payload.get("history", ""),
            lines=payload.get("lines", []),
        ))
    return results


def latest_prediction(format_code: str) -> Optional[PredictionEntry]:
    entries = load_cached_predictions(format_code)
    return entries[-1] if entries else None


def summarize(entry: PredictionEntry) -> str:
    if not entry.lines:
        return f"{entry.format} has no cached lines yet."
    main = ", ".join(str(num) for num in entry.lines[0].get("main", []))
    lucky = ", ".join(str(num) for num in entry.lines[0].get("lucky", []))
    return f"Cached {len(entry.lines)} lines for {entry.format} (history {entry.history}); primary line main=[{main}] lucky=[{lucky}]."


if __name__ == "__main__":
    predictions = load_cached_predictions()
    for entry in predictions:
        print(summarize(entry))
