# Z-Local Operator Node (Z-LOCAL-OPERATOR-NODE-1)

**Phase:** Z-LOCAL-OPERATOR-NODE-1 — docs-first architecture plan.  
**Hardware anchor:** AMK-Goku Windows Mini PC as a **governed local operator surface** for Z-Sanctuary hub work.  
**Non-goal:** This document does **not** authorize autonomous systems, background daemons, scheduled production mutation, or silent cross-cloud execution.

---

## 1. Mission and non-mission

### Mission

Position the Mini PC as a **local sovereign operator node** that supports:

- **Z-CPU / Z-OVNI hybrid observability** — read-only posture and receipts (CPU load, thermal headroom, and “OVNI-class” visibility metaphors stay **symbolic or dashboard-bound** until separately chartered).
- **PowerShell operator workflows** — human-run bundles, dry-run defaults, verification rhythm (see [Z_POWERSHELL_OPERATOR_BOOST.md](Z_POWERSHELL_OPERATOR_BOOST.md) when that doc is merged).
- **Read-only minibot coordination** — traffic, CAR², cycle observe, deployment readiness rollups as **suggest-only** inputs.
- **Project registry awareness** — EAII / PC root registries as **read** sources; no satellite bridge writes without manifest and review.
- **Local backup and indexing roadmap** — **planning and receipts** first; execution stays human-gated and off sacred paths until chartered.
- **Deployment readiness observation** — consume `npm run z:deployment:readiness` outputs; **not** deploy.
- **Cloudflare / GitHub / Cursor coordination** — **through human approval gates** only; docs and PR workflow, not API autopilot.

### Non-mission

- Not a second “hub brain” that overrides AMK-Goku.  
- Not an auto-healer, auto-merger, or auto-deployer.  
- Not a secrets vault, key rotator, or billing agent.  
- Not unattended production or edge mutation.

---

## 2. Architecture layers (conceptual)

Layers are **logical** for Phase A; physical mapping (folders, drives, NAS) is decided later with receipts.

### Local Memory / Backup Core

Local disks and (when mounted and chartered) NAS-adjacent paths used for **operator-owned backups**, index staging, and restore drills. **Planning and manifests before bulk copy.** No hub script may assume NAS is mounted.

### PowerShell Operator Core

The interactive shell as **cockpit**: `cd` to hub root, run named `npm` verify and read-only report scripts, inspect `git status`. Optional future: thin helper scripts that default to **dry-run** and print next safe commands only.

### Read-only Minibot Fleet

Existing hub scripts that **write receipts** under `data/reports/` (traffic, cycle observe, CAR², deployment readiness, etc.). The node **runs** them when the operator invokes them; it does **not** schedule them autonomously in this phase.

### Z-CPU / Z-OVNI Supervisor Layer

**Supervision = visibility + classification**, not control. CPU and system health inform **when** to run heavy verify (avoid thermal or disk pressure spikes). “OVNI” overlays in UI remain **non-authoritative** unless a future phase defines explicit, human-approved telemetry contracts.

### Cursor / GitHub / Cloudflare Bridge Awareness

- **Cursor:** Turtle Mode branches, local edit, PR to `main`; no auto-merge (see [AGENTS.md](../AGENTS.md)).  
- **GitHub:** PR review, CI as signal; no PAT in repo.  
- **Cloudflare:** [Z-CLOUDFLARE-AI-COMMS-PRECAUTIONS.md](Z-CLOUDFLARE-AI-COMMS-PRECAUTIONS.md) — preview posture and governance; **no** API mutation from this node doctrine.

### AMK Human Approval Gate

Every **sacred move** (merge, deploy, edge bind, secrets, NAS class, billing) stops at **AMK-Goku / human**. Local power and fast disks do **not** reduce that gate.

---

## 3. Allowed early actions (Phase A–B)

- Read-only scans and structure/registry verifiers.  
- Report generation via documented `npm run …` commands.  
- Markdown and table hygiene (`npm run verify:md`, table compact dry-run first).  
- Local indexing **design** (what to index, retention, exclude secrets).  
- Backup **planning** (what to snapshot, RPO/RTO notes).  
- Task routing **suggestions** from cycle observe queue — **pick branch manually**.

---

## 4. Forbidden early actions

