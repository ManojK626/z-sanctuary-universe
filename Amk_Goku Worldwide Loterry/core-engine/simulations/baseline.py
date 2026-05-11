"""Simple uniform draw simulator for lotteries."""
from __future__ import annotations

import random
from typing import List, Dict


def simulate_draws(draws_count: int, number_space: Dict[str, Dict[str, int]], seed: int | None = None) -> List[List[int]]:
    if seed is not None:
        random.seed(seed)
    main = number_space["main"]
    draws = []
    pool = list(range(main["min"], main["max"] + 1))
    for _ in range(draws_count):
        draws.append(sorted(random.sample(pool, main["count"])))
    return draws
