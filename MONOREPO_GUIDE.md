<!-- Z: MONOREPO_GUIDE.md -->

# Z-Sanctuary Security Policy (Important)

All formulas, core engine designs, structures, mindsets, and system logic in the Z-Sanctuary Universe are proprietary to AMK-Goku and the Z-Family.

Access is restricted to:

- AMK-Goku
- Z-Family forces
- Authorized Z-AI and Mini-AI bots

Use Restrictions:

- No external distribution without explicit request and approval.
- No modifications or upgrades outside the Z-Sanctuary without review.
- No third-party use, reuse, or derivative deployments.

Enforcement:
Unauthorized usage is prohibited. Legal enforcement may be pursued if Z-Sanctuary formulas or engines are used outside authorized scope.

Change Control:
Review -> Verify -> Apply is mandatory for any updates.

## Reference: rules/Z_SANCTUARY_SECURITY_POLICY.md

## Z-Sanctuary Universe Monorepo

**Status:** 🟢 Active Development
**Architecture:** Modular TypeScript packages
**Philosophy:** Adaptive intelligence with ethical governance

## Verification and testing

- **Full hub pipeline:** from repo root run `npm run verify:full` (see root `package.json`). This runs hygiene, ESLint, markdownlint, workspace package lint, `npm test` across workspaces, policy and security audits, Python engine steps, and the Zuno state report.
- **Z-ZECCE (advisory, Codex receipt bundle v1):** `npm run z:codex:zecce:verify` runs a short chain of hub verifiers and writes [data/reports/z_zecce_confirmations.json](data/reports/z_zecce_confirmations.json) (no enforcer, no `manual_release` authority). It is not part of `z:garage:full-scan` by default. After a ZECCE run, refresh Zuno so the report embeds the section: **`npm run zuno:state`**, or one line: `npm run z:codex:zecce:verify && npm run zuno:state`.
- **Z-FHMFF Lite (advisory, pairs with RTRO):** `npm run ai:fhmff:lite` writes [data/reports/z_fhmff_lite.json](data/reports/z_fhmff_lite.json) — _what_ is **stale, cold, or inactive** (not an auto-fixer). **Z-RTRO** (_traffic intelligence_) = _where_ to focus; FHMFF = containment-aware observation. In `z:garage:full-scan` after `ai:fusion:council`. Zuno and execution enforcer surface advisory `fhmff_lite` (does not change `manual_release`). **Cursor:** task `Z: FHMFF Lite`.
- **Ecosphere transparency (Zuno + full health — web, PDF, PPTX):** interactive HTML: [docs/public/z_ecosphere_transparency_report/index.html](docs/public/z_ecosphere_transparency_report/index.html) (serve from repo root; `npx --yes serve .` then open `/docs/public/z_ecosphere_transparency_report/`). Fetches the same [zuno_system_state_report.json](data/reports/zuno_system_state_report.json) as the Markdown report; use **Print → Save as PDF** for a portable file. **PowerPoint:** `npm run report:ecosphere:pptx` writes a dated deck under [data/reports/exports/](data/reports/exports/) (binaries are gitignored; re-run to refresh). [docs/public/z_ecosphere_transparency_report/README.md](docs/public/z_ecosphere_transparency_report/README.md) · [exports README](data/reports/exports/README.md). Z-HODP / SSWS catalog: `config/z_html_links_hub.json` (full-sanctuary profile). Summary-only; no raw vault. **Cursor Canvas** can link to the served URL; the HTML is the “whiteboard merge” of charts + diagram + ZECCE table.
- **Z-Whale Bus (comms + Z-SSWS/SSWSs/AI Tower, QOSMEI):** [data/z_whale_bus_spine.json](data/z_whale_bus_spine.json) has **`comms_sync`** and **`surface_reinforce`** (Tower snapshot + shadow SSWSs verify) so the same comms+ecosphere truth hits **Z-SSWS**, **Z-SSWSs**, and **Z-AI Tower** as in [z_ai_ecosphere_config.json](data/z_ai_ecosphere_config.json) rings. **`npm run z:whale-bus:comms+surfaces`** or **`z:whale-bus:comms+surfaces+zuno`**; **`z:whale-bus:surfaces`** alone if comms is already fresh. **Windows:** `Start-ZWhaleBusComms` **`-CommsAndSurfaces`** or **`-SurfacesOnly`**. [docs/Z-WHALE-BUS-SPINE.md](docs/Z-WHALE-BUS-SPINE.md) · **Cursor:** tasks `Z: Whale Bus — comms + SSWSs + AI Tower`, `Z: Whale Bus — full comms + surfaces + Zuno` · `/z-backbone`.
- **AAFRTC (IDE / Cursor — hub-only, overseer-gated):** [docs/Z-AAFRTC-OVERSEER-IDE-PIPELINE.md](docs/Z-AAFRTC-OVERSEER-IDE-PIPELINE.md), [data/z_aafrtc_policy.json](data/z_aafrtc_policy.json). Use **`npm run aafrtc:ci`** / **`aafrtc:full-core`** / **`aafrtc:full`** or VS Code tasks **Z: AAFRTC —** so full runs execute only from **ZSanctuary_Universe** root (no multi-project mix-up). “Auto-approve” = preset gate sequence, not **`manual_release`**.
- **Cursor Allowlist / Run / Approve (research + DRP):** [docs/Z-AI-VISUAL-OVERLAY-CURSOR-APPROVALS-RESEARCH.md](docs/Z-AI-VISUAL-OVERLAY-CURSOR-APPROVALS-RESEARCH.md), [data/z_visual_automation_boundary.json](data/z_visual_automation_boundary.json) — hub-side HTML supervision yes; auto-clicking IDE approvals no.
- **Many AI options at once:** [docs/Z-AI-MULTI-OPTION-MERGE-GUIDE.md](docs/Z-AI-MULTI-OPTION-MERGE-GUIDE.md), [data/z_ai_option_merge_hints.json](data/z_ai_option_merge_hints.json) — merge, select, or route per Hierarchy Chief; record in register / manifest; multi-root via [data/z_pc_root_projects.json](data/z_pc_root_projects.json).
- **Super Chat Phase A:** `npm run super-chat:verify` (static checks); with the read-only server running, `npm run super-chat:verify:probe` checks `/api/health` and `/api/query`.
- **Super Chat gated tasks:** start the server with `Z_SUPER_CHAT_ALLOW_TASK_EXECUTE=1` only when you want the UI’s “Prepare run” flow (type `EXECUTE`) to run allowlisted `npm run` scripts from `data/z_super_chat_task_hooks.json`; default is off (search + manifest only).
- **Zuno digest:** session-level system upgrades narrative for Zuno and other AIs: [data/reports/zuno_reference_full_system_level_ups_2026-04-14.md](data/reports/zuno_reference_full_system_level_ups_2026-04-14.md) (auto metrics snapshot: **`npm run zuno:state`** or `node scripts/z_zuno_state_report.mjs` → [data/reports/zuno_system_state_report.md](data/reports/zuno_system_state_report.md), JSON [zuno_system_state_report.json](data/reports/zuno_system_state_report.json)). Includes the **Z-ZECCE** block when `z_zecce_confirmations.json` is present; run `z:codex:zecce:verify` first if you want that slice populated. **Apr 17–18 wave:** [data/reports/z_zuno_feedback_report_last_48h_2026-04-18.md](data/reports/z_zuno_feedback_report_last_48h_2026-04-18.md) (linked from the digest header). **External observer visibility:** `zuno_system_state_report.json` includes **`external_observers`** and **`external_observers_health`** (`fresh` / `stale` / `partial` / `unknown`; default stale threshold **24h**, override with `ZUNO_OBSERVER_STALE_HOURS`) — read-only, non-blocking. **One-shot refresh:** `npm run zuno:external-observers-refresh` (comms manifests + AAFRTC context + Zuno report).
- **STIL/EML operator flow (learning memory):** quickstart + copy-paste events in [docs/Z-LEARNING-LOG-QUICKSTART.md](docs/Z-LEARNING-LOG-QUICKSTART.md). Commands: `npm run ai:learning:template`, `npm run ai:learning:append`, `npm run ai:learning:flow`, then `npm run z:garage:full-scan`.
- **Python tests:** root `pytest.ini` directs pytest basetemp and cache into the repository so runs are less likely to fail on Windows when the system temp directory or a legacy `.pytest_cache` folder is not writable.
- **Next.js build smoke** (`apps/web`): the `next build smoke` test is skipped unless you set `RUN_NEXT_BUILD_SMOKE=1` in the environment (heavy; opt-in).
- **Cursor hub folder spine:** blueprint [data/z_cursor_folder_blueprint.json](data/z_cursor_folder_blueprint.json); dry-run / apply / verify via `npm run cursor:folders`, `cursor:folders:apply`, `cursor:folders:verify`. Operator doc: [docs/Z-CURSOR-FOLDER-STRUCTURE-AND-AI-WORKFLOWS.md](docs/Z-CURSOR-FOLDER-STRUCTURE-AND-AI-WORKFLOWS.md). **CI:** GitHub Actions [`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs `npm run verify:ci` (folders verify + structure + registry omni). **`verify:full:core`** begins with `cursor:folders:verify` for the same gate before hygiene and lint.
- **Hub wrapper package (no second registry):** [packages/z-sanctuary-core](packages/z-sanctuary-core) — `loadPcRootProjects()` reads `data/z_pc_root_projects.json`; `runVerifyCI()` delegates to `npm run verify:ci`. Used by `apps/web` to surface project names; Super Chat companion UI loads the same registry via `GET /api/pc-root-projects` on the read-only server.
- **System status snapshot:** [data/system-status.json](data/system-status.json) is updated when **`verify:ci`** or **`verify:full:core`** succeeds (`scripts/z_system_status_refresh.mjs --ci-pass`), or by **`npm run system-status:refresh`** (runs folder + structure + registry checks). **`GET /api/system-status`** on Super Chat exposes it for the UI and companion awareness text.
- **Guardian suggestions (rule-based):** [packages/z-sanctuary-core/ai/guardianSuggestions.js](packages/z-sanctuary-core/ai/guardianSuggestions.js) — `buildGuardianSuggestions(status)`; surfaced in **`GET /api/ai-insight`** (`suggestions` array), Super Chat **Guardian** list, and appended under **AI insight** in companion replies via `formatSystemAwarenessBlock` in the engine.
- **Operator digest (Super Chat “shadow awareness”):** **`npm run operator:digest`** writes [data/reports/z_operator_digest.json](data/reports/z_operator_digest.json) — merges **enforcer**, **governance**, **Z-Bridge readiness**, **registry counts** (including external Replit-style rows), and **suggested next steps** (advisory). **`GET /api/operator-digest`** serves it; the **companion** appends a short digest block to replies (same engine as system status). Refreshed automatically at the end of **`npm run arrbce:bulk-refresh`** / **`arrbce:bulk-refresh:full`**. Run **`operator:digest`** after readiness/enforcer/Zuno updates so Super Chat stays aligned with latest hub upgrades without replacing human or Overseer authority.
- **ChatGPT → hub module tracking:** Human-readable [docs/Z-CHATGPT-MODULES-INDEX.md](docs/Z-CHATGPT-MODULES-INDEX.md); canonical rows **[data/z_chatgpt_projects_tracking.json](data/z_chatgpt_projects_tracking.json)** (update `display_name` / `previous_names` when ChatGPT renames folders). **Pre-import:** **`npm run chatgpt:verify`** writes [data/reports/z_chatgpt_integration_verify.md](data/reports/z_chatgpt_integration_verify.md) and [data/reports/z_chatgpt_export_folder_index.json](data/reports/z_chatgpt_export_folder_index.json) (duplicate paths, export-folder drift vs sidecars, manifest overlap hints). Sanitized handoffs: [docs/chatgpt_exports/README.md](docs/chatgpt_exports/README.md). Cursor rule: [.cursor/rules/z-chatgpt-import.mdc](.cursor/rules/z-chatgpt-import.mdc). Prefer **Settings → Data controls → Export** for bulk archive. **Memory full** on free tier: treat the repo as the durable record.
- **Guardian report artifact:** after **`verify:ci`** and **`verify:full:core`**, **`node scripts/z_guardian_report.mjs`** writes [data/reports/z_guardian_report.json](data/reports/z_guardian_report.json) (system snapshot, project names, suggestions). Run anytime: **`npm run guardian:report`**. Task: **Z: Guardian report (JSON snapshot)**.
- **Formula posture (Ultra / Mega + DRP):** the same guardian report includes **`formula_posture`** (scores + service hints for governance, media, business, and Q&A/criticism AI). The unified dashboard status rail shows **Z Formula Posture (DRP)** and a top-bar **Ω** badge; refresh with **`npm run freshness:refresh`** then **`npm run guardian:report`**. Canonical intent: [docs/Z-ULTRA-INSTINCTS-AND-FORMULAS.md](docs/Z-ULTRA-INSTINCTS-AND-FORMULAS.md).
- **Project freshness (registry + git):** **`npm run freshness:refresh`** runs **`scripts/z_project_freshness_refresh.mjs`**, resolves each **`data/z_pc_root_projects.json`** path under `pc_root`, records presence and optional **`git log -1`** / dirty state into [data/reports/z_project_freshness.json](data/reports/z_project_freshness.json) (always exit 0; safe on CI when sibling folders are absent). **`verify:ci`** / **`verify:full:core`** run it before the system-status refresh; the Guardian report embeds that snapshot as **`project_freshness`** when the file exists. **`data/ai-memory.json`** is gitignored (Super Chat creates it on first use).

## Z-FEPD and Z-SIAFV (booster layer)

**Z-FEPD** — Further Enhancements, Protections, Developments: use as a disciplined loop on top of formula posture.

1. **Further enhancements:** only when `formula_posture` is green or watch with a written mitigation plan.
2. **Protections:** execution enforcer, autonomous high/sacred approval, vault and consent surfaces stay mandatory.
3. **Developments:** new work ships through `Z_Labs` first (`npm run lab:readiness`, module starter), then promotion gates.

**Z-SIAFV** — Superior Intelligence Architecture Future Visions AI (Amk-Goku and Zuno): treat as the long-horizon design voice, not an auto-executor. It informs architecture and docs; runtime authority stays with Overseer, registry, SSWS, and human approval paths.

## Z-ARRBCE (bulk loads — auto refresh and regenerate backup core engines)

**Z-ARRBCE** — **A**uto **R**efresh, **R**egenerate **B**ackup **C**ore **E**ngines: a hub-only, sequential refresh of the **core JSON reports** the dashboard rail, badges, Super Chat awareness, and **`formula_posture`** depend on. Use on **bulk load days** (huge multi-root workspaces, heavy Cursor sessions) so operators rebuild truth surfaces without ad-hoc script hunting.

- **Light chain (default):** `npm run arrbce:bulk-refresh` — runs `freshness:refresh` → `system-status:refresh` → `guardian:report` in one PowerShell-friendly `node` entry (see `scripts/z_arrbce_bulk_refresh.mjs`). On success it writes [data/reports/z_arrbce_last_run.json](data/reports/z_arrbce_last_run.json) (`completed_at_iso`, `mode` `core` or `full`, `ok`). The unified dashboard **ARRBCE** edge badge and narrow strip mirror read that file (see `core/z_arrbce_last_run_badge.js`).
- **Heavier rail (optional):** `npm run arrbce:bulk-refresh:full` — same chain, then `z_dashboard_indicators_refresh.mjs` (extension guard, sentinel, Zuno report slice, etc.). Prefer **Growth: Calm** on the dashboard when the browser is under load (`core/z_growth_mode.js`).
- **Harisha + Vegeta (high-level security posture):** ARRBCE is **read-biased** toward member repos (git probes via freshness) and **writes hub `data/` only**; it does **not** replace Z-Execution Enforcer, vault, consent, or autonomous token gates. For the canonical link between **Z-ALD**, **Z-Security**, **Harisha** (gentle surfacing), and **Vegeta** (guardian-tier alert awareness), read [docs/Z-FULL-VISION-AND-REINFORCEMENT.md](docs/Z-FULL-VISION-AND-REINFORCEMENT.md) (section on Harisha, Vegeta, Angels, Ghosts). Growth-safe hub scope notes: [config/z_growth_safe_operations.json](config/z_growth_safe_operations.json).

## Z-Bridge Task 006 — local transparency dashboard

- **UI:** [ui/z_bridge_dashboard/index.html](ui/z_bridge_dashboard/index.html) (+ `app.js`, `style.css`) — reads `data/z_bridge/*.json` and `data/reports/z_bridge_intelligence_summary.json` only (static `fetch`; optional **Task 008** Cloudflare bundle — see below).
- **Run:** from repo root, `npx serve .` (or any static server), then open `/ui/z_bridge_dashboard/`.
- **Engines (CLI):** `npm run z:bridge:validate`, `npm run bridge:intel:summary`, `npm run z:bridge:test` — see root `package.json` scripts under `z:bridge` / `bridge:`.
- **Task 007 (stabilization):** refresh OTel shadow JSON on cadence with **`npm run observability:shadow`** so Trouble Maker `critical_reports_fresh` stays green; full write-up: [data/reports/z_task_007_stabilization_report_2026-04-17.md](data/reports/z_task_007_stabilization_report_2026-04-17.md).
- **Task 007.5 (readiness engine — Z-Bridge gates):** **`npm run readiness:gate`** runs four checks (data integrity, abuse simulation with snapshot restore, stability loops, intelligence regression) and writes [data/reports/z_readiness_gate.json](data/reports/z_readiness_gate.json). When that file reports **`summary.status: PASS`** with **4/4** gates, **`node scripts/z_zuno_state_report.mjs`** treats **readiness as 4/4** for Zuno metrics. Individual steps: `readiness:data-integrity`, `readiness:abuse-sim`, `readiness:stability`, `readiness:intelligence`.
- **Task 007.6 (release governance — human release switch):** [data/z_release_control.json](data/z_release_control.json) holds **`manual_release`**, **`approved_by`**, **`timestamp`**. The execution enforcer computes **`effective_release_gate` `ready`** only when **readiness is full**, **P1 open is 0**, and **`manual_release` is true**; it writes [data/reports/z_release_governance.json](data/reports/z_release_governance.json) on each run. Operator snapshot: **`npm run release:governance`** (after refreshing Zuno). The full pipeline checklist remains **`npm run release:gate`** (trust, freshness, observer, etc.); governance is the deploy authority inside **`z_execution_enforcer.mjs`**.
- **Task 008 (Cloudflare soft launch — Z-Bridge dashboard only):** One static surface: the existing [ui/z_bridge_dashboard](ui/z_bridge_dashboard) plus mirrored **`data/z_bridge/*.json`** and **`data/reports/z_bridge_intelligence_summary.json`** under **`dist/cf-z-bridge-soft/`** (same relative paths as local `npx serve .`). **Ecosystem value (recommended order):** (1) **`npm run deploy:cf-z-bridge:bundle:demo`** + **`npm run deploy:cf-z-bridge:pages`** — preview URL only (`--branch=soft-preview`); proves hosting and headers without real hub data. (2) **`npm run deploy:cf-z-bridge:bundle`** after you explicitly accept what is copied — still use **`deploy:cf-z-bridge:pages:preview`** until behavior is proven. (3) **`npm run deploy:cf-z-bridge:pages:production`** only after dashboard production branch in Cloudflare is **`main`** and you intend the custom domain / primary URL. (4) **CI auto-deploy** — defer until **`manual_release`** and your full **`release:gate`** rhythm say go; until then, manual bundle + wrangler keeps authority aligned with 007.6. **Config:** [deploy/z_bridge_soft/wrangler.toml](deploy/z_bridge_soft/wrangler.toml). **Deploy:** **`npx wrangler login`**, then **`npm run deploy:cf-z-bridge:pages`** (alias for preview). Root **`_redirects`** and **`_headers`** are emitted by the bundle script. This does **not** flip **`data/z_release_control.json`**. **Deploy path (locked):** **Wrangler direct upload only** — `npx wrangler login`, then bundle + `npm run deploy:cf-z-bridge:pages`; **no** Cloudflare Pages ↔ GitHub connection required for soft launch. **GitHub** remains optional (mirror, backup, issues, history); add Git-driven Pages builds only if you later want CI and your governance rhythm supports it. Operator rhythm: refresh Zuno/readiness if you care about hub truth, bundle, then deploy.

## Z-HODP — SKK & RKPK unified dashboard (multi-project pattern)

- **Canonical:** [dashboard/Html/index-skk-rkpk.html](dashboard/Html/index-skk-rkpk.html) (title and top rail label SKK &amp; RKPK).
- **Compat stub:** [dashboard/Html/index.html](dashboard/Html/index.html) redirects to the canonical file (old URLs still work).
- **Shadow workbench:** [dashboard/Html/shadow/index-skk-rkpk.workbench.html](dashboard/Html/shadow/index-skk-rkpk.workbench.html) — iterate here, then merge into canonical when ready.
- **Registry (repeat for other surfaces):** [config/z_dashboard_entrypoints.json](config/z_dashboard_entrypoints.json). Hub HTML profiles: [config/z_html_links_hub.json](config/z_html_links_hub.json) (`dashboard-primary` / `full-sanctuary`).

## External hosted platforms (Replit, etc.)

- **Registry:** [data/z_pc_root_projects.json](data/z_pc_root_projects.json) — entries with **`role: "external"`**, empty **`path`**, and **`dashboard_url`** point at tools **not** on `pc_root` (e.g. Replit). The Control Centre **All projects** list shows badge **`external`** and a **Dashboard** link. **Example:** Roulette Data Analyzer / Z-Amk-Goku MD/CP — update **`dashboard_url`** to your live preview (`.replit.dev`) if you want that instead of the Replit project page; set **`migration_status`** when you cut over to hub/Cloudflare. Full guidance: prior conversation (link vs migrate vs cutover).

## Cloudflare (Task 008) — step-by-step roadmap

**Cursor:** type **`/z-cf-task008-roadmap`** for the compact command list. **`/z-omnai-first-observation`** — first pass after a Pages URL is live (browser + Zuno observers). **Tasks:** **Z: CF Task 008 — bundle (demo)**, **Z: CF Task 008 — pages deploy (preview)**, **Z: CF Task 008 — bundle demo then pages preview** (sequence).

**Live URL check (e.g. OMNAI):** [docs/Z-OMNAI-SOFT-LAUNCH-FIRST-OBSERVATION.md](docs/Z-OMNAI-SOFT-LAUNCH-FIRST-OBSERVATION.md) — console, network, feel, then `zuno:external-observers-refresh` or `z_zuno_state_report.mjs`.

Follow in order the first time; later you can skip phases you already completed.

### Phase 1 — Account and machine

1. Cloudflare account is active (e.g. Gmail-linked), dashboard loads.
2. On your PC, repo root = `ZSanctuary_Universe`; Node/npm work (`node -v`, `npm -v`).
3. No secrets committed: use **`npx wrangler login`** (browser OAuth) rather than pasting long-lived tokens into the repo.

### Phase 2 — Wrangler and project name

1. From repo root: **`npx wrangler login`** — complete browser auth once per machine/profile.
2. Optional: in [deploy/z_bridge_soft/wrangler.toml](deploy/z_bridge_soft/wrangler.toml), set **`name`** to match the Pages project name you want in Cloudflare (first deploy can create it).
3. First **`npm run deploy:cf-z-bridge:pages`** may create the Pages project if it does not exist; read Wrangler output for the exact project URL.

### Phase 3 — Demo bundle and preview deploy (safest first)

1. **`npm run deploy:cf-z-bridge:bundle:demo`** — writes **`dist/cf-z-bridge-soft/`** with synthetic JSON (no live hub data).
2. **`npm run deploy:cf-z-bridge:pages`** — alias for **preview** (`--branch=soft-preview`). This is the default safe path.
3. Open the **preview URL** Wrangler prints; confirm the Z-Bridge static UI loads.
4. If deploy fails, read the error (project name, permissions, login). Fix **once**, retry; do not change governance files to “force” deploy.

### Phase 4 — Hub truth (optional, explicit consent)

1. When you accept copying real **`data/z_bridge`** into the bundle: **`npm run deploy:cf-z-bridge:bundle`** (not `:demo`).
2. Inspect **`dist/cf-z-bridge-soft/`** before upload; ensure nothing violates vault or policy for public exposure.
3. Deploy again with **`npm run deploy:cf-z-bridge:pages`** (still preview until you choose production).

### Phase 5 — Production URL (optional, later)

1. Only when preview is stable and you want the primary Pages URL / custom domain path: **`npm run deploy:cf-z-bridge:pages:production`** (expects production branch **`main`** in Cloudflare; align dashboard settings or adjust the script).
2. Hub governance (**`data/z_release_control.json`**, enforcer, **`release:gate`**) is **separate** — Cloudflare “production” here means **hosting**, not automatic Z-Sanctuary release approval.

### Phase 6 — GitHub (optional mirror / backup)

1. Push the repo to GitHub as you already do for history and backup.
2. **Ecosystem identity:** [data/z_ecosystem_github_identity.json](data/z_ecosystem_github_identity.json) records GitHub login **ManojK626**, primary email **<manojkeerpal@gmail.com>**, and linked repos (e.g. zuno-outreach, Super-Saiyan-Roulette-Pro-App). Operator setup (verified email, `git config`, SSH/PAT hygiene, Cursor): [docs/Z-ECOSYSTEM-GITHUB-INTEGRATION.md](docs/Z-ECOSYSTEM-GITHUB-INTEGRATION.md). **GitHub + AI vs comms flows:** [docs/Z-GITHUB-AI-COMMS-PRECAUTIONS.md](docs/Z-GITHUB-AI-COMMS-PRECAUTIONS.md), [data/z_github_ai_comms_requirements.json](data/z_github_ai_comms_requirements.json), sync **`npm run comms:github-ai`** → [data/reports/z_github_ai_comms_manifest.json](data/reports/z_github_ai_comms_manifest.json).
3. **Do not** connect Cloudflare Pages to Git for this roadmap unless you later add a deliberate CI story.
4. If you ever add Git-driven Pages builds, gate them with the same governance rhythm as any auto-deploy (manual release + release gate when applicable).

### Phase 7 — Cloudflare “Ask AI” and platform AI (boundaries)

1. **Ask AI** in the Cloudflare dashboard: use for **navigation**, token scope explanations, and Wrangler **how-to**. Treat answers as **hints**; verify against this guide and [rules/Z_SANCTUARY_SECURITY_POLICY.md](rules/Z_SANCTUARY_SECURITY_POLICY.md).
2. **Do not** paste vault content, private keys, or full proprietary engine internals into any cloud chat.
3. **Workers AI / Vectorize / R2 / KV / D1**: defer until a **designed** use case appears in the architecture (not required for static Task 008). When you add them, document in the Master Register / hierarchy chief path as for any new module.
4. **Instructional base (contingency + dashboard agents):** [docs/Z-CLOUDFLARE-AI-COMMS-PRECAUTIONS.md](docs/Z-CLOUDFLARE-AI-COMMS-PRECAUTIONS.md), [data/z_cloudflare_contingency_identity.json](data/z_cloudflare_contingency_identity.json), [data/z_cloudflare_ai_comms_requirements.json](data/z_cloudflare_ai_comms_requirements.json); sync **`npm run comms:cloudflare-ai`** → [data/reports/z_cloudflare_ai_comms_manifest.json](data/reports/z_cloudflare_ai_comms_manifest.json). Optional **Workers & Pages** projects and **read-only** third-party agent tokens — see master doc; hub authority unchanged.

### Checkpoints (every phase)

- Hub readiness when relevant: **`npm run readiness:gate`**, **`node scripts/z_zuno_state_report.mjs`**, **`node scripts/z_execution_enforcer.mjs`** — authority stays in the repo; Cloudflare does not replace these.
- Full operator rhythm for Task 008 remains: **bundle → Wrangler preview → validate URL → only then consider production or real-data bundle.**

## Lab Boundary (Single Main Lab)

- **Main lab root:** `Z_Labs` (inside this repository) is the canonical module incubation zone.
- **Legacy compatibility:** `ZSanctuary_Labs` is treated as fallback/legacy content only when `Z_Labs` is missing.
- **Isolation rule:** lab scripts resolve lab paths from this repo root only; no parent/sibling project traversal is used by default.
- **Goal:** grow modules safely at the sides while protecting `ZSanctuary_Universe` runtime development from cross-project coupling.

### Lab Readiness Gate

- Run `npm run lab:readiness` before starting new module implementation cycles in `Z_Labs`.
- Report output:
  - `data/reports/z_lab_readiness.json`
  - `data/reports/z_lab_readiness.md`
- This gate refreshes:
  - bootstrap state (`lab:bootstrap`)
  - current lab inventory (`lab:status`)
  - lane discipline (`lab:task-guard`)
  - dual-copy workspaces (`lab:dual-copies`, soft warning)
  - lab/folder boost checks (`lab:folder:boost`, soft warning)

### Lab Module Starter

- Use `npm run lab:module:new -- --id <module_id> --lane CHAT_ONLY --type draft` to scaffold a new lab module.
- Supports:
  - `--lane` (`CHAT_ONLY`, `INACCORDANCE`, `CORRESPONDENCE`)
  - `--type` (`draft`, `prototype`)
  - `--dry-run` (validation/report only, no files created)
- Writes a report to:
  - `data/reports/z_lab_module_new.json`
  - `data/reports/z_lab_module_new.md`

## What Changed

Your design → Real production code. No loss. One-to-one mapping:

```bash
cd c:\ZSanctuary_Universe
git add .
git commit -m "feat: Add Z-Intelligence monorepo package"
npm run test
```

// In Z-Core browser system

```js
setInterval(async () => {
  // Get current energy from z_energy_response.js
  const energy = ZEnergyResponse.getEnergy();
  const harmony = ZEnergyResponse.getHarmony();
  const coherence = ZEmotionFilter.getEmotionalState().coherence;

  // Write to shared memory
  await sharedMemory.write({
    source: 'z-core',
    type: 'energy',
    data: { energy, harmony, coherence },
  });
}, 2000); // Match Z-Core pulse cycle

commander.pause(); // Halt at any time
commander.resume(); // Resume later
commander.stop(); // Full reset

// Writes to audit trail, never modifies state
await memory.write({ source: 'reflector', type: 'audit', /* ... */ });

