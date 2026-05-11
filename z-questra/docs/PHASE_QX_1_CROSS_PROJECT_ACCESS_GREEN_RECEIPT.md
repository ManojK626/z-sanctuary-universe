# Phase QX-1 — Cross-Project Access Manifest · Green Receipt

## Scope

Docs and **local metadata only**. No backend, iframe, API, cloud sync, shared memory, or live bridge.

## Delivered

| Item | Path |
| ------------------- | ------------------------------------------------- |
| Capability manifest | `data/z_questra_capability_manifest.json` |
| Portability policy | `docs/Z_QUESTRA_PORTABILITY_AND_BRIDGE_POLICY.md` |
| Access roadmap | `docs/Z_QUESTRA_UNIVERSAL_ACCESS_ROADMAP.md` |
| Z-VIL seed | `docs/Z_VISUAL_INTERACTION_LANGUAGE.md` |
| README pointers | `README.md` |

## Verify

```bash
cd z-questra
node -e "JSON.parse(require('fs').readFileSync('data/z_questra_capability_manifest.json','utf8'))"
npm test
```

Expect: JSON parses; **npm test** exit **0**.

## Manual checklist

| Check | Pass |
| -------------------------------------------- | ---- |
| Manifest lists capabilities + forbidden list | ☐ |
| Reuse modes table matches manifest arrays | ☐ |
| README links to portability docs | ☐ |
| No new runtime bridge or API code | ☐ |

## Operator sign-off

| Role | Name | Date |
| -------- | ---- | ---- |
| Operator | | |

## Rollback

Remove manifest + QX-1 docs; revert README and `package.json` version; revert hub catalog edits if applied.
