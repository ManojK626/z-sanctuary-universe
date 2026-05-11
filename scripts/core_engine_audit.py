from __future__ import annotations
from datetime import datetime, timezone
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parent.parent
REPORTS = ROOT / "data" / "reports"
REPORTS.mkdir(parents=True, exist_ok=True)
now = datetime.now(timezone.utc).isoformat().replace('+00:00','Z')

files = {
    "vault": REPORTS / "formula_vault_audit.txt",
    "html_audit": REPORTS / "z_html_security_audit.json",
    "html_audit_md": REPORTS / "z_html_security_audit.md",
    "zuno_daily": REPORTS / "z_zuno_daily_report.json",
    "weekly": REPORTS / "z_weekly_reflection.md"
}

summary = {
    "generated_at": now,
    "core_engine_purpose": {
        "module_registry": "Tracks and syncs module inventory across sanctuary",
        "reports_vault": "Manages reports inventory, tags, and retention",
        "vault_guard": "Protects formula vault access and device-key controls",
        "panel_directory": "Manages panel list, status, and visibility"
    },
    "checks": {
        "vault_audit_present": files['vault'].exists(),
        "html_audit_present": files['html_audit'].exists(),
        "zuno_daily_present": files['zuno_daily'].exists(),
        "weekly_reflection_present": files['weekly'].exists()
    }
}

(REPORTS / 'z_core_engine_audit.json').write_text(json.dumps(summary, indent=2) + "\n", encoding="utf-8")

md = [
    "# Core Engine Purpose + HTML Security Verification",
    f"Generated: {now}",
    "",
    "## Core Engine Purpose",
    "- Module Registry: Tracks and syncs module inventory across sanctuary",
    "- Reports Vault: Manages reports inventory, tags, and retention",
    "- Vault Guard: Protects formula vault access and device-key controls",
    "- Panel Directory: Manages panel list, status, and visibility",
    "",
    "## Verification Artifacts",
]
for k, p in files.items():
    md.append(f"- {k}: {'present' if p.exists() else 'missing'}")

(REPORTS / 'z_core_engine_audit.md').write_text("\n".join(md) + "\n", encoding="utf-8")
print("Core engine audit written.")
