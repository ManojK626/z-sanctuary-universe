# Phase ZCO-1 — Green Receipt (Compute Organism Builder Doctrine)

**Phase:** ZCO-1 — Z-Compute Organism / Z-Compute Forge — **builder doctrine pack**
**Scope:** `docs/compute-organism/` + `data/examples/` only
**Date:** 2026-05-21

## Intent

Seal the compute-organism vision as a **safe infrastructure project** with **Z-SSWS + AI Tower** as the **Cursor / Builder instruction spine** — teach the project before building the project.

## Deliverables

| Artifact | Status |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `docs/compute-organism/Z_COMPUTE_ORGANISM_ARCHITECTURE.md` | Added |
| `docs/compute-organism/Z_SSWS_AI_TOWER_BUILDER_INSTRUCTIONS.md` | Added |
| `docs/compute-organism/Z_ARELIUM_SHIELD_INFRASTRUCTURE_ROLE.md` | Added |
| `docs/compute-organism/Z_OMNISWARM_CLUSTER_MINIBOTS.md` | Added |
| `docs/compute-organism/Z_FORMULA_INFRASTRUCTURE_ENGINE.md` | Added |
| `docs/compute-organism/PHASE_ZCO_1_GREEN_RECEIPT.md` | Added |
| `data/examples/z_compute_node_registry.example.json` | Added |
| `data/examples/z_compute_swarm_roles.example.json` | Added |
| Hub index updates | `docs/INDEX.md`, `docs/AI_BUILDER_CONTEXT.md`, `docs/Z_SSWS_WORKSPACE_SPINE.md` |

## Acceptance (confirmed)

- [x] Z-Compute Organism framed as safe distributed infrastructure (not magic hardware)
- [x] Z-Arelium = protective nervous system / trust boundary
- [x] Z-OMNI, SWARM, MiniBots = observer / planner / explainer first
- [x] Z-Formulas = optimization, fairness, risk, reliability, receipts
- [x] Z-SSWS + AI Tower = builder guidance for Cursor and future agents
- [x] Phase receipt states **no runtime, no deployment, no hardware control**

## Explicitly not in ZCO-1

| Item | Posture |
| ---------------------------------------- | ------------------------- |
| Runtime orchestration / hardware scripts | **Forbidden** |
| Auto-overclock, PSU control, BIOS flash | **Forbidden** |
| Deploy, provider API, merge automation | **Forbidden** |
| Unified-motherboard physics claims | **Forbidden** |
| `npm run z:compute:*` scripts | Deferred (ZCO-2 proposal) |

## Law confirmation

- Turtle Mode: doctrine and examples only; implementation phases use `cursor/zsanctuary/zco-*` branches.
- 14 DRP supreme; AMK sacred authority for power, wiring, purchases, networking, deploy.
- Observe → verify → suggest → human decides; **GREEN ≠ deploy**.

## Verification (operator)

```bash
npx markdownlint-cli2 "docs/compute-organism/**/*.md"
npm run verify:md
npm run z:traffic
npm run z:car2
```

Record exit codes in PR notes. If full `verify:md` fails on pre-existing hub MD060 debt, ZCO paths may still pass isolated lint (see below).

## Verification evidence

| Check | Result |
| ------------------------------------------------- | ------------------------------------------------- |
| `markdownlint-cli2 docs/compute-organism/**/*.md` | Run after merge — expect **0** errors on ZCO pack |
| Runtime / hardware / deploy added | **None** in this phase |
| Example JSON valid | Manual / `node -e "JSON.parse(...)"` on examples |

## Rollback

Revert ZCO-1 commit; remove `docs/compute-organism/` and example JSON; restore index lines. Run `npm run verify:md`.

## Suggested next lane (human choice)

**ZCO-2:** read-only `z_compute_organism_status` report — new green receipt before any script.

## Locked law

```text
ZCO-1 = teach Cursor the project before building the project.
Z-SSWS + AI Tower = builder spine, not datacenter autopilot.
AMK-Goku owns sacred moves.
```
