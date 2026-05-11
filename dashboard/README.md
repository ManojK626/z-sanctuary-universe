# Z-Sanctuary Dashboard (Unified)

**Purpose:** Single web dashboard for the Z-Sanctuary Universe — operator home, status, panels, autopilot, governance, and quick access to all modules. **Unified** = merged best of both layouts (canonical + backup) with operator refinements.

---

## Canonical entry: `Html/index-skk-rkpk.html` (SKK & RKPK · HODP)

**Serve from repo root:** e.g. `npx http-server . -p 5502` → open **`http://127.0.0.1:5502/dashboard/Html/index-skk-rkpk.html`**. The unified header includes a **Living Ecosphere Map** anchor (ZMV-1C) to `Html/z-universe-ecosphere-map.html` — read-only, same HTTP serve requirement.

**Compat:** `Html/index.html` is a **thin redirect** to `index-skk-rkpk.html` (old bookmarks and readiness checks that hit `index.html` still work).

**Z AI Ecosphere (ledger + Zuno):** `z-ai-ecosphere/index.html` — same serve pattern, e.g. `http://127.0.0.1:5502/dashboard/z-ai-ecosphere/index.html`. Loads ecosphere ledger, KRTAA, PAPAO, and the **Zuno system state** report with **Copy full report (JSON / Markdown)**, **Open JSON/Markdown**, and an executive summary. Regenerate: `node scripts/z_zuno_state_report.mjs` from hub root, then refresh the page.

**Shadow workbench:** `Html/shadow/index-skk-rkpk.workbench.html` — duplicate for background iteration; merge into `index-skk-rkpk.html` when ready. See **`config/z_dashboard_entrypoints.json`** for the multi-surface pattern (repeat for other projects: canonical name + stub + shadow).

| Layer | What it offers |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Top indicator** | Z-SSWS, search, Z◄/Z►, Low Light, Status Rail, **Display** strip (Large / Contrast / Focus / Calm — synced with Control Centre). |
| **Tab bar** | Control Centre, Commander, AI Assistant, Images, Panel Directory, Governance, Autopilot, Module Registry, Blueprint, Pulse, etc. |
| **Lens mode** | Calm / Focus / Governance. |
| **Bottom Toolts bar** | Autopilot, Governance Check, S-2-R, Autocompile, Suggestions, Private Console, Add Log, Status. |
| **Bottom status strip** | Harisha status · safe work window. |
| **Z Neural Hive** | Observe, Think, Build, Govern, Registry, Social. |
| **Z-Living Pulse** | Butterfly particles + optional sound (On/Off/Auto/Read). |
| **Universal Workstation Navigator (NAV-1)** | Collapsible **left service rail** + **right detail panel** driven by `dashboard/data/z_universe_service_catalog.json` (metadata only). Scripts `dashboard/scripts/z-universe-service-map.js` + `z-universe-navigator-readonly.js`, styles `dashboard/styles/z-universe-navigator.css`. Wired in `Html/index-skk-rkpk.html`. **Read-only:** links to docs/reports only — no API calls, cloud memory, or workflow execution from the navigator. Use HTTP serve so `fetch` can load the catalog (`npx http-server . -p 5502`). Docs: `docs/dashboard/Z_UNIVERSE_WORKSTATION_NAVIGATOR.md`. |
| **AMK-Goku Notifications (Phase AMK-NOTIFY-1)** | Fixed panel on `Html/index-skk-rkpk.html` + **shadow** workbench: loads `data/amk_operator_notifications.json`, shows signal / risk / ZAG level / checks; **Confirm / Hold / Needs review** writes **localStorage only** — no task execution. Scripts `dashboard/scripts/amk-goku-notifications-readonly.js`, styles `dashboard/styles/amk-goku-notifications.css`. Docs: `docs/AMK_GOKU_NOTIFICATIONS_PANEL.md`, `docs/AMK_GOKU_OPERATOR_CONFIRMATION_POLICY.md`. |
| **Unified readiness indicators (Phase AMK-INDICATOR-1)** | Fixed **left** panel on unified + shadow dashboards + collapsible section on `Html/amk-goku-main-control.html`: loads `dashboard/data/amk_project_indicators.json`, optional overlays from traffic / Z-SUSBV overseer / CAR² / Zuno / dashboard registry verify reports when served over HTTP; **Cloudflare Go/No-Go** card stays **HOLD**. Sort RED→BLUE→YELLOW→GREEN/GOLD/PURPLE→UNKNOWN. Scripts `dashboard/scripts/amk-project-indicators-readonly.js`, styles `dashboard/styles/amk-project-indicators.css`. Docs: `docs/AMK_PROJECT_INDICATORS_AND_GO_NO_GO.md`, `docs/PHASE_AMK_INDICATOR_1_GREEN_RECEIPT.md`. |
| **AMK-Goku Main Control Map (AMK-MAP-1–3 + AMK-DASH-FLEX-1)** | Read-only compass: `Html/amk-goku-main-control.html` + `dashboard/data/amk_control_dashboard_map.json` (SVG canvas, health strip, rhythm planner, **domain lenses**, side **catalog**, readiness **observatory**, **launch ceremony**, **AMK-INDICATOR-1** section). **AMK-DASH-FLEX-1** adds a **command-book shell** (ribbon, category drawer, focus stage scroll, context inspector, mini ecosphere pulse, status rail) via `dashboard/data/amk_control_layout_registry.json` — layout/localStorage only; copy buttons are clipboard-only. Optional traffic + notifications fetch. No execution, cron, feedback collection, or analytics. Docs: `docs/AMK_GOKU_MAIN_CONTROL_DASHBOARD.md`, `docs/AMK_GOKU_COMMAND_BOOK_LAYOUT.md`, `docs/PHASE_AMK_MAP_3_UNIVERSAL_DOMAIN_VIEW.md`, `docs/PHASE_AMK_DASH_FLEX_1_GREEN_RECEIPT.md`, receipts MAP-1–3. |
| **Living Ecosphere Map (ZMV-1B)** | **Read-only** HTML: `Html/z-universe-ecosphere-map.html` + `dashboard/scripts/z-universe-ecosphere-map-readonly.js` + `dashboard/styles/z-universe-ecosphere-map.css`. Fetches NAV catalog, ZSX capability index, entitlement excerpts, magical visual registry, shadow policy — **no execute/deploy** controls. Same HTTP serve pattern: `http://127.0.0.1:5502/dashboard/Html/z-universe-ecosphere-map.html`. Docs: `docs/dashboard/Z_SANCTUARY_LIVING_ECOSPHERE_MAP.md`, receipt `docs/cross-project/PHASE_ZMV_1B_GREEN_RECEIPT.md`. |

