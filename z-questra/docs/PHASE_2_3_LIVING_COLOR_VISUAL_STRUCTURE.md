# Phase 2.3 — Living color panels + visual structure mapper

## Purpose

Evolve Z-QUESTRA into a **departmental, colorful workstation**: semantic text hues, panel identities, gentle gradient titles, and a **Visual Structure View** that lays out meaning as a flow — **UI-only**, no AI parsing and no hub runtime.

## What ships

| Layer | Detail |
| --------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Color identity | `colorIdentityTokens.js` — named tones (gold, aqua, mint, lavender, …); body copy uses **tinted neutrals** per age mode |
| Panel map | `panelVisualMap.js` — department, accent/heading/highlight/line tones, guardian level, motion hint |
| Gradient titles | `GradientTitle.jsx` — slow gradient (~26s loop); **off** for reduced motion, photophobia, or user Reduced |
| Highlights | `HighlightText.jsx` — pills, emphasis, bands |
| Structure UI | `VisualStructurePanel.jsx` + `StructureFlowLine.jsx` — sample flow only |
| Panel chrome | Guardian ribbon (green → amber → red, **static**), colored headings/highlights |

## Design rules

- **No pure `#fff`** as default identity text; high contrast uses **warm** bright text (`hsl(48 …)`), not neutral 100%.
- **Body** stays calm and readable; **rainbow applies** mainly to headings, chips, highlights, labels — not every word.
- **Motion**: gradient shifts slowly; **no flashing**. OS `prefers-reduced-motion`, Comfort **Reduced**, or **Photophobia** disables animation and softens saturation.
- **Photophobia**: dataset `data-zq-brightness="photophobia"` reduces ribbon opacity and gradient motion.

## Forbidden (still)

Backend, auth, new persistence beyond existing opt-in remember checkbox, LLM, external APIs, graph/canvas libraries, drag-drop engine, live Z-Sanctuary bridge, analytics.

## Acceptance

Distinct panel colors; gradient platform title; Visual Structure disclaimer visible; `npm test` passes; Kids / Enterprise modes remain readable.
