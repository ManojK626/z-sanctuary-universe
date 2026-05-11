from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
import hashlib
import shutil

REPO_ROOT = Path(__file__).resolve().parents[1]
VAULT_DIR = REPO_ROOT / "data" / "safe_vault"
EXPORTS_DIR = REPO_ROOT / "exports" / "safe_vault"
PUBLIC_DIR = REPO_ROOT / "exports" / "safe_vault_public"
RETENTION = 5
SUMMARY_PATH = VAULT_DIR / "REPORT_SUMMARY.md"
MANIFEST_PATH = VAULT_DIR / "MANIFEST.json"
CONDITIONS_PATH = VAULT_DIR / "CONDITIONS.md"
PUBLIC_LATEST_ZIP = PUBLIC_DIR / "safe_vault_latest.zip"
AUDIOLOGY_FILES = [
    REPO_ROOT / "docs" / "audiology" / "Z_AUDIOLOGY_CHARTER.md",
    REPO_ROOT / "docs" / "audiology" / "Z_AUDIOLOGY_OATH.md",
    REPO_ROOT / "docs" / "audiology" / "Z_AUDIOLOGY_TESTS.md",
    REPO_ROOT / "docs" / "audiology" / "Z_AUDIOLOGY_MULTILINGUAL_POLICY.md",
    REPO_ROOT / "docs" / "audiology" / "Z_AUDIOLOGY_UI_POLICY.md",
    REPO_ROOT / "core" / "audiology" / "z_audiology_manifest.json",
    REPO_ROOT / "core" / "audiology" / "z_audiology_schema.json",
]


def sha256_path(path: Path) -> str:
    h = hashlib.sha256()
    h.update(path.read_bytes())
    return h.hexdigest()


def main() -> None:
    if not SUMMARY_PATH.exists():
        raise SystemExit("Missing REPORT_SUMMARY.md. Create it first.")
    if not CONDITIONS_PATH.exists():
        raise SystemExit("Missing CONDITIONS.md. Create it first.")

    ts = datetime.now(timezone.utc).isoformat()
    manifest = {
        "vault": "Z-Sanctuary Safe Vault",
        "version": "1.0.0",
        "generated_at": ts,
        "authority": "observational-only",
        "audience_tiers": ["internal", "partner", "public-redacted"],
        "conditions_file": "CONDITIONS.md",
        "contents": [
            "REPORT_SUMMARY.md",
            "CONDITIONS.md",
            *[
                str(path.relative_to(REPO_ROOT)).replace("\\", "/")
                for path in AUDIOLOGY_FILES
            ],
        ],
    }

    VAULT_DIR.mkdir(parents=True, exist_ok=True)
    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print("Safe Vault manifest updated:", MANIFEST_PATH)

    # Build versioned bundle with hashes
    versioned = EXPORTS_DIR / f"safe_vault_{ts.replace(':', '').replace('-', '')}"
    versioned.mkdir(parents=True, exist_ok=True)
    files = [SUMMARY_PATH, CONDITIONS_PATH, MANIFEST_PATH, *AUDIOLOGY_FILES]
    hashes = {}
    for src in files:
        if src.is_absolute() and str(src).startswith(str(VAULT_DIR)):
            rel = Path(src.name)
        else:
            rel = src.relative_to(REPO_ROOT) if src.is_absolute() else Path(src)
        dest = versioned / rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(src.read_bytes())
        hashes[str(rel).replace("\\", "/")] = sha256_path(dest)

    (versioned / "hashes.sha256").write_text(
        "\n".join(f"{v}  {k}" for k, v in hashes.items()),
        encoding="utf-8"
    )
    print("Versioned Safe Vault bundle:", versioned)

    # Zip the bundle
    zip_path = shutil.make_archive(str(versioned), "zip", root_dir=versioned)
    print("Zipped bundle:", zip_path)

    # Redacted public bundle (conditions + manifest + summary only)
    public_bundle = PUBLIC_DIR / versioned.name
    public_bundle.mkdir(parents=True, exist_ok=True)
    for src in [SUMMARY_PATH, CONDITIONS_PATH, MANIFEST_PATH, *AUDIOLOGY_FILES]:
        if src.is_absolute() and str(src).startswith(str(VAULT_DIR)):
            rel = Path(src.name)
        else:
            rel = src.relative_to(REPO_ROOT) if src.is_absolute() else Path(src)
        dest = public_bundle / rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(src.read_bytes())
    pub_hashes = {}
    for p in public_bundle.rglob("*"):
        if p.is_file():
            rel = str(p.relative_to(public_bundle)).replace("\\", "/")
            pub_hashes[rel] = sha256_path(p)
    (public_bundle / "hashes.sha256").write_text(
        "\n".join(f"{v}  {k}" for k, v in pub_hashes.items()),
        encoding="utf-8"
    )
    shutil.make_archive(str(public_bundle), "zip", root_dir=public_bundle)
    print("Public redacted bundle:", public_bundle)
    if PUBLIC_LATEST_ZIP.exists():
        PUBLIC_LATEST_ZIP.unlink()
    shutil.copyfile(f"{public_bundle}.zip", PUBLIC_LATEST_ZIP)

    # Rotate old bundles
    bundles = sorted(EXPORTS_DIR.glob("safe_vault_*"), key=lambda p: p.stat().st_mtime, reverse=True)
    for old in bundles[RETENTION:]:
        if old.is_dir():
            shutil.rmtree(old)
        elif old.suffix == ".zip":
            old.unlink()


if __name__ == "__main__":
    main()
