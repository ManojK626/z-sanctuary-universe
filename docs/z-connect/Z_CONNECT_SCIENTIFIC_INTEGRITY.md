# Z-Connect — Scientific Integrity

**Purpose:** Separate **evidence-informed preference modeling** from **entertainment** and **pseudoscience** — preserving user trust and reducing legal/ethics risk.

**Owner:** AMK-Goku  
**Status:** Binding on all Z-Connect design and implementation

---

## Principle

```text
Self-reported preferences and evidence-informed frameworks = OK (with clear labeling)
Astrology / numerology as scientific predictors = NOT OK
Brain capability tiers as objective measures = NOT OK
Guaranteed compatibility = NOT OK
```

---

## Three lanes (must stay distinct in UI and data model)

| Lane | Label in product | May influence matching? |
| ---- | ---------------- | ----------------------- |
| **Preferences** | “Your preferences” | Yes — user-stated dimensions only |
| **Evidence-informed self-assessment** | “Self-assessment (not a diagnosis)” | Yes — as user-owned input, with uncertainty |
| **Entertainment** | “For fun · not scientific” | Only if user opts into **fun filters** with persistent disclaimer |

---

## Allowed frameworks (preference / self-report)

Present as **user choices** or **optional questionnaires**, not as hidden scoring of human worth:

| Framework | Usage |
| --------- | ----- |
| Big Five (OCEAN) | Interest and self-description; cite as self-report unless using a licensed instrument with proper validation disclosure |
| Attachment style | **Preferences** and reflection prompts — not clinical attachment diagnosis |
| Love languages | User-selected communication preferences |
| Communication style | User-stated |
| Conflict resolution preferences | User-stated |
| Values and life goals | User-stated |
| Lifestyle and interests | User-stated |
| Emotional intelligence self-assessments | Self-reflection only — not ability ranking |
| Creativity / learning preferences | Self-stated |

---

## Entertainment lane (optional)

Users **may** share:

- zodiac sign  
- astrology interests  
- numerology  
- casual personality quizzes  

**Requirements:**

- Explicit opt-in  
- Persistent badge: **“Entertainment · not used for scientific matching”** (default)  
- Separate opt-in if user wants “fun compatibility filters” — still no certainty language  
- Never merged silently into primary compatibility narrative  

---

## Forbidden presentations

| Claim | Why forbidden |
| ----- | ------------- |
| “Your brains are 94% compatible” | Implies objective neurometric truth |
| “Astrologically destined match” | Pseudoscience presented as fact |
| “High/low cognitive compatibility tier” | Dehumanizing; not established for relationship outcome |
| “Guaranteed long-term success” | Cannot be promised |
| Single soulmate score | Reductive; manipulative potential |

---

## AI insight language

**Prefer:**

- “You both mentioned enjoying…”  
- “You might enjoy discussing…”  
- “Different communication styles — here are gentle prompts…”  

**Avoid:**

- “Perfect match”  
- “Destined”  
- “Scientifically proven pair” (unless citing a specific peer-reviewed study in context — generally avoid in product UI)

---

## Regulatory and ethics posture

- Personality and relationship products touch **privacy**, **consumer protection**, and sometimes **health-adjacent** claims — legal review before marketing copy  
- Minors: highest restriction — separate charter  
- Hub alignment: same discipline as VILE ethical AI charter and 14 DRP  

---

## Verification (future)

When runtime exists:

- Schema validation on insight payloads (no forbidden claim fields)  
- Shadow safety stage blocks manipulative or pseudoscientific marketing strings  
- DRP review for sacred categories (child data, health-adjacent copy)  

Phase 1: this document is the **source of truth** until platform contracts (Phase 1.5) encode shapes.
