import json, shutil, hashlib, datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
now = datetime.datetime.now(datetime.UTC)
timestamp = now.strftime('%Y%m%dT%H%M%SZ')
OUT = ROOT / 'exports' / f"trust_pack_{timestamp}"
LATEST_DIR = ROOT / 'exports' / "trust_pack_latest"
LATEST_ZIP = ROOT / 'exports' / "trust_pack_latest.zip"
OUT.mkdir(parents=True, exist_ok=True)

FILES = {
    'SYSTEM_STATUS.json': 'data/reports/system_status.json',
    'TRUST_BUNDLE.json': 'data/reports/trust/trust_bundle_latest.json',
    'observatory/rhythm_trust.json': 'data/reports/rhythm_trust.json',
    'observatory/jailcell_trust.json': 'data/reports/jailcell_trust.json',
    'observatory/learning_digest.json': 'data/reports/learning_digest_latest.json',
    'observatory/monthly_change_log.json': 'data/reports/monthly_change_log_latest.json',
    'registry/api_registry.json': 'core-engine/api_conductor/registry/api_registry.json',
    'audiology/Z_AUDIOLOGY_CHARTER.md': 'docs/audiology/Z_AUDIOLOGY_CHARTER.md',
    'audiology/Z_AUDIOLOGY_OATH.md': 'docs/audiology/Z_AUDIOLOGY_OATH.md',
    'audiology/Z_AUDIOLOGY_TESTS.md': 'docs/audiology/Z_AUDIOLOGY_TESTS.md',
    'audiology/Z_AUDIOLOGY_MULTILINGUAL_POLICY.md': 'docs/audiology/Z_AUDIOLOGY_MULTILINGUAL_POLICY.md',
    'audiology/Z_AUDIOLOGY_UI_POLICY.md': 'docs/audiology/Z_AUDIOLOGY_UI_POLICY.md',
    'audiology/z_audiology_manifest.json': 'core/audiology/z_audiology_manifest.json',
    'audiology/z_audiology_schema.json': 'core/audiology/z_audiology_schema.json',
}

hashes = {}
for dest, src in FILES.items():
    src_path = ROOT / src
    dest_path = OUT / dest
    dest_path.parent.mkdir(parents=True, exist_ok=True)
    if src_path.exists():
        dest_path.write_bytes(src_path.read_bytes())
        hashes[dest] = hashlib.sha256(dest_path.read_bytes()).hexdigest()

manifest = {
    'generated_at': now.isoformat().replace('+00:00', 'Z'),
    'authority': 'observational-only',
    'contents': list(FILES.keys()),
    'hashes': hashes,
}

(OUT / 'MANIFEST.json').write_text(json.dumps(manifest, indent=2))
zip_path = shutil.make_archive(str(OUT), 'zip', root_dir=OUT)

if LATEST_DIR.exists():
    shutil.rmtree(LATEST_DIR)
shutil.copytree(OUT, LATEST_DIR)
shutil.copyfile(zip_path, LATEST_ZIP)

print('Trust pack built:', OUT)
print('Zipped:', zip_path)
print('Latest dir:', LATEST_DIR)
print('Latest zip:', LATEST_ZIP)
