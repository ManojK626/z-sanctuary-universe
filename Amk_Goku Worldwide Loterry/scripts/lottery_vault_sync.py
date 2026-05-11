from __future__ import annotations

import argparse
import csv
import json
import sys
import urllib.request
from datetime import datetime
from pathlib import Path
from typing import Dict, List

REPO_ROOT = Path(__file__).resolve().parents[1]
VAULT_DIR = REPO_ROOT / "data" / "lottery_vault"
REGISTRY_PATH = VAULT_DIR / "registry.json"
INCOMING_DIR = REPO_ROOT / "data" / "incoming"

CORE_ENGINE_DIR = REPO_ROOT / "core-engine"
if str(CORE_ENGINE_DIR) not in sys.path:
    sys.path.insert(0, str(CORE_ENGINE_DIR))

from ingest.schema import (  # type: ignore
    CANONICAL_COLUMNS,
    ensure_schema,
    find_winning_numbers_header,
    normalize_row,
    parse_date,
)


def load_registry() -> Dict:
    return json.loads(REGISTRY_PATH.read_text(encoding="utf-8"))


def download_csv(url: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "ZSanctuaryVault/1.0"},
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = resp.read()
    dest.write_bytes(data)


def is_headerless(first_row: List[str]) -> bool:
    if not first_row:
        return False
    first = first_row[0].strip().lower()
    return first in {"powerball", "mega millions", "megamillions"}


def normalize_headerless(rows_raw: List[List[str]]) -> List[Dict[str, str]]:
    rows: List[Dict[str, str]] = []
    for parts in rows_raw:
        if len(parts) < 10:
            continue
        game = parts[0].strip().lower()
        if game not in {"powerball", "mega millions", "megamillions"}:
            continue
        try:
            month = int(parts[1])
            day = int(parts[2])
            year = int(parts[3])
        except ValueError:
            continue
        date_value = datetime(year, month, day).date().isoformat()
        main_numbers = parts[4:9]
        bonus_1 = parts[9] if len(parts) > 9 else ""
        bonus_2 = parts[10] if len(parts) > 10 else ""
        rows.append(
            {
                "draw_date": date_value,
                "main_1": main_numbers[0],
                "main_2": main_numbers[1],
                "main_3": main_numbers[2],
                "main_4": main_numbers[3],
                "main_5": main_numbers[4],
                "bonus_1": bonus_1,
                "bonus_2": bonus_2,
            }
        )
    return rows


def normalize_csv(raw_path: Path, normalized_path: Path) -> int:
    rows: List[Dict[str, str]] = []
    with raw_path.open(newline="", encoding="utf-8") as fh:
        sample = fh.readline()
        fh.seek(0)
        first_row = [part.strip() for part in sample.split(",")] if sample else []
        if is_headerless(first_row):
            reader = csv.reader(fh)
            raw_rows = [row for row in reader]
            rows = normalize_headerless(raw_rows)
        else:
            reader = csv.DictReader(fh)
            header_map, missing = ensure_schema(reader.fieldnames or [])
            winning_header = find_winning_numbers_header(reader.fieldnames or [])
            missing_set = set(missing)
            if missing_set - {"bonus_2"} and not winning_header:
                raise ValueError(f"Missing canonical columns: {missing}")
            for row in reader:
                normalized = normalize_row(row, header_map, winning_header)
                if not normalized.get("draw_date"):
                    continue
                try:
                    normalized["draw_date"] = parse_date(normalized["draw_date"]).date().isoformat()
                except Exception:
                    continue
                rows.append(normalized)

    rows.sort(key=lambda r: r["draw_date"])
    normalized_path.parent.mkdir(parents=True, exist_ok=True)
    with normalized_path.open("w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=CANONICAL_COLUMNS)
        writer.writeheader()
        for row in rows:
            writer.writerow({col: row.get(col, "") for col in CANONICAL_COLUMNS})
    return len(rows)


def stage_incoming(src: Path, code: str) -> None:
    INCOMING_DIR.mkdir(parents=True, exist_ok=True)
    dest = INCOMING_DIR / f"{code}.csv"
    dest.write_bytes(src.read_bytes())


def main() -> None:
    parser = argparse.ArgumentParser(description="Sync Lottery Storage Vault")
    parser.add_argument("--normalize-only", action="store_true", help="Skip downloads")
    parser.add_argument("--stage-incoming", action="store_true", help="Copy normalized CSVs to data/incoming")
    args = parser.parse_args()

    registry = load_registry()
    lotteries = registry.get("lotteries", [])
    if not lotteries:
        raise SystemExit("No lotteries defined in registry.")

    for entry in lotteries:
        code = entry["id"]
        vault_path = VAULT_DIR / entry["vault_path"]
        raw_path = vault_path / "raw" / f"{code}.csv"
        norm_path = vault_path / "normalized" / f"{code}.csv"

        if entry.get("update_method") == "auto_http" and not args.normalize_only:
            url = entry.get("source_url")
            if not url:
                print(f"[vault] {code}: missing source_url")
                continue
            try:
                download_csv(url, raw_path)
                print(f"[vault] {code}: downloaded")
            except Exception as exc:
                print(f"[vault] {code}: download failed - {exc}")
                continue

        if not raw_path.exists():
            print(f"[vault] {code}: raw CSV missing")
            continue

        try:
            count = normalize_csv(raw_path, norm_path)
            print(f"[vault] {code}: normalized {count} rows")
        except Exception as exc:
            print(f"[vault] {code}: normalize failed - {exc}")
            continue

        if args.stage_incoming:
            stage_incoming(norm_path, code)
            print(f"[vault] {code}: staged to incoming")


if __name__ == "__main__":
    main()
