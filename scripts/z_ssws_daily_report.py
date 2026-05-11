from __future__ import annotations

from pathlib import Path
from datetime import datetime, timezone
import json

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "data" / "reports"
OUT_DIR.mkdir(parents=True, exist_ok=True)
OUT_PATH = OUT_DIR / "z_ssws_daily_report.json"


def read_json(path: Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return None


def main() -> None:
    now = datetime.now(timezone.utc).isoformat()
    registry = read_json(ROOT / "rules" / "Z_FORMULA_REGISTRY.json") or {}
    status = read_json(ROOT / "data" / "system_status.json") or {}

    out = {
        "generated_at": now,
        "workspace": "Z-SSWS",
        "formula_registry": {
            "status": registry.get("status", "unknown"),
            "count": len(registry.get("formulas", [])),
            "vault_path": registry.get("vault_path")
        },
        "system_status": {
            "quiet_mode": status.get("quiet_mode"),
            "rhythm_state": status.get("rhythm_state"),
            "last_run": status.get("last_run"),
        },
        "notes": "Read-only summary. No execution authority."
    }

    OUT_PATH.write_text(json.dumps(out, indent=2), encoding="utf-8")
    print("Z-SSWS daily report written:", OUT_PATH)


if __name__ == "__main__":
    main()
