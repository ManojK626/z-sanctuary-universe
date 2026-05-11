from __future__ import annotations
import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPORTS = ROOT / "data" / "reports"
REPORTS.mkdir(parents=True, exist_ok=True)

now = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

TAG_RULES = {
    "health": ["health", "status", "certificate"],
    "trust": ["trust", "vault", "audit", "manifest", "security"],
    "autopilot": ["ssws", "autorun", "background"],
    "ai": ["ai_", "z_ai", "agents", "miniai"],
    "reflection": ["reflection", "daily", "weekly"],
    "index": ["index", "readme"],
}

items = []
for path in sorted(REPORTS.rglob('*')):
    if path.is_file():
        rel = path.relative_to(REPORTS).as_posix()
        if rel == 'reports_manifest.json':
            continue
        name = rel.lower()
        tags = []
        for tag, keys in TAG_RULES.items():
            if any(k in name for k in keys):
                tags.append(tag)
        if not tags:
            tags = ["misc"]
        items.append({
            "file": rel,
            "bytes": path.stat().st_size,
            "updated_at": datetime.fromtimestamp(path.stat().st_mtime, tz=timezone.utc).isoformat().replace("+00:00", "Z"),
            "type": "md" if rel.endswith('.md') else "json" if rel.endswith('.json') else "other",
            "tags": tags
        })

manifest = {
    "generated_at": now,
    "purpose": "Z-Sanctuary Reports Vault manifest",
    "count": len(items),
    "items": items
}

(REPORTS / 'reports_manifest.json').write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")

# Index
lines = [
    "# Reports Vault Index",
    f"Generated: {now}",
    "",
    "## Files",
]
for it in items:
    tag_str = ", ".join(it['tags'])
    lines.append(f"- `{it['file']}` ({it['type']}, {it['bytes']} bytes, {it['updated_at']}, tags: {tag_str})")

(REPORTS / 'INDEX.md').write_text("\n".join(lines) + "\n", encoding="utf-8")

# Canonical references auto-update in README
readme_path = REPORTS / "README.md"
if readme_path.exists():
    readme = readme_path.read_text(encoding="utf-8")
    canonical = [
        "- `z_final_status.json` (overall status)",
        "- `z_zuno_daily_report.md` (daily human summary)",
        "- `z_weekly_reflection.md` (weekly reflection)",
        "- `z_ssws_daily_report.json` (SSWS health)",
        "- `z_autorun_audit.json` (autopilot state)",
        "- `formula_vault_audit.txt` (vault audit)",
        "- `reports_manifest.json` (reports inventory)",
        "- `z_html_security_audit.md` (html security audit)",
        "- `z_html_security_audit.json` (html security audit data)",
        "- `z_core_engine_audit.md` (core engine audit)",
        "- `z_core_engine_audit.json` (core engine audit data)",
    ]
    block = "\n".join(canonical)
    if "<!-- Z:CANONICAL_START -->" in readme and "<!-- Z:CANONICAL_END -->" in readme:
        pre, rest = readme.split("<!-- Z:CANONICAL_START -->", 1)
        _, post = rest.split("<!-- Z:CANONICAL_END -->", 1)
        readme = pre + "<!-- Z:CANONICAL_START -->\n" + block + "\n<!-- Z:CANONICAL_END -->" + post
        readme_path.write_text(readme, encoding="utf-8")

print("Reports manifest, index, and canonical references refreshed.")
