# ZGM Phase Lab (Sandbox Only)

This sandbox is the isolated lane for new Z-Gadget Mirrors phases.

Rules:

- Build and test here first.
- Do not register sandbox modules in core registry.
- Do not wire sandbox routes into production dashboards.
- Promote only after explicit approval.

Use:

- Update `sandbox/zgm_phase_lab/phase_manifest.json`
- Run `node scripts/z_sandbox_phase_guard.mjs`
- Review `data/reports/z_sandbox_phase_guard.json`
- Review `sandbox/zgm_phase_lab/CAPABILITY_ENVELOPE.md` before any scope change

Current posture:

- `paused_pending_nas_sync`
- Stabilization mode only (no new phase expansion, no bridge activation).
