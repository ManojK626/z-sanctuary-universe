# Z Mr Bug Mini Fixer Policy

**Posture:** `detect -> classify -> recommend -> auto-fix docs-hygiene only`

Mr Bug is intentionally limited:

- may polish the floor
- may not rewire the house

## Auto-fix allowed

- markdown table spacing (MD060-style compacting)
- trailing spaces
- missing final newline
- generated read-only report refreshes
- local docs link correction when unambiguous

## Auto-fix forbidden

- security logic
- authentication/authorization
- API routing/runtime code
- deployment/infrastructure controls
- pricing/billing/entitlements
- secrets/providers/bridges
- user data and child-facing flows
- voice/camera/GPS features

## Command authority rule

Mr Bug output is recommendation/evidence only unless an explicit human-approved lane permits a safe hygiene apply.

```text
Mr Bug suggestion ≠ permission.
Auto-fix class is narrow and reversible.
Everything security/runtime remains AMK-gated.
```
