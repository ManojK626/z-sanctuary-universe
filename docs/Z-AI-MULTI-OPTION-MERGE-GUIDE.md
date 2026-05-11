# When AI proposes several references, options, or insights — merge, select, or route (multi-root)

**Purpose:** A repeatable way to turn **multiple AI-generated options** into **one coherent next step** for the Z-Sanctuary ecosystem — whether you **merge** ideas into a **new version**, **pick one** path, or **split** work across **multi-root** projects without losing traceability.

**Hints (machine-readable):** [data/z_ai_option_merge_hints.json](../data/z_ai_option_merge_hints.json)

---

## 1. Principles (Hierarchy Chief first)

1. **[Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md](Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md)** decides **which project owns** a capability — not every option belongs in the hub repo.
2. **Hub** (`ZSanctuary_Universe`) holds **registry, manifests, dashboard, policy JSON**; **sibling roots** hold their own apps — an option may be “implement in SKYSCRAPER” vs “register in hub only.”
3. **Merge** = synthesize into **one documented decision + one implementation plan**; **select** = choose A and **park** B/C in the Master Register or a lab note — not silent discard.

---

## 2. Stages (any maturity level)

| Stage | What to do | Ecosystem hooks |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ---- | --------- | ------------ | ---------------------------------------------------------------------------------- |
| **Capture** | Paste or summarize options in a **dated** note (e.g. `Z_Labs/`, `docs/` scratch, or chat export) | Keeps provenance |
| **Compare** | Short table: \*\*Option | Fits roof? | Repo | Cost/risk | DRP note\*\* | Use [Z-DRP-VERIFIER-CHECKLIST.md](Z-DRP-VERIFIER-CHECKLIST.md) where ethics matter |
| **Decide** | One line: **Merge** (blend A+C), **Select** (A only), **Route** (A→hub, B→sibling) | Slash **`/z-chief`** ritual when unsure |
| **Record** | Update **[Z-MASTER-MODULES-REGISTER.md](Z-MASTER-MODULES-REGISTER.md)** and/or **`data/z_module_manifest.json`** when a module path is chosen; **`data/z_pc_root_projects.json`** when a **dashboard_url** or role changes | **`npm run`** module registry sync tasks if your workflow uses them |
| **Implement** | Branch / PR in the **owning** repo; hub-only JSON if it is registry metadata | **AAFRTC** / **`verify:ci`** when touching hub |

---

## 3. Merge into a “new version”

- **Conceptual merge:** Write **one** spec paragraph or ADR-style note that lists what you took from each option (A’s auth model + B’s UI pattern). Link from Master Register “Our best” or a lab doc.
- **Code merge:** Normal **git** flow — **one** feature branch per coherent change set; avoid mixing unrelated options in one PR.
- **Versioning:** For published packages under `packages/` or `apps/`, follow **semver**; bump **changelog** when the merged behavior is user-visible.

---

## 4. Multi-root self-aware projects (no mix-up)

- **Registry row** in **`data/z_pc_root_projects.json`** is the **map**: which folder is **hub**, which is **member** or **external**. Options that touch a sibling should **name that path** explicitly.
- **Do not** duplicate the same feature in hub and a sibling without a **single** line in the register explaining **source of truth** (usually one codebase, hub links to it).
- **Zuno / operator digest / guardian reports** give **read-only** awareness — use them after a big merge to confirm nothing regressed.

---

## 5. What AI can do vs you

| AI | You (operator / Overseer rhythm) |
| ------------------------------------- | ------------------------------------------------------- |
| List options, pros/cons, citations | Choose roof alignment and **owning repo** |
| Suggest merged wording or file layout | Approve **vault** and **release** sensitive paths |
| Propose `npm` or task commands | Run **AAFRTC** / verify from **hub root** when required |

---

## 6. Quick prompts (for Cursor chat)

- _“Given options A/B/C below, produce a **single** merged recommendation per Hierarchy Chief, with **one** target repo each.”_
- _“Which rows in `z_pc_root_projects.json` does each option affect?”_
- _“Park B and C in a ‘deferred’ subsection; implement A only.”_

---

_Self-aware ecosystem = **one truth in registry + manifests**, many roots in folders — options become **decisions** when recorded and **work** when implemented in the right place._
