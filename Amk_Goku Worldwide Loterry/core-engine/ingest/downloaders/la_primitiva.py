"""Downloader placeholder for La Primitiva (manual download required)."""


def fetch() -> dict[str, str]:
    """Raise to remind operators to add the file manually."""
    raise RuntimeError(
        "La Primitiva does not publish a stable CSV endpoint. "
        "Please download the latest history from the official site "
        "and place it at data/incoming/la_primitiva.csv before running ingest."
    )
