# Phase 2A — Package 4 Charter

## `@z-sanctuary/zuno-drp`

**System:** Z-Sanctuary Universe · VILE Platform  
**Document type:** Implementation charter (docs only)  
**Version:** 1.0  
**Date:** 2026-06-11  
**Owner:** AMK-Goku  
**Posture:** **Merge Hold** — no code until Packages 1–3 PRs are approved and merged

---

## STATUS

| Prerequisite | State |
| ------------ | ----- |
| Architecture Foundation | Complete |
| Platform Contracts (Phase 1.5) | Complete |
| Package 1 (`zuno-observability`) | Complete — merge pending |
| Package 2 (`zuno-security`) | Complete — merge pending |
| Package 3 (`zuno-shadow`) | Complete — merge pending |
| Phase 2A Foundation Integration Report | **GREEN** |
| Package 4 implementation (`packages/zuno-drp`) | **NOT STARTED** — this charter only |

**Gate:** Do **not** create `packages/zuno-drp/` or wire runtime middleware until Packages 1–3 land on `main` and AMK releases Merge Hold for Package 4 implementation.

---

## OBJECTIVE

Charter the reusable shared package:

**`packages/zuno-drp`** · npm name **`@z-sanctuary/zuno-drp`**

This package will be the **central 14 DRP evaluation layer** for the VILE ecosystem — the orchestration gate that sits **before** business logic on every HTTP/gRPC route and agent invocation path.

It defines:

- DRP decision contracts and immutable decision records  
- Middleware **interfaces** (describe behaviour — do not bind production servers in Phase 2A)  
- Protocol dimension evaluation framework  
- Escalation and sacred-move detection hooks  
- Builders and validators for `ZDRPDecision`-aligned outcomes  

It is **not**:

- A deployable API gateway  
- An authentication service (`zuno-identity` is separate)  
- A Shadow pipeline (`zuno-shadow` remains the AI-output verification layer)  
- A payment, booking, or legal engine  
- An autonomous enforcement daemon  

```text
Swarm law ≠ swarm execution.
DRP evaluate ≠ auto-approve sacred moves.
```

---

## SOURCE OF TRUTH

Use **only** existing canonical documentation and contracts. Do not invent new doctrine in the implementation PR.

| Authority | Path |
| --------- | ---- |
| 14 DRP universal law | [Z_SWARM_14DRP_UNIVERSAL_AGENT_LAW.md](../Z_SWARM_14DRP_UNIVERSAL_AGENT_LAW.md) |
| IDE / agent 14 DRP protocol | [Z_IDE_14DRP_AGENT_PROTOCOL.md](../Z_IDE_14DRP_AGENT_PROTOCOL.md) |
| 14 DRP registry (machine) | [data/z_ide_14drp_agent_protocol_registry.json](../../data/z_ide_14drp_agent_protocol_registry.json) |
| DRP middleware architecture | [DRP_MIDDLEWARE_ARCHITECTURE.md](DRP_MIDDLEWARE_ARCHITECTURE.md) |
| System boundaries | [SYSTEM_BOUNDARIES.md](SYSTEM_BOUNDARIES.md) |
| VILE blueprint | [VILE_CANONICAL_SYSTEM_BLUEPRINT.md](VILE_CANONICAL_SYSTEM_BLUEPRINT.md) |
| Agent swarm + DRPGuardian | [AGENT_SWARM_SPEC.md](AGENT_SWARM_SPEC.md) |
| API surface plan | [API_SURFACE_PLAN.md](API_SURFACE_PLAN.md) |
| Shadow pipeline | [SHADOW_VALIDATION_PIPELINE.md](SHADOW_VALIDATION_PIPELINE.md) |
| Platform contracts | [platform-contracts/](platform-contracts/) |
| Existing decision shape | [packages/zuno-orchestrator-contracts/src/ZDRPDecision.ts](../../packages/zuno-orchestrator-contracts/src/ZDRPDecision.ts) |

