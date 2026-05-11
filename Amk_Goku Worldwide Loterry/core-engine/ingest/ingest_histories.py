"""Move new lottery CSVs into histories with canonical schema enforcement."""
from __future__ import annotations

import argparse
import csv
import hashlib
import json
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Tuple

CORE_ENGINE_DIR = Path(__file__).resolve().parents[1]
if str(CORE_ENGINE_DIR) not in sys.path:
    sys.path.insert(0, str(CORE_ENGINE_DIR))

from root_cause.recorder import log_root_cause

try:
    from .schema import (
        CANONICAL_COLUMNS,
        ensure_schema,
        find_winning_numbers_header,
        normalize_row,
        parse_date,
    )
except ImportError:  # pragma: no cover
    import importlib.util

    schema_path = Path(__file__).resolve().parent / "schema.py"
    spec = importlib.util.spec_from_file_location("ingest_schema", schema_path)
    schema = importlib.util.module_from_spec(spec)
    if spec.loader:
        spec.loader.exec_module(schema)
    else:
        raise SystemExit("Unable to load schema helpers for ingestion.")

    CANONICAL_COLUMNS = schema.CANONICAL_COLUMNS
    ensure_schema = schema.ensure_schema
    find_winning_numbers_header = schema.find_winning_numbers_header
    normalize_row = schema.normalize_row
    parse_date = schema.parse_date

REPO_ROOT = Path(__file__).resolve().parents[2]
CONFIG_DIR = REPO_ROOT / "core-engine" / "config" / "global-formats"
HISTORIES_DIR = REPO_ROOT / "data" / "histories"
INCOMING_DIR = REPO_ROOT / "data" / "incoming"
def compute_hash(path: Path) -> str:
    return "sha256:" + hashlib.sha256(path.read_bytes()).hexdigest()


def drop_future_rows(rows: List[Dict[str, str]], source: str) -> List[Dict[str, str]]:
    kept: List[Dict[str, str]] = []
    now = datetime.now()
    for row in rows:
        draw_date = parse_date(row["draw_date"])
        if draw_date > now:
            log_root_cause("future_draw", {"draw_date": row["draw_date"], "source": source})
            print(f"Skipping future draw {row['draw_date']}")
            continue
        kept.append(row)
    return kept


def validate_rows(rows: List[Dict[str, str]], source: str) -> None:
    seen: set[str] = set()
    last_date = None
    for row in rows:
        draw_date = parse_date(row["draw_date"])
        if last_date and draw_date < last_date:
            log_root_cause("out_of_order", {"source": source, "draw_date": row["draw_date"]})
            raise SystemExit("Rows must be sorted by draw_date.")
        last_date = draw_date
        key = draw_date.isoformat()
        if key in seen:
            log_root_cause("duplicate_draw", {"source": source, "draw_date": row["draw_date"]})
            raise SystemExit(f"Duplicate draw_date: {row['draw_date']}")
        seen.add(key)


def ensure_rows_complete(rows: List[Dict[str, str]], source: str) -> None:
    for idx, row in enumerate(rows, 1):
        if not row["draw_date"]:
            log_root_cause("missing_draw_date", {"source": source, "row": idx})
            raise SystemExit(f"Row {idx} missing draw_date.")
        missing_main = [col for col in (f"main_{i}" for i in range(1, 6)) if not row[col]]
        if missing_main:
            log_root_cause("missing_main", {"source": source, "row": idx, "missing": missing_main})
            raise SystemExit(f"Row {idx} lacks main numbers: {missing_main}")
        if not row["bonus_1"]:
            log_root_cause("missing_bonus", {"source": source, "row": idx})
            raise SystemExit(f"Row {idx} missing bonus_1.")


def write_canonical_csv(rows: List[Dict[str, str]], dest: Path) -> None:
    with dest.open("w", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=CANONICAL_COLUMNS)
        writer.writeheader()
        for row in rows:
            writer.writerow({col: row.get(col, "") for col in CANONICAL_COLUMNS})


def update_format_json(
    config_path: Path,
    history_dest: Path,
    schema_hash: str,
    history_hash: str,
) -> None:
    payload = json.loads(config_path.read_text())
    payload["history_file"] = str(history_dest.relative_to(REPO_ROOT))
    payload["history_hash"] = history_hash
    payload["schema_hash"] = schema_hash
    config_path.write_text(json.dumps(payload, indent=2))


def ingest_file(
    path: Path,
    configs: Dict[str, Path],
    histories_dir: Path,
    overwrite: bool,
    confirm_hash: str | None,
) -> None:
    rows: List[Dict[str, str]] = []
    with path.open(newline="") as fh:
        reader = csv.DictReader(fh)
        header_map, missing = ensure_schema(reader.fieldnames or [])
        winning_header = find_winning_numbers_header(reader.fieldnames or [])
        if missing and not winning_header:
            log_root_cause("missing_columns", {"source": path.name, "columns": missing})
            raise SystemExit(f"CSV {path.name} missing canonical columns: {missing}")
        rows = [normalize_row(row, header_map, winning_header) for row in reader]

    rows = drop_future_rows(rows, path.name)

    rows.sort(key=lambda row: parse_date(row["draw_date"]))
    ensure_rows_complete(rows, path.name)
    validate_rows(rows, path.name)

    code = path.stem
    dest = histories_dir / f"{code}.csv"
    if dest.exists():
        if not overwrite:
            raise SystemExit(f"{dest} already exists; use --overwrite to replace.")
        if not confirm_hash:
            raise SystemExit("Provide --confirm-hash <existing_hash> to overwrite.")
        existing_hash = compute_hash(dest)
        if existing_hash != confirm_hash:
            raise SystemExit("confirm_hash does not match existing history hash.")
        dest.unlink()

    write_canonical_csv(rows, dest)
    schema_str = "|".join(CANONICAL_COLUMNS)
    schema_hash = "sha1:" + hashlib.sha1(schema_str.encode()).hexdigest()
    history_hash = compute_hash(dest)

    config_path = configs.get(code)
    if not config_path:
        log_root_cause("missing_config", {"code": code, "dest": str(dest)})
        print(f"No config for {code}; still wrote history to {dest}")
        return

    update_format_json(config_path, dest, schema_hash, history_hash)
    print(f"Ingested {code}, history hash {history_hash}, schema {schema_hash}")
    path.unlink()


def main() -> None:
    parser = argparse.ArgumentParser(description="Ingest new lottery CSV histories")
    parser.add_argument("--incoming-dir", type=Path, default=INCOMING_DIR)
    parser.add_argument("--histories-dir", type=Path, default=HISTORIES_DIR)
    parser.add_argument("--config-dir", type=Path, default=CONFIG_DIR)
    parser.add_argument("--overwrite", action="store_true", help="Replace existing history files")
    parser.add_argument("--confirm-hash", type=str, help="Hash of existing history to allow overwrite")
    parser.add_argument("--dry-run", action="store_true", help="List files without moving them")
    args = parser.parse_args()

    incoming = args.incoming_dir
    if not incoming.exists():
        raise SystemExit(f"{incoming} does not exist.")

    configs = {path.stem: path for path in args.config_dir.glob("*.json")}
    csv_files = sorted(incoming.glob("*.csv"))
    if not csv_files:
        print("No CSVs found in", incoming)
        return

    for csv in csv_files:
        if args.dry_run:
            print("FOUND", csv.name)
            continue
        ingest_file(csv, configs, args.histories_dir, args.overwrite, args.confirm_hash)


if __name__ == "__main__":
    main()
