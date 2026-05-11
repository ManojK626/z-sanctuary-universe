# Z-Sanctuary build rules (AI Builder)

**Audience:** Cursor and any automated builder. **Scope:** Hub behaviour expectations; does not replace legal policy or vault rules.

## Evidence first

- **Registry ID is canonical** for modules in `data/z_master_module_registry.json`. Do not invent module names or IDs in user-facing lists.
- **Files on disk** are the default proof of implementation. If `expected_paths` is empty, treat the row as doctrine, stub, or hold — not as shipped product code.
- **Re-run** `npm run zuno:coverage` after changing registry paths or adding modules.
- **Regenerate** AI Builder pages with `npm run z:docs:modules` after registry or audit updates.

## No hallucinated Sanctuary

- Do not claim features, routes, payments, devices, or integrations that are not evidenced in repo files or explicitly described in linked doctrine.
- Prefer **“planned / unknown / verify”** over confident fiction.
- When unsure, read [Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md](Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md) and registry JSON before editing.

## Forbidden without explicit human gates

- Payments, payouts, or production commerce wiring.
- GPS, camera, microphone, or device automation.
- Health or medical claims; gambling or prediction automation; emergency services integration.
- Soulmate / baby predictor or other high-consent personal projection UX without boundary review.
- Auto-merge, auto-deploy, auto-publish, or deleting user data.
- Weakening sandbox, vault, NAS, or ethics pause posture documented in hub policy.

## Deployment default

**HOLD:** registry and documentation first; UI and backends only when AMK and Overseer-class workflow approve. Phase 3 JSON constraints repeat this — treat them as active.

## Verify intent (pick depth)

- Light orientation: `npm run z:maos-status`
- Heavy technical proof (when stakes warrant): `npm run verify:full:technical` (see [docs/z-maos/OPENING_CYCLE_RUNBOOK.md](z-maos/OPENING_CYCLE_RUNBOOK.md))

## Doc hygiene

- Hub markdown tables: follow `.markdownlint.json` (including MD060 compact style).
- After bulk generated docs: consider `npm run z:car2` for duplicate boilerplate hints.
