from __future__ import annotations

from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
VSCODE_DIR = REPO_ROOT / ".vscode"


def main() -> None:
    if not VSCODE_DIR.exists():
        print("No .vscode directory in this repo.")
        return

    bad = sorted(p for p in VSCODE_DIR.iterdir() if p.suffix in {".js", ".ts"})
    if bad:
        print("Found disallowed .vscode code files:")
        for p in bad:
            print(f"- {p.name}")
        raise SystemExit(1)

    print("OK: .vscode hygiene clean (no .js/.ts files).")


if __name__ == "__main__":
    main()
