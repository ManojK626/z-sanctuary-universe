# Z-Connect — Progressive Discovery

**Status:** Signature concept · specification only  
**Owner:** AMK-Goku  
**Version:** 1.0 (locked with Architecture Decisions v1)

---

## Principle

The platform does **not** assume it knows someone after a single questionnaire.

Understanding **deepens over time** — only from information the user **intentionally shares**, with **review and approval** at each stage.

```text
Day 1   → Initial profile (essentials + consent)
Week 1  → Deeper preferences (optional prompts / Discovery Journey)
Month 1 → Refined understanding (user approves summary updates)
Ongoing → User reviews, corrects, or deletes any AI-derived theme
```

The AI **never** silently upgrades its model of a user from passive behaviour alone (no covert scraping of messages for profiling without explicit charter).

---

## Timeline (illustrative)

| Phase | User experience | System behaviour |
| ----- | --------------- | ---------------- |
| **Day 1 — Initial profile** | Short onboarding; consent screens | Store only explicit fields; Connection Confidence mostly “limited” / “learning” |
| **Week 1 — Deeper preferences** | Optional [AI Discovery Journey](Z_CONNECT_AI_DISCOVERY_JOURNEY.md) segments | Propose tags; user approves before save |
| **Month 1 — Refined understanding** | “Review your profile themes” notification (opt-in) | Show diff of proposed updates; user accepts or rejects each |
| **Ongoing** | Edit profile anytime | Full export/delete includes journey-derived fields |

---

## Consent rules

| Rule | Detail |
| ---- | ------ |
| Explicit share | Every new dimension requires user action to save |
| Approve summaries | Journey outputs are drafts until approved |
| Pause / skip | No penalty language for skipping |
| Delete cascade | Removing a journey session removes derived fields tied to it |
| Retention visible | User sees how long conversation summaries are kept |

---

## Connection Confidence integration

Early days → most dimensions show **Limited information** or **Still learning**.

As users share more, confidence labels may move to **Medium** or **High** **only** when tied to explicit approved fields — never because of a hidden algorithmic “confidence boost.”

See [Z_CONNECT_CONNECTION_CONFIDENCE.md](Z_CONNECT_CONNECTION_CONFIDENCE.md).

---

## Forbidden

- “Complete your profile to 100%” pressure  
- Shame for low completeness  
- Silent inference from private messages for matching (without explicit feature opt-in and charter)  
- One-shot questionnaire presented as final truth  

---

## Phase 1.5 contract targets

- `profile-snapshot` (versioned, user-approved)  
- `discovery-session` (journey transcript metadata — not full PII dump in events)  
- `profile-update-proposal` (diff awaiting approval)  
- `consent-record` (purpose, timestamp, scope)  

Roadmap: [Z_CONNECT_PHASE_1_5_ROADMAP.md](Z_CONNECT_PHASE_1_5_ROADMAP.md)

---

## Related

- [Z_CONNECT_AI_DISCOVERY_JOURNEY.md](Z_CONNECT_AI_DISCOVERY_JOURNEY.md)  
- [Z-CONNECTION-TREE-PHILOSOPHY.md](../Z-CONNECTION-TREE-PHILOSOPHY.md)
