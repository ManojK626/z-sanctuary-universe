# Observability Standards

Every VILE service (when implemented) must expose:

## Required signals

| Signal | Detail |
| ------ | ------ |
| Structured logging | JSON logs — correlation IDs |
| Metrics | RED/USE metrics per service |
| Health checks | `/health` + `/ready` semantics |
| Distributed tracing | Trace ID propagated from API gateway |
| Error reporting | Classified errors — no PII in reports |
| Audit history | Immutable trail for safety and compliance events |

## Package home

`packages/zuno-observability` — shared exporters and middleware.

## Hub alignment today

| Tool | Role |
| ---- | ---- |
| `npm run z:traffic` | Read-only traffic rollup |
| `npm run z:car2` | Drift similarity |
| Cycle observe | Queue suggest-only |
| Zuno snapshot | Ecosystem posture |

VILE services **must not** replace hub overseer — they **feed** it.

## Dashboards

Operator views align with Z-HODP — read-only by default. No silent control plane from observability UI.

## Phase 1

Define log field dictionary and metric names in docs — no production Datadog/similar bind without charter.
