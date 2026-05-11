import json
import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SUMMARY_PATH = ROOT / "Amk_Goku Worldwide Loterry" / "data" / "jailcell" / "public_summary.json"
OUT_PATH = ROOT / "Amk_Goku Worldwide Loterry" / "data" / "reports" / "jailcell_trust.json"


def load_json(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return {}


def main() -> None:
    summary = load_json(SUMMARY_PATH)
    now = datetime.datetime.now(datetime.UTC)
    out = {
        "generated_at": now.isoformat().replace("+00:00", "Z"),
        "period": "weekly",
        "jailcell": {
            "observed_total": summary.get("total", 0),
            "contained": summary.get("total", 0),
            "released_after_learning": 0,
            "active": 0,
        },
        "principles": [
            "Containment is observational, not punitive",
            "Learning precedes enforcement",
            "No user identity is exposed",
        ],
        "authority": "observational-only",
        "backed_by": {
            "jailcell_summary": str(SUMMARY_PATH.relative_to(ROOT)),
        },
    }
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(out, indent=2), encoding="utf-8")
    print("Jailcell trust summary written.")


if __name__ == "__main__":
    main()
