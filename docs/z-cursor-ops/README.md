# Z-Cursor Ops — Z-Sanctuary prompt command system

**Purpose:** Turn ecosystem work into **Markdown task prompts** with status, dependencies, acceptance checks, and handoff rules so Cursor does not guess and operators do not re-type context every session.

**Scope:** This folder is **workflow documentation only**. It does not merge code, deploy, connect externals, or bypass gates.

## Main law (Z-Sanctuary)

- **Z-MAOS** supervises multi-project posture; see [docs/z-maos/Z_MAOS_CHARTER.md](../z-maos/Z_MAOS_CHARTER.md) and `npm run z:maos-status`.
- **No auto-merge, auto-deploy, or silent external connection.**
- **XL2** and other satellites stay **reference-only** unless a future coupling charter exists (see [docs/z-maos/CROSS_PROJECT_LINKING_POLICY.md](../z-maos/CROSS_PROJECT_LINKING_POLICY.md)).
- **Sacred moves** (merge, deploy, payment, legal/safety copy, public launch, cross-repo coupling, bulk user data actions, investor/NGO dispatch) require **AMK-Goku** (and hub governance) approval.
- **NAV-1 / NAV-2:** The hub’s **Universal Workstation Navigator** is **read-only metadata + dashboard UI** ([docs/dashboard/Z_UNIVERSE_WORKSTATION_NAVIGATOR.md](../dashboard/Z_UNIVERSE_WORKSTATION_NAVIGATOR.md)). Other projects may **mirror that law** in their own docs (visibility without auto-act); they **must not** assume inherited cockpit code or live coupling — bridges need charter + 14 DRP gate ([docs/dashboard/Z_UNIVERSE_SERVICE_CATALOG_POLICY.md](../dashboard/Z_UNIVERSE_SERVICE_CATALOG_POLICY.md)).

## How to run the railway

1. Open [Z_MASTER_REQUIREMENTS_QUEUE.md](Z_MASTER_REQUIREMENTS_QUEUE.md).
2. Run `npm run z:maos-status` for orientation.
3. Pick the **first READY** prompt under `docs/z-cursor-ops/prompts/`.
4. Paste the prompt body into Cursor; execute only what the prompt allows.
5. Complete verification; fill [Z_HANDOFF_TEMPLATE.md](Z_HANDOFF_TEMPLATE.md); update [Z_TASK_STATUS_BOARD.md](Z_TASK_STATUS_BOARD.md).

### Markdown gate (after doc-heavy upgrades)

- Run **`npm run verify:md`** or VS Code task **Z: Verify Markdown (gate)** — must exit **0** before treating docs as clean.
- Auto-fix tables / markdownlint autofix: **`npm run lint:md:fix`** or task **Z: Lint Markdown (fix)**.
- Hub CLI excludes **`**/node_modules/**`** and **`**/.pytest_cache/**`** from `lint:md`; workspace **`markdownlint.ignore`** matches so Cursor’s Problems panel does not report hundreds of issues from dependencies (for example `z-questra/node_modules`). Reload the window if stale diagnostics linger.

### Background alignment bundle (metadata-only, low disturbance)

Use after upgrades or handoffs when you want **structure + docs + catalog** checks **without** execution enforcer, comms sync, or deploy paths:

1. **`npm run verify:hub:metadata`** (or VS Code task **Z: Verify Hub Metadata (safe)**) — runs in order: `verify:md` → `z:cross-project:sync` (includes **ZSX** JSON + **ZMV** magical visual registry parse) → `dashboard:registry-verify` → `cursor:folders:verify`.

Full release posture still uses **`npm run verify:full:technical`** or **`npm run verify:ci`** per governance; this bundle is a **narrow lane** only.

## Related hub docs

| Doc | Role |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| [VOICE_COMMAND_PROTOCOL.md](VOICE_COMMAND_PROTOCOL.md) | Voice mode: submit keywords (`zgo`) vs full doctrine |
| [AI_BUILDER_CONTEXT.md](../AI_BUILDER_CONTEXT.md) | Registry-grounded builder briefing |
| [Z_SANCTUARY_BUILD_RULES.md](../Z_SANCTUARY_BUILD_RULES.md) | Evidence-first, no hallucinated features |
| [docs/z-maos/OPENING_CYCLE_RUNBOOK.md](../z-maos/OPENING_CYCLE_RUNBOOK.md) | Daily vs serious verify rhythm |
| [Z_UNIVERSE_WORKSTATION_NAVIGATOR.md](../dashboard/Z_UNIVERSE_WORKSTATION_NAVIGATOR.md) | NAV-1 hub service map (read-only); NAV-2 pointers for sibling repos |

## XL2 (separate product cockpit)

XL2 uses **`docs/cursor-ops/`** in the **XL2 repository only** — not duplicated here. Product repo example path: `c:\XXXtreame Lighting 2` (see **`docs/cursor-ops/README.md`** and **`PHASE_CURSOR_OPS_PROMPT_SYSTEM_REPORT.md`** there). Doctrine: Z-Sanctuary references XL2; it does not merge XL2 trees without a charter.
