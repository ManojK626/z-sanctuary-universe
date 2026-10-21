#!/usr/bin/env node
/**
 * GW-8: approved public-safe knowledge corpus + surface routing.
 * Does not create an LLM runtime. Does not ingest overlay, HODP, ICIS, or Twin records[].
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const adapter = JSON.parse(
  fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw_approved_public_safe_adapter.json"), "utf8"),
);
const map = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw_map_foundation.json"), "utf8"));
const exhibits = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw7_exhibits.json"), "utf8"));

if (adapter.records.length !== 6) throw new Error("corpus requires six adapter records");
if (exhibits.visuals.length !== 6 || exhibits.prototypes.length !== 1) throw new Error("GW-7 exhibits required");

const ALLOWED_SUBJECTS = new Set([
  "z_sanctuary_core",
  "univ_workstation_navigator",
  "fourteen_drp_protocols",
  "cycle_observe",
  "z_eaii",
  "grounded_questions_qadp",
  "golden_website",
  "golden_guide_ai",
  "golden_universe_map",
  "golden_gallery",
  "golden_museum",
  "evidence_mode",
  "evidence_vocabulary",
  "turtle_mode",
  "commercial_status",
]);

const ALLOWED_TYPES = new Set([
  "FACT",
  "EVIDENCE",
  "CONCEPT",
  "LIMITATION",
  "IDENTITY",
  "VISUAL",
  "PROTOTYPE",
  "GOVERNANCE",
  "COMMERCIAL",
]);

const recById = Object.fromEntries(adapter.records.map((r) => [r.canonical_id, r]));

function k(partial) {
  if (!ALLOWED_SUBJECTS.has(partial.subject_id)) throw new Error(`unauthorized subject ${partial.subject_id}`);
  if (!ALLOWED_TYPES.has(partial.knowledge_type)) throw new Error(`bad type ${partial.knowledge_type}`);
  return {
    knowledge_id: partial.knowledge_id,
    subject_id: partial.subject_id,
    public_name: partial.public_name,
    knowledge_type: partial.knowledge_type,
    statement: partial.statement,
    evidence_state: partial.evidence_state,
    supported_by: partial.supported_by || [],
    limitations: partial.limitations || [],
    related_surfaces: partial.related_surfaces || [],
    public_safe: true,
  };
}

const knowledge = [
  k({
    knowledge_id: "K-SITE-IDENTITY",
    subject_id: "golden_website",
    public_name: "The Golden Website",
    knowledge_type: "IDENTITY",
    statement: "The public site identity is The Golden Website, subtitle Gateway to the Z-Sanctuary Universe. The umbrella is Z-Sanctuary Universe.",
    evidence_state: "QUALIFIED",
    supported_by: ["Approved public-safe adapter site identity"],
    limitations: ["Local shell only. Publication is not authorized. Working local UI is not a live service."],
    related_surfaces: ["index.html"],
  }),
  k({
    knowledge_id: "K-CORE-PURPOSE",
    subject_id: "z_sanctuary_core",
    public_name: recById.z_sanctuary_core.public_name,
    knowledge_type: "FACT",
    statement: recById.z_sanctuary_core.approved_public_description,
    evidence_state: recById.z_sanctuary_core.evidence_state,
    supported_by: recById.z_sanctuary_core.evidence_refs.map((e) => e.title),
    limitations: recById.z_sanctuary_core.not_claimed,
    related_surfaces: ["core.html", "portfolio.html", "index.html"],
  }),
  k({
    knowledge_id: "K-CORE-NOT-FINISHED",
    subject_id: "z_sanctuary_core",
    public_name: recById.z_sanctuary_core.public_name,
    knowledge_type: "LIMITATION",
    statement: "Z-Sanctuary is not a finished public production platform. Many broader capabilities remain under controlled development.",
    evidence_state: "QUALIFIED",
    supported_by: ["Approved Core public description"],
    limitations: ["A PASS evidence gate is not a VERIFIED badge and is not deploy authority."],
    related_surfaces: ["core.html"],
  }),
  k({
    knowledge_id: "K-QUALIFIED",
    subject_id: "evidence_vocabulary",
    public_name: "QUALIFIED",
    knowledge_type: "EVIDENCE",
    statement: "QUALIFIED means present and supported internally. It is not proven, not production-ready, and not commercially validated.",
    evidence_state: "QUALIFIED",
    supported_by: ["Approved evidence vocabulary"],
    limitations: ["QUALIFIED must not be rewritten as VERIFIED."],
    related_surfaces: ["index.html"],
  }),
  k({
    knowledge_id: "K-SEALED",
    subject_id: "evidence_vocabulary",
    public_name: "SEALED",
    knowledge_type: "EVIDENCE",
    statement: "SEALED means a named sanctuary slice receipt exists. Sealed is not deployed.",
    evidence_state: "SEALED",
    supported_by: ["Approved evidence vocabulary"],
    limitations: ["SEALED must not be described as a public launch."],
    related_surfaces: ["navigator.html"],
  }),
  k({
    knowledge_id: "K-EVIDENCE-MODE",
    subject_id: "evidence_mode",
    public_name: "Evidence Mode",
    knowledge_type: "FACT",
    statement: "Evidence Mode (Show Me What's Real) emphasizes evidence states over decorative presentation. It does not hide a record because it is not VERIFIED.",
    evidence_state: "QUALIFIED",
    supported_by: ["Local Golden Website Evidence Mode"],
    limitations: ["Evidence Mode is a local viewing aid, not independent verification."],
    related_surfaces: ["index.html", "gallery.html"],
  }),
  k({
    knowledge_id: "K-DRP",
    subject_id: "fourteen_drp_protocols",
    public_name: recById.fourteen_drp_protocols.public_name,
    knowledge_type: "GOVERNANCE",
    statement: recById.fourteen_drp_protocols.approved_public_description,
    evidence_state: recById.fourteen_drp_protocols.evidence_state,
    supported_by: recById.fourteen_drp_protocols.evidence_refs.map((e) => e.title),
    limitations: recById.fourteen_drp_protocols.not_claimed,
    related_surfaces: ["drp.html", "portfolio.html"],
  }),
  k({
    knowledge_id: "K-HUMAN-DECIDES",
    subject_id: "fourteen_drp_protocols",
    public_name: "Human authority",
    knowledge_type: "GOVERNANCE",
    statement: "Humans remain authoritative. Observe, verify, suggest, then a human decides. Readiness is not deploy.",
    evidence_state: "QUALIFIED",
    supported_by: ["Approved Core governance summary", "14 DRP public-safe description"],
    limitations: ["Not evidence that every helper automatically behaves perfectly."],
    related_surfaces: ["drp.html", "core.html"],
  }),
  k({
    knowledge_id: "K-NO-AUTO-DEPLOY",
    subject_id: "fourteen_drp_protocols",
    public_name: "No autonomous deploy",
    knowledge_type: "GOVERNANCE",
    statement: "Hidden runtime and automatic deploy or merge are forbidden. Golden Guide AI, when later authorized, must not execute actions.",
    evidence_state: "QUALIFIED",
    supported_by: ["14 DRP public-safe description"],
    limitations: ["Doctrine is not a live public enforcement API."],
    related_surfaces: ["drp.html"],
  }),
  k({
    knowledge_id: "K-TURTLE",
    subject_id: "turtle_mode",
    public_name: "Turtle Mode",
    knowledge_type: "GOVERNANCE",
    statement: "Turtle Mode treats builders as guarded workers, not autopilot: small branches, human review, no auto-merge or auto-deploy from this knowledge layer.",
    evidence_state: "QUALIFIED",
    supported_by: ["Approved Core governance summary"],
    limitations: ["Turtle Mode is an operating discipline, not a public product SKU."],
    related_surfaces: ["core.html"],
  }),
  k({
    knowledge_id: "K-EAII",
    subject_id: "z_eaii",
    public_name: recById.z_eaii.public_name,
    knowledge_type: "FACT",
    statement: recById.z_eaii.approved_public_description,
    evidence_state: recById.z_eaii.evidence_state,
    supported_by: recById.z_eaii.evidence_refs.map((e) => e.title),
    limitations: recById.z_eaii.not_claimed,
    related_surfaces: ["eaii.html", "portfolio.html"],
  }),
  k({
    knowledge_id: "K-QADP",
    subject_id: "grounded_questions_qadp",
    public_name: recById.grounded_questions_qadp.public_name,
    knowledge_type: "FACT",
    statement: recById.grounded_questions_qadp.approved_public_description,
    evidence_state: recById.grounded_questions_qadp.evidence_state,
    supported_by: recById.grounded_questions_qadp.evidence_refs.map((e) => e.title),
    limitations: recById.grounded_questions_qadp.not_claimed,
    related_surfaces: ["qadp.html", "portfolio.html"],
  }),
  k({
    knowledge_id: "K-OBSERVE",
    subject_id: "cycle_observe",
    public_name: recById.cycle_observe.public_name,
    knowledge_type: "FACT",
    statement: recById.cycle_observe.approved_public_description,
    evidence_state: recById.cycle_observe.evidence_state,
    supported_by: recById.cycle_observe.evidence_refs.map((e) => e.title),
    limitations: recById.cycle_observe.not_claimed,
    related_surfaces: ["observe.html", "portfolio.html"],
  }),
  k({
    knowledge_id: "K-NAVIGATOR",
    subject_id: "univ_workstation_navigator",
    public_name: recById.univ_workstation_navigator.public_name,
    knowledge_type: "FACT",
    statement: recById.univ_workstation_navigator.approved_public_description,
    evidence_state: recById.univ_workstation_navigator.evidence_state,
    supported_by: recById.univ_workstation_navigator.evidence_refs.map((e) => e.title),
    limitations: recById.univ_workstation_navigator.not_claimed,
    related_surfaces: ["navigator.html", "universe-map.html"],
  }),
  k({
    knowledge_id: "K-MAP-FOUNDATION",
    subject_id: "golden_universe_map",
    public_name: map.site.name,
    knowledge_type: "FACT",
    statement: `${map.scope_line} ${map.incomplete_line} Map is not authority. Relationship labels are not runtime control.`,
    evidence_state: "QUALIFIED",
    supported_by: ["GW-5 six-node map foundation"],
    limitations: ["Not the complete Universe. Not a 160-node canvas. Not live infrastructure."],
    related_surfaces: ["universe-map.html"],
  }),
  k({
    knowledge_id: "K-GALLERY",
    subject_id: "golden_gallery",
    public_name: "Golden Visual Gallery",
    knowledge_type: "VISUAL",
    statement: "The local Gallery shows six Steward-approved development captures: five current REAL UI CAPTURE exhibits and one HISTORICAL REAL UI CAPTURE.",
    evidence_state: "QUALIFIED",
    supported_by: ["GW-7 approved exhibit contract"],
    limitations: ["A visual is not evidence by itself. A screenshot is not backend proof. Historical is not current."],
    related_surfaces: ["gallery.html"],
  }),
  k({
    knowledge_id: "K-HISTORICAL-VISUAL",
    subject_id: "golden_gallery",
    public_name: "Historical REAL UI CAPTURE",
    knowledge_type: "VISUAL",
    statement: "The GW-3A Evidence Mode board is a HISTORICAL REAL UI CAPTURE of the earlier two-record Foundation Shell. It does not represent the current six-record portfolio.",
    evidence_state: "QUALIFIED",
    supported_by: ["GW-7 historical exhibit copy"],
    limitations: ["Must not be presented as the current site state."],
    related_surfaces: ["gallery.html"],
  }),
  k({
    knowledge_id: "K-MUSEUM",
    subject_id: "golden_museum",
    public_name: "Prototype Museum",
    knowledge_type: "PROTOTYPE",
    statement: "The local Museum currently contains one exhibit: the Golden Website local shell, classified LOCAL WORKING PROTOTYPE. It is not a public service, not production, not deployed, and not publication-authorized.",
    evidence_state: "QUALIFIED",
    supported_by: ["GW-7 approved museum exhibit"],
    limitations: ["Prototype ≠ production. Local ≠ deployed. Additional prototypes remain behind gates."],
    related_surfaces: ["museum.html", "index.html"],
  }),
  k({
    knowledge_id: "K-GUIDE-IDENTITY",
    subject_id: "golden_guide_ai",
    public_name: "Golden Guide AI",
    knowledge_type: "IDENTITY",
    statement: "Golden Guide AI is the future public evidence navigator and public-safe question/answer guide. The UI CTA is Ask Z-Sanctuary. Runtime is not authorized in GW-8.",
    evidence_state: "CONCEPT",
    supported_by: ["GW-1 naming policy", "GW-8 knowledge contract"],
    limitations: ["Not Zuno. Not AMK Personal AI. Not an execution authority. Not a source of truth. AI answer ≠ evidence."],
    related_surfaces: ["index.html"],
  }),
  k({
    knowledge_id: "K-GUIDE-NOT-ZUNO",
    subject_id: "golden_guide_ai",
    public_name: "Golden Guide AI is not Zuno",
    knowledge_type: "IDENTITY",
    statement: "Zuno is an internal sanctuary observer identity. It must not be named as the public chatbot. Golden Guide AI is a separate future public-safe guide.",
    evidence_state: "CONCEPT",
    supported_by: ["GW-1 identity claims", "QADP public-safe not-claimed list"],
    limitations: ["This statement does not describe private Zuno memory or operator surfaces."],
    related_surfaces: ["qadp.html"],
  }),
  k({
    knowledge_id: "K-COMMERCIAL",
    subject_id: "commercial_status",
    public_name: "Commercial status",
    knowledge_type: "COMMERCIAL",
    statement: "Current public-safe commercial posture is POTENTIAL_NOT_VALIDATED. Potential is not revenue.",
    evidence_state: "CONCEPT",
    supported_by: ["GW-1 claim policy commercial ladder"],
    limitations: [
      "Do not state current revenue, customers, market share, valuation, ROI, or commercial readiness.",
      "Investment questions may be routed for Steward review; they are not a public offer.",
    ],
    related_surfaces: ["index.html"],
  }),
  k({
    knowledge_id: "K-UNKNOWN",
    subject_id: "golden_guide_ai",
    public_name: "Unknown is valid",
    knowledge_type: "LIMITATION",
    statement: "If a question cannot be grounded in this approved corpus, the valid result is UNKNOWN / NEEDS_REVIEW. The Guide must not hallucinate.",
    evidence_state: "CONCEPT",
    supported_by: ["GW-8 unknown-question law"],
    limitations: ["A future review queue is not implemented in GW-8."],
    related_surfaces: ["index.html"],
  }),
];

for (const row of knowledge) {
  const blob = JSON.stringify(row);
  if (/[A-Za-z]:\\/.test(blob) || /127\.0\.0\.1/.test(blob) || /dashboard\/Html/.test(blob)) {
    throw new Error(`private path in ${row.knowledge_id}`);
  }
}

const corpus = {
  schema: "gw8_approved_knowledge_corpus_v1",
  phase: "GW-8",
  runtime_status: "CLOSED",
  publication_authorized: false,
  twin_live_records: 0,
  private_data_included: 0,
  unauthorized_subjects_included: 0,
  sourced_from: [
    "gw_approved_public_safe_adapter.json",
    "gw_map_foundation.json",
    "gw7_exhibits.json",
    "GW-1 claim policy (public-safe commercial/identity laws)",
  ],
  note: "Approved public-safe knowledge only. Not an LLM. Not Twin records[]. Not a chat runtime.",
  knowledge,
};

const routing = {
  schema: "gw8_surface_routing_v1",
  phase: "GW-8",
  runtime_status: "CLOSED",
  note: "Local Golden Website surfaces only. Intent changes presentation, not factual truth.",
  subjects: [
    { subject_id: "z_sanctuary_core", routes: ["core.html", "index.html", "portfolio.html"] },
    { subject_id: "fourteen_drp_protocols", routes: ["drp.html", "portfolio.html"] },
    { subject_id: "z_eaii", routes: ["eaii.html", "portfolio.html"] },
    { subject_id: "grounded_questions_qadp", routes: ["qadp.html", "portfolio.html"] },
    { subject_id: "cycle_observe", routes: ["observe.html", "portfolio.html"] },
    { subject_id: "univ_workstation_navigator", routes: ["navigator.html", "universe-map.html"] },
    { subject_id: "golden_universe_map", routes: ["universe-map.html", "gallery.html"] },
    { subject_id: "golden_gallery", routes: ["gallery.html"] },
    { subject_id: "golden_museum", routes: ["museum.html", "index.html"] },
    { subject_id: "evidence_mode", routes: ["index.html", "gallery.html"] },
    { subject_id: "golden_guide_ai", routes: ["index.html"] },
    { subject_id: "commercial_status", routes: ["index.html"] },
  ],
  intents: {
    visual_question: ["gallery.html"],
    prototype_question: ["museum.html"],
    relationship_question: ["universe-map.html", "portfolio.html"],
    evidence_question: ["index.html", "core.html"],
  },
};

fs.writeFileSync(path.join(ROOT, "data/golden-website/public/gw8_approved_knowledge_corpus.json"), `${JSON.stringify(corpus, null, 2)}\n`);
fs.writeFileSync(path.join(ROOT, "data/golden-website/public/gw8_surface_routing.json"), `${JSON.stringify(routing, null, 2)}\n`);
process.stdout.write(JSON.stringify({ knowledge: knowledge.length, subjects: routing.subjects.length, runtime: corpus.runtime_status }, null, 2));
