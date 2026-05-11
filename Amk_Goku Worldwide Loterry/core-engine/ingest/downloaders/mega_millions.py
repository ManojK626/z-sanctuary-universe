"""Downloader for the Mega Millions archive."""

from .base import download_csv

MEGA_MILLIONS_URL = (
    "https://data.ny.gov/api/views/5xaw-6ayf/rows.csv?accessType=DOWNLOAD"
)


def fetch() -> dict[str, str]:
    """Download the latest Mega Millions CSV."""
    return download_csv(MEGA_MILLIONS_URL, "mega-millions.csv")
