"""Downloader for the US Powerball archive."""

from .base import download_csv

POWERBALL_URL = (
    "https://data.ny.gov/api/views/d6yy-54nr/rows.csv?accessType=DOWNLOAD"
)


def fetch() -> dict[str, str]:
    """Download the most recent Powerball history CSV."""
    return download_csv(POWERBALL_URL, "powerball.csv")
