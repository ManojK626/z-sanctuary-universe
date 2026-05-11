# Z Experiential Profile Registry (Z-EXL-2)

**Status:** Sibling doctrine to **Z-EXL-1**. Metadata-only — no runtime, no schema for individual profiles (Z-EXL-1 owns that), no compatibility matrix, no inheritance engine, no runtime negotiation, no profile auto-resolution, no deployment authority, no provider calls, no cross-project file reads, no approval-workflow infrastructure, no entitlement enforcement, no profile syncing.

**Scope (v0):** **REGISTRY ONLY.** A single JSON document that lists which Z-* projects have adopted Z-EXL-1 and at what status. Nothing more.

**Citation key (forever):** `Z_EXL_2`

**Relationship to Z-EXL-1:**

- **Z-EXL-1** = experiential language law + per-project profile schema (`z_experiential_language_schema_v1`). Frozen.
- **Z-EXL-2** = profile registry + adoption map (this doctrine). New schema: `z_experiential_profile_registry_v1`.
- A future *language-schema* breaking change would go to **Z-EXL-3**, not collide with this slug.

If Z-EXL-2 conflicts with Z-EXL-1 on accessibility or DRP non-harm, **accessibility + DRP non-harm** win. Unresolved product conflicts go to **`Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md`** and human oversight.

---

## 1. Purpose

| Goal | Outcome |
| --- | --- |
| Adoption visibility | One canonical place to see which Z-* projects have a Z-EXL-1 profile and at what status |
| No runtime coupling | The registry is a JSON document, not a service. No project reads from it at runtime |
| Reserved-set discipline | Reserve slots for projects that intend to adopt, without claiming they implement anything yet |
| Honest layer claims | Each entry declares which Z-EXL-1 layers the project actually implements — narrower than "all 8" is fine |
| Entitlement boundary preserved | Listing a project in the registry NEVER implies shared authority, identity, or paid access |

---

## 2. What Z-EXL-2 is — and is not

**Is:**

- A **read-only declarative** doctrine: this markdown + `data/z_experiential_profile_registry.json`.
- A **single document**: one registry, hand-curated by the hub maintainer, updated when a project's status changes.
- **Versioned** (`z_experiential_profile_registry_v1`).

**Is not:**

- A schema for individual profiles (Z-EXL-1 owns that — `data/z_experiential_language_schema.json`).
- A compatibility matrix between projects.
- An inheritance engine.
- A runtime registry / API / discovery service.
- A way to enforce, approve, or deny adoption.
- A way to share profiles, identity, or entitlements across projects.

> **Hard rule (entitlement boundary, restated):**
> *Listing a project in this registry never implies shared authority, shared identity, shared paid access, or any cross-project trust.*

---

## 3. Registry document shape

The canonical registry lives at `data/z_experiential_profile_registry.json`. Document envelope:

```json
{
  "schema": "z_experiential_profile_registry_v1",
  "doctrine": "Z-EXL-2",
  "registry_version": "<semver>",
  "updated_at": "<ISO-8601 date>",
  "entries": [ /* row objects, see §4 */ ]
}
```

| Envelope field | Meaning |
| --- | --- |
| `schema` | Always `z_experiential_profile_registry_v1` for this doctrine version |
| `doctrine` | Always `Z-EXL-2` |
| `registry_version` | Semver string for the registry document itself; bumps additively when entries change |
| `updated_at` | ISO-8601 date of the last edit |
| `entries` | Array of row objects (see §4). Order is informational; readers MUST NOT rely on order |

---

## 4. Registry row shape (the only fields v0 carries)

Each row in `entries[]` carries **exactly seven fields**. No others permitted in v0:

