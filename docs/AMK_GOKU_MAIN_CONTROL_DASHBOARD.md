# AMK-Goku Main Control Dashboard (AMK-MAP-1 + AMK-MAP-2 + AMK-MAP-3 + Z-ROOT-7)

**Purpose:** A single **read-only** HTML compass so AMK-Goku (and other **safe lenses**) can see what exists, what is sealed, what is pending, what is safe to consider next, and what stays blocked — without executing work from the browser.

**AMK-MAP-2 adds:** a **living ecosystem canvas** (local SVG: core + nodes + line styles), a **health monitoring** card grid fed from hub JSON when present (otherwise **UNKNOWN**), and a **health rhythm scheduler** that is a **visual reminder only** (not cron, not task runner).

**AMK-MAP-3 adds:** a **View as** domain/age switcher (stored in **localStorage** for UI convenience only), a **collapsible side catalog** of services/modules (filtered by `sensitivity_tier` + lens), a **readiness observatory** (metadata scores; null → **UNKNOWN**; no user feedback collection), an **AI inspector** block (advise-only copy), and a **Launch Readiness Ceremony** (gates + blocked mirror; **not** deploy). Kids and Public Visitor lenses **hide** operator-only sections and show a **friendly welcome** panel instead.

**Z-ROOT-7 adds:** a collapsible **Seven Guardian Coordination** panel — Milky Way field, neon lines, symbolic roles. **Z-ROOT-7B** upgrades the same JSON to a **CSS 3D-lite constellation** (perspective depth, layered stars/mist, orbital rings, **`tz`** depth per node, card tilt/glow, optional slow orbit drift, pointer parallax when motion allows) — **not** WebGL/Three.js. **Visual and advisory only** — not live AI, not research automation, not execution. Data: `data/z_root_guardian_coordination.json`; styles: `dashboard/styles/z-root-guardian-coordination.css`; script: `dashboard/scripts/z-root-guardian-coordination-readonly.js`. Docs: [Z_ROOT_7_GUARDIAN_COORDINATION_LAYER.md](Z_ROOT_7_GUARDIAN_COORDINATION_LAYER.md), [PHASE_Z_ROOT_7B_3D_GREEN_RECEIPT.md](PHASE_Z_ROOT_7B_3D_GREEN_RECEIPT.md).

**Canonical page:** `dashboard/Html/amk-goku-main-control.html`
**Map data:** `dashboard/data/amk_control_dashboard_map.json`
**Script:** `dashboard/scripts/amk-goku-main-control-readonly.js` (fetch + render only)
**Styles:** `dashboard/styles/amk-goku-main-control.css`

**AMK-DASH-FLEX-1 (command book shell):** responsive **app-style layout** — top ribbon (View as, signals, search, density, focus, inspector toggle), **left control book** (categories from `dashboard/data/amk_control_layout_registry.json`), **center focus stage** (scrollable; existing `details` preserved), **right context inspector** (category help + **copy-only** command snippets), **mini ecosphere pulse** (category jump), **bottom status rail** (traffic / CAR² / registry + doc links for API·SSWS·Cloudflare HOLD). Preferences use **localStorage** only. See [AMK_GOKU_COMMAND_BOOK_LAYOUT.md](AMK_GOKU_COMMAND_BOOK_LAYOUT.md) and [PHASE_AMK_DASH_FLEX_1_GREEN_RECEIPT.md](PHASE_AMK_DASH_FLEX_1_GREEN_RECEIPT.md).

**AMK-DASH-FLEX-2 (layout repair + toolbox):** darker turquoise **command-center** chrome, **sticky** ribbon, constrained app width for 1080p, **Focus stage** filters the center stage only when enabled (otherwise all categories remain visible under the lens), **keyword filter** for drawer + panels, **jump-to-signal** chips, **Read** / **Board** view toggles, **AMK Tools** drawer (expand/collapse, jump, copy-only snippets, docs — no execution). See [PHASE_AMK_DASH_FLEX_2_GREEN_RECEIPT.md](PHASE_AMK_DASH_FLEX_2_GREEN_RECEIPT.md).

## How to open

From the hub root, serve over HTTP (fetch requires a origin; `file://` is unreliable):

```bash
npx http-server . -p 5502
```

Then open:

`http://127.0.0.1:5502/dashboard/Html/amk-goku-main-control.html`

The unified dashboard header also links **AMK-Goku Main Control Map** next to the Living Ecosphere Map.

## Living ecosystem canvas (AMK-MAP-2)

- **SVG only** in the browser: nodes and edges come from `ecosystem_canvas` in `amk_control_dashboard_map.json`.
- **AMK-Goku Core** is the center node; satellites include Z-Traffic, ZAG, VH100, MCBURB, FBAP, Zuno, CAR², NAV, ZSX, ZMC (magical registry), Z-QUESTRA, ÉirMind, ZQuestCraft, XL2 reference lane, and AI Builder Pack.
- **Line styles:** solid = hub metadata/docs relation only; dashed = future-gated or reference-only; thicker root-tint lines = governance spine (Traffic, ZAG, VH100, MCBURB, FBAP).
- **Shapes (legend on page):** map role and posture — stroke tint can reflect the same read-only health bind as the health strip when JSON exists; reference-only lanes stay in the blue / unknown-safe band.
- **No** external graph libraries, **no** live bridge indicators, **no** strobing or rapid pulsing.

