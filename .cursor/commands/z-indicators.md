Refresh **hub dashboard indicator reports** (privacy scan + gate + indicator bundle). Run from ZSanctuary_Universe root:

```powershell
npm run dashboard:indicators-refresh
```

If `npm` is unavailable, run the equivalent tasks in order: **Z: Privacy Scan (Deterministic)**, **Z: Privacy Gate Check**, **Z: Dashboard Indicators Refresh**.

Summarize which JSON files under `data/reports/` were touched and any failures. Do not run destructive fixes in sibling project directories.
