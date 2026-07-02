# Changelog — @z-sanctuary/zuno-shadow

## 0.1.0 — 2026-06-11

### Added

- Phase 2A Package 3 — Shadow Validation Framework
- Types: `ShadowValidationResult`, `ShadowRule`, `ShadowPipeline`, `VerificationStage`, `VerificationOutcome`, `ValidationEvidence`, `ValidationContext`, `RejectionReason`, `PipelineExecutionSummary`
- Builders: `ShadowPipelineBuilder`, `ValidationContextBuilder`, `EvidenceBuilder`, `ResultBuilder`
- Pipeline executor with configurable stages, early rejection, immutable evidence
- Rule interfaces and test-only pass/reject factories (no business rules)
- Pipeline configuration validator
- Unit tests (10 cases)
- README, ROLLBACK, GREEN_RECEIPT

### Boundaries

- No AI runtime, LLM, network, database, or application imports
- No `zuno-drp` implementation (Pkg 4 deferred)
