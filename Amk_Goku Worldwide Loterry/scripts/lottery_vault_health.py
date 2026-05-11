from __future__ import annotations

import json
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
VAULT_DIR = REPO_ROOT / "data" / "lottery_vault"
REGISTRY_PATH = VAULT_DIR / "registry.json"
OUT_PATH = VAULT_DIR / "health.json"


def main() -> None:
    if not REGISTRY_PATH.exists():
        raise SystemExit("Vault registry missing.")

    registry = json.loads(REGISTRY_PATH.read_text(encoding="utf-8"))
    lotteries = registry.get("lotteries", [])
    manual = [l for l in lotteries if l.get("update_method") == "manual_drop"]

    missing = 0
    present = 0
    details = []
    for entry in manual:
        raw_path = VAULT_DIR / entry["vault_path"] / "raw" / f"{entry['id']}.csv"
        has_raw = raw_path.exists()
        present += 1 if has_raw else 0
        missing += 0 if has_raw else 1
        details.append(
            {
                "id": entry["id"],
                "name": entry["name"],
                "region": entry["region"],
                "raw_present": has_raw,
                "raw_path": str(raw_path.relative_to(REPO_ROOT)),
            }
        )

    OUT_PATH.write_text(
        json.dumps(
            {
                "generated_at": __import__("datetime")
                .datetime.now(__import__("datetime").timezone.utc)
                .replace(microsecond=0)
                .isoformat()
                .replace("+00:00", "Z"),
                "manual_total": len(manual),
                "manual_present": present,
                "manual_missing": missing,
                "details": details,
            },
            indent=2,
        ),
        encoding="utf-8",
    )
    print(f"Vault health written to {OUT_PATH}")


if __name__ == "__main__":
    main()
