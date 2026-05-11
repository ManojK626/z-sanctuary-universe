from __future__ import annotations

import shutil
from pathlib import Path
from datetime import datetime, timezone

REPO_ROOT = Path(__file__).resolve().parents[1]
GOLDEN_VSCODE = Path(r"C:\ZSanctuary_Universe\.vscode")
WORKSPACES = [
    r"C:\ZSanctuary_Universe\Amk_Goku Worldwide Loterry",
    r"C:\ZSanctuary_Universe\apps",
    r"C:\ZSanctuary_Universe\archive",
    r"C:\ZSanctuary_Universe\audio",
    r"C:\ZSanctuary_Universe\config",
    r"C:\ZSanctuary_Universe\core",
    r"C:\ZSanctuary_Universe\dashboard",
    r"C:\ZSanctuary_Universe\data",
    r"C:\ZSanctuary_Universe\docs",
    r"C:\ZSanctuary_Universe\extensions",
    r"C:\ZSanctuary_Universe\harisha",
    r"C:\ZSanctuary_Universe\interface",
    r"C:\ZSanctuary_Universe\miniai",
    r"C:\ZSanctuary_Universe\packages",
    r"C:\ZSanctuary_Universe\releases",
    r"C:\ZSanctuary_Universe\rules",
    r"C:\ZSanctuary_Universe\safe_pack",
    r"C:\ZSanctuary_Universe\schemas",
    r"C:\ZSanctuary_Universe\scripts",
    r"C:\ZSanctuary_Universe\src",
    r"C:\ZSanctuary_Universe\super_ghost",
    r"C:\ZSanctuary_Universe\tools",
    r"C:\ZSanctuary_Universe\z_colour",
    r"C:\ZSanctuary_Universe\z_notebooks",
    r"C:\ZSanctuary_Universe\z_workspace",
]
EXCLUDE = {
    r"C:\ZSanctuary_Universe\node_modules",
    r"C:\ZSanctuary_Universe\archive",
}
AUDIT_LOG = Path(r"C:\ZSanctuary_Universe\logs\vscode_sync.log")


def sync(dry_run: bool = False) -> None:
    if not GOLDEN_VSCODE.is_dir():
        raise RuntimeError(f"Golden .vscode folder not found: {GOLDEN_VSCODE}")

    ts = datetime.now(timezone.utc).isoformat()
    print("Z-Sanctuary VS Code Sync")
    print("Timestamp:", ts, "UTC")
    print("")

    AUDIT_LOG.parent.mkdir(parents=True, exist_ok=True)
    with AUDIT_LOG.open("a", encoding="utf-8") as log:
        log.write(f"[{ts}] sync start (dry_run={dry_run})\n")

    for ws in WORKSPACES:
        ws_path = Path(ws)
        if ws in EXCLUDE:
            print(f"Skipped (excluded): {ws}")
            with AUDIT_LOG.open("a", encoding="utf-8") as log:
                log.write(f"[{ts}] skipped excluded {ws}\n")
            continue
        if not ws_path.is_dir():
            print(f"Skipped (workspace not found): {ws}")
            with AUDIT_LOG.open("a", encoding="utf-8") as log:
                log.write(f"[{ts}] skipped missing {ws}\n")
            continue

        target = ws_path / ".vscode"
        if target.exists():
            if dry_run:
                print(f"Would replace: {target}")
            else:
                shutil.rmtree(target)

        if dry_run:
            print(f"Would sync: {ws}")
            with AUDIT_LOG.open("a", encoding="utf-8") as log:
                log.write(f"[{ts}] would sync {ws}\n")
        else:
            shutil.copytree(GOLDEN_VSCODE, target)
            print(f"Synced: {ws}")
            with AUDIT_LOG.open("a", encoding="utf-8") as log:
                log.write(f"[{ts}] synced {ws}\n")

    print("\nAll eligible workspaces aligned.")
    with AUDIT_LOG.open("a", encoding="utf-8") as log:
        log.write(f"[{ts}] sync complete\n")


if __name__ == "__main__":
    import sys
    sync("--dry-run" in sys.argv)
