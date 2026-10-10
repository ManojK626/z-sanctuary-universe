# 06 — Governance Reference

**Handbook chapter** · [INDEX](INDEX.md)

## Governance posture

Z-Connect operates under **Z-Sanctuary hub governance** — Merge Hold, DRP, Shadow, 14 DRP, AMK sacred gates. GREEN ≠ deploy.

## Permanent doctrine (elevated)

> A state transition changes the status of an experience — not the autonomy of the user. Users remain in control, and governance exists to protect rights, consent, and safety, not to make personal decisions on their behalf.

This doctrine applies to:

- Every interaction flow gate  
- Every experience state transition  
- Every future API endpoint  
- Every AI surface  

## Immutable AI rule

> No AI-generated compatibility insight shall be presented as objective truth.

[Z_CONNECT_ARCHITECTURE_DECISIONS_V1.md](../Z_CONNECT_ARCHITECTURE_DECISIONS_V1.md) · [Z_CONNECT_SCIENTIFIC_INTEGRITY.md](../Z_CONNECT_SCIENTIFIC_INTEGRITY.md)

## Gate stack

| Layer | Package / doc | Role |
| ----- | ------------- | ---- |
| Consent | consent domain + flows | Opt-in before capture/share |
| Security | `zuno-security` | Classification, Zero Trust |
| DRP | `zuno-drp` (charter) | Sacred moves, child safety |
| Shadow | `zuno-shadow` | AI output validation |
| Human | AMK / operator | Launch, live pay, exceptions |
| Observability | `zuno-observability` | Audit, correlationId |

## Sacred moves (always HOLD until AMK gate)

| Move | Why sacred |
| ---- | ---------- |
| Live payments / billing | Financial + legal |
| Public launch / App Store | User exposure |
| Child-data features | Elevated DRP |
| Bulk export at scale | Privacy abuse risk |
| Policy exceptions | Precedent |
| Merge to `main` (product code) | Hub governance |

## Canonical pipeline (all gated paths)

```text
Human Action → Consent → Security → DRP → AI → Shadow → Human Review → State + Audit
```

## Z-Sanctuary reuse principle

> The governance framework is reusable, but each application owns its own domain logic and experience states.

| Shared (reuse) | Owned per application |
| -------------- | --------------------- |
| DRP categories | Domain schemas |
| Shadow pipeline | Interaction flows |
| Security classification | Experience states |
| Observability patterns | Business logic |
| 14 DRP law | UX copy and journeys |

This prevents **accidental coupling** while encouraging **consistent protection**.

Hub law: [Z_SWARM_14DRP_UNIVERSAL_AGENT_LAW.md](../../Z_SWARM_14DRP_UNIVERSAL_AGENT_LAW.md) · [Z-GITHUB-SANCTUARY-GATE.md](../../Z-GITHUB-SANCTUARY-GATE.md)

## Merge Hold

All Z-Connect PRs remain **Merge Hold** until AMK releases the implementation gate. Architecture docs may merge for visibility; runtime does not follow automatically.

## What governance does not do

- Choose partners for users  
- Rank people by compatibility score  
- Auto-accept connections or messages  
- Pressure upgrades through fear or scarcity  
- Present entertainment as science  

## Related

[Z_CONNECT_SYSTEM_BOUNDARIES.md](../Z_CONNECT_SYSTEM_BOUNDARIES.md) · [interaction-contracts/INTERACTION_CONTRACT_LAW.md](../interaction-contracts/INTERACTION_CONTRACT_LAW.md) · [experience-state-contracts/ESC_LAW.md](../experience-state-contracts/ESC_LAW.md)
