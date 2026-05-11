# Aggregate per-region entropies and compute divergence.
from __future__ import annotations

import argparse
import json
import math
from collections import defaultdict
from pathlib import Path
from typing import Any, Dict, List


def js_divergence(p: List[float], q: List[float]) -> float:
    def kl(a: List[float], b: List[float]) -> float:
        return sum(ai * math.log2(ai / bi) for ai, bi in zip(a, b) if ai > 0 and bi > 0)

    m = [(pi + qi) / 2 for pi, qi in zip(p, q)]
    return round((kl(p, m) + kl(q, m)) / 2, 6)


def aggregate_by_region(metrics_dir: Path, configs_dir: Path) -> Dict[str, Any]:
    region_buckets: Dict[str, List[Dict[str, float]]] = defaultdict(list)
    formats = []
    for config_file in sorted(configs_dir.glob("*.json")):
        payload = json.loads(config_file.read_text())
        region = payload.get("region", "GLOBAL")
        code = payload["code"]
        formats.append({"code": code, "region": region})
        metrics_path = metrics_dir / f"{code}.metrics.json"
        if not metrics_path.exists():
            continue
        metrics = json.loads(metrics_path.read_text())
        region_buckets[region].append(metrics["entropy"])

    summary: Dict[str, Any] = {}
    for region, entropies in region_buckets.items():
        if not entropies:
            continue
        def avg(key: str) -> float:
            return round(sum(e[key] for e in entropies) / len(entropies), 6)

        summary[region] = {
            "lotteries": len(entropies),
            "avg_entropy": {
                "frequency_entropy": avg("frequency_entropy"),
                "gap_entropy": avg("gap_entropy"),
                "pair_entropy": avg("pair_entropy"),
            },
        }
    return {"regions": summary, "formats": formats}


def divergence_table(region_summary: Dict[str, Any]) -> Dict[str, float]:
    regions = list(region_summary["regions"].keys())
    table: Dict[str, float] = {}
    for i in range(len(regions)):
        for j in range(i + 1, len(regions)):
            r1 = regions[i]
            r2 = regions[j]
            e1 = region_summary["regions"][r1]["avg_entropy"]
            e2 = region_summary["regions"][r2]["avg_entropy"]
            p = list(e1.values())
            q = list(e2.values())
            if len(p) != len(q):
                continue
            table[f"{r1} vs {r2}"] = js_divergence(p, q)
    return table


def main() -> None:
    parser = argparse.ArgumentParser(description="Aggregate regional entropy metrics")
    parser.add_argument("--formats-dir", type=Path, required=True)
    parser.add_argument("--metrics-dir", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("--run-id", required=True)
    args = parser.parse_args()

    summary = aggregate_by_region(args.metrics_dir, args.formats_dir)
    divergence = divergence_table(summary)
    payload = {
        "run_id": args.run_id,
        "regions": summary["regions"],
        "divergence": divergence,
    }
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(payload, indent=2))
    print("Region summary saved to", args.out)


if __name__ == "__main__":
    main()
