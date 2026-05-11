"""Dual-run command for mirrored outputs and automated deployment."""

from __future__ import annotations

import shutil
import subprocess
from pathlib import Path
import sys


def run_deploy() -> None:
    subprocess.run([sys.executable, "scripts/deploy_zsanctuary.py"], check=True)


def mirror_outputs() -> None:
    srcs = [
        Path("data") / "reports",
        Path("data") / "kairocell",
        Path("data") / "drift_watch",
        Path("data") / "world_observer",
    ]
    mirror_root = Path("data") / "mirror"
    if mirror_root.exists():
        shutil.rmtree(mirror_root)
    mirror_root.mkdir(parents=True, exist_ok=True)
    for src in srcs:
        dest = mirror_root / src.name
        if src.exists():
            shutil.copytree(src, dest)


def main() -> None:
    run_deploy()
    mirror_outputs()
    print("Dual run completed; mirror stored in data/mirror.")


if __name__ == "__main__":
    main()
