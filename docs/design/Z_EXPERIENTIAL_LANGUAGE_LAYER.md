# Z Experiential Language Layer (Z-EXL-1)

**Status:** Doctrine and architecture text only — no runtime coupling, no shared adapter library, no auto profile sync, no provider calls, no cross-project memory, no billing/entitlement enforcement, no deployment authority.

**Scope:** Defines a **shared experiential vocabulary** across Z-* projects so they can feel coherent to the user without merging runtimes, identities, or entitlements.

**Citation key (forever):** `Z_EXL_1`

**Related layers (siblings in this hub):**

- **[Z_UNIVERSAL_INTERACTION_LANGUAGE.md](Z_UNIVERSAL_INTERACTION_LANGUAGE.md)** — Z-UIL: interaction & governance constitution
- **[Z_VISUAL_INTERACTION_LANGUAGE.md](Z_VISUAL_INTERACTION_LANGUAGE.md)** — Z-VIL: visual realms, comfort modes, motion discipline
- **[../ENERGY_EMOTION_LAYER.md](../ENERGY_EMOTION_LAYER.md)** — emotional state engine (implementation-side)

If Z-EXL conflicts with Z-VIL or Z-UIL on accessibility or DRP non-harm, **accessibility + DRP non-harm** win. Unresolved product conflicts go to **`Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md`** and human oversight.

---

## 1. Purpose

| Goal | Outcome |
| --- | --- |
| One experiential feel | Operators and users recognise "Z-Sanctuary family" rhythm, sensory comfort, and emotional posture across distinct projects |
| No runtime coupling | Each project enforces the layer in its own runtime against a shared vocabulary — no shared adapter library, no shared event bus |
| Entitlement boundary | **Shared experiential language NEVER implies shared authority, shared identity, or shared paid access** |
| Long-term safety | Sensory and emotional copy stay non-clinical, accessibility-first, and consent-led |

---

## 2. What Z-EXL-1 is — and is not

**Is:**

- A **read-only declarative** doctrine: this markdown + `data/z_experiential_language_schema.json` + per-project profile JSON files validated against the schema.
- A **vocabulary**: every project enforces it themselves, in their own runtime, against the same words.
- **Versioned** (`z_experiential_language_schema_v1`, future `_v2`, …) so a revision in one project never forces a migration in another.

**Is not:**

- A shared runtime, shared adapter library, shared event bus, or shared store.
- A way to share user identity, billing, paid access, or entitlements across projects.
- A behaviour-modification engine — projects are free to ignore layers they don't apply.

> **Hard rule (entitlement boundary):**
> *Shared experiential language never implies shared authority, shared identity, or shared paid access.*
> Any code that reads a Z-EXL profile MUST NOT, in the same operation, traverse project trust boundaries (no cross-origin reads, no cross-project IPC, no shared session tokens).

---

## 3. The eight layers (v0)

| # | Layer | Schema field | Allowed values (v0) | Notes |
| --- | --- | --- | --- | --- |
| 1 | Sensory mode | `sensory_mode` | `low_light` · `photophobia_friendly` · `soft` · `balanced` · `cinematic` | Brightness, saturation, glare posture |
| 2 | Rhythm language | `rhythm_language` | `calm` · `reflective` · `active` · `playful` · `operational` | Pacing / tempo language for content + interaction |
| 3 | Motion intensity | `motion_intensity` | `still` · `low` · `moderate` · `high` | Bounded by `prefers-reduced-motion`; `high` must remain smooth, never strobing |
| 4 | Color realm | `color_realm` | `neutral` · `galaxy` · `forest` · `ocean` · `sanctuary` · `aurora` | Z-VIL realm vocabulary; project may map to its palette |
| 5 | Glow level | `glow_level` | `none` · `soft` · `balanced` · `strong` | Photophobia-friendly when `low_light` / `photophobia_friendly` sensory_mode |
| 6 | Adaptation authority | `adaptation_authority` | `advisory_only` · `user_confirmed` · `operator_confirmed` | `operator_confirmed` MUST be audit-logged in the project's own audit channel |
| 7 | Memory posture | `memory_posture` | `none` · `none_or_local_only` · `session_only` · `local_only` · `local_with_explicit_export` · `governed_share` | Bounded by accessibility invariants and project entitlement boundary |
| 8 | Bridge status | `bridge_status` | `metadata_only` · `advisory_only` · `governed_active` | v0 ships ALL projects at `metadata_only`; `governed_active` requires charter |

Profiles also carry: `project_id`, `experience_profile_id`, `accessibility_invariants[]`, `project_identity`, `entitlement_boundary`.

### Reserved-name discipline

Layer names and the values listed above are **reserved**. Projects MAY add new values to a layer only by submitting a profile to the hub for review; they MUST NOT redefine an existing value's meaning. Forks become new doctrine slugs (`Z-EXL-2`), not silent edits.

### Forbidden framing

In line with the Z-Sanctuary sensory + safety doctrine:

- No layer or value may carry medical, clinical, or guaranteed-cognitive-outcome meaning.
- No layer may be used to imply diagnosis, treatment, or behavioural classification of users.
- No layer may surface as a user-visible label that contradicts these constraints.

---

## 4. Accessibility invariants (recommended tokens)

`accessibility_invariants[]` is a free-form list of declarative tokens. The hub recommends the following baseline; projects MAY add their own, prefixed with `x_<project>_`:

| Token | Meaning |
| --- | --- |
| `respect_reduced_motion` | Honours OS / app `prefers-reduced-motion` |
| `respect_reduced_transparency` | Honours `prefers-reduced-transparency` |
| `no_full_field_flashing` | No animation exceeds WCAG 2.3.1 flash thresholds |
| `no_medical_claims` | UI copy never carries clinical / cognitive-outcome wording |
| `keyboard_navigable` | All primary nav reachable by keyboard |
| `focus_visible` | Visible focus indicator on every interactive element |
| `consent_first` | Behaviour-affecting modes default OFF until user enables |
| `local_only_default` | Profile-driven adaptation does not introduce new network calls |

A profile claiming Z-EXL-1 conformance at "draft readiness" SHOULD assert the first six.

---

## 5. Adaptation authority semantics

| Tier | Who can apply | Auditing |
| --- | --- | --- |
| `advisory_only` | The host page may **suggest** a change, never enforce | Optional |
| `user_confirmed` | The user clicks / confirms before any change is applied | Recommended |
| `operator_confirmed` | An operator (admin) flips it; counts as a Guardian-gated event | **Required** — audit entry in the project's own audit channel |

A project's `adaptation_authority` value is the **maximum** tier it permits; lower-tier actions are always allowed. A project declaring `advisory_only` MUST NOT silently apply user-confirmed changes.

---

## 6. Memory posture × privacy cap law

`memory_posture` is bounded by the project's own privacy and entitlement boundary. The hub does not redefine privacy law per project — it simply requires that:

| memory_posture | Constraint |
| --- | --- |
| `none` | Nothing persisted, ever |
| `none_or_local_only` | Default v0 floor; nothing leaves the device |
| `session_only` | In-tab / in-session only; cleared on close |
| `local_only` | On-device only (IndexedDB / localStorage / app data) |
| `local_with_explicit_export` | Local plus explicit user-initiated export |
| `governed_share` | Cross-project read ONLY through Guardian-mediated channel; v0 reserves this — no project required to support it |

`governed_share` is a **future** posture. v0 ships every project at `none_or_local_only` or stricter unless its charter explicitly says otherwise.

---

## 7. Project identity mapping (vocabulary, not infrastructure)

Identity here is the **project label** used inside its profile. It is NOT a user identifier and never participates in authentication.

