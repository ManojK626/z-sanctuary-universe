# Z-MAOS — Opening Cycle Runbook

**Purpose:** The **opening-stage ritual** when entering the ecosystem. Aligns with MAOS scripts (`npm run z:maos-open`) which **print and check**, not execute risky steps.

---

## 1. Nine-step cycle (conceptual)

```text
1. Identify active repo/project
2. Verify workspace root
3. Check phase/freeze posture
4. Check extension readiness
5. Run safe status scripts
6. Read latest reports
7. Show next safe action
8. Route tasks to mini-bots
9. Require AMK consent for risky actions
```

---

## 2. Hub-safe commands (examples)

From **ZSanctuary_Universe** root when appropriate:

- `npm run z:maos-status`
- `node scripts/z_sanctuary_structure_verify.mjs`
- `node scripts/z_registry_omni_verify.mjs` (when full PC sync intended)
- `npm run dashboard:indicators-refresh` (operator choice; not silent on boot unless SSWS policy says so)

---

## 3. What `z:maos-open` does

- Prints this runbook summary.
- Optional filesystem checks for manifest-listed files.
- Optional `--write` emits `data/reports/z_maos_opening_cycle.md` (no secrets).

---

## 4. Forbidden in opening cycle

Deploy, merge, push, extension install, delete, external connect, legal copy edits.

---

## 5. Daily vs serious verification (operator canon)

**Daily (light):** Run `npm run z:maos-status` from the hub root when you open the workspace or need a quick ecosystem map. It stays read-only and avoids turning every session into a long pipeline.

**Serious (heavy):** Run `npm run verify:full:technical` from the hub root before bigger merges, release or governance gates, or after changing **cross-project structure** (registry, multi-root layout, shared scripts that many projects depend on). Do not treat that command as a casual every-open ritual; reserve it for when the proof burden matches the risk.

**Summary:** MAOS status for orientation; full technical verify for high-stakes change.
