# Privacy and User Data Ownership

**Phase:** 0 — Data law doctrine (no storage implementation)

---

## Core law

**The user owns their data.** The ecosystem may process data only as a **steward** under explicit consent and published policy.

---

## User rights

| Right | Description |
| ------------------------ | ------------------------------------------------------------------------------------------------------ |
| **Ownership** | Wellness notes, preferences, complaints, and animal profiles belong to the user or designated guardian |
| **Control sharing** | Per-field or per-document sharing with practitioner, caregiver, or family |
| **Control deletion** | Export and delete requests honored within defined retention law (legal hold excepted by human process) |
| **Choose privacy level** | See levels below — default to least exposure |
| **Optional cloud sync** | Off by default; local-first recommended |
| **No sale** | Personal data is never sold or rented |
| **No hidden analytics** | No secret telemetry or behavioral profiling |
| **No secret recordings** | Audio/video only with explicit, session-scoped consent |
| **No forced biometrics** | Face, voiceprint, or gait ID never required for basic wellness |

---

## Privacy levels

| Level | Data collected | Sharing | AI / cloud |
| -------------------------- | ------------------------------------------------------------------ | ------------------------------------ | -------------------------------------------------------------- |
| **Minimal Mode** | Name alias, session date, allowed service type | None beyond practitioner of record | Local notes only; no cloud |
| **Wellness Mode** | Preferences, atmosphere presets, follow-up reminders | Practitioner + user only | Optional encrypted sync |
| **Advanced Insight Mode** | Patterns across sessions (hydration reminders, stretch logs) | User-approved aggregates | AI summarize with human-visible outputs |
| **Emergency Support Mode** | Emergency contacts, location hint, medical **notes user provides** | Contacts per user-enabled rules only | **No** auto-dispatch; user rules trigger human-reviewed alerts |

Escalation to a higher level requires **explicit opt-in** and plain-language explanation.

---

## Local-first recommendation

- Session notes and animal profiles should default to **device-local** storage in early phases
- Cloud backup is **optional**, encrypted, and user-keyed where technically feasible (future phases)
- Practitioners receive **minimum necessary** copies for the session at hand

---

## Forbidden

- Selling or licensing personal wellness data
- Hidden analytics pixels or cross-site tracking
- Secret audio/video capture
- Forced biometric enrollment for booking
- Using wealth or donation history to change safety response tier

---

## Cross-links

- [AI_OBSERVATION_AND_ANALYSIS_LIMITS.md](AI_OBSERVATION_AND_ANALYSIS_LIMITS.md)
- [HOME_VISIT_AND_REGISTRATION_PROTOCOL.md](HOME_VISIT_AND_REGISTRATION_PROTOCOL.md)
- Hub: [Z-GITHUB-AI-COMMS-PRECAUTIONS.md](../Z-GITHUB-AI-COMMS-PRECAUTIONS.md)
