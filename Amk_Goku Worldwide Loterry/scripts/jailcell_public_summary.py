import json
from collections import Counter
from pathlib import Path

SRC = Path('data/jailcell/specimens.json')
OUT = Path('data/jailcell/public_summary.json')


def main():
    if not SRC.exists():
        OUT.write_text(json.dumps({
            'status': 'no_data',
            'total': 0,
            'by_category': {},
            'by_severity': {},
            'notes': 'No specimens recorded yet.'
        }, indent=2))
        return

    items = json.loads(SRC.read_text())
    cats = Counter(i.get('category', 'UNKNOWN') for i in items)
    sev = Counter(i.get('severity', 'LOW') for i in items)

    OUT.write_text(json.dumps({
        'status': 'ok',
        'total': len(items),
        'by_category': dict(cats),
        'by_severity': dict(sev),
        'notes': 'Read-only quarantine. No actions executed.'
    }, indent=2))


if __name__ == '__main__':
    main()
