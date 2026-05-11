# Z-Sanctuary — Cloudflare, dashboard AI, and contingency use

**Purpose:** Decide **when** Cloudflare (Workers & Pages, dashboard **Ask AI**, **Workers AI**, third-party **agent** integrations) is worth turning on — usually **contingency** (read-only mirror when the PC is down) and **Task 008** soft launch — without making the edge the **authority** over the hub.

**Do you “need” it?** **No** for normal operation: **PC/NAS + Cursor + this repo** stay primary. **Yes** as an **optional** layer if you want (a) a **hosted preview** of the Z-Bridge static bundle, (b) **emergency** visibility when local SSWS is unreachable, or (c) future **edge** experiments **after** they are registered in the Master Register.

**Machine requirements:** [data/z_cloudflare_ai_comms_requirements.json](../data/z_cloudflare_ai_comms_requirements.json)
**Contingency identity (non-secret):** [data/z_cloudflare_contingency_identity.json](../data/z_cloudflare_contingency_identity.json)
**Sync:** `npm run comms:cloudflare-ai` → [data/reports/z_cloudflare_ai_comms_manifest.json](../data/reports/z_cloudflare_ai_comms_manifest.json)

---

## 1. Authority (unchanged)

| Layer | Role |
| ------------------------------------ | -------------------------------------------------------------------------------------- |
| **Hub** | PC/NAS, manifests, Zuno, registry, Folder Manager, dashboard on 5502 when local. |
| **Cloudflare** | Optional **hosting** and **edge**; **never** the sole system of record for governance. |
| **Cloudflare Ask AI / dashboard AI** | **Hints** only — same rule as [MONOREPO_GUIDE.md](../MONOREPO_GUIDE.md) Phase 7. |

---

## 2. When to use Cloudflare in this ecosystem

1. **Task 008 — Z-Bridge soft launch:** Bundle → Wrangler preview → validate; see **MONOREPO_GUIDE** “Cloudflare (Task 008)”.
2. **Emergency / unexpected:** Deploy or keep a **read-only** static mirror so you can still open a **known URL** (e.g. Pages preview) for status — **not** for editing vault or secrets.
3. **Future Workers AI / Vectorize / etc.:** Only after a **designed** use case is documented in the hierarchy path — not “because the sidebar has an AI menu.”

---

## 3. Precautions (critical)

### 3.1 Secrets

- **Never** commit: Cloudflare **API tokens**, **Account ID** (unless your policy explicitly allows in a **private** repo), **Wrangler** secrets, or tunnel credentials.
- Prefer **Cloudflare dashboard** and **untracked** local env (e.g. `.dev.vars`) for development — see Wrangler docs.
- If a token leaks: **rotate immediately** in the dashboard.

### 3.2 “Agent Lee” and similar (read-only API access)

- If you enable a dashboard feature that needs an API token: use **minimum scope** (read-only if possible), **name the token** by purpose, and **rotate** when people or laptops change.
- Do **not** grant write access “just in case” for AI agents.

### 3.3 Ask AI in the Cloudflare dashboard

- Use for **navigation**, **Wrangler how-to**, and **token scope** explanations.
- **Do not** paste vault content, proprietary engine internals, or full hub dumps into any cloud chat.

### 3.4 Workers & Pages “no projects yet”

- An **empty** Workers & Pages list is **normal** until your first deploy. It is **not** a blocker for hub work.

---

## 4. Alignment with communications flows

- **File-based truth** (reports, registry, Zuno) remains authoritative; Cloudflare hosts **optional** static views of **sanitized** bundles.
- After changing requirements or this doc, run **`npm run comms:cloudflare-ai`** so **`z_cloudflare_ai_comms_manifest.json`** updates — same propagation idea as GitHub comms sync.

---

## 5. Changelog (operator)

| Date | Note |
| ---------- | ---------------------------------------------------------------------------------------------- |
| 2026-04-17 | Initial contingency doc + requirements JSON + manifest pipeline (parallel to GitHub AI comms). |

---

_Edge and AI features in Cloudflare are **tools**, not the Z-Sanctuary brain — the brain stays in your hub, manifests, and Hierarchy Chief path._