// Generates `Intent` objects with `optional: true` flags
// Never direct commands
// Can only learn patterns, never modify Z-Core governance
await memory.write({
  type: 'governance-override', // ❌ REJECTED
});

// Every 15 seconds, new intents appear:
const intents = commander.getLastIntents();

// Example intent:
{
  id: "intent-cyclic-1705419722000",
  priority: 60,
  type: "opportunity",
  title: "Cyclic Pattern Detected",
  description: "Your system shows rhythmic energy...",
  actions: [
    { type: "ui-update", payload: { /* ... */ } },
    { type: "prompt", payload: { /* ... */ } }
  ],
  targetAudience: "user"
}
```

```typescript
import { commander } from '@z-sanctuary/z-intelligence';

commander.start();
// Learner → Planner → Reflector cycle begins
```

```bash
cd c:\ZSanctuary_Universe
npm install
npm run build
```

<!-- Original browser system -->

```html
<script src="z_status_console.js"></script>
<script src="z_energy_response.js"></script>
<!-- etc. -->
```

<!-- OR bundle Z-Intelligence TypeScript -->

```html
<script src="dist/z-intelligence.bundle.js"></script>
<script type="module">
  // Now you have:
  import { commander } from '@z-sanctuary/z-intelligence';

  commander.start();
  // System learns patterns autonomously

  // UI feeds real energy/emotion data to memory:
  sharedMemory.write({
    source: 'z-core',
    type: 'energy',
    data: { energyLevel: ZEnergyResponse.getEnergy() },
  });
