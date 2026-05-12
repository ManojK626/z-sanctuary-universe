# Agents (Cursor & Any AI) — Z-Sanctuary Universe

When working in **this repo** or any **Z-Sanctuary-related project** (Organiser, Amk-Goku, SKYSCRAPER, etc.):

## When unsure: check the Hierarchy Chief first

**If you are unsure** about any of the following, **read this document first**:

- **[docs/Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md](docs/Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md)** — **Hierarchy Chief & Observer View**

**Cursor Build Master Doctrine (hub):** Before substantial builds, align with **[.cursor/rules/z-cursor-build-master-doctrine.mdc](.cursor/rules/z-cursor-build-master-doctrine.mdc)** — read **AI Builder context**, **Zuno technology snapshot**, **`data/zuno_state_snapshot.json`**, and **[docs/Z_SANCTUARY_MONSTER_PROJECT_MASTER_MAP.md](docs/Z_SANCTUARY_MONSTER_PROJECT_MASTER_MAP.md)** (+ **`data/z_sanctuary_monster_project_registry.json`**). Use slash **`/z-master-truth-pack`** for the full ritual; **`npm run z:monster:registry-verify`** for the catalog receipt.

Then use the authority order and layer definitions there. That document defines:

- **Who is the chief:** Z-Super Overseer AI (operational roof: Z-EAII + auto-run + Z-SSWS)
- **Full architecture:** Z-HODP (Head Organiser Dashboards), Z-EAII, Folder Manager AI, Zuno, Module Registry, Master Register
- **When to check which layer** so all works and upgrades stay **bullet** (aligned) with one vision

## What to check when unsure

- Where a new module or feature belongs
- Whether a change conflicts with the operational roof
- How dashboard, registry, vault, or state reports relate
- Which project owns a capability
- How to keep upgrades aligned with Z-EAII, Z-HODP, Folder Manager, and Zuno

## Deployment governance

See **[docs/Z_SANCTUARY_DEPLOYMENT_AWARENESS_PROTOCOL.md](docs/Z_SANCTUARY_DEPLOYMENT_AWARENESS_PROTOCOL.md)**. Deployment readiness, AI orchestration posture, Cloudflare framing, and deploy authority are defined there (readiness scores are advisory; automated formulas do not self-certify production). Seal: **[docs/PHASE_Z_SANCTUARY_DEPLOYMENT_AWARENESS_PROTOCOL_1_GREEN_RECEIPT.md](docs/PHASE_Z_SANCTUARY_DEPLOYMENT_AWARENESS_PROTOCOL_1_GREEN_RECEIPT.md)**.

**GitHub and email (ecosystem):** Use **[data/z_ecosystem_github_identity.json](data/z_ecosystem_github_identity.json)** and **[docs/Z-ECOSYSTEM-GITHUB-INTEGRATION.md](docs/Z-ECOSYSTEM-GITHUB-INTEGRATION.md)** for the canonical GitHub login, verified primary email, and setup—do not invent alternate accounts or emails for this hub.

**GitHub + AI and communications flows:** Read **[docs/Z-GITHUB-AI-COMMS-PRECAUTIONS.md](docs/Z-GITHUB-AI-COMMS-PRECAUTIONS.md)** and **[data/z_github_ai_comms_requirements.json](data/z_github_ai_comms_requirements.json)**; hub authority outranks cloud AI output. After requirement changes, operators run **`npm run comms:github-ai`**. Paths: **[core/z_github_ai_comms_refs.js](core/z_github_ai_comms_refs.js)**.

**Cloudflare (optional contingency / Task 008):** Edge hosting and dashboard **Ask AI** are **not** required for daily hub operation. For precautions, **[docs/Z-CLOUDFLARE-AI-COMMS-PRECAUTIONS.md](docs/Z-CLOUDFLARE-AI-COMMS-PRECAUTIONS.md)**, **[data/z_cloudflare_contingency_identity.json](data/z_cloudflare_contingency_identity.json)**, **`npm run comms:cloudflare-ai`**. Refs: **[core/z_cloudflare_ai_comms_refs.js](core/z_cloudflare_ai_comms_refs.js)**. Never commit API tokens or Account ID unless policy explicitly allows.

**AAFRTC (hub-only full verify in IDE):** Use **[docs/Z-AAFRTC-OVERSEER-IDE-PIPELINE.md](docs/Z-AAFRTC-OVERSEER-IDE-PIPELINE.md)** and **[data/z_aafrtc_policy.json](data/z_aafrtc_policy.json)**. Run **`npm run aafrtc:ci`** / **`aafrtc:full-core`** from **ZSanctuary_Universe** root only, or VS Code tasks **Z: AAFRTC —\***, so overseer gates stay aligned and multi-root workspaces do not mix projects. “Auto-approve” means the **preset pipeline** runs automatically — not waiving **`manual_release`** or human overseer authority.