**Extend, do not fork:** `ZDRPDecision` and `ZDRPOverall` already exist in `@z-sanctuary/zuno-orchestrator-contracts` (or hub package name as published). Package 4 implementation must **align** with that shape or import it — not duplicate conflicting types.

---

## RELATIONSHIP TO PHASE 2A FOUNDATION

```text
Request / agent task
  → zuno-security     (classification, trust, I/O guards — Pkg 2)
  → zuno-drp          (14 DRP evaluate — Pkg 4)        ← this charter
  → handler / orchestrator
  → zuno-shadow       (AI output pipeline — Pkg 3)     when AI path
  → zuno-observability (audit events — Pkg 1)         consumer emits
```

| Package | Role relative to DRP |
| ------- | -------------------- |
| `zuno-observability` | Consumers attach `drpDecisionId` on common events per [common-event.schema.json](platform-contracts/schemas/v1/common-event.schema.json) |
| `zuno-security` | Trust level and classification inform DRP dimensions — **no circular import** |
| `zuno-shadow` | Compliance stage may **call** DRP evaluation — shadow does not replace DRP |
| `zuno-orchestrator-contracts` | Hosts `ZDRPDecision` read-only shape; task plans may include `drpPreview` |

Foundation integration confirmed: **no inter-package imports today**. Package 4 may declare an explicit dependency on `zuno-orchestrator-contracts` for `ZDRPDecision` types only — direction must remain **foundation → consumers**, never **packages → apps**.

---

## SCOPE (implementation PR — future)

### Allowed

- TypeScript package under `packages/zuno-drp/`  
- DRP decision types aligned with `ZDRPDecision`  
- Middleware **interface** types (`DrpMiddleware`, `DrpEvaluationContext`)  
- Protocol dimension definitions and evaluation hooks (framework — not hard-coded business rules)  
- Sacred-move escalation markers (typed flags — AMK gate preserved)  
- Immutable decision record builders  
- Generic evaluation executor (similar pattern to `zuno-shadow` pipeline)  
- Unit tests, README, CHANGELOG, GREEN_RECEIPT, ROLLBACK  
- Optional read of hub 14 DRP registry JSON for dimension labels (**local file read only**)

### Not allowed

- Production HTTP/gRPC server or Express/Fastify middleware binding  
- Auto-merge, auto-deploy, auto-payment, or silent sacred-move execution  
- OpenAI, Anthropic, or local LLM runtime  
- Booking validation, vendor lookup, tax engine  
- Database persistence layer (decision records are in-memory / passed to consumer)  
- UI, authentication implementation, encryption runtime  
- Network requests (no external policy services)  
- Duplicated `ZDRPDecision` type fork  
- Application-specific endpoint maps (belong in Phase 2B+ integration docs)

---

## PLANNED PACKAGE STRUCTURE

**Do not create until implementation PR is chartered post-merge.**

```text
packages/
  zuno-drp/
    src/
      types/           # DrpEvaluationContext, DrpMiddleware, escalation types
      protocols/       # dimension interfaces — map to 14 DRP registry
      middleware/      # interface + adapter stubs (no server bind)
      evaluators/      # generic evaluation executor
      builders/        # decision record builders
      validators/      # decision + context validation
      constants/       # overall statuses, sacred-move codes (from docs)
      index.ts         # barrel export
    tests/
    README.md
    CHANGELOG.md
    GREEN_RECEIPT.md
    ROLLBACK.md
    package.json
    tsconfig.json
```

---

## REQUIRED TYPES (implementation contract)

Implement reusable contracts including (names may be refined to match orchestrator-contracts; semantics must not drift):

