"""Downloader for the UK Lotto draw archive."""

from .base import download_csv

UK_LOTTO_URL = "https://www.national-lottery.co.uk/results/lotto/draw-history/csv"


def fetch() -> dict[str, str]:
    """Grab the CSV export from the National Lottery site."""
    return download_csv(UK_LOTTO_URL, "uk-lotto.csv")
