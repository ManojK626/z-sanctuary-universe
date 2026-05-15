# Z-Guardian Interpretation Layer — Phase E seed (docs only)

**Posture:** Read-only **advisory copy**. Guardian Interpretation turns **verified status artifacts** into plain-language summaries for operators and AI assistants. It does **not** add runtime authority, APIs, or autonomous decisions.

**Naming:** “Guardian” here means **governed interpretation**, not an executor. Prefer **interpretation layer** or **advisory guardian copy** in receipts and UI.

---

## Mission

- Explain **what the receipts already say** (for example `data/system-status.json`) in calm, actionable language.
- Help humans prioritize **verify**, review, and merge choices **without** implying permission to deploy or merge.
- Keep all outputs **derivable from file contents** — no hidden state, no silent inference beyond the documented schema.

---

## Inputs

Allowed inputs are **read-only files** produced or refreshed by existing hub processes, for example:

| Input | Typical role |
| ----- | ------------ |
| `data/system-status.json` | Snapshot from verify pipeline (fields such as `verify`, `status`, `hub`, timestamps) |
| Other report JSON under `data/reports/` | Optional future context, **only** when explicitly wired in a later chartered slice |

The interpretation layer **must not** invent fields or assume values not present in the input JSON.

---

## Outputs

Allowed outputs:

- Short **operator-facing paragraphs** (markdown or plain text) suitable for dashboards, chat context, or docs.
- **Structured summaries** (level + message) when paired with UI — still **display-only** unless a future phase charters otherwise.
- **Copy-only** suggested next commands (e.g. “consider running …”) — never executed by this layer.

Outputs must **cite** that they are derived from status files and **may be stale** until the next refresh.

---

## Forbidden actions

Guardian Interpretation **must not**:

- Auto-merge, auto-deploy, or promote releases.
- Modify Cloudflare, DNS, GitHub settings, secrets, NAS, or production configuration.
- Write or overwrite `data/system-status.json` or other receipts (unless a future human-approved job owns that write path).
- Claim **production approval**, **legal clearance**, or **go-live permission**.
- Present itself as **making decisions** for the operator — only **suggest** within bounded language.

---

## Relation to `verify:ci` and `system-status` refresh

- **`npm run verify:ci`** (and related pipelines) may refresh or gate writes to hub artifacts per existing `package.json` and governance.
- **`data/system-status.json`** is a **downstream artifact**: interpretation reads it **after** verify/update cycles the hub already defines.
- **Ordering:** Observe receipt → verify pipeline posture → interpret for humans. Interpretation **never replaces** verify; it **summarizes** known outputs.

If `system-status.json` is missing or invalid JSON, outputs must say **state unavailable** — not guess healthy/failed.

---

## Language rules

In user-visible copy, docs, and AI prompts fed by this layer:

### Avoid

- “Self-aware”, “conscious”, “sentient”, “autonomous decision”, “AI decides”, “permission to deploy granted.”

### Prefer

- “Based on `system-status.json` as of …”
- “Verification outcome reported as …”
- “Suggested next step (you choose): …”
- “Read-only interpretation — not merge or deploy approval.”

---

## Standing law

**Observe → verify → suggest → human decides.**

- **Readiness** and **PASS** in JSON are **informational** until humans and policy gates say otherwise.
- Interpretation improves **clarity**; it does **not** grant **authority**.

---

## Phase boundary (this seed)

This document **only** defines doctrine. It does **not** add:

- JavaScript modules, APIs, or dashboard panels
- New verify steps or registry rows

Future phases may implement interpreters **under charter**, one domain per PR (e.g. packages vs UI vs API).

---

## Rollback

Remove `docs/Z_GUARDIAN_INTERPRETATION_LAYER.md` and any links pointing to it.
