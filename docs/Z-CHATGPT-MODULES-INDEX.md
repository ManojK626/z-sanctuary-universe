# Z-Sanctuary — ChatGPT projects index (operator)

**Purpose:** Track **ChatGPT Projects** (sidebar + **More** menu) and map them to **hub-owned** docs, manifests, and integration status.
**Authority:** **`ZSanctuary_Universe` git + manifests** are canonical. ChatGPT is a **workbench**; after review, content belongs under `docs/`, `Z_Labs/`, or registered modules—not in email as the system of record.

**Machine list (canonical):** [data/z_chatgpt_projects_tracking.json](../data/z_chatgpt_projects_tracking.json) — one row per project/chat with optional **`export_folder`**, `previous_names` for UI renames, and per-folder sidecar **`docs/chatgpt_exports/<folder>/.z-chatgpt-tracking.json`** (see [chatgpt_exports README](chatgpt_exports/README.md)) so verify can detect **disk renames** vs tracking. **Before importing or pasting large exports:** run **`npm run chatgpt:verify`** → read **`data/reports/z_chatgpt_integration_verify.md`**; machine index: **`data/reports/z_chatgpt_export_folder_index.json`**. Reports cover duplicate `hub_doc_path`, export drift, sidecar errors, and manifest overlap hints. **Folder Manager** follows hub layout policy when you add files under `docs/`; after ChatGPT renames a project in the UI, update **`display_name`** + **`previous_names`** in the tracking JSON so operators and AI stay aligned.

## How to pull data out of ChatGPT (official)

1. **Settings → Data controls → Export data → Export** — request the package OpenAI provides (format and delivery follow their UI).
2. Store the download in a **private** place (e.g. PC folder outside public git). **Do not** commit full raw exports if they contain personal data or secrets; extract **sanitized** markdown into paths below.
3. **Per chat:** you can also use **copy** on important replies and save under **`docs/chatgpt_exports/`** (see folder README) with a one-line provenance header.

## Memory full (free tier)

If the UI shows **Memory full**, long-term “remembered” context is saturated. Rely on **this index + hub files** and **project-specific** instructions in ChatGPT so critical truth lives in **your repo**, not only in ChatGPT memory.

---

## A. Project folder — **VS Code Lottery** (chats inside)

| Chat title | Hub target | Status | Last reviewed |
| ---------------------------- | ---------- | ----------- | ------------- |
| Z-Audiology Activation Guide | _TBD_ | not_started | — |
| Z-Sanctuary Lottery Pipeline | _TBD_ | not_started | — |
| Sentinel Critical Indicator | _TBD_ | not_started | — |

---

## B. Main sidebar — project folders (no sub-table)

| ChatGPT project folder | Hub target | Status | Last reviewed |
| ----------------------- | ---------- | ----------- | ------------- |
| Z☆Sanctuary Music | _TBD_ | not_started | — |
| Z-Sanctuary & Formulas | _TBD_ | not_started | — |
| Vscode/Note+++/Z-VN 360 | _TBD_ | not_started | — |
| Z-Gagets Mirrors | _TBD_ | not_started | — |

---

## C. **More** menu — extended project folders

_Open **Projects → More** in ChatGPT to match names; titles below follow your workspace (Apr 2026)._

| # | ChatGPT project folder | Hub target | Status | Last reviewed |
| --- | ----------------------------- | ---------- | ----------- | ------------- |
| 1 | Super Saiyans Z -Blood Eng… | _TBD_ | not_started | — |
| 2 | We R One language's | _TBD_ | not_started | — |
| 3 | Motorcycle & Helmet Chip… | _TBD_ | not_started | — |
| 4 | Z☆Sanctuary Super-Saiyan … | _TBD_ | not_started | — |
| 5 | Z-Sanctuary Eternal Upgra… | _TBD_ | not_started | — |
| 6 | (1 In All Basic Hygiene & Fr… | _TBD_ | not_started | — |
| 7 | WORLD RELIVE GENEROSITY | _TBD_ | not_started | — |
| 8 | Vs Code Studio | _TBD_ | not_started | — |
| 9 | Anne & Barbies 🐱 | _TBD_ | not_started | — |
| 10 | Super Saiyans Roulette | _TBD_ | not_started | — |
| 11 | Z-Sanctuary Tourism Univer… | _TBD_ | not_started | — |
| 12 | RISE OF Z-Dead Ancestors | _TBD_ | not_started | — |
| 13 | Z- Triple Defense Ai | _TBD_ | not_started | — |
| 14 | Humans Generation Minds… | _TBD_ | not_started | — |
| 15 | Z_Sanctuary Nature Vs Hu… | _TBD_ | not_started | — |
| 16 | JB Z-Irish Fox | _TBD_ | not_started | — |
| 17 | Z-Sanctuary Kids 🎶 | _TBD_ | not_started | — |
| 18 | Z-Sanctuary Blood Engine 5 | _TBD_ | not_started | — |
| 19 | Z-Sanctuary Universe (e-bo… | _TBD_ | not_started | — |
| 20 | Zuno Universal Glasses | _TBD_ | not_started | — |

_If ChatGPT shows a duplicate line (e.g. same “Super Saiyans Z…” twice), merge rows in this table when you confirm they are the same project._

---

## D. Recents / loose chats (not in a project folder)

| Topic / chat title | Hub target | Status | Last reviewed |
| -------------------------------------------------------------------------- | ---------- | ----------- | ------------- |
| e.g. Z-Sanctuary Full Activation, Aisling Ai EirMind, Slots prediction app | _TBD_ | not_started | — |

**Status values:** `not_started` · `exported` (zip or copy saved locally) · `in_docs` (sanitized text in repo) · `integrated` (wired to dashboard / module registry / Super Chat search as applicable).

## Next steps (disciplined)

1. For each row, set **Hub target** to a real path (e.g. `docs/...` or `data/z_module_manifest.json` module id).
2. Add or update **`data/z_module_manifest.json`** when a module is promoted per Z-ACN/MTEH.
3. After manifest edits, run your usual **Module Registry Sync** task from `.vscode/tasks.json` or the Z-ACN/MTEH checklist (script name varies by workspace).
4. Optional: link high-priority rows from **Z Blueprint** or **MONOREPO_GUIDE.md** (already references this file).

---

_Seeded from operator ChatGPT Projects sidebar + More menu (Apr 2026). No account credentials or exports are stored in this repository._
