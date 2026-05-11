"""Shared schema helpers for canonical lottery CSV normalization."""

from __future__ import annotations

import re
from datetime import datetime
from typing import Dict, Iterable, List, Optional, Tuple

CANONICAL_COLUMNS = [
    "draw_date",
    "main_1",
    "main_2",
    "main_3",
    "main_4",
    "main_5",
    "bonus_1",
    "bonus_2",
]

COLUMN_ALIASES: Dict[str, str] = {
    "draw date": "draw_date",
    "draw_date": "draw_date",
    "drawdate": "draw_date",
    "ball 1": "main_1",
    "ball 2": "main_2",
    "ball 3": "main_3",
    "ball 4": "main_4",
    "ball 5": "main_5",
    "ball1": "main_1",
    "ball2": "main_2",
    "ball3": "main_3",
    "ball4": "main_4",
    "ball5": "main_5",
    "number 1": "main_1",
    "number 2": "main_2",
    "number 3": "main_3",
    "number 4": "main_4",
    "number 5": "main_5",
    "num 1": "main_1",
    "num 2": "main_2",
    "num 3": "main_3",
    "num 4": "main_4",
    "num 5": "main_5",
    "white ball 1": "main_1",
    "white ball 2": "main_2",
    "white ball 3": "main_3",
    "white ball 4": "main_4",
    "white ball 5": "main_5",
    "lucky_1": "bonus_1",
    "lucky_2": "bonus_2",
    "bonus": "bonus_1",
    "bonus_ball": "bonus_1",
    "mega_ball": "bonus_1",
    "mega ball": "bonus_1",
    "powerball": "bonus_1",
    "power ball": "bonus_1",
    "megaball": "bonus_1",
    "pb": "bonus_1",
    "mb": "bonus_1",
}

WINNING_NUMBER_HEADERS = {"winning numbers", "winning_numbers", "drawn numbers", "numbers"}


def parse_date(value: str) -> datetime:
    for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%Y/%m/%d", "%m/%d/%Y"):
        try:
            return datetime.strptime(value.strip(), fmt)
        except ValueError:
            continue
    return datetime.fromisoformat(value.strip())


def ensure_schema(header: Iterable[str]) -> Tuple[Dict[str, str], List[str]]:
    header_map: Dict[str, str] = {}
    cleaned: List[str] = []
    for raw in header:
        normalized = raw.strip()
        lower = normalized.lower()
        target = COLUMN_ALIASES.get(lower, normalized)
        if target in CANONICAL_COLUMNS:
            header_map[lower] = target
            cleaned.append(target)
    missing = [col for col in CANONICAL_COLUMNS if col not in cleaned]
    return header_map, missing


def find_winning_numbers_header(header: Iterable[str]) -> Optional[str]:
    for raw in header:
        normalized = raw.strip().lower().replace(" ", "_")
        if normalized in WINNING_NUMBER_HEADERS:
            return raw
    return None


def fill_from_winning_numbers(
    normalized: Dict[str, str],
    row: Dict[str, str],
    winning_header: Optional[str],
) -> None:
    if not winning_header:
        return
    raw = row.get(winning_header, "")
    if not raw or raw.strip() == "":
        return
    tokens = [
        part
        for part in re.split(r"[\s,]+", raw.strip())
        if part and part.lower() != "bonus"
    ]
    if len(tokens) < 5:
        return
    for idx in range(5):
        target = f"main_{idx+1}"
        if not normalized[target] and idx < len(tokens):
            normalized[target] = tokens[idx]
    if not normalized["bonus_1"] and len(tokens) > 5:
        normalized["bonus_1"] = tokens[5]
    if len(tokens) > 6 and not normalized["bonus_2"]:
        normalized["bonus_2"] = tokens[6]


def normalize_row(
    row: Dict[str, str],
    header_map: Dict[str, str],
    winning_header: Optional[str],
) -> Dict[str, str]:
    normalized: Dict[str, str] = {col: "" for col in CANONICAL_COLUMNS}
    for raw, val in row.items():
        key = raw.strip()
        mapped = header_map.get(key.lower())
        if not mapped:
            continue
        normalized[mapped] = val.strip()
    fill_from_winning_numbers(normalized, row, winning_header)
    return normalized
