# ADR-001 — Architecture-First Documentation

**Status:** Accepted  
**Date:** 2026-07-01  
**Context:** VILE foundation request — avoid mega-prompt code generation

## Decision

Establish VILE as **~24 canonical Markdown documents** before implementing packages, apps, or agent runtimes.

## Rationale

| Approach | Outcome |
| -------- | ------- |
| Single mega-prompt → generate all code | Fast start, high drift, duplicated security/DRP |
| Architecture-first doc pack | Maintainable, investable, aligns with Z-Sanctuary Turtle Mode |

Large engineering organisations ship **ADRs, architecture overviews, and package catalogs** before services. Z-Sanctuary mirrors that discipline.

## Consequences

### Positive

- Cursor builders receive stable contracts and boundaries  
- ZILWA listening lane stays separate from engineering churn  
- Hub verify and 14 DRP remain single spine  

### Negative

- No immediate runnable VILE product (intentional)  
- Requires AMK review before Phase 2 code charters  

## Alternatives considered

1. **Generate full monorepo immediately** — rejected (violates operational posture)  
2. **Fold VILE into ZILWA docs only** — rejected (mixes community doctrine with enterprise architecture)  
3. **Architecture-first docs (chosen)** — matches user direction  

## Compliance

- [Operational Posture 2026](../Z_SANCTUARY_OPERATIONAL_POSTURE_2026.md) — Learning phase  
- [Z-NEW-MODULE-DISCIPLINE.md](../Z-NEW-MODULE-DISCIPLINE.md) — catalog before build  
