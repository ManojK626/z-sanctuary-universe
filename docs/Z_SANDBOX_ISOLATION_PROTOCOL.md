# Z Sandbox Isolation Protocol

Purpose:

- Keep experimental phase work separated from the sanctuary core.
- Preserve stability while still allowing fast iteration.

Hard rules:

- No sandbox module entry in `core/z_module_registry_boot.js`.
- No sandbox entry in `docs/z_module_registry.json`.
- No production route wiring for sandbox assets.
- Every sandbox iteration must produce an auditable report.

Promotion flow:

1. Build in `sandbox/zgm_phase_lab/`.
2. Run `node scripts/z_sandbox_phase_guard.mjs`.
3. Verify `data/reports/z_sandbox_phase_guard.json` status is `green`.
4. Review with owner and approve before any integration.

Status model:

- `green`: sandbox isolated, controls respected.
- `hold`: isolation breach or missing required artifacts.
