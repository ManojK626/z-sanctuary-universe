"""Shared downloader helpers for the Z-Sanctuary ingest layer."""

from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path
from urllib.request import Request, urlopen

INCOMING_DIR = Path(__file__).resolve().parents[3] / "data" / "incoming"
INCOMING_DIR.mkdir(parents=True, exist_ok=True)


def download_csv(url: str, filename: str) -> dict[str, str]:
    """Fetch bytes from URL and store them in the incoming directory."""
    request = Request(url, headers={"User-Agent": "Z-Sanctuary Agent"})
    with urlopen(request, timeout=30) as response:
        payload = response.read()

    dest = INCOMING_DIR / filename
    dest.write_bytes(payload)
    return {
        "file": str(dest),
        "filename": filename,
        "downloaded_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "bytes": len(payload),
    }
