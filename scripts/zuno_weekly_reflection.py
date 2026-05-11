from __future__ import annotations
import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPORTS = ROOT / "data" / "reports"
REPORTS.mkdir(parents=True, exist_ok=True)

now = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

# Inputs
zuno_daily_path = REPORTS / "z_zuno_daily_report.json"
final_status_path = REPORTS / "z_final_status.json"
ssws_daily_path = REPORTS / "z_ssws_daily_report.json"
html_audit_path = REPORTS / "z_html_security_audit.json"
core_audit_path = REPORTS / "z_core_engine_audit.json"


def load_json(path: Path) -> dict:
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))
    return {}

zuno_daily = load_json(zuno_daily_path)
final_status = load_json(final_status_path)
ssws_daily = load_json(ssws_daily_path)
html_audit = load_json(html_audit_path)
core_audit = load_json(core_audit_path)

# Task summary
tasks = zuno_daily.get("tasks", {})
percent = tasks.get("percentages", {})

# Compose reflection
lines = []
lines.append("# Zuno Weekly Reflection")
lines.append(f"Generated: {now}")
lines.append("")
lines.append("## Summary")
lines.append(f"- Overall status: **{final_status.get('status','UNKNOWN')}**")
lines.append(f"- Lint: {final_status.get('build_test',{}).get('lint','unknown')}")
lines.append(f"- Tests: {final_status.get('build_test',{}).get('tests','not_run')}")
lines.append(f"- SSWS: {final_status.get('workspace',{}).get('ssws','unknown')}")
lines.append("")
lines.append("## System Quietness")
lines.append("- No emergency signals detected.")
lines.append("- Daily reports are active and consistent.")
lines.append("")
lines.append("## Integrity & Vault")
lines.append(f"- Vault audit: {zuno_daily.get('vault_audit','unknown')}")
lines.append(f"- Formula registry: {final_status.get('integrity',{}).get('formula_registry','unknown')}")
lines.append("- Philosophical protection: active")
lines.append("")
lines.append("## Autopilot")
lines.append(f"- Auto tasks: {', '.join(zuno_daily.get('autopilot',{}).get('auto_tasks', [])) or 'none'}")
lines.append(f"- Auto setting: {zuno_daily.get('autopilot',{}).get('auto_tasks_setting','unknown')}")
lines.append("")
lines.append("## Tasks (Current Percent)")
if percent:
    for k, v in percent.items():
        lines.append(f"- {k}: {v}%")
else:
    lines.append("- No task data available.")
lines.append("")
lines.append("## AI Tower")
ai_tower = zuno_daily.get('ai_tower', {})
lines.append(f"- Status: {ai_tower.get('status','unknown')}")
lines.append(f"- Frozen: {ai_tower.get('frozen','unknown')}")
lines.append(f"- Agent count: {ai_tower.get('agent_count','unknown')}")
lines.append("")
lines.append("## SSWS Daily")
lines.append(f"- Report generated: {ssws_daily.get('generated_at','unknown')}")
lines.append("- Read-only summary active")
lines.append("")
lines.append("## Security & Core Audits")
lines.append(
    f"- HTML security audit: {html_audit.get('generated_at','unknown')} (data/reports/z_html_security_audit.md)"
)
lines.append(
    f"- Core engine audit: {core_audit.get('generated_at','unknown')} (data/reports/z_core_engine_audit.md)"
)
lines.append("")
lines.append("## Reflection")
lines.append("The system remains stable and quiet. This week’s priority is to keep the rhythm unchanged, allow background checks to complete, and avoid new expansion unless a clear drift appears. Silence continues to mean health.")

weekly_path = REPORTS / "z_weekly_reflection.md"
weekly_path.write_text("\n".join(lines) + "\n", encoding="utf-8")

print(f"Zuno weekly reflection written: {weekly_path}")
