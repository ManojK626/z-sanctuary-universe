# Z-SCTE — Self Creations Test Ecosystem

**Purpose:** A **communications-first** loop so new or upgraded “self-creations” (modules, bots, dashboard surfaces, AI Tower paths, colony apps) **reach every major Overseer-class surface** before anyone treats a long scan as authority. After **human feedback and explicit approval**, operators run **full health scans** to stay aligned, future-proof, and honest about **Z-Communications flows** (GitHub, Cloudflare, AAFRTC, Whale Bus, SSWS/SSWSs, Zuno). **Advisory and human-gated** — not auto-destructive execution.

**Machine-readable index:** [data/z_scte_manifest.json](../data/z_scte_manifest.json) · **print in terminal:** `npm run scte:print` · VS Code task **Z: SCTE — print comms order (manifest)**

**Zuno & I view:** This is the **ritual** that orders _who hears first_ and _when heavy verify runs_; it does not replace the Hierarchy Chief, vault policy, or release gates.

---

## 1. Why Z-SCTE exists

| Gap without SCTE | What Z-SCTE adds |
| --------------------------------------- | ---------------------------------------------------------------------------- |
| A full `verify` run without prior comms | **Silence the stack** (Overseer surfaces never saw the plan) |
| AI Tower / shadows out of sync | **Explicit** refresh path (comms + surfaces) before “100%” claims |
| Comms files stale | **Refresh first**, then Zuno, then scans (order in manifest) |
| “We are future-proof” with no evidence | **After** approval: structured scans + `zuno_system_state_report` as receipt |

“100%” here means **evidence in reports after the approved ritual**, not a guarantee against unknown external change.

---

## 2. Communications first (in order)

Post or route awareness so **all** of these can react before a heavy scan is treated as final:

1. **Z-Super Overseer (operational roof)** — Canonical spec lives in the Organiser repo: `docs/Z-SUPER-OVERSEER-AI.md` (not inside this hub). See [Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md](Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md). EAII, launcher, and watcher discipline stay authoritative.
2. **Z-HODP** — Control Centre, Z Blueprint, Panel Directory: [`dashboard/Html/index-skk-rkpk.html`](../dashboard/Html/index-skk-rkpk.html). Operators and creators see the same “roof.”
3. **Z-EAII / registry** — `data/z_pc_root_projects.json`, Organiser `z-eaii-registry.json` (when updating roster or PC roots).
4. **AI Tower + colony surfaces** — `data/reports/z_ai_status.json`, ecosphere ledger; refresh after comms: `npm run z:whale-bus:comms+surfaces` (or `+zuno` per your ritual). [Z-SSWS-ALL-PROJECTS-AND-AI-COLONY-BLUEPRINT.md](Z-SSWS-ALL-PROJECTS-AND-AI-COLONY-BLUEPRINT.md).
5. **Zuno** — State and reflection: `node scripts/z_zuno_state_report.mjs` · [`dashboard/z-ai-ecosphere/index.html`](../dashboard/z-ai-ecosphere/index.html) (Zuno copy/export panel).

**Comms truth (refresh timestamps):** `npm run comms:github-ai` · `npm run comms:cloudflare-ai` · `node scripts/z_aafrtc_resolve.mjs` — then re-run Zuno so external observers in the report are not misleadingly **stale**.

---

## 3. Feedback and approval gate

- **Who approves:** You (and **Z-OSHA / release governance** where your `z_release_control.json` and execution enforcer apply). Mini-bots and Zuno **do not** grant release.
- **What to capture:** One short note (dashboard note, `data/reports/`, or task) answering: _What changed?_ · _Risks?_ · _Rollback?_ · _Comms touched?_
- **Only after approval:** run “full” verification chains below, or schedule them in your SSWS/CI window.

---

## 4. Full scans (after approval)

Pick depth for the day; **not** all at once without intent.

