# Zuno capability router

**Purpose:** Define **capability families** the orchestrator may route among — **documentation and contracts first**, not automatic dispatch to external APIs.

## Capability families (target taxonomy)

| Family | Examples | Route notes |
| ---------------- | ------------------------------- | ---------------------------------------------------- |
| Text / reasoning | Q&A, summarization, planning | Default doc-grounded; cite registry and paths |
| Code | Patch proposals, scripts, tests | Evidence-first; smallest diff; respect Turtle lanes |
| Image | Generation, edit, analysis | High consent; no fake medical or surveillance claims |
| Audio / voice | TTS, transcription | Mic capture **gated** per build rules |
| Music / creative | Composition aids | IP and fairness aware |
| Video | Storyboard, edit assist | Same as creative + bandwidth honesty |
| PDF / documents | Extract, structure | Local files preferred; no exfiltration |
| Research | Web or corpus (if ever allowed) | **Explicit** network permission only |
| Automation | Tasks, scripts | No auto-merge/deploy; human approval |
| Evaluation | Lint, verify, audit | Maps to existing `npm run` verifiers |
| Accessibility | A11y review, contrast | Align dashboard and docs governance |
| Governance | DRP, registry, MAOS | Read-only reports before blocking behaviour |

## Routing rules

1. **Project first:** Resolve owning root (Z-Sanctuary hub vs satellite vs XL2 **reference-only**).
2. **Smallest capability:** Prefer evaluation or docs before generative or network.
3. **Safety class:** If capability touches build-rule forbidden zones (payment, GPS, camera, mic, gambling automation, health claims, emergency, baby/soulmate predictors), **stop** for human gate — no router bypass.
4. **Evidence:** Route outputs that affect registry or “implemented” claims through **coverage audit** expectations ([AI_BUILDER_CONTEXT.md](../AI_BUILDER_CONTEXT.md)).
5. **Doorway/Escort:** Treat external agents as **lane-bound** ([Z-AI-DOORWAY-AND-ESCORT-PROTOCOL.md](../Z-AI-DOORWAY-AND-ESCORT-PROTOCOL.md)) when operational policies apply.

## Overlap with existing hub scripts

Many “evaluation” capabilities already exist as **npm scripts** (structure verify, registry omni, Zuno coverage, CAR², dashboard registry verify). The capability router **maps requests** to those commands conceptually; it does not replace them with hidden automation.

## Forbidden

- Routing to **live** provider execution without explicit operator consent and adapter contracts ([ZUNO_PROVIDER_ADAPTER_CONTRACT.md](ZUNO_PROVIDER_ADAPTER_CONTRACT.md)).
- Collapsing all families into one undifferentiated “do everything” path.
