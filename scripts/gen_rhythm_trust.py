import json
import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STATUS_PATH = ROOT / "Amk_Goku Worldwide Loterry" / "data" / "reports" / "system_status.json"
OUT_PATH = ROOT / "Amk_Goku Worldwide Loterry" / "data" / "reports" / "rhythm_trust.json"


def load_json(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return {}


def main() -> None:
    status = load_json(STATUS_PATH)
    rhythm = status.get("rhythm_state", "CALM")

    counts = {"CALM": 0, "ADAPTIVE": 0, "REGENERATION": 0}
    if rhythm in counts:
        counts[rhythm] = 1

    now = datetime.datetime.now(datetime.UTC)
    out = {
        "generated_at": now.isoformat().replace("+00:00", "Z"),
        "week": now.isocalendar()[1],
        "rhythm": counts,
        "explanation": "Rhythm reflects internal care cycles. Observational only.",
        "authority": "observational-only",
        "backed_by": {
            "system_status": str(STATUS_PATH.relative_to(ROOT)),
        },
    }

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(out, indent=2), encoding="utf-8")
    print("Rhythm trust summary written.")


if __name__ == "__main__":
    main()
