"""Compute lottery entropy metrics and persist them to JSON."""
from __future__ import annotations

import argparse
import csv
import json
from hashlib import sha256
from pathlib import Path
from datetime import datetime
from typing import List, Dict

import sys

BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))
from entropy import frequency_entropy, gap_entropy, pair_entropy  # noqa: E402


REQUIRED_COLUMNS = {"draw_date", "main_1", "main_2", "main_3", "main_4", "main_5"}


def load_history(path: Path) -> List[Dict[str, List[int]]]:
    with path.open(newline="") as fh:
        reader = csv.DictReader(fh)
        if not REQUIRED_COLUMNS.issubset({col.strip() for col in reader.fieldnames or []}):
            raise SystemExit("History CSV is missing required columns.")
        return [
            {
                "draw_date": row["draw_date"],
                "main": [int(row[f"main_{i}"]) for i in range(1, 6)],
            }
            for row in reader
        ]


def compute_history_hash(path: Path) -> str:
    data = path.read_bytes()
    return "sha256:" + sha256(data).hexdigest()


def compute_metrics(
    lottery_code: str,
    history_path: Path,
    format_path: Path,
    run_id: str,
    output: Path,
) -> None:
    draws = load_history(history_path)
    main_draws = [draw["main"] for draw in draws]
    flat_main = [n for draw in main_draws for n in draw]

    config = json.loads(format_path.read_text())
    number_space = {
        "main": config.get("main", {}),
        "lucky": config.get("lucky", {}),
    }

    metrics = {
        "run_id": run_id,
        "lottery_code": lottery_code,
        "history_hash": compute_history_hash(history_path),
        "draws_count": len(draws),
        "number_space": number_space,
        "entropy": {
            "frequency_entropy": frequency_entropy(
                flat_main,
                number_space["main"]["min"],
                number_space["main"]["max"],
            ),
            "gap_entropy": gap_entropy(main_draws),
            "pair_entropy": pair_entropy(main_draws),
        },
        "notes": [],
    }

    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(metrics, indent=2))
    print("Metrics written to", output)


def setup_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Compute lottery entropy metrics")
    parser.add_argument("--format", type=Path, required=True, help="Path to format JSON")
    parser.add_argument("--history", type=Path, required=True, help="Path to history CSV")
    parser.add_argument("--run-id", required=True, help="Pipeline run id")
    parser.add_argument("--output", type=Path, required=True, help="Destination JSON")
    return parser


def main() -> None:
    parser = setup_parser()
    args = parser.parse_args()
    format_payload = json.loads(args.format.read_text())
    compute_metrics(
        format_payload["code"],
        args.history,
        args.format,
        args.run_id,
        args.output,
    )


if __name__ == "__main__":
    main()
