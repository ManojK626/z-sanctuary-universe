# Phase Z-EXL-1 — Z Experiential Language Layer · Green receipt

## Scope

**Doctrine + JSON schema + example profile only.**

Not in scope: live runtime adapter wiring, provider calls, cross-project memory, auto profile sync, deployment changes, billing or entitlement enforcement, Cloudflare deploy structure, shared adapter library, shared event bus.

## Delivered

| Item | Path |
| --- | --- |
| Canonical doctrine | `docs/design/Z_EXPERIENTIAL_LANGUAGE_LAYER.md` |
| Canonical JSON schema | `data/z_experiential_language_schema.json` |
| Reference example profile | `data/examples/z_exl_profile.example.json` |
| Green receipt (this file) | `docs/cross-project/PHASE_Z_EXL_1_GREEN_RECEIPT.md` |

## Reference implementation (Lumina, separate repo)

Z-Saiyan Lumina (Z-Sanctuary Browser) ships a **Lumina-only** reference implementation that cites this hub doctrine:

| Lumina artefact | Path inside Z-Sanctuary Browser |
| --- | --- |
| Doctrine pointer | `docs/Z-EXL-1.md` (cites this hub doctrine as canonical) |
| Schema mirror (read-only) | `docs/z-exl-1.schema.json` (clearly marked as a mirror) |
| Lumina profile JSON | `docs/lumina-sanctuary-v0.profile.json` |
| Renderer adapter | `renderer/modules/_shared/lumina-exl-profile.js` |
| Phase verifier | `scripts/verify-z-exl-phase.js` |
| Phase receipt | `docs/PHASE_LUMINA_EXL_1_GREEN_RECEIPT.md` |

The Lumina adapter uses ONLY existing `data-*` hooks. It contains no `require()`, no `importScripts`, no `ipcRenderer`, and no direct calls to cross-project IPC paths — its CI guard fails the build if any of those appear.

## Verify (hub root)

```bash
node -e "JSON.parse(require('fs').readFileSync('data/z_experiential_language_schema.json','utf8')); console.log('Z-EXL-1 schema JSON OK')"
node -e "JSON.parse(require('fs').readFileSync('data/examples/z_exl_profile.example.json','utf8')); console.log('Z-EXL-1 example JSON OK')"
```

## Verify (Lumina repo, optional cross-check)

```bash
cd "../Z-Sanctuary Browser"
npm run verify:exl
npm run verify:all
```

## Manual checklist

| Check | Pass |
| --- | --- |
| Doctrine cites Z-UIL and Z-VIL siblings | ☐ |
| Schema enums mirror the doctrine layer values exactly | ☐ |
| Example profile validates against the schema (manual or CI) | ☐ |
| Doctrine declares entitlement-boundary invariant + cap law + version policy | ☐ |
| Doctrine never carries forbidden clinical / cognitive-outcome framing | ☐ |
| No runtime adapter, provider call, deploy change, or billing change introduced | ☐ |
| Lumina pointer (`Z-Sanctuary Browser/docs/Z-EXL-1.md`) cites this hub canonical | ☐ |

## Operator sign-off

| Role | Name | Date |
| --- | --- | --- |
| Operator | | |

## Rollback

Remove `docs/design/Z_EXPERIENTIAL_LANGUAGE_LAYER.md`, `data/z_experiential_language_schema.json`, `data/examples/z_exl_profile.example.json`, and this receipt; remove the citation from the Lumina pointer doc; remove any sibling project EXL profiles. No production runtime depends on these artefacts — by design.
