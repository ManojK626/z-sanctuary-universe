# Zuno — Automation Profile

Support layer for **[Z-CURSOR MASTER MODE](../docs/Z-CURSOR-MASTER-MODE.md)**. This file **does not** replace doctrine: humans choose lanes; **CLI decides** proof.

---

## What this is / is not

```text
IS:    Repeatable layout hints, copy-paste agent briefs, named VS Code tasks → hub npm scripts
IS NOT: Auto file edits, auto PRs, auto merges, auto deploy, hidden background agents
```

Nothing here bypasses `manual_release`, EAII/registry authority, or Overseer-aligned gates.

---

## Layout ritual (startup mental state)

Restore panes **manually** (Cursor/VS Code UI): doctrine recommends hub-first awareness.

```text
LEFT / TOP-LEFT:    Hub / Commander context (ZSanctuary_Universe — dashboard, docs, status)
RIGHT / TOP-RIGHT:  Active lane (one sibling repo or one folder — single domain)
BOTTOM / DEDICATED: Terminal — run verify at end of lane
```

Optional: save a **Workspace Layout** if your editor supports it — still **your** click to apply.

---

## Agent templates (max two agents)

Copy into agent prompts; adjust paths only. **Never** run two agents on the **same file** or **same module**.

### Agent 1 — Primary (UI / code)

```text
Scope: ONE domain only (e.g. dashboard CSS + related HTML for Commander panel).
Follow Turtle Mode: branch cursor/zsanctuary/<lane>; no edits outside stated paths.
Do not touch docs/, governance JSON, or registry unless this task is explicitly docs.
After edits I will run verify locally — do not assume PASS.
```

### Agent 2 — Support (docs / lint)

```text
Scope: docs/*.md OR lint-only fixes (markdownlint / eslint scoped paths agreed upfront).
Max agents = 2 total; you are SUPPORT — no overlap with Agent 1 files.
No registry, no vault, no release gates — documentation or mechanical lint only.
```

---

## Command rituals (hub root)

Run from **ZSanctuary_Universe** unless your lane documents otherwise.

| Intent                            | npm (truth)                         | VS Code task label (shortcut) |
| --------------------------------- | ----------------------------------- | ----------------------------- |
| Close lane — full technical proof | `npm run verify:full:technical`     | **Z: Verify Full Technical**  |
| Markdown hygiene check            | `npm run lint:md`                   | **Z: Lint Markdown**          |
| Ecosystem commflow check          | `npm run ecosystem:commflow:verify` | **Z: Commflow Verify**        |

Optional deeper docs pass (when lane touches Markdown heavily): `npm run lint:md:fix` — review diff before commit.

---

## Stop discipline (enforced by ritual, not by robots)

```text
RUN (lane) → REVIEW DIFF → VERIFY (npm or tasks above) → STOP
```

Do **not** chain another lane until verify **PASS** or you intentionally rollback.

---

## Danger signals → reset

If parallel work spreads across modules, verify was skipped, or two surfaces edit the same files:

```text
STOP → single lane → hub-first workspace → verify when smoke clears
```

See **[Z-CURSOR-MASTER-MODE.md](../docs/Z-CURSOR-MASTER-MODE.md)** for full danger rules.

---

## Rollback (this profile only)

Delete `.cursor/zuno-automation-profile.md`. Remove the three **Z:** tasks from `.vscode/tasks.json` if you no longer want those menu entries — npm scripts in `package.json` are unchanged.
