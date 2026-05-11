**Zuno / operator:** ensure the hub **Cursor spine directories** exist (blueprint-driven).

From **ZSanctuary_Universe** root:

```powershell
npm run cursor:folders
```

If anything is listed as missing and you intend to fix empty dirs only:

```powershell
npm run cursor:folders:apply
```

Gate (fail CI if spine broken):

```powershell
npm run cursor:folders:verify
```

Then optionally:

```powershell
node scripts/z_sanctuary_structure_verify.mjs
node scripts/z_registry_omni_verify.mjs
```

**Reference:** [docs/Z-CURSOR-FOLDER-STRUCTURE-AND-AI-WORKFLOWS.md](../../docs/Z-CURSOR-FOLDER-STRUCTURE-AND-AI-WORKFLOWS.md) — cross-version Cursor AI notes and ritual phrase.