| Field | Type | Meaning |
| --- | --- | --- |
| `project_id` | string (Z-EXL-1 enum) | Project identifier — must be one of the values in the Z-EXL-1 schema's `project_id` enum |
| `experience_profile_id` | string | The `experience_profile_id` declared in the project's own profile JSON; empty string `""` for `reserved` / `retired` rows |
| `layers_implemented` | array of strings | Subset of the Z-EXL-1 layer field names the project actually implements (e.g. `["sensory_mode","rhythm_language"]`). Empty array `[]` for `reserved` / `retired` |
| `status` | enum | `active` · `reserved` · `retired` (see §5) |
| `profile_ref_path` | string | Informational metadata only — a path string pointing to the project's own profile JSON. The hub MUST NOT fetch, open, or validate this path. Empty string `""` for `reserved` / `retired` |
| `canonical_project_home` | string | Informational name of the project's home folder (e.g. `Z-Sanctuary Browser`). Empty string `""` if unknown |
| `related_docs` | array of strings | Informational pointers to relevant project-side docs (pointer markdown, green receipt, etc.). Empty array `[]` if none |

`layers_implemented` tokens MUST come from the Z-EXL-1 layer field names (the field-name set, not the value set):

```text
sensory_mode · rhythm_language · motion_intensity · color_realm ·
glow_level · adaptation_authority · memory_posture · bridge_status
```

A project that publishes a profile but only claims a subset is conformant — Z-EXL-1 does not require all 8 layers be implemented to be valid.

---

## 5. Status semantics

| Status | Meaning | Required fields populated |
| --- | --- | --- |
| `active` | Project ships a Z-EXL-1 profile JSON validated by the hub schema, and a runtime adapter / verifier in its own repo | All seven fields populated |
| `reserved` | Project is named in the family roster but has not yet shipped a profile | Only `project_id` and `status`; the rest may be empty strings / arrays |
| `retired` | Project once shipped a profile but has been retired or merged into another project | All seven fields may be populated for historical traceability; the project is no longer expected to honour the profile |

Status transitions are hand-edits by the hub maintainer. There is no approval workflow infrastructure — escalations go to **`Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md`** and human oversight.

---

## 6. Reserved family roster (v0)

The following `project_id` values are reserved by the Z-EXL-1 schema's enum and therefore appear in v0 of this registry. v0 ships **`lumina` as `active`** and the others as **`reserved`**:

| project_id | v0 status |
| --- | --- |
| `lumina` | active |
| `questra` | reserved |
| `lawyer_ux` | reserved |
| `magical_bridge` | reserved |
| `ecosphere_map` | reserved |
| `zmv` | reserved |
| `z_uil` | reserved |
| `omnai` | reserved |
| `zuno` | reserved |
| `franed` | reserved |

Adding a new `project_id` to this registry requires first adding it to the Z-EXL-1 schema's `project_id` enum (additive change). If the new project would be active, it must also ship its own profile JSON validated by the Z-EXL-1 hub schema.

---

## 7. v0 explicitly NOT in scope

In line with your instruction, v0 of Z-EXL-2 does NOT carry any of the following:

| ❌ Not in v0 | Note |
| --- | --- |
| Compatibility matrices | No `co_render_safe_with` / `co_render_unsafe_with` fields |
| Inheritance engine / inherits_from | No parent-child profile relationships |
| Override rules | No `overrides` object |
| Runtime negotiation | No protocol, no API |
| Profile auto-resolution | The registry does not "find" profiles; paths are informational metadata |
| Deployment changes | No CD, no Cloudflare, no Pages |
| Provider calls | No LLM, no remote AI, no telemetry |
| Cross-project file reads | The hub never opens `profile_ref_path`; readers MUST NOT either |
| Approval workflow infrastructure | Status changes are plain hand-edits |
| Entitlement enforcement | Boundary remains declarative; enforcement stays in Z-UIL §5 / Z-LEGAL hierarchy |
| Profile syncing | No push, no pull, no diff alerts |

---

## 8. Versioning policy

- The schema string is `z_experiential_profile_registry_v<N>` where `N` starts at `1`.
- v(N) → v(N+1) **must** be additive (new optional fields, new status values, never breaking).
- Breaking changes start a new doctrine slug (`Z-EXL-2.1` → no, prefer a fresh doctrine such as `Z-EXL-4`). v1 readers must continue to work against v1 registries forever.
- The `registry_version` envelope field is independent of the schema version — it tracks edits to the registry document itself (semver, additive within v1).
- Adopting projects MUST NOT pin to anything other than the schema string they support.