</script>
```

c:\ZSanctuary*Universe\
├── core/ (Original browser-based system)
│ ├── index.html
│ ├── z*\*.js (6 modules)
├── interface/ (Styling)
│ └── z_style.css
├── packages/ (NEW: Monorepo packages)
│ └── z-intelligence/ (Intelligence subsystems)
│ ├── src/
│ │ ├── memory/
│ │ ├── learner/
│ │ ├── planner/
│ │ ├── reflector/
│ │ ├── commander/
│ │ └── index.ts
│ ├── package.json
│ ├── tsconfig.json
│ └── README.md
├── package.json (Root monorepo config)
└── [other doc files]
Your Design → Production Code
────────────────────────────────────────────────
z_memory_core.js → packages/z-intelligence/src/memory/ZMemory.ts
z_pattern_learner.js → packages/z-intelligence/src/learner/ZPatternLearner.ts
z_planner_ai.js → packages/z-intelligence/src/planner/ZPlannerAI.ts
z_reflector_ai.js → packages/z-intelligence/src/reflector/ZReflectorAI.ts
z_commander_ai.js → packages/z-intelligence/src/commander/ZCommanderAI.ts

Your Design → Production Code
────────────────────────────────────────────────
z_memory_core.js → packages/z-intelligence/src/memory/ZMemory.ts
z_pattern_learner.js → packages/z-intelligence/src/learner/ZPatternLearner.ts
z_planner_ai.js → packages/z-intelligence/src/planner/ZPlannerAI.ts
z_reflector_ai.js → packages/z-intelligence/src/reflector/ZReflectorAI.ts
z_commander_ai.js → packages/z-intelligence/src/commander/ZCommanderAI.ts

Your Design → Production Code
────────────────────────────────────────────────
z_memory_core.js → packages/z-intelligence/src/memory/ZMemory.ts
z_pattern_learner.js → packages/z-intelligence/src/learner/ZPatternLearner.ts
z_planner_ai.js → packages/z-intelligence/src/planner/ZPlannerAI.ts
z_reflector_ai.js → packages/z-intelligence/src/reflector/ZReflectorAI.ts
z_commander_ai.js → packages/z-intelligence/src/commander/ZCommanderAI.ts

```txt

