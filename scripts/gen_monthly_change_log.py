import json
import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STATUS_PATH = ROOT / "Amk_Goku Worldwide Loterry" / "data" / "reports" / "system_status.json"
OUT_PATH = ROOT / "Amk_Goku Worldwide Loterry" / "data" / "reports" / "monthly_change_log_latest.json"


def load_json(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return {}


def main() -> None:
    status = load_json(STATUS_PATH)
    now = datetime.datetime.now(datetime.UTC)
    month = now.strftime("%B %Y")

    learned = [
        "Stable observational reporting reduces ambiguity.",
        f"Current rhythm state is {status.get('rhythm_state', 'unknown')}.",
    ]

    changed = [
        "Trust Pack generation standardized.",
        "Registry clarity enforced in system status.",
    ]

    matters = [
        "Clearer audit trail and trust reporting.",
        "Reduced confusion between registry and data coverage.",
    ]

    out = {
        "generated_at": now.isoformat().replace("+00:00", "Z"),
        "month": now.strftime("%Y-%m"),
        "text": "\n".join([
            f"Z-Monthly Change Log — {month}",
            "",
            "What We Learned",
            *[f"- {x}" for x in learned],
            "",
            "What Changed",
            *[f"- {x}" for x in changed],
            "",
            "Why It Matters",
            *[f"- {x}" for x in matters],
            "",
            "Safeguards",
            "- Internal only",
            "- Reversible by default",
            "- Observational-only authority",
        ]),
        "authority": "observational-only",
        "backed_by": {
            "system_status": str(STATUS_PATH.relative_to(ROOT)),
        },
    }

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(out, indent=2), encoding="utf-8")
    print("Monthly change log written.")


if __name__ == "__main__":
    main()
