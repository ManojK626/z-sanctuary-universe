#!/usr/bin/env node
/**
 * GW-9: copy approved GW-8 corpus + GW-9 routing/curated maps into the local shell payload.
 * Does not add Twin records. Does not fetch network. Does not include private overlay.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS = path.join(ROOT, "data/golden-website/public/gw8_approved_knowledge_corpus.json");
const ROUTING = path.join(ROOT, "data/golden-website/public/gw9_surface_routing.json");
const CURATED = path.join(ROOT, "data/golden-website/public/gw9_curated_question_map.json");
const OUT_JS = path.join(ROOT, "docs/golden-website/shell/data/gw9-guide-sandbox.js");

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

const corpus = readJson(CORPUS);
const routing = readJson(ROUTING);
const curated = readJson(CURATED);

if (!Array.isArray(corpus.knowledge) || corpus.knowledge.length !== 22) {
  throw new Error(`GW-9 corpus must be exactly 22 records, got ${corpus.knowledge && corpus.knowledge.length}`);
}
if (corpus.private_data_included !== 0) throw new Error("private_data_included must be 0");
if (corpus.unauthorized_subjects_included !== 0) throw new Error("unauthorized_subjects_included must be 0");

const blob = JSON.stringify(corpus) + JSON.stringify(routing) + JSON.stringify(curated);
if (/[A-Za-z]:\\/.test(blob) || /127\.0\.0\.1/.test(blob) || /localhost:\d+/.test(blob)) {
  throw new Error("private host/path in GW-9 payload");
}
if (/dashboard\/Html|sk-[A-Za-z0-9]{20,}/.test(blob)) {
  throw new Error("forbidden token in GW-9 payload");
}

const payload = {
  schema: "gw9_guide_sandbox_payload_v1",
  phase: "GW-9",
  runtime_status: "SANDBOX_LOCAL_ONLY",
  production_runtime: "CLOSED",
  publication_authorized: false,
  provider: "NONE",
  embeddings: false,
  corpus_records: corpus.knowledge.length,
  corpus,
  routing,
  curated,
};

fs.mkdirSync(path.dirname(OUT_JS), { recursive: true });
fs.writeFileSync(
  OUT_JS,
  `/* Generated from GW-8 approved corpus + GW-9 routing/curated maps. Do not add private data. */\nwindow.GW9_SANDBOX = ${JSON.stringify(payload, null, 2)};\n`,
  "utf8",
);
process.stdout.write(
  JSON.stringify(
    {
      knowledge: corpus.knowledge.length,
      curated: curated.maps.length,
      js: path.relative(ROOT, OUT_JS).split(path.sep).join("/"),
      runtime: "SANDBOX_LOCAL_ONLY",
    },
    null,
    2,
  ),
);
