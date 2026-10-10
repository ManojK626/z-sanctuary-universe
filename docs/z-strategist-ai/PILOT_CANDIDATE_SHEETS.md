# Pilot Candidate Sheets — Wave 3

**Posture:** Learning scope only · **not** launch approval  
**Date:** 2026-06-11

Each sheet answers the five questions from [PILOT_READINESS_FRAMEWORK.md](PILOT_READINESS_FRAMEWORK.md).

---

## 1. Z-EarthConscience (Z-PEE) — ⭐ Primary candidate

**Registry id:** `z_pee_planetary_ethics`  
**Wave 3 signal:** LEARN-READY (pending AMK gate)  
**Complexity:** ⭐ lowest

### Z-PEE · Safe for public view?

Yes — **awareness and ethics education only**. No accounts, payments, bookings, or personal data collection. Aligns with GREEN privacy on readiness card.

### Z-PEE · What would the public see?

| Surface | Content |
| ------- | ------- |
| Static ethics pages | Planetary stewardship principles; nature as teacher (non-religious) |
| Illustrative cards | Reef, ocean, legacy tree **patterns** — labeled mock / educational |
| Locked law footer | No verified impact claims; no carbon offset sales |
| What they do **not** see | Marketplace, donations, sign-up, chatbots with memory |

**Build posture:** New or curated static HTML under hub dashboard — Turtle Mode; no new APIs.

### Z-PEE · Feedback sought

- Is the tone respectful and globally accessible?
- Do readers understand this is **education**, not certification?
- Cultural sensitivity (Mauritius + global audience)
- Accessibility (language, mobile, clarity)

### Z-PEE · Risks

| Risk | Mitigation |
| ---- | ---------- |
| False environmental claims | Locked law; illustrative-only labels |
| Blur with ZILWA tourism | Separate pilot branding; no booking CTAs |
| Offset / donation creep | Explicitly out of scope; Human Gate |
| Dependency on unmerged ZILWA PRs | Use **pattern** excerpts or net-new static copy — AMK chooses |

### Z-PEE · Success looks like

- 4–8 weeks of **documented learning** (themes, quotes anonymised, AMK notes)
- Zero payment or registration triggers activated
- Decision record: continue, expand, or pause
- ZILWA field work continues **in parallel** (private listening)

---

## 2. Z-Nexus static mock — ⭐⭐ Secondary candidate

**Wave 3 signal:** LEARN-HOLD until mock law UI is designed  
**Complexity:** ⭐⭐

### Nexus · Safe for public view?

Yes — if **mock dashboard spec** is respected: no live telemetry, no API connectors, no financial or labor authority claims.

### Nexus · What would the public see?

| Surface | Content |
| ------- | ------- |
| Static mock nodes | Land health, water stress, labor strain, extraction pressure — **illustrative** |
| Education cards | Youth-appropriate prompts — no political instruction |
| Visible disclaimer | Research-inspired ≠ certified; mock ≠ measured |

Per [Z_NEXUS_ENGINE_MOCK_DASHBOARD_SPEC.md](../z-nexus-engine/Z_NEXUS_ENGINE_MOCK_DASHBOARD_SPEC.md).

### Nexus · Feedback sought

- Do viewers understand mock vs real data?
- Is labor-energy framing dignified (Z-CIVD alignment)?
- Cognitive load — too dense for mobile?

### Nexus · Risks

| Risk | Mitigation |
| ---- | ---------- |
| Perceived scientific authority | Banner + locked law on every view |
| Policy / political interpretation | Ethics pack; no sandbox runtime |
| Streamlit creep | Future HOLD doc remains HOLD |

### Nexus · Success looks like

- Mock UI comprehension test (informal)
- No reader believes data is live satellite/ILO verified
- AMK approves or rejects static HTML phase

---

## 3. Z-Academy (awareness only) — ⭐⭐ Tertiary candidate

**Wave 3 signal:** LEARN-HOLD if youth-facing without child-safety charter  
**Complexity:** ⭐⭐

### Academy · Safe for public view?

**Conditional yes** — workshop-style **awareness** pages only; build gate **PREPARE ONLY**; no marketplace, no enrollments.

### Academy · What would the public see?

| Surface | Content |
| ------- | ------- |
| Static workshop narratives | Master of Life **pattern** — stories, reflection prompts |
| No | Grades, accounts, certificates, payments |

### Academy · Feedback sought

- Age-appropriateness if youth see pages
- Clarity that this is not formal education accreditation

### Academy · Risks

| Risk | Mitigation |
| ---- | ---------- |
| Child safety | Child-safety charter before youth marketing |
| Accreditation implied | Explicit non-accreditation language |
| Academy product creep | HOLD on Stage 2+ until `docs/z-academy/` exists |

### Academy · Success looks like

- Adult-audience pilot only **or** charter signed for youth
- Learning receipt; no enrollment funnel

---

## 4. ZILWA Living Experiences — ⭐⭐⭐⭐ Not Wave 3 pilot

**Wave 3 signal:** LEARN-NO (for public pilot now)  
**Complexity:** ⭐⭐⭐⭐

### ZILWA · Why not yet

Needs: listening completion, community engagement, hospitality validation, cultural stewardship, tourism ecosystem mapping.

### ZILWA · Mauritius knowledge (private, high value)

- Field interviews
- Worker and elder stories (consent-gated)
- Tourism ecosystem notes

These are knowledge assets — they do not require public HTML pilot to be valuable.

### ZILWA · Path to future pilot readiness

ZILWA 2B listening receipt → AMK scope cut → standalone tourism doctrine → **then** revisit Wave 3 sheet.

---

## 5. Compassion Wellness — ⭐⭐⭐⭐⭐ Not Wave 3 pilot

**Wave 3 signal:** LEARN-NO  
**Complexity:** ⭐⭐⭐⭐⭐

### Wellness · Why not

Wellness lanes drift toward health, coaching, advice, mental wellbeing — Legal Review **AMBER** is correct brake.

### Wellness · Wave 3 rule

No public pilot until `docs/compassion-wellness/` umbrella charter and explicit **non-clinical** boundaries exist.

---

## AMK decision table (Wave 3)

| Choice | Next doc action |
| ------ | --------------- |
| Approve Z-PEE pilot learning scope | AMK signs pilot scope paragraph in gate log; static HTML phase may be chartered separately |
| Prefer Nexus mock first | Prioritise mock UI disclaimer design |
| Defer all public view | Remain Hold; continue Mauritius private listening |
| Merge PR #20 | Separate decision — strategist docs do not auto-approve merge |

**Human Gate:** Hold until AMK selects one sheet (or defers).
