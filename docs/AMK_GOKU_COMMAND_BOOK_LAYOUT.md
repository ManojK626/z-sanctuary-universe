# AMK-Goku Command Book Layout (AMK-DASH-FLEX-1 + AMK-DASH-FLEX-2)

**Purpose:** Describe the **app-style shell** on `dashboard/Html/amk-goku-main-control.html` that organizes the existing AMK-MAP panels into a **command book** (drawer categories + focus stage + context inspector + status rail + AMK Tools toolbox) without adding execution, deploy, provider calls, or auto-launch.

## Locked law

- **Dashboard layout ≠ execution.** Copy buttons write clipboard text only.
- **Focus mode ≠ permission.** With **Focus stage** on, the center stage shows only the selected book category; with it off, all categories stay visible (domain lens still applies). Focus never grants deploy or execution rights.
- **Command book ≠ auto-launch.** Drawer picks the active category and scroll target; it does not run tasks. **AMK Tools** is UI-only (filter, jump, expand/collapse, copy-only snippets, doc links).
- **Canvas map ≠ live control mesh.** The mini ecosphere row is a navigation aid keyed to categories.
- **GREEN / RED chips = report posture hints** — not sole approval to ship.

## Shell regions (DOM)

- **`#amkDashApp`** — vertical app frame (ribbon → workspace → status rail).
- **`.amk-dash-ribbon`** — title, traffic/registry chips, **View as** (domain lens), search (book + panel keyword filter), density, focus toggle, inspector toggle, **AMK Tools** launch, jump-to-signal chips, read/board toggles, quick nav links.
- **`#amkDashWork`** — CSS grid: **drawer** | **center stage** | **inspector**.
- **`#amkDrawerNavMount`** — category buttons from `dashboard/data/amk_control_layout_registry.json`.
- **`#amk-main`** — scrollable focus stage (all legacy `details` / sections preserved).
- **`#amkDashInspectorChrome`** — context copy per category + **copy-only** npm snippets.
- **`#amkDashMiniEco`** — compact domain pulse buttons (jump to category).
- **`#amkDashStatusRail`** — Traffic, CAR², dash registry chips + API/SSWS/Cloudflare **HOLD** doc anchors (`UNKNOWN` where no JSON receipt exists on-page for markdown).
- **`#amkToolsDrawer`** — AMK Tools toolbox (expand/collapse sections, jump to indicators, doc links, copy-only command lines). No npm or script execution from the page.

## Category map (`data-amk-category`)

Sections keep `data-amk-section` for domain lenses; **`data-amk-category`** drives the drawer:

- `overview` — law, strip, hero, top cards.
- `indicators` — AMK-INDICATOR-1 block, health, rhythm, observatory.
- `api_ssws` — notification queue.
- `workspace` — Zuno Advisor (AAL), catalog + main column (catalog is not category-tagged; lives beside sections), AI inspector table, project map.
- `creative` — living ecosystem SVG canvas.
- `security` — sealed, blocked.
- `root_guardians` — Z-ROOT-7 constellation.
- `launch_hold` — launch ceremony, safe-now.
- `docs_receipts` — receipts list, footer copy.

## Preferences (localStorage only)

Keys (prefix `amkDashFlex_*` in script): active category, drawer collapsed, density (`calm` | `compact` | `tactical`), focus stage, inspector open, **read mode**, **board mode**, **AMK Tools drawer open**.

## Related files

- `dashboard/scripts/amk-goku-main-control-readonly.js` — boot + flex wiring.
- `dashboard/styles/amk-goku-main-control.css` — shell + aura (reduced-motion safe).
- `dashboard/data/amk_control_layout_registry.json` — categories, inspector blurbs, mini map, copy list, rail doc pointers.

## Relation to other systems

- **AMK indicators / Cloudflare HOLD** — still rendered inside the Indicators category; rail summarizes traffic/registry.
- **AAL / Zuno Advisor** — under Workspace.
- **Z-ROOT-7** — under Root Guardians.
- **Z-SSWS / API posture** — linked from the status rail (docs only).
