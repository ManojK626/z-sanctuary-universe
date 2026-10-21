# Z-GOLDEN-DOORWAY-A11Y-HUMAN-VALIDATION-PREP-1

**Status:** PREP_ONLY  
**Human session:** **NOT_RUN**  
**GW-13 blocker:** still `HUMAN_SCREEN_READER_VALIDATION_PENDING`  
**Canonical fill-in form:** [GW_13_HUMAN_SCREEN_READER_ACCEPTANCE.md](GW_13_HUMAN_SCREEN_READER_ACCEPTANCE.md) (blank)  
**Structured evidence sheet:** [Z_GOLDEN_DOORWAY_A11Y_HUMAN_EVIDENCE_TEMPLATE.md](Z_GOLDEN_DOORWAY_A11Y_HUMAN_EVIDENCE_TEMPLATE.md) (blank)  
**Freeze:** [data/golden-website/z_golden_doorway_a11y_human_validation_prep_1.json](../../data/golden-website/z_golden_doorway_a11y_human_validation_prep_1.json)

This slice prepares the test. It does **not** conduct, simulate, or fabricate a screen-reader session.

```text
AUTOMATED CHECK ≠ HUMAN SCREEN-READER EVIDENCE
NO ISSUE OBSERVED ≠ ACCESSIBILITY CERTIFIED
```

GW-13A CLOSED. GW-14 CLOSED. Publication unauthorized. Deployment unauthorized. No partners. No telemetry. No domain work.

## Why PREP

Cursor cannot honestly clear Gate 6. Machine keyboard / skip / 44px / live regions already **PASS** under GW-13. That is not NVDA or VoiceOver.

A finding in the human test is not a failed Golden Website. Turtle Mode would then open **A11Y-FIX-ONLY** on observed problems, then retest. No unrelated redesign.

## Frozen surface

Evaluate **this** local shell, opened as files:

`docs/golden-website/shell/index.html`

SHA-256 of every HTML/CSS/JS file under that folder is frozen in the JSON. If those hashes change before the human session, record a freeze mismatch and do not mix results from two builds.

Do not publish. Do not use a public host.

## How to run (human)

1. Preferred first pass (Windows): **NVDA** + Chrome or Edge.  
2. Optional second pass: VoiceOver + Safari on iPhone or iPad.  
3. Prefer an experienced screen-reader user. A sighted person switching NVDA on is not equivalent to lived SR usability.  
4. Follow the representative journey. Preserve actual words. Record friction even if the journey completes.  
5. Fill the GW-13 form **and** the evidence template. Do not invent an accessibility score.

## Representative journey (frozen order)

```text
Home (index.html)
→ Portfolio
→ Evidence Mode (Show Me What's Real)
→ Map
→ Gallery
→ Museum
→ Golden Guide (NORMAL GUIDE)
→ Challenge Z-Sanctuary
→ Challenge the AI (Integrity page and/or Integrity mode)
→ Partners & Investors (Gateway)
```

## What to observe

| Area | Ask |
| --- | --- |
| Keyboard-only | Can the journey be completed without a pointer? Skip link reaches `main`? |
| Headings | Do h1/h2 sequences make sense as a list? |
| Landmarks | Are header, `nav` (Primary), `main`, footer understandable? |
| Accessible names | Do links/buttons match what they do? (Source *expectations* below are markup, not human proof.) |
| Focus order | Does focus follow a sensible reading order? Gallery/map close return focus? |
| Forms | Guide: label “Your question”, submit “Ask Z-Sanctuary”, mode radios announced? |
| Status | Evidence mode and Guide answers announced (`aria-live`)? |
| Images | Gallery alts communicate meaning, not empty decoration? |
| Zoom/reflow | Usable at large text / narrow width if tester can check? |
| GW-13 blocker | Lived NVDA/VoiceOver on this path — the only remaining named Gate 6 item |

## Source markup expectations (not human evidence)

From the frozen HTML (class `SOURCE_MARKUP_EXPECTATION_NOT_HUMAN_EVIDENCE`):

- Skip: `Skip to content`
- Nav: `aria-label="Primary"`
- Evidence control: `Show Me What's Real`
- Guide modes: `NORMAL GUIDE` / `CHALLENGE Z-SANCTUARY` / `CHALLENGE THE AI`
- Question label: `Your question`
- Submit: `Ask Z-Sanctuary`
- Gallery close: `Close large view`
- Map close: `Close details`

The human records what the screen reader **actually** said.

## Automated vs human

| Layer | State now |
| --- | --- |
| GW-13 machine a11y (keyboard, skip, 44px, live regions, reduced motion, overflow) | PASS |
| Human NVDA / VoiceOver | **NOT_RUN** |
| Accessibility certified | **false** |

Do not treat Chromium automation as a screen reader.

## After the session

| Human overall | Next |
| --- | --- |
| PASS | GW-13A closure **review** only — still not deploy |
| PASS WITH ISSUES | Classify BLOCKERS / MAJOR / MINOR; friction stays evidence |
| FAIL | **A11Y-FIX-ONLY** on observed issues, then human retest |

READY still would not mean DEPLOY.

## Still HOLD / SLEEP

NOW is this human validation. NEXT remains GW-0A CONCEPT vs shell. LATER domain/host/telemetry. HOLD Magnets / Genius / OmniEchoHeartcore.com. SLEEP production Guide and Cycle Observe as properties. **No partner yet.**
