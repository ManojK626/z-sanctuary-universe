"""Automated fetcher for La Primitiva history."""

from __future__ import annotations

import requests
from pathlib import Path

from .feed_helpers import FeedDefinition, FeedSource, INCOMING_DIR, download_csv, parse_html_table, write_canonical


def fetch() -> dict[str, str]:
    feeds = FeedDefinition(
        name="La Primitiva",
        sources=[
            FeedSource(
                url="https://www.loteriasyapuestas.es/es/la-primitiva/resultados/draw-history",
                parser="table",
                output="la-primitiva.csv",
            ),
            FeedSource(
                url="https://www.loteriasyapuestas.es/es/la-primitiva/draw-history/csv",
                parser="csv",
                output="la-primitiva.csv",
            ),
        ],
    )
    for source in feeds.sources:
        dest = INCOMING_DIR / source.output
        try:
            if source.parser == "csv":
                resp = requests.get(source.url, headers={"User-Agent": "Z-Sanctuary Agent"}, timeout=30)
                resp.raise_for_status()
                if resp.text.lstrip().startswith("<"):
                    continue
                dest.write_text(resp.text)
                return {"file": str(dest), "source": source.url}
            else:
                resp = requests.get(source.url, headers={"User-Agent": "Z-Sanctuary Agent"}, timeout=30)
                resp.raise_for_status()
                rows = parse_html_table(resp.text, feeds.draw_columns)
                if not rows:
                    continue
                write_canonical(rows, dest)
                return {"file": str(dest), "source": source.url}
        except Exception:
            continue
    raise RuntimeError(
        "Automated La Primitiva download failed. Please fetch manually and drop `la-primitiva.csv` into data/incoming/."
    )
