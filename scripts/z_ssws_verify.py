from __future__ import annotations

from pathlib import Path
import json


ROOT = Path(__file__).resolve().parents[1]

CHECKS = [
    (".vscode/settings.json", "VS Code settings"),
    (".vscode/tasks.json", "VS Code tasks"),
    ("rules/Z_FORMULA_REGISTRY.json", "Formula registry"),
    ("safe_pack/z_sanctuary_vault/VAULT_MANIFEST.md", "Vault manifest"),
    ("rules/Z_SANCTUARY_SECURITY_POLICY.md", "Security policy"),
    ("Z_SSWS.code-workspace", "Z-SSWS workspace file"),
]


def read_json(path: Path) -> dict | None:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return None


def main() -> None:
    ok = True
    print("Z-SSWS Workspace Sync Check")
    print("---------------------------")

    for rel, label in CHECKS:
        path = ROOT / rel
        if not path.exists():
            print(f"[FAIL] {label}: missing ({rel})")
            ok = False
        else:
            print(f"[OK] {label}: ok")

    registry = read_json(ROOT / "rules/Z_FORMULA_REGISTRY.json") or {}
    formulas = registry.get("formulas", [])
    if not formulas:
        print("[FAIL] Formula registry: no formulas registered")
        ok = False
    else:
        print(f"[OK] Formula registry: {len(formulas)} formula(s)")

    print("---------------------------")
    print("Result:", "OK" if ok else "CHECKS_FAILED")


if __name__ == "__main__":
    main()
