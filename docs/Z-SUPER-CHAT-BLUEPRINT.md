# Z-All-in-One Super Chat Blueprint

## Purpose

Define a safe, local-first architecture for a single **voice + text** chat surface that can use knowledge from all registered Organiser roots and route to existing Z systems (Z-EAII, Overseer, SSWS, Folder Manager, verifier flows) without bypassing governance.

This blueprint is planning-first. It does not publish external APIs and does not require cloud exposure.

---

## Scope

- In scope:
  - Cross-project read/search and citations from PC-root projects.
  - Voice + text input into one chat experience.
  - Router for specialist AI/tool paths with policy gates.
  - Approval gates for write actions.
  - Evidence trails and replayable decision logs.
- Out of scope (initial phases):
  - Autonomous write actions without approval.
  - Public internet exposure by default.
  - Vault exfiltration or raw secret rendering.

---

## Ground Truth and Authority

- Cross-project Q&A discipline (registry-first, pathways, follow-up vs autonomy): [Z-AI-QADP-QUESTIONS-ANSWERS-DIRECTED-PATHWAYS.md](Z-AI-QADP-QUESTIONS-ANSWERS-DIRECTED-PATHWAYS.md)
- PC root and project list: `C:\Cursor Projects Organiser\z-eaii-registry.json`
- Generated multi-project list for hub logic: `data/z_pc_root_projects.json`
- Hub security policy: `rules/Z_SANCTUARY_SECURITY_POLICY.md`
- Hierarchy chief and authority order: `docs/Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md`
- Completions and communications flow: `docs/Z-COMPLETIONS-TEST-AND-COMMUNICATIONS-FLOW.md`
- Formula and DRP anchors: `docs/Z-ULTRA-INSTINCTS-AND-FORMULAS.md`, `docs/Z-DRP-VERIFIER-CHECKLIST.md`

---

## Architecture (Seven Spines)

1. **Ingestion Spine**
   - Indexes docs/code/reports from registry-listed roots.
   - Tags each chunk with: project, path, timestamp, sensitivity, DRP category.
2. **Knowledge Spine**
   - Local retrieval index + metadata filter.
   - Returns grounded context with path citations only.
3. **Policy Spine**
   - DRP gate + security policy checks before answer/action.
   - Blocks unsafe retrieval or action attempts.
4. **Orchestration Spine**
   - Routes requests to appropriate tools/agents:
     - registry/ports -> coordinator
     - planning -> planner
     - implementation -> implementer
     - evidence -> verifier
5. **Interaction Spine**
   - Unified text/voice interface.
   - Shared command grammar for both input types.
6. **Action Spine**
   - Executes approved local actions (read, audit, verify, launch tasks).
   - Write actions require explicit confirmation and produce change receipts.
7. **Evidence Spine**
   - Append-only logs of: prompt class, route, checks, verdict, citations.
   - Supports replay and post-incident review.

---

## Core Workflows

### Read Answer (default)

`query -> classify -> retrieve -> DRP/security gate -> answer + citations -> log`

### Action Request (guarded)

`query -> classify -> plan -> approval prompt -> execute -> verify -> evidence report`

### Cross-Project Upgrade Flow

`query -> coordinator truth -> planner steps -> implementer pass -> verifier pass -> watchdog/log update`

---

## Safety Model

- Registry-first path resolution; never guess sibling paths.
- Vault-sensitive content is denied by default and redacted in outputs.
- No silent writes; actions are explicit, bounded, and auditable.
- Every answer is either:
  - grounded with citations, or
  - explicit about missing evidence.
- Offline-first operation: local services and files are first-class.

---

## Phase Plan

### Phase A - Read-only Super Chat MVP

- Text-only chat.
- Cross-root retrieval with citations.
- Policy gate and evidence log.
- No write actions.

**Implemented in hub:**

