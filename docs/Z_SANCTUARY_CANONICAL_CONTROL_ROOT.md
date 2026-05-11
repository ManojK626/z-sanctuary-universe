# Z-Sanctuary canonical control root (hub + satellites)

**Verdict.** Maintain **one** supreme governance and control root. Other projects **do not** duplicate long doctrine; they **point** to this hub.

## Canonical root

```text
Z_Sanctuary_Universe
```

Full path on this workstation (adjust only if your PC root layout differs):

```text
C:\Cursor Projects Organiser\Z_Sanctuary_Universe
```

This repository is the **single source of truth** for:

| Domain | Hub location (examples) |
| ---------------------------- | ------------------------------------------------------------------------------------ |
| Doctrine and builder context | `docs/`, `AGENTS.md`, `.cursor/rules/` |
| Registries and manifests | `data/` |
| SSWS control spine | `docs/Z_SSWS_ZLAB_UNIFIED_CONTROL_SPINE.md`, `data/z_ssws_zlab_control_spine.json` |
| Doorway registries | `data/amk_project_doorway_registry.json`, `data/amk_workspace_doorway_registry.json` |
| Mini-bot / traffic law | `docs/`, `data/reports/`, traffic scripts as documented |
| Verification authority | Hub `npm run verify:*` and named tasks (see `package.json`, `AGENTS.md`) |
| Cursor operating protocol | `docs/z-cursor-ops/`, hub rules, slash commands under `.cursor/commands/` |

## Wrong model (do not scale this)

| Anti-pattern | Why it fails |
| -------------------------------------------------- | ----------------------------------------------------------- |
| Paste giant instructions into every Cursor project | Drift, stale copies, contradictions, impossible maintenance |
| Fork governance text per repo | Hallucinated variants and merge pain |

## Right model

```text
One canonical brain (this hub)
Many linked satellites (other repos)
```

- **Z-SSWS** acts as the **central nervous system** (routing, registries, doorways, coordination).
- **Each project** is an **organ/module**: local code and **thin bridges** only.

## What every satellite project should contain

**Only** small link files, for example:

| Placement | Role |
| --------------------------------------------- | ------------------------------------------------------------------------------------- |
| `docs/Z_SANCTUARY_CONTROL_LINK.md` | Human-readable pointer to hub + mandatory reading list |
| `.cursor/rules/z_ssws_control.mdc` (optional) | Cursor rule stub that states the canonical path and forbids overriding hub governance |

**Do not** copy the full hub ruleset or monster docs into satellites. **Do** keep one copy of the bridge template from this repo:

- Template: [`docs/Z_SANCTUARY_CONTROL_LINK.md`](Z_SANCTUARY_CONTROL_LINK.md) (copy into each satellite as the same filename, then adjust machine path only if needed).

Local project rules **may extend** operational detail (paths, stack) but **must not override** canonical governance, release gates, vault policy, or sacred-move requirements.

## Automation (Z-CONTROL-LINK-1)

Hub script [`scripts/z_sync_control_links.mjs`](../scripts/z_sync_control_links.mjs) reads [`data/z_satellite_control_link_manifest.json`](../data/z_satellite_control_link_manifest.json) and syncs the template [`docs/Z_SANCTUARY_CONTROL_LINK.md`](Z_SANCTUARY_CONTROL_LINK.md) into each approved satellite (`docs/Z_SANCTUARY_CONTROL_LINK.md` by default). Default is dry-run; `npm run z:control-links:apply` writes. Reports: `data/reports/z_control_link_sync_report.{json,md}`.

## Related

- SSWS × Z-Lab spine: [`Z_SSWS_ZLAB_UNIFIED_CONTROL_SPINE.md`](Z_SSWS_ZLAB_UNIFIED_CONTROL_SPINE.md)
- AI builder intake: [`AI_BUILDER_CONTEXT.md`](AI_BUILDER_CONTEXT.md) (if present in tree)
