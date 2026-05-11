from __future__ import annotations
from pathlib import Path
from datetime import datetime, timezone
import json

ROOT = Path(r"c:\\ZSanctuary_Universe")
REPORTS = ROOT / "data" / "reports"
REPORTS.mkdir(parents=True, exist_ok=True)

EXCLUDE_PARTS = {"node_modules", "exports", ".git", ".vscode"}

ACCESS_SCRIPT = '/interface/z_accessibility.js'
SEC_GATE_SCRIPT = './z_security_gate.js'

html_files = []
for path in ROOT.rglob('*.html'):
    if any(part in EXCLUDE_PARTS for part in path.parts):
        continue
    html_files.append(path)

results = []
updated = []

for path in html_files:
    rel = path.relative_to(ROOT).as_posix()
    text = path.read_text(encoding='utf-8')
    has_access = ACCESS_SCRIPT in text
    has_gate = SEC_GATE_SCRIPT in text or '/core/z_security_gate.js' in text
    needs_gate = rel.startswith('core/') or rel.startswith('dashboard/')

    changed = False

    if not has_access:
        insert = f"\n    <script src=\"{ACCESS_SCRIPT}\"></script>\n"
        if '</body>' in text:
            text = text.replace('</body>', insert + '</body>')
        else:
            text += insert
        changed = True

    if needs_gate and not has_gate:
        insert = "\n    <script src=\"./z_security_gate.js\"></script>\n"
        if '</body>' in text:
            text = text.replace('</body>', insert + '</body>')
        else:
            text += insert
        changed = True

    if changed:
        path.write_text(text, encoding='utf-8')
        updated.append(rel)

    results.append({
        "file": rel,
        "has_accessibility": ACCESS_SCRIPT in text,
        "needs_security_gate": needs_gate,
        "has_security_gate": (SEC_GATE_SCRIPT in text) or ('/core/z_security_gate.js' in text)
    })

now = datetime.now(timezone.utc).isoformat().replace('+00:00','Z')

report = {
    "generated_at": now,
    "checked": len(results),
    "updated": updated,
    "results": results
}

(REPORTS / 'z_html_security_audit.json').write_text(json.dumps(report, indent=2) + "\n", encoding='utf-8')

lines = [
    "# HTML Security + Accessibility Audit",
    f"Generated: {now}",
    "",
    f"Files checked: {len(results)}",
    f"Files updated: {len(updated)}",
    "",
    "## Updated Files",
]
if updated:
    lines += [f"- `{u}`" for u in updated]
else:
    lines.append("- None")

lines += ["", "## Missing (if any)"]
missing = [r for r in results if r['needs_security_gate'] and not r['has_security_gate']]
if missing:
    lines += [f"- `{r['file']}` missing security gate" for r in missing]
else:
    lines.append("- None")

(REPORTS / 'z_html_security_audit.md').write_text("\n".join(lines) + "\n", encoding='utf-8')

print(f"HTML audit complete. Updated {len(updated)} file(s).")
