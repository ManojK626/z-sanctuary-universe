"""Deployment helper for the Z-Sanctuary lottery observatory."""

from __future__ import annotations

import shutil
import subprocess
import sys
from pathlib import Path


def run(cmd: list[str]) -> None:
    """Run a command and stop on failure."""
    print("Running:", " ".join(cmd))
    subprocess.run([sys.executable, *cmd], check=True)


def clean_histories() -> None:
    histories = Path("data") / "histories"
    for target in ("powerball.csv", "mega-millions.csv"):
        path = histories / target
        if path.exists():
            path.unlink()


def main() -> None:
    steps = [
        ["core-engine/ingest/downloaders/run_all.py"],
        ["core-engine/ingest/ingest_histories.py"],
        ["core-engine/pipeline.py"],
    ]
    clean_histories()

    for step in steps:
        run(step)


if __name__ == "__main__":
    main()