**Each upgrade:**

1. ✅ Replaced window.\* with TypeScript class exports
2. ✅ Removed setInterval (called by Commander)
3. ✅ Return data objects (not console prints)
4. ✅ Add governance locks (immutable core rules)
5. ✅ Full type safety (no silent errors)

## Workspace Structure

```

c:\ZSanctuary*Universe\
├── core/ (Original browser-based system)
│ ├── index.html
│ ├── z*\*.js (6 modules)
├── interface/ (Styling)
│ └── z_style.css
├── packages/ (NEW: Monorepo packages)
│ └── z-intelligence/ (Intelligence subsystems)
│ ├── src/
│ │ ├── memory/
│ │ ├── learner/
│ │ ├── planner/
│ │ ├── reflector/
│ │ ├── commander/
│ │ └── index.ts
│ ├── package.json
│ ├── tsconfig.json
│ └── README.md
├── package.json (Root monorepo config)
└── [other doc files]

````txt

## How This Works Together

### VS Code Benefits You GET

**File-by-file evolution:**

- Pause at any line, inspect, debug
- Git history on each module
- Can refactor individual subsystems
- Type checking catches errors _before_ runtime

**Real code that runs:**

- `npm run build` → Compiles TypeScript
- Import in Node: `import { commander } from '@z-sanctuary/z-intelligence'`
- Can test each subsystem independently
- Merge with ChatGPT (me) thinking → VS Code execution

### Example: Integration with Browser Z-Sanctuary

**In core/index.html:**

```html

