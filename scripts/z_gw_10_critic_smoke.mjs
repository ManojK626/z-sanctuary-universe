#!/usr/bin/env node
/** GW-10 critic sandbox smoke: 22 corpus, Twin 0, critic controls, no provider. */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const errors = [];
const twin = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw_public_knowledge_twin.json"), "utf8"));
if (!Array.isArray(twin.records) || twin.records.length !== 0) errors.push("Twin records[] must remain empty");
const corpus = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw8_approved_knowledge_corpus.json"), "utf8"));
if (corpus.knowledge.length !== 22) errors.push("corpus must remain 22");

const SHELL = path.join(ROOT, "docs/golden-website/shell");
const required = [
  "guide-sandbox.html",
  "js/golden-guide-critic.js",
  "js/golden-guide-sandbox.js",
  "data/gw10-critic.js",
];
for (const rel of required) {
  if (!fs.existsSync(path.join(SHELL, rel))) errors.push(`missing ${rel}`);
}

const html = fs.readFileSync(path.join(SHELL, "guide-sandbox.html"), "utf8");
if (!html.includes("CHALLENGE Z-SANCTUARY")) errors.push("missing Challenge control");
if (!html.includes("NORMAL GUIDE")) errors.push("missing Normal Guide control");
if (!html.includes("LOCAL CRITIC SANDBOX")) errors.push("missing LOCAL CRITIC SANDBOX");
if (!html.includes("role=\"radiogroup\"")) errors.push("mode switch must be a radiogroup");
if (!html.includes("gw-guide-critiques")) errors.push("missing critique mount");
if (/<iframe/i.test(html)) errors.push("iframe not allowed");

const bank = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw10_critic_question_bank.json"), "utf8"));
const probes = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw10_red_team_probes.json"), "utf8"));
if (bank.questions.length < 40) errors.push("critic bank must have at least 40 questions");
if (probes.probes.length < 20) errors.push("red-team must have at least 20 probes");

const rules = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw10_critic_rules.json"), "utf8"));
const types = new Set(rules.critique_types);
for (const t of ["EVIDENCE_GAP", "VALIDATION_GAP", "SCOPE_LIMIT", "PROTOTYPE_LIMIT", "COMMERCIAL_GAP", "CLAIM_RISK", "UNKNOWN", "NO_MATERIAL_PUBLIC_GAP_FOUND"]) {
  if (!types.has(t)) errors.push(`missing critique type ${t}`);
}
if ((rules.evidence_ladder || []).length < 8) errors.push("evidence ladder incomplete");

const blob = fs.readFileSync(path.join(SHELL, "data/gw10-critic.js"), "utf8") + fs.readFileSync(path.join(SHELL, "js/golden-guide-critic.js"), "utf8");
if (/[A-Za-z]:\\/.test(blob) || /127\.0\.0\.1/.test(blob) || /dashboard\/Html/.test(blob)) errors.push("private path in critic files");
if (/\bfetch\s*\(|XMLHttpRequest|new WebSocket/.test(blob)) errors.push("network in critic files");

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("GW-10 critic smoke: PASS (22 records, Twin 0, Challenge control present)");
