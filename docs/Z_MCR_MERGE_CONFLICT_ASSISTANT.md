# Z-MCR-A — Merge conflict assistant (advisory)

**ID:** Z-MCR-A (Merge Conflict Resolver = **assistant**, not executor)  
**Posture:** human-in-the-loop. **Observe → classify → suggest → human applies merge.**

This document defines a **Core Engine** *doctrine* for Git merge conflicts. It does **not** implement autonomous merge, auto-push, or bypass of PR review.

---

## 1. Mission and non-mission

### Mission

Help operators and Cursor AI builders **reduce chaos** when branches diverge:

- classify conflict hunks (docs, code, config, lockfiles, governance)
- suggest resolution *patterns* with explicit trade-offs
- flag **sacred** or **high-risk** paths for mandatory human review
- emit **copy-only** git command sequences for the operator to run manually
- align with Turtle Mode: small branches, `cursor/zsanctuary/` prefix, one domain per PR

### Non-mission

Z-MCR-A is **not**:

- an auto-merge bot
- a silent file writer
- authority over `main`, secrets, billing, legal copy, or production edge
- a substitute for AMK / human approval on sacred moves

---

## 2. Intelligence domains (conceptual)

Each “domain” is a **classification and suggestion lens**, not a standalone autonomous agent.

| Domain | What the assistant may do | What it must not do |
| ------ | --------------------------- | --------------------- |
| **Docs / Markdown** | Propose wording merge; flag MD060, table width, governance links | Auto-apply without PR |
| **Registry / JSON** | Diff keys, suggest union or precedence rules | Write canonical truth without human merge |
| **Lockfiles / deps** | Flag supply-chain risk; suggest regenerate vs manual pick | Auto `npm install` / mass upgrade |
| **Dashboard / HTML** | Separate UI slice conflicts from data paths | Hot-reload production or change edge |
| **Governance / rules** | Always escalate: never “auto-resolve” `.cursor/rules`, `AGENTS.md`, `data/*` policy alone | Merge governance without explicit review |

---

## 3. Allowed outputs

- Structured **merge playbook** (markdown): files touched, order of resolution, test commands to run after merge
- **Three-option** summaries: keep ours / keep theirs / hybrid (with “why”)
- **Sacred file list** hit by conflict → block “auto-resolve” narrative; require human
- **Copy-only** `git` snippets (operator pastes into shell)

---

## 4. Forbidden outputs and behaviors

- Auto-commit, auto-push, auto-merge PRs
- Resolving conflicts in **secrets**, **vault**, **payment**, **legal commitment** text without human gate
- Invoking Cloudflare, GitHub, or NAS APIs as part of “MCR”
- “Confidence: merge anyway” language that implies permission

---

## 5. Relationship to Core Engines registry

`data/z_core_engines_registry.json` may list **Z-MCR-A** as a **doctrine / advisory** engine row. Presence in the registry is **not** proof of a shipped runtime; it is **intent and boundary** only until a future phase adds optional tooling under charter.

---

## 6. Relationship to hub systems

| System | Relationship |
| ------ | ------------ |
| **Turtle Mode** | MCR suggestions must respect one-domain PRs and branch prefix |
| **Z-Traffic / ZAG** | Conflict storms can be reflected as posture; MCR does not execute queue |
| **Z-OMNI charter** | Future panel could surface MCR playbook as read-only UI |
| **GitHub / Copilot** | Review comments and suggestions; human merges |
| **Golden law** | AMK remains final authority on sacred moves |

---

## 7. Phase roadmap (future — not implied by this doc)

| Phase | Content |
| ----- | ------- |
| **A** | This doctrine + operator checklist (done when merged) |
| **B** | Optional local script: **read-only** parse of conflict markers → report file under `data/reports/` (charter + human approval) |
| **C** | Cursor task or slash command that **prints** playbook only |
| **D** | Any automation beyond copy-only requires **explicit AMK charter** |

---

## 8. Operator checklist (manual)

1. `git status` — confirm you are on the intended branch, not `main` for risky resolutions.  
2. Identify conflict files; separate **governance** from **product**.  
3. For each file: resolve or abort; never merge if sacred files are wrong without AMK.  
4. Run smallest verify: `npm run verify:md` for doc-heavy merges; wider verify per AGENTS.md intent.  
5. Push branch; open PR; **human** merge.

---

## 9. Naming

Use **Z-MCR-A** in internal docs to avoid “resolver” being read as **autonomous resolver**. Public-facing text may say “merge conflict assistant.”

---

*End of Z-MCR-A doctrine (advisory).*