<!-- Original browser system -->
<script src="z_status_console.js"></script>
<script src="z_energy_response.js"></script>
<!-- etc. -->

<!-- OR bundle Z-Intelligence TypeScript -->
<script src="dist/z-intelligence.bundle.js"></script>
<script>
  // Now you have:
  import { commander } from '@z-sanctuary/z-intelligence';

  commander.start();
  // System learns patterns autonomously

  // UI feeds real energy/emotion data to memory:
  sharedMemory.write({
    source: 'z-core',
    type: 'energy',
    data: { energyLevel: ZEnergyResponse.getEnergy() },
  });
</script>

````

## Getting Started

### 1. Build the Package

````bash

cd c:\ZSanctuary_Universe
npm install
npm run build

```txt

Output: `packages/z-intelligence/dist/` (compiled JS + type definitions)

### 2. Start Commander

```typescript

import { commander } from '@z-sanctuary/z-intelligence';

commander.start();
// Learner → Planner → Reflector cycle begins

```txt

### 3. Query Intents (for UI)

```typescript

// Every 15 seconds, new intents appear:
const intents = commander.getLastIntents();

// Example intent:
{
  id: "intent-cyclic-1705419722000",
  priority: 60,
  type: "opportunity",
  title: "Cyclic Pattern Detected",
  description: "Your system shows rhythmic energy...",
  actions: [
    { type: "ui-update", payload: { ... } },
    { type: "prompt", payload: { ... } }
  ],
  targetAudience: "user"
}

