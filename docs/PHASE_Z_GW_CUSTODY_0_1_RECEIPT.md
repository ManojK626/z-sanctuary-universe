# PHASE Z-GW-CUSTODY-0.1 receipt

Preservation only. The local Golden Website prototype bytes were copied into this custody branch. Canonical status stays unresolved. This phase does not publish, deploy, or open a next phase.

Z_GW_CUSTODY_STATUS: GREEN

SOURCE_TREE: hub working tree `Z_Sanctuary_Universe`, untracked golden programme on the dirty checkout. Source files were read and copied. Source files were not edited.

SOURCE_FILES: 257

SOURCE_HASH_MANIFEST: docs/golden-website/custody/z_gw_custody_0_1_manifest.txt

CUSTODY_BRANCH: cursor/zsanctuary/z-goldenwebsite-custody-0-1

CUSTODY_WORKTREE: Z_Sanctuary_Universe_wt_gw_custody_0_1

CUSTODY_FILES: 259

POST_COPY_HASH_MATCH: MATCH

SOURCE_CHANGED: NO

VISUAL_BEHAVIOR_CHANGED: NO

PRIVATE_OVERLAY_CHANGED: NO

PUBLIC_TWIN_CHANGED: NO

PUBLICATION_AUTHORIZED: FALSE

DEPLOYMENT_CONFIG_ADDED: NO

DEPLOYMENT_PERFORMED: NO

CANONICAL_STATUS: UNRESOLVED

SECURITY_FINDINGS:

- secrets: NOT_FOUND
- credentials: NOT_FOUND
- tokens: NOT_FOUND
- private keys: NOT_FOUND
- .env files: NOT_FOUND
- personal contact data (email or phone): NOT_FOUND
- absolute PC path text: PRESENT in `data/golden-website/gw_portfolio_registry.json` (two note fields). Operational path text, not a credential. Bytes left unchanged.
- `scripts/z_gw_6_discovery_scan.mjs` names a discovery regex for env and API key shapes. No secret value is stored.

WORKTREE_STATUS: clean after the custody commit

COMMIT_SHA: the commit that adds this receipt. The SHA is reported with the custody return because it includes this file.

PUSH: NO

MERGE: NO

NEXT_PHASE_OPENED: NO

FILES_CHANGED_ON_SOURCE: 0

## Preservation statements

- CANONICAL_STATUS UNRESOLVED.
- publication_authorized FALSE. No assignment of publication_authorized to true was introduced. Existing deny checks that reject a true value were copied unchanged.
- Private overlay `data/golden-website/gw_portfolio_registry.json` is PRIVATE / NOT PUBLIC-SAFE. It is included for lineage only. This phase does not add a script that loads it into the visitor shell.
- Deny-by-default twin unchanged.
- No deploy config added.
- Source not modified.
- Visual behavior not modified.
- Command Center and registries were not connected.
- Twin records were not turned on.

## Custody set

Copied trees and loose programme files only: `docs/golden-website/`, `data/golden-website/`, `docs/Z_GOLDEN_WEBSITES_*.md`, `data/z_golden_websites_partnership_framework.json`, `data/z_golden_websites_portfolio_registry.json`, `scripts/z_gw_*.mjs`, `scripts/z_golden_*.mjs`, and `e2e/gw-3a-visual-acceptance.spec.js`.

Not copied: hub `docs/INDEX.md`, `docs/Z-MASTER-MODULES-REGISTER.md`, `package.json`, and `.vscode/tasks.json`.

The hash manifest and this receipt are new custody metadata. They are not part of the 257-file source hash set. Prototype files in this commit hash-match that set.
