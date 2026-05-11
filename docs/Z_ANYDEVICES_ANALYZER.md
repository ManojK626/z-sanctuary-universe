# Z AnyDevices Analyzer (Audit-Only)

`Z-AnyDevices Analyzer` is a local, read-only capability scan that helps map user hardware to compatible Z-Sanctuary services without exposing personal data.

## Goals

- Detect device capability classes (compute, network, storage, security).
- Produce a privacy-safe report for planning integrations.
- Keep analysis local and non-invasive.

## Guardrails

- Local-only execution.
- No cloud upload.
- No serial numbers or PNP instance IDs.
- Host identity redacted by default.
- No runtime mutation of Sanctuary services.

## Files

- Policy: `config/z_anydevices_policy.json`
- Script: `scripts/z_anydevices_analyzer.mjs`
- Output JSON: `data/reports/z_anydevices_analyzer.json`
- Output Markdown: `data/reports/z_anydevices_analyzer.md`
- Approval Queue Script: `scripts/z_anydevices_approval_queue.mjs`
- Approval Queue JSON: `data/reports/z_anydevices_approval_queue.json`
- Approval Queue Markdown: `data/reports/z_anydevices_approval_queue.md`

## Run

```bash
npm run devices:analyze
```

or VS Code task:

- `Z: AnyDevices Analyzer`
- `Z: AnyDevices Approval Queue Init`
- `Z: AnyDevices Approval Queue List`

## Approval Gate (mandatory)

Any device activity must be requested and explicitly approved first:

```bash
node scripts/z_anydevices_approval_queue.mjs request --device "USB Camera" --intent "telemetry_read" --by "zuno" --risk low
node scripts/z_anydevices_approval_queue.mjs approve ZAD-0001 --by "zuno" --note "read-only scope"
```

No queue approval means no action.

## Capability Mapping (examples)

- `local_ai_parallel_ready`
- `secure_vault_ready`
- `high_speed_sync_candidate`
- `wearable_bridge_candidate`
- `iot_bridge_candidate`
- `gpu_accel_candidate`

This module is intentionally audit-first. It informs decisions but does not auto-enable integrations.