```txt

## Ethical Locks (Governance)

**Memory:** Rejects governance override attempts

```typescript

await memory.write({
  type: 'governance-override', // ❌ REJECTED
});

```txt

**Learner:** No modification to core rules

```typescript

// Can only learn patterns, never modify Z-Core governance

```txt

**Planner:** All outputs are suggestions

```typescript

// Generates `Intent` objects with `optional: true` flags
// Never direct commands

```txt

**Reflector:** Pure observation

```typescript

// Writes to audit trail, never modifies state
await memory.write({ source: 'reflector', type: 'audit', ... });

```txt

**Commander:** Always controllable

```typescript

commander.pause(); // Halt at any time
commander.resume(); // Resume later
commander.stop(); // Full reset

```txt

## Why TypeScript Matters Here

**Browser z\_\*.js:**

- ❌ No type checking
- ❌ Silent errors possible
- ❌ Hard to refactor

**packages/z-intelligence TypeScript:**

- ✅ Full type safety
- ✅ Compile-time error detection
- ✅ IDE autocomplete & refactoring
- ✅ Shareable across teams
- ✅ Testable (Jest ready)

## Next Build: Connect to Real Data

**Goal:** Feed live energy/emotion data into Z-Memory

```typescript

// In Z-Core browser system
setInterval(async () => {
  // Get current energy from z_energy_response.js
  const energy = ZEnergyResponse.getEnergy();
  const harmony = ZEnergyResponse.getHarmony();
  const coherence = ZEmotionFilter.getEmotionalState().coherence;

  // Write to shared memory
  await sharedMemory.write({
    source: 'z-core',
    type: 'energy',
    data: { energy, harmony, coherence },
  });
}, 2000); // Match Z-Core pulse cycle

