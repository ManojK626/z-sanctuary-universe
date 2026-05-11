"""Prediction utilities for the AMK-Goku Z cores with format awareness and LPBS tuning."""
from __future__ import annotations

import argparse
import csv
import json
from dataclasses import dataclass
from datetime import datetime, timezone
from itertools import combinations
from pathlib import Path
from typing import Iterable, List, Dict, Tuple

ROOT_DIR = Path(__file__).resolve().parents[2]
CONFIG_DIR = Path(__file__).resolve().parents[1] / "config" / "global-formats"
HISTORY_CSV = ROOT_DIR / "data" / "euro_draws_sample.csv"
CACHE_DIR = Path(__file__).resolve().parents[0] / "cache"


@dataclass(frozen=True)
class PredictionFormat:
    name: str
    code: str
    format: str
    main_min: int
    main_max: int
    main_count: int
    lucky_min: int
    lucky_max: int
    lucky_count: int
    draw_schedule: List[str]

    @property
    def main_pool(self) -> range:
        return range(self.main_min, self.main_max + 1)

    @property
    def lucky_pool(self) -> range:
        return range(self.lucky_min, self.lucky_max + 1)


@dataclass
class LPBSConfig:
    lookback: int = 12
    lines: int = 3
    mix_hot: bool = True
    hot_bias: float = 0.12
    cold_bias: float = 1.0
    main_depth: int = 12
    lucky_depth: int = 8
    cache_dir: Path = CACHE_DIR

    def to_dict(self) -> Dict[str, object]:
        return {
            "lookback": self.lookback,
            "lines": self.lines,
            "mix_hot": self.mix_hot,
            "hot_bias": self.hot_bias,
            "cold_bias": self.cold_bias,
            "main_depth": self.main_depth,
            "lucky_depth": self.lucky_depth,
        }


def _parse_lucky(row: Dict[str, str]) -> Tuple[int, ...]:
    lucky_numbers: List[int] = []
    for idx in range(1, 3):
        value = row.get(f"bonus_{idx}")
        if value and value.strip():
            lucky_numbers.append(int(value))
            continue
        alt = row.get(f"lucky_{idx}")
        if alt and alt.strip():
            lucky_numbers.append(int(alt))
    return tuple(lucky_numbers)


def load_history(path: Path, limit: int | None = None) -> List[Dict[str, object]]:
    draws: List[Dict[str, object]] = []
    with path.open() as fh:
        reader = csv.DictReader(fh)
        for idx, row in enumerate(reader):
            if limit and idx >= limit:
                break
            main = tuple(int(row[f"main_{i}"]) for i in range(1, 6))
            lucky = _parse_lucky(row)
            draws.append({
                "date": row["draw_date"],
                "main": main,
                "lucky": lucky,
            })
    return draws


def load_formats(config_dir: Path) -> Dict[str, PredictionFormat]:
    formats: Dict[str, PredictionFormat] = {}
    for json_file in sorted(config_dir.glob("*.json")):
        payload = json.loads(json_file.read_text())
        fmt = PredictionFormat(
            name=payload["name"],
            code=payload["code"],
            format=payload.get("format", "5+2"),
            main_min=payload["main"]["min"],
            main_max=payload["main"]["max"],
            main_count=payload["main"]["count"],
            lucky_min=payload["lucky"]["min"],
            lucky_max=payload["lucky"]["max"],
            lucky_count=payload["lucky"]["count"],
            draw_schedule=payload.get("draw_schedule", []),
        )
        formats[fmt.code] = fmt
    return formats


def frequency(draws: Iterable[Dict[str, object]], slot: str) -> Dict[int, int]:
    counts: Dict[int, int] = {}
    for draw in draws:
        numbers = draw[slot]
        for number in numbers:
            counts.setdefault(number, 0)
            counts[number] += 1
    return counts


def score_numbers(counter: Dict[int, int], pool: Iterable[int], settings: LPBSConfig) -> List[int]:
    pool_list = list(pool)
    max_freq = max(counter.values()) if counter else 0
    scored: List[Tuple[float, int]] = []
    total = len(pool_list) or 1
    for idx, number in enumerate(pool_list):
        freq = counter.get(number, 0)
        cold_score = (max_freq - freq) * settings.cold_bias
        depth_bonus = (total - idx) / total
        hot_bonus = freq * settings.hot_bias if settings.mix_hot else 0
        score = cold_score + depth_bonus + hot_bonus
        scored.append((score, number))
    scored.sort(reverse=True)
    return [n for _, n in scored]


