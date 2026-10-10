#!/usr/bin/env node
/**
 * GW-5: map foundation JSON from the approved-public-safe adapter only.
 * Does not read private overlay/registries. Does not fill Twin records[].
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ADAPTER = path.join(ROOT, "data/golden-website/public/gw_approved_public_safe_adapter.json");
const OUT_JSON = path.join(ROOT, "data/golden-website/public/gw_map_foundation.json");
const OUT_JS = path.join(ROOT, "docs/golden-website/shell/data/gw-map-foundation.js");

const adapter = JSON.parse(fs.readFileSync(ADAPTER, "utf8"));
if (!Array.isArray(adapter.records) || adapter.records.length !== 6) {
  throw new Error("Map foundation requires exactly six adapter records");
}

const EDGES = [
  {
    from: "z_sanctuary_core",
    to: "fourteen_drp_protocols",
    label: "governed_with",
    meaning: "Governance and responsibility framework. Relationship label is not runtime control.",
  },
  {
    from: "z_sanctuary_core",
    to: "cycle_observe",
    label: "observed_with",
    meaning: "Observation and review. Relationship label is not autonomous intervention.",
  },
  {
    from: "z_sanctuary_core",
    to: "z_eaii",
    label: "coordinated_with",
    meaning: "Oversight and orchestration inside the hierarchy. Relationship label is not super-intelligence.",
  },
  {
    from: "z_sanctuary_core",
    to: "grounded_questions_qadp",
    label: "inquiry_supported_by",
    meaning: "Grounded questions and directed pathways. QADP is not Golden Guide AI.",
  },
  {
    from: "z_sanctuary_core",
    to: "univ_workstation_navigator",
    label: "explored_through",
    meaning: "Read-only exploration. Relationship label is not Golden Universe Map completeness.",
  },
];

const LAYOUT = {
  z_sanctuary_core: { area: "core", slot: "center" },
  fourteen_drp_protocols: { area: "drp", slot: "nw" },
  cycle_observe: { area: "observe", slot: "ne" },
  z_eaii: { area: "eaii", slot: "w" },
  grounded_questions_qadp: { area: "qadp", slot: "e" },
  univ_workstation_navigator: { area: "nav", slot: "s" },
};

const nodes = adapter.records.map((r) => ({
  id: r.canonical_id,
  public_name: r.public_name,
  page: r.page,
  evidence_state: r.evidence_state,
  implementation_state: r.implementation_state || r.development_posture || null,
  public_evidence_gate: r.public_evidence_gate || null,
  prototype_class: r.prototype_class || null,
  purpose: r.approved_public_description,
  what_exists: r.what_exists || [],
  not_claimed: r.not_claimed || [],
  core_relationship: r.core_relationship || "",
  layout: LAYOUT[r.canonical_id],
}));

if (nodes.length !== 6) throw new Error("node count");
const ids = new Set(nodes.map((n) => n.id));
for (const e of EDGES) {
  if (!ids.has(e.from) || !ids.has(e.to)) throw new Error(`edge ${e.label} references unknown node`);
}
if (nodes.some((n) => n.evidence_state === "VERIFIED" && n.id === "z_sanctuary_core")) {
  throw new Error("Core must not be VERIFIED");
}

const map = {
  schema: "gw_map_foundation_v1",
  phase: "GW-5",
  sourced_from: "gw_approved_public_safe_adapter.json (not Twin, not private overlay)",
  publication_authorized: false,
  twin_live_records: 0,
  local_shell_only: true,
  site: {
    name: "Golden Universe Map",
    subtitle: "Interactive Z-Sanctuary Canvas",
  },
  scope_line: "Foundation Preview — six approved public-safe capabilities only.",
  incomplete_line: "This is not the complete Z-Sanctuary Universe.",
  laws: [
    "map ≠ authority",
    "relationship ≠ runtime control",
    "visual connection ≠ technical dependency",
    "public-safe ≠ published",
    "QUALIFIED ≠ VERIFIED",
  ],
  center: "z_sanctuary_core",
  node_count: 6,
  private_nodes_loaded: 0,
  unapproved_nodes_exposed: 0,
  nodes,
  edges: EDGES,
};

fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
fs.mkdirSync(path.dirname(OUT_JS), { recursive: true });
fs.writeFileSync(OUT_JSON, `${JSON.stringify(map, null, 2)}\n`, "utf8");
fs.writeFileSync(
  OUT_JS,
  `/* Generated from approved adapter. Do not edit claims by hand. */\nwindow.GW_MAP = ${JSON.stringify(map, null, 2)};\n`,
  "utf8",
);
process.stdout.write(JSON.stringify({ nodes: map.node_count, edges: map.edges.length }, null, 2));