| Type | Purpose |
| ---- | ------- |
| `ZDRPDecision` | Align with orchestrator-contracts — `overall`, `dimensions`, `rationale` |
| `ZDRPOverall` | `'pass' \| 'pending_human' \| 'blocked'` |
| `DrpEvaluationContext` | Immutable input: correlationId, routeOrTaskKind, serviceScope, metadata |
| `DrpProtocolDimension` | Single dimension result: `ok` \| `review` \| `blocked` |
| `DrpEvaluationResult` | Immutable outcome bundle + decision record |
| `DrpMiddleware` | Interface: `evaluate(context) → DrpEvaluationResult` |
| `SacredMoveFlag` | Typed escalation when sacred-move patterns detected — **never auto-executes** |
| `DrpExecutionSummary` | Audit-friendly summary (stages evaluated, timestamps) |
| `RejectionOrEscalationReason` | Structured block/escalate reasons |

All decision records must be **immutable** after completion (same discipline as `zuno-shadow`).

---

## REQUIRED BUILDERS (implementation PR)

| Builder | Produces |
| ------- | -------- |
| `DrpDecisionBuilder` | Valid `ZDRPDecision`-aligned record |
| `DrpEvaluationContextBuilder` | Valid evaluation context |
| `DrpEvaluationResultBuilder` | Immutable result + summary |

Builders must throw on invalid configuration (mirror `ShadowPipelineBuilder` pattern).

---

## EVALUATION FLOW (target)

Configurable evaluation — not a single hard-coded policy file:

```text
Input (route class | agent task kind | orchestrator preview)
  ↓
Context validation
  ↓
Dimension evaluation (14 DRP-aligned hooks — consumer-supplied rules)
  ↓
Sacred-move detection → pending_human | blocked (never silent allow)
  ↓
ZDRPDecision record (immutable)
  ↓
pass → consumer continues | pending_human → AMK gate | blocked → stop
```

Per [DRP_MIDDLEWARE_ARCHITECTURE.md](DRP_MIDDLEWARE_ARCHITECTURE.md):

```text
Request → authenticate (zuno-identity, future) → DRP evaluate (zuno-drp) → audit log → handler OR blocked
```

**Shadow is separate:** AI paths still run [SHADOW_VALIDATION_PIPELINE.md](SHADOW_VALIDATION_PIPELINE.md) after orchestration planning — DRP does not replace Shadow.

---

## ENDPOINT / TASK CATEGORY POSTURE

From [DRP_MIDDLEWARE_ARCHITECTURE.md](DRP_MIDDLEWARE_ARCHITECTURE.md) — implementation provides **hooks**; category tables live in integration docs:

| Category | DRP posture |
| -------- | ----------- |
| Public read (destinations) | Standard + content safety |
| Booking / payment intents | **HOLD** — extra gates |
| Health / child data | Maximum restriction + human review |
| Government export | Audit + AMK charter |
| Agent orchestration | Full pipeline + Shadow |

---

## RULE / HOOK ENGINE

Mirror `zuno-shadow` discipline:

- Framework executes dimension hooks  
- Framework does **not** ship production business rules  
- Each hook declares `id`, dimension key, and `evaluate(context)`  
- Hooks receive **immutable** context  
- Hooks return **immutable** dimension results  

---

## TESTING (implementation PR)

Unit tests must cover at minimum:

- Empty evaluation (pass-through with valid context)  
- Single-dimension evaluation  
- Multi-dimension evaluation  
- `blocked` overall  
- `pending_human` escalation (sacred-move pattern)  
- Immutable decision records  
- Builder validation failures  
- Invalid context rejection  
- Alignment with `ZDRPDecision` example fixture  

All tests must pass. No skipped tests.

---

## DOCUMENTATION (implementation PR)

**README** must explain:

- Purpose and package boundaries  
- Relationship to 14 DRP law and orchestrator contracts  
- Difference between DRP (governance gate) and Shadow (AI output verification)  
- Middleware interface usage (consumer binds server — not this package)  
- Usage examples (in-memory evaluation only)  
- Future extension points (Phase 2B API wiring)

