#!/usr/bin/env node
/**
 * GW-9: run the 50 GW-8 behavior-class tests and the adversarial mini-suite.
 * Does not rewrite expected answers. Does not call providers.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
await import(pathToFileURL(path.join(ROOT, "docs/golden-website/shell/js/golden-guide-engine.js")).href);
const engine = globalThis.GoldenGuideEngine;
if (!engine || typeof engine.answerQuestion !== "function") {
  console.error("GoldenGuideEngine failed to load");
  process.exit(1);
}

const corpus = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw8_approved_knowledge_corpus.json"), "utf8"));
const routing = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw9_surface_routing.json"), "utf8"));
const curated = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw9_curated_question_map.json"), "utf8"));
const suite = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw9_behavior_suite.json"), "utf8"));
const probes = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw9_adversarial_probes.json"), "utf8"));
const twin = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw_public_knowledge_twin.json"), "utf8"));

const ctx = { corpus, routing, curated };
const ALLOWED = new Set(engine.BEHAVIORS);
const SHELL = path.join(ROOT, "docs/golden-website/shell");

function routeValid(href) {
  return /^[a-z0-9-]+\.html$/.test(href) && fs.existsSync(path.join(SHELL, href));
}

function runOne(item) {
  const result = engine.answerQuestion(item.question, ctx);
  const expected = item.expected;
  const actual = result.behavior;
  const claimHits = engine.claimHits(result.answer).concat(result.explanation.claim_guard_hits || []);
  const routesOk = (result.routes || []).every(routeValid);
  const classOk = ALLOWED.has(actual);
  const expectedOk = expected.includes(actual);
  const noSixth = classOk;
  const pass = expectedOk && noSixth && routesOk && claimHits.length === 0;
  return {
    id: item.id,
    class: item.class || "adversarial",
    question: item.question,
    expected,
    actual,
    pass: pass ? "PASS" : "FAIL",
    matched_knowledge_ids: result.explanation.matched_knowledge_ids || [],
    prohibited_claim_detection: claimHits,
    route_validity: routesOk,
    routes: result.routes || [],
    confidence: result.confidence,
    intent: result.intent,
    retrieval: result.explanation.retrieval,
    needs_review: result.needs_review === true,
  };
}

if (!Array.isArray(corpus.knowledge) || corpus.knowledge.length !== 22) {
  console.error("corpus records must be 22");
  process.exit(1);
}
if (!Array.isArray(twin.records) || twin.records.length !== 0) {
  console.error("Twin records[] must remain empty");
  process.exit(1);
}

const questionRows = suite.questions.map(runOne);
const probeRows = probes.probes.map(runOne);
const qPass = questionRows.filter((r) => r.pass === "PASS").length;
const qFail = questionRows.filter((r) => r.pass === "FAIL").length;
const aPass = probeRows.filter((r) => r.pass === "PASS").length;
const aFail = probeRows.filter((r) => r.pass === "FAIL").length;

const unknownCount = questionRows.filter((r) => r.actual === "UNKNOWN").length + probeRows.filter((r) => r.actual === "UNKNOWN").length;
const privateCount = questionRows.filter((r) => r.actual === "PRIVATE_REFUSAL").length + probeRows.filter((r) => r.actual === "PRIVATE_REFUSAL").length;

const report = {
  schema: "gw9_behavior_suite_results_v1",
  generated_at: new Date().toISOString(),
  phase: "GW-9",
  corpus_records_consumed: corpus.knowledge.length,
  private_corpus_records: corpus.private_data_included,
  twin_live_records: twin.records.length,
  provider_dependencies: 0,
  external_calls: 0,
  questions: {
    total: questionRows.length,
    passed: qPass,
    failed: qFail,
    rows: questionRows,
  },
  adversarial: {
    total: probeRows.length,
    passed: aPass,
    failed: aFail,
    rows: probeRows,
  },
  unknown_count: unknownCount,
  private_refusal_count: privateCount,
  pass: qFail === 0 && aFail === 0 && questionRows.length === 50,
};

const outJson = path.join(ROOT, "data/reports/z_gw_9_behavior_suite.json");
const outGw = path.join(ROOT, "docs/golden-website/gw-9/behavior_suite_results.json");
fs.mkdirSync(path.dirname(outJson), { recursive: true });
fs.mkdirSync(path.dirname(outGw), { recursive: true });
fs.writeFileSync(outJson, `${JSON.stringify(report, null, 2)}\n`, "utf8");
fs.writeFileSync(outGw, `${JSON.stringify(report, null, 2)}\n`, "utf8");

const fails = questionRows.concat(probeRows).filter((r) => r.pass === "FAIL");
if (fails.length) {
  console.error(
    fails
      .map((f) => `${f.id} expected ${f.expected.join("|")} actual ${f.actual} claims=${JSON.stringify(f.prohibited_claim_detection)}`)
      .join("\n"),
  );
  console.error(`GW-9 behavior suite: FAIL (questions ${qPass}/50, adversarial ${aPass}/${probeRows.length})`);
  process.exit(1);
}
console.log(
  `GW-9 behavior suite: PASS (questions ${qPass}/50, adversarial ${aPass}/${probeRows.length}, UNKNOWN=${unknownCount}, PRIVATE_REFUSAL=${privateCount})`,
);