| Intent | Command or task (from hub root unless noted) |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Deep technical (no enforcer first)** | `npm run verify:full:technical` (see [AGENTS.md](../AGENTS.md) for gate vs technical split) |
| **CI / gate as policy allows** | `npm run verify:ci` — respects execution enforcer when used |
| **Structure + registry + omni** | `Z: Sanctuary Structure Verify` · `Z: Registry Omni Verify` (or `node scripts/...` equivalents) |
| **Awareness + decision stack** | `npm run bot:awareness:plus` (guardian → … → strategy) |
| **Zuno full report (receipt)** | `node scripts/z_zuno_state_report.mjs` |
| **Ecosphere + transparency** | `npm run ai:ecosphere:refresh` · ecosphere HTML in `docs/public/z_ecosphere_transparency_report/` as needed |
| **Completions test (workflows + comms)** | [Z-COMPLETIONS-TEST-AND-COMMUNICATIONS-FLOW.md](Z-COMPLETIONS-TEST-AND-COMMUNICATIONS-FLOW.md) and verification checklist (Section 9 in that flow) |

**Future-proofing** in practice: registry aligned with disk, comms not stale, Zuno green enough for your risk, duplicate/conflict lists (e.g. DSR) trending down, and **documentation** (this file + INDEX) updated when the ritual changes.

---

## 5. Relationship to other docs

- [Z-COMPLETIONS-TEST-AND-COMMUNICATIONS-FLOW.md](Z-COMPLETIONS-TEST-AND-COMMUNICATIONS-FLOW.md) — _unity_ of workflows and comms. Z-SCTE is a **concrete order of operations** for big changes.
- [Z-ECOSYSTEM-CAUSE-EFFECT-MARKET-MAP.md](Z-ECOSYSTEM-CAUSE-EFFECT-MARKET-MAP.md) — external _why_; Z-SCTE is _how we verify after we decide_.
- [Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md](Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md) — authority order; SCTE defers to it.

---

## 6. Experience cycles (pattern intelligence) — before expanding the stack

**Position:** With **no** or **little** data in `data/logs/z_decision_history.jsonl`, `z_bot_patterns.json` will show **zero patterns**. That is **expected**: the stack detects and decides; **repetition** (and human lifecycle actions) feeds the learning layer. Silence is not failure; fake “patterns” from one-off noise would be worse.

**Phase lock (operator rule):** Prefer **controlled real experience** over new features until `reopen_count` and pattern rows have meaning. Strategy and prediction stay **advisory**; without history they are thin by design.

**Controlled exercise (example shape):**

1. Introduce a **small, reversible** mismatch the Guardian can see (e.g. registry path vs folder name), or reuse a known class of issue **on purpose** for a drill.
2. Run `npm run bot:awareness` or `npm run bot:awareness:plus`, use the **decision** lifecycle (ack / resolve / dismiss) via `dashboard/panels/z_decision_panel.html` + bridge, or `npm run bot:decision:act`, so events append to `data/logs/z_decision_history.jsonl`.
3. After **repeat** cycles on the same decision class, run `npm run bot:pattern` · `npm run bot:rootcause` · `npm run bot:predict` · `npm run bot:adaptive` · `npm run bot:strategy`, then `npm run zuno:state`. Read `z_bot_patterns.json` and Zuno **as evidence**, not as authority.

**What to defer until experience exists:** full NAS-wide auto-sync “intelligence,” Cloudflare auto-deployment agents, multi-agent **autonomous** execution, or swarm-style autonomy. Keep **human confirmation** on execution paths you already defined.

**Tools vs roles (grounded):** Use **Cursor** for build and reasoning; use **VS Code** (tasks, structure, guards) as the **stable control plane**. PC root + registry remain the **reality source**; the bot chain is the **observer**, not a replacement for policy or release gates.

---

## 7. Changelog

| Date (ISO) | Note |
| ---------- | ------------------------------------------------------------------------------------ |
| 2026-04-25 | Initial Z-SCTE: comms order, approval gate, scan menu, ecosphere + Zuno alignment. |
| 2026-04-25 | Section 6: experience cycles, pattern intelligence, phase lock, deferred expansions. |
