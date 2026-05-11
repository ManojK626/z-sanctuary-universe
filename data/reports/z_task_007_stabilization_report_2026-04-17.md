# Z Task 007 — System stabilization report

**Date:** 2026-04-17
**Goal:** Align extension guard, Trouble Maker / disturbance signals, and critical report freshness with Zuno visibility — without claiming false “launch ready.”

---

## 1. Targets vs outcome (Zuno + Trouble Maker)

| Metric | Before (approx.) | After |
| ---------------------------------- | ------------------------------------------------------ | ---------------------------------------------------- |
| Extension guard (policy) | `hold` (e.g. `extensions.ignoreRecommendations` drift) | **`green`** (`npm run vscode:extension-guard:apply`) |
| Trouble Maker failed checks | **3** | **0** |
| Disturbance score | **48** | **0** |
| Trouble Maker status | `alert` | **`green`** |
| Zuno `disturbance_watch` | `alert` | **`clear`** |
| Zuno `extension_guard` (executive) | `attention` | **`aligned`** |

Sources on disk: `data/reports/z_troublemaker_scan.json`, `data/reports/zuno_system_state_report.json`, `data/reports/z_extension_guard.json`.

**Still intentionally not “launch ready”:** `public_launch` remains **not-ready**; readiness gates **0/4**; `npm run verify:full` stops at **Z-Execution Enforcer** while **P1 open tasks = 7** (governance gate, not a dashboard bug).

---

## 2. Root causes addressed (the three former failures)

1. **`single_folder_open_autorun`** — Two VS Code tasks used `runOn: folderOpen` (**Z: SSWS Auto Boot** and **Dashboard Auto-Launch**). **Fix:** removed `runOptions.runOn` from **🚀 Z: Dashboard Auto-Launch (on startup)** so only SSWS Auto Boot runs on folder open (avoids 5502 double-bind; SSWS chain already opens the dashboard path).
2. **`workspace_root_canonical`** — Scan required a legacy `C:\ZSanctuary_Universe` path; real hub lives under **Cursor Projects Organiser**. **Fix:** `scripts/z_troublemaker_scan.mjs` now treats the hub as canonical when `package.json` has `"name": "z-sanctuary-universe"` and the folder basename is `ZSanctuary_Universe`.
3. **`critical_reports_fresh`** — `z_autorun_audit.json`, `z_policy_shadow_gate.json`, and later **`z_otel_shadow_status.json`** were outside the 36h window. **Fix:** ran `node scripts/z_autorun_audit.mjs`, `node scripts/z_policy_shadow_gate.mjs`, and **`npm run observability:shadow`** (`z_otel_shadow_check.mjs`), then re-ran Trouble Maker + Zuno.

---

## 3. Commands executed (record)

```bash
npm run vscode:extension-guard:apply
node scripts/z_autorun_audit.mjs
node scripts/z_policy_shadow_gate.mjs
npm run security:troublemaker-scan
node scripts/z_zuno_state_report.mjs
npm run vscode:extension-guard
npm run observability:shadow
npm run security:troublemaker-scan
node scripts/z_zuno_state_report.mjs
node scripts/z_registry_omni_verify.mjs   # PASS
npm run verify:full                       # BLOCKED at Z-Execution Enforcer (P1 / readiness)
```

---

## 4. Z-Bridge Task 006 — UI vs JSON (sanity)

Cross-check (read-only): `data/z_bridge/pool.json` **total_credits** = **400**; `users.json` **users.length** = **5**. The local dashboard binds those same files; numbers in the UI should match after a static-server refresh.

---

## 5. Files touched in this stabilization pass

- `.vscode/tasks.json` — duplicate `folderOpen` removed from Dashboard Auto-Launch.
- `.vscode/settings.json` — `extensions.ignoreRecommendations` set to **false** by extension guard apply (per `config/z_extension_guard_policy.json`).
- `scripts/z_troublemaker_scan.mjs` — hub-root canonical check.
- Regenerated reports under `data/reports/` (Zuno, Trouble Maker, extension guard, OTel shadow, autorun audit, policy shadow gate).

---

## 6. Recommended next moves (Task 008 prep — still gated)

1. Close or downgrade **P1** items and advance **readiness gates** so `verify:full` can pass the enforcer without bypass.
2. Keep **`npm run observability:shadow`** (or full **`npm run dashboard:indicators-refresh`**) on a recurring cadence so `z_otel_shadow_status.json` does not drift past the Trouble Maker window again.
3. **Task 008 (Cloudflare / public layer)** remains **locked** until charter/readiness and enforcer agree — visibility (006) and stabilization (007) do not replace that contract.

---

_Stabilization narrative only; no vault or cross-repo writes beyond documented hub JSON and workspace settings._
