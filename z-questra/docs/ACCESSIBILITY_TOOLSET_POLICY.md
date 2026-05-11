# Accessibility toolset policy (Phase 2.1)

## Scope

Frontend-only controls in the **Comfort bar**. Optional **Remember on this device** persists Comfort + age mode in **browser localStorage** only when the user checks the box; no hub sync. No external accessibility APIs, no cloud services, no analytics.

## Controls

| Control | Behaviour |
| --- | --- |
| Text size | Scales root relative size (Small / Medium / Large / XL) |
| Contrast | Calm (reduced glow), Neon (moderate glow), High contrast (strong fg/bg, minimal glow) |
| Motion | On vs Reduced — adds `zq-reduced-motion`; OS `prefers-reduced-motion` trims transitions globally |
| Reading | Normal vs Dyslexia-friendly — spacing + no faux italics on highlights |
| Brightness | Normal, Low light (darker surfaces), Photophobia safe (softer text, minimal glow) |
| Audio readiness | Captions emphasis vs read-aloud-ready labels (UI only; no TTS) |
| Panel view | Normal grid, Wide shell, Focus mode (dims non-primary panels; primary = guidance lane) |

## Photophobia-safe rules

- Reduce edge glow and avoid bright white fills.
- Prefer muted surfaces and slightly desaturated text.
- Avoid rapid luminance changes; respect reduced motion.

## Limits

This is **not** a medical device and not a substitute for OS-level assistive tech. A future chartered bridge may integrate hub-approved patterns — not in this phase.
