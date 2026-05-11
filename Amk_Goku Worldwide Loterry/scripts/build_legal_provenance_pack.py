import json, shutil, hashlib
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'exports' / f"legal_provenance_pack_{datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')}"
LATEST_DIR = ROOT / 'exports' / 'legal_provenance_pack_latest'
LATEST_ZIP = ROOT / 'exports' / 'legal_provenance_pack_latest.zip'

FILES = {
    'LEGAL.md': 'docs/legal/LEGAL.md',
    'SYSTEM_STATUS.json': 'data/reports/system_status.json',
    'TRUST_BUNDLE.json': 'data/reports/trust/trust_bundle_latest.json',
    'SAFE_VAULT_MANIFEST.json': 'data/safe_vault/MANIFEST.json',
    'SAFE_VAULT_CONDITIONS.md': 'data/safe_vault/CONDITIONS.md',
    'SAFE_VAULT_SUMMARY.md': 'data/safe_vault/REPORT_SUMMARY.md',
    'audiology/Z_AUDIOLOGY_CHARTER.md': 'docs/audiology/Z_AUDIOLOGY_CHARTER.md',
    'audiology/Z_AUDIOLOGY_OATH.md': 'docs/audiology/Z_AUDIOLOGY_OATH.md',
    'audiology/Z_AUDIOLOGY_TESTS.md': 'docs/audiology/Z_AUDIOLOGY_TESTS.md',
    'audiology/Z_AUDIOLOGY_MULTILINGUAL_POLICY.md': 'docs/audiology/Z_AUDIOLOGY_MULTILINGUAL_POLICY.md',
    'audiology/Z_AUDIOLOGY_UI_POLICY.md': 'docs/audiology/Z_AUDIOLOGY_UI_POLICY.md',
    'audiology/z_audiology_manifest.json': 'core/audiology/z_audiology_manifest.json',
    'audiology/z_audiology_schema.json': 'core/audiology/z_audiology_schema.json',
}

OUT.mkdir(parents=True, exist_ok=True)

hashes = {}
for dest, src in FILES.items():
    src_path = ROOT / src
    dest_path = OUT / dest
    dest_path.parent.mkdir(parents=True, exist_ok=True)
    if src_path.exists():
        dest_path.write_bytes(src_path.read_bytes())
        hashes[dest] = hashlib.sha256(dest_path.read_bytes()).hexdigest()

manifest = {
    'generated_at': datetime.now(timezone.utc).isoformat(),
    'authority': 'observational-only',
    'contents': list(FILES.keys()),
    'hashes': hashes,
    'notes': 'Legal Provenance Pack for audit and compliance verification.'
}

(OUT / 'MANIFEST.json').write_text(json.dumps(manifest, indent=2))
zip_path = shutil.make_archive(str(OUT), 'zip', root_dir=OUT)

if LATEST_DIR.exists():
    shutil.rmtree(LATEST_DIR)
shutil.copytree(OUT, LATEST_DIR)
shutil.copyfile(zip_path, LATEST_ZIP)

print('Legal Provenance Pack built:', OUT)
print('Zipped:', zip_path)
print('Latest dir:', LATEST_DIR)
print('Latest zip:', LATEST_ZIP)
