# AetherNav — Privacy, Safety, and 14 DRP Policy

**Status:** Phase 0 policy — binds all AetherNav phases until AMK-gated charter says otherwise.

**Authority:** [Z_SWARM_14DRP_UNIVERSAL_AGENT_LAW.md](../Z_SWARM_14DRP_UNIVERSAL_AGENT_LAW.md), [Z_SANCTUARY_BUILD_RULES.md](../Z_SANCTUARY_BUILD_RULES.md), hub vault policy.

---

## Standing laws (repeat — non-negotiable)

```text
navigation assistance is not emergency authority
mock readiness does not equal production approval
user consent is required for any location or personal data
```

---

## Privacy principles

| Principle | Implementation posture |
| -------------------------------- | ------------------------------------------------------------------ |
| **Data minimization** | Store only what a phase receipt explicitly needs |
| **Local-first** | Preferences and demo graphs on operator device by default |
| **No silent collection** | No background location, motion, or mic from AetherNav surfaces |
| **Consent before personal data** | Explicit UI affordance before saving home/work/favorites |
| **No child tracking** | No minor accounts, guardian bypass, or school-route surveillance |
| **No sale of movement data** | No analytics resale, ad targeting, or federated learning on routes |

---

## Hard exclusions (enforced across phases)

- Live user location tracking (GPS, Wi‑Fi triangulation, cell tower, IP geolocation for routing).
- Child tracking or “family locator” features without separate legal charter (default: **forbidden**).
- Biometric stress detection (heart rate, gait stress, voice stress for “safer route”).
- Emergency-routing claims (“fastest to hospital”, “911 shortcut”, crisis authority UI).
- Hospital, airport, or transit **live** operational feeds without connector charter.
- Pricing, fare, or ticket **commitments** in UI or marketing copy.
- Federated learning or cross-user model training on trajectory data.
- Deployment, public endpoints, or Cloudflare production bind without green receipt chain.

---

## Safety and non-harm (14 DRP alignment)

Every AetherNav builder pass should answer the universal agent questions from [Z_SWARM_14DRP_UNIVERSAL_AGENT_LAW.md](../Z_SWARM_14DRP_UNIVERSAL_AGENT_LAW.md):

1. Where am I? (hub repo, `docs/aethernav/`, phase number)
2. What may I read? (docs, mock JSON, local demo graphs)
3. What may I change? (only what the phase charter allows)
4. What is forbidden? (see hard exclusions above)
5. Does AMK need to decide? (yes for Phase 3+ vault, Phase 4 AR, Phase 5 enterprise)

**Compassion anchor:** If routing copy pressures the user (“you must leave now”), auto-refine toward **suggest + human decides**.

---

## Accessibility

- Phase 1+ mock UI must respect [Z_UNIVERSAL_INTERACTION_LANGUAGE.md](../design/Z_UNIVERSAL_INTERACTION_LANGUAGE.md) and Z-VIL motion/contrast discipline.
- Map visuals are **optional**; list/text-first orientation modes should remain conceivable in design docs.
- No flashing urgency patterns for “faster route” gamification.

---

## Emergency and health boundaries

| Claim | Allowed in Phase 0 | Allowed later |
| ------------------------------ | ------------------ | ----------------------------------- |
| “Educational orientation mock” | Yes (docs) | Yes (mock UI) |
| “Replaces emergency services” | **Never** | **Never** |
| “Medical triage route” | **No** | Only with licensed clinical charter |
| “Live incident avoidance” | **No** | Charter + legal + operator receipts |

---

## Tourism and civic lanes

Mauritius / tourism content may appear as **static mock labels** only until operator walks and civic receipts exist. Cross-link [Z_MAURITIANS_UNITE_CIVIC_TRUTH_ENGINE.md](../Z_MAURITIANS_UNITE_CIVIC_TRUTH_ENGINE.md) for dignity-first civic framing — not live civic data feeds in AetherNav.

---

## Incident response (docs-only)

If a phase accidentally introduces location SDK or network map tiles:

1. Stop branch work.
2. Revert runtime files.
3. File issue in PR description; do not merge.
4. Re-run `npm run verify:md` and applicable registry verify.

---

## Receipt chain

Each phase after 0 requires its own green receipt before the next phase starts. Phase 0 receipt: [PHASE_AETHERNAV_0_GREEN_RECEIPT.md](PHASE_AETHERNAV_0_GREEN_RECEIPT.md).