---

## 9. Acceptance

| Check | Expected |
| --- | --- |
| `data/z_experiential_profile_registry.json` parses as JSON | Yes |
| `entries[].project_id` is a member of the Z-EXL-1 schema `project_id` enum | Yes for every row |
| `entries[].status` is `active` / `reserved` / `retired` | Yes for every row |
| `entries[].layers_implemented[]` are subsets of the Z-EXL-1 layer field-name set | Yes for every row |
| Lumina entry has `status: "active"` and a non-empty `experience_profile_id` matching its profile JSON | Yes |
| No runtime coupling, no cross-project IPC, no fetch path is introduced anywhere | Yes |
| No project's runtime is required to read this registry | Yes — registry is for hub maintainers and human reviewers |

The Lumina-side note in `Z-Sanctuary Browser/docs/Z-EXL-1.md` and `Z-Sanctuary Browser/renderer/modules/modules.html` is a **citation only** — Lumina's runtime continues to operate without ever reading this registry.

---

## 10. Verify (one-liners — no new dependencies)

```bash
node -e "JSON.parse(require('fs').readFileSync('data/z_experiential_profile_registry.json','utf8')); console.log('Z-EXL-2 registry JSON OK')"
```

A more thorough hand-check:

```bash
node -e "const fs=require('fs');const r=JSON.parse(fs.readFileSync('data/z_experiential_profile_registry.json','utf8'));const s=JSON.parse(fs.readFileSync('data/z_experiential_language_schema.json','utf8'));const idEnum=s.properties.project_id.enum;const layerNames=['sensory_mode','rhythm_language','motion_intensity','color_realm','glow_level','adaptation_authority','memory_posture','bridge_status'];const okStatus={active:1,reserved:1,retired:1};const errs=[];if(r.schema!=='z_experiential_profile_registry_v1')errs.push('bad schema');if(r.doctrine!=='Z-EXL-2')errs.push('bad doctrine');if(!Array.isArray(r.entries))errs.push('entries must be array');for(const e of (r.entries||[])){if(idEnum.indexOf(e.project_id)<0)errs.push('bad project_id '+e.project_id);if(!okStatus[e.status])errs.push('bad status '+e.status);for(const L of (e.layers_implemented||[]))if(layerNames.indexOf(L)<0)errs.push('bad layer '+L);}console.log(errs.length?'FAIL: '+errs.join(', '):'Z-EXL-2 registry checks OK')"
```

---

## 11. Rollback

Remove `docs/design/Z_EXPERIENTIAL_PROFILE_REGISTRY.md`, `data/z_experiential_profile_registry.json`, and the green receipt. Remove the citation note from Lumina's `docs/Z-EXL-1.md` and `renderer/modules/modules.html`. Z-EXL-1 is unaffected. No production runtime in any project depends on this doctrine — by design.

---

## Related documents

- [Z_EXPERIENTIAL_LANGUAGE_LAYER.md](Z_EXPERIENTIAL_LANGUAGE_LAYER.md) — Z-EXL-1 (sibling: language law + per-project schema)
- [Z_UNIVERSAL_INTERACTION_LANGUAGE.md](Z_UNIVERSAL_INTERACTION_LANGUAGE.md) — Z-UIL interaction constitution
- [Z_VISUAL_INTERACTION_LANGUAGE.md](Z_VISUAL_INTERACTION_LANGUAGE.md) — Z-VIL visual realms
- [../cross-project/PHASE_Z_EXL_1_GREEN_RECEIPT.md](../cross-project/PHASE_Z_EXL_1_GREEN_RECEIPT.md) — Z-EXL-1 ship receipt
- [../cross-project/PHASE_Z_EXL_2_GREEN_RECEIPT.md](../cross-project/PHASE_Z_EXL_2_GREEN_RECEIPT.md) — Z-EXL-2 ship receipt (this phase)
- `../../data/z_experiential_profile_registry.json` — canonical registry document
- `../../data/z_experiential_language_schema.json` — Z-EXL-1 canonical schema (registry rows reference its `project_id` enum and layer names)
