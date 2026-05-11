"""Preview and validate incoming lottery CSVs against the canonical schema."""

from __future__ import annotations

import argparse
import csv
from pathlib import Path
from typing import Iterable

try:
    from .schema import (
        CANONICAL_COLUMNS,
        ensure_schema,
        find_winning_numbers_header,
        normalize_row,
    )
except ImportError:  # pragma: no cover
    import importlib.util

    schema_path = Path(__file__).resolve().parent / "schema.py"
    spec = importlib.util.spec_from_file_location("ingest_schema", schema_path)
    schema = importlib.util.module_from_spec(spec)
    if spec.loader:
        spec.loader.exec_module(schema)
    else:
        raise SystemExit("Unable to load schema helper for CSV validation.")

    CANONICAL_COLUMNS = schema.CANONICAL_COLUMNS
    ensure_schema = schema.ensure_schema
    find_winning_numbers_header = schema.find_winning_numbers_header
    normalize_row = schema.normalize_row


def format_list(items: Iterable[str]) -> str:
    return ", ".join(str(item) for item in items)


def analyze_csv(path: Path, sample_rows: int) -> None:
    print(f"\n=== {path.name} ===")
    with path.open(newline="") as fh:
        reader = csv.DictReader(fh)
        headers = reader.fieldnames or []
        if headers and headers[0].strip().startswith("<!doctype"):
            print(" -> This file contains HTML (probably the download page).")
            return
        print("Headers:", format_list(headers))
        header_map, missing = ensure_schema(headers)
        winning_header = find_winning_numbers_header(headers)
        if missing:
            print("Missing canonical columns:", format_list(missing))
        else:
            print("All canonical columns accounted for.")
        if header_map:
            mapped = {col: header_map[col] for col in sorted(header_map)}
            print("Column alias map:", mapped)
        else:
            print("No canonical aliases detected.")
        print("Winning numbers column:", winning_header or "not found")
        print("Canonical order preview:", format_list(CANONICAL_COLUMNS))
        rows = []
        for _ in range(sample_rows):
            try:
                row = next(reader)
            except StopIteration:
                break
            rows.append(normalize_row(row, header_map, winning_header))
        if rows:
            print("\nSample normalized rows:")
            for row in rows:
                print(
                    format_list(
                        f"{col}={row.get(col,'') or '—'}" for col in CANONICAL_COLUMNS
                    )
                )
        else:
            print("No data rows to preview.")


def main() -> None:
    parser = argparse.ArgumentParser(description="Inspect incoming CSV schema before ingestion")
    parser.add_argument(
        "--incoming-dir",
        type=Path,
        default=Path("data") / "incoming",
        help="Directory containing CSV files (default: data/incoming)",
    )
    parser.add_argument(
        "--sample",
        type=int,
        default=3,
        help="Number of normalized rows to show (default: 3)",
    )
    args = parser.parse_args()
    incoming = args.incoming_dir
    csv_files = sorted(incoming.glob("*.csv"))
    if not csv_files:
        print("No CSV files found in", incoming)
        return
    for csv in csv_files:
        analyze_csv(csv, args.sample)


if __name__ == "__main__":
    main()
