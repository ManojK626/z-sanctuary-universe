**Governance hold:** If `npm run verify:ci` or `npm run aafrtc:ci` stops at the execution enforcer (release not manually approved), stay on hold and use **`npm run verify:hub-signal`** from hub root — same hub checks as `verify:ci` **without** the enforcer gate. Optional: **`npm run zuno:external-observers-refresh`** afterward for observer JSON. This does not override governance; it gives day-to-day structure, registry, comms, freshness, status, and guardian signal.

---

Run a **compact verification stack** suitable before a merge or after pulling main. From ZSanctuary_Universe root, run in sequence (stop on first failure; use `;` in PowerShell between steps):

```powershell
node scripts/z_sanctuary_structure_verify.mjs
node scripts/z_registry_omni_verify.mjs
node scripts/z_cursor_folder_bootstrap.mjs --verify
node scripts/z_report_freshness_check.mjs
```

Summarize: structure OK / not, registry omni OK / not, Cursor folder blueprint verify OK / not, report freshness status (`green` vs `hold`) and count of stale critical files.

If the user wants deeper checks, suggest **Z: Daily Full Verify Gate** or **npm run verify:full** separately (longer).
