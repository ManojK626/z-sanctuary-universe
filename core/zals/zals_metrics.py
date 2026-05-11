from __future__ import annotations

from datetime import datetime, timezone

import psutil


def collect_metrics() -> dict:
    now = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    cpu = psutil.cpu_percent(interval=0.5)
    memory = psutil.virtual_memory()
    return {
        "timestamp": now,
        "cpu_percent": cpu,
        "ram_percent": memory.percent,
        "ram_available_mb": round(memory.available / 1024 / 1024, 2),
    }


if __name__ == "__main__":
    import json

    print(json.dumps(collect_metrics(), indent=2))
