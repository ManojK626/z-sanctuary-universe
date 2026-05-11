"""Integrity guard helpers for Z-Sanctuary."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Dict

REPO_ROOT = Path(__file__).resolve().parents[2]


def compute_hash(path: Path) -> str:
    return "sha256:" + hashlib.sha256(path.read_bytes()).hexdigest()


def verify_history_hashes(config_dir: Path) -> None:
    """Ensure every configured history matches its stored hash."""
    for config_path in config_dir.glob("*.json"):
        payload = json.loads(config_path.read_text())
        history_ref = payload.get("history_file")
        expected_hash = payload.get("history_hash")
        if not history_ref or not expected_hash:
            continue
        history_path = (REPO_ROOT / history_ref).resolve()
        if not history_path.exists():
            raise SystemExit(f"Missing history for {payload.get('code')}: {history_path}")
        actual_hash = compute_hash(history_path)
        if actual_hash != expected_hash:
            raise SystemExit(
                f"Hash mismatch for {payload.get('code')}: found {actual_hash}, expected {expected_hash}"
            )
