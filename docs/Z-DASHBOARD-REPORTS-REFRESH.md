# Dashboard reports refresh (status rail and badges)

The unified dashboard (`dashboard/Html/index-skk-rkpk.html`) reads **JSON reports** under `data/reports/`. The UI polls on a timer (often about 60 seconds); **numbers change when the files change**, not because the browser invents fresh telemetry.

## Quick reference

| UI area | Report file(s) | Typical refresh |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Z-SSWS status (rail) | `z_ssws_daily_report.json` | Task **Z: SSWS Daily Report** (`python scripts/z_ssws_daily_report.py`) |
| Z Auto-Run / pending audit | Written by monitors | Tasks **Z: SSWS Verify**, autorun / pending audit flows |
| Zuno trend | Zuno report JSON | **Z: Zuno Weekly Reflection**, **Z: Zuno State Report** |
| Storage hygiene (panel + badge) | `z_storage_hygiene_audit.json` | **Z: Storage Hygiene Audit** (`node scripts/z_storage_hygiene_guard.mjs`) |
| AnyDevices (panel + badge) | `z_anydevices_analyzer.json`, `z_anydevices_security_scan.json`, `z_anydevices_monitor.json`, `z_anydevices_approval_queue.json` | **Z: AnyDevices Analyzer**, **Z: AnyDevices Security Scan**, **Z: AnyDevices Monitor** |
| Cycle indicator (panel + badge) | `z_cycle_indicator.json` | **Z: Cycle Record**, **Z: Cycle Routine**, **Z: Indicator Watchdog** |
| Error budget (rail) | `z_error_budget.json` | `node scripts/z_error_budget_engine.mjs` (wire into your hygiene pipeline as needed) |
| SLO badge | Produced by SLO guard output | **Z: SLO Guard** (`node scripts/z_slo_guard.mjs`) |
| Extension guard badge | Guard output | **Z: Extension Guard** |
| Security sentinel badge | Sentinel output | **Z: Security Sentinel**, **Z: Sentinel Refresh (Green Path)** |

## Umbrella tasks

- **Z: Reports Vault Refresh** — batch refresh where configured.
- **Z: Report Freshness Check** — see what is stale.
- **Z: Daily Full Verify Gate** — broader verification.

## Narrow viewport (≤1100px)

The right **status rail** is hidden. The dashboard shows a fixed **Signals** strip that mirrors six edge badges: SLO, Zuno, Storage, Devices, Cycles, Sentinel (`core/z_narrow_health_strip.js`).

## Entry points

- Dashboard stub (readiness): `dashboard/index.html` → links to `dashboard/Html/index-skk-rkpk.html`.
- Registry sync: `node scripts/z_registry_omni_verify.mjs`.
