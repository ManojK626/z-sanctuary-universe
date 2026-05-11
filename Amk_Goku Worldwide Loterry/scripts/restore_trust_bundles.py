from __future__ import annotations

import os
import shutil
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
TRUST_DIR = REPO_ROOT / "data" / "reports" / "trust"
ARCHIVE_DIR = TRUST_DIR / "_archive"


def require_action() -> None:
    if os.environ.get("ACTION") == "ALLOW":
        return
    raise SystemExit("ACTION REQUIRED: set ACTION=ALLOW to restore archived bundles.")


def restore_all() -> int:
    if not ARCHIVE_DIR.exists():
        return 0
    restored = 0
    for path in ARCHIVE_DIR.glob("trust_bundle_*.json"):
        shutil.move(str(path), str(TRUST_DIR / path.name))
        restored += 1
    for path in ARCHIVE_DIR.glob("trust_bundle_*.pdf"):
        shutil.move(str(path), str(TRUST_DIR / path.name))
        restored += 1
    return restored


def main() -> None:
    require_action()
    count = restore_all()
    print(f"Restored bundles: {count}")


if __name__ == "__main__":
    main()
