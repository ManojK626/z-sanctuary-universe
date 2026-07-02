# @z-sanctuary/zuno-security

**Phase:** 2A Package 2 · VILE Platform  
**Posture:** Shared security contracts — **not** authentication, authorization service, or encryption

## Purpose

Provides the canonical **security foundation** for all future Z-Sanctuary / VILE services:

- `SecurityClassification`, `DataSensitivity`, `TrustLevel` types
- `ValidationResult`, `SecurityViolation` contracts
- `ZeroTrustPolicy` interfaces (describe behaviour — do not execute infrastructure)
- Input/output validation helpers and sensitive-field heuristics

## Source of truth

- [SECURITY_ZERO_TRUST.md](../../docs/vile/SECURITY_ZERO_TRUST.md)  
- [SYSTEM_BOUNDARIES.md](../../docs/vile/SYSTEM_BOUNDARIES.md)  
- Phase 1 architecture docs — **no new doctrine invented here**

## Installation

```bash
npm install
npm run build --workspace=@z-sanctuary/zuno-security
```

## Usage

```typescript
import {
  createZeroTrustPolicyDescriptor,
  validateRequiredFields,
  detectSensitiveFields,
  meetsTrustLevel,
  wrapOutputValidation,
} from '@z-sanctuary/zuno-security';

const policy = createZeroTrustPolicyDescriptor({
  id: 'zt-read-boundary',
  name: 'Read-only catalogue',
  leastPrivilegeLabel: 'traveller-read',
  requiredTrustLevel: 'limited',
  allowedClassifications: ['public', 'internal'],
});

const input = validateRequiredFields({ regionId: 'MU' }, ['regionId']);
if (!input.ok) {
  // handle violations — no network calls in this package
}

const leaks = detectSensitiveFields({ userId: '1', api_key: 'x' });
const output = wrapOutputValidation({ status: 'ok' });
```

## Package boundaries

| In scope | Out of scope |
| -------- | ------------ |
| Types, policy interfaces | OAuth, JWT, sessions |
| Validation helpers | Password storage |
| Sensitive **name** heuristics | KMS, encryption runtime |
| Trust level comparison | APIs, UI, agents |
| | Secrets in repo |

## Zero Trust relationship

Policies enforce **verify before trust**, **least privilege metadata**, and **explicit validation** as immutable contracts. They do not bind WAF, IAM, or network controls.

## Future integration points

- Phase 2B API — boundary validation before handlers  
- `zuno-drp` — security violations feed DRP decisions  
- `zuno-shadow` — output validation before user response  
- `@z-sanctuary/zuno-observability` — audit events (separate package)

## Scripts

```bash
npm run build --workspace=@z-sanctuary/zuno-security
npm run test --workspace=@z-sanctuary/zuno-security
```
