from __future__ import annotations

import os
import shutil
import subprocess
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
INCOMING_DIR = REPO_ROOT / "data" / "incoming"
TEMP_DIR = INCOMING_DIR / "_temp_vault"


def require_action() -> None:
    if os.environ.get("ACTION") == "ALLOW":
        return
    raise SystemExit("ACTION REQUIRED: set ACTION=ALLOW to run vault full sync.")


def run_cmd(args: list[str]) -> None:
    subprocess.run(args, check=True)


def isolate_file(target: Path) -> list[Path]:
    TEMP_DIR.mkdir(parents=True, exist_ok=True)
    moved: list[Path] = []
    for path in INCOMING_DIR.glob("*.csv"):
        if path == target:
            continue
        dest = TEMP_DIR / path.name
        shutil.move(str(path), str(dest))
        moved.append(dest)
    return moved


def restore_files(moved: list[Path]) -> None:
    for path in moved:
        dest = INCOMING_DIR / path.name
        shutil.move(str(path), str(dest))
    if TEMP_DIR.exists() and not any(TEMP_DIR.iterdir()):
        TEMP_DIR.rmdir()


def current_hash(history: Path) -> str | None:
    if not history.exists():
        return None
    import hashlib

    return "sha256:" + hashlib.sha256(history.read_bytes()).hexdigest()


def ingest_all() -> None:
    for incoming in sorted(INCOMING_DIR.glob("*.csv")):
        code = incoming.stem
        history = REPO_ROOT / "data" / "histories" / f"{code}.csv"
        confirm = current_hash(history)

        moved = isolate_file(incoming)
        try:
            if confirm:
                run_cmd(
                    [
                        "python",
                        str(REPO_ROOT / "core-engine" / "ingest" / "ingest_histories.py"),
                        "--overwrite",
                        "--confirm-hash",
                        confirm,
                    ]
                )
            else:
                run_cmd(
                    [
                        "python",
                        str(REPO_ROOT / "core-engine" / "ingest" / "ingest_histories.py"),
                    ]
                )
        finally:
            restore_files(moved)


def main() -> None:
    require_action()
    run_cmd(["python", str(REPO_ROOT / "scripts" / "lottery_vault_sync.py"), "--stage-incoming"])
    ingest_all()
    run_cmd(["python", str(REPO_ROOT / "core-engine" / "pipeline.py")])
    run_cmd(["python", str(REPO_ROOT / "scripts" / "lottery_vault_health.py")])


if __name__ == "__main__":
    main()
