# Z-Sanctuary implementation lanes (AI Builder)

**Purpose:** Order work so the spine stays safe: **truth in registry → evidence on disk → docs → then code**, not the reverse.

## Lane 0 — Truth and IDs

- Every module row has a stable **`id`** in `data/z_master_module_registry.json`.
- No new public “module” name in AI output without that ID (or an explicit human exception recorded in registry notes).

## Lane 1 — Evidence and Zuno

- Add or fix **`expected_paths`** only after files exist.
- Run `npm run zuno:coverage` and inspect `data/reports/z_zuno_coverage_audit.json`.
- Run `npm run zuno:phase3-plan` for staged remediation hints.

## Lane 2 — Documentation

- Run `npm run z:docs:modules` to refresh [Z_SANCTUARY_MODULE_INDEX.md](Z_SANCTUARY_MODULE_INDEX.md) and `docs/modules/**`.
- Update doctrine docs when behaviour or posture changes; do not claim code that audit shows missing.

## Lane 3 — Safe code motion

- Prefer narrow edits inside **evidenced** paths.
- Respect **safety_hold** and **decision_required** rows — stop for AMK / governance unless a charter explicitly clears.

## Lane 4 — Product and integrations (gated)

- Payments, devices, health, gambling-adjacent, lottery, intimacy features: **boundary docs + human sign-off** before implementation.
- Cross-repo coupling (e.g. standalone products): reference-only unless a coupling charter exists (see Z-MAOS linking policy).

## Lane 5 — Release-shaped proof

- Use `npm run verify:full:technical` when merging large change sets or altering cross-project structure (not for every daily edit).

## Never without charter

- Silent **merge / deploy / publish**.
- **Auto-install** extensions or system software from docs.
- **Production activation** of sensitive modalities listed in [Z_SANCTUARY_BUILD_RULES.md](Z_SANCTUARY_BUILD_RULES.md).
