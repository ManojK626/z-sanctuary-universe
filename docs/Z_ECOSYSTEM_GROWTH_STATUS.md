# Z-Sanctuary ecosystem growth status

**Phase spines:** Z-AI-BUILDER-AWARENESS-2 (growth catalog), **Z-CURSOR-AWARENESS-3** (Cycle Observe sealed in Cursor / overseer rules), **Z-CYCLE-DASHBOARD-1** (read-only ecosystem nervous system UI — not a control plane), and **Z-DEPLOYMENT-READINESS-OVERSEER-1** (read-only deployment posture rollup — not deploy authority).

**Machine roster:** `data/z_ecosystem_growth_stage_registry.json` (`z_ecosystem_growth_stage_registry_v1`).

## Sealed systems (latest)

| Seal | Role in one line |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Z-SSWS IDE** | Main **operator cockpit** — hub-aligned doctrine, tasks, and workspace spine; not silent full-system auto-launch. |
| **Z-CONTROL-LINK-1** | **Canonical hub + thin satellite bridge** — `docs/Z_SANCTUARY_CONTROL_LINK.md` per approved satellite; `npm run z:control-links:dry` default. |
| **Z-DOORWAY-2** | **Governed workspace opener** — `data/z_doorway_workspace_registry.json`, explicit human-run helpers; see [AMK_PROJECT_DOORWAY_LAUNCHER.md](AMK_PROJECT_DOORWAY_LAUNCHER.md). |
| **Z-DOORWAY-3** | **Doorway telemetry / session receipts** — read-only status JSON/MD and optional `z_doorway_session_log.jsonl` tail via `z_doorway_workspace_status.mjs` / `npm run z:doorway:status`. |
| **Z-CRYSTAL-DNA-1** | **Asset identity mesh** — [Z_CRYSTAL_DNA_MESH.md](Z_CRYSTAL_DNA_MESH.md), `data/z_crystal_dna_asset_manifest.json`. |
| **Z-CRYSTAL-DNA-2** | **Living Crystal map** — [Z_CRYSTAL_DNA_VISUALIZATION.md](Z_CRYSTAL_DNA_VISUALIZATION.md), `dashboard/panels/z-crystal-dna-map.html`. |
| **Z-CRYSTAL-DNA-3** | **Drift / integrity awareness** — [Z_CRYSTAL_DNA_DRIFT_AWARENESS.md](Z_CRYSTAL_DNA_DRIFT_AWARENESS.md), `npm run z:crystal:dna:drift`. |
| **Z-ANYDEVICE-AI-CAPSULE-1** | **Device trust / capability governance** — [Z_ANYDEVICE_AI_CAPSULE.md](Z_ANYDEVICE_AI_CAPSULE.md), registry only. |
| **Z-ANYDEVICE-2** | **Synthetic device simulation** — [Z_ANYDEVICE_SYNTHETIC_SIMULATION.md](Z_ANYDEVICE_SYNTHETIC_SIMULATION.md), `npm run z:anydevice:simulate`. |
| **Z-CYCLE-OBSERVE-1** | **Observation tower + safe task queue** — [Z_CYCLE_OBSERVE_SYSTEM.md](Z_CYCLE_OBSERVE_SYSTEM.md), `npm run z:cycle:observe`; queue is **suggest-only** until AMK/human picks a branch. |
| **Z-CYCLE-DASHBOARD-1** | **Read-only nervous system UI** — [Z_CYCLE_DASHBOARD_SYSTEM.md](Z_CYCLE_DASHBOARD_SYSTEM.md), `dashboard/panels/z-cycle-dashboard-readonly.html`; GET JSON only — **not** a control plane. |
| **Z-DEPLOYMENT-READINESS-OVERSEER-1** | **Deployment readiness overseer (read-only)** — [Z_DEPLOYMENT_READINESS_OVERSEER.md](Z_DEPLOYMENT_READINESS_OVERSEER.md), `npm run z:deployment:readiness`; rollup JSON/MD from registries + receipts — **not** deploy or merge authority. |
| **Cloudflare governance** | **Preview / runtime posture only**; **production HOLD** — [Z-CLOUDFLARE-AI-COMMS-PRECAUTIONS.md](Z-CLOUDFLARE-AI-COMMS-PRECAUTIONS.md), [AGENTS.md](../AGENTS.md). |
| **Casa AI Builder** | **Suggest docs / prompts / checklists only** — no device, deploy, or secret authority; see AnyDevice capsule and simulation docs. |

## Communication rules (AI Tower / overseers / Cursor AI Builder)

**May:** observe, classify, summarize, and suggest (including routing operators to receipts and verify commands).

