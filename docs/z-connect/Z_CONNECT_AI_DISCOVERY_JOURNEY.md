# Z-Connect — AI Discovery Journey

**Status:** Signature concept · specification only  
**Owner:** AMK-Goku  
**Posture:** No runtime until chartered · Merge Hold

---

## Problem

Long static questionnaires feel cold, incomplete, and easy to game. They also hide **values and communication style** behind checkbox fatigue.

---

## Idea

An **AI Discovery Journey** — a natural, consent-based conversation over time — replaces or supplements forms by inviting users to share dreams, hobbies, communication style, values, and preferences in a **friendly, paced dialogue**.

```text
Form checklist alone     →  thin profile
Discovery Journey + consent →  richer, human profile
```

The AI **listens and reflects**; it does **not** decide who users should meet.

---

## Principles

| Principle | Detail |
| --------- | ------ |
| Consent-paced | User can pause, skip, or delete any journey segment |
| No interrogation | Warm tone; no pressure to disclose trauma or legal-sensitive data |
| Transparency | “This helps your profile — you can edit or remove it anytime” |
| No hidden scoring | Journey extracts **user-approved** profile dimensions — not secret tiers |
| Scientific integrity | Journey must not steer users toward astrology/brain-tier narratives as “truth” |
| Shadow on all generations | When runtime exists, every AI utterance passes Shadow pipeline |

---

## Journey flow (illustrative)

```text
Welcome + consent
  → Interests & passions (light)
  → Communication style (preferences)
  → Values & life goals (optional depth)
  → Relationship expectations (user-defined)
  → Review & edit summary (user approves what is saved)
  → Optional entertainment lane (astrology etc.) — clearly labeled
```

User **approves** the structured summary before it becomes profile input.

---

## What the AI may do

- Ask open questions and follow-ups  
- Summarize themes in plain language  
- Suggest profile tags **for user confirmation**  
- Offer conversation starters for **future** matches (after user opts into matching features)  

---

## What the AI must not do

- Guarantee compatibility or destiny  
- Diagnose personality disorders or attachment pathology  
- Pressure disclosure of address, financial details, or identity documents in chat  
- Auto-enroll user in matching without explicit step  
- Store journey audio/text beyond stated retention without consent log  

---

## Data and privacy

- Journey transcripts: encrypted at rest (implementation phase)  
- Retention policy: user-visible  
- Export and delete: must include journey-derived profile fields  
- Consent log entry per journey session  

---

## Differentiation (ethical)

Matching through **meaningful conversation** rather than forms alone — while keeping:

- multi-dimensional insights (not one score)  
- entertainment lane separate  
- human choice at every commitment step  

---

## Implementation phases (not started)

| Phase | Deliverable |
| ----- | ----------- |
| 1.5 | JSON schemas: journey session, approved profile delta, consent record |
| 2A | Reuse `zuno-shadow` + `zuno-drp` — no duplicate engines |
| 2C | Mock UI: journey simulator (read-only, `_non_executable` fixtures) |
| 3+ | Runtime with AMK gate + green receipt |

---

## Related

- [Z_CONNECT_MASTER_BUILD_CHARTER.md](Z_CONNECT_MASTER_BUILD_CHARTER.md)  
- [Z_CONNECT_SCIENTIFIC_INTEGRITY.md](Z_CONNECT_SCIENTIFIC_INTEGRITY.md)  
- [vile/SHADOW_VALIDATION_PIPELINE.md](../vile/SHADOW_VALIDATION_PIPELINE.md)
