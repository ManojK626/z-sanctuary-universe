"""Verify prediction caches for compressing trust metrics."""
from __future__ import annotations

import argparse
import csv
import json
from collections import Counter
from dataclasses import dataclass, asdict
from pathlib import Path
from statistics import mean
from typing import Iterable, List, Dict

ROOT_DIR = Path(__file__).resolve().parents[2]
CACHE_DIR = Path(__file__).resolve().parents[1] / "prediction" / "cache"
DATA_DIR = ROOT_DIR / "data"


@dataclass
class LineMetrics:
    main: List[int]
    lucky: List[int]
    trust: float
    main_avg: float
    lucky_avg: float


@dataclass
class CacheSummary:
    format: str
    history: str
    draws: int
    trust_score: float
    lines: int
    details: List[LineMetrics]


def load_draws(path: Path) -> List[Dict[str, List[int]]]:
    draws: List[Dict[str, List[int]]] = []
    with path.open() as fh:
        reader = csv.DictReader(fh)
        for row in reader:
            main = [int(row[f"main_{i}"]) for i in range(1, 6)]
            lucky: List[int] = []
            for idx in range(1, 3):
                value = row.get(f"bonus_{idx}")
                if value and value.strip():
                    lucky.append(int(value))
                    continue
                alt = row.get(f"lucky_{idx}")
                if alt and alt.strip():
                    lucky.append(int(alt))
            draws.append({"main": main, "lucky": lucky})
    return draws


def load_caches(directory: Path) -> Iterable[Path]:
    yield from sorted(directory.glob("*_predictions.json"))


def safe_normalized_avg(freqs: Counter, numbers: Iterable[int]) -> float:
    if not numbers:
        return 1.0
    max_freq = max(freqs.values(), default=0) or 1
    avg = sum(freqs.get(n, 0) for n in numbers) / len(numbers)
    return max(0.0, 1 - (avg / max_freq))


def frequency(draws: Iterable[Dict[str, List[int]]], key: str) -> Counter:
    counter: Counter[int] = Counter()
    for draw in draws:
        counter.update(draw[key])
    return counter


def evaluate_cache(cache_path: Path) -> CacheSummary | None:
    payload = json.loads(cache_path.read_text())
    history_file = payload.get("history", "")
    history_path = Path(history_file)
    if not history_path.is_absolute():
        candidate = ROOT_DIR / history_path
        if candidate.exists():
            history_path = candidate
        else:
            candidate = DATA_DIR / history_path.name
            if candidate.exists():
                history_path = candidate
    if not history_path.exists():
        print(f"Skipping {history_path.name} — history missing for verification.")
        return None
    draws = load_draws(history_path)
    main_freq = frequency(draws, "main")
    lucky_freq = frequency(draws, "lucky")

    lines = payload.get("lines", [])
    metrics: List[LineMetrics] = []
    trusts: List[float] = []
    for line in lines:
        main_line = line.get("main", [])
        lucky_line = line.get("lucky", [])
        main_trust = safe_normalized_avg(main_freq, main_line)
        lucky_trust = safe_normalized_avg(lucky_freq, lucky_line)
        trust = mean([main_trust, lucky_trust])
        metrics.append(LineMetrics(main_line, lucky_line, trust, mean([main_freq.get(n, 0) for n in main_line]) if main_line else 0.0, mean([lucky_freq.get(n, 0) for n in lucky_line]) if lucky_line else 0.0))
        trusts.append(trust)

    avg_trust = float(mean(trusts)) if trusts else 0.0
    return CacheSummary(
        format=payload.get("format", cache_path.stem.replace("_predictions", "")),
        history=str(history_path.name),
        draws=len(draws),
        trust_score=avg_trust,
        lines=len(metrics),
        details=metrics,
    )


def describe_summary(summary: CacheSummary) -> None:
    print(f"Format {summary.format} ({summary.history}) — draws {summary.draws}, trust {summary.trust_score:.2%}")
    for idx, line in enumerate(summary.details, 1):
        print(f"  Line {idx}: trust {line.trust:.2%} | main avg freq {line.main_avg:.2f}, lucky avg {line.lucky_avg:.2f}")
        print(f"    mains {line.main}")
        print(f"    luckies {line.lucky}")


def write_report(summaries: List[CacheSummary], path: Path) -> None:
    payload = [asdict(summary) for summary in summaries]
    path.write_text(json.dumps(payload, indent=2))
    print(f"Wrote verification report to {path}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Verify cached predictions with historical data")
    parser.add_argument("--cache-dir", type=Path, default=CACHE_DIR)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()

    cache_paths = list(load_caches(args.cache_dir))
    if not cache_paths:
        print("No cache files found. Run the prediction engine first.")
        return

    summaries = [summary for summary in (evaluate_cache(path) for path in cache_paths) if summary]
    for summary in summaries:
        describe_summary(summary)

    if args.output:
        write_report(summaries, args.output)


if __name__ == "__main__":
    main()
