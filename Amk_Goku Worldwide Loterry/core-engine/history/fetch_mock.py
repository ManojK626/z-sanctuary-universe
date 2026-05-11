"""History ingestion helpers for the prediction engine."""
from __future__ import annotations

import csv
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Dict


def parse_draw(row: Dict[str, str]) -> Dict[str, object]:
    return {
        "date": row["draw_date"],
        "main": [int(row[f"main_{i}"]) for i in range(1, 6)],
        "lucky": [int(row[f"lucky_{i}"]) for i in range(1, 3)]
    }


def ingest_history(csv_path: Path, cache_path: Path, limit: int | None = None) -> None:
    records: List[Dict[str, object]] = []
    with csv_path.open() as fh:
        reader = csv.DictReader(fh)
        for idx, row in enumerate(reader):
            if limit and idx >= limit:
                break
            records.append(parse_draw(row))

    payload = {
        "generated": datetime.now(timezone.utc).isoformat(),
        "source": str(csv_path.name),
        "total": len(records),
        "draws": records,
    }
    cache_path.write_text(json.dumps(payload, indent=2))
    print(f"Cached {len(records)} draws to {cache_path}")


def load_cache(cache_path: Path) -> Dict[str, object]:
    if not cache_path.exists():
        raise FileNotFoundError(f"Cache missing: {cache_path}")
    return json.loads(cache_path.read_text())


if __name__ == "__main__":
    history_csv = Path(__file__).resolve().parents[2] / "data" / "histories" / "euromillions.csv"
    cache_file = Path(__file__).resolve().parents[1] / "history_cache.json"
    ingest_history(history_csv, cache_file)
