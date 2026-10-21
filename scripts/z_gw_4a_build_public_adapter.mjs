#!/usr/bin/env node
/**
 * GW-4A: build public-safe UI adapter from six approved capsules only.
 * Does not fill Twin records[]. Does not copy internal paths.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT_JSON = path.join(ROOT, "data", "golden-website", "public", "gw_approved_public_safe_adapter.json");
const OUT_JS = path.join(ROOT, "docs", "golden-website", "shell", "data", "gw-approved-public-safe.js");

const APPROVED_CORE_DESCRIPTION =
  "Z-Sanctuary is a governed multi-project AI development ecosystem with implemented and verified components, while many broader capabilities remain under controlled development.";

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function publicSafeText(s) {
  return String(s || "")
    .replace(/https?:\/\/127\.[^\s]+/gi, "")
    .replace(/https?:\/\/localhost[^\s]*/gi, "")
    .replace(/[A-Za-z]:\\[^\s]+/g, "")
    .replace(/dashboard\/Html\/[^\s]+/gi, "")
    .trim();
}

function stripInternalLimitations(lines) {
  return (lines || [])
    .map(publicSafeText)
    .filter((line) => line && !/smoke test/i.test(line));
}

function fromCapsule(cap, extra) {
  return {
    canonical_id: cap.canonical_id,
    public_name: cap.public_name,
    page: cap.page,
    ia_group: cap.ia_group || extra.ia_group,
    approved_public_description: publicSafeText(extra.approved_public_description || cap.simple_purpose),
    evidence_state: cap.evidence_state,
    public_evidence_gate: cap.public_evidence_gate || "PASS",
    prototype_class: extra.prototype_class || null,
    public_production: false,
    classification: "APPROVED_PUBLIC_SAFE",
    publication: "NOT_YET_AUTHORIZED",
    implementation_state: cap.implementation_state || extra.implementation_state || null,
    what_exists: stripInternalLimitations(cap.demonstrably_working),
    not_claimed: stripInternalLimitations(cap.non_public_or_unproven),
    evidence_refs: (cap.public_safe_evidence_references || []).map((r) => ({
      title: publicSafeText(r.title),
      supports: publicSafeText(r.supports),
      does_not_support: publicSafeText(r.does_not_support),
    })),
    development_posture: publicSafeText(cap.implementation_state_public_wording),
    core_relationship: publicSafeText(cap.core_relationship || extra.core_relationship || ""),
    next_evidence_gate: publicSafeText(cap.next_evidence_gate || extra.next_evidence_gate || ""),
    ...extra.flags,
  };
}

const core = readJson(path.join(ROOT, "data/golden-website/capsules/gw_capsule_z_sanctuary_core.json"));
const nav = readJson(path.join(ROOT, "data/golden-website/capsules/gw_capsule_univ_workstation_navigator.json"));
const drp = readJson(path.join(ROOT, "data/golden-website/capsules/gw4/gw_capsule_fourteen_drp_protocols.json"));
const eaii = readJson(path.join(ROOT, "data/golden-website/capsules/gw4/gw_capsule_z_eaii.json"));
const qadp = readJson(path.join(ROOT, "data/golden-website/capsules/gw4/gw_capsule_grounded_questions_qadp.json"));
const observe = readJson(path.join(ROOT, "data/golden-website/capsules/gw4/gw_capsule_cycle_observe.json"));

const records = [
  fromCapsule(core, {
    ia_group: "Foundation",
    approved_public_description: APPROVED_CORE_DESCRIPTION,
    core_relationship: "Named heart of this local preview.",
    next_evidence_gate: "Remain QUALIFIED. Publication and Twin insert remain unauthorized.",
    flags: {
      page: "core.html",
      journey: "What is Z-Sanctuary?",
      governance_summary:
        "Human-gated and evidence-first: observe, verify, suggest, then a human decides. Readiness is not deploy. Turtle Mode treats builders as guarded workers, not autopilot.",
    },
  }),
  fromCapsule(nav, {
    ia_group: "Foundation",
    prototype_class: "WORKING",
    core_relationship: "Navigation used with Z-Sanctuary Core.",
    next_evidence_gate: "SEALED is not deployed. Publication and Twin insert remain unauthorized.",
    flags: {
      page: "navigator.html",
      journey: "How do I explore it?",
      not_golden_universe_map: true,
      no_execution_authority: true,
    },
  }),
  fromCapsule(drp, {}),
  fromCapsule(eaii, {}),
  fromCapsule(qadp, {}),
  fromCapsule(observe, {}),
];

