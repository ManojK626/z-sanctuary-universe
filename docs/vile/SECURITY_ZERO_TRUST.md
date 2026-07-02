# Security — Zero Trust Design

**Posture:** Design standard · Phase 2+ implementation

## Principles

| Control | Requirement |
| ------- | ----------- |
| Zero Trust | Verify every request — no implicit LAN trust |
| RBAC | Role-based access — traveller / vendor / ops / government |
| Field-level encryption | PII, health flags, payment tokens |
| Audit logs | Who did what, when — tamper-evident |
| Immutable events | Critical safety and payment intents |
| Secrets management | Vault / env — **never in repo** |
| Input validation | Schema at boundary |
| Output validation | No leaky PII in errors |
| Prompt validation | Agent inputs sanitised |
| Agent validation | Tool allowlists per agent role |

## Package home

`packages/zuno-security` — shared across all `apps/*`.

## Hub policy alignment

- [rules/Z_SANCTUARY_SECURITY_POLICY.md](../../rules/Z_SANCTUARY_SECURITY_POLICY.md)  
- Vault docs: read-only sincerity — no exfiltration  

## VILE-specific risks

| Risk | Mitigation |
| ---- | ---------- |
| Fabricated safety info | Shadow + abstain |
| Child exploitation | KidsSafetyAgent + human escalation |
| Medical harm | MedicalAgent info-only + disclaimers |
| Vendor fraud | RiskAgent + verified onboarding (future) |
| Offline data theft | Device encryption + minimal PII offline |

## Phase 1

Threat model outline in security report template — no production keys or WAF bind.
