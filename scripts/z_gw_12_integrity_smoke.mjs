#!/usr/bin/env node
/** GW-12 integrity sandbox smoke: 22 corpus, Twin 0, Challenge the AI, no provider. */
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
  "ai-integrity.html",
  "guide-sandbox.html",
  "js/golden-guide-integrity.js",
  "js/golden-ai-integrity.js",
  "data/gw12-integrity.js",
];
for (const rel of required) {
  if (!fs.existsSync(path.join(SHELL, rel))) errors.push(`missing ${rel}`);
}

const html = fs.readFileSync(path.join(SHELL, "guide-sandbox.html"), "utf8");
if (!html.includes("CHALLENGE THE AI")) errors.push("missing Challenge the AI control");
if (!html.includes("NORMAL GUIDE")) errors.push("missing Normal Guide control");
if (!html.includes("LOCAL AI INTEGRITY SANDBOX")) errors.push("missing LOCAL AI INTEGRITY SANDBOX");
if (!html.includes("gw-mode-integrity")) errors.push("missing integrity mode control");
if (/<iframe/i.test(html)) errors.push("iframe not allowed");

const page = fs.readFileSync(path.join(SHELL, "ai-integrity.html"), "utf8");
if (!page.includes("HOW WE HANDLE AI FAILURE")) errors.push("missing HOW WE HANDLE AI FAILURE");
if (/<form/i.test(page) && !page.includes("gw-guide-form")) errors.push("integrity page must not add an external form");
if (/mailto:/i.test(page)) errors.push("mailto not allowed");

const bank = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw12_integrity_question_bank.json"), "utf8"));
const probes = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw12_integrity_red_team.json"), "utf8"));
if (bank.questions.length < 36) errors.push("integrity bank must have at least 36 questions");
if (probes.probes.length < 20) errors.push("integrity red-team must have at least 20 probes");

const rules = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw12_integrity_rules.json"), "utf8"));
if ((rules.integrity_types || []).length < 18) errors.push("integrity types incomplete");
if (!/does not claim that it never hallucinates|treats AI output as a proposal/i.test(rules.credible_answer)) {
  errors.push("credible answer missing");
}

const blob =
  fs.readFileSync(path.join(SHELL, "data/gw12-integrity.js"), "utf8") +
  fs.readFileSync(path.join(SHELL, "js/golden-guide-integrity.js"), "utf8");
if (/[A-Za-z]:\\/.test(blob) || /127\.0\.0\.1/.test(blob) || /dashboard\/Html/.test(blob)) errors.push("private path in integrity files");
if (/\bfetch\s*\(|XMLHttpRequest|new WebSocket/.test(blob)) errors.push("network in integrity files");

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("GW-12 integrity smoke: PASS (22 records, Twin 0, Challenge the AI present)");
