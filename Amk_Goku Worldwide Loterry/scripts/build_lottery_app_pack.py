import json, shutil, hashlib, datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
now = datetime.datetime.now(datetime.UTC)
timestamp = now.strftime('%Y%m%dT%H%M%SZ')
OUT = ROOT / 'exports' / f"lottery_app_pack_{timestamp}"
LATEST_DIR = ROOT / 'exports' / "lottery_app_pack_latest"
LATEST_ZIP = ROOT / 'exports' / "lottery_app_pack_latest.zip"
OUT.mkdir(parents=True, exist_ok=True)

FILES = [
    'index.html',
    'ui/lottery_app.html',
    'ui/lottery_vault/checklist.html',
    'ui/drift_watch.html',
    'ui/drift_watch/index.html',
    'ui/world_observer.html',
    'ui/feeling_panel.html',
    'ui/kairocell_overlay.html',
    'ui/education/orientation.html',
    'ui/education/learning_cards.html',
    'ui/public_trust/index.html',
    'ui/delivery.html',
    'trust/trust_walkthrough.html',
    'trust/education_mode_mirror.html',
    'ui/notebook/basic_notebook.html',
    'ui/circles/circle_learning_view.html',
    'ui/z_bootstrap.js',
    'core/feeling/feeling_panel.css',
    'core/feeling/feeling_panel.js',
    'core/feeling/z_feeling_analyzer.js',
    'core/z_chronicle.js',
    'core/z_super_ghost_ingest.js',
    'docs/audiology/Z_AUDIOLOGY_CHARTER.md',
    'docs/audiology/Z_AUDIOLOGY_OATH.md',
    'docs/audiology/Z_AUDIOLOGY_TESTS.md',
    'docs/audiology/Z_AUDIOLOGY_MULTILINGUAL_POLICY.md',
    'docs/audiology/Z_AUDIOLOGY_UI_POLICY.md',
    'core/audiology/z_audiology_manifest.json',
    'core/audiology/z_audiology_schema.json',
]

hashes = {}
for rel in FILES:
    src = ROOT / rel
    dest = OUT / rel
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(src, dest)
    hashes[rel] = hashlib.sha256(dest.read_bytes()).hexdigest()

manifest = {
    'generated_at': now.isoformat().replace('+00:00', 'Z'),
    'authority': 'observational-only',
    'contents': list(FILES),
    'hashes': hashes,
}
(OUT / 'MANIFEST.json').write_text(json.dumps(manifest, indent=2))

zip_path = shutil.make_archive(str(OUT), 'zip', root_dir=OUT)

# Update "latest" pointers (copy, not symlink for portability)
if LATEST_DIR.exists():
    shutil.rmtree(LATEST_DIR)
shutil.copytree(OUT, LATEST_DIR)
shutil.copyfile(zip_path, LATEST_ZIP)

print('Lottery app pack built:', OUT)
print('Zipped:', zip_path)
print('Latest dir:', LATEST_DIR)
print('Latest zip:', LATEST_ZIP)
