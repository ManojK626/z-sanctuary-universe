import json
from pathlib import Path

from kairocell.runner import build_kairocell_summary


def sample_metrics():
    return [
        {
            "lottery_code": "alpha",
            "history_hash": "sha256:abc",
            "entropy": {
                "frequency_entropy": 5.2,
                "gap_entropy": 2.1,
                "pair_entropy": 7.5,
            },
            "notes": ["test"],
        },
        {
            "lottery_code": "beta",
            "history_hash": "sha256:def",
            "entropy": {
                "frequency_entropy": 6.1,
                "gap_entropy": 4.5,
                "pair_entropy": 11.3,
            },
            "notes": [],
        },
    ]


def test_build_summary(tmp_path):
    summary_dir = tmp_path / "kairo"
    run_id = "RUNTEST"
    summary_path = build_kairocell_summary(
        run_id, metrics_override=sample_metrics(), summary_dir=summary_dir
    )
    assert summary_path.exists()
    payload = json.loads(summary_path.read_text())
    assert payload["run_id"] == run_id
    assert payload["lotteries"][0]["code"] == "alpha"
    assert "ring" in payload
    backup_path = summary_dir / f"summary_{run_id}.json"
    assert backup_path.exists()
