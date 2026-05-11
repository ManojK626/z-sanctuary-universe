from __future__ import annotations

import json
import random
from datetime import datetime, timezone
from pathlib import Path

from zals_metrics import collect_metrics

ROOT = Path(__file__).resolve().parents[2]
ZALS_DIR = ROOT / "core" / "zals"
REPORTS = ROOT / "data" / "reports"
REPORTS.mkdir(parents=True, exist_ok=True)


def load_json(path: Path) -> dict:
    if not path.exists():
        return {}
    return json.loads(path.read_text(encoding="utf-8"))


def write_status(payload: dict) -> None:
    target = REPORTS / "zals_status.json"
    target.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")


def compute_pressure(metrics: dict) -> float:
    cpu_weight = 0.6
    ram_weight = 0.4
    pressure = (metrics.get("cpu_percent", 0) * cpu_weight + metrics.get("ram_percent", 0) * ram_weight) / 100
    return round(pressure, 4)


def route_job(job: dict, nodes: list[dict], metrics: dict, strategy: str = "FFS") -> dict | None:
    enabled_nodes = [n for n in nodes if n.get("enabled", True)]
    if not enabled_nodes:
        return None
    if strategy == "RANDOM":
        return random.choice(enabled_nodes)

    pressure = compute_pressure(metrics)

    def score(node: dict) -> float:
        return float(node.get("capacity_score", 1.0)) - pressure

    return max(enabled_nodes, key=score)


def main() -> None:
    now = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    nodes_data = load_json(ZALS_DIR / "zals_nodes.json")
    queue_data = load_json(ZALS_DIR / "zals_queue.json")

    nodes = nodes_data.get("nodes", [])
    queue = queue_data.get("queue", [])
    metrics = collect_metrics()
    pressure = compute_pressure(metrics)

    assignments = []
    for job in queue:
        assigned_node = route_job(job, nodes, metrics, strategy="FFS")
        assignments.append(
            {
                "job_id": job.get("id"),
                "assigned_node": assigned_node.get("id") if assigned_node else None,
                "strategy": "FFS",
                "system_pressure": pressure,
            }
        )

    status = {
        "generated_at": now,
        "mode": "DRY_RUN",
        "queue_length": len(queue),
        "node_count": len(nodes),
        "pressure": pressure,
        "metrics": metrics,
        "simulated_assignments": assignments,
    }
    write_status(status)
    print("ZALS dry-run routing complete.")


if __name__ == "__main__":
    main()
