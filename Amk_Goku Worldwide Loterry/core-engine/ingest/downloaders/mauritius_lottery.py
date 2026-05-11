"""Downloader placeholder for Mauritius Green Lottery (Loto Vert)."""


def fetch() -> dict[str, str]:
    """Explain manual download process for Mauritius history."""
    raise RuntimeError(
        "Mauritius Loto Vert CSV feed is not publicly exposed. "
        "Please download the 'Lottery Vert' history from the official Mauritius lottery "
        "portal (or a trusted mirror), place it at data/incoming/mauritius-loto-vert.csv, "
        "and rerun ingest."
    )
