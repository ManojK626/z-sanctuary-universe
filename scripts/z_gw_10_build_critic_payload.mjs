#!/usr/bin/env node
/**
 * GW-10: public-safe critic rules + curated maps into the local shell payload.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const RULES = path.join(ROOT, "data/golden-website/public/gw10_critic_rules.json");
const MAPS = path.join(ROOT, "data/golden-website/public/gw10_critic_curated_map.json");
const CORPUS = path.join(ROOT, "data/golden-website/public/gw8_approved_knowledge_corpus.json");
const OUT_JS = path.join(ROOT, "docs/golden-website/shell/data/gw10-critic.js");

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

const rules = readJson(RULES);
const maps = readJson(MAPS);
const corpus = readJson(CORPUS);
if (!Array.isArray(corpus.knowledge) || corpus.knowledge.length !== 22) {
  throw new Error("GW-10 still requires the 22-record GW-8 corpus");
}
const ids = new Set(corpus.knowledge.map((k) => k.knowledge_id));
for (const id of Object.keys(rules.records || {})) {
  if (!ids.has(id)) throw new Error(`critic rule for unknown knowledge_id ${id}`);
}
const blob = JSON.stringify(rules) + JSON.stringify(maps);
if (/[A-Za-z]:\\/.test(blob) || /127\.0\.0\.1/.test(blob) || /dashboard\/Html/.test(blob)) {
  throw new Error("private token in critic payload");
}

const payload = {
  schema: "gw10_critic_payload_v1",
  phase: "GW-10",
  runtime_status: "SANDBOX_LOCAL_ONLY",
  production_runtime: "CLOSED",
  provider: "NONE",
  corpus_records: 22,
  rules,
  maps,
};

fs.mkdirSync(path.dirname(OUT_JS), { recursive: true });
fs.writeFileSync(
  OUT_JS,
  `/* Generated GW-10 critic rules. Public-safe only. */\nwindow.GW10_CRITIC = ${JSON.stringify(payload, null, 2)};\n`,
  "utf8",
);
process.stdout.write(JSON.stringify({ records: Object.keys(rules.records).length, maps: maps.maps.length, js: "docs/golden-website/shell/data/gw10-critic.js" }, null, 2));
