# Phase AMK-DASH-FLEX-2 — Green receipt (Super Saiyan layout repair + tool drawer)

**Scope:** UI-only changes to the AMK-Goku main control dashboard shell (`dashboard/Html/amk-goku-main-control.html`, `dashboard/scripts/amk-goku-main-control-readonly.js`, `dashboard/styles/amk-goku-main-control.css`, `dashboard/data/amk_control_layout_registry.json`). No backend, no live AI, no voice, no script execution, no auto-approval, no deploy.

## What shipped

1. **Focus stage behavior** — When **Focus stage** is **off**, all book categories remain visible (domain lens still hides `data-amk-section` rows per map). When **on**, only nodes matching the active drawer `data-amk-category` are shown in the center stage.
2. **Category navigation** — Drawer click still sets the active category; with focus **off**, the first panel in that category **scrolls into view** and opens if it is a `<details>`.
3. **Quick filter** — The ribbon search filters both drawer buttons and center-stage panels/headers/hero/strip blocks by keyword (`amk-dash-search-hide`).
4. **Jump to signal** — Ribbon chips scroll to the first matching posture pill in `#amk-main` (UNKNOWN prefers a neutral pill in indicators, else opens the indicators section).
5. **Read mode / Board mode** — Toggles stored in **localStorage** only; read mode hides dense disclaimers and meta rows; board mode uses a compact grid on section bodies.
6. **AMK Tools drawer** — Floating toolbox: expand/collapse all sections, jump to indicators, doc links, **copy-only** npm lines (explicit labels). Backdrop + Escape close; open state persisted.
7. **Density (Calm / Compact / Tactical)** — Stronger visual deltas: typography, spacing, tactical rail and panel emphasis, calm softer glow.
8. **Visual shell** — Dark turquoise / deep teal page background, glass panels, category-tinted neon borders on `details.amk-map-section`, sticky ribbon, max-width app shell for 1080p readability.

## Verification commands (hub root)

Run and expect exit code 0:

- `npm run verify:md`
- `npm run dashboard:registry-verify`
- `npm run z:traffic`
- `npm run z:car2`

## Manual checklist

- [ ] Open `dashboard/Html/amk-goku-main-control.html` over HTTP at **100%** or **90%** zoom; layout is navigable without shrinking to 25%.
- [ ] Toggle **Calm / Compact / Tactical** — padding, type scale, and tactical emphasis change visibly.
- [ ] **Focus stage** off — all categories visible (respect lens). **Focus stage** on — only active category panels show.
- [ ] **AMK Tools** opens/closes; copy buttons only write clipboard; no execution.
- [ ] Search filters drawer and center content.
- [ ] Jump chips scroll to a matching pill when present.
- [ ] Kids / Public lens still hides protected sections (unchanged `applyView`).

## Rollback

Revert the files touched in this phase (HTML, CSS, main control script, layout registry phase string, and this receipt) to the previous commit or restore from backup; no migrations or generated artifacts required.
