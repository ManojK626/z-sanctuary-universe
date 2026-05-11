# Phase 2.1 — Adaptive visual Sanctuary (Z-QUESTRA)

## Purpose

Evolve Z-QUESTRA into a **Z-Sanctuary-compatible workstation shell** using **design language, accessibility, and route metadata only**. This phase keeps the app **technically independent**: no imports from Z-Sanctuary packages, no hub APIs, no runtime orchestration.

## What ships

| Layer | Detail |
| --- | --- |
| Age / mode themes | Kids, Teens, Adults, Enterprise — palette, radius, type scale, glow discipline |
| Comfort bar | Text size, contrast, motion, reading, brightness, audio readiness, panel layout |
| Device memory | Optional checkbox: age + Comfort in **localStorage** only; off clears — no hub sync |
| Panel protocol | `PanelFrame` + `sanctuaryRouteMap.js` metadata (`local_only`, roles, route keys) |
| Zuno-style notice | Local Guardian mode; no external bridge |
| Tokens | `themeTokens.js` — Guardian / Blueprint / Observe / Reflect / Learn / Safety accents |

## Visual rules

- Text uses warm off-whites, not harsh pure white.
- Neon accents stay **subtle**; **Calm** contrast reduces glow; user **Reduced** motion plus `prefers-reduced-motion` limits animation.
- No flashing patterns or seizure-risk strobing.

## Forbidden (still)

Live provider calls, hub imports, Z-MAOS, Zuno orchestrator runtime, auth backends, external accessibility APIs, analytics, payments, voice/STT/TTS engines, drag-and-drop shell.

## Acceptance

Age mode changes the theme; Comfort bar changes typography, contrast, motion, dyslexia-friendly spacing, brightness modes, and panel layout; **Focus mode** dims non-primary panels while keeping them mounted; optional **Remember on this device** persists theme + comfort locally when checked; panels show distinct accents and collapsible sections; route map exists as local data only.
