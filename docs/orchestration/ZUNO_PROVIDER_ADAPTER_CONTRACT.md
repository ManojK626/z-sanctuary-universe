# Zuno provider adapter contract

**Purpose:** **Provider-agnostic** adapter pattern so Zuno is not locked to one vendor — **Phase 1 is docs and types only**; no API keys, no live network calls from this contract alone.

## Principles

- Adapters are **replaceable**; orchestrator logic depends on **capabilities**, not brand names.
- **Risk class** is explicit (`low` | `medium` | `high`).
- **enabled** is boolean; default posture can be **false** until governance enables.
- **No secrets** in repo; credentials stay in operator-controlled stores if ever used.

## Conceptual interface (TypeScript-shaped)

Illustrative only — not asserting `packages/zuno-core` exists yet:

```ts
/** Declares what a provider integration could expose — no live wire-up required. */
interface ZAIProviderAdapter {
  id: string;
  name: string;
  capabilities: string[];
  riskClass: 'low' | 'medium' | 'high';
  enabled: boolean;
}
```

Future extensions (when justified): `rateLimits`, `dataResidency`, `auditTags`, `requiresHumanApproval`.

## JSON registry (future location)

Target artefact (not required to exist yet):

```text
data/providers/z_provider_capability_registry.json
```

Contents would list **adapter metadata only** — never keys.

## Phasing

| Phase | Deliverable |
| ----- | ------------------------------------------------------------------------- |
| A | This doc + optional empty schema stub |
| B | Read-only registry JSON listing disabled adapters |
| C | Interface modules in a chosen package path **after** repo layout decision |
| D | Gated integration behind explicit env and human approval |

## Forbidden

- Shipping API keys or tokens in JSON/TS.
- Hidden background calls.
- Hard-coded “only OpenAI” or “only X” in orchestrator **logic** (names may appear in operator config **outside** git).

## Related

- [ZUNO_CAPABILITY_ROUTER.md](ZUNO_CAPABILITY_ROUTER.md)
- [Z-RPWC-REPLICABLE-POWER-WITHOUT-CHAOS.md](../Z-RPWC-REPLICABLE-POWER-WITHOUT-CHAOS.md) — cross-boundary summary-only discipline
