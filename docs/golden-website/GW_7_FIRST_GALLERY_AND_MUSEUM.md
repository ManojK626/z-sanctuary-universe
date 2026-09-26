# GW-7 — First Golden Visual Gallery and Prototype Museum

**Phase:** Golden Website GW-7
**Date:** 2026-08-27
**Authority:** GW-6 accepted. Steward approved six visuals and one prototype exhibit candidate.
**Open:** `docs/golden-website/shell/gallery.html` and `docs/golden-website/shell/museum.html`

Local only. Publication **NOT_YET_AUTHORIZED**. Deploy **none**. Golden Guide AI **closed**. Full Golden Universe Map **closed**.

## Approved exhibit scope

| Kind | Count | IDs |
| --- | ---: | --- |
| Current REAL UI CAPTURE | 5 | VIS-GW-011, VIS-GW-012, VIS-GW-013, VIS-GW-016, VIS-GW-018 |
| HISTORICAL REAL UI CAPTURE | 1 | VIS-GW-002 |
| LOCAL WORKING PROTOTYPE | 1 | PROTO-GW-SHELL |

No other visual or prototype may enter because it looks attractive. GW-6 remains the discovery ledger for later recovery.

## Exhibit truth model

Gallery shows what visitors can see. Museum explains what they can interact with. Neither is evidence by itself.

Allowed visual labels: `REAL UI CAPTURE`, `HISTORICAL REAL UI CAPTURE`.

Allowed prototype label: `LOCAL WORKING PROTOTYPE`.

Do not introduce LIVE, PRODUCTION, DEPLOYED, or PUBLIC SERVICE as positive claims. The museum truth panel states PUBLIC SERVICE / PRODUCTION / DEPLOYED = NO.

Each card states related approved records, evidence state, what the image demonstrates, and what it does not prove.

## Historical treatment

VIS-GW-002 is visually dashed/distinct and labelled **HISTORICAL REAL UI CAPTURE**. Required copy:

> This capture shows the earlier two-record Golden Foundation Shell. It is retained as development history and does not represent the current six-record portfolio.

## Prototype treatment

The museum contains exactly one exhibit: the Golden Website local shell.

Before interaction it shows TYPE, PUBLIC SERVICE, PRODUCTION, DEPLOYED, PUBLICATION, DATA, and TWIN LIVE RECORDS.

Interaction reuses existing local pages (Home, Portfolio, Gallery, Map foundation). No iframe.

Gated prototypes are not named as cards. The museum says additional prototypes remain behind sanitization, identity, and evidence gates.

## Cross-linking

Gallery cards link to approved portfolio pages, the six-node map, and the museum where relevant. Museum links to Home, Portfolio, Gallery, and Map. No links to private/gated operator HTML.

## Data flow

```text
Steward-approved GW-6 IDs
  → gw7_exhibits.json (six visuals + one prototype)
  → shell/data/gw-exhibits.js
  → gallery.html / museum.html
```

Browser payload uses shell-relative image URLs only. No master registry, overlay, Twin `records[]`, or Windows paths.

## Accessibility

Keyboard open (Enter/Space), Escape close, visible focus, 44px targets, reduced motion, meaningful alt text, 1440 / 768 / 390, no horizontal overflow. NVDA / VoiceOver remains a human gate before public pilot.

## Security boundaries

Private browser exposure = 0. Unapproved exhibits exposed = 0. Twin live records = 0. No credentials, IPs, telemetry, or operator dashboard HTML.

## Hard laws

```text
visual ≠ implementation
visual ≠ evidence by itself
prototype ≠ production
screenshot ≠ backend proof
historical ≠ current
local ≠ deployed
public-safe ≠ published
beautiful ≠ proven
observe → verify → suggest → human decides
readiness ≠ deploy
```
