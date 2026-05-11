# Z master requirements queue (Cursor Ops)

**Source of truth for prompt order and lane posture.** Update [Z_TASK_STATUS_BOARD.md](Z_TASK_STATUS_BOARD.md) when a prompt moves.

## Status labels

| Label | Meaning |
| --------------- | --------------------------------------------------------- |
| `READY` | Cursor may execute this prompt now (within strict rules). |
| `BLOCKED` | Waiting on another gate, charter, or human decision. |
| `REVIEW_NEEDED` | AMK-Goku (or delegate) must approve before continue. |
| `DONE` | Completed and verified per acceptance criteria. |
| `DEFERRED` | Valid; scheduled for a later phase. |
| `FORBIDDEN_NOW` | Not allowed in the current governance lane. |

## Queue (Z-Sanctuary ecosystem)

### READY (execute in order unless MAOS says otherwise)

| ID | Prompt file | Summary |
| --- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| 00 | [prompts/00_Z_MAOS_CURSOR_OPS_SYSTEM.md](prompts/00_Z_MAOS_CURSOR_OPS_SYSTEM.md) | Align Cursor Ops with Z-MAOS + hub gates (docs ritual). |
| 01 | [prompts/01_Z_PROJECT_REGISTRY_REVIEW.md](prompts/01_Z_PROJECT_REGISTRY_REVIEW.md) | Registry / PC-root roster sanity (read-only + suggested edits list). |
| 02 | [prompts/02_Z_OPENING_CYCLE_PROMPTS.md](prompts/02_Z_OPENING_CYCLE_PROMPTS.md) | Opening cycle + MAOS open ritual documentation checks. |
| 03 | [prompts/03_Z_EXTENSION_READINESS_PROMPTS.md](prompts/03_Z_EXTENSION_READINESS_PROMPTS.md) | Extension and tool readiness doctrine checks (recommend only). |

### BLOCKED (do not start until gate clears)

| ID | Prompt file | Block reason (short) |
| --- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| 04 | [prompts/04_Z_UCCR_CANVAS_COMMAND_REALM.md](prompts/04_Z_UCCR_CANVAS_COMMAND_REALM.md) | Visual command realm paused / human-gated expansion per hub doctrine. |
| 05 | [prompts/05_Z_CREATOR_ORCHESTRA_GENERATOR_LITE.md](prompts/05_Z_CREATOR_ORCHESTRA_GENERATOR_LITE.md) | Generator “lite” needs charter + scope boundary vs doctrine-only docs. |
| 06 | [prompts/06_Z_PUBLIC_TRUST_REFRESH.md](prompts/06_Z_PUBLIC_TRUST_REFRESH.md) | Public-facing trust refresh touches legal/safety posture — REVIEW_NEEDED class. |
| 07 | [prompts/07_Z_MULTI_PROJECT_DEPLOYMENT_ROUTING.md](prompts/07_Z_MULTI_PROJECT_DEPLOYMENT_ROUTING.md) | Deployment routing is sacred; no automation without release governance. |
| 08 | [prompts/08_Z_CROSS_PROJECT_AUTOMATION.md](prompts/08_Z_CROSS_PROJECT_AUTOMATION.md) | Cross-project automation risks coupling; charter + MAOS consent path required. |

## Shared principle

```text
AI prepares.
Cursor patches (only where prompt allows).
Checks verify.
AMK-Goku approves sacred moves.
```

## XL2 mirror (reference only)

Product queue lives in **XL2** `docs/cursor-ops/MASTER_REQUIREMENTS_QUEUE.md` when that repo adopts this pattern. Track A browser GREEN remains XL2’s gating law — not copied into Z-Sanctuary execution.
