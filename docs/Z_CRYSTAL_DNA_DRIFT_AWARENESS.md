# Z-Crystal DNA — Shard Drift and Integrity Awareness (Phase Z-CRYSTAL-DNA-3)

This phase adds **read-only** topology drift detection for the Z-Crystal DNA mesh. It **detects and reports** only; it does not repair manifests, mutate git, deploy, write to NAS, trigger restore, or read secrets.

## Law (non-negotiable)

- **Detect / compare / report** — outputs are limited to the drift report JSON and Markdown under `data/reports/`.
- **No repair** — findings are advisory; operators resolve data or posture separately.
- **No writes** outside those reports from this pipeline.
- **No deploy, no git mutation, no NAS writes, no automatic restore, no secret access.**

## Inputs (read-only)

| File                                          | Role                                           |
| --------------------------------------------- | ---------------------------------------------- |
| `data/z_crystal_dna_asset_manifest.json`      | DNA shards, paths, dependencies, status        |
| `data/z_satellite_control_link_manifest.json` | Satellite bridges, NAS flags, hub template age |
| `data/z_doorway_workspace_registry.json`      | Doorway entries, HOLD vs GREEN posture         |
| `dashboard/data/amk_project_indicators.json`  | Indicator signals and linked report paths      |

## Outputs

| File                                           | Role                                                                |
| ---------------------------------------------- | ------------------------------------------------------------------- |
| `data/reports/z_crystal_dna_drift_report.json` | Machine-readable findings (`schema: z_crystal_dna_drift_report_v1`) |
| `data/reports/z_crystal_dna_drift_report.md`   | Human-readable summary                                              |

Regenerate after manifest or indicator changes:

```bash
npm run z:crystal:dna:drift
```

## Signals

Findings carry a **signal** used for rollup and optional UI tinting:

`GREEN` · `YELLOW` · `BLUE` · `HOLD` · `RED` · `QUARANTINE` · `NAS_WAIT`

Overall rollup prefers the **worst** signal among findings (see script `SIGNAL_ORDER`). Exit code **1** is reserved when the worst signal is **RED** (operator attention).

## What is detected

- **Missing shards** — manifest entries whose `path` does not resolve under the repo root (when paths are present and checkable).
- **Broken dependencies** — DNA dependency targets that are not shard IDs in the manifest.
- **Orphan nodes** — crystal shards with no inbound or outbound DNA edges, excluding doctrine root and excluding **NAS_WAIT** / **NAS owner** shards (expected isolation).
- **Stale bridges** — satellite bridge file mtime older than the hub template where applicable.
- **HOLD conflicts** — mixed HOLD vs GREEN posture across related surfaces (for example doorway vs deploy posture).
- **Unresolved NAS_WAIT** — NAS-required satellites or shards stuck in NAS_WAIT without a documented bridge path where the check applies.
- **Unexpected topology divergence** — duplicate crystal paths, satellite not reflected in DNA dependency graph (topology gap), indicator report paths missing (capped sampling), id overlap across manifests.

Exact codes and messages are defined in `scripts/z_crystal_dna_drift_check.mjs`.

## Optional visualization hook

The JSON report includes `visualization_hook.relative_url` pointing at the drift report. The **Living Crystal** read-only map (`dashboard/scripts/z-crystal-dna-map-readonly.js`) may **GET** that JSON (same origin) and apply CSS classes to nodes whose `data-id` matches finding `refs[]` entries (for example `crystal:dna_mesh`, `sat:z_labs_capsule`).

## Related

- Phase receipt: `docs/PHASE_Z_CRYSTAL_DNA_3_GREEN_RECEIPT.md`
- DNA-2 map panel: `dashboard/panels/z-crystal-dna-map.html`
