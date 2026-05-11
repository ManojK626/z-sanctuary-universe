# PHASE AMK-DASH-FLEX-1 — Green receipt (UI shell)

**Scope:** AMK-Goku Main Control **layout and navigation only** (HTML/CSS/JS + layout registry JSON + docs). No backend, no live AI, no deploy, no bridge execution, no auto-launch, no secrets.

## Acceptance checklist

- [ ] `npm run verify:md` exits 0.
- [ ] `npm run dashboard:registry-verify` exits 0.
- [ ] `npm run z:traffic` exits 0.
- [ ] `npm run z:car2` exits 0.
- [ ] Page loads over HTTP from hub root.
- [ ] At 100% zoom, ribbon + drawer + stage + inspector usable on 1080p-class display.
- [ ] Drawer categories switch visible sections (`data-amk-category` filter).
- [ ] Domain lens (Kids/Public) still hides `data-amk-section` rows per map JSON; friendly panel still shows.
- [ ] Density buttons set `data-amk-density` on `<body>`.
- [ ] Focus stage checkbox toggles `amk-dash-focus-mode` on `<body>`.
- [ ] Inspector panel toggles open/closed; copy buttons only use `navigator.clipboard.writeText`.
- [ ] Status rail shows Traffic / CAR² / registry posture or UNKNOWN; doc links resolve when served from repo root.
- [ ] `prefers-reduced-motion: reduce` disables ribbon aura drift animation.

## Rollback

1. Revert `dashboard/Html/amk-goku-main-control.html`
2. Revert `dashboard/scripts/amk-goku-main-control-readonly.js`
3. Revert `dashboard/styles/amk-goku-main-control.css`
4. Remove `dashboard/data/amk_control_layout_registry.json` if rolling back entirely
5. Revert doc/README/AI_BUILDER touch lines
6. Remove this receipt and `docs/AMK_GOKU_COMMAND_BOOK_LAYOUT.md` if desired

## Manual commands (operator)

```bash
npx http-server . -p 5502
```

Open `http://127.0.0.1:5502/dashboard/Html/amk-goku-main-control.html`.
