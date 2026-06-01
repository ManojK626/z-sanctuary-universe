# Home Visit and Registration Protocol

**Phase:** 0 — Protocol design only (no booking runtime)

---

## Registration tiers

### Minimal required registration

- Display name (or chosen alias)
- Contact method (email or phone — at least one)
- Service type requested (wellness / elder support / animal comfort — from allowed list)
- Consent to [PRIVACY_AND_USER_DATA_OWNERSHIP.md](PRIVACY_AND_USER_DATA_OWNERSHIP.md) tier selected
- Agreement to [COMPASSION_WELLNESS_CHARTER.md](COMPASSION_WELLNESS_CHARTER.md) boundaries

### Optional higher-trust verification

Used **only when necessary** for:

- Home visits
- Vulnerable users (elder, disabled, high dependency)
- Recurring in-home care
- Animal handover or foster transition
- Emergency backup contact enrollment

**Data minimization is mandatory** — collect the least data that satisfies the trust level.

| Verification element | When optional      | When may be required                                  |
| -------------------- | ------------------ | ----------------------------------------------------- |
| Phone/email OTP      | Always recommended | High-trust home visit                                 |
| Government ID        | Default **off**    | Repeat home visits, animal handover, operator charter |
| Address proof        | Default **off**    | Recurring home service in pilot phase                 |
| Reference contact    | Optional           | Elder recurring care                                  |

ID verification **may** be used only when necessary — never as default for all users.

---

## Emergency contact option

- User may add one or more emergency contacts
- Contacts are **not** auto-notified unless user enables rules (see privacy levels)
- Clear copy: ecosystem is **not** an emergency medical or veterinary dispatch service

---

## Location and environment safety

**Location safety notes** (user-provided):

- Access instructions (gate, buzzer, pets on premises)
- Parking / mobility notes
- Known hazards (stairs, loose flooring, aggressive pet in another room)

**Home environment form** (pre-session):

- Room for session
- Allergies / asthma / scent sensitivity
- Other people or animals present
- Preferred temperature and lighting
- «No surprise policy» — no unannounced extra persons or services

---

## Practitioner arrival and check-in

| Step                      | Action                                                                       |
| ------------------------- | ---------------------------------------------------------------------------- |
| **Pre-arrival**           | User receives expected arrival window (not exact tracking by default)        |
| **Arrival**               | Practitioner checks in via agreed channel (SMS/app in future phase)          |
| **Identity confirm**      | User confirms practitioner matches booked profile (human visual / code word) |
| **Pre-session agreement** | Allowed services reconfirmed; pressure and stop signals reviewed             |
| **During**                | Stop / pause / reduce pressure signals honored immediately                   |
| **Safe exit**             | Session end confirmed; user not pressured for gratitude or upsell            |

---

## Pre-session agreement form

Must include:

- Services **allowed** today (wellness massage, stretching, elder companionship check-in, pet comfort grooming support, etc.)
- Services **not allowed** (medical treatment, sexual contact, undisclosed recording, etc.)
- Right to end session at any time
- Data retention choice for session notes

---

## Allowed / not allowed services (summary)

| Allowed (comfort/support)                                                               | Not allowed                        |
| --------------------------------------------------------------------------------------- | ---------------------------------- |
| Relaxation massage, stretching guidance                                                 | Diagnosis, prescription, injection |
| Elder conversation and safety check                                                     | Clinical nursing without license   |
| Pet brushing, calm presence, comfort routines                                           | Veterinary surgery or treatment    |
| Atmosphere setup per [ATMOSPHERE_AND_SENSORY_LAYER.md](ATMOSPHERE_AND_SENSORY_LAYER.md) | Hidden camera or microphone        |

---

## «No surprise policy»

- No unlisted practitioner substitutions without user consent
- No add-on services without explicit same-session agreement
- No sudden price or gratitude demands (Phase 0: no pricing layer at all)

---

## Cross-links

- [PRIVACY_AND_USER_DATA_OWNERSHIP.md](PRIVACY_AND_USER_DATA_OWNERSHIP.md)
- [TRUST_AND_FEEDBACK_ENGINE.md](TRUST_AND_FEEDBACK_ENGINE.md)
- [ACCESSIBILITY_SIGN_LANGUAGE_AND_LIFEFORMS_COMMUNICATION.md](ACCESSIBILITY_SIGN_LANGUAGE_AND_LIFEFORMS_COMMUNICATION.md)
