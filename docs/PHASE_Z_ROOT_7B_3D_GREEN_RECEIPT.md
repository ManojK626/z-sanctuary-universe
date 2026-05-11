# PHASE Z-ROOT-7B — 3D guardian constellation (green receipt)

**Status:** Implemented — dashboard **CSS 3D-lite** only (no WebGL / Three.js).
**Depends on:** `data/z_root_guardian_coordination.json`, Z-ROOT-7 first slice.

## What shipped

- [x] **Perspective stage** (`perspective` + `transform-style: preserve-3d`).
- [x] **Layered starfield + mist** (far/mid planes with depth).
- [x] **Orbital ellipse rings** beneath the constellation.
- [x] **Guardian positions** driven from JSON (`cx`, `cy`, `r`, **`tz`** translateZ depth).
- [x] **HTML node cards** with hover/focus **tilt, glow, and depth pop** (not flat SVG discs only).
- [x] **SVG neon lines** retained; **deep / far** styling for softer background ties.
- [x] **Slow orbit drift** optional on `.z-root7-orbit-spin` (defaults on when motion is allowed).
- [x] **Still / Orbit** toggle — `sessionStorage` preference only (`z7_orbit_pref`); **not** execution.
- [x] **Pointer parallax** tilt on `.z-root7-parallax` when motion allowed.
- [x] **`prefers-reduced-motion`:** no orbit spin, no parallax, no toggle enable; informational note shown.
- [x] **Kids/Public:** unchanged gentle law strip and copy path.
- [x] **Advisory sentence:** “3D constellation view is symbolic and advisory…” visible in panel controls.

## Visual checklist (manual)

1. Serve hub over HTTP from root; open `dashboard/Html/amk-goku-main-control.html`.
2. Open **Seven Guardian Coordination** — confirm **Milky-way depth**, elliptical rings, and **seven guardians + root** with **different apparent depth** (AMK forward, ethical root anchored back).
3. Confirm **neon lines** visible behind/through cards (layered opacity).
4. **Hover/focus** a node — brighter lines, tilted card, detail pane fills.
5. **Orbit toggle** — animation starts/stops (when reduced motion off).
6. **Move mouse** over stage — gentle tilt when reduced motion off.
7. **Kids lens** — short law strip, no jargon in panel chrome.

## Reduced-motion checklist

1. Enable OS/browser “reduce motion”.
2. Reload page — orbit **off**, parallax **still**, toggle **disabled** with note text.
3. Constellation remains **readable and static**.

## Acceptance commands

- `npm run verify:md`
- `npm run dashboard:registry-verify`
- `npm run z:traffic`
- `npm run z:car2`

## Rollback

1. Restore prior versions of:
   - `dashboard/scripts/z-root-guardian-coordination-readonly.js`
   - `dashboard/styles/z-root-guardian-coordination.css`
   - `data/z_root_guardian_coordination.json` (revert coordinates / `tz` / `visual_upgrade` if undesired)
2. Remove this receipt file optional.
3. Re-run dashboard registry verify after map JSON edits (if any).

## Locked law

```text
3D visual ≠ execution.
Constellation ≠ live AI control.
Guardian node ≠ supernatural claim.
Orbit animation ≠ task automation.
AMK-Goku owns sacred moves.
```

## Future

**Z-ROOT-7C** — optional WebGL / Three.js only if doctrine approves heavier GPU path (listed as `future_gates.z_root_7c_webgl` in coordination JSON).
