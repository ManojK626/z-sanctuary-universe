#!/usr/bin/env node
/**
 * GW-12: public-safe integrity rules, maps, and page content into the local shell payload.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const RULES = path.join(ROOT, "data/golden-website/public/gw12_integrity_rules.json");
const MAPS = path.join(ROOT, "data/golden-website/public/gw12_integrity_curated_map.json");
const CONTENT = path.join(ROOT, "data/golden-website/public/gw12_integrity_content.json");
const CORPUS = path.join(ROOT, "data/golden-website/public/gw8_approved_knowledge_corpus.json");
const OUT_JS = path.join(ROOT, "docs/golden-website/shell/data/gw12-integrity.js");

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

const rules = readJson(RULES);
const maps = readJson(MAPS);
const content = readJson(CONTENT);
const corpus = readJson(CORPUS);
if (!Array.isArray(corpus.knowledge) || corpus.knowledge.length !== 22) {
  throw new Error("GW-12 still requires the 22-record GW-8 corpus");
}
const ids = new Set(corpus.knowledge.map((k) => k.knowledge_id));
for (const m of maps.maps || []) {
  for (const id of m.knowledge_ids || []) {
    if (!ids.has(id)) throw new Error(`integrity map cites unknown knowledge_id ${id}`);
  }
}
if ((content.challenge_classes || []).length < 18) throw new Error("GW-12 requires 18 integrity classes");
if (content.forbidden_boast && /never hallucinates/.test(content.forbidden_boast) === false) {
  throw new Error("forbidden boast must remain visible as a rejected claim");
}

const blob = JSON.stringify(rules) + JSON.stringify(maps) + JSON.stringify(content);
if (/[A-Za-z]:\\/.test(blob) || /127\.0\.0\.1/.test(blob) || /dashboard\/Html/.test(blob)) {
  throw new Error("private token in integrity payload");
}
if (/mailto:/i.test(blob) || /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/.test(blob)) {
  throw new Error("email in integrity payload");
}

const payload = {
  schema: "gw12_integrity_payload_v1",
  phase: "GW-12",
  runtime_status: "SANDBOX_LOCAL_ONLY",
  production_runtime: "CLOSED",
  provider: "NONE",
  corpus_records: 22,
  rules,
  maps,
  content,
};

fs.mkdirSync(path.dirname(OUT_JS), { recursive: true });
fs.writeFileSync(
  OUT_JS,
  `/* Generated GW-12 integrity payload. Public-safe only. No provider. */\nwindow.GW12_INTEGRITY = ${JSON.stringify(payload, null, 2)};\n`,
  "utf8",
);
process.stdout.write(
  JSON.stringify(
    {
      maps: maps.maps.length,
      classes: content.challenge_classes.length,
      js: "docs/golden-website/shell/data/gw12-integrity.js",
    },
    null,
    2,
  ),
);
