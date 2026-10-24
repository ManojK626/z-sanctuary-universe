# 03 — Domain Reference

**Handbook chapter** · [INDEX](INDEX.md)  
**Authority:** [platform-contracts/](../platform-contracts/) — **61 JSON Schema files** (draft 2020-12)

## What domain contracts answer

> What data exists?

Domain contracts define **shapes only** — not behaviour, not API routes, not database DDL.

## Quick stats

| Metric | Value |
| ------ | ----- |
| Total schemas | 61 (60 contracts + 1 definitions bundle) |
| Domains | 11 |
| Examples | 5 non-executable fixtures |
| Validation | `node docs/z-connect/platform-contracts/scripts/validate_contracts.mjs` |

## Domain map

| Domain | Count | Primary purpose |
| ------ | ----- | --------------- |
| common | 1 | Shared `$defs`: Identifier, ConfidenceLevel, disclaimers |
| user | 8 | Profile, preferences, interests, values, lifestyle, privacy |
| connection | 5 | Requests, state, goals, compatibility insight, confidence |
| ai | 8 | Discovery sessions, summaries, prompts, artifacts |
| consent | 6 | Records, scopes, withdrawals, audit |
| messaging | 6 | Conversations, messages, templates |
| family | 5 | Family links, shared experiences, Dream Baby |
| subscription | 5 | Plans, membership, entitlements (**HOLD** for live pay) |
| moderation | 5 | Reports, reviews, safety actions, blocks |
| governance | 5 | Audit events, policy refs, retention |
| discovery | 7 | Journey phases, checkpoints, approvals |

Full inventory: [CONTRACT_INVENTORY.md](../platform-contracts/CONTRACT_INVENTORY.md)

## Key design rules (do not violate)

| Rule | Where enforced |
| ---- | -------------- |
| No `percentCompatible` or destiny scores | Schema + validator forbidden-key scan |
| Connection Confidence = enum, not number | `connection-confidence.schema.json` |
| Entertainment requires label | `interests.schema.json` |
| Dream Baby disclaimer const | `dream-baby-session.schema.json` |
| AI artifacts need explanation + limitations | `compatibility-insight`, AI domain |

## How to use this layer

| Task | Start here |
| ---- | ---------- |
| Add a new data shape | CHANGE_POLICY.md → schema → validate script |
| Map to API field | Phase 1.6 (blocked) — defer until OpenAPI |
| Map to DB column | Phase 1.6 (blocked) — defer until logical schema |
| Understand dependencies | [DEPENDENCY_MAP.md](../platform-contracts/DEPENDENCY_MAP.md) |

## Versioning

[VERSIONING.md](../platform-contracts/VERSIONING.md) · [CHANGE_POLICY.md](../platform-contracts/CHANGE_POLICY.md)

## Reports

[PHASE_1_5_B1_ARCHITECTURE_REPORT.md](../platform-contracts/PHASE_1_5_B1_ARCHITECTURE_REPORT.md) · [PHASE_1_5_B1_GREEN_RECEIPT.md](../platform-contracts/PHASE_1_5_B1_GREEN_RECEIPT.md)
