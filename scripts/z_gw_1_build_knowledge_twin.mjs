#!/usr/bin/env node
/**
 * GW-1 one-shot builder. Deny-by-default Public Knowledge Twin.
 * Does not publish records. Does not promote temporary IDs. Not an npm verify gate.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OVERLAY = path.join(ROOT, "data", "golden-website", "gw_portfolio_registry.json");
const TWIN = path.join(ROOT, "data", "golden-website", "public", "gw_public_knowledge_twin.json");
const CANDIDATES = path.join(ROOT, "data", "golden-website", "gw_publication_candidates.json");
const QUEUE = path.join(ROOT, "data", "golden-website", "gw_identity_promotion_queue.json");

const STEWARD = {
  public_umbrella: "Z-Sanctuary Universe",
  public_website: "The Golden Website",
  public_website_subtitle: "Gateway to the Z-Sanctuary Universe",
  public_qa: "Golden Guide AI",
  public_qa_cta: "Ask Z-Sanctuary",
  public_map: "Golden Universe Map",
  public_map_subtitle: "Interactive Z-Sanctuary Canvas",
  universe_2: "INTERNAL_LEGACY_ALIAS",
  zuno_public_chatbot: false,
};

const FORBIDDEN_CLAIMS = [
  "proven",
  "production-ready",
  "commercially validated",
  "revenue-generating",
  "deployed",
  "live public product",
  "backend production capability implied from HTML",
  "Zuno is the public chatbot",
  "Universe 2 is a competing public brand",
];

function identitySplit(record) {
  const overlayId = record.canonical_id;
  const temporary = record.id_status === "TEMPORARY_PENDING_CANONICAL_REVIEW";
  return {
    canonical_id: temporary ? null : overlayId,
    temporary_id: temporary ? overlayId : null,
    overlay_inventory_id: overlayId,
    id_status: record.id_status,
  };
}

function recommendation(record) {
  const exp = record.public_exposure_class;
  const ev = record.evidence_state;
  if (exp === "DO_NOT_PUBLISH" || ev === "CLOSED") return "DO_NOT_PUBLISH";
  if (record.id_status === "TEMPORARY_PENDING_CANONICAL_REVIEW") return "NEEDS_IDENTITY_REVIEW";
  if (exp === "QUALIFIED_DATA_ROOM") return "DATA_ROOM_ONLY";
  if (exp === "PUBLIC_SAFE") return "CANDIDATE_PUBLIC_SAFE";
  if (exp === "PUBLIC_AFTER_SANITIZATION" && ev === "CONCEPT") return "NEEDS_EVIDENCE";
  if (exp === "PUBLIC_AFTER_SANITIZATION") return "CANDIDATE_AFTER_SANITIZATION";
  if (ev === "CONCEPT") return "NEEDS_EVIDENCE";
  if (ev === "HOLD") return "KEEP_PRIVATE";
  return "KEEP_PRIVATE";
}

function proposedPublicName(record, rec) {
  if (record.canonical_id === "ZS-PROJECT-000") return STEWARD.public_website;
  if (record.canonical_id === "ZS-AI-004") return null;
  if (record.canonical_id === "univ_workstation_navigator") return null;
  if (record.name === "Z_Sanctuary_Universe 2" || record.canonical_id?.includes("universe-2")) {
    return null;
  }
  if (rec === "DO_NOT_PUBLISH" || rec === "KEEP_PRIVATE" || rec === "DATA_ROOM_ONLY") return null;
  if (rec === "NEEDS_IDENTITY_REVIEW") return null;
  return record.name;
}

function proposedSlug(record) {
  if (record.canonical_id === "ZS-PROJECT-000") return "the-golden-website";
  return null;
}

function publicSummary(record, rec) {
  if (rec === "DO_NOT_PUBLISH") {
    return "Withheld. Not a public Golden Website record.";
  }
  if (record.canonical_id === "ZS-PROJECT-000") {
    return "Proposed public site identity: The Golden Website, gateway to the Z-Sanctuary Universe. Not published in GW-1.";
  }
  if (record.canonical_id === "ZS-AI-004") {
    return "Zuno remains a Sanctuary/personal guide identity. Public Q&A identity is Golden Guide AI.";
  }
  if (record.canonical_id === "ZS-AI-001" || record.canonical_id === "ZS-AI-009") {
    return "Internal Q&A/intelligence surface. May later inform Golden Guide AI after sanitization. Not the public chatbot itself.";
  }
  return "Internal overlay record. No public claim in GW-1. Recommendation is not publication.";
}

function claimsAllowed(rec) {
  if (rec === "CANDIDATE_PUBLIC_SAFE") return ["May be described after human publication approval."];
  return [];
}

function blockers(record, rec) {
  const out = ["DENY_BY_DEFAULT: no automatic publication"];
  if (record.id_status === "TEMPORARY_PENDING_CANONICAL_REVIEW") {
    out.push("Temporary ID must not be mass-promoted");
  }
  if (record.commercial_status === "POTENTIAL_NOT_VALIDATED") {
    out.push("No revenue or market-validation claim");
  }
  if (record.prototype_class === "WORKING") {
    out.push("WORKING HTML is not backend production proof");
  }
  if (record.evidence_state === "SEALED") {
    out.push("SEALED is not deployed");
  }
  if (record.evidence_state === "QUALIFIED") {
    out.push("QUALIFIED must not be translated to proven or production-ready");
  }
  if (record.evidence_state === "CONCEPT") {
    out.push("CONCEPT must remain visibly concept if ever published");
  }
  if (record.canonical_id === "ZS-AI-004") {
    out.push("Must not be presented as the public chatbot");
  }
  if (String(record.name).includes("Universe 2") || String(record.canonical_id).includes("universe-2")) {
    out.push("Universe 2 is an internal/legacy alias, not a competing public brand");
  }
  if (rec === "DO_NOT_PUBLISH") out.push("Hard withhold");
  return out;
}

function sanitizationRequired(record, rec) {
  if (rec === "DO_NOT_PUBLISH") return true;
  if (rec === "CANDIDATE_PUBLIC_SAFE") return false;
  return true;
}

function reuseHints(record) {
  const id = record.canonical_id;
  const name = String(record.name || "");
  if (id === "ZS-AI-001" || id === "ZS-AI-009" || id === "eaii-knowledge-ask" || id === "z-qa-rp") {
    return ["golden-guide-ai"];
  }
  if (id === "univ_workstation_navigator" || id === "zmv_ecosphere_map_readonly" || id === "magical_canvas_playkit" || id === "ZS-PROTOTYPE-003") {
    return ["golden-universe-map"];
  }
  if (id === "ZS-EVIDENCE-003" || name.toLowerCase().includes("commercial")) {
    return ["business-mode"];
  }
  if (record.type === "EVIDENCE" || record.type === "PROTOTYPE") {
    return record.type === "PROTOTYPE" ? ["prototype-museum"] : ["evidence-atlas"];
  }
  if (record.type === "VISUAL") return ["visual-gallery"];
  return [];
}

function candidate(record) {
  const ids = identitySplit(record);
  const rec = recommendation(record);
  const refs = (arr) => (Array.isArray(arr) ? arr.filter((p) => typeof p === "string" && !/127\.0\.0\.1|localhost/i.test(p)) : []);
  return {
    canonical_id: ids.canonical_id,
    temporary_id: ids.temporary_id,
    overlay_inventory_id: ids.overlay_inventory_id,
    id_status: ids.id_status,
    canonical_name: record.name,
    proposed_public_name: proposedPublicName(record, rec),
    proposed_public_slug: proposedSlug(record),
    type: record.type,
    evidence_state: record.evidence_state,
    implementation_state: record.implementation_state,
    proposed_public_summary: publicSummary(record, rec),
    public_claims_allowed: claimsAllowed(rec),
    public_claims_forbidden: FORBIDDEN_CLAIMS,
    evidence_refs: refs(record.receipts_tests),
    prototype_refs: refs(record.html_prototypes),
    visual_refs: refs(record.visual_mockups),
    commercial_status: record.commercial_status || "POTENTIAL_NOT_VALIDATED",
    economic_roles: record.economic_role || [],
    ethical_public_benefit_role: record.ethical_public_benefit_role || "",
    dependency_refs: [],
    sanitization_required: sanitizationRequired(record, rec),
    human_review_required: true,
    proposed_exposure_class: record.public_exposure_class,
    future_surfaces: reuseHints(record),
    blockers: blockers(record, rec),
    recommendation: rec,
    published: false,
  };
}

function withheld(record, rec) {
  const ids = identitySplit(record);
  return {
    canonical_id: ids.canonical_id,
    temporary_id: ids.temporary_id,
    overlay_inventory_id: ids.overlay_inventory_id,
    id_status: ids.id_status,
    type: record.type,
    withhold_class: "DENY_BY_DEFAULT",
    withhold_reason_code: rec,
    proposed_exposure_class: record.public_exposure_class,
  };
}

function promotionAssessment(record) {
  const ids = identitySplit(record);
  const rec = recommendation(record);
  const sot = Array.isArray(record.source_of_truth) && record.source_of_truth.length > 0;
  const stableParent = Boolean(record.parent_organism_project);
  const stableType = Boolean(record.type);
  const unique = Boolean(ids.temporary_id);
  const collisionRisk =
    record.canonical_id === "ZS-FORMULA-003" ||
    record.canonical_id === "ZS-AI-001" ||
    record.canonical_id === "ZS-AI-009" ||
    record.canonical_id === "ZS-AI-004" ||
    String(record.name).includes("Universe 2");
  return {
    canonical_id: null,
    temporary_id: ids.temporary_id,
    public_slug: proposedSlug(record),
    overlay_name: record.name,
    type: record.type,
    parent_organism_project: record.parent_organism_project,
    unique_identity: unique && !collisionRisk,
    duplicate_or_alias_collision: collisionRisk,
    stable_parent: stableParent,
    stable_type: stableType,
    source_of_truth_present: sot,
    source_of_truth_count: sot ? record.source_of_truth.length : 0,
    promotion_criteria_met: unique && sot && stableParent && stableType && !collisionRisk,
    recommendation: rec === "DO_NOT_PUBLISH" ? "DO_NOT_PROMOTE_HARD_WITHHOLD" : "DO_NOT_PROMOTE_THIS_PHASE",
    notes: [
      "Promotion requires unique identity + resolved aliases + stable parent + stable type + source-of-truth + no collision.",
      "GW-1 does not promote temporary IDs because they survived inventory.",
    ],
  };
}

const overlay = JSON.parse(fs.readFileSync(OVERLAY, "utf8"));
const records = overlay.records || [];
const candidates = records.map(candidate);
const recCounts = {};
for (const c of candidates) {
  recCounts[c.recommendation] = (recCounts[c.recommendation] || 0) + 1;
}

const withheldRecords = records.map((r) => withheld(r, recommendation(r)));
const tmpRecords = records.filter((r) => r.id_status === "TEMPORARY_PENDING_CANONICAL_REVIEW");
const queueItems = tmpRecords.map(promotionAssessment);

const twin = {
  schema_version: "1.0",
  phase: "GW-1",
  generated_from: "data/golden-website/gw_portfolio_registry.json",
  generated_at: new Date().toISOString(),
  publication_policy: "DENY_BY_DEFAULT",
  posture: "public_derivative_not_sanctuary_truth",
  steward_identity: STEWARD,
  doctrine: [
    "private unless approved",
    "public representation ≠ private authority",
    "prototype ≠ production",
    "potential ≠ revenue",
    "visual ≠ implementation",
    "AI answer ≠ evidence",
    "federation ≠ authority",
    "readiness ≠ deploy",
  ],
  identity_model: {
    canonical_id: "stable boring identifier; do not change for branding",
    public_display_name: "may evolve",
    public_slug: "may evolve; independent of canonical_id",
    temporary_id: "ZS-*-### until promotion criteria met; canonical_id remains null",
  },
  records: [],
  withheld_records: withheldRecords,
  statistics: {
    overlay_source_records: records.length,
    public_records: 0,
    withheld_records: withheldRecords.length,
    recommendations: recCounts,
    temporary_ids_in_overlay: tmpRecords.length,
    candidate_public_safe: recCounts.CANDIDATE_PUBLIC_SAFE || 0,
    candidate_after_sanitization: recCounts.CANDIDATE_AFTER_SANITIZATION || 0,
    data_room_only: recCounts.DATA_ROOM_ONLY || 0,
    keep_private: recCounts.KEEP_PRIVATE || 0,
    do_not_publish: recCounts.DO_NOT_PUBLISH || 0,
    needs_evidence: recCounts.NEEDS_EVIDENCE || 0,
    needs_identity_review: recCounts.NEEDS_IDENTITY_REVIEW || 0,
  },
};

const candidatesDoc = {
  schema: "gw_publication_candidates_v1",
  phase: "GW-1",
  generated_from: "data/golden-website/gw_portfolio_registry.json",
  generated_at: twin.generated_at,
  publication_policy: "DENY_BY_DEFAULT",
  note: "Recommendation does not publish the record. All human_review_required=true. published=false.",
  steward_identity: STEWARD,
  allowed_recommendations: [
    "CANDIDATE_PUBLIC_SAFE",
    "CANDIDATE_AFTER_SANITIZATION",
    "DATA_ROOM_ONLY",
    "KEEP_PRIVATE",
    "DO_NOT_PUBLISH",
    "NEEDS_EVIDENCE",
    "NEEDS_IDENTITY_REVIEW",
  ],
  statistics: recCounts,
  candidates,
};

const queueDoc = {
  schema: "gw_identity_promotion_queue_v1",
  phase: "GW-1",
  generated_from: "data/golden-website/gw_portfolio_registry.json",
  generated_at: twin.generated_at,
  policy: "DO_NOT_MASS_PROMOTE",
  promotion_this_phase: 0,
  criteria: [
    "unique identity",
    "resolved aliases / no collision",
    "stable parent",
    "stable type",
    "source-of-truth pointer",
  ],
  note: "Temporary IDs stay TEMPORARY_PENDING_CANONICAL_REVIEW through GW-1. Overlay still stores them in canonical_id for inventory history; GW-1 maps those to temporary_id with canonical_id null.",
  items: queueItems,
  statistics: {
    temporary_ids_assessed: queueItems.length,
    criteria_fully_met_but_not_promoted: queueItems.filter((i) => i.promotion_criteria_met).length,
    collision_flagged: queueItems.filter((i) => i.duplicate_or_alias_collision).length,
    promoted: 0,
  },
};

fs.mkdirSync(path.dirname(TWIN), { recursive: true });
fs.writeFileSync(TWIN, `${JSON.stringify(twin, null, 2)}\n`, "utf8");
fs.writeFileSync(CANDIDATES, `${JSON.stringify(candidatesDoc, null, 2)}\n`, "utf8");
fs.writeFileSync(QUEUE, `${JSON.stringify(queueDoc, null, 2)}\n`, "utf8");

process.stdout.write(
  JSON.stringify(
    {
      public_records: twin.records.length,
      withheld: twin.withheld_records.length,
      candidates: candidates.length,
      recommendations: recCounts,
      temporary_assessed: queueItems.length,
      criteria_met_not_promoted: queueDoc.statistics.criteria_fully_met_but_not_promoted,
    },
    null,
    2,
  ),
);
