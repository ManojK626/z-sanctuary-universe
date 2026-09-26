#!/usr/bin/env node
/** GW-8 knowledge smoke: corpus schema, Twin 0, runtime CLOSED, no private ingest. */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const errors = [];
const twin = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw_public_knowledge_twin.json"), "utf8"));
if (!Array.isArray(twin.records) || twin.records.length !== 0) errors.push("Twin records[] must remain empty");

const corpus = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw8_approved_knowledge_corpus.json"), "utf8"));
const routing = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw8_surface_routing.json"), "utf8"));
if (corpus.runtime_status !== "CLOSED" || routing.runtime_status !== "CLOSED") errors.push("runtime_status must be CLOSED");
if (corpus.twin_live_records !== 0) errors.push("twin_live_records must be 0");
if (corpus.private_data_included !== 0) errors.push("private_data_included must be 0");
if (corpus.unauthorized_subjects_included !== 0) errors.push("unauthorized_subjects_included must be 0");
if (!Array.isArray(corpus.knowledge) || corpus.knowledge.length < 16) errors.push("corpus too small");

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
const TYPES = new Set(["FACT", "EVIDENCE", "CONCEPT", "LIMITATION", "IDENTITY", "VISUAL", "PROTOTYPE", "GOVERNANCE", "COMMERCIAL"]);
const ids = new Set();
for (const row of corpus.knowledge) {
  if (ids.has(row.knowledge_id)) errors.push(`duplicate ${row.knowledge_id}`);
  ids.add(row.knowledge_id);
  for (const field of ["knowledge_id", "subject_id", "public_name", "knowledge_type", "statement", "evidence_state"]) {
    if (!row[field]) errors.push(`missing ${field} on ${row.knowledge_id}`);
  }
  if (!ALLOWED_SUBJECTS.has(row.subject_id)) errors.push(`unauthorized subject ${row.subject_id}`);
  if (!TYPES.has(row.knowledge_type)) errors.push(`bad type ${row.knowledge_type}`);
  if (row.public_safe !== true) errors.push(`${row.knowledge_id} not public_safe`);
  if (row.evidence_state === "VERIFIED") errors.push(`${row.knowledge_id} must not upgrade to VERIFIED`);
  for (const href of row.related_surfaces || []) {
    if (!/^[a-z0-9-]+\.html$/.test(href)) errors.push(`non-local surface ${href} on ${row.knowledge_id}`);
  }
}

const blob = JSON.stringify(corpus) + JSON.stringify(routing);
if (/[A-Za-z]:\\/.test(blob) || /127\.0\.0\.1/.test(blob) || /localhost:\d+/.test(blob)) errors.push("private host/path in public payload");
if (/dashboard\/Html|HODP|ICIS|NAS |sk-[A-Za-z0-9]{20,}/.test(blob)) errors.push("forbidden private system token in payload");
if (corpus.knowledge.some((r) => /generating revenue|valuation is|customers include/i.test(r.statement))) {
  errors.push("commercial invention in corpus");
}

const requiredDocs = [
  "docs/golden-website/GW_8_GOLDEN_GUIDE_AI_CONTRACT.md",
  "docs/golden-website/GW_8_QA_BANK.md",
  "docs/golden-website/GW_8_VISITOR_INTENT_ROUTING.md",
  "docs/golden-website/GW_8_CRITIC_MODE_POLICY.md",
  "docs/golden-website/GW_8_GOLDEN_GUIDE_AI_TEST_QUESTIONS.md",
  "docs/golden-website/PHASE_GW_8_GREEN_RECEIPT.md",
];
for (const rel of requiredDocs) {
  if (!fs.existsSync(path.join(ROOT, rel))) errors.push(`missing ${rel}`);
}

const qa = fs.readFileSync(path.join(ROOT, "docs/golden-website/GW_8_QA_BANK.md"), "utf8");
for (const needle of [
  "What is Z-Sanctuary Universe?",
  "What does QUALIFIED mean?",
  "Are you Zuno?",
  "Is there a valuation?",
  "QADP is not Golden Guide AI",
]) {
  if (!qa.includes(needle)) errors.push(`Q&A bank missing ${needle}`);
}

const tests = fs.readFileSync(path.join(ROOT, "docs/golden-website/GW_8_GOLDEN_GUIDE_AI_TEST_QUESTIONS.md"), "utf8");
const rows = tests.split("\n").filter((l) => /^\| \d+ \|/.test(l));
if (rows.length < 40) errors.push(`need at least 40 test questions, got ${rows.length}`);
if (!tests.includes("PRIVATE_REFUSAL") || !tests.includes("UNKNOWN")) errors.push("test suite missing PRIVATE_REFUSAL/UNKNOWN");

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`GW-8 knowledge smoke: PASS (records=${corpus.knowledge.length}; tests=${rows.length}; Twin=0; runtime=CLOSED)`);
