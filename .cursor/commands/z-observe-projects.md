Run the **read-only cross-project observer** (filesystem checks only; writes only under this repo’s `data/reports/`).

From ZSanctuary_Universe root:

```powershell
npm run monitor:cross-project
```

Then open **`data/reports/z_cross_project_observer.json`** (or `.md`) and give the user: status (`green` / `watch` / `hold`), counts of bad/warn, and which project paths need attention (missing folder vs optional `package.json`).

Remind: member repos are **never** modified by this probe.
