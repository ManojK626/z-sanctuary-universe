**OMNAI soft launch — first observation pass** (browser + hub). Full checklist: [docs/Z-OMNAI-SOFT-LAUNCH-FIRST-OBSERVATION.md](docs/Z-OMNAI-SOFT-LAUNCH-FIRST-OBSERVATION.md) — includes **HTTP 503** (Cloudflare deployment) triage before console/network deep dive.

**You (operator):** Follow **Immediate loop** in the doc (Cloudflare Success → fix 503 if needed → first load → then browser checks). **Understood** = three layers: **Surface** (sections 1+3) + **Structure** (2+4) + **Observer** (Zuno JSON). Open the live Pages URL → DevTools Console + Network → note load feel → fill the report template in that doc.

**Hub (only after the URL serves a real page — not before):** from `ZSanctuary_Universe` root:

```powershell
npm run zuno:external-observers-refresh
```

Or:

```powershell
node scripts/z_zuno_state_report.mjs
```

Read `data/reports/zuno_system_state_report.json` → `external_observers` + `external_observers_health`.

Task 008 deploy path remains in [MONOREPO_GUIDE.md](MONOREPO_GUIDE.md) (Wrangler preview before production).
