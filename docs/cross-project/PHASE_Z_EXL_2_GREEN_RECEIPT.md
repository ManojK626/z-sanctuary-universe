# Phase Z-EXL-2 — Z Experiential Profile Registry · Green receipt

## Scope

**Doctrine + single registry JSON document only.** Sibling to Z-EXL-1, metadata-only.

Not in scope (held strictly): compatibility matrices, inheritance engine, runtime negotiation, profile auto-resolution, deployment changes, provider calls, cross-project file reads, approval-workflow infrastructure, entitlement enforcement, profile syncing.

## Delivered

| Item | Path |
| --- | --- |
| Doctrine (sibling to Z-EXL-1) | `docs/design/Z_EXPERIENTIAL_PROFILE_REGISTRY.md` |
| Registry JSON | `data/z_experiential_profile_registry.json` |
| Green receipt (this file) | `docs/cross-project/PHASE_Z_EXL_2_GREEN_RECEIPT.md` |
| Z-EXL-1 §10 clarification | `docs/design/Z_EXPERIENTIAL_LANGUAGE_LAYER.md` (one-line patch: future language-schema breaking change is `Z-EXL-3`, since `Z-EXL-2` is now the sibling registry slug) |

## Lumina-side touch (citation only — no runtime change)

| Lumina file | Change |
| --- | --- |
| `Z-Sanctuary Browser/docs/Z-EXL-1.md` | Added a tiny pointer note: Lumina is registered in the hub under `experience_profile_id: lumina_sanctuary_v0` |
| `Z-Sanctuary Browser/renderer/modules/modules.html` | Added the same pointer line to the existing Z-EXL-1 doctrine card |

No verifier change. No adapter change. No `main.js` change. No new IPC. No cross-repo read.

## Registry shape (v0)

Each row carries exactly seven fields:

```text
project_id · experience_profile_id · layers_implemented · status ·
profile_ref_path · canonical_project_home · related_docs
```

`status` ∈ `active` | `reserved` | `retired`.

v0 ships **`lumina` as `active`**, all 9 sibling projects as **`reserved`**:

```text
lumina (active) · questra · lawyer_ux · magical_bridge · ecosphere_map ·
zmv · z_uil · omnai · zuno · franed
```

The `project_id` set comes directly from the Z-EXL-1 schema's `project_id` enum — registry stays in lockstep with language law.

## Verify (hub root)

```bash
node -e "JSON.parse(require('fs').readFileSync('data/z_experiential_profile_registry.json','utf8')); console.log('Z-EXL-2 registry JSON OK')"

node -e "const fs=require('fs');const r=JSON.parse(fs.readFileSync('data/z_experiential_profile_registry.json','utf8'));const s=JSON.parse(fs.readFileSync('data/z_experiential_language_schema.json','utf8'));const idEnum=s.properties.project_id.enum;const layerNames=['sensory_mode','rhythm_language','motion_intensity','color_realm','glow_level','adaptation_authority','memory_posture','bridge_status'];const okStatus={active:1,reserved:1,retired:1};const errs=[];if(r.schema!=='z_experiential_profile_registry_v1')errs.push('bad schema');if(r.doctrine!=='Z-EXL-2')errs.push('bad doctrine');if(!Array.isArray(r.entries))errs.push('entries must be array');for(const e of (r.entries||[])){if(idEnum.indexOf(e.project_id)<0)errs.push('bad project_id '+e.project_id);if(!okStatus[e.status])errs.push('bad status '+e.status);for(const L of (e.layers_implemented||[]))if(layerNames.indexOf(L)<0)errs.push('bad layer '+L);}console.log(errs.length?'FAIL: '+errs.join(', '):'Z-EXL-2 registry checks OK')"
```

## Verify (Lumina repo — must remain green)

```bash
cd "../Z-Sanctuary Browser"
npm run verify:all
```

`verify:all` MUST stay 8/8 green. Z-EXL-2 introduces no new Lumina verifier — only two pointer lines in existing files.

## Manual checklist

| Check | Pass |
| --- | --- |
| Doctrine declares Z-EXL-2 as sibling to Z-EXL-1 (registry-only, metadata-only) | ☐ |
| Registry parses as JSON | ☐ |
| Every `entries[].project_id` matches the Z-EXL-1 `project_id` enum | ☐ |
| Every `entries[].status` ∈ `active` / `reserved` / `retired` | ☐ |
| Lumina entry status = `active`, `experience_profile_id` = `lumina_sanctuary_v0`, `layers_implemented` lists all 8 layer names | ☐ |
| All 9 sibling projects present as `reserved` rows with empty informational fields | ☐ |
| No compatibility matrix, no inheritance, no override, no runtime negotiation introduced | ☐ |
| Lumina pointer note added to `docs/Z-EXL-1.md` and `renderer/modules/modules.html` | ☐ |
| `npm run verify:all` in Lumina remains green (8/8) | ☐ |
| Entitlement boundary preserved — listing in registry never implies shared authority / identity / paid access | ☐ |

## Operator sign-off

| Role | Name | Date |
| --- | --- | --- |
| Operator | | |

## Rollback

Remove `docs/design/Z_EXPERIENTIAL_PROFILE_REGISTRY.md`, `data/z_experiential_profile_registry.json`, this receipt, and the two Lumina pointer notes (`docs/Z-EXL-1.md`, `renderer/modules/modules.html`). Revert the one-line Z-EXL-1 §10 clarification. Z-EXL-1 and the Lumina runtime are unaffected.
