"""Snapshot/rollback utilities for pipeline failures."""

from __future__ import annotations

import shutil
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable


class SnapshotManager:
    def __init__(self, targets: Iterable[Path], base: Path | None = None):
        self.targets = list(targets)
        self.base = base or Path("data") / "_snapshots" / datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")

    def backup(self) -> None:
        self.base.mkdir(parents=True, exist_ok=True)
        for path in self.targets:
            dest = self.base / path.name
            if dest.exists():
                shutil.rmtree(dest)
            if path.exists():
                shutil.copytree(path, dest)

    def restore(self) -> None:
        if not self.base.exists():
            return
        for path in self.targets:
            backup_dir = self.base / path.name
            if backup_dir.exists():
                if path.exists():
                    shutil.rmtree(path)
                shutil.copytree(backup_dir, path)

    def cleanup(self) -> None:
        if self.base.exists():
            shutil.rmtree(self.base)