**Must not:** autonomous deploy; secret writes; arbitrary PC scans; real device scanning; NAS mutation; automatic repair; production Cloudflare binding.

**Sacred authority:** **AMK-Goku / human** remains authority for merge, deploy, NAS-class moves, billing, production edge bind, and sacred gates named in hub doctrine.

## Z-CYCLE-OBSERVE-1 and Cursor (Z-CURSOR-AWARENESS-3)

**Z-CYCLE-OBSERVE-1** is the **continuous observation tower** (sealed): it **generates** a safe `task_queue` in `data/reports/z_cycle_observe_status.json` but **does not execute** it.

- **`overall_observer_signal` BLUE** = **informational / governed awareness** (e.g. drift or sequencing rolled up) — **not** a failure verdict and **not** auto-remediation permission.
- Cursor may **read** the cycle observe report and **suggest** the next Turtle Mode branch (`cursor/zsanctuary/…`); Cursor **must not** auto-run queue items, deploy, merge, push, install, start services, mutate NAS, connect real devices, auto-repair files, or touch secrets.
- **AMK / human** decides which queue line (if any) becomes real work; flow stays **small branch → verify gates → human review → merge**.

## Z-CYCLE-DASHBOARD-1 (read-only UI)

**Z-CYCLE-DASHBOARD-1** is the **read-only ecosystem nervous system dashboard**: it **visualizes** `z_cycle_observe_status.json` and related receipts via **GET** only. It **must not** execute the task queue, run npm, create branches, deploy, mutate registries, or rewrite docs. Use it to reduce overload; sacred execution stays with **AMK / human** and normal Turtle workflow.

## Ecosystem feedback

| Dimension | Status |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Current growth stage** | Governed organism foundation — spine docs, registries, and read-only validators before execution lanes widen. |
| **Behavior pattern** | Read-only **awareness** expanding faster than **execution** — by design. |
| **Strength** | Topology + drift (Crystal DNA), device trust + synthetic sim (AnyDevice), doorway control + telemetry receipts, Cloudflare **preview** posture, **GitHub** as truth for change control. |
| **Risk to avoid** | Too much **automation** before **observability** (reports, drift, traffic, indicators) stabilizes. |
| **Recommended next lanes** | Continue **AI Builder awareness** receipts; then **Z-Lab supervised analysis doctrine** so analysis stays human-gated and evidence-first. |

## Verify hooks (awareness receipts)

```bash
npm run z:deployment:readiness
npm run z:pc:activation
npm run z:cycle:observe
npm run verify:md
npm run z:anydevice:simulate
npm run z:crystal:dna:drift
npm run z:traffic
npm run z:car2
```

## Related

| Doc | Role |
| -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| [Z_CYCLE_OBSERVE_SYSTEM.md](Z_CYCLE_OBSERVE_SYSTEM.md) | Z-CYCLE-OBSERVE-1 observation tower + safe task queue (read-only). |
| [Z_CYCLE_DASHBOARD_SYSTEM.md](Z_CYCLE_DASHBOARD_SYSTEM.md) | Z-CYCLE-DASHBOARD-1 read-only ecosystem nervous system dashboard (UI). |
| [AI_BUILDER_CONTEXT.md](AI_BUILDER_CONTEXT.md) | Primary Cursor / AI Builder briefing (includes this phase block). |
| [PHASE_Z_AI_BUILDER_AWARENESS_2_GREEN_RECEIPT.md](PHASE_Z_AI_BUILDER_AWARENESS_2_GREEN_RECEIPT.md) | Seal receipt for this awareness pass. |
| [PHASE_Z_CURSOR_AWARENESS_3_GREEN_RECEIPT.md](PHASE_Z_CURSOR_AWARENESS_3_GREEN_RECEIPT.md) | Z-CURSOR-AWARENESS-3 — Cycle Observe in Cursor / overseer doctrine. |
| [PHASE_Z_CYCLE_DASHBOARD_1_GREEN_RECEIPT.md](PHASE_Z_CYCLE_DASHBOARD_1_GREEN_RECEIPT.md) | Z-CYCLE-DASHBOARD-1 dashboard UI seal receipt. |
| [Z_DEPLOYMENT_READINESS_OVERSEER.md](Z_DEPLOYMENT_READINESS_OVERSEER.md) | Z-DEPLOYMENT-READINESS-OVERSEER-1 read-only deployment posture rollup. |
| [PHASE_Z_DEPLOYMENT_READINESS_OVERSEER_1_GREEN_RECEIPT.md](PHASE_Z_DEPLOYMENT_READINESS_OVERSEER_1_GREEN_RECEIPT.md) | Phase receipt for deployment readiness overseer. |
