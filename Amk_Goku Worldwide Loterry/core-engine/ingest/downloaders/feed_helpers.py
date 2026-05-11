"""Shared helpers to automate lottery feed downloads."""

from __future__ import annotations

import csv
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, List, Optional

import requests
from bs4 import BeautifulSoup

INCOMING_DIR = Path(__file__).resolve().parents[3] / "data" / "incoming"
INCOMING_DIR.mkdir(parents=True, exist_ok=True)


@dataclass
class FeedSource:
    url: str
    parser: str  # 'csv', 'table'
    output: str


@dataclass
class FeedDefinition:
    name: str
    sources: List[FeedSource]
    draw_columns: int = 7  # total numbers per draw (main + bonus)


def download_csv(url: str, dest: Path) -> bool:
    resp = requests.get(url, headers={"User-Agent": "Z-Sanctuary Agent"}, timeout=30)
    resp.raise_for_status()
    data = resp.text
    if data.lstrip().startswith("<"):
        return False
    dest.write_text(data)
    return True


def parse_html_table(html: str, columns: int) -> Optional[List[List[str]]]:
    soup = BeautifulSoup(html, "html.parser")
    table = soup.find("table")
    if not table:
        return None
    rows: List[List[str]] = []
    for tr in table.find_all("tr"):
        cells = [cell.get_text(" ", strip=True) for cell in tr.find_all(["th", "td"])]
        if not cells or len(cells) < columns + 1:
            continue
        rows.append(cells[: columns + 1])
    return rows if rows else None


def write_canonical(rows: Iterable[List[str]], dest: Path) -> None:
    fieldnames = ["draw_date", "main_1", "main_2", "main_3", "main_4", "main_5", "bonus_1", "bonus_2"]
    with dest.open("w", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=fieldnames)
        writer.writeheader()
        for row in rows:
            date = row[0]
            numbers = [token for group in row[1:] for token in group.split() if token.isdigit()]
            while len(numbers) < 7:
                numbers.append("")
            writer.writerow(
                {
                    "draw_date": date,
                    "main_1": numbers[0],
                    "main_2": numbers[1],
                    "main_3": numbers[2],
                    "main_4": numbers[3],
                    "main_5": numbers[4],
                    "bonus_1": numbers[5],
                    "bonus_2": numbers[6],
                }
            )
