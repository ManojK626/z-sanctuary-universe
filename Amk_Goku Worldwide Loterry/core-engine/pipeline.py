"""Run the ingestion → prediction → verification pipeline for Z-Sanctuary."""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List

from commentary.generator import generate_commentary
from kairocell.runner import build_kairocell_summary
from drift_watch import run_drift_watch
from integrity.guard import verify_history_hashes
from integrity.rollback import SnapshotManager

PIPELINE_ROOT = Path(__file__).resolve().parents[0]
REPO_ROOT = PIPELINE_ROOT.parent
ENGINE_DIR = PIPELINE_ROOT
CONFIG_DIR = ENGINE_DIR / "config" / "global-formats"
DATA_DIR = REPO_ROOT / "data"
PRED_ENGINE = ENGINE_DIR / "prediction" / "engine.py"
METRICS_SCRIPT = ENGINE_DIR / "metrics" / "runner.py"
REGION_SCRIPT = ENGINE_DIR / "regions" / "aggregate.py"
SIM_SCRIPT = ENGINE_DIR / "simulations" / "runner.py"
TRUST_SCRIPT = ENGINE_DIR / "reports" / "trust_bundle.py"
PDF_SCRIPT = ENGINE_DIR / "reports" / "export_trust_pdf.py"
HISTORY_SCRIPT = ENGINE_DIR / "ingest" / "ingest_histories.py"
VERIFICATION_SCRIPT = ENGINE_DIR / "analytics" / "verify_cache.py"
CACHE_DIR = ENGINE_DIR / "prediction" / "cache"
METRICS_DIR = DATA_DIR / "metrics"
REPORTS_DIR = DATA_DIR / "reports"
DELTA_DIR = REPORTS_DIR / "deltas"
TRUST_DIR = REPORTS_DIR / "trust"
SIM_DIR = DATA_DIR / "simulations"
WORLD_OBSERVER_SCRIPT = ENGINE_DIR / "world_observer" / "fetch.py"
ENGINE_VERSION = "0.1.0"


def run_command(args: List[str]) -> None:
    print("Running:", " ".join(args))
    subprocess.run([sys.executable, *args], check=True)


def load_formats() -> List[Dict[str, str]]:
    configs: List[Dict[str, str]] = []
    for config_file in sorted(CONFIG_DIR.glob("*.json")):
        payload = json.loads(config_file.read_text())
        code = payload["code"]
        region = payload.get("region", "GLOBAL")
        history = payload.get("history_file") or payload.get("history")
        if history:
            history_path = (REPO_ROOT / history).resolve()
        else:
            history_path = DATA_DIR / "histories" / f"{code}.csv"
        configs.append(
            {
                "code": code,
                "history": str(history_path),
                "config": str(config_file),
                "region": region,
            }
        )
    return configs


def current_run_id() -> str:
    return datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")


def ensure_dirs(args: argparse.Namespace) -> None:
    args.cache_dir.mkdir(parents=True, exist_ok=True)
    METRICS_DIR.mkdir(parents=True, exist_ok=True)
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    DELTA_DIR.mkdir(parents=True, exist_ok=True)
    TRUST_DIR.mkdir(parents=True, exist_ok=True)
    SIM_DIR.mkdir(parents=True, exist_ok=True)


def run_predictions(configs: List[Dict[str, str]], args: argparse.Namespace) -> None:
    if not args.skip_ingest:
        run_command([str(HISTORY_SCRIPT)])

    for fmt in configs:
        history_path = Path(fmt["history"])
        if not history_path.exists():
            print(f"Skipping {fmt['code']} — history missing at {history_path}")
            continue
        cmd = [
            str(PRED_ENGINE),
            "--format",
            fmt["code"],
            "--history",
            str(history_path),
            "--lines",
            str(args.lines),
            "--lookback",
            str(args.lookback),
            "--main-depth",
            str(args.main_depth),
            "--lucky-depth",
            str(args.lucky_depth),
            "--hot-bias",
            str(args.hot_bias),
            "--cold-bias",
            str(args.cold_bias),
            "--cache-dir",
            str(args.cache_dir),
        ]
        if args.no_hot:
            cmd.append("--no-hot")
        run_command(cmd)


def run_metrics(configs: List[Dict[str, str]], run_id: str) -> None:
    for fmt in configs:
        history_path = Path(fmt["history"])
        if not history_path.exists():
            continue
        out_path = METRICS_DIR / f"{fmt['code']}.metrics.json"
        run_command(
            [
                str(METRICS_SCRIPT),
                "--format",
                fmt["config"],
                "--history",
                str(history_path),
                "--run-id",
                run_id,
                "--output",
                str(out_path),
            ]
        )


def run_region_summary(run_id: str) -> None:
    out_path = METRICS_DIR / "regions.summary.json"
    run_command(
        [
            str(REGION_SCRIPT),
            "--formats-dir",
            str(CONFIG_DIR),
            "--metrics-dir",
            str(METRICS_DIR),
            "--out",
            str(out_path),
            "--run-id",
            run_id,
        ]
    )


