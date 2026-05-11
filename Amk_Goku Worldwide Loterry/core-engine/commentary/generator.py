"""Generate evidence-based commentary for each run."""
from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import List


def _as_markdown_section(title: str, lines: List[str]) -> str:
    body = "".join(f"- {line}\n" for line in lines)
    return f"## {title}\n{body}\n"


def generate_commentary(trust_bundle_path: Path, lottery_code: str) -> tuple[Path, Path]:
    bundle = json.loads(trust_bundle_path.read_text())
    run_id = bundle["run"]["run_id"]

    metrics_list = bundle["outputs"].get("lottery_metrics", [])
    delta_list = bundle["outputs"].get("delta_reports", [])

    metrics = next((entry["content"] for entry in metrics_list if entry["content"]["lottery_code"] == lottery_code), None)
    delta = next((entry["content"] for entry in delta_list if entry["content"]["lottery_code"] == lottery_code), None)

    if metrics is None or delta is None:
        raise SystemExit(f"Missing metrics/delta for {lottery_code} in trust bundle.")

    summary = (
        "This commentary describes what was measured: entropy-based summaries of real draws "
        "and a comparison with a neutral random simulation."
    )

    shows = [
        "Historical draws were analyzed with frequency, gap, and pair entropies.",
        f"The dataset contains {metrics['draws_count']} trusted draws.",
        "Entropy values are contrasted against a baseline uniform simulation to quantify structure.",
    ]

    not_shows = [
        "This does not predict specific future numbers.",
        "Entropy differences alone do not explain why any particular draw occurs.",
        "Sudden data or schema changes require regenerating this commentary.",
    ]

    sim_text = (
        "A baseline simulation using uniform draws (same number of samples) produces its own entropy readings. "
        "Delta values show how far the real data is from that neutral reference."
    )

    caution = (
        "Entropy jargon describes the shape of the distribution, not winning chances. "
        "Treat these numbers as descriptive statistics only."
    )

    falsify = [
        "Future draws matching the simulation entropy exactly would falsify any detected structure.",
        "If the history CSV or schema changes, recompute this commentary before citing it.",
    ]

    commentary = {
        "run_id": run_id,
        "lottery_code": lottery_code,
        "based_on": {
            "trust_bundle": trust_bundle_path.name,
            "metrics": f"{lottery_code}.metrics.json",
            "delta": f"{lottery_code}.delta.json",
        },
        "summary": summary,
        "what_the_data_shows": shows,
        "what_the_data_does_not_show": not_shows,
        "simulation_comparison": sim_text,
        "caution": caution,
        "falsification_conditions": falsify,
    }

    out_dir = Path("data/reports/commentary")
    out_dir.mkdir(parents=True, exist_ok=True)
    json_path = out_dir / f"{lottery_code}.{run_id}.commentary.json"
    md_path = out_dir / f"{lottery_code}.{run_id}.commentary.md"

    json_path.write_text(json.dumps(commentary, indent=2))
    md_lines = [
        f"# Commentary — {lottery_code}",
        f"**Run ID:** {run_id}",
        "",
        "## Summary",
        summary,
        "",
        _as_markdown_section("What the data shows", shows),
        _as_markdown_section("What the data does NOT show", not_shows),
        "## Simulation comparison",
        sim_text,
        "",
        "## Caution",
        caution,
        "",
        _as_markdown_section("Falsification conditions", falsify),
    ]
    md_path.write_text("\n".join(md_lines))

    return json_path, md_path


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate commentary from a trust bundle")
    parser.add_argument("bundle", type=Path, help="Path to trust bundle JSON")
    parser.add_argument("lottery", type=str, help="Lottery code to comment on")
    args = parser.parse_args()
    json_path, md_path = generate_commentary(args.bundle, args.lottery)
    print("Commentary saved to", json_path, "and", md_path)


if __name__ == "__main__":
    main()