**ROLLBACK.md** — safe removal, no runtime dependencies  

**GREEN_RECEIPT.md** — files, tests, build, export report, known limitations  

---

## ENGINEERING RULES

- Strict TypeScript — no `any`  
- No application imports (`apps/`, `dashboard/`, hub scripts)  
- No circular dependencies with `zuno-shadow` / `zuno-security` / `zuno-observability`  
- Prefer dependency on `zuno-orchestrator-contracts` for `ZDRPDecision` over type duplication  
- No hidden runtime behaviour  
- No external services  
- No hard-coded endpoint catalogue  
- Sacred moves always escalate — **DRP-13:** GREEN ≠ deploy  

---

## VALIDATION GATES (before implementation PR review)

- [ ] Packages 1–3 merged to `main`  
- [ ] Merge Hold released for Package 4 implementation  
- [ ] TypeScript build passes  
- [ ] Unit tests pass  
- [ ] Markdown lint passes  
- [ ] Public exports verified (single barrel)  
- [ ] `ZDRPDecision` shape compatible with orchestrator-contracts example  
- [ ] No production middleware deployed  
- [ ] DRP validation report template filled (endpoints covered: N/A at 2A)  
- [ ] No new doctrine invented  

---

## MERGE POSTURE

| Item | Posture |
| ---- | ------- |
| This charter document | Docs-only PR — Merge Hold until AMK reads |
| Future implementation PR | Merge Hold — one package per PR |
| Production DRP middleware | **Forbidden** until Phase 2B+ charter + receipt |

---

## GREEN RECEIPT (future implementation PR)

Must include:

- Build results  
- Test results (count / pass / skip)  
- Package dependency report (especially `zuno-orchestrator-contracts`)  
- Public export report  
- `ZDRPDecision` compatibility check vs example fixture  
- Rollback verification  
- Known limitations  
- Explicit statement: **no production middleware deployed**  

---

## ROLLBACK (future package)

Deleting `packages/zuno-drp/` must not require infrastructure teardown. No daemons, no API routes, no registry mutation at install time.

---

## KNOWN LIMITATIONS (charter stage)

- No `packages/zuno-drp/` on disk yet — intentional  
- Endpoint → DRP mapping tables remain in architecture docs until API phase  
- Full 14-dimension registry wiring may reference hub JSON — not validated in this charter  
- `ValidationResult` name exists in observability and security packages — consumers must namespace imports  
- Runtime orchestration and DRPGuardian agent remain Phase 3  

---

## RECOMMENDED SEQUENCE (operator)

1. Approve and merge Merge Hold PRs for Packages 1–3  
2. Confirm Foundation Integration Report remains green on `main`  
3. Open **Package 4 implementation** PR using this charter (Turtle branch `cursor/zsanctuary/vile-zuno-drp-2a`)  
4. Human review + Merge Hold release  
5. Phase 2B may wire read-only API routes with DRP middleware **interfaces** — still no sacred runtime  

---

## RELATED DOCUMENTS

- [PHASE_2A_FOUNDATION_INTEGRATION_REPORT.md](PHASE_2A_FOUNDATION_INTEGRATION_REPORT.md)  
- [PHASE_2A_FOUNDATION_INTEGRATION_GREEN_RECEIPT.md](PHASE_2A_FOUNDATION_INTEGRATION_GREEN_RECEIPT.md)  
- [PACKAGE_CATALOG.md](PACKAGE_CATALOG.md)  
- [IMPLEMENTATION_PHASES.md](IMPLEMENTATION_PHASES.md)  

---

## ENGINEERING PRINCIPLE

```text
Correctness
  ↓
Maintainability
  ↓
Security
  ↓
Evolution
  ↓
Speed
```

Build the smallest complete reusable DRP package that serves every future Z-Sanctuary platform without coupling to applications, infrastructure, or AI providers.

**Charter only. Implementation waits on AMK gate.**
