"""Analytics helpers for category heatmaps and frequency reporting."""
from __future__ import annotations

import argparse
import csv
from collections import Counter
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, List, Tuple


CATEGORY_BANDS: Tuple[Tuple[str, float, str], ...] = (
    ("A", 0.2, "Extremely Cold"),
    ("B", 0.4, "Cold"),
    ("C", 0.6, "Medium"),
    ("D", 0.8, "Hot"),
)


@dataclass(frozen=True)
class HeatmapReport:
    band: str
    label: str
    numbers: List[int]
    strength: float


def load_draws(path: Path) -> List[Tuple[List[int], List[int]]]:
    rows: List[Tuple[List[int], List[int]]] = []
    with path.open() as fh:
        reader = csv.DictReader(fh)
        for row in reader:
            mains = [int(row[f"main_{i}"]) for i in range(1, 6)]
            luckies = [int(row[f"lucky_{i}"]) for i in range(1, 3)]
            rows.append((mains, luckies))
    return rows


def number_frequencies(draws: Iterable[Tuple[List[int], List[int]]]) -> Counter:
    freq = Counter()
    for mains, _ in draws:
        freq.update(mains)
    return freq


def categorize_numbers(pool: Iterable[int], freq: Counter) -> List[HeatmapReport]:
    pool_list = sorted(pool)
    sorted_cold = sorted(pool_list, key=lambda n: freq.get(n, 0))
    total = len(pool_list)
    pointer = 0
    reports: List[HeatmapReport] = []
    for band, percent, label in CATEGORY_BANDS:
        size = max(1, round(percent * total))
        segment = sorted_cold[pointer : pointer + size]
        pointer += size
        strength = sum(freq.get(n, 0) for n in segment) / max(1, len(segment))
        reports.append(HeatmapReport(band, label, segment, strength))
    if pointer < total:
        segment = sorted_cold[pointer:]
        strength = sum(freq.get(n, 0) for n in segment) / max(1, len(segment))
        reports.append(HeatmapReport("E", "Overflow", segment, strength))
    return reports


def describe_heatmap(reports: List[HeatmapReport]) -> None:
    for report in reports:
        print(f"Band {report.band} ({report.label}): {len(report.numbers)} numbers — avg draws {report.strength:.2f}")
        print("  ", report.numbers)


if __name__ == "__main__":
    import csv
    parser = argparse.ArgumentParser(description="Heatmap for main number coldness")
    parser.add_argument("--history", type=Path, default=Path("../data/euro_draws_sample.csv"))
    args = parser.parse_args()

    draws = load_draws(args.history)
    freq = number_frequencies(draws)
    reports = categorize_numbers(range(1, 51), freq)
    describe_heatmap(reports)
