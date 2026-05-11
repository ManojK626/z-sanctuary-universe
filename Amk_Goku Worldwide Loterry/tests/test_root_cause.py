from pathlib import Path

from root_cause.recorder import log_root_cause, read_root_causes


def test_log_and_read_root_causes(tmp_path: Path) -> None:
    base = tmp_path
    log_root_cause("test_issue", {"detail": "value"}, base_dir=base)
    entries = read_root_causes(base_dir=base)
    assert entries
    assert entries[-1]["issue"] == "test_issue"
