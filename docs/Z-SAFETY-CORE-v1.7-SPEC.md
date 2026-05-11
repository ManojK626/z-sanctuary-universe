# Z-Safety Core v1.7 — spec pack (advisory)

**Status:** BUILD NOW (supportive-only).
**Authority:** Build Gate Matrix + Hierarchy Chief + New Module Discipline.

## 1) Purpose

Provide a humane, low-friction safety layer for emotional/creator flows before deeper expansion.
This module is supportive guidance and escalation signposting, not diagnosis, therapy, legal judgment, or emergency-response replacement.

## 2) Scope in v1.7

- Lifeline Flow Lite UI (web route)
- Supportive grounding sequence (pause -> breathe -> stabilize -> next step)
- Escalation signpost panel (regional placeholders, user-provided trusted contact)
- Clear advisory language on every step
- Integration links to MirrorSoul and account experience

## 3) Explicit non-goals

- No clinical claims
- No people scoring
- No auto-calling authorities
- No hidden uploads or new sensitive storage paths

## 4) Safety copy rules

- Use: “support”, “reflect”, “possible next step”, “consider contacting”
- Avoid: “diagnose”, “cure”, “guarantee”, “official emergency service”
- Every intense-state screen includes “this is not emergency care”

## 5) Integration points

- `/safety` (Lifeline Flow Lite)
- `/mirrorsoul` (optional reflective path)
- `/account` and `/account/experience` (optional continuity, no mandatory profile)

## 6) Promotion checks

Required before promotion from Lite:

```text
npm test
npm run build
npm run verify:full:technical
```

Plus human review of high-risk wording.

## 7) Future increments (prepare-only)

- Region-specific hotline bundles via approved policy source
- Optional “trusted contacts” with explicit consent
- Escalation telemetry only after legal/privacy sign-off

**Last reviewed:** 2026-04-27