**Hub npm verify (pick the right intent):** From **ZSanctuary_Universe** root, **`npm run verify:full:technical`** runs the long technical pipeline (lint, workspace tests, guards, Python audits, Zuno, dashboard registry verify, etc.) **without** the execution enforcer gate — use for strong day-to-day or pre-merge proof. **`npm run verify:full`** runs **`z_execution_enforcer_gate`** first, then the same technical chain; it stays blocked until release governance allows it (**`data/z_release_control.json`**, **`manual_release`**, and **`data/reports/z_execution_enforcer.json`**). **`npm run verify:ci`** is lighter (structure, registry omni, comms syncs, freshness, guardian) but **also starts with that gate**; if the gate is on hold, use individual tasks (e.g. **Z: Sanctuary Structure Verify**, **Z: Registry Omni Verify**) or **`verify:full:technical`** for depth without release sign-off.

**Cursor approvals (Allowlist / Run / Approve terminal):** Do **not** automate or bypass these UIs. Read **[docs/Z-AI-VISUAL-OVERLAY-CURSOR-APPROVALS-RESEARCH.md](docs/Z-AI-VISUAL-OVERLAY-CURSOR-APPROVALS-RESEARCH.md)** and **[data/z_visual_automation_boundary.json](data/z_visual_automation_boundary.json)** — use hub dashboard supervision, Z-Bridge logs, and named tasks instead of synthetic “human” input.

**When AI gives 2+ options or insights:** Use **[docs/Z-AI-MULTI-OPTION-MERGE-GUIDE.md](docs/Z-AI-MULTI-OPTION-MERGE-GUIDE.md)** and **[data/z_ai_option_merge_hints.json](data/z_ai_option_merge_hints.json)** — merge, select, or route per Hierarchy Chief; record in Master Register / module manifest / `z_pc_root_projects.json`. Refs: **[core/z_ai_option_merge_refs.js](core/z_ai_option_merge_refs.js)**.

**Markdown (Z_Labs golden + SSWS / shadows / mini-bots / Tower):** **[docs/MARKDOWN-AND-DOCS-GOVERNANCE.md](docs/MARKDOWN-AND-DOCS-GOVERNANCE.md)**, **[docs/Z-SSWS-MINI-BOT-AI-TOWER-MARKDOWN-RELAY.md](docs/Z-SSWS-MINI-BOT-AI-TOWER-MARKDOWN-RELAY.md)**, **[.cursor/rules/z-labs-context.mdc](.cursor/rules/z-labs-context.mdc)**, and **[.cursor/rules/z-markdown-hub-tables.mdc](.cursor/rules/z-markdown-hub-tables.mdc)** (when editing `*.md`). Commands: **`npm run lint:md`**, **`npm run verify:md`** (same as `lint:md`), **`npm run verify:hub:metadata`** (markdown + ZSX sync JSON + dashboard registry + folder blueprint — no enforcer/comms), **`npm run lint:md:fix`**, **`npm run md:table-compact`** (`--dry-run` / `--help`). CLI and `.vscode/settings.json` **`markdownlint.ignore`** exclude `**/node_modules/**` so dependency Markdown does not flood the Problems panel or CI. Do not edit this hub from a Z_Labs-only session.

**Z-SCTE (Self Creations Test Ecosystem) — big changes:** Before treating a long verify as “final,” follow **[docs/Z-SCTE-SELF-CREATIONS-TEST-ECOSYSTEM.md](docs/Z-SCTE-SELF-CREATIONS-TEST-ECOSYSTEM.md)**: inform Overseer-class surfaces (HODP, EAII, AI Tower, Zuno), refresh comms, get **human approval**, then run full scans. Manifest: **[data/z_scte_manifest.json](data/z_scte_manifest.json)**.

**New modules, new builds, safety, and keeping one spine:** Before adding modules, web routes, formulas, or partner touchpoints, read **[docs/Z-NEW-MODULE-DISCIPLINE.md](docs/Z-NEW-MODULE-DISCIPLINE.md)** (5-minute checklist, GGAESP/Z-ECR posture, which `npm run verify` to use). A **backup** copy for multi-root/Organiser worktrees lives at **`Z_Sanctuary_Universe 2/docs/governance/Z-NEW-MODULE-DISCIPLINE-BACKUP.md`** (sibling to this repo); keep them aligned when the discipline text changes.

**Universal Workstation Navigator (NAV-1) and operator pointers (NAV-2):** NAV-1 is the **hub-only**, **read-only** cockpit on the unified dashboard (`dashboard/Html/index-skk-rkpk.html`): category rail + service detail panel fed by **`dashboard/data/z_universe_service_catalog.json`** — visibility only (docs/report links), **no** execution, APIs, cloud memory, providers, or live bridge from that UI. **NAV-2:** Other Z-Sanctuary-related repos may **cite** the same posture in their operator docs; they **do not** inherit dashboard assets or runtime behavior by default. Any live cross-repo bridge requires **explicit charter + 14 DRP gate**. Docs: **[docs/dashboard/Z_UNIVERSE_WORKSTATION_NAVIGATOR.md](docs/dashboard/Z_UNIVERSE_WORKSTATION_NAVIGATOR.md)**, **[docs/dashboard/Z_UNIVERSE_SERVICE_CATALOG_POLICY.md](docs/dashboard/Z_UNIVERSE_SERVICE_CATALOG_POLICY.md)**, **[docs/dashboard/Z_UNIVERSE_NAVIGATOR_GREEN_RECEIPT.md](docs/dashboard/Z_UNIVERSE_NAVIGATOR_GREEN_RECEIPT.md)**.

