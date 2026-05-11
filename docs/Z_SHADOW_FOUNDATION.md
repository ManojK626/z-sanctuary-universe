# Z Shadow Foundation (OTel + OPA)

This layer is **advisory only** and does not change runtime execution.

## Scope

- OpenTelemetry collector config in shadow mode:
  - `observability/otel/collector.shadow.yaml`
- Policy gate pack in shadow mode:
  - `policies/opa/shadow_gate.rego`
- Reports:
  - `data/reports/z_otel_shadow_status.json`
  - `data/reports/z_policy_shadow_gate.json`

## Tasks

- `Z: OTel Shadow Check`
- `Z: Policy Shadow Gate`

Both are included in `Z: SSWS Auto Boot` as read-only checks.

## Operational intent

- No runtime mutation
- No hard enforcement
- Internal-only posture validation stays visible each boot cycle
