# Z-CRYSTAL-DNA-2 — Living Crystal Ecosystem Map (read-only)

**Purpose.** A **read-only visualization** of the Z-Crystal DNA Mesh and **neighbouring registries** so operators can see shards, dependency threads, owner layers, and recovery colours **without** any repair, write, deploy, git, NAS, or secret action from the UI.

## Surface

| Asset | Role |
| ------ | ------------------------------------------------------------------------------------- |
| Panel | `dashboard/panels/z-crystal-dna-map.html` |
| Script | `dashboard/scripts/z-crystal-dna-map-readonly.js` (fetch + layout + interaction only) |
| Styles | `dashboard/styles/z-crystal-dna-map.css` |

## Data sources (read-only GET)

| File | Use in map |
| --------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `data/z_crystal_dna_asset_manifest.json` | Primary **DNA shards**, `dependencies` edges, `allowed_actions` / `forbidden_actions` overlay |
| `data/z_satellite_control_link_manifest.json` | **Satellite** cluster nodes (`satellites[]`) |
| `data/z_doorway_workspace_registry.json` | **Doorway** cluster nodes (`entries[]`) |
| `dashboard/data/amk_project_indicators.json` | **Indicator** cluster: first **28** `indicators[]` rows (density cap) + posture metadata |

All paths are **relative** to the panel file (`../../data/...` and `../data/...`). Serve the hub dashboard over **HTTP** (for example Live Server) so `fetch` can load JSON; opening the HTML as `file://` may block fetches in strict browsers.

## Interactions (allowed)

- **Zoom** — wheel / buttons (transform scale on the SVG world group).
- **Pan** — drag background.
- **Hover** — highlight node and incident edges.
- **Inspect** — click node for read-only metadata in the inspector panel.
- **Filter / search** — substring match on id, label, cluster, status.

## Hard prohibitions

The panel and script **must not**:

- write files, call write APIs, or mutate registries
- deploy, bind DNS, or touch Wrangler
- run git or repair scripts
- read secrets, env, tokens, or vault paths
- mutate NAS or mount volumes
- auto-heal or “fix” shards from the visualization

## Visual language

- **Shard nodes** — typed glyphs by source (crystal / satellite / doorway / indicator).
- **Dependency threads** — animated dashed links for DNA `dependencies` only (other sources are cluster context).
- **Owner layers / clusters** — column bands and labels.
- **Recovery colours** — GREEN, YELLOW, BLUE, RED, **HOLD** (doorway-style), NAS_WAIT, QUARANTINE.
- **Crystal pulse** — subtle CSS animation on nodes; **respect `prefers-reduced-motion`**.

## Relation to Z-CRYSTAL-DNA-1

DNA-1 defines the **doctrine and manifest**. DNA-2 is a **lens** on that mesh plus adjacent read-only registries — still **no automatic reconstruction**.

## Law line

**Look, compare, and navigate — never repair or deploy from the map.**