- Run: `npm run super-chat:readonly` (binds `127.0.0.1`, default port `5510`; override with `Z_SUPER_CHAT_PORT`).
- UI: served from `docs/public/super_chat/index.html` by the local server (open the URL printed in the console).
- Evidence: append-only `data/reports/z_super_chat_evidence.jsonl`.
- Indexing skips vault-like paths, `safe_pack`, `node_modules`, `.git`, caches, and `.env` by path segment (no raw secret reads by design).
- Verify: `npm run super-chat:verify` (static), `npm run super-chat:verify:probe` with server running; add `--strict` to exit non-zero on GAPS.
- Dashboard: Z Blueprint panel in `dashboard/Html/index-skk-rkpk.html` links the blueprint, run line, and verify line.
- **AI Companion (persona engine, same app):** JSON personas under `packages/z-sanctuary-core/ai/*.json`; **`packages/z-sanctuary-core/ai/engine.js`** builds replies (registry-aware; optional **project listing** when the user asks to show/list projects). **`POST /api/companion`** `{ persona, message }` returns `{ reply, memoryContextCount }` using the real registry; **`prependMemoryContext`** injects the last few prior messages from **`data/ai-memory.json`** (local continuity, capped entries). **`GET /api/ai-memory`** returns recent entries for the Memory panel. **`GET /api/pc-root-projects`** exposes the same JSON as `data/z_pc_root_projects.json` for the UI strip.
- **System awareness:** **`data/system-status.json`** is written by **`verify:ci`** / **`verify:full:core`** via **`scripts/z_system_status_refresh.mjs --ci-pass`**, or refreshed with **`npm run system-status:refresh`**. **`GET /api/system-status`** serves verify/projects/hub/last_check; the companion appends **`formatSystemAwarenessBlock`** from that snapshot; Super Chat shows a **System status** panel (green / yellow / red LED).
- **Interpretation layer:** **`packages/z-sanctuary-core/ai/systemInterpreter.js`** — **`interpretSystem(status)`** (one-line headline) and **`formatCompanionInsight(status, projectNames)`** (multi-line narrative). Wired through **`engine.js`** into companion replies. **`GET /api/ai-insight`** returns `{ interpretation, narrative, suggestions }` for the **AI insight** + **Guardian** sidebar. **`guardianSuggestions.js`** adds rule-based proactive hints (verify freshness, release pipeline, registry checks).

### Phase B - Voice + Task Hooks

- Browser **Web Speech** in Super Chat UI (STT into query + optional read-aloud); dedicated server STT/TTS can layer on later.
- Controlled task launchers: manifest + optional gated `npm run` (challenge + `EXECUTE`) when env allows; heavier flows still via terminal or VS Code tasks.
- Keep write approvals mandatory for any future file-changing routes.

**Scaffold in hub (step 1 — read-only):**

- Manifest: `data/z_super_chat_task_hooks.json` (suggested commands; nothing auto-runs).
- `GET /api/task-hooks` on the read-only server returns the manifest + `read_only: true`.
- Super Chat UI lists hooks when the server is running (copy/paste into terminal).

**Step 2 — browser voice + gated execute (localhost):**

- UI uses **Web Speech API**: speech recognition fills the query; **Read summary** uses `speechSynthesis` on the last search results (Chrome / Edge best for recognition).
- **Gated npm run** (optional): set `Z_SUPER_CHAT_ALLOW_TASK_EXECUTE=1` before `npm run super-chat:readonly`. Then `GET /api/approval-challenge` + `POST /api/task-execute` with body `{ hookId, challengeId, approval: "EXECUTE" }` runs **only** hooks where the manifest sets `allowServerExecute: true` and `npmScript` exists in hub `package.json`. Never `super-chat:readonly` or `super-chat:verify:probe` from this server (deadlock / self-probe). Override timeout with `Z_SUPER_CHAT_TASK_TIMEOUT_MS` if needed.

### Phase C - Multi-Agent Orchestration

- Integrate coordinator/planner/implementer/verifier chain.
- Add reusable handoff template blocks.

### Phase D - Adaptive Intelligence

- Add source reliability weighting.
- Add stale-data detection and confidence hints.
- Preserve deterministic guards and explainability.

---

## Minimal Interfaces (Contract Draft)

```text
classifyIntent(input) -> { intent, riskLevel, route }
retrieveContext(query, filters) -> { chunks[], citations[] }
policyGate(intent, context, action) -> { allow, reasons[] }
runRoute(route, payload) -> { result, evidence[] }
emitEvidence(record) -> append-only log entry
```

---

## Build Checklist (Blueprint Stage)

- [x] Confirm registry and generated project list are in sync.
- [ ] Confirm hub security policy references are loaded.
- [x] Define citation format and evidence log schema.
- [ ] Define approval prompts for all write-capable routes.
- [x] Add read-only MVP shell and one dashboard entry point.
- [x] Add verifier acceptance tests (PASS / GAPS / FAIL) — `npm run super-chat:verify` (optional `--probe` when server is up; `--strict` fails CI on GAPS).

---

## Success Criteria

- One interface can answer with citations across all registered roots.
- All route decisions are explainable and logged.
- No policy bypass for vault/protected sources.
- Action requests are routed through approval + verification.
- Full stack remains operable from the existing single control plane.
