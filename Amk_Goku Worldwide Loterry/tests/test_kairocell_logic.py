from kairocell.logic import (
    classify_phase,
    confidence_score,
    micro_cell_label,
    ring_orientation,
)


def test_classify_phase_ranges():
    assert classify_phase(5.2) == "Observe"
    assert classify_phase(5.7) == "Align"
    assert classify_phase(6.1) == "Impact"


def test_micro_cell_labels():
    assert micro_cell_label(1.5) == "Focus Cell"
    assert micro_cell_label(3.0) == "Flow Cell"
    assert micro_cell_label(4.5) == "Expanse Cell"


def test_ring_orientation_brackets():
    assert ring_orientation(7.0) == "Calm Ring"
    assert ring_orientation(9.2) == "Pulse Ring"
    assert ring_orientation(11.0) == "Storm Ring"


def test_confidence_score_bounds():
    assert 0.0 <= confidence_score(5.75) <= 1.0
    assert confidence_score(5.75) == 1.0
    assert confidence_score(4.0) <= 1.0
