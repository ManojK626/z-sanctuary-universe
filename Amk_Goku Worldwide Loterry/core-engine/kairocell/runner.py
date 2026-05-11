"\"\"\"Produce a high-level KAIROCELL summary from the core metrics.\"\"\""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable, List

from .logic import aggregate_ring, describe_lottery

REPO_ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = REPO_ROOT / 'data'
METRICS_DIR = DATA_DIR / 'metrics'
SUMMARY_DIR = DATA_DIR / 'kairocell'
SUMMARY_PATH = SUMMARY_DIR / 'summary.json'


def gather_metrics(metrics_dir: Path) -> List[dict]:
    metrics = []
    if not metrics_dir.exists():
        return metrics
    for path in sorted(metrics_dir.glob('*.metrics.json')):
        try:
            metrics.append(json.loads(path.read_text()))
        except json.JSONDecodeError:
            continue
    return metrics


def build_kairocell_summary(
    run_id: str,
    metrics_override: Iterable[dict] | None = None,
    summary_dir: Path | None = None,
) -> Path:
    summary_dir = summary_dir or SUMMARY_DIR
    summary_dir.mkdir(parents=True, exist_ok=True)

    metrics_list = list(metrics_override) if metrics_override is not None else gather_metrics(METRICS_DIR)
    entries = [describe_lottery(metrics) for metrics in metrics_list]
    summary = {
        'run_id': run_id,
        'generated_at': datetime.now(timezone.utc).isoformat(),
        'lotteries': entries,
        'ring': aggregate_ring(tuple(entries)),
    }

    summary_path = summary_dir / 'summary.json'
    backup_path = summary_dir / f'summary_{run_id}.json'
    summary_path.write_text(json.dumps(summary, indent=2))
    backup_path.write_text(json.dumps(summary, indent=2))
    return summary_path
