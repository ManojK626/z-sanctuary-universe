from __future__ import annotations

import json
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
SOURCES = REPO_ROOT / "data" / "apicon" / "sources.json"
JAIL = REPO_ROOT / "data" / "jailcell" / "public_summary.json"
OUT = REPO_ROOT / "data" / "apicon" / "reputation.json"

CATEGORY_WEIGHTS = {
    "SCHEMA": 12,
    "SOURCE": 10,
    "TEMPORAL": 6,
    "DUPLICATE": 4,
    "ANOMALY": 5,
}


def main() -> None:
    if not SOURCES.exists():
        raise SystemExit("APICON sources.json missing.")

    sources = json.loads(SOURCES.read_text(encoding="utf-8"))
    jail = json.loads(JAIL.read_text(encoding="utf-8")) if JAIL.exists() else {}

    by_category = Counter(jail.get("by_category", {}))
    total_penalty = 0
    for cat, count in by_category.items():
        total_penalty += CATEGORY_WEIGHTS.get(cat, 5) * count

    reputation = {}
    for name, meta in sources.items():
        score = max(0, 100 - total_penalty)
        reputation[name] = {
            "score": round(score, 2),
            "category": meta.get("category", "unknown"),
            "type": meta.get("type", "unknown"),
            "notes": "Observational score only; no execution authority.",
        }

    payload = {
        "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "reputation": reputation,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
