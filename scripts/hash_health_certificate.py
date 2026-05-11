from __future__ import annotations

from pathlib import Path
import hashlib


ROOT = Path(__file__).resolve().parents[1]
CERT = ROOT / "data" / "reports" / "Z_SYSTEM_HEALTH_CERTIFICATE.md"
OUT = ROOT / "data" / "reports" / "Z_SYSTEM_HEALTH_CERTIFICATE.sha256"


def main() -> None:
    if not CERT.exists():
        raise SystemExit("Certificate missing")

    digest = hashlib.sha256(CERT.read_bytes()).hexdigest()
    OUT.write_text(f"{digest}  {CERT.name}\n", encoding="utf-8")
    print("Health certificate hash written:", OUT)


if __name__ == "__main__":
    main()