## Full completions test run & communications flows

**Rule:** Perform a **full completions test run** to verify full workflows and communications flows so that no AI, mini-AI, or project feels disconnected — **every part feels one with the full core (PC/NAS > Cursor > AI)**; the **creator (AMK-Goku)** can operate the system from **even a smartphone, anywhere worldwide**, via communications flows. See [.cursor/rules/z-completions-test-and-comms-flow.mdc](.cursor/rules/z-completions-test-and-comms-flow.mdc) and [docs/Z-COMPLETIONS-TEST-AND-COMMUNICATIONS-FLOW.md](docs/Z-COMPLETIONS-TEST-AND-COMMUNICATIONS-FLOW.md); verification checklist §9.

## Outcome

Cursor AI or any other AI working on any Z-Sanctuary project should **check the Hierarchy Chief first when unsure**. That keeps the full view alive as one and ensures every change respects the hierarchy. When verifying release or onboarding, run the **full completions test run** (workflows & communications flows) so the system is one with the core and operable from anywhere.

## Cursor Cloud Agents — Turtle Mode (guarded worker)

Treat Cursor Agents as the **builder arm**, not an autopilot. Full instruction set lives in [.cursor/rules/z-turtle-mode-cursor-agents.mdc](.cursor/rules/z-turtle-mode-cursor-agents.mdc) (**always-on**).

**GitHub role (vault + gate + backup):** [docs/Z-GITHUB-SANCTUARY-GATE.md](docs/Z-GITHUB-SANCTUARY-GATE.md) — private repo first, protect **`main`**, CODEOWNERS, security features, **`npm run verify:sanctuary-github-pr`** for PR technical proof; **`verify:ci`** is a separate enforcer-aligned gate.

**Your Cursor settings (summary):**

- Turn **Create PRs** on; use branch prefix **`cursor/zsanctuary/`**; avoid direct edits on main.
- Keep **network** restricted — allow only Git host + package registries (and deps) you need.
- Keep **secrets** out of repos and minimal in Cursor secrets (no NAS admin, banking, or production vault material).
- Prefer **local + PR workflow** first; add **one** self-hosted worker later if needed; delay a **pool** until restore / green-gate discipline is solid.

Approved agent tasks: small fixes (paths, UI alignment), report scripts, docs, badges, small tests, PR hygiene. **Avoid** multi-module refactors, cloud deploy, secrets automation, payments, NAS remote admin, or changing core governance without a human gate.

## Cursor slash commands and subagents (this repo)

This workspace ships **project-level** Cursor integrations so AI and you share the same rituals across huge multi-root setups:

- **Slash commands** (type `/` in chat): [`.cursor/commands/`](.cursor/commands/) — e.g. `/z-chief`, `/z-master-truth-pack`, `/z-registry`, `/z-aafrtc`, `/z-omnai-first-observation`, `/z-cursor-folders`, `/z-indicators`, `/z-observe-projects`, `/z-emit-workspace`, `/z-full-verify`, `/z-cf-task008-roadmap`, `/z-critical-bug-hunter`. Each file is a reusable workflow prompt plus exact commands to run.
- **Hub folder spine (Zuno ritual):** [docs/Z-CURSOR-FOLDER-STRUCTURE-AND-AI-WORKFLOWS.md](docs/Z-CURSOR-FOLDER-STRUCTURE-AND-AI-WORKFLOWS.md) — blueprint JSON + `npm run cursor:folders` / `:apply` / `:verify` so Cursor and verifiers agree on layout across versions.
- **Custom subagents**: [`.cursor/agents/`](.cursor/agents/) — `z-overseer-verify` and `z-shadow-align` are **read-only**, **fast** helpers for verification and PC-root list alignment without touching sibling repos. **`z-critical-bug-hunter`** is **manual-only**: high-severity correctness template ([docs/Z-CRITICAL-BUG-HUNTER-BRIEF.md](docs/Z-CRITICAL-BUG-HUNTER-BRIEF.md)); investigation-first, no PR without approval.

When you use **`Z_All_Projects.code-workspace`**, Cursor merges roots; commands and agents from **ZSanctuary_Universe** still apply when that folder is part of the workspace. To install the same slash commands and subagents at **PC root** (Organiser) without manual copying, from this repo run:

- `npm run cursor:sync-pc-root-config` — **dry-run** (lists what would be copied)
- `npm run cursor:sync-pc-root-config:apply` — copy into `pc_root/.cursor/commands` and `.../agents` (skips existing files)
- `npm run cursor:sync-pc-root-config:apply-force` — copy and **overwrite** existing files

Or use tasks **Z: Sync Cursor Config to PC Root (dry-run)** and **Z: Sync Cursor Config to PC Root (apply)**.

**Growth mode (dashboard):** use the **Growth: Calm / Normal** control next to the lens chips to slow client-side mirror polling on heavy days (`core/z_growth_mode.js`).
