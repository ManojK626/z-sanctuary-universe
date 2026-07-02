# @z-sanctuary/zuno-observability

**Phase:** 2A Package 1 · VILE Platform  
**Posture:** Shared contract implementation — **not** a logging framework

## Purpose

Implements the canonical **VILEObservabilityEvent** contract for every future Z-Sanctuary service:

- Strict TypeScript types (no invented fields)
- Runtime JSON Schema validation (AJV)
- Infrastructure-neutral event builder
- Correlation ID and trace field support

This package does **not** ship Datadog, OpenTelemetry exporters, or application logic.

## Canonical schema

**Source of truth (hub docs):**

`docs/vile/platform-contracts/schemas/v1/observability-event.schema.json`

**Package copy (validation runtime):**

`packages/zuno-observability/schemas/v1/observability-event.schema.json`

Keep copies aligned when the canonical schema changes. Do not extend the schema in this package — propose changes via VILE platform-contracts PR.

## Installation

From hub root (npm workspaces):

```bash
npm install
npm run build --workspace=@z-sanctuary/zuno-observability
```

## Usage

```typescript
import {
  createObservabilityEventBuilder,
  validateObservabilityEvent,
} from '@z-sanctuary/zuno-observability';

const event = createObservabilityEventBuilder('vile-api', 'log', 'info')
  .withCorrelationId('corr-abc')
  .withMessage('destination catalog loaded')
  .build();

const check = validateObservabilityEvent(event);
if (check.ok) {
  // forward to future exporter adapter (not in this package)
}
```

## Package boundaries

| In scope | Out of scope |
| -------- | ------------ |
| Types, validator, builder | HTTP APIs |
| Schema alignment | UI / React |
| Unit tests | AI agents |
| | Payment / vendor / traveller domains |
| | Logging vendor SDKs |

See [SYSTEM_BOUNDARIES.md](../../docs/vile/SYSTEM_BOUNDARIES.md).

## Future integration points

- Phase 2B read-only API — emit audit events via this builder
- `zuno-drp` — link `drpDecisionId` via common-event envelope (future)
- Hub overseer reports — optional ingest adapter (human-gated)

## Scripts

```bash
npm run build --workspace=@z-sanctuary/zuno-observability
npm run test --workspace=@z-sanctuary/zuno-observability
```

## Related

- [OBSERVABILITY_STANDARDS.md](../../docs/vile/OBSERVABILITY_STANDARDS.md)
- [PACKAGE_CATALOG.md](../../docs/vile/PACKAGE_CATALOG.md)