## Health monitoring strip (AMK-MAP-2)

- Cards are defined in `health_monitor_cards`; the script **fetches** known paths and **never invents** a green check when data is absent — use **UNKNOWN** and the copy explains the next human step (for example run `npm run z:traffic`).
- Markdown lint has **no** dedicated JSON receipt on this page: the card stays **UNKNOWN** until you run `npm run verify:md` yourself.

## Health rhythm scheduler (AMK-MAP-2)

- Colored chips (GREEN / YELLOW / BLUE / RED) classify **how often or how serious** the rhythm is — not runtime status from this HTML.
- **Copy on page:** “This scheduler is a visual reminder only. It does not run tasks.”
- Command lines are **documentation strings** for the operator (Cursor/terminal), not buttons and not `exec`.

## Universal domain view (AMK-MAP-3)

- **View as** options and per-lens rules live in `domain_views` inside `amk_control_dashboard_map.json`.
- **Dashboard view ≠ service access** — the catalog is descriptive metadata, not entitlement or runtime permission.
- **Ratings:** observatory numbers are internal readiness placeholders when set; otherwise **UNKNOWN**. They are **not** certification and **not** public ranking.
- **User feedback:** remains **future-gated** (consent, privacy policy, deletion controls, 14 DRP review) — this phase does **not** collect feedback or analytics.

## Launch readiness ceremony (AMK-MAP-3)

- **Launch readiness ≠ deployment.** Cloudflare or any production deploy stays in a **separate human-approved lane**.
- The ceremony section may mirror **blocked** categories for orientation only.

## What this page is not

- Not a backend, auth surface, or API client.
- Not deploy, billing, bridge execution, auto-merge, or Cursor task dispatch.
- Not a source of truth: JSON and reports under `data/` remain authoritative; this page **summarizes** and **links**.

## Relationship to other layers

| Layer | Role relative to this map |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **AMK-Goku Notifications (AMK-NOTIFY-1)** | Lane queue + human confirmation UI on the unified dashboard; this map embeds a **read-only** summary of the same `data/amk_operator_notifications.json` and links to the full panel. |
| **Z-Traffic** | Today’s signal card prefers `data/reports/z_traffic_minibots_status.json` when available. |
| **ZAG** | Autonomy policy posture (`data/z_autonomy_task_policy.json`); linked as sealed metadata — no dispatch from HTML. |
| **Z-VH100 / Z-MCBURB / Z-FBAP** | Sealed doctrine + JSON; doc and data links only. |
| **NAV** | Universe workstation catalog — read-only navigator doc + `dashboard/data/z_universe_service_catalog.json`. |
| **ZSX** | Cross-project capability index + receipt link. |
| **Z-QUESTRA (QX)** | Separate app under `z-questra/`; map points to README and snapshot doc — no live bridge. |
| **AI Builder Pack** | `docs/AI_BUILDER_CONTEXT.md` and registries — alignment for Cursor. |
| **Z-SSWS / shadow** | Observation and mirror surfaces; shadow HTML must not execute or change source truth. |

## Verification rituals (reference)

Run these from **ZSanctuary_Universe** root in a terminal or Cursor (this dashboard does **not** run them):

- `npm run z:traffic` — refresh Z-Traffic reports.
- `npm run z:car2` — structure mirror report.
- `npm run verify:md` — markdown lint.
- `npm run dashboard:registry-verify` — registered dashboard paths exist on disk.

Optional depth: `npm run zuno:coverage`, registry omni verify per `AGENTS.md`.

## Confirmation law

- Notification ≠ execution
- Confirmation ≠ deployment
- Recommendation ≠ permission
- AMK opens lanes **outside** this panel; **gates still verify** before work.

The map page repeats this law in the header block rendered from JSON so operators see it every session.

## Future (out of scope for AMK-MAP-1)

A later phase could add a **gated** export of operator decisions to `data/reports/` or a signed receipt flow — still without silent execution from the browser.

## Receipt

- [PHASE_AMK_MAP_1_GREEN_RECEIPT.md](PHASE_AMK_MAP_1_GREEN_RECEIPT.md)
- [PHASE_AMK_MAP_2_GREEN_RECEIPT.md](PHASE_AMK_MAP_2_GREEN_RECEIPT.md)
- [PHASE_AMK_MAP_3_GREEN_RECEIPT.md](PHASE_AMK_MAP_3_GREEN_RECEIPT.md)
- [PHASE_AMK_MAP_3_UNIVERSAL_DOMAIN_VIEW.md](PHASE_AMK_MAP_3_UNIVERSAL_DOMAIN_VIEW.md)
