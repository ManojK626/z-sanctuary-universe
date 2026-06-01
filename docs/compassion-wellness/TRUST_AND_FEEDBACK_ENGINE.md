# Trust and Feedback Engine

**Phase:** 0 — Design doctrine (no live engine)
**Principle:** Multi-dimensional trust — not star ratings alone

---

## Purpose

Build **fair, transparent, human-governed** trust between users, practitioners, animal caregivers, and the ecosystem — without public shaming, automated punishment, or AI-only judgment.

---

## Multi-dimensional feedback

Feedback captures **dimensions**, not a single score:

| Dimension             | Examples                                             |
| --------------------- | ---------------------------------------------------- |
| **Respect**           | Dignity, boundaries honored, tone                    |
| **Communication**     | Clarity, listening, language accessibility           |
| **Comfort**           | Felt safe, pace appropriate                          |
| **Hygiene**           | Clean space, tools, linens                           |
| **Pressure accuracy** | Too light / too firm / just right (wellness context) |
| **Safety**            | Hazards reported, stop signals honored               |
| **Punctuality**       | Arrival, session length, follow-up timeliness        |

Optional free-text with **consent** for sharing scope (private to platform / shared with practitioner / anonymized aggregate only).

---

## Complaint categories

| Level        | Examples                                                                  | Default handling                                                               |
| ------------ | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| **Minor**    | Late arrival, preference mismatch, small communication issue              | Log → practitioner notified → human review if pattern repeats                  |
| **Moderate** | Repeated boundary issues, hygiene concern, misleading service description | Human triage within defined SLA; pause new bookings pending review             |
| **Critical** | Assault allegation, abuse of vulnerable user/animal, theft, coercion      | Immediate human escalation; preserve evidence per policy; **no** automated ban |

---

## Complaint triage flow

```text
Report submitted
    → AI organizes (categories, timeline, attachments metadata only in future phases)
    → Human reviewer assigned
    → Outcome: educate / mediate / suspend pending investigation / escalate to authorities (human decision)
    → No automatic punishment
```

**AI may:** sort fields, suggest category, highlight missing facts, draft neutral summaries for reviewers.
**AI must not:** determine guilt, publish accusations, or apply penalties.

---

## Trust profiles

| Profile                   | Contents (conceptual)                                                                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Practitioner**          | Verified training declarations (self-attested until chartered verify), dimension averages, complaint history (governed visibility), appeal status |
| **User**                  | Reliability (no-show, respectful conduct), **not** a “guilt score”                                                                                |
| **Animal caregiver**      | Foster/rehome reliability, handover documentation quality, follow-up completion                                                                   |
| **Follow-up reliability** | Did agreed check-ins occur (human wellness, elder, animal)                                                                                        |

All profiles: **appealable**, **auditable**, **no hidden blacklist**.

---

## Fake review detection (concept)

Future assistive signals only:

- Pattern anomalies (burst ratings, duplicate device fingerprints) → **flag for human review**
- Never auto-hide legitimate critical feedback
- Never auto-publish defamatory content

---

## Forbidden

- Public shaming or “wall of shame”
- Automated guilt scoring or permanent AI ban
- Hidden blacklists without appeal path
- AI-only judgment on complaints
- Retaliation encouragement against reporters

---

## Cross-links

- [COMPASSION_WELLNESS_CHARTER.md](COMPASSION_WELLNESS_CHARTER.md)
- [AI_OBSERVATION_AND_ANALYSIS_LIMITS.md](AI_OBSERVATION_AND_ANALYSIS_LIMITS.md)
- [FOLLOW_UP_AND_CONTINUITY_OF_CARE.md](FOLLOW_UP_AND_CONTINUITY_OF_CARE.md)
