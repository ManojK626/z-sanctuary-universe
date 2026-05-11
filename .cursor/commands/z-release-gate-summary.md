# Z Release Gate Summary

Show the **executive summary** from the latest release gate artifacts (no long logs).

From `ZSanctuary_Universe` root:

```powershell
npm run release:gate:summary
```

If summary data is missing, run:

```powershell
npm run release:gate
```

Report back to user:

- Verdict (`GO` / `HOLD`)
- Top 3 blockers
- Trust score + grade
- Fastest remediation commands
