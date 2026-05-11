import json
import hashlib
import datetime
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parents[1]
EXPORTS = ROOT / "exports"
STAMP = datetime.datetime.now(datetime.UTC).strftime("%Y-%m")
OUT = EXPORTS / f"trust_pack_{STAMP}"

LOTTERY_ROOT = ROOT / "Amk_Goku Worldwide Loterry"
DATA_ROOT = LOTTERY_ROOT / "data"
REPORTS_ROOT = DATA_ROOT / "reports"
TRUST_ROOT = REPORTS_ROOT / "trust"

def newest_file(pattern: str, root: Path) -> Path | None:
    items = sorted(root.glob(pattern), key=lambda p: p.stat().st_mtime, reverse=True)
    return items[0] if items else None

trust_bundle = newest_file("trust_bundle_*.json", TRUST_ROOT)

FILES = {
    "SYSTEM_STATUS.json": "Amk_Goku Worldwide Loterry/data/reports/system_status.json",
    "FINAL_STATUS.json": "data/reports/z_final_status.json",
    "HEALTH_CERTIFICATE.md": "data/reports/Z_SYSTEM_HEALTH_CERTIFICATE.md",
    "TRUST_BUNDLE.json": str(trust_bundle) if trust_bundle else None,
    "observatory/rhythm_trust.json": "Amk_Goku Worldwide Loterry/data/reports/rhythm_trust.json",
    "observatory/jailcell_trust.json": "Amk_Goku Worldwide Loterry/data/reports/jailcell_trust.json",
    "observatory/learning_digest.json": "Amk_Goku Worldwide Loterry/data/reports/learning_digest_latest.json",
    "observatory/monthly_change_log.json": "Amk_Goku Worldwide Loterry/data/reports/monthly_change_log_latest.json",
    "registry/api_registry.json": "Amk_Goku Worldwide Loterry/core-engine/api_conductor/registry/api_registry.json"
}

def hash_file(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()

def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "verification").mkdir(parents=True, exist_ok=True)

    hashes = {}

    missing = []
    for dest, src in FILES.items():
        if not src:
            missing.append(dest)
            continue
        src_path = Path(src)
        if not src_path.is_absolute():
            src_path = ROOT / src_path
        dest_path = OUT / dest
        dest_path.parent.mkdir(parents=True, exist_ok=True)
        if not src_path.exists():
            missing.append(str(src_path))
            continue
        shutil.copyfile(src_path, dest_path)
        hashes[dest] = hash_file(dest_path)

    manifest = {
        "generated_at": datetime.datetime.now(datetime.UTC).isoformat().replace("+00:00", "Z"),
        "authority": "observational-only",
        "contents": list(hashes.keys()),
        "missing": missing,
        "hashes": hashes
    }

    (OUT / "MANIFEST.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    (OUT / "verification" / "hashes.sha256").write_text(
        "\n".join(f"{v}  {k}" for k, v in hashes.items()),
        encoding="utf-8"
    )
    (OUT / "verification" / "generated_at.txt").write_text(manifest["generated_at"], encoding="utf-8")

    (OUT / "README.md").write_text(
        "# Z-Sanctuary Trust Pack\n\n"
        "This bundle is a static integrity snapshot.\n"
        "It contains no execution logic, no personal data,\n"
        "and no claims of predictive authority.\n\n"
        "All contents are observational and reversible.\n"
        "Stillness is a feature: the system is allowed to pause.\n",
        encoding="utf-8"
    )

    (OUT / "TRUST_PACK_STATUS.json").write_text(
        json.dumps(
            {
                "status": "reference",
                "core_version": "v1.0",
                "learning_spine": "active",
                "mutation_policy": "append-only",
                "note": "This pack represents a stable trust baseline."
            },
            indent=2
        ),
        encoding="utf-8"
    )

    cert_hash_src = ROOT / "data" / "reports" / "Z_SYSTEM_HEALTH_CERTIFICATE.sha256"
    if cert_hash_src.exists():
        shutil.copyfile(cert_hash_src, OUT / "verification" / "health_certificate.sha256")

    print(f"Trust Pack built at {OUT}")

if __name__ == "__main__":
    main()
