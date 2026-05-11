# Z-Sanctuary — GitHub, GitHub AI, and communications-flow precautions

**Purpose:** One instructional base for **operators, Cursor, and any AI** working on this ecosystem: how **GitHub** and **GitHub-hosted AI** (Copilot, Spark, Ask, Models UI, Actions, Codespaces) relate to our **communications-flow design**, without treating the cloud as the system of record.

**Machine requirements (database-style, versioned):** [data/z_github_ai_comms_requirements.json](../data/z_github_ai_comms_requirements.json)
**Sync (propagate manifest):** `npm run comms:github-ai` → [data/reports/z_github_ai_comms_manifest.json](../data/reports/z_github_ai_comms_manifest.json)
**Identity anchor:** [data/z_ecosystem_github_identity.json](../data/z_ecosystem_github_identity.json) · **Setup:** [Z-ECOSYSTEM-GITHUB-INTEGRATION.md](Z-ECOSYSTEM-GITHUB-INTEGRATION.md)
**Sibling (optional edge / Cloudflare):** [Z-CLOUDFLARE-AI-COMMS-PRECAUTIONS.md](Z-CLOUDFLARE-AI-COMMS-PRECAUTIONS.md) · `npm run comms:cloudflare-ai`

---

## 1. Authority: hub first, GitHub second

| Layer | Role |
| ---------------------- | ------------------------------------------------------------------------------------------------------- |
| **PC/NAS + this repo** | Canonical workflows, manifests, registry, Zuno, dashboard, Folder Manager policy. |
| **GitHub** | History, collaboration, CI, optional Copilot/Spark — **not** the sole truth for Z-Sanctuary governance. |
| **GitHub AI features** | Assistive; outputs are **provisional** until reviewed and merged under normal approval paths. |

Align with: [Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md](Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md), [Z-COMPLETIONS-TEST-AND-COMMUNICATIONS-FLOW.md](Z-COMPLETIONS-TEST-AND-COMMUNICATIONS-FLOW.md).

---

## 2. Precautions (non-negotiable)

### 2.1 Secrets and vault

- Do **not** paste into **any** GitHub AI chat, Issues, Copilot chat, Spark, or public gist: API keys, PATs, SSH **private** keys, vault excerpts, health/family details, or unreleased proprietary engine internals.
- Do **not** commit secrets to git. Use **GitHub Actions secrets** for CI only; reference as `${{ secrets.NAME }}` in workflows.
- If a mistake happens: **rotate** the credential and use [rules/Z_SANCTUARY_SECURITY_POLICY.md](../rules/Z_SANCTUARY_SECURITY_POLICY.md) and vault policy docs.

### 2.2 Identity and email

- Keep **one** primary GitHub account and **verified email** consistent with [data/z_ecosystem_github_identity.json](../data/z_ecosystem_github_identity.json).
- Local `git config user.email` should match your chosen verified address so history and contributions align.

### 2.3 Copilot, Spark, and “Ask” on GitHub

- Treat suggestions as **drafts**: run the same **lint, tests, verify**, and **human review** as any other change.
- Disable or scope **Copilot in public repos** if policy requires; prefer **private** repos for sensitive experimentation.
- **Business / IP:** do not rely on cloud AI for binding legal conclusions — use counsel and internal review.

### 2.4 Actions, Models, Codespaces, Dependabot

- **Pin** third-party actions to a commit SHA when feasible; review **new permissions** and **fork PR** workflows.
- **Models API / new features:** read GitHub’s terms for your org; update **z_github_ai_comms_requirements.json** when you adopt new capabilities.
- **Dependabot / security alerts:** route into your normal triage — they are part of comms (notifications) but not a substitute for hub verification tasks.

### 2.5 Communications-flow alignment

- **Dashboard / Zuno / registry / EAII** remain the **single control plane** narrative for “what is true” in the ecosystem.
- GitHub events (PRs, Actions) are **signals** that feed **operator rhythm** (merge, release gate), not a replacement for [Z-SANCTUARY-VERIFICATION-CHECKLIST.md](Z-SANCTUARY-VERIFICATION-CHECKLIST.md).

---

## 3. What gets “transferred” automatically (today)

Automation is **file-based** so it survives tool churn:

1. **Requirements JSON** — `data/z_github_ai_comms_requirements.json` lists themes, bindings, and doc paths.
2. **Sync script** — `npm run comms:github-ai` validates paths, writes **manifest** JSON under `data/reports/` for dashboards and future panels.
3. **Registry verify** — `node scripts/z_registry_omni_verify.mjs` includes ecosystem GitHub identity when present.
4. **Z-Bridge** (optional) — sync may append a small observability event when `data/z_bridge/logs.json` exists.

As **technology advances**, add rows to the requirements JSON and extend this doc; re-run sync so downstream consumers read one **manifest** snapshot.

---

## 4. Evolution checklist (when GitHub changes its AI stack)

- [ ] Read GitHub release notes / blog for Copilot, Spark, Models, policy updates.
- [ ] Update **precaution_themes** or add themes in `z_github_ai_comms_requirements.json`.
- [ ] Add a short subsection here under **§5 Changelog** (below).
- [ ] Run `npm run comms:github-ai` and commit manifest + docs together when ready.

---

## 5. Changelog (operator)

| Date | Note |
| ---------- | ------------------------------------------------------------------------ |
| 2026-04-17 | Initial instructional base + requirements JSON + sync manifest pipeline. |

---

_Comms-flow unity: every external tool (including GitHub and its AI) stays **one with the core** by reading the same hub manifests and never replacing PC/NAS + registry authority._
