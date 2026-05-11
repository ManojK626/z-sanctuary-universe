# Zuno orchestrator blueprint

**Status:** Doctrine — describes target architecture. Does **not** claim all subsystems are implemented as runtime services today.

**Premise:** **Zuno** is the **central ethical orchestrator** of the Z-Sanctuary ecosystem: intent decoding, routing, formula alignment, safety gates, evidence discipline, and human-gated assistance — **not** “one monolithic LLM that knows everything.”

## Relationship to living hub

Before designing new runtime pieces, builders **must** read:

- `docs/AI_BUILDER_CONTEXT.md`, `docs/Z_SANCTUARY_BUILD_RULES.md`
- `data/reports/z_zuno_coverage_audit.{json,md}` — module or path truth
- `data/reports/z_zuno_phase3_completion_plan.{json,md}` — staged remediation
- `data/reports/z_car2_similarity_report.{json,md}` — duplication or drift hints
- Registries: `data/z_master_module_registry.json`, `data/z_core_engines_registry.json`

Refresh ritual: `npm run z:ai-builder:refresh`, optional `npm run z:car2`, `npm run dashboard:registry-verify`.

## Logical components (target)

```text
Zuno orchestrator (conceptual)
├── Intent router          — what is being asked; which project lane
├── Capability router      — text, code, vision, audio, research, eval, governance (see capability doc)
├── Formula selector       — which Z-formula frame applies (decision/theory, not magic)
├── Agent or tool router   — which hub-approved agent/lane (Doorway/Escort aware)
├── Provider router        — which adapter **class** (no blind vendor lock-in)
├── Project overseer       — registry truth, MAOS posture, cross-project **reference-only** default
├── Memory coordinator     — separates project, formula, safety, user-approved, audit (see memory doc)
├── Safety / DRP gate      — 14 DRP and build rules; phased code later (see roadmap)
├── Output verifier        — citations, bounds, safety labels (see verifier doc)
└── Report writer          — JSON/MD artefacts under data/reports; dashboard read-only surfaces
```

## Decisions Zuno must support (conceptual)

For each significant request:

1. What is the user asking?
2. Which **project** or repo lane owns it?
3. Which **formula** or design frame applies (if any)?
4. Which **tool/agent/provider class** is safest and smallest?
5. Does the request pass **DRP + build rules**?
6. What **evidence** must be recorded (paths, reports, receipts)?
7. What may be shown on the **dashboard** (read-only advisory)?

## Non-goals (current doctrine)

- No silent production deploy, merge, payment, or sensitive modality activation ([Z_SANCTUARY_BUILD_RULES.md](../Z_SANCTUARY_BUILD_RULES.md)).
- No **XL2** coupling without an explicit charter ([docs/z-maos/CROSS_PROJECT_LINKING_POLICY.md](../z-maos/CROSS_PROJECT_LINKING_POLICY.md)).
- No pretending a blueprint row is shipped code when coverage audit says otherwise.

## Next documents

- [ZUNO_CAPABILITY_ROUTER.md](ZUNO_CAPABILITY_ROUTER.md)
- [ZUNO_PROVIDER_ADAPTER_CONTRACT.md](ZUNO_PROVIDER_ADAPTER_CONTRACT.md)
- [ZUNO_MEMORY_KNOWLEDGE_LAYER.md](ZUNO_MEMORY_KNOWLEDGE_LAYER.md)
- [ZUNO_OUTPUT_VERIFIER.md](ZUNO_OUTPUT_VERIFIER.md)
- [Z_SANCTUARY_MASTER_ORCHESTRATION_ROADMAP.md](Z_SANCTUARY_MASTER_ORCHESTRATION_ROADMAP.md)
