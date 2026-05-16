# Z-Sanctuary — Operational technology layers

**Status:** Phase 0 doctrine — how external tools **layer** on the hub without becoming its soul.  
**Hub truth:** PC/NAS + governance docs + registries + human gates remain authoritative.

---

## Core principle

```text
Use layered tools — NOT as the soul of the ecosystem.
```

| Layer | Role in one line |
| ----- | ---------------- |
| **Cursor AI** | Builder / operator companion (docs, mocks, PR-sized work) |
| **GitHub** | Vault + review gate + backup history |
| **Cloudflare** | Future edge / runtime shield (optional, phased) |
| **Z-DAIO** | Governance + continuity + orchestration **posture** (doctrine + surfaces) |
| **Z-ADTF** | Federation continuity **observatory** (validation + receipts) |
| **Samsung ecosystem** | Portable federation surfaces (operator-tested) |
| **Mini PC** | Continuity core (headless when HDMI path verified) |
| **NAS** | Memory vault (**NAS_WAIT** until mount + policy) |

Nothing in this table grants **autonomous authority** to a vendor or device fabric.

---

## Standing laws (seal with Z-ADTF)

```text
federation ≠ authority
topology ≠ ownership
observe → verify → suggest → human decides
readiness ≠ deploy
```

---

## 1. Cursor AI — strongest near-term builder arm

**Why it fits:** doctrine-heavy, multi-module, governance-first, phased, topology-aware.

### Keep using

- Branch-per-phase (`cursor/zsanctuary/*`)
- Docs-first and Turtle Mode
- PR review discipline; static mock UI before runtime
- Simulation-only lanes where chartered (`npm run z:anydevice:simulate`, etc.)
- `npm run verify:md` and targeted verify scripts
- Green receipts per phase

### Cursor rules (permanent hooks — not the soul)

Existing always-on rules include Turtle Mode, Hierarchy Chief, control root awareness, build master doctrine, GitHub/Cloudflare comms precautions. **Planned consolidation:** `.cursor/rules/z-sanctuary-core.mdc` as a thin **index** to this doc and 14 DRP — without duplicating long doctrine in the rule file.

### Forbidden for Cursor in this ecosystem

- Hidden runtime or silent networking
- Auto-deploy or auto-merge
- Uncontrolled package installs
- Fake authority or “autonomous organism” marketing

Refs: [.cursor/rules/z-turtle-mode-cursor-agents.mdc](../.cursor/rules/z-turtle-mode-cursor-agents.mdc), [AGENTS.md](../AGENTS.md).

---

## 2. GitHub — sacred vault

**Role model** (from [Z-GITHUB-SANCTUARY-GATE.md](Z-GITHUB-SANCTUARY-GATE.md)):

```text
Cursor builds → GitHub verifies → Human approves → Sanctuary records
```

### Use GitHub for

- Version history and rollback
- PR review and branch discipline
- Documentation and architecture receipts
- Release tags as **phase receipts** (e.g. `Z-DAIO-v0.2.9-freeze` with docs, screenshots, topology notes)

### Defer / avoid for now

- Massive Actions automation empires
- Auto-deploy pipelines and auto-merge bots
- Required heavy gates before observation PRs prove the runner

### Later (aligns with Turtle Mode)

- Protected `main`: PR review, checks, no force push
- CODEOWNERS and sanctuary PR verify when stable

---

## 3. Cloudflare — powerful, later, minimal now

**Rule:** Cloudflare ≠ early-stage local federation. Hub authority: [Z-CLOUDFLARE-AI-COMMS-PRECAUTIONS.md](Z-CLOUDFLARE-AI-COMMS-PRECAUTIONS.md).

### Phased preset (future base)

| Phase | Use | Not yet |
| ----- | --- | ------- |
| **Now** | Doctrine + `npm run comms:cloudflare-ai` manifest sync | Complex edge orchestration, exposed tunnels everywhere |
| **Later** | **Pages** — static Z-DAIO demos, governance docs, topology mockups | NAS or RDP on public internet |
| **Later** | **Zero Trust** — access posture review (tunnel-first thinking) | “Always-open federation” |
| **Much later** | **Workers** — only with charter + register entry | Runtime federation as authority |
| **Future** | Federation **research** docs only | Production bind without AMK gate |

### Strongest warnings

- Do **not** expose NAS, raw RDP, or raw services publicly
- Do **not** let edge become the sole system of record for governance

---

## 4. Z-DAIO — operational ecosystem posture

Z-DAIO names the **governance + continuity + orchestration posture** across command wall, topology, pathways, and receipts — implemented as **docs, dashboards, and human-visible surfaces**, not silent cross-device control.

Cloud and devices **display** posture; they do **not** replace Hierarchy Chief or release gates.

---

## 5. Z-ADTF — federation continuity observatory

When Z-ADTF Phase 0 is on `main`: [z-adtf/Z_ADTF_MASTER_FRAMEWORK.md](z-adtf/Z_ADTF_MASTER_FRAMEWORK.md).

- Tests **federation posture**, not dangerous infrastructure control
- Real-world validation loop **before** mock observatory UI
- Complements [Z_ANYDEVICE_AI_CAPSULE.md](Z_ANYDEVICE_AI_CAPSULE.md) and [Z_ANYDEVICE_SYNTHETIC_SIMULATION.md](Z_ANYDEVICE_SYNTHETIC_SIMULATION.md)

---

## 6. Device and travel layer (operator-sovereign)

| Device | Declared role |
| ------ | ------------- |
| Phone | Emergency / operator |
| Tablet | Main cockpit |
| Mini PC | Continuity core |
| NAS | Backup memory (gated) |
| TV / projector | Command wall (DeX / HDMI — visibility) |

**Before serious cloud expansion:** complete real-world continuity learning (e.g. travel / Mauritius operator cycle) so you learn what must stay local vs what truly needs edge.

---

## What you are building (north star)

Not “another remote desktop tool” or “another automation platform.”

> A governance-first **operational continuity ecosystem**: trusted surfaces, federation posture, topology awareness, orchestration pathways, and **human-visible control** — with Cursor, GitHub, and Cloudflare each in **layered**, bounded roles.

---

## Related hub docs

| Topic | Doc |
| ----- | --- |
| GitHub gate | [Z-GITHUB-SANCTUARY-GATE.md](Z-GITHUB-SANCTUARY-GATE.md) |
| GitHub + AI comms | [Z-GITHUB-AI-COMMS-PRECAUTIONS.md](Z-GITHUB-AI-COMMS-PRECAUTIONS.md) |
| Cloudflare | [Z-CLOUDFLARE-AI-COMMS-PRECAUTIONS.md](Z-CLOUDFLARE-AI-COMMS-PRECAUTIONS.md) |
| Hierarchy | [Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md](Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md) |
| Builder briefing | [AI_BUILDER_CONTEXT.md](AI_BUILDER_CONTEXT.md) |
| Receipt | [PHASE_Z_OPERATIONAL_TECHNOLOGY_LAYERS_0_GREEN_RECEIPT.md](PHASE_Z_OPERATIONAL_TECHNOLOGY_LAYERS_0_GREEN_RECEIPT.md) |
