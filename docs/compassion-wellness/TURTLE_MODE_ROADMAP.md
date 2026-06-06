# Turtle Mode Roadmap — Compassion Wellness

**Law:** Documentation before implementation. Consent before data. Human review before sensitive decisions.

---

## Phase overview

| Phase | Name | Deliverables | Forbidden |
| --- | --- | --- | --- |
| **0** | Doctrine only | This doc pack, green receipt, INDEX links | Any runtime |
| **1** | Forms & local prototype | Static consent + intake HTML/MD forms, local-only notes | Live booking, API |
| **2** | Trust & feedback prototype | Review forms, complaint categories, follow-up templates | Auto punishment, public shame |
| **3** | Wellness scheduler | Consent-based reminders, care timelines | Spam, auto emergency |
| **4** | Animal companion profiles | Animal care forms, rehoming draft workflows | Marketplace, sale payments |
| **5** | Atmosphere presets | Sensory preference UI mock | Medical claims |
| **6** | AI assistance | Summarization + safety flags only | Diagnosis, lie detection |
| **7** | Home visit pilot | Human-reviewed, limited geography, strict verify | Autonomous dispatch |
| **8** | Community support | Gratitude, donations, material aid ledger | Coercive tipping |
| **9** | Advanced accessibility | Sign language resources, gesture UI, multilingual | Certified interp replacement |
| **10** | Advanced environment intelligence | Context-aware atmosphere suggestions | Surveillance, always-on AV |

---

## Phase 0 — Doctrine only (current)

- All files under `docs/compassion-wellness/`
- Policy, scope, safety boundaries
- Receipt: [PHASE_0_GREEN_RECEIPT.md](PHASE_0_GREEN_RECEIPT.md)

**Exit criteria:** AMK / human review accepts charter and forbidden list.

---

## Phase 1 — Forms & local prototype

- Static forms mirroring registration and pre-session agreement
- Local storage only (browser or file)
- No accounts, no sync

---

## Phase 2 — Trust & feedback prototype

- Multi-dimensional review form mock
- Complaint category picker + human review queue **mock**
- Follow-up template cards

---

## Phase 3 — Wellness scheduler

- User-owned reminder calendar
- Intervals from [FOLLOW_UP_AND_CONTINUITY_OF_CARE.md](FOLLOW_UP_AND_CONTINUITY_OF_CARE.md)

---

## Phase 4 — Animal companion profiles

- Profile fields per [ANIMAL_COMPANION_CARE_AND_REHOMING.md](ANIMAL_COMPANION_CARE_AND_REHOMING.md)
- Compassionate transition checklist (draft)

---

## Phase 5 — Atmosphere presets

- UI for mood presets in [ATMOSPHERE_AND_SENSORY_LAYER.md](ATMOSPHERE_AND_SENSORY_LAYER.md)
- Allergy warnings surfaced

---

## Phase 6 — AI assistance

- Only after Phases 0–5 stable
- Enforce [AI_OBSERVATION_AND_ANALYSIS_LIMITS.md](AI_OBSERVATION_AND_ANALYSIS_LIMITS.md)

---

## Phase 7 — Home visit pilot

- Charter + legal review
- Limited area, practitioner roster human-approved
- [HOME_VISIT_AND_REGISTRATION_PROTOCOL.md](HOME_VISIT_AND_REGISTRATION_PROTOCOL.md) fully operational

---

## Phase 8 — Community support

- Optional gratitude flows
- Transparent ledger per [GRATITUDE_AND_COMMUNITY_SUPPORT_SYSTEM.md](GRATITUDE_AND_COMMUNITY_SUPPORT_SYSTEM.md)

---

## Phase 9 — Advanced accessibility

- Gesture deck, multilingual forms, caption pipelines

---

## Phase 10 — Advanced environment intelligence

- Requires consent, privacy, legal, and safety review
- No covert sensors; user-visible controls only

---

## Hub alignment

Each phase advance requires:

1. Green receipt or equivalent human sign-off
2. `npm run verify:md` on touched docs
3. No violation of [Z_SANCTUARY_BUILD_RULES.md](../Z_SANCTUARY_BUILD_RULES.md)
4. Turtle branch `cursor/zsanctuary/…` + PR — never direct `main` edits by agents
