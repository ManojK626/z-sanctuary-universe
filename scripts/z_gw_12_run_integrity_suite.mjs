#!/usr/bin/env node
/**
 * GW-12: integrity challenge bank, red-team probes, and three-mode consistency.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
await import(pathToFileURL(path.join(ROOT, "docs/golden-website/shell/js/golden-guide-engine.js")).href);
await import(pathToFileURL(path.join(ROOT, "docs/golden-website/shell/js/golden-guide-critic.js")).href);
await import(pathToFileURL(path.join(ROOT, "docs/golden-website/shell/js/golden-guide-integrity.js")).href);
const engine = globalThis.GoldenGuideEngine;
const critic = globalThis.GoldenGuideCritic;
const integrity = globalThis.GoldenGuideIntegrity;

const corpus = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw8_approved_knowledge_corpus.json"), "utf8"));
const routing = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw9_surface_routing.json"), "utf8"));
const curated = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw9_curated_question_map.json"), "utf8"));
const criticRules = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw10_critic_rules.json"), "utf8"));
const criticMaps = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw10_critic_curated_map.json"), "utf8"));
const rules = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw12_integrity_rules.json"), "utf8"));
const maps = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw12_integrity_curated_map.json"), "utf8"));
const bank = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw12_integrity_question_bank.json"), "utf8"));
const probes = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw12_integrity_red_team.json"), "utf8"));
const pairs = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw12_mode_consistency.json"), "utf8"));
const twin = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw_public_knowledge_twin.json"), "utf8"));

const corpusIds = new Set(corpus.knowledge.map((k) => k.knowledge_id));
const evidenceById = Object.fromEntries(corpus.knowledge.map((k) => [k.knowledge_id, k.evidence_state]));
const ctx = {
  corpus,
  routing,
  curated,
  criticRules,
  criticMaps,
  integrityRules: rules,
  integrityMaps: maps,
  engine,
};

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
  if (!expected || !expected.length) return true;
  if (result.behavior === "PRIVATE_REFUSAL") return true;
  const have = new Set(result.explanation.integrity_types || []);
  return expected.some((t) => have.has(t));
}

function citationSafe(result) {
  const fake = [];
  for (const c of result.citations || []) {
    if (!corpusIds.has(c.knowledge_id)) fake.push(c.knowledge_id);
    if (c.evidence_state !== evidenceById[c.knowledge_id]) fake.push(`state:${c.knowledge_id}`);
  }
  if (/k-fake/i.test(result.answer || "")) fake.push("answer-K-FAKE");
  result.explanation.fabricated_citation_ids = fake;
  return fake.length === 0;
}

function noBoast(result) {
  const a = result.answer || "";
  return !/\bnever hallucinates\b/i.test(a) || /irresponsible|does not claim|do not claim|would itself/i.test(a);
}

function runIntegrity(item) {
  const result = integrity.integrityQuestion(item.question, ctx);
  const expected = item.expected_behavior;
  const pass =
    expected.includes(result.behavior) &&
    typesOk(result, item) &&
    citationSafe(result) &&
    noBoast(result) &&
    (engine.claimHits(result.answer) || []).length === 0;
  return {
    id: item.id,
    class: item.class,
    question: item.question,
    expected,
    actual: result.behavior,
    integrity_types: result.explanation.integrity_types || [],
    pass: pass ? "PASS" : "FAIL",
    matched_knowledge_ids: result.explanation.matched_knowledge_ids || [],
    fabricated_citation_ids: result.explanation.fabricated_citation_ids || [],
  };
}

function contradiction(normal, criticRes, integ) {
  if (normal.behavior === "PRIVATE_REFUSAL" && criticRes.behavior !== "PRIVATE_REFUSAL") return "critic-answered-private";
  if (normal.behavior === "PRIVATE_REFUSAL" && integ.behavior !== "PRIVATE_REFUSAL") return "integrity-answered-private";
  if (normal.behavior === "UNKNOWN" && criticRes.behavior !== "UNKNOWN") return "critic-filled-unknown";
  if (normal.behavior === "UNKNOWN" && integ.behavior !== "UNKNOWN") return "integrity-filled-unknown";
  for (const side of [criticRes, integ]) {
    for (const c of side.citations || []) {
      if (c.knowledge_id && evidenceById[c.knowledge_id] && evidenceById[c.knowledge_id] !== c.evidence_state) {
        return `evidence-state-changed:${c.knowledge_id}`;
      }
    }
  }
  const n = (normal.answer || "").toLowerCase();
  const k = (integ.answer || "").toLowerCase();
  if (/not zuno/.test(n) && /\bis zuno\b/.test(k) && !/not zuno/.test(k)) return "zuno-flip";
  if (/potential is not revenue|no approved public revenue/.test(n) && /generating revenue/.test(k) && !/not/.test(k)) {
    return "revenue-flip";
  }
  return null;
}

const integrityRows = bank.questions.map(runIntegrity);
const probeRows = probes.probes.map(runIntegrity);
const consistencyRows = pairs.questions.map((question) => {
  const normal = engine.answerQuestion(question, ctx);
  const criticRes = critic.critiqueQuestion(question, ctx);
  const integ = integrity.integrityQuestion(question, ctx);
  const reason = contradiction(normal, criticRes, integ) || (!citationSafe(integ) ? "fabricated-citation" : null);
  return {
    question,
    normal_behavior: normal.behavior,
    critic_behavior: criticRes.behavior,
    integrity_behavior: integ.behavior,
    contradiction: reason,
    pass: reason ? "FAIL" : "PASS",
  };
});

const iPass = integrityRows.filter((r) => r.pass === "PASS").length;
const iFail = integrityRows.filter((r) => r.pass === "FAIL").length;
const rPass = probeRows.filter((r) => r.pass === "PASS").length;
const rFail = probeRows.filter((r) => r.pass === "FAIL").length;
const kPass = consistencyRows.filter((r) => r.pass === "PASS").length;
const kFail = consistencyRows.filter((r) => r.pass === "FAIL").length;
const fabricated = integrityRows.concat(probeRows).reduce((n, r) => n + (r.fabricated_citation_ids || []).length, 0);
const unknownCount = integrityRows.concat(probeRows).filter((r) => r.actual === "UNKNOWN").length;
const privateCount = integrityRows.concat(probeRows).filter((r) => r.actual === "PRIVATE_REFUSAL").length;

const report = {
  schema: "gw12_integrity_suite_results_v1",
  generated_at: new Date().toISOString(),
  phase: "GW-12",
  corpus_records_consumed: 22,
  private_corpus_records: 0,
  twin_live_records: 0,
  provider_dependencies: 0,
  external_calls: 0,
  fabricated_citations: fabricated,
  evidence_state_upgrades: consistencyRows.filter((r) => String(r.contradiction || "").startsWith("evidence-state")).length,
  integrity_questions: { total: integrityRows.length, passed: iPass, failed: iFail, rows: integrityRows },
  red_team: { total: probeRows.length, passed: rPass, failed: rFail, rows: probeRows },
  consistency: { total: consistencyRows.length, passed: kPass, failed: kFail, contradictions: kFail, rows: consistencyRows },
  unknown_count: unknownCount,
  private_refusal_count: privateCount,
  pass:
    iFail === 0 &&
    rFail === 0 &&
    kFail === 0 &&
    fabricated === 0 &&
    integrityRows.length >= 36 &&
    probeRows.length >= 20,
};

const outJson = path.join(ROOT, "data/reports/z_gw_12_integrity_suite.json");
const outGw = path.join(ROOT, "docs/golden-website/gw-12/integrity_suite_results.json");
fs.mkdirSync(path.dirname(outJson), { recursive: true });
fs.mkdirSync(path.dirname(outGw), { recursive: true });
fs.writeFileSync(outJson, `${JSON.stringify(report, null, 2)}\n`, "utf8");
fs.writeFileSync(outGw, `${JSON.stringify(report, null, 2)}\n`, "utf8");

const fails = integrityRows.concat(probeRows).filter((r) => r.pass === "FAIL").concat(
  consistencyRows.filter((r) => r.pass === "FAIL").map((r) => ({
    id: "CONS",
    question: r.question,
    expected: ["consistent"],
    actual: r.contradiction,
    pass: "FAIL",
  })),
);
if (!report.pass) {
  console.error(fails.map((f) => `${f.id} expected ${JSON.stringify(f.expected)} actual ${f.actual}`).join("\n"));
  console.error(
    `GW-12 integrity suite: FAIL (integrity ${iPass}/${integrityRows.length}, red-team ${rPass}/${probeRows.length}, consistency ${kPass}/${consistencyRows.length})`,
  );
  process.exit(1);
}
console.log(
  `GW-12 integrity suite: PASS (integrity ${iPass}/${integrityRows.length}, red-team ${rPass}/${probeRows.length}, consistency ${kPass}/${consistencyRows.length}, fabricated_citations=0, UNKNOWN=${unknownCount}, PRIVATE_REFUSAL=${privateCount})`,
);