**Panels (open via tabs or Panel Directory):**

- **AMK-Goku Commander** — daily control brain (Phase 1): mirrors Twin Roots / Zuno Hand badges, advisory intelligence blocks, product snapshot from Enterprise OS seed JSON, last autonomous ledger lines, shortcuts (PR / verify command copy / Twin Roots / Products / Pause AI). Same Lumina styling as the hub (`dashboard/styles/z-commander-panel.css`).
- **Z Control Centre** — operator home: quick links (Register, Checklist, Formulas, INDEX, Guardian's Manifesto, Z-DACNETS, Z-HvsP), Quiet/Trust badges, **grouped tool panels** (Observe & verify, Operate & safety, Build & automate, Advanced) with collapsible `<details>` (Observe includes **Open Commander**), **Display & accessibility** toggles (large targets, contrast, focus rings, reduce motion decor), and **Skip to main dashboard** link at the top of the page.
- **Z Twin Roots Architecture** — Phase 1 mock visual map (Mango Tree memory, Tarzan Tree routing, Fusion Grove collaboration) embedded from `dashboard/panels/z_twin_roots_architecture.html`.
- **Z-ANIMA CORE Lite (mock)** — read-only compassion-engine preview: `dashboard/panels/z_anima_core_lite.html` + `data/z_anima_lite_mock.json`; open from Control Centre (Build & automate) or Commander; no live stream or payments.
- **Z-Zuno hub coverage (read-only)** — In Control Centre → **Observe & verify**: live fetch of `data/reports/z_zuno_coverage_audit.json` + Phase 3 plan JSON (counters, registry posture histogram, links to MD/JSON). Script: `dashboard/scripts/z-zuno-coverage-readonly.js`. Regenerate: `npm run zuno:coverage && npm run zuno:phase3-plan`. No fix/build buttons.
- **Zuno orchestration foundation (Phase 2B, read-only)** — Same **Observe & verify** group: card from `dashboard/scripts/z-orchestration-status-readonly.js` — contracts package presence, examples-check PASS/FAIL, task-plan lint PASS/FAIL, static posture (runtime orchestrator CLOSED, providers DISABLED, deployment HOLD), links to hub reports + orchestration docs. No buttons; serve hub root for `fetch`.
- **Z-QUESTRA (Phase 2.1)** — Linked from Control Centre → **Observe & verify** as `z-questra/dist/index.html` when the hub is served from repo root; run `npm run build` inside `z-questra/` first. Separate Vite dev server for daily UI work (`cd z-questra && npm run dev`). Independent app — no live Z-Sanctuary bridge.
- **Z-CAR² structure mirror (Phase 1)** — `npm run z:car2` writes `data/reports/z_car2_similarity_report.{json,md}` (duplicate lines / 4-line windows, risk tags, registry↔manifest ZId check). Read-only.
- **Z-CAR² refactor plan (Phase 2)** — `npm run z:car2-plan` reads that JSON and writes `data/reports/z_car2_refactor_plan.{json,md}` (action buckets: KEEP_AS_EVIDENCE, IGNORE_TRIVIAL, shared doc/script/dashboard suggestions, HUMAN_REVIEW_ONLY — **no edits**). Full ritual: `npm run zuno:coverage && npm run zuno:phase3-plan && npm run z:car2 && npm run z:car2-plan`.
- **AI Builder Insight Pack (read-only docs)** — Registry-backed module pages under `docs/modules/`, indexes, and Cursor briefs (`docs/AI_BUILDER_CONTEXT.md`, `docs/ai-builder/`). **Z Blueprint** panel in `Html/index-skk-rkpk.html` (and shadow workbench) links to context, indexes, and commands. Refresh from hub: `npm run z:ai-builder:refresh`; module MDs only: `npm run z:docs:modules`; after large generated-doc churn: `npm run z:car2`.
- **ZUNO-4ROOT guardian + communication spine** — Doctrine under `docs/zuno-4root/` (four-root model: AMK-Goku, SKK, RKPK, Zuno; **SKK/RKPK Parent-Guardian Layer**). HODP panels **`zZuno4RootSpinePanel`** and upgraded **`zCompanion3dPanel`** (canonical + shadow): flow badges (doctrine labels, not fake counts), symbolic four-root canvas in `core/z_companion_3d.js`, summon FAB label **4-ROOT**. Safety lines embedded per doctrine.
- **Z Panel Directory** — Show All, Hide All, Popout, Reset Sizes; Layout presets (Focus, Analysis, Governance); Split layout (Auto, 1/2, 1/4); tree of all panels.
- Awareness, Governance, Autopilot Status, Module Registry, Benchmarks, Legal & Help, Blueprint, Living Pulse, Harisha Status, and the rest as in the register.

---

## Legacy / backup: `Html/index_latest_backup.html`

Same design idea; many script paths point to `./` so full interactivity requires path fixes. **CSS and doc links** use `../../` so styles and links work when served from repo root. Use for reference or the legacy “Sanctuary Dashboard” analytics panel layout.

---

## Folder structure

```text
dashboard/
├── README.md                 (this file)
├── z-ai-ecosphere/           (ledger, KRTAA, PAPAO, Zuno full state + copy)
├── Html/
│   ├── index-skk-rkpk.html   (canonical SKK & RKPK unified HODP)
│   ├── index.html            (redirect stub → index-skk-rkpk.html)
│   ├── shadow/
│   │   └── index-skk-rkpk.workbench.html   (shadow copy for iteration)
│   ├── index_latest_backup.html
│   ├── dashboard_snippet.html
│   ├── z_html_links_hub.html
│   └── radio_garden.html
├── data/
│   └── z_universe_service_catalog.json   (NAV-1 service map — read-only metadata)
├── scripts/
│   ├── z-universe-service-map.js           (navigator accents + catalog URL)
│   ├── z-universe-navigator-readonly.js    (NAV-1 UI — no execution)
│   └── … (other dashboard scripts)
├── styles/
│   ├── z-universe-navigator.css
│   └── … (lumina, commander, etc.)
├── panels/
│   ├── consent-center.html
│   ├── explainer.html
│   └── terms-privacy.html
├── skk-dashboard.js
├── skk-avatar.js
├── rkpk-avatar.js
├── skk-dashboard.css
└── .vscode/
```

**Assets used by the dashboard** (from repo root):

- **`interface/z_style.css`** — main styles (panels, edge bars, status rail, etc.)
- **`core/`** — harisha, cycle indicator, miniai boot, etc.
- **`miniai/`** — bot scripts

---

## Why “only 1 mini panel” in the backup

In **index_latest_backup.html** the “front” layer showed only the **Sanctuary Dashboard** panel because:

1. **CSS path was wrong** (`../interface/` from `dashboard/Html/` → `dashboard/interface/`, which doesn’t exist). Only the Sanctuary Dashboard panel had enough **inline styles** (position, size, z-index) to still appear. Other panels rely on the `.z-panel` class from `z_style.css`, so they didn’t get `position: fixed` and proper layout. **Fixed:** the backup now loads `../../interface/z_style.css`, so **Z Vault Status**, **Z Public Mirror**, and **Z Panel Directory** should also render as fixed panels when served from repo root.
2. **Many panels are hidden by default** (`display: none`). Use **Z Panel Directory → Show All** (or the equivalent in the backup) to reveal them.

For the **full multi-panel view** with all tabs and behaviour, use **`Html/index-skk-rkpk.html`**.

---

_Last updated: 2026-05-01. Canonical SKK & RKPK entry + shadow workbench; Z Blueprint AI Builder pack pointers; ZUNO-4ROOT panels + doctrine; aligned with config/z_dashboard_entrypoints.json._
