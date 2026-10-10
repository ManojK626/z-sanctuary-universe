# GW-3 — Golden Foundation Shell

**Phase:** Golden Website GW-3
**Date:** 2026-08-27
**Authority:** GW-2A accepted. Both foundations `APPROVED_PUBLIC_SAFE`. Publication **NOT_YET_AUTHORIZED**.
**Open:** `docs/golden-website/shell/index.html` (local static files)

This is a **local visual shell**, not a public site, deploy, or Twin insert.

## Information architecture

```text
Home
  → What is Z-Sanctuary?     (core.html)
  → How do I explore it?     (navigator.html)
  → Show Me What's Real      (evidence mode on every page)
  → Future surfaces          (locked)
```

Only two Steward-approved records are visible.

## Two-record scope

| Canonical ID | Public name | Evidence | Gate | Production |
| ------------ | ----------- | -------- | ---- | ---------- |
| `z_sanctuary_core` | Z-Sanctuary Core | QUALIFIED | PASS | No |
| `univ_workstation_navigator` | Universal Workstation Navigator | SEALED | PASS | No |

The other 158 overlay records are not loaded.

## Data flow

```text
Approved capsules
  → gw_approved_public_safe_adapter.json
  → shell/data/gw-approved-public-safe.js
  → Golden Foundation Shell UI
```

The Public Knowledge Twin `records[]` stays **empty**. The shell is designed to consume the same public-safe shape later. Browser runtime does **not** read private registries.

Public UI truth is downstream of the adapter. The approved Core sentence is:

> Z-Sanctuary is a governed multi-project AI development ecosystem with implemented and verified components, while many broader capabilities remain under controlled development.

## Evidence presentation

Site-wide vocabulary: VERIFIED, SEALED, QUALIFIED, CONCEPT, HOLD, CLOSED.

Classification describes current support. It is not a quality badge, commercial rating, or deployment status.

QUALIFIED is not rewritten as VERIFIED.

Evidence mode (Show Me What's Real) highlights the two records and their limits. It prefers evidence over spectacle.

## Navigator preview

A **sanitized** two-item rail previews read-only exploration of the approved records only. It does not iframe or link operator dashboard HTML. It is not Golden Universe Map. It has no execution authority.

## Locked future surfaces

Golden Universe Map, Visual Gallery, Prototype Museum, Golden Guide AI, Portfolio Atlas, Evidence Atlas, Human & Planet Impact, Business & Industry, Partners & Investors.

Each shows: **Coming through evidence gates**. No private data.

## Security / public boundary

- No local/private IPs
- No secrets or env
- No internal filesystem paths
- No private telemetry or privileged APIs
- No iframe of unsanitized hub HTML
- Local-only; publication still NOT_YET_AUTHORIZED

## Accessibility posture

- Skip link
- Visible focus; `main` is a skip target (`tabindex="-1"`)
- `prefers-reduced-motion` disables animation
- Locked items are a labelled list, not dead buttons
- Evidence mode uses `aria-pressed` / `aria-expanded` / a live status
- Contrast: light text on deep space, gold for emphasis
- No flashing or fake live counters
- Interactive pass: GW-3A file:// Chromium (`node scripts/z_gw_3a_visual_pass.mjs`)

## Hard laws

public-safe ≠ published · prototype ≠ production · QUALIFIED ≠ VERIFIED · working local UI ≠ live service · evidence PASS ≠ deployment · visual beauty ≠ factual proof