- Auto-deploy, auto-merge, or CI-driven production promotion without human gate.  
- Autonomous Cloudflare mutation (zones, Workers, WAF, SSL strict mode) from scripts “helping” the node.  
- Secrets writes, PAT storage in repo, or credential rotation from automation.  
- Uncontrolled shell execution (e.g. piping remote curl to sh, arbitrary `Invoke-Expression` on fetched content).  
- Billing or payment actions.  
- Unattended production configuration changes.

---

## 5. Phase roadmap

### Phase A (this phase)

Docs + optional registry/manifest entries **only when** a future phase needs a machine ID row; **no** new automation. Receipt: [PHASE_Z_LOCAL_OPERATOR_NODE_1_GREEN_RECEIPT.md](PHASE_Z_LOCAL_OPERATOR_NODE_1_GREEN_RECEIPT.md).

### Phase B

PowerShell operator menu extensions and **local** report refresh rituals; still **operator-invoked** only.

### Phase C

Approval-gated **assisted** execution (e.g. scripted steps that require explicit env flag + AMK confirmation pattern) — chartered separately; not implied by this doc.

### Phase D

Optional local AI model or heavy indexing **only after** governance, privacy, and DRP review — default **off**.

---

## 6. Safety laws

1. **Observe → verify → suggest → human decides.**  
2. **Readiness is not permission** — green or blue receipts are informational until policy and humans say otherwise.  
3. **Local power is not autonomous authority** — fast hardware does not bypass Turtle Mode or sacred gates.  
4. **PC activation receipt is not execution approval** — `npm run z:pc:activation` and `data/reports/z_pc_activation_receipt.*` are **read-only posture**; they do not grant queue execution (see [Z_PC_ACTIVATION_AWARENESS.md](Z_PC_ACTIVATION_AWARENESS.md)).

---

## 7. Relationship to existing systems

| System | Relationship |
| ------ | ------------ |
| **Z-SSWS** | Workspace spine and IDE discipline; node runs SSWS-aligned tasks **manually** from the hub root. |
| **Z-MAOS** | Queue and charter awareness; node consumes MAOS-adjacent **docs**, not silent execution. |
| **Z-Traffic** | [Z_TRAFFIC_MINIBOTS.md](Z_TRAFFIC_MINIBOTS.md) — minibots posture; node may refresh traffic reports when operator runs `npm run z:traffic`. |
| **Deployment Readiness Overseer** | [Z_DEPLOYMENT_READINESS_OVERSEER.md](Z_DEPLOYMENT_READINESS_OVERSEER.md) — read-only rollup; node displays or files only. |
| **PC Activation Awareness** | [Z_PC_ACTIVATION_AWARENESS.md](Z_PC_ACTIVATION_AWARENESS.md) — activation receipt; visibility, not permission to run verify pipelines automatically. |
| **PowerShell Operator Boost** | [Z_POWERSHELL_OPERATOR_BOOST.md](Z_POWERSHELL_OPERATOR_BOOST.md) — command bundles for this node (link valid when that doc is merged). |
| **Z-OMNI Visual Workstation Engine** | [Z_OMNI_VISUAL_WORKSTATION_ENGINE_CHARTER.md](Z_OMNI_VISUAL_WORKSTATION_ENGINE_CHARTER.md) — future panel/manifest UX; node can host **browser** sessions to dashboards; generation stays governed. |
| **Cloudflare Edge Governance** | [Z-CLOUDFLARE-AI-COMMS-PRECAUTIONS.md](Z-CLOUDFLARE-AI-COMMS-PRECAUTIONS.md) — human-mediated edge changes only. |
| **Z-CYCLE-OBSERVE-1** | [Z_CYCLE_OBSERVE_SYSTEM.md](Z_CYCLE_OBSERVE_SYSTEM.md) — observer writes queue lines; node **does not** auto-execute the queue. |

---

## 8. Provider instability (operational maturity)

When a cloud or DNS provider shows **active instability**, default posture:

**Hold → observe → document → stabilize** before edge mutations (SSL strict, WAF, Workers). No “emergency” infra change without AMK-class approval and rollback plan.

Extended pattern (for future doctrine): **Observe → verify → approve → mutate → verify again.**

---

## 9. Revision

| Version | Note |
| ------- | ---- |
| Z-LOCAL-OPERATOR-NODE-1 | Initial docs-first plan; no runtime automation shipped in this phase. |
