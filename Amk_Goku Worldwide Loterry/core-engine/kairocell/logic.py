"""Classification helpers for the KAIROCELL advisory layer."""

from __future__ import annotations

from typing import Any, Dict, Tuple


def classify_phase(freq_entropy: float) -> str:
    """Map frequency entropy into a KAIROCELL phase."""
    if freq_entropy <= 5.55:
        return "Observe"
    if freq_entropy <= 5.9:
        return "Align"
    return "Impact"


def micro_cell_label(gap_entropy: float) -> str:
    """Give each lottery a micro-cell personality based on gap rhythm."""
    if gap_entropy < 2.5:
        return "Focus Cell"
    if gap_entropy < 4.0:
        return "Flow Cell"
    return "Expanse Cell"


def ring_orientation(pair_entropy: float) -> str:
    """Provide a descriptive ring orientation (outer ring vs. pulse)."""
    if pair_entropy < 8.5:
        return "Calm Ring"
    if pair_entropy < 10.5:
        return "Pulse Ring"
    return "Storm Ring"


def confidence_score(freq_entropy: float) -> float:
    """Return a 0-1 confidence score centered around a balanced entropy."""
    diff = abs(freq_entropy - 5.75)
    score = max(0.0, 1 - diff / 1.5)
    return round(score, 2)


def describe_lottery(metrics: Dict[str, Any]) -> Dict[str, Any]:
    """Decorate metrics with KAIROCELL context."""
    entropy = metrics.get("entropy", {})
    freq = entropy.get("frequency_entropy", 0.0)
    gap = entropy.get("gap_entropy", 0.0)
    pair = entropy.get("pair_entropy", 0.0)
    phase = classify_phase(freq)
    micro_cell = micro_cell_label(gap)
    orientation = ring_orientation(pair)
    return {
        "code": metrics.get("lottery_code", "unknown"),
        "phase": phase,
        "micro_cell": micro_cell,
        "orientation": orientation,
        "confidence": confidence_score(freq),
        "entropy": {
            "frequency": freq,
            "gap": gap,
            "pair": pair,
        },
        "history_hash": metrics.get("history_hash"),
        "notes": metrics.get("notes", []),
    }


def aggregate_ring(entries: Tuple[Dict[str, Any], ...]) -> Dict[str, Any]:
    """Summarize entropy across the ring for higher-level readouts."""
    if not entries:
        return {}
    total_freq = sum(entry["entropy"]["frequency"] for entry in entries)
    total_gap = sum(entry["entropy"]["gap"] for entry in entries)
    total_pair = sum(entry["entropy"]["pair"] for entry in entries)
    avg_freq = round(total_freq / len(entries), 3)
    avg_gap = round(total_gap / len(entries), 3)
    avg_pair = round(total_pair / len(entries), 3)
    return {
        "lotteries": len(entries),
        "avg_frequency": avg_freq,
        "avg_gap": avg_gap,
        "avg_pair": avg_pair,
    }
