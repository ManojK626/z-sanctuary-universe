from __future__ import annotations
from datetime import datetime, timezone, timedelta
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parents[1]
REPORTS = ROOT / "data" / "reports"
ARCHIVE = REPORTS / "_archive"
ARCHIVE.mkdir(parents=True, exist_ok=True)

now = datetime.now(timezone.utc)
cutoff = now - timedelta(days=90)

keep = {"README.md", "INDEX.md", "reports_manifest.json"}

moved = []
for path in REPORTS.rglob('*'):
    if not path.is_file():
        continue
    if path.name in keep:
        continue
    if path.relative_to(REPORTS).parts[0] == "_archive":
        continue
    mtime = datetime.fromtimestamp(path.stat().st_mtime, tz=timezone.utc)
    if mtime < cutoff:
        dest = ARCHIVE / path.name
        # avoid overwrite
        if dest.exists():
            ts = mtime.strftime('%Y%m%dT%H%M%SZ')
            dest = ARCHIVE / f"{path.stem}_{ts}{path.suffix}"
        shutil.move(str(path), str(dest))
        moved.append(dest.name)

print(f"Archived {len(moved)} report(s).")
