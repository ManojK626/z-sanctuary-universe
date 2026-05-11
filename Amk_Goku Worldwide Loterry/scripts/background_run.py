from __future__ import annotations

import argparse
import subprocess
from datetime import datetime, timezone
from pathlib import Path
import zipfile
try:
    from zoneinfo import ZoneInfo
except Exception:  # pragma: no cover - fallback for older runtimes
    ZoneInfo = None

REPO_ROOT = Path(__file__).resolve().parents[1]
LOG_DIR = REPO_ROOT / "logs"
LOG_FILE = LOG_DIR / "background_run.log"
LAST_FILE = LOG_DIR / "background_run.last"
META_FILE = LOG_DIR / "background_run.meta"

COMMANDS = [
    ["node", "..\\scripts\\z_ai_status_writer.js"],
    ["node", "..\\scripts\\z_autorun_audit.mjs"],
    ["node", "..\\scripts\\z_pending_audit.mjs"],
    ["node", "..\\scripts\\z_module_registry_sync.mjs"],
    ["node", "..\\scripts\\z_priority_sync.js"],
    ["node", "..\\scripts\\z_priority_audit.mjs"],
    ["python", "scripts/check_vscode_hygiene.py"],
    ["python", "scripts/lottery_vault_health.py"],
    ["python", "scripts/audit_formula_vault.py"],
    ["python", "scripts/jailcell_public_summary.py"],
    ["python", "scripts/apicon_reputation.py"],
    ["python", "scripts/system_status.py"],
    ["python", "scripts/build_safe_vault.py"],
    ["python", "-m", "pytest"],
]
WEEKLY_COMMANDS = [
    ["python", "scripts/build_lottery_app_pack.py"],
    ["python", "..\\scripts\\gen_rhythm_trust.py"],
    ["python", "..\\scripts\\gen_learning_digest.py"],
    ["python", "..\\scripts\\gen_monthly_change_log.py"],
]


def should_run_daily() -> bool:
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    return not (LAST_FILE.exists() and LAST_FILE.read_text(encoding="utf-8").strip() == today)


def should_run_weekly() -> bool:
    week = datetime.now(timezone.utc).strftime("%G-W%V")
    return not (LAST_FILE.exists() and LAST_FILE.read_text(encoding="utf-8").strip() == week)


def in_window(window: str, tz=None) -> bool:
    if not window:
        return True
    start_s, end_s = window.split("-", 1)
    now = datetime.now(tz or timezone.utc).time()
    start = datetime.strptime(start_s, "%H:%M").time()
    end = datetime.strptime(end_s, "%H:%M").time()
    if start <= end:
        return start <= now <= end
    return now >= start or now <= end


def latest_repo_mtime() -> float:
    ignore = {"node_modules", ".git", "logs", "exports", "__pycache__"}
    latest = 0.0
    for path in REPO_ROOT.rglob("*"):
        if path.is_dir():
            if path.name in ignore:
                continue
        else:
            if any(part in ignore for part in path.parts):
                continue
            try:
                latest = max(latest, path.stat().st_mtime)
            except OSError:
                continue
    return latest


def should_run_on_changes() -> bool:
    current = latest_repo_mtime()
    if META_FILE.exists():
        try:
            previous = float(META_FILE.read_text(encoding="utf-8").strip() or "0")
            return current > previous
        except ValueError:
            return True
    return True


def mark_run(tag: str) -> None:
    LAST_FILE.write_text(tag, encoding="utf-8")
    META_FILE.write_text(str(latest_repo_mtime()), encoding="utf-8")


def rotate_log_weekly(ts: str) -> None:
    if not LOG_FILE.exists():
        return
    week = datetime.now(timezone.utc).strftime("%G-W%V")
    zip_path = LOG_DIR / f"background_run_{week}.zip"
    with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        zf.write(LOG_FILE, LOG_FILE.name)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--daily", action="store_true", help="Run at most once per UTC day")
    parser.add_argument("--weekly", action="store_true", help="Run at most once per ISO week")
    parser.add_argument("--on-changes", action="store_true", help="Run only if repo changed")
    parser.add_argument("--window", default="", help="UTC time window HH:MM-HH:MM")
    parser.add_argument("--window-local", default="", help="Local time window HH:MM-HH:MM")
    parser.add_argument("--tz", default="UTC", help="IANA timezone (e.g., Europe/Dublin)")
    parser.add_argument("--quiet", action="store_true", help="Suppress command output")
    args = parser.parse_args()

    LOG_DIR.mkdir(parents=True, exist_ok=True)
    ts = datetime.now(timezone.utc).isoformat()

    if args.weekly and not should_run_weekly():
        LOG_FILE.write_text(f"[{ts}] skipped (weekly guard)\n", encoding="utf-8")
        print("Background run skipped (weekly guard).")
        return
    if args.daily and not should_run_daily():
        LOG_FILE.write_text(f"[{ts}] skipped (daily guard)\n", encoding="utf-8")
        print("Background run skipped (daily guard).")
        return
    if args.on_changes and not should_run_on_changes():
        LOG_FILE.write_text(f"[{ts}] skipped (no changes)\n", encoding="utf-8")
        print("Background run skipped (no changes).")
        return
    tz = timezone.utc
    if args.tz and ZoneInfo:
        if args.tz.upper() in {"LOCAL", "AUTO"}:
            try:
                tz = datetime.now().astimezone().tzinfo or timezone.utc
            except Exception:
                tz = timezone.utc
        else:
            try:
                tz = ZoneInfo(args.tz)
            except Exception:
                tz = timezone.utc
    if args.window and not in_window(args.window):
        LOG_FILE.write_text(f"[{ts}] skipped (outside UTC window {args.window})\n", encoding="utf-8")
        print(f"Background run skipped (outside UTC window {args.window}).")
        return
    if args.window_local and not in_window(args.window_local, tz):
        LOG_FILE.write_text(f"[{ts}] skipped (outside local window {args.window_local} {args.tz})\n", encoding="utf-8")
        print(f"Background run skipped (outside local window {args.window_local} {args.tz}).")
        return

    with LOG_FILE.open("a", encoding="utf-8") as log:
        log.write(f"[{ts}] start\n")

    for cmd in COMMANDS:
        with LOG_FILE.open("a", encoding="utf-8") as log:
            log.write(f"[{ts}] run: {' '.join(cmd)}\n")

        if args.quiet:
            subprocess.run(cmd, cwd=REPO_ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=False)
        else:
            subprocess.run(cmd, cwd=REPO_ROOT, check=False)

    if args.weekly:
        for cmd in WEEKLY_COMMANDS:
            with LOG_FILE.open("a", encoding="utf-8") as log:
                log.write(f"[{ts}] run: {' '.join(cmd)}\n")
            if args.quiet:
                subprocess.run(
                    cmd, cwd=REPO_ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=False
                )
            else:
                subprocess.run(cmd, cwd=REPO_ROOT, check=False)

    tag = datetime.now(timezone.utc).strftime("%G-W%V") if args.weekly else datetime.now(timezone.utc).strftime("%Y-%m-%d")
    mark_run(tag)
    if args.weekly:
        rotate_log_weekly(ts)
    with LOG_FILE.open("a", encoding="utf-8") as log:
        log.write(f"[{ts}] complete\n")
    print("Background run complete.")


if __name__ == "__main__":
    main()
