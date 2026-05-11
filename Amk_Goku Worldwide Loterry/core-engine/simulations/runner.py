"""Run simulations and compute delta reports versus real draws."""
from __future__ import annotations

import argparse
import json
from pathlib import Path

import sys

BASE_DIR = Path(__file__).resolve().parents[1]
METRICS_DIR = BASE_DIR / "metrics"
sys.path.insert(0, str(METRICS_DIR))
from entropy import frequency_entropy, gap_entropy, pair_entropy  # noqa: E402

from baseline import simulate_draws


def load_json(path: Path) -> dict:
    return json.loads(path.read_text())


def compute_entropy(draws: list[list[int]], number_space: dict) -> dict[str, float]:
    flat = [n for draw in draws for n in draw]
    return {
        "frequency_entropy": frequency_entropy(flat, number_space["main"]["min"], number_space["main"]["max"]),
        "gap_entropy": gap_entropy(draws),
        "pair_entropy": pair_entropy(draws),
    }


def delta_report(real: dict[str, float], simulated: dict[str, float]) -> dict[str, float]:
    return {k: round(real.get(k, 0.0) - simulated.get(k, 0.0), 6) for k in real}


def run_simulation(
    config: Path,
    metrics: Path,
    output: Path,
    run_id: str,
    seed: int | None = None,
) -> None:
    format_cfg = load_json(config)
    metrics_payload = load_json(metrics)
    draws_count = metrics_payload.get("draws_count", 1)
    number_space = format_cfg.get("main", {})
    sim_draws = simulate_draws(draws_count, {"main": number_space}, seed)
    simulated_entropy = compute_entropy(sim_draws, {"main": number_space})

    delta = delta_report(metrics_payload["entropy"], simulated_entropy)
    payload = {
        "run_id": run_id,
        "lottery_code": format_cfg["code"],
        "real_entropy": metrics_payload["entropy"],
        "simulated_entropy": simulated_entropy,
        "delta": delta,
        "method": "baseline_uniform",
    }
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(payload, indent=2))
    print("Delta report saved to", output)


def setup_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Simulate draws and compare with real metrics.")
    parser.add_argument("--config", type=Path, required=True)
    parser.add_argument("--metrics", type=Path, required=True)
    parser.add_argument("--run-id", required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--seed", type=int)
    return parser


def main() -> None:
    parser = setup_parser()
    args = parser.parse_args()
    run_simulation(args.config, args.metrics, args.output, args.run_id, args.seed)


if __name__ == "__main__":
    main()
