#!/usr/bin/env node
/**
 * GW-10: critic question bank, red-team probes, and normal-vs-critic consistency.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
await import(pathToFileURL(path.join(ROOT, "docs/golden-website/shell/js/golden-guide-engine.js")).href);
await import(pathToFileURL(path.join(ROOT, "docs/golden-website/shell/js/golden-guide-critic.js")).href);
const engine = globalThis.GoldenGuideEngine;
const critic = globalThis.GoldenGuideCritic;

const corpus = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw8_approved_knowledge_corpus.json"), "utf8"));
const routing = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw9_surface_routing.json"), "utf8"));
const curated = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw9_curated_question_map.json"), "utf8"));
const rules = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw10_critic_rules.json"), "utf8"));
const maps = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw10_critic_curated_map.json"), "utf8"));
const bank = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw10_critic_question_bank.json"), "utf8"));
const probes = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw10_red_team_probes.json"), "utf8"));
const pairs = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw10_consistency_pairs.json"), "utf8"));
const twin = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw_public_knowledge_twin.json"), "utf8"));

const ctx = { corpus, routing, curated, criticRules: rules, criticMaps: maps, engine };

if (corpus.knowledge.length !== 22) {
  console.error("corpus must remain 22");
  process.exit(1);
}
if (!Array.isArray(twin.records) || twin.records.length !== 0) {
  console.error("Twin records[] must remain empty");
  process.exit(1);
}

function typesOk(result, item) {
  const expected = item.expected_types;
  if (result.behavior === "PRIVATE_REFUSAL") return true;
  if (!expected || !expected.length) return true;
  const have = new Set(result.explanation.critique_types || []);
  return expected.some((t) => have.has(t));
}

function runCritic(item) {
  const result = critic.critiqueQuestion(item.question, ctx);
  const expected = item.expected_behavior;
  const pass =
    expected.includes(result.behavior) &&
    typesOk(result, item) &&
    (engine.claimHits(result.answer) || []).length === 0;
  return {
    id: item.id,
    question: item.question,
    expected,
    actual: result.behavior,
    critique_types: result.explanation.critique_types || [],
    pass: pass ? "PASS" : "FAIL",
    matched_knowledge_ids: result.explanation.matched_knowledge_ids || [],
  };
}

function contradiction(normal, criticRes) {
  if (normal.behavior === "PRIVATE_REFUSAL" && criticRes.behavior !== "PRIVATE_REFUSAL") {
    return "critic-answered-private";
  }
  if (normal.behavior === "UNKNOWN" && criticRes.behavior !== "UNKNOWN") {
    return "critic-filled-unknown";
  }
  const nMap = {};
  for (const c of normal.citations || []) nMap[c.knowledge_id] = c.evidence_state;
  for (const c of criticRes.citations || []) {
    if (nMap[c.knowledge_id] && nMap[c.knowledge_id] !== c.evidence_state) return `evidence-state-changed:${c.knowledge_id}`;
  }
  const n = (normal.answer || "").toLowerCase();
  const k = (criticRes.answer || "").toLowerCase();
  if (/not zuno/.test(n) && /\bis zuno\b/.test(k) && !/not zuno/.test(k)) return "zuno-flip";
  if (/potential is not revenue|no approved public revenue/.test(n) && /generating revenue/.test(k) && !/not/.test(k)) {
    return "revenue-flip";
  }
  if (/not a finished public production|not a public production|is not a production/.test(n) && /is production-ready/.test(k) && !/not/.test(k)) {
    return "production-flip";
  }
  return null;
}

const criticRows = bank.questions.map(runCritic);
const probeRows = probes.probes.map(runCritic);
const consistencyRows = pairs.questions.map((question) => {
  const normal = engine.answerQuestion(question, ctx);
  const criticRes = critic.critiqueQuestion(question, ctx);
  const reason = contradiction(normal, criticRes);
  return {
    question,
    normal_behavior: normal.behavior,
    critic_behavior: criticRes.behavior,
    contradiction: reason,
    pass: reason ? "FAIL" : "PASS",
  };
});

const cPass = criticRows.filter((r) => r.pass === "PASS").length;
const cFail = criticRows.filter((r) => r.pass === "FAIL").length;
const rPass = probeRows.filter((r) => r.pass === "PASS").length;
const rFail = probeRows.filter((r) => r.pass === "FAIL").length;
const kPass = consistencyRows.filter((r) => r.pass === "PASS").length;
const kFail = consistencyRows.filter((r) => r.pass === "FAIL").length;
const contradictions = consistencyRows.filter((r) => r.pass === "FAIL").length;

const unknownCount = criticRows.concat(probeRows).filter((r) => r.actual === "UNKNOWN").length;
const privateCount = criticRows.concat(probeRows).filter((r) => r.actual === "PRIVATE_REFUSAL").length;

const report = {
  schema: "gw10_critic_suite_results_v1",
  generated_at: new Date().toISOString(),
  phase: "GW-10",
  corpus_records_consumed: 22,
  private_corpus_records: 0,
  twin_live_records: 0,
  provider_dependencies: 0,
  external_calls: 0,
  critic_questions: { total: criticRows.length, passed: cPass, failed: cFail, rows: criticRows },
  red_team: { total: probeRows.length, passed: rPass, failed: rFail, rows: probeRows },
  consistency: { total: consistencyRows.length, passed: kPass, failed: kFail, contradictory_normal_critic_answers: contradictions, rows: consistencyRows },
  unknown_count: unknownCount,
  private_refusal_count: privateCount,
  pass: cFail === 0 && rFail === 0 && contradictions === 0 && criticRows.length >= 40 && probeRows.length >= 20,
};

const outJson = path.join(ROOT, "data/reports/z_gw_10_critic_suite.json");
const outGw = path.join(ROOT, "docs/golden-website/gw-10/critic_suite_results.json");
fs.mkdirSync(path.dirname(outJson), { recursive: true });
fs.mkdirSync(path.dirname(outGw), { recursive: true });
fs.writeFileSync(outJson, `${JSON.stringify(report, null, 2)}\n`, "utf8");
fs.writeFileSync(outGw, `${JSON.stringify(report, null, 2)}\n`, "utf8");

const fails = criticRows.concat(probeRows).filter((r) => r.pass === "FAIL").concat(
  consistencyRows.filter((r) => r.pass === "FAIL").map((r) => ({ id: "CONS", question: r.question, expected: ["consistent"], actual: r.contradiction, pass: "FAIL" })),
);
if (!report.pass) {
  console.error(fails.map((f) => `${f.id} expected ${JSON.stringify(f.expected)} actual ${f.actual}`).join("\n"));
  console.error(`GW-10 critic suite: FAIL (critic ${cPass}/${criticRows.length}, red-team ${rPass}/${probeRows.length}, consistency ${kPass}/${consistencyRows.length})`);
  process.exit(1);
}
console.log(
  `GW-10 critic suite: PASS (critic ${cPass}/${criticRows.length}, red-team ${rPass}/${probeRows.length}, consistency ${kPass}/${consistencyRows.length}, contradictions=0, UNKNOWN=${unknownCount}, PRIVATE_REFUSAL=${privateCount})`,
);