def generate_lines(main_candidates: List[int], lucky_candidates: List[int], fmt: PredictionFormat, settings: LPBSConfig) -> List[Tuple[Tuple[int, ...], Tuple[int, ...]]]:
    main_depth = min(settings.main_depth, len(main_candidates))
    lucky_depth = min(settings.lucky_depth, len(lucky_candidates))
    output: List[Tuple[Tuple[int, ...], Tuple[int, ...]]] = []
    for main_combo in combinations(main_candidates[:main_depth], fmt.main_count):
        for lucky_combo in combinations(lucky_candidates[:lucky_depth], fmt.lucky_count):
            output.append((main_combo, lucky_combo))
            if len(output) >= settings.lines:
                return output
    return output


def cache_predictions(fmt: PredictionFormat, lines: List[Tuple[Tuple[int, ...], Tuple[int, ...]]], settings: LPBSConfig, history_path: Path) -> Path:
    settings.cache_dir.mkdir(parents=True, exist_ok=True)
    cache_file = settings.cache_dir / f"{fmt.code}_predictions.json"
    relative_history = str(history_path.relative_to(ROOT_DIR))
    payload = {
        "format": fmt.code,
        "generated": datetime.now(timezone.utc).isoformat(),
        "history": relative_history,
        "lookback": settings.lookback,
        "settings": settings.to_dict(),
        "lines": [
            {"main": list(main), "lucky": list(lucky)}
            for main, lucky in lines
        ],
    }
    cache_file.write_text(json.dumps(payload, indent=2))
    return cache_file


def describe_prediction(fmt: PredictionFormat, draws: List[Dict[str, object]], lines: List[Tuple[Tuple[int, ...], Tuple[int, ...]]], settings: LPBSConfig) -> None:
    print(f"Format: {fmt.name} ({fmt.format})")
    print(f"Lookback: {settings.lookback} / total draws: {len(draws)}")
    print("LPBS settings:", settings.to_dict())
    for idx, (main, lucky) in enumerate(lines, 1):
        print(f" Line {idx}: main {main} / lucky {lucky}")


def run_prediction(args: argparse.Namespace) -> None:
    config_dir = Path(args.config_dir)
    formats = load_formats(config_dir)
    fmt = formats.get(args.format)
    if not fmt:
        raise SystemExit(f"Unknown format '{args.format}'. Available: {', '.join(formats.keys())}")

    draws = load_history(Path(args.history))
    draws = draws[-args.lookback :] if args.lookback else draws

    settings = LPBSConfig(
        lookback=args.lookback,
        lines=args.lines,
        mix_hot=not args.no_hot,
        hot_bias=args.hot_bias,
        cold_bias=args.cold_bias,
        main_depth=args.main_depth,
        lucky_depth=args.lucky_depth,
        cache_dir=Path(args.cache_dir),
    )

    main_freq = frequency(draws, "main")
    lucky_freq = frequency(draws, "lucky")

    main_candidates = score_numbers(main_freq, fmt.main_pool, settings)
    lucky_candidates = score_numbers(lucky_freq, fmt.lucky_pool, settings)

    lines = generate_lines(main_candidates, lucky_candidates, fmt, settings)
    if not lines:
        print("Unable to generate prediction lines. Not enough candidates.")
        return

    cache_path = cache_predictions(fmt, lines, settings, Path(args.history))
    print("Cached predictions to", cache_path)
    describe_prediction(fmt, draws, lines, settings)


def setup_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="AMK-Goku prediction engine with multi-format scoring")
    parser.add_argument("--history", type=Path, default=HISTORY_CSV)
    parser.add_argument("--config-dir", type=Path, default=CONFIG_DIR)
    parser.add_argument("--format", default="euromillions")
    parser.add_argument("--lookback", type=int, default=12)
    parser.add_argument("--lines", type=int, default=3)
    parser.add_argument("--no-hot", action="store_true", help="Ignore hot-number bias")
    parser.add_argument("--hot-bias", type=float, default=0.12)
    parser.add_argument("--cold-bias", type=float, default=1.0)
    parser.add_argument("--main-depth", type=int, default=12)
    parser.add_argument("--lucky-depth", type=int, default=8)
    parser.add_argument("--cache-dir", type=Path, default=CACHE_DIR)
    return parser


if __name__ == "__main__":
    parser = setup_parser()
    args = parser.parse_args()
    run_prediction(args)
