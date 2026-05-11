**AAFRTC** — overseer-gated full verify from the **ZSanctuary_Universe** hub only (no multi-root mix-up).

From hub root (or use **Tasks → Z: AAFRTC** with hub folder focused):

```powershell
npm run aafrtc:resolve
node scripts/z_aafrtc_resolve.mjs --strict
npm run aafrtc:ci
```

Heavier:

```powershell
npm run aafrtc:full-core
npm run aafrtc:full
```

Read **[docs/Z-AAFRTC-OVERSEER-IDE-PIPELINE.md](docs/Z-AAFRTC-OVERSEER-IDE-PIPELINE.md)** and **[data/z_aafrtc_policy.json](data/z_aafrtc_policy.json)**. “Auto-approve” = run the **preset gate pipeline**; **`manual_release`** and production authority are unchanged.
