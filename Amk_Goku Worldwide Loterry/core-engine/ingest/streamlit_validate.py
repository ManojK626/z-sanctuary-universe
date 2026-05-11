"""Streamlit UI for previewing incoming lottery CSVs."""

from __future__ import annotations

from pathlib import Path
from typing import List, Tuple

import pandas as pd
import streamlit as st
import sys

CORE_ENGINE_DIR = Path(__file__).resolve().parents[1]
if str(CORE_ENGINE_DIR) not in sys.path:
    sys.path.insert(0, str(CORE_ENGINE_DIR))

from root_cause.recorder import read_root_causes
from .schema import CANONICAL_COLUMNS, ensure_schema, find_winning_numbers_header, normalize_row


def preview_csv(path: Path, sample: int) -> Tuple[List[dict], List[str], str]:
    with path.open(newline="") as fh:
        reader = pd.read_csv(fh)
        headers = list(reader.columns)
    header_map, missing = ensure_schema(headers)
    winning_header = find_winning_numbers_header(headers)
    rows = []
    for row in pd.read_csv(path).head(sample).to_dict(orient="records"):
        rows.append(normalize_row(row, header_map, winning_header))
    return rows, missing, winning_header or ""


def normalize_for_display(rows: List[dict]) -> pd.DataFrame:
    return pd.DataFrame(rows or [{}], columns=CANONICAL_COLUMNS).fillna("—")


def main() -> None:
    st.sidebar.title("Validation Config")
    incoming_dir = Path("data") / "incoming"
    files = sorted(incoming_dir.glob("*.csv"))
    st.title("Lottery CSV Validation Preview")
    st.markdown(
        "Select an incoming CSV to view header coverage, alias mappings, and normalized rows before ingestion."
    )
    if not files:
        st.warning("No CSV files found in data/incoming/. Drop files there to preview.")
        return
    selected = st.sidebar.selectbox("Choose CSV", files, format_func=lambda p: p.name)
    sample = st.sidebar.slider("Sample rows", 1, 10, 3)
    rows, missing, winning_header = preview_csv(selected, sample)
    st.subheader("Headers")
    st.write(", ".join(pd.read_csv(selected, nrows=0).columns))
    st.subheader("Canonical Coverage")
    st.write("Missing canonical columns:", ", ".join(missing) or "None")
    st.write("Inferred winning numbers column:", winning_header or "Not detected")
    st.subheader("Normalized Samples")
    st.dataframe(normalize_for_display(rows))
    causes = read_root_causes()
    if causes:
        st.subheader("Micro-cause log")
        for entry in causes[-5:]:
            st.write(f"{entry['timestamp']} – {entry['issue']} – {entry['details']}")


if __name__ == "__main__":
    main()
