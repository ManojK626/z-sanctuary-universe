# Z-HOAI — Pilot Signal to Tracker Flow

**Purpose:** End-to-end **doctrine** for moving from raw feedback to a row in a **project-owned** tracker, without assuming the app lives inside ZSanctuary_Universe.

---

## 1. Flow diagram (logical)

```text
Signal (tester / log / support)
    → classify (FEEDBACK_TRIAGE_RULES)
    → assign shadows (MULTI_SHADOW_BOT_ROLES)
    → human gate check (AMK_INTERVENTION_GATES)
    → draft row + patch scope (PATCH_DECISION_MATRIX)
    → Cursor implements patch in CONSUMER REPO
    → run CONSUMER verification commands
    → Patch Scribe closes row with evidence (human confirms)
```

---

## 2. Tracker location

- **Consumer pilot repo:** e.g. `docs/beta/P0_P1_FIX_TRACKER.md` or your chosen path — **you** define it there.
- **Hub:** optional blank artifacts via `npm run hoai:pilot-triage-template` (writes under `data/reports/` when using `--write`).

Do not require the hub to mirror every pilot row unless you **choose** to link summaries in Zuno or a report (optional).

---

## 3. Verification commands (where they run)

- **Hub** (ecosystem health): e.g. `node scripts/z_registry_omni_verify.mjs`, `npm run verify:ci` / `verify:full:technical` per [AGENTS.md](../../AGENTS.md) — only when **hub** files changed.
- **Pilot app repo:** product lint, build, test, `pilot-patch-gate`, `rc_dry_run`, etc. — **only** in that repo’s `package.json` / scripts.

Z-HOAI **lists** these in each triage row; it does **not** inject XL2-specific scripts into the hub `package.json`.

---

## 4. Communications and Overseer alignment

- **Single control plane** vision: [Z-COMPLETIONS-TEST-AND-COMMUNICATIONS-FLOW.md](../Z-COMPLETIONS-TEST-AND-COMMUNICATIONS-FLOW.md).
- **Registry / EAII:** Consumer apps may be listed in Organiser / `z_pc_root_projects.json` for reachability; triage does not auto-edit those files.
- **Zuno / state reports:** Optional pointer lines (“pilot triage batch N filed”) if you want cross-surface awareness — human-authored.

---

## 5. Optional generated files (hub)

When using the template script with `--write`:

- `data/reports/z_hoai_pilot_triage_template.json`
- `data/reports/z_hoai_pilot_triage_template.md`

Copy into a pilot repo or customize paths locally. Prefer **gitignoring** machine-specific dumps if policy requires.

---

## 6. Rollback plan (doctrine-level)

If Z-HOAI discipline ever feels noisy:

1. Stop generating new triage files from templates.
2. Keep `docs/ai-hand/` as read-only reference.
3. Pilot tracker remains the product source of truth; hub verify unchanged.

No database or service rollback is required — this layer is **documentation-first**.
