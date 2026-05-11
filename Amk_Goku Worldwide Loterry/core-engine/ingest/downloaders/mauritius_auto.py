"""Automated fetcher for Mauritius Loto Vert history."""

from __future__ import annotations

import requests
from pathlib import Path

from .feed_helpers import FeedDefinition, FeedSource, INCOMING_DIR, parse_html_table, write_canonical


def fetch() -> dict[str, str]:
    feeds = FeedDefinition(
        name="Mauritius Loto Vert",
        sources=[
            FeedSource(
                url="https://www.lottery.govmu.org/results/loto-vert",
                parser="table",
                output="mauritius-loto-vert.csv",
            ),
            FeedSource(
                url="https://www.lottery.govmu.org/results/loto-vert-history",
                parser="table",
                output="mauritius-loto-vert.csv",
            ),
        ],
    )
    for source in feeds.sources:
        dest = INCOMING_DIR / source.output
        try:
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
        "Automated Mauritius Loto Vert download failed. Please fetch manually and drop `mauritius-loto-vert.csv` into data/incoming/."
    )
