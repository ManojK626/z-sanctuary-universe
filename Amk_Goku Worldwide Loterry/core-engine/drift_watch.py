"""Track entropy drift across runs."""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List

REPO_ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = REPO_ROOT / "data"
DRIFT_DIR = DATA_DIR / "drift_watch"
SUMMARY_FILE = DRIFT_DIR / "summary.json"


def gather_metrics(metrics_dir: Path) -> List[Dict[str, object]]:
    entries: List[Dict[str, object]] = []
    for path in sorted(metrics_dir.glob("*.metrics.json")):
        try:
            payload = json.loads(path.read_text())
        except json.JSONDecodeError:
            continue
        entries.append(
            {
                "code": payload["lottery_code"],
                "run_id": payload["run_id"],
                "frequency": payload["entropy"]["frequency_entropy"],
                "gap": payload["entropy"]["gap_entropy"],
                "pair": payload["entropy"]["pair_entropy"],
            }
        )
    return entries


def run_drift_watch(run_id: str, metrics_dir: Path) -> Path:
    DRIFT_DIR.mkdir(parents=True, exist_ok=True)
    entries = gather_metrics(metrics_dir)
    summary = {
        "run_id": run_id,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "entries": entries,
    }
    summary_path = DRIFT_DIR / f"drift_{run_id}.json"
    summary_path.write_text(json.dumps(summary, indent=2))
    SUMMARY_FILE.write_text(json.dumps(summary, indent=2))
    return summary_path