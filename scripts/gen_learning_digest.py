import json
import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STATUS_PATH = ROOT / "Amk_Goku Worldwide Loterry" / "data" / "reports" / "system_status.json"
OUT_PATH = ROOT / "Amk_Goku Worldwide Loterry" / "data" / "reports" / "learning_digest_latest.json"


def load_json(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return {}


def main() -> None:
    status = load_json(STATUS_PATH)
    now = datetime.datetime.now(datetime.UTC)
    week = now.isocalendar()[1]

    lines = [
        f"Z-Learning Digest — Week {week}, {now.year}",
        "",
        "Patterns Observed",
        "- Manual data coverage remains partial.",
        "- Rhythm state observed: " + (status.get("rhythm_state") or "unknown"),
        "",
        "Improvements Made",
        "- Trust pack generated from observational data.",
        "",
        "Practices Reinforced",
        "- Observation before adaptation.",
        "- Manual sources remain explicit.",
        "",
        "Looking Ahead",
        "- Ingest missing manual sources when available.",
    ]

    out = {
        "generated_at": now.isoformat().replace("+00:00", "Z"),
        "week": week,
        "text": "\n".join(lines),
        "authority": "observational-only",
        "backed_by": {
            "system_status": str(STATUS_PATH.relative_to(ROOT)),
        },
    }

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(out, indent=2), encoding="utf-8")
    print("Learning digest written.")


if __name__ == "__main__":
    main()
