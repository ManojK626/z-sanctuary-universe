# 08 — Security Reference

**Handbook chapter** · [INDEX](INDEX.md)

## Security posture

Privacy and security are **foundational** — not bolted on. Z-Connect reuses hub VILE packages; it does not duplicate security engines.

Locked decision #7: [Z_CONNECT_ARCHITECTURE_DECISIONS_V1.md](../Z_CONNECT_ARCHITECTURE_DECISIONS_V1.md)

## Hub packages (Phase 2A foundation)

| Package | Status | Role |
| ------- | ------ | ---- |
| `@z-sanctuary/zuno-security` | Complete · 12/12 tests | Classifications, Zero Trust descriptors, I/O validation |
| `@z-sanctuary/zuno-shadow` | Complete · 10/10 tests | AI output validation pipeline |
| `@z-sanctuary/zuno-drp` | Charter only | Sacred move governance |
| `@z-sanctuary/zuno-observability` | Complete · 8/8 tests | Audit events, correlationId |

Integration report: [PHASE_2A_FOUNDATION_INTEGRATION_REPORT.md](../../vile/PHASE_2A_FOUNDATION_INTEGRATION_REPORT.md)

## Privacy-by-design (contract level)

| Area | Design rule |
| ---- | ----------- |
| Profile | User-approved fields only; versioned |
| Consent | Append-only log; withdrawal propagates |
| Messaging | No silent AI capture from private messages |
| Export | User-owned bundle only; no third-party PII |
| Deletion | Cascade with audit; legal retention separate charter |
| Entertainment | Labeled; not in primary matching tables |

Domain sources: user, consent, messaging schemas · flows: Privacy Export, Account Deletion

## Zero Trust (future runtime)

When implementation begins, every request path follows hub Zero Trust descriptors from `zuno-security` — classify before handler, DRP before sacred handler.

Pattern reference: [vile platform-contracts](../../vile/platform-contracts/)

## Security-sensitive flows

| Flow | Security note |
| ---- | ------------- |
| Privacy Export | Elevated DRP; rate limit (future) |
| Account Deletion | Irreversible; double confirmation |
| Dream Baby | All-party consent; elevated DRP |
| Moderation | Reporter identity protected |
| Premium | Sacred; no live charge pre-charter |

## What we do not build (Phase 1.5)

- Authentication implementation  
- Encryption at rest config  
- Production secrets  
- NAS or edge deployment  

These belong to Sprint 0+ under explicit charter.

## Hub security policy

[rules/Z_SANCTUARY_SECURITY_POLICY.md](../../../rules/Z_SANCTUARY_SECURITY_POLICY.md) · [Vault Policy Sheet](../../vault/Vault_Policy_Sheet.md)

## Stack placement

[Z_CONNECT_STACK_PLACEMENT.md](../Z_CONNECT_STACK_PLACEMENT.md)
