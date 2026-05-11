# Z-ECR: Energy Classification, Clone Lineage, and Workflow Stability

**Status:** design / governance (not a new product module)
**Short name:** **Z-ECR** — Energy classification and replication discipline
**Type:** system-behaviour and runtime **discipline layer** for the Z-Sanctuary hub dashboard, scripts, and AI-adjacent workflows.

**What Z-ECR is not:** a shippable feature package with its own market surface. It is a **lens** and set of **rules** so the ecosystem stays fast, honest, and aligned as it grows.

**Authority and alignment:** [Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md](Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md) · [Z-BUILD-GATE-MATRIX.md](Z-BUILD-GATE-MATRIX.md) · [Z-TRUTH-CHAIN-AND-OPERATOR-DISCIPLINE.md](Z-TRUTH-CHAIN-AND-OPERATOR-DISCIPLINE.md)

---

## 1. Purpose (five anchors)

1. **Classify** every dashboard, script, and operator/AI **action** by **energy load** (low / medium / high).
2. **Keep** daily workflow **stable** and the dashboard **responsive** where it should be.
3. **Prevent** unnecessary **AI and automation overuse** (noise, cost, and drift).
4. **Allow** safe **branches** of work or “copies” of intelligence (tasks, context windows, or tools) without losing **alignment** with the Sanctuary **core**.
5. **Scale** the ecosystem while **remembering the origin path** and **return path** for every branch of work.

---

## 2. Three energy modes (classification)

| Mode | Colloquial name | When to use (intent) |
| ---------- | ------------------------------- | ------------------------------------------------------------------------------------------------- |
| **Low** | Quiet / read | Light, read-only, or display-only work. No heavy compute, no repo-wide change. |
| **Medium** | Builder | Normal build, check, report, or small structural updates that stay within policy. |
| **High** | “Super” / heavy (use sparingly) | Full pipelines, large audits, recovery, or anything that can stress disk, network, or governance. |

### 2.1 Low — Quiet mode

**Examples:** read status, view dashboard, open docs, show registry, display existing data, small summaries, lens chips that do not add polling load.

**Purpose:** preserve energy, CPU, and attention; keep the HODP **fast and calm**.

**Rules (allow):** default for browsing and read-only review. **Escalation:** move to medium when an action **writes** state, runs **node/npm** beyond a trivial one-off, or **refreshes** multi-report surfaces.

### 2.2 Medium — Builder mode

**Examples:** run a single check (`structure verify`, registry), build TypeScript for a **named** project, generate a report, update manifests, save GGAESP memory (CLI), run GGAESP sample, refresh dashboards or Zuno, routine bot awareness.

**Purpose:** normal **creation and improvement** within the [Build Gate](Z-BUILD-GATE-MATRIX.md).

**Rules (allow):** the **usual** day work from the hub. **Do not** chain many medium actions into a **de facto** high run without a deliberate choice (and Build Gate for risky scope).

### 2.3 High — Heavy mode

**Examples:** full `verify:full:technical` / long verify chains, multi-engine security or layout audits, large refactors, clone or mirror sync across roots, **AI-wide** reasoning “pass” over the whole monorepo, security sweep, recovery / restore, **cross-module** integration that **touches** release or production paths.

**Purpose:** reserved for **necessary** work; always paired with **governance** (see below).

**Rules (allow) only if:**

- [Build Gate](Z-BUILD-GATE-MATRIX.md) says **BUILD NOW** or a human has accepted **HOLD/exception** for that scope, **and**
- **Guardian**-class checks and **GGAESP-360**-style **Ethics** (as applicable) are not bypassed, **and**
- a **Z-Lineage** **origin_id** and **return path** are **defined** (even if stored only in notes or a ticket) for any work that spawns a **branch** of AI or task context.

**Discipline:** treat high mode as **expensive and risky**—batch it, schedule it, and log outcomes (including memory capsule where relevant).

---

## 3. Z-Lineage Replication Core (lineage-aware branches)