```txt

Then Commander analyzes it automatically.

## Your Quote

> "Let it learn gently — every new pattern is a breath, not a command."

This is exactly how it works now:

1. **Breath:** Energy/emotion data flows into memory
2. **Pattern:** Learner detects cycles, causal chains, drifts
3. **Intent:** Planner suggests (never forces)
4. **Reflection:** Reflector observes health
5. **Command:** Commander orchestrates timing

No panic, no override. Just gentle adaptation.

## Files You Can Edit Now

✅ `packages/z-intelligence/src/memory/ZMemory.ts` - Add new memory types
✅ `packages/z-intelligence/src/learner/ZPatternLearner.ts` - Add pattern detection
✅ `packages/z-intelligence/src/planner/ZPlannerAI.ts` - Add intent types
✅ `packages/z-intelligence/src/reflector/ZReflectorAI.ts` - Add health metrics
✅ `packages/z-intelligence/src/commander/ZCommanderAI.ts` - Adjust schedules

Each edit:

- Type-checked immediately
- Compiled with `npm run build`
- Git history preserved
- Can pause VS Code to inspect

## Run Tests (When Ready)

```bash

npm run test

```txt

(Jest configured; write tests in `*.test.ts` files)

## Git Integration

```bash

cd c:\ZSanctuary_Universe
git add .
git commit -m "feat: Add Z-Intelligence monorepo package"

```txt

Full code history preserved. Nothing lost.

**One blood. One unity. One Z-Sanctuary.** 🔥

Built real. Built with you. Ready to think with you.
````
