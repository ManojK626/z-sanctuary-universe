"""Produce a verifiable trust bundle for each pipeline run."""
from __future__ import annotations

import argparse
import json
from hashlib import sha256
from pathlib import Path
from typing import Any, Dict, List
from datetime import datetime, timezone
from datetime import datetime


def sha256_file(path: Path) -> str:
    return "sha256:" + sha256(path.read_bytes()).hexdigest()


def read_json(path: Path) -> dict:
    return json.loads(path.read_text())


def collect_history_inputs(histories_dir: Path) -> List[Dict[str, Any]]:
    inputs: List[Dict[str, Any]] = []
    for history in sorted(histories_dir.glob("*.csv")):
        inputs.append(
            {
                "path": str(history),
                "hash": sha256_file(history),
                "size": history.stat().st_size,
            }
        )
    return inputs


def collect_formats(formats_dir: Path) -> List[Dict[str, Any]]:
    formats = []
    for fmt in sorted(formats_dir.glob("*.json")):
        formats.append(
            {
                "path": str(fmt),
                "hash": sha256_file(fmt),
                "content": read_json(fmt),
            }
        )
    return formats


def collect_metrics(metrics_dir: Path) -> List[Dict[str, Any]]:
    entries: List[Dict[str, Any]] = []
    for metric in sorted(metrics_dir.glob("*.metrics.json")):
        entries.append(
            {
                "path": str(metric),
                "hash": sha256_file(metric),
                "content": read_json(metric),
            }
        )
    return entries


def collect_deltas(deltas_dir: Path) -> List[Dict[str, Any]]:
    entries: List[Dict[str, Any]] = []
    for delta in sorted(deltas_dir.glob("*.delta.json")):
        entries.append(
            {
                "path": str(delta),
                "hash": sha256_file(delta),
                "content": read_json(delta),
            }
        )
    return entries


def collect_region_summary(region_path: Path) -> Dict[str, Any] | None:
    if not region_path.exists():
        return None
    return {
        "path": str(region_path),
        "hash": sha256_file(region_path),
        "content": read_json(region_path),
    }


def build_bundle(
    run_id: str,
    engine_version: str,
    histories_dir: Path,
    formats_dir: Path,
    metrics_dir: Path,
    deltas_dir: Path,
    trust_dir: Path,
    region_summary: Path,
) -> Path:
    trust_dir.mkdir(parents=True, exist_ok=True)
    bundle = {
        "trust_bundle_version": "1.0",
        "run": {
            "run_id": run_id,
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "engine_version": engine_version,
        },
        "inputs": {
            "histories": collect_history_inputs(histories_dir),
            "formats": collect_formats(formats_dir),
        },
        "outputs": {
            "lottery_metrics": collect_metrics(metrics_dir),
            "region_summary": collect_region_summary(region_summary),
            "delta_reports": collect_deltas(deltas_dir),
        },
        "verification_notes": [
            "This bundle captures every input, hash, and computed artifact.",
            "No prediction promises—only measured statistics and sanity checks.",
        ],
    }

    bundle_path = trust_dir / f"trust_bundle_{run_id}.json"
    bundle_path.write_text(json.dumps(bundle, indent=2))
    return bundle_path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Produce a trust bundle for a run.")
    parser.add_argument("--run-id", required=True)
    parser.add_argument("--engine-version", required=True)
    parser.add_argument("--histories-dir", type=Path, required=True)
    parser.add_argument("--formats-dir", type=Path, required=True)
    parser.add_argument("--metrics-dir", type=Path, required=True)
    parser.add_argument("--deltas-dir", type=Path, required=True)
    parser.add_argument("--trust-dir", type=Path, required=True)
    parser.add_argument("--region-summary", type=Path, required=True)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    bundle_path = build_bundle(
        args.run_id,
        args.engine_version,
        args.histories_dir,
        args.formats_dir,
        args.metrics_dir,
        args.deltas_dir,
        args.trust_dir,
        args.region_summary,
    )
    print("Trust bundle created at", bundle_path)


if __name__ == "__main__":
    main()