“Replication” here means a **lineage-aware branch** of work—not a stateless copy that can drift in silence.

A **branch** is any: parallel Cursor/IDE context, sub-task, automation **slice**, or **tool instance** (e.g. LPBS-style logic, GGAESP panel, dashboard audit, MirrorSoul slice, future mini-AI) that can run with **partial** autonomy but must **reconcile** back to **Sanctuary core**.

**Principle:** not a **clone** that forgets, not a **copy** that drifts—a branch that **remembers** root, **purpose**, and **how to return** results safely.

Mental model:

```text
Origin → Purpose → Current task → Memory link → Return path → Guardian status
```

Each branch should be able to answer, in its own log or handoff:

- I **came from** which root (registry, repo, or operator intent)?
- I **serve** which **purpose** (and **Build Gate** label)?
- I will **return** my outputs **where** (path, report, or human)?
- I am **not** the **Overseer**; I do **not** set **release** authority.

---

## 4. Required branch record (data shape)

When a branch (or a future small schema) is formalised, each record **must** be able to carry (names may vary by store; meaning must not be dropped):

| Field | Meaning |
| ---------------------- | --------------------------------------------------------------------------------------------------- |
| **origin_id** | Stable id tying this branch to a root (hub, project, or operator session). |
| **parent_context** | What spawned this branch (e.g. task label, Z-EAII project, or `moduleId`). |
| **purpose** | Human- or build-gate-readable one-line **why** (e.g. “LPBS sim”, “GGAESP advisory only”). |
| **energy_mode** | `low` / `medium` / `high` (Z-ECR). |
| **guardian_status** | Advisory ok / warn / block from Guardian or policy equivalent (or `unknown` only when not yet run). |
| **memory_return_path** | Where results must land: path, `data/reports/…`, or Zuno/EAII handoff. |
| **created_at** | ISO-8601 timestamp. |

**Additional fields** (e.g. Z-Formulas ref, GGAESP `memoryCapsule` id) may be added in implementation, but the **core row** is **non-negotiable** for a **declared** branch in automation.

**Hard rules:**

- **No branch may operate** without a **resolvable** **origin** trace (origin_id + parent_context, even if one is implicit from the same repo).
- **No branch** may be **release authority** (Z-Super Overseer / human / policy gates stay supreme).

---

## 5. Fit with GGAESP-360

Z-ECR is **before** and **beside** the GGAESP pipeline, not a replacement for Guardian or Ethics.

```text
Input
  → Energy class (Z-ECR: low / medium / high)
  → GGAESP run (metaScore, v15 Guardian, v18 Ethics)
  → Branch / execute / hold (as policy dictates)
  → Memory capsule (when chosen)
```

**Questions to ask (human or checklist) before a heavy or branching action:**

1. How much **energy** will this cost (and on what machine)?
2. Is it **necessary** (Build Gate)?
3. Is it **safe** (Guardian / risk)?
4. Which **mode** should run (Z-ECR)?
5. Does this **branch** know its **origin**?
6. Should it **save memory** (GGAESP or other handoff)?

---

## 6. Ecosystem (non-exhaustive)

Z-ECR is intended to support **governance-consistent** use of:

- **GGAESP-360** (advisory core, Z-Add On only as agreed)
- **LPBS** and similar **zone** or **app** work (lineage, not silent forks)
- **HODP** and **dashboards** (default **low** for read; **medium** for build tasks)
- **Z-Formulas** (alignment and compassion anchor for any “branch” of reasoning)
- **Future AI tools** and **mini-bots** (Overseer and registry outrank local cleverness)

---

## 7. UI and implementation policy (this version)

- **No new dashboard or Control Centre buttons** are required to **define** Z-ECR; the operator applies it by **ritual and classification** (this doc + Build Gate + truth chain).
- Future work may add **chips, badges, or task metadata** for energy mode, without bypassing the rules above.

---

_Z-ECR — Zuno + Z-Sanctuary, Energy classification and lineage discipline. As power grows, **discipline** stays the product._
