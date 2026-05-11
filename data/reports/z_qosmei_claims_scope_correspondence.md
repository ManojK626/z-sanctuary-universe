# Z-QOSMEI claims scope — correspondence record

Lane: **CORRESPONDENCE** (stakeholder-visible alignment with hub policy).

## Canonical source

- **File:** `data/z_qosmei_manifest.json` → `ethics.claimsScope`
- **HTTP:** `GET /api/z-qosmei/manifest` (served by `apps/web` from the same JSON; no duplicate copy)

## Text (mirror of manifest)

**Operational**

> Operational coherence — registries, verifiers, and green builds — is the only kind of automated prediction this hub asserts across projects.

**Observation surface**

> This panel summarizes loaded or demo history only: descriptive stats, not randomness certification, not next-spin forecasting, no guaranteed edge.

## UI surfaces

- **Governance home (`/`):** `apps/web/src/components/z-qosmei/ManifestClaimsScope.jsx` with `variant="home"` — one client fetch of `/api/z-qosmei/manifest`; fallbacks if the request is slow.
- **Z-QOSMEI (`/z-qosmei`):** Same component with `variant="panel"` and `operational` / `observation` passed from the observation panel’s already-loaded manifest (no duplicate fetch).

## Note

Updates to wording should be made **only** in `z_qosmei_manifest.json`; exported fallbacks in `ManifestClaimsScope.jsx` (`CLAIMS_FALLBACK_*`) should stay aligned when you edit the manifest.