const adapter = {
  schema: "gw_approved_public_safe_adapter_v1",
  phase: "GW-4A",
  sourced_from: "approved public-safe capsules (not Twin records, not private registries)",
  publication_authorized: false,
  twin_live_records: 0,
  local_shell_only: true,
  site: {
    name: "The Golden Website",
    subtitle: "Gateway to the Z-Sanctuary Universe",
    ecosystem: "Z-Sanctuary Universe",
    opening_line: "A governed multi-project AI development ecosystem.",
  },
  portfolio_disclaimer:
    "This preview contains only capabilities that have passed the current Golden Website public-safety review. Additional parts of the Universe remain behind evidence gates.",
  evidence_vocabulary: [
    { id: "VERIFIED", meaning: "Public-facing independent verification of a Golden Website claim." },
    { id: "SEALED", meaning: "A named sanctuary slice receipt exists. Sealed is not deployed." },
    { id: "QUALIFIED", meaning: "Present and supported internally. Not proven, not production-ready, not commercially validated." },
    { id: "CONCEPT", meaning: "Vision or planned work. Must stay visibly concept." },
    { id: "HOLD", meaning: "Held. Not offered as a public capability." },
    { id: "CLOSED", meaning: "Closed. Not an active public capability." },
  ],
  evidence_vocabulary_note:
    "Evidence classification describes current support for a capability. It is not a quality badge, commercial rating, or deployment status.",
  locked_surfaces: [
    { id: "golden-universe-map", name: "Full Golden Universe Map" },
    { id: "golden-guide-ai", name: "Golden Guide AI — production runtime" },
    { id: "portfolio-atlas", name: "Portfolio Atlas" },
    { id: "evidence-atlas", name: "Evidence Atlas" },
    { id: "human-planet-impact", name: "Human & Planet Impact" },
    { id: "business-industry", name: "Business & Industry" },
    { id: "partners-investors", name: "Partners & Investors — live offering / data room" },
  ],
  locked_label: "Coming through evidence gates",
  portfolio_groups: [
    { id: "govern-verify", name: "Govern & Verify", record_ids: ["fourteen_drp_protocols", "cycle_observe"] },
    { id: "build-orchestrate", name: "Build & Orchestrate", record_ids: ["z_eaii"] },
    { id: "understand-guide", name: "Understand & Guide", record_ids: ["grounded_questions_qadp"] },
    { id: "foundation", name: "Foundation", record_ids: ["z_sanctuary_core", "univ_workstation_navigator"] },
  ],
  relationships: {
    note: "Lightweight local indicators. Not Golden Universe Map. No graph runtime.",
    from: "z_sanctuary_core",
    from_name: "Z-Sanctuary Core",
    edges: [
      { role: "governance", to: "fourteen_drp_protocols" },
      { role: "oversight/orchestration", to: "z_eaii" },
      { role: "grounded inquiry", to: "grounded_questions_qadp" },
      { role: "observation", to: "cycle_observe" },
      { role: "navigation", to: "univ_workstation_navigator" },
    ],
  },
  records,
};

if (adapter.records.length !== 6) {
  throw new Error("GW-4A adapter must contain exactly six approved records.");
}
const ids = adapter.records.map((r) => r.canonical_id).sort().join(",");
if (ids !== ["cycle_observe", "fourteen_drp_protocols", "grounded_questions_qadp", "univ_workstation_navigator", "z_eaii", "z_sanctuary_core"].sort().join(",")) {
  throw new Error("GW-4A adapter IDs mismatch");
}
for (const r of adapter.records) {
  if (r.publication !== "NOT_YET_AUTHORIZED") throw new Error(`${r.canonical_id} publication`);
  if (r.evidence_state === "VERIFIED") throw new Error(`${r.canonical_id} must not be VERIFIED`);
}

fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
fs.mkdirSync(path.dirname(OUT_JS), { recursive: true });
fs.writeFileSync(OUT_JSON, `${JSON.stringify(adapter, null, 2)}\n`, "utf8");
fs.writeFileSync(
  OUT_JS,
  `/* Generated from approved capsules. Do not edit claims by hand. */\nwindow.GW_APPROVED = ${JSON.stringify(adapter, null, 2)};\n`,
  "utf8",
);
process.stdout.write(JSON.stringify({ records: adapter.records.length, json: path.relative(ROOT, OUT_JSON).split(path.sep).join("/") }, null, 2));