def run_simulations(configs: List[Dict[str, str]], run_id: str) -> None:
    for fmt in configs:
        metrics_path = METRICS_DIR / f"{fmt['code']}.metrics.json"
        if not metrics_path.exists():
            continue
        delta_out = DELTA_DIR / f"{fmt['code']}.delta.json"
        run_command(
            [
                str(SIM_SCRIPT),
                "--config",
                fmt["config"],
                "--metrics",
                str(metrics_path),
                "--run-id",
                run_id,
                "--output",
                str(delta_out),
            ]
        )


def run_verification(args: argparse.Namespace) -> None:
    report_path = args.report or REPO_ROOT / "docs" / "prediction-verification.json"
    run_command(
        [
            str(VERIFICATION_SCRIPT),
            "--cache-dir",
            str(args.cache_dir),
            "--output",
            str(report_path),
        ]
    )


def build_trust_bundle(run_id: str) -> Path:
    bundle_path = TRUST_DIR / f"trust_bundle_{run_id}.json"
    run_command(
        [
            str(TRUST_SCRIPT),
            "--run-id",
            run_id,
            "--engine-version",
            ENGINE_VERSION,
            "--histories-dir",
            str(DATA_DIR / "histories"),
            "--formats-dir",
            str(CONFIG_DIR),
            "--metrics-dir",
            str(METRICS_DIR),
            "--deltas-dir",
            str(DELTA_DIR),
            "--trust-dir",
            str(TRUST_DIR),
            "--region-summary",
            str(METRICS_DIR / "regions.summary.json"),
        ]
    )
    return bundle_path


def export_trust_pdf(bundle_path: Path) -> None:
    if not bundle_path.exists():
        print("Trust bundle missing, skip PDF export.")
        return
    run_command([str(PDF_SCRIPT), str(bundle_path)])


def refresh_system_status() -> None:
    apicon_rep = REPO_ROOT / "scripts" / "apicon_reputation.py"
    system_status = REPO_ROOT / "scripts" / "system_status.py"
    if apicon_rep.exists():
        run_command([str(apicon_rep)])
    if system_status.exists():
        run_command([str(system_status)])


def run_world_observer() -> None:
    run_command([str(WORLD_OBSERVER_SCRIPT), "--limit", "8"])


def main() -> None:
    parser = argparse.ArgumentParser(description="Automation pipeline for the core prediction stack")
    parser.add_argument("--lines", type=int, default=3, help="How many LPBS lines to current outputs")
    parser.add_argument("--lookback", type=int, default=12, help="Draw lookback window")
    parser.add_argument("--main-depth", type=int, default=12, help="Candidate depth for main numbers")
    parser.add_argument("--lucky-depth", type=int, default=8, help="Candidate depth for lucky numbers")
    parser.add_argument("--hot-bias", type=float, default=0.12, help="Hot-bias multiplier")
    parser.add_argument("--cold-bias", type=float, default=1.0, help="Cold-bias multiplier")
    parser.add_argument("--no-hot", action="store_true", help="Remove hot bias influence")
    parser.add_argument("--cache-dir", type=Path, default=CACHE_DIR)
    parser.add_argument("--report", type=Path, help="Where to write the verification summary JSON")
    parser.add_argument("--skip-ingest", action="store_true", help="Do not run the history ingestion step")
    parser.add_argument("--skip-verify", action="store_true", help="Only run predictions, skip verification")
    args = parser.parse_args()

    run_id = current_run_id()
    ensure_dirs(args)
    configs = load_formats()
    snapshot = SnapshotManager(
        [
            DATA_DIR / "reports" / "trust",
            DATA_DIR / "reports" / "deltas",
            DATA_DIR / "reports" / "commentary",
            DATA_DIR / "kairocell",
            DATA_DIR / "drift_watch",
            DATA_DIR / "world_observer",
        ]
    )
    snapshot.backup()
    try:
        verify_history_hashes(CONFIG_DIR)
        run_predictions(configs, args)
        run_metrics(configs, run_id)
        run_region_summary(run_id)
        kairocell_path = build_kairocell_summary(run_id)
        print("KAIROCELL summary:", kairocell_path)
        run_simulations(configs, run_id)
        if not args.skip_verify:
            run_verification(args)
        bundle_path = build_trust_bundle(run_id)
        export_trust_pdf(bundle_path)
        run_world_observer()
        for fmt in configs:
            try:
                generate_commentary(bundle_path, fmt["code"])
            except SystemExit as err:
                print(f"Commentary skipped for {fmt['code']}: {err}")
        drift_path = run_drift_watch(run_id, METRICS_DIR)
        print("Drift watch summary:", drift_path)
        refresh_system_status()
    except Exception:
        snapshot.restore()
        raise
    else:
        snapshot.cleanup()


if __name__ == "__main__":
    main()
