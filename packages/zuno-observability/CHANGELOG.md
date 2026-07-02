# Changelog — @z-sanctuary/zuno-observability

## 0.1.0 — 2026-07-01

### Added

- Phase 2A Package 1 — first VILE shared package
- `ObservabilityEvent` TypeScript types aligned to canonical schema v1
- `validateObservabilityEvent` / `assertObservabilityEvent` (AJV + ajv-formats)
- `ObservabilityEventBuilder` / `createObservabilityEventBuilder`
- Kind, severity, and timestamp helpers
- Unit tests (valid, invalid schema, missing fields, builder)
- README, ROLLBACK, GREEN_RECEIPT

### Not included

- Logging frameworks or monitoring vendors
- API routes, UI, agents, payments
