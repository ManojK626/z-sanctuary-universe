# Z-Traffic Robot Minibots (ZTR-1)

## Purpose

**Read-only traffic tower** — minibots run existing hub checks and summarize whether the repo looks ready to **open the next Turtle Mode lane**. They **do not** decide alone, auto-fix, merge, deploy, or call providers.

Canonical question:

> Are we ready to proceed, or should we hold Turtle Mode?

## Z-AMK-GTAI (strategy council)

After traffic (and related reports) are fresh, **`npm run z:amk:strategy`** rolls signals into **one read-only strategy brief** (`data/reports/z_amk_gtai_strategy_report.md`). It **does not** execute fixes — it helps AMK interpret RED/BLUE before the next lane. See [Z_AMK_GTAI_STRATEGY_COUNCIL.md](Z_AMK_GTAI_STRATEGY_COUNCIL.md).

## Z-SWARM-14DRP governance companion

Run **`npm run z:swarm:14drp`** to validate universal swarm law + role registries (docs/data/report lane only). This classifier flags forbidden authority claims (RED), future-gated AMK lanes (BLUE), and optional reference gaps (YELLOW). It never executes runtime work. See [Z_SWARM_14DRP_UNIVERSAL_AGENT_LAW.md](Z_SWARM_14DRP_UNIVERSAL_AGENT_LAW.md) and [Z_FORMULA_SWARM_CO_DESIGN_ENGINE.md](Z_FORMULA_SWARM_CO_DESIGN_ENGINE.md).

## Z-SEC-TRIPLECHECK communication companion

Run **`npm run z:sec:triplecheck`** for read-only communication-flow and safety-drift checks (path safety, report alignment, indicator mismatch warnings, and forbidden-lane posture). It writes advisory reports and never executes runtime changes.

## Command

From hub root:

```bash
npm run z:traffic
```

Optional flags:

```bash
node scripts/z_traffic_minibots_status.mjs --deep
node scripts/z_traffic_minibots_status.mjs --with-questra
node scripts/z_traffic_minibots_status.mjs --next-lane=short-description
```

| Flag | Meaning |
| ---------------- | ----------------------------------------------------------------------------------------------- |
| `--deep` | Runs `z:ai-builder:refresh` (heavy; regenerates many docs). **Off by default.** |
| `--with-questra` | Runs `npm test` in `z-questra/` (advisory optional lane). |
| `--next-lane=…` | Free-text hint; if it matches sensitive themes, signal shifts toward **BLUE** (human decision). |

## Reports

| Artifact | Role |
| --------------------------------------------- | ------------------------ |
| `data/reports/z_traffic_minibots_status.json` | Machine-readable summary |
| `data/reports/z_traffic_minibots_status.md` | Human-readable summary |

When the hub is served over HTTP, **AMK-INDICATOR-1** (`dashboard/scripts/amk-project-indicators-readonly.js`) may read `traffic_chief.overall_signal` from that JSON to **overlay** the Z-Traffic row in `dashboard/data/amk_project_indicators.json` — still read-only; no auto-lane from the dashboard.

**Z-AAL (AAL-1):** the **Zuno Advisor Console** on the AMK main control uses the same traffic JSON (when reachable) plus the approval ladder to answer “what next / blocked / Cloudflare?” **deterministically** — still no task execution. See [AMK_ZUNO_ADVISOR_CONSOLE.md](./AMK_ZUNO_ADVISOR_CONSOLE.md).

**Z-AWARE-1:** run `npm run z:ecosystem:awareness` after changing `data/z_ecosystem_awareness_registry.json` or project capsules; it aggregates posture and lists **RED/BLUE** notification candidates only — separate from traffic minibots but complementary. See [Z_ECOSYSTEM_AWARENESS_SPINE.md](./Z_ECOSYSTEM_AWARENESS_SPINE.md).

## MiniBot roles (conceptual)

| MiniBot | Watches | Typical signal |
| ------------------------------------- | ----------------------------------- | -------------------------------------------------------------------- |
| Markdown Traffic Bot | `npm run verify:md` | Docs runway |
| CAR² Traffic Bot | `npm run z:car2` | Duplication / drift scan |
| Dashboard Traffic Bot | `npm run dashboard:registry-verify` | Cockpit registry |
| Cross-Project Bot | `npm run z:cross-project:sync` | Capability / entitlement JSON coherence |
| Z-AWARE-1 Ecosystem Awareness Bot | `npm run z:ecosystem:awareness` | Registry + capsules; exit 1 only if overall **RED** |
| Z-API-SPINE-1 Power Cell Bot | `npm run z:api:spine` | API/route registry validation; exit 1 only if overall **RED** |
| Z-SSWS-LINK-1 Launch Requirements Bot | `npm run z:ssws:requirements` | Workspace launch manifest validation; exit 1 only if overall **RED** |
| AI Builder Bot | `npm run z:ai-builder:refresh` | Only with `--deep` |
| Project Test Bot | `z-questra` tests | Only with `--with-questra` |
| DRP Gate Bot | `--next-lane` hint analysis | Governance / safety posture (read-only pattern match) |
| Traffic Chief | Combines results | Overall recommendation |

## Traffic signals

| Signal | Meaning |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **GREEN** | Required automated checks passed; no BLUE hint conflict. Operator still chooses scope and rollback. |
| **YELLOW** | Required checks passed, but an **optional** check failed (e.g. `--deep` or `--with-questra`). Proceed with caution. |
| **RED** | At least one **required** check failed — fix before treating the runway as open. |
| **BLUE** | Automation looks acceptable, but the **hinted next lane** touches governance-sensitive themes — **AMK/human decision** before proceed. |

Exit codes: **`npm run z:traffic` exits `1` only when the chief signal is RED** (so CI can fail closed). GREEN, YELLOW, and BLUE exit `0` after writing reports.

## Turtle Mode alignment

- **One domain, one purpose, one rollback** per lane — minibots do not replace that discipline.
- Minibots **advise**; **you** choose the next lane.
- No bridge execution, billing, deployment, or autonomous task runs are added by ZTR-1.

## What ZTR-1 explicitly does not do

- No auto-fix, auto-merge, or auto-open PRs
- No backend, API, provider, payment, or deploy actions
- No entitlement or pricing enforcement (metadata checks only via existing scripts)
- No replacement for full pipelines (`verify:full`, AAFRTC, etc.)

## AMK-Goku Notifications Panel (Phase AMK-NOTIFY-1)

Traffic receipts feed **recommended checks** on the hub dashboard **AMK-Goku Notifications** panel — **read-only** in Phase 1; AMK confirms lanes **outside** the panel. See [AMK_GOKU_NOTIFICATIONS_PANEL.md](./AMK_GOKU_NOTIFICATIONS_PANEL.md).

## Rollback

Remove `scripts/z_traffic_minibots_status.mjs`, `docs/Z_TRAFFIC_MINIBOTS.md`, the `z:traffic` entry in `package.json`, and delete generated `data/reports/z_traffic_minibots_status.{json,md}` if desired.
