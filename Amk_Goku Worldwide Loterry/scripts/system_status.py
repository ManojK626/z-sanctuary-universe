from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = REPO_ROOT / "data"
OUT_PATH = REPO_ROOT / "SYSTEM_STATUS.md"
SUMMARY_PATH = DATA_DIR / "reports" / "system_status.json"


def read_json(path: Path) -> dict | None:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return None


def latest_trust_bundle() -> Path | None:
    trust_dir = DATA_DIR / "reports" / "trust"
    if not trust_dir.exists():
        return None
    bundles = sorted(trust_dir.glob("trust_bundle_*.json"), key=lambda p: p.stat().st_mtime, reverse=True)
    return bundles[0] if bundles else None


def main() -> None:
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")

    vault_health = read_json(DATA_DIR / "lottery_vault" / "health.json")
    drift_summary = read_json(DATA_DIR / "drift_watch" / "summary.json")
    jailcell_summary = read_json(DATA_DIR / "jailcell" / "public_summary.json")
    apicon_rep = read_json(DATA_DIR / "apicon" / "reputation.json")
    audiology_manifest = read_json(REPO_ROOT / "core" / "audiology" / "z_audiology_manifest.json")

    trust_path = latest_trust_bundle()
    trust_bundle = read_json(trust_path) if trust_path else None

    manual_total = vault_health.get("manual_total", 0) if vault_health else 0
    manual_missing = vault_health.get("manual_missing", 0) if vault_health else 0
    manual_present = manual_total - manual_missing

    drift_entries = drift_summary.get("entries", []) if drift_summary else []
    drift_codes = ", ".join(sorted({entry.get("code", "unknown") for entry in drift_entries})) or "none"
    drift_count = len(drift_entries)
    jail_total = jailcell_summary.get("total", 0) if jailcell_summary else 0

    if jail_total > 0:
        rhythm_state = "CALM"
    elif drift_count == 0 and manual_present == 0:
        rhythm_state = "CALM"
    elif drift_count <= 2:
        rhythm_state = "ADAPTIVE"
    else:
        rhythm_state = "REGENERATION"

    registry_items = []
    if vault_health:
        for entry in vault_health.get("details", []):
            registry_items.append(
                {
                    "code": entry.get("id"),
                    "mode": "manual" if not entry.get("raw_present") else "verified",
                }
            )

    lines: list[str] = []
    lines.append("# Z-Sanctuary System Status")
    lines.append("")
    lines.append(f"Generated: {now}")
    lines.append("")
    lines.append("## Stable")
    lines.append("- Integrity layer")
    lines.append("- Trust Bond & Education Mode")
    lines.append("- Core pipelines")
    lines.append("")
    lines.append("## Watch")
    lines.append(f"- Manual sources ready: {manual_total - manual_missing}/{manual_total}")
    lines.append(f"- Manual sources missing: {manual_missing}")
    lines.append(f"- Drift summary codes: {drift_codes}")
    lines.append(f"- Rhythm state: {rhythm_state}")
    lines.append("")
    lines.append("## Registry Checklist")
    if registry_items:
        for item in registry_items:
            code = item.get("code") or "unknown"
            mode = item.get("mode") or "unknown"
            lines.append(f"- {code}: {mode}")
    else:
        lines.append("- No registry entries found")
    lines.append("")
    lines.append("## Learnings")
    if jailcell_summary:
        lines.append(f"- Jailcell specimens: {jailcell_summary.get('total', 0)}")
        lines.append(f"- Jailcell categories: {', '.join(sorted(jailcell_summary.get('by_category', {}).keys())) or 'none'}")
    else:
        lines.append("- Jailcell summary unavailable")
    if apicon_rep and isinstance(apicon_rep.get("reputation"), dict):
        scores = [entry.get("score", 0) for entry in apicon_rep["reputation"].values()]
        avg = round(sum(scores) / max(1, len(scores)), 2)
        lines.append(f"- APICON reputation avg: {avg}")
    else:
        lines.append("- APICON reputation unavailable")
    lines.append("")
    lines.append("## Audiology")
    if audiology_manifest:
        lines.append(f"- Status: {audiology_manifest.get('status', 'unknown')}")
        lines.append(f"- Mode: {audiology_manifest.get('mode', 'unknown')}")
        lines.append(f"- Quiet-first: {audiology_manifest.get('priority', 'unknown')}")
        lines.append(f"- Listen: {audiology_manifest.get('capabilities', {}).get('listen', False)}")
    else:
        lines.append("- Audiology manifest unavailable")
    lines.append("")
    lines.append("## Last Trust Bundle")
    if trust_path:
        run_id = trust_bundle.get("run_id", "unknown") if trust_bundle else "unknown"
        lines.append(f"- Run ID: {run_id}")
        lines.append(f"- File: {trust_path.relative_to(REPO_ROOT)}")
    else:
        lines.append("- No trust bundle found")
    lines.append("")
    lines.append("## Action")
    if manual_missing > 0:
        lines.append("- Manual sources missing: review Lottery Vault checklist")
    else:
        lines.append("- No action required today")
    lines.append("")

    bg_log = REPO_ROOT / "logs" / "background_run.log"
    if bg_log.exists():
        lines.append("## Background Run")
        lines.append(f"- Last log: {bg_log.relative_to(REPO_ROOT)}")
        lines.append("")
    lines.append("## Stillness")
    lines.append(
        "Z-Sanctuary is designed to pause. Not every cycle produces change. Stillness is how trust compounds."
    )
    lines.append("")

    OUT_PATH.write_text("\n".join(lines), encoding="utf-8")
    SUMMARY_PATH.parent.mkdir(parents=True, exist_ok=True)

    system_status = {
        "generated_at": now,
        "registry": {
            "formats_total": len(registry_items),
            "formats": registry_items,
        },
        "data_coverage": {
            "available": manual_present,
            "missing": manual_missing,
            "note": "Manual sources require verified CSV ingestion.",
        },
        "observatory": {
            "apicon_avg": avg if apicon_rep and isinstance(apicon_rep.get("reputation"), dict) else None,
            "jailcell_total": jail_total,
            "execution_authority": "none",
            "notes": "Observational only",
        },
        "drift_codes": drift_codes,
        "rhythm_state": rhythm_state,
        "quiet_mode": {
            "active": True,
            "reason": "Core v1.0 stabilization",
            "next_review": "on-demand",
        },
        "trust_bundle": str(trust_path.relative_to(REPO_ROOT)) if trust_path else None,
        "audiology": {
            "status": audiology_manifest.get("status") if audiology_manifest else None,
            "mode": audiology_manifest.get("mode") if audiology_manifest else None,
            "priority": audiology_manifest.get("priority") if audiology_manifest else None,
            "listen": audiology_manifest.get("capabilities", {}).get("listen", False) if audiology_manifest else None,
        },
    }

    SUMMARY_PATH.write_text(json.dumps(system_status, indent=2), encoding="utf-8")
    print(f"Updated {OUT_PATH}")


if __name__ == "__main__":
    main()
