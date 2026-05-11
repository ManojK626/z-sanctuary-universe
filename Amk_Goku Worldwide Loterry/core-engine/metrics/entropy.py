"""Entropy helpers for lottery metrics."""
from __future__ import annotations

import math
from collections import Counter
from typing import Iterable, List, Tuple


def shannon_entropy(probabilities: Iterable[float]) -> float:
    return -sum(p * math.log2(p) for p in probabilities if p > 0 and p <= 1)


def frequency_entropy(numbers: Iterable[int], min_n: int, max_n: int) -> float:
    total = len(list(numbers))
    if total == 0:
        return 0.0

    counts = Counter(numbers)
    probs = [(counts.get(n, 0) / total) for n in range(min_n, max_n + 1)]
    return round(shannon_entropy(probs), 6)


def gap_entropy(draws: Iterable[List[int]]) -> float:
    gaps: List[int] = []
    last_seen: dict[int, int] = {}
    for idx, draw in enumerate(draws):
        for n in draw:
            if n in last_seen:
                gaps.append(idx - last_seen[n])
            last_seen[n] = idx
    if not gaps:
        return 0.0
    counts = Counter(gaps)
    total = sum(counts.values())
    probs = [count / total for count in counts.values()]
    return round(shannon_entropy(probs), 6)


def pair_entropy(draws: Iterable[List[int]]) -> float:
    pairs: List[Tuple[int, int]] = []
    for draw in draws:
        sorted_draw = sorted(draw)
        for i in range(len(sorted_draw)):
            for j in range(i + 1, len(sorted_draw)):
                pairs.append((sorted_draw[i], sorted_draw[j]))
    if not pairs:
        return 0.0
    counts = Counter(pairs)
    total = sum(counts.values())
    probs = [count / total for count in counts.values()]
    return round(shannon_entropy(probs), 6)
