# Cloudflare Governance Operating Pack

Cloudflare is a bounded runtime layer for previews, hosting, Workers, Pages, R2, Vectorize, routing checks, and smoke tests.

Flow:

AMK-Goku -> Cursor AI -> GitHub -> Cloudflare

Cloudflare must not become the git truth layer, secret owner, autonomous production deployer, or unrestricted code editor.

Core laws:

- Edge runtime does not equal source truth.
- Preview does not equal production.
- GREEN checks do not equal automatic deployment.
- Production requires AMK approval.
- Secrets must not be created, rotated, deleted, or exposed by automation.

## Preview dashboard receipt (CF-1)

**Pages preview** (`z-sanctuary-universe`), security headers on `dashboard/_headers`, production domain **HOLD**, and manual test checklist:

- **[PHASE_CF_1_PREVIEW_DASHBOARD_GREEN_RECEIPT.md](../docs/PHASE_CF_1_PREVIEW_DASHBOARD_GREEN_RECEIPT.md)** — preview URL, branch alias, headers table, required gates (`verify:md`, `z:traffic`, `z:car2`), production HOLD, manual browser checklist (root, dashboard UI, `/Html/index-skk-rkpk.html`, no prod binding, no Workers/secrets/R2/AI routes).

**Z-Sanctuary Claude (Core) handoff:** shorter mirror + pointers at `C:\Cursor Projects Organiser\Z-Sanctuary Claude\docs\PHASE_CF_1_PREVIEW_DASHBOARD_GREEN_RECEIPT.md` (same Organiser root as this hub).

After editing the receipt or any preview-facing path, re-run the three hub gates from the receipt and keep `VERIFY_COMMANDS.json` / `TEST_MATRIX.json` as the machine-facing command matrix.
