# Phase 1.5 — Platform Contracts

**Status:** Active charter · **no runtime**  
**Goal:** Define the shared language every VILE service will speak **before** any `packages/zuno-*` implementation.

## Law

```text
Contracts first · Packages second · APIs third · UI last · Agents last
```

No application code. No UI. No orchestration runtime. Only schemas, examples, and boundary docs.

## Contract catalog

| Contract | Schema | Domain |
| -------- | ------ | ------ |
| Common events | [common-event.schema.json](schemas/v1/common-event.schema.json) | Envelope for domain events |
| Agent messages | [agent-message.schema.json](schemas/v1/agent-message.schema.json) | Orchestrator ↔ agent |
| Destination | [destination.schema.json](schemas/v1/destination.schema.json) | Places and POIs |
| Region | [region.schema.json](schemas/v1/region.schema.json) | Mauritius · Réunion · Madagascar |
| Experience | [experience.schema.json](schemas/v1/experience.schema.json) | Curated activities |
| Culture | [culture.schema.json](schemas/v1/culture.schema.json) | Heritage and etiquette packs |
| Traveller profile | [traveller-profile.schema.json](schemas/v1/traveller-profile.schema.json) | Consent-bounded profile |
| Vendor | [vendor.schema.json](schemas/v1/vendor.schema.json) | Onboarding record (no live vendors until Phase 2D) |
| Risk assessment | [risk-assessment.schema.json](schemas/v1/risk-assessment.schema.json) | Evidence-backed risk |
| Emergency response | [emergency-response.schema.json](schemas/v1/emergency-response.schema.json) | Offline emergency bundle |
| Payment interface | [payment-interface.schema.json](schemas/v1/payment-interface.schema.json) | Adapter contracts — **HOLD runtime** |
| Localization | [localization.schema.json](schemas/v1/localization.schema.json) | Locales and phrase packs |
| Observability event | [observability-event.schema.json](schemas/v1/observability-event.schema.json) | Logs, metrics, audit |

## Examples

Illustrative fixtures (non-executable): [examples/](examples/)

## Alignment with hub

| Hub asset | Relationship |
| --------- | -------------- |
| `packages/zuno-orchestrator-contracts` | Agent messages extend / reference ZunoRequest patterns — do not fork |
| `packages/vile-platform-contracts` | **Not created yet** — schemas live here until Phase 2A packages |

## Validation (Phase 1.5)

```bash
npx markdownlint "docs/vile/platform-contracts/**/*.md" "docs/vile/SYSTEM_BOUNDARIES.md"
node docs/vile/platform-contracts/scripts/validate_examples.mjs
```

## Next phase after AMK review

**Phase 2A** — Implement shared packages (`zuno-security`, `zuno-shadow`, `zuno-drp`, `zuno-observability`) **using these schemas only**.

See [IMPLEMENTATION_PHASES.md](../IMPLEMENTATION_PHASES.md).
