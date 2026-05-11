import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
UI_DIR = ROOT / 'ui'
TRUST_DIR = ROOT / 'trust'

pattern = re.compile(r'(?:src|href)="([^"]+)"')

errors = []

for html in list(UI_DIR.rglob('*.html')) + list(TRUST_DIR.rglob('*.html')):
    text = html.read_text(encoding='utf-8', errors='ignore')
    for match in pattern.findall(text):
        if match.startswith(('http://', 'https://', 'data:')):
            continue
        if match.startswith('#'):
            continue
        if '${' in match:
            continue
        # Normalize relative path
        target = (html.parent / match).resolve()
        # Allow links that point to directories or query strings
        if match.endswith('/'):
            continue
        if not target.exists():
            errors.append(f"{html.relative_to(ROOT)} -> missing {match}")

if errors:
    print('Missing HTML references:')
    for e in errors:
        print(' -', e)
    sys.exit(1)

print('HTML reference check passed.')
