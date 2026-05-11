"""Helper CLI that summarizes the lottery ingestion state and exposes the validation preview."""

from __future__ import annotations

import argparse
import subprocess
from pathlib import Path
from typing import Iterable, List


REPO_ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = REPO_ROOT / "data"


def list_directory(title: str, path: Path, max_items: int = 10) -> None:
    print(f"\n{title} ({path})")
    if not path.exists():
        print(" → not found")
        return
    items = sorted(path.iterdir())
    for entry in items[:max_items]:
        print(f"  - {entry.name}")
    if len(items) > max_items:
        print(f"  ... and {len(items) - max_items} more")


def warn_if_header_only(histories_dir: Path) -> None:
    if not histories_dir.exists():
        return
    for csv_path in sorted(histories_dir.glob("*.csv")):
        try:
            line_count = sum(1 for _ in csv_path.open(encoding="utf-8"))
        except OSError:
            continue
        if line_count <= 1:
            print(f"  ! {csv_path.name} has {line_count} line(s) — header-only or empty")


def latest_trust_bundle(trust_dir: Path) -> Path | None:
    bundles = sorted(trust_dir.glob("trust_bundle_*.json"))
    return bundles[-1] if bundles else None


def run_validate(script: Path, sample: int) -> None:
    cmd: List[str] = ["python", str(script), "--sample", str(sample)]
    subprocess.run(cmd, cwd=REPO_ROOT)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Inspect incoming/historic files and run the normalized CSV preview."
    )
    parser.add_argument(
        "--sample",
        type=int,
        default=3,
        help="Number of sample normalized rows to show when previewing incoming CSVs.",
    )
    parser.add_argument(
        "--validate",
        action="store_true",
        help="Run the canonical CSV validator (`validate_csv.py`) before ingestion.",
    )
    args = parser.parse_args()

    list_directory("Incoming files ready for ingestion", DATA_DIR / "incoming")
    list_directory("Trusted draw histories", DATA_DIR / "histories")
    warn_if_header_only(DATA_DIR / "histories")
    list_directory("Metrics artifacts", DATA_DIR / "metrics")
    list_directory("Delta reports", DATA_DIR / "reports" / "deltas")
    trust_path = latest_trust_bundle(DATA_DIR / "reports" / "trust")
    if trust_path:
        print(f"\nLatest trust bundle: {trust_path.name}")
    else:
        print("\nNo trust bundles found yet.")

    if args.validate:
        run_validate(REPO_ROOT / "core-engine" / "ingest" / "validate_csv.py", args.sample)


if __name__ == "__main__":
    main()
