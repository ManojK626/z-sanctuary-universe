# VILE System Boundaries

**Version:** 1.0  
**Status:** Canonical · binding on all VILE phases  
**Owner:** AMK-Goku

This document defines what **VILE will not do**. Boundaries preserve trust, legal safety, and alignment with Z-Sanctuary operational posture.

```text
If a feature is not explicitly chartered and receipt-backed, it is OUT OF SCOPE.
```

---

## Autonomy and decisions

| Boundary | Rule |
| -------- | ---- |
| No autonomous booking approvals | Every booking confirmation requires human or explicitly chartered workflow — never silent auto-approve |
| No autonomous deploy | Deploy, domain bind, and production config require AMK gate |
| No autonomous merge | GitHub merge = human decision |
| No background self-improvement loops | No always-on Codex or agent loops without charter |
| No agent-to-agent shortcuts | All agents route through Universal Orchestrator |

---

## AI output limits

| Boundary | Rule |
| -------- | ---- |
| No AI-generated legal advice | LegalComplianceAgent may **flag** — not advise as lawyer |
| No AI diagnosis or treatment decisions | MedicalAgent = information packs + disclaimers only |
| No fabricated destinations | Every destination must trace to verified source or abstain |
| No fabricated vendors | Vendors exist only after onboarding receipt — never invented |
| No fabricated safety ratings | Risk scores require evidence or explicit uncertainty |
| No impersonation | Never pose as government, NGO, or medical authority |

---

## Security and governance

| Boundary | Rule |
| -------- | ---- |
| No bypass of Shadow validation | Schema → Safety → Risk → Compliance → Shadow → User |
| No bypass of DRP safeguards | Every endpoint and agent path uses DRP middleware |
| No secrets in repository | Keys live in vault / operator env only |
| No direct modification of financial records | Ledger changes via audited payment adapters only |
| No PII in logs or error surfaces | Field-level discipline |

---

## Commerce and compliance

| Boundary | Rule |
| -------- | ---- |
| No live payments in Learning phase | Payment interfaces are contracts only until AMK + revenue charter |
| No VAT / tax engine without legal review | Tax logic is sacred move |
| No company registration automation | Human and legal gate |
| No escrow or settlement without charter | Phase 3+ with receipts |

---

## Community and ethics

| Boundary | Rule |
| -------- | ---- |
| No steward story use without consent | ZILWA listening consent outranks model output |
| No exploitation framing | Dignity-first language enforced |
| No child safety compromise | KidsSafetyAgent block paths are mandatory |
| No surveillance positioning | Government exports are aggregated — not covert tracking |

---

## Technical

| Boundary | Rule |
| -------- | ---- |
| No duplicated auth per app | Use `zuno-identity` when implemented |
| No duplicated DRP / security engines | Shared packages only |
| No production placeholder logic | Mocks labelled `_non_executable` |
| No skip of phase completion law | Tests + DRP + security + docs + rollback |

---

## Deployment

| Boundary | Rule |
| -------- | ---- |
| No deployment without human approval | Cloudflare hosts reality — does not define reality |
| No public launch from draft PR | Merge Hold until AMK reads delta |
| No NAS / edge bind without charter | Per hub governance |

---

## When in doubt

1. Read [SYSTEM_BOUNDARIES.md](SYSTEM_BOUNDARIES.md) (this doc)  
2. Read [ETHICAL_AI_CHARTER.md](ETHICAL_AI_CHARTER.md)  
3. Read [Operational Posture 2026](../Z_SANCTUARY_OPERATIONAL_POSTURE_2026.md)  
4. **Stop and escalate to AMK** — do not ship

---

## Related

- [platform-contracts/README.md](platform-contracts/README.md) — shared schema language  
- [SHADOW_VALIDATION_PIPELINE.md](SHADOW_VALIDATION_PIPELINE.md)  
- [ZILWA_LISTENING_CONSENT_AND_SAFEGUARDING.md](../zilwa-living-experiences/ZILWA_LISTENING_CONSENT_AND_SAFEGUARDING.md)
