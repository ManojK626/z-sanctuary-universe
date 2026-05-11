# Z Policy Shadow Gate

Generated: 2026-04-17T16:54:10.422Z
Mode: shadow
Enforcement: advisory
Status: READY

## Checks

- PASS formula_registry_internal_only: status=internal-only
- PASS folder_policy_internal_only: mode=internal-only
- PASS request_only_policy_present: policy file present
- PASS rego_pack_present: opa/shadow_gate.rego present

## Optional Tooling

- OPA binary: not detected
- Conftest binary: not detected

Operational note: shadow gate is advisory only and does not block runtime tasks.
