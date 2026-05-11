import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REGISTRY = ROOT / "rules" / "Z_FORMULA_REGISTRY.json"
INDEX = ROOT / "rules" / "SECURITY_ASSET_INDEX.md"

def read_json(path: Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return None

def main():
    registry = read_json(REGISTRY)
    if not registry:
        raise SystemExit("Registry missing or invalid.")

    missing = []
    for formula in registry.get("formulas", []):
        for key in ("docs", "embodiment", "schema", "visual", "notice"):
            rel = formula.get(key)
            if not rel:
                missing.append((formula.get("id"), key, "missing path"))
                continue
            if not (ROOT / rel).exists():
                missing.append((formula.get("id"), key, rel))

    report = ["Z-Formula Vault Audit", f"Registry: {REGISTRY}", ""]
    if missing:
        report.append("Missing assets:")
        for item in missing:
            report.append(f"- {item[0]} :: {item[1]} -> {item[2]}")
    else:
        report.append("All registered formula assets exist.")

    out = ROOT / "data" / "reports" / "formula_vault_audit.txt"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text("\n".join(report), encoding="utf-8")
    print(out.read_text(encoding="utf-8"))

if __name__ == "__main__":
    main()
