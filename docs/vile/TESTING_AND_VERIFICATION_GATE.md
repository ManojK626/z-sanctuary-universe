# Testing and Verification Gate

**Law:** No feature is complete without tests and phase receipts.

## Per-module requirements (when code exists)

| Layer | Tests |
| ----- | ----- |
| Package | Unit tests, schema validation |
| API | Integration tests, DRP middleware tests |
| Agent | Shadow validation tests, abstain paths |
| Security | Input fuzz, authZ matrix |
| Offline | Airplane mode integration |

## Hub verify alignment

From `Z_Sanctuary_Universe` root:

| Intent | Command |
| ------ | ------- |
| Structure | `node scripts/z_sanctuary_structure_verify.mjs` |
| Registry omni | `node scripts/z_registry_omni_verify.mjs` |
| Metadata | `npm run verify:hub:metadata` |
| Full technical (pre-merge) | `npm run verify:full:technical` |

## Phase completion checklist

Every phase ends with:

1. **Green test report** — CI or documented local run  
2. **DRP validation report** — endpoints and agents covered  
3. **Security report** — threat model delta  
4. **Documentation update** — README + ADR if decisions changed  
5. **Rollback instructions** — how to revert safely  

## Phase 1 (current)

Deliverable = this doc pack + markdown lint pass. **No** production feature tests required yet.

```bash
npx markdownlint "docs/vile/*.md"
```
