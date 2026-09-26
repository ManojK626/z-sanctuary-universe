# GW-3A — Visual & Accessibility Acceptance

**Phase:** Golden Website GW-3A
**Date:** 2026-08-27
**Authority:** GW-3 accepted (local visual foundation). Publication **NOT_YET_AUTHORIZED**. Deploy **none**.
**Open:** `docs/golden-website/shell/index.html` (local files)

This slice **reviews what exists**. It does not add records, Guide AI, Universe Map, or publication.

## Method

Interactive pass used Playwright Chromium against **`file://`** pages (the same way a steward opens the shell locally). Command:

`node scripts/z_gw_3a_visual_pass.mjs`

Screenshots: `docs/golden-website/gw-3a/screenshots/`
Metrics: `docs/golden-website/gw-3a/visual_pass_metrics.json`

An `e2e/gw-3a-visual-acceptance.spec.js` exists for the hub Playwright suite. The **receipt pass** is the file:// script, because that matches local-only opening and does not require the hub static server.

## Acceptance questions

| Question | Result | Notes |
| -------- | ------ | ----- |
| Can a first-time visitor understand Z-Sanctuary in under a minute? | **Yes** | Home shows site name, gateway subtitle, approved Core sentence, and two journey links. |
| Can they distinguish QUALIFIED from VERIFIED? | **Yes** | Explicit Home line plus Core pill **Not VERIFIED**. Core remains QUALIFIED. |
| Is Evidence Mode obvious? | **Yes** | Header control and Home CTA. Board appears and is announced. Button becomes **Evidence mode on**. |
| Does the Navigator make sense without implying production? | **Yes** | SEALED, WORKING local, Public production NO, not Map, no execution. Preview restates not production. |
| Are locked future doors clear rather than frustrating? | **Yes** | Nine labelled placeholders, **Coming through evidence gates**, explained as not broken links. Not buttons. |
| Usable on desktop / tablet / mobile and keyboard? | **Yes** | No horizontal overflow at 1440 / 768 / 390. Skip link, evidence Enter, rail arrows. |

## Shell fixes found and applied

Only issues inside this shell:

- Opt out of hub HTML auto-compass inject (`data-disable-auto-compass`) so a later local server cannot wrap this shell in operator UI.
- Evidence CTA turns mode **on** and scrolls to the board; it does not silently toggle off.
- Live status, `aria-controls` / `aria-expanded`, skip-link focus on `main`.
- Locked surfaces are a list, not dead disabled buttons.
- 44px minimum tap targets; CTA `<button>` reset; mobile nav wraps.
- Evidence cards link to the two public-safe pages.
- Preview panel states it is not a public production service.

## Still not claimed

- Not published, not deployed.
- No NVDA / VoiceOver operator session in this slice (keyboard + ARIA only).
- Twin `records[]` remain empty.
- GW-4 not opened.