| Project | EXL `project_id` | Status (v0) |
| --- | --- | --- |
| Z-Saiyan Lumina (Z-Sanctuary Browser) | `lumina` | reference implementation present (Lumina repo) |
| Z-QUESTRA | `questra` | reserved — profile to be drafted by Questra maintainers |
| Z-Legal / Lawyer UX | `lawyer_ux` | reserved |
| Z-MAGICAL VISUAL BRIDGE (ZMV) | `magical_bridge` | reserved |
| Ecosphere Map | `ecosphere_map` | reserved |
| Z-MV (magical visual) | `zmv` | reserved |
| Z-UIL surface (illustrative) | `z_uil` | reserved |
| OMNAI | `omnai` | reserved |
| Zuno AI | `zuno` | reserved (advisory-only — never reads from another project's profile) |
| Franed | `franed` | reserved |

A project becomes Z-EXL-1 conformant when:

1. It ships a profile JSON validated by `data/z_experiential_language_schema.json`.
2. It enforces the layers in its own runtime.
3. It does not import a shared adapter from another project.
4. Its profile read-path does not cross trust boundaries (entitlement boundary invariant).

---

## 8. Entitlement separation rules (critical)

### 8.1 Core rule

> **Shared experiential vocabulary, shared cultural rhythm — optional.**
> **Paid tier, quotas, vaults, API keys, legal review artefacts, deploy permissions — NEVER implied by EXL conformance.**

### 8.2 What EXL conformance does NOT grant

| Domain | Separation mechanism (unchanged by Z-EXL-1) |
| --- | --- |
| Pricing / SKU | Explicit price pages, SKU tables, entitlement registries |
| Premium AI usage | Capability flags + human-readable "not included elsewhere" clauses |
| Private vault | Never reachable from unrelated project skins without SSO + policy |
| Legal review artefacts | Locked to Z-Legal / counsel workflows |
| Deploy | Only named environments and roles; dashboards display intent, not webhook execution |

`entitlement_boundary` in a profile is a **declarative reminder**, not enforcement. Enforcement remains Z-UIL §5 and Z-LEGAL hierarchy.

---

## 9. Profile shape (per project)

Each project ships **one profile JSON** declaring its EXL settings. Profiles are validated against `data/z_experiential_language_schema.json`. Minimal shape:

```json
{
  "schema": "z_experiential_language_schema_v1",
  "project_id": "<project>",
  "experience_profile_id": "<project>_<variant>_v0",
  "sensory_mode": "soft",
  "rhythm_language": "reflective",
  "motion_intensity": "low",
  "color_realm": "sanctuary",
  "glow_level": "soft",
  "adaptation_authority": "advisory_only",
  "memory_posture": "none_or_local_only",
  "accessibility_invariants": [
    "respect_reduced_motion",
    "no_full_field_flashing",
    "no_medical_claims"
  ],
  "project_identity": "<project_human_label>",
  "entitlement_boundary": "shared_language_not_shared_authority",
  "bridge_status": "metadata_only"
}
```

A reference example lives at `data/examples/z_exl_profile.example.json`.

---

## 10. Versioning policy

- The schema string is `z_experiential_language_schema_v<N>` where `N` starts at `1`.
- v(N) → v(N+1) **must** be additive: new layers, new values, new optional fields.
- Breaking changes start a new doctrine slug (`Z-EXL-2`). v1 readers must continue to work against v1 profiles forever.
- Each project pins its `schema` field exactly. Loaders refuse profiles whose schema string is newer than the loader supports.

---

## 11. Verification and change control

| Check | Intent |
| --- | --- |
| `data/z_experiential_language_schema.json` parses as JSON Schema | Ground truth for all conformance |
| `data/examples/z_exl_profile.example.json` validates | Reference profile must always pass |
| `npm run verify:md` (when added) | Markdown hygiene when this file changes |
| Sibling projects | Cite this file from operator manuals; no forced code import |

Each project that adopts Z-EXL-1 ships:

- Its own profile JSON (validated by the hub schema).
- Its own validator that loads the profile and rejects anything failing the schema.
- A test or check that asserts the entitlement boundary invariant: the profile loader does not also open cross-project channels in the same call path.

---

## 12. Reference implementation

Z-Saiyan Lumina (Z-Sanctuary Browser) is the **first reference implementation** for v0. It ships:

- A profile JSON: `Z-Sanctuary Browser/docs/lumina-sanctuary-v0.profile.json` (validated against this hub schema).
- A schema mirror: `Z-Sanctuary Browser/docs/z-exl-1.schema.json` (clearly marked as a mirror; the hub copy is canonical).
- A renderer-side adapter: `Z-Sanctuary Browser/renderer/modules/_shared/lumina-exl-profile.js` — applies the profile via existing `data-*` hooks; **no cross-project IPC**, no `require()`, no `importScripts`, no shared adapter library.
- A verifier: `Z-Sanctuary Browser/scripts/verify-z-exl-phase.js` — asserts the profile validates, the doctrine cites this hub, the adapter respects the entitlement boundary invariant.

The Lumina adapter is **Lumina-only**. Other projects build their own equivalents against the same hub schema.

---

## 13. v0 NOT-in-scope

Explicitly out of scope for v0 (do not infer from this doctrine):

- ❌ Live Lumina adapter wiring beyond data-* hooks
- ❌ Provider calls (no LLM calls, no remote AI)
- ❌ Cross-project memory (memory_posture stays per-project)
- ❌ Auto profile sync between projects
- ❌ Deployment changes
- ❌ Billing / entitlement enforcement
- ❌ Cloudflare or other deploy structure changes

---

## 14. Rollback

Remove or archive this document, the schema, and the example; dereference from any future INDEX entries; remove citation from sibling projects' profiles. No production runtime in any project depends on this doctrine — by design.

---

## Related documents

- [Z_EXPERIENTIAL_PROFILE_REGISTRY.md](Z_EXPERIENTIAL_PROFILE_REGISTRY.md) — Z-EXL-2 sibling: profile registry + adoption map (metadata-only)
- [Z_UNIVERSAL_INTERACTION_LANGUAGE.md](Z_UNIVERSAL_INTERACTION_LANGUAGE.md) — Z-UIL interaction constitution
- [Z_VISUAL_INTERACTION_LANGUAGE.md](Z_VISUAL_INTERACTION_LANGUAGE.md) — Z-VIL visual realms
- [../ENERGY_EMOTION_LAYER.md](../ENERGY_EMOTION_LAYER.md) — emotional state engine (implementation reference)
- [../cross-project/Z_MAGICAL_VISUAL_ENTITLEMENT_BOUNDARY.md](../cross-project/Z_MAGICAL_VISUAL_ENTITLEMENT_BOUNDARY.md) — kindred entitlement boundary doctrine
- [../cross-project/PHASE_Z_EXL_1_GREEN_RECEIPT.md](../cross-project/PHASE_Z_EXL_1_GREEN_RECEIPT.md) — Z-EXL-1 ship receipt
- [../cross-project/PHASE_Z_EXL_2_GREEN_RECEIPT.md](../cross-project/PHASE_Z_EXL_2_GREEN_RECEIPT.md) — Z-EXL-2 ship receipt
- `../../data/z_experiential_language_schema.json` — canonical schema
- `../../data/examples/z_exl_profile.example.json` — reference profile
- `../../data/z_experiential_profile_registry.json` — Z-EXL-2 registry document
