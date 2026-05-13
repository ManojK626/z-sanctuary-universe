# Z-CRYSTAL-DNA-1 — Crystal DNA Mesh (doctrine)

**Purpose.** A **safe self-reconstruction vocabulary** for Z-Sanctuary: how important assets relate, what depends on what, and how recovery is **thought about** without **automatic repair**. This document is **governance and identity only** — no runtime heal loop, no autonomous file repair, and no secret or NAS mutation.

## Metaphor (read-only spine)

| Concept | Meaning |
| --- | --- |
| **Crystal** | The **whole** sanctuary posture: integrity intent, operator law, and the graph of critical shards. |
| **DNA card** | One **typed identity record** for a shard: where it lives, who owns it, what it depends on, how it may be rebuilt **in principle**, and recovery colour. |
| **Shard** | A **unit of continuity**: a file, module entry, registry JSON, generated report, or **project bridge** (for example control-link or doorway policy). Shards are **named**, not silently mutated. |

The mesh is a **dependency graph over shards** — useful for compare/detect/report and **human-approved** restore planning only.

## Shard types (examples)

| `type` | Typical shard |
| --- | --- |
| `registry` | Machine-readable truth in `data/*.json` |
| `script` | Verifier or sync tool under `scripts/` |
| `report` | Derived evidence under `data/reports/` |
| `doc` | Doctrine under `docs/` |
| `bridge` | Satellite or operator bridge (for example doorway telemetry policy) |
| `governance_pack` | Cross-cutting rules (for example `cloudflare-governance/`) |

## DNA card fields (normative)

Each shard in `data/z_crystal_dna_asset_manifest.json` uses:

| Field | Role |
| --- | --- |
| `id` | Stable shard key. |
| `type` | Shard class (see table above or manifest enum). |
| `path` | Hub-relative or documented path string (identity; not a write target by this phase). |
| `owner_layer` | Who curates it: for example `hub_ssws`, `hub_registry`, `z_lab_capsule`, `cloudflare_governance`. |
| `dependencies` | Other shard `id` values this shard logically requires to be meaningful. |
| `hash_optional` | Optional content fingerprint for **compare** workflows (may be empty until a hash pipeline exists). |
| `rebuild_rule` | **Declarative** hint only (command name, doc section, or “human-only”) — never executed by this doctrine. |
| `risk` | `low` / `medium` / `high` — blast radius if wrong or missing (advisory). |
| `status` | Recovery colour (see below). |

## Recovery states (colours)

| Status | Meaning |
| --- | --- |
| `GREEN` | Expected healthy for current phase; compare OK. |
| `YELLOW` | Drift or freshness concern; review before treating as authoritative. |
| `BLUE` | Hold / AMK or overseer decision before structural change. |
| `RED` | Blocked or known-bad; do not treat as source of truth. |
| `QUARANTINE` | Isolated from automatic promotion; manual triage only. |
| `NAS_WAIT` | Cold mirror or NAS-backed role **declared** but not mounted or verified. |

## Allowed versus forbidden actions

**Allowed (human or gated tooling, manifest-scoped):**

- `detect` — observe presence, schema, freshness flags.
- `compare` — diff or hash compare against expectation or receipt.
- `report` — write **read-only** reports under governed report paths.
- `propose restore` — emit a **plan** or checklist for operator approval (no auto-apply).

**Forbidden (this phase and default posture):**

- `automatic repair` — no self-healing file rewrite from DNA mesh alone.
- `secret restore` — no vault or credential material through this lane.
- `deploy` — no production or edge promotion.
- `force push` — no git history mutation from mesh automation.
- `NAS mutation` — no create/write on NAS volumes from mesh tooling.
- `off-manifest writes` — no writes outside manifest-approved targets (when tools are added later, they must stay manifest-bound).

## NAS (future cold mirror)

When Synology or NAS volumes are **mounted and verified**, DNA may describe shards whose **cold mirror** lives on NAS — **read/compare** posture first. Until then, `NAS_WAIT` marks declaration-only rows. **Cold mirror** means backup and parity checks under operator control — not live authoritative mutation from the hub.

## Relations to other phases (one spine, many lenses)

| Neighbour | How DNA mesh relates |
| --- | --- |
| **Z-SSWS** | Workspace and cockpit truth are shards; SSWS boot remains separate and human-gated. |
| **Z-Lab** | Labs capsule appears as `owner_layer` reference shards; no silent cross-repo repair. |
| **Z-DOORWAY** | Doorway registries and telemetry are shards; opening a workspace is not rebuilding DNA. |
| **Z-CONTROL-LINK** | Satellite bridge files are bridge-type shards; sync stays manifest-bound and dry-run first. |
| **Cloudflare governance** | Edge and preview doctrine lives as a governance pack shard set; no deploy from DNA mesh. |

## Law line

**DNA mesh names and relates shards; it does not repair them by itself. Compare and report first; restore only with explicit human gate.**
