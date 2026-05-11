"""Root cause logging for micro-level issues."""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List

REPO_ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = REPO_ROOT / "data"
ROOT_CAUSE_DIR = DATA_DIR / "root_causes"
LOG_FILE = ROOT_CAUSE_DIR / "root_causes.json"


def _ensure_directories(path: Path | None = None) -> None:
    target = (path or LOG_FILE).parent
    target.mkdir(parents=True, exist_ok=True)


def _resolve_path(base: Path | None = None) -> Path:
    if base is None:
        return LOG_FILE
    base_path = Path(base)
    if base_path.suffix:
        return base_path
    return base_path / LOG_FILE.name


def _load_log(base: Path | None = None) -> List[Dict[str, Any]]:
    path = _resolve_path(base)
    if not path.exists():
        return []
    try:
        return json.loads(path.read_text())
    except json.JSONDecodeError:
        return []


def _save_log(entries: List[Dict[str, Any]], base: Path | None = None) -> None:
    path = _resolve_path(base)
    _ensure_directories(path)
    path.write_text(json.dumps(entries, indent=2))


def log_root_cause(issue: str, details: Dict[str, Any], base_dir: Path | None = None) -> None:
    _ensure_directories()
    entries = _load_log(base_dir)
    entries.append({
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "issue": issue,
        "details": details,
    })
    _save_log(entries[-100:], base_dir)


def read_root_causes(limit: int = 10, base_dir: Path | None = None) -> List[Dict[str, Any]]:
    entries = _load_log(base_dir)
    return entries[-limit:]
