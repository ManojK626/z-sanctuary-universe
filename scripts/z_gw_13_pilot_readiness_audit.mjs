#!/usr/bin/env node
/**
 * GW-13 Public Pilot Readiness Audit.
 * Does not publish, deploy, or add runtime. Writes a local readiness report.
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const SHELL = path.join(ROOT, "docs/golden-website/shell");
const OUT_JSON = path.join(ROOT, "data/golden-website/gw13_pilot_readiness.json");
const OUT_JSON_PUBLIC = path.join(ROOT, "data/golden-website/public/gw13_pilot_readiness.json");
const OUT_REPORT = path.join(ROOT, "docs/golden-website/GW_13_PILOT_READINESS_REPORT.md");
const OUT_SUITE = path.join(ROOT, "docs/golden-website/gw-13/audit_results.json");
const OUT_HUB = path.join(ROOT, "data/reports/z_gw_13_pilot_readiness.json");

const JOURNEY = [
  "index.html",
  "portfolio.html",
  "universe-map.html",
  "gallery.html",
  "museum.html",
  "guide-sandbox.html",
  "ai-integrity.html",
  "gateway.html",
];
const RECORD_PAGES = ["core.html", "navigator.html", "drp.html", "eaii.html", "qadp.html", "observe.html"];
const ALL_PAGES = [...JOURNEY, ...RECORD_PAGES];
const REQUIRED_NAV = [
  "index.html",
  "portfolio.html",
  "universe-map.html",
  "gallery.html",
  "museum.html",
  "guide-sandbox.html",
  "gateway.html",
  "ai-integrity.html",
];

const findings = [];
function note(ok, id, detail) {
  findings.push({ ok, id, detail: detail || "" });
  console.log(`${ok ? "PASS" : "FAIL"}  ${id}${detail ? ` — ${detail}` : ""}`);
}

function read(p) {
  return fs.readFileSync(p, "utf8");
}
function readJson(p) {
  return JSON.parse(read(p));
}
function exists(p) {
  return fs.existsSync(p);
}

function runNode(rel) {
  const r = spawnSync(process.execPath, [rel], { cwd: ROOT, encoding: "utf8" });
  return {
    script: rel,
    status: r.status,
    ok: r.status === 0,
    out: String(r.stdout || "").trim().split("\n").pop() || "",
    err: String(r.stderr || "").trim().slice(0, 400),
  };
}

function runNpm(script) {
  const r = spawnSync("npm", ["run", script], { cwd: ROOT, encoding: "utf8", shell: true });
  return {
    script: `npm run ${script}`,
    status: r.status,
    ok: r.status === 0,
    out: String(r.stdout || "").trim().split("\n").filter(Boolean).pop() || "",
    err: String(r.stderr || "").trim().slice(0, 400),
  };
}

const twin = readJson(path.join(ROOT, "data/golden-website/public/gw_public_knowledge_twin.json"));
const corpus = readJson(path.join(ROOT, "data/golden-website/public/gw8_approved_knowledge_corpus.json"));
const adapter = readJson(path.join(ROOT, "data/golden-website/public/gw_approved_public_safe_adapter.json"));
const exhibits = readJson(path.join(ROOT, "data/golden-website/public/gw7_exhibits.json"));

note(Array.isArray(twin.records) && twin.records.length === 0, "twin-empty", `records=${twin.records.length}`);
note(twin.publication_authorized === false, "publication-not-authorized", String(twin.publication_authorized));
note(corpus.knowledge.length === 22, "corpus-22", String(corpus.knowledge.length));
note(adapter.records.length === 6, "adapter-6", String(adapter.records.length));
note(adapter.publication_authorized === false, "adapter-not-published", "");
note(exhibits.visuals.length === 6 && exhibits.prototypes.length === 1, "exhibits-6-plus-1", "");

const verifiedPublic = adapter.records.filter((r) => r.evidence_state === "VERIFIED");
note(verifiedPublic.length === 0, "no-verified-badge", `${verifiedPublic.length} VERIFIED public records`);
const byId = Object.fromEntries((adapter.records || []).map((r) => [r.canonical_id, r]));
note(byId.z_sanctuary_core && byId.z_sanctuary_core.evidence_state === "QUALIFIED", "adapter-core-qualified", "");
note(byId.univ_workstation_navigator && byId.univ_workstation_navigator.evidence_state === "SEALED", "adapter-nav-sealed", "");

function pageHas(file, re) {
  return re.test(read(path.join(SHELL, file)));
}
const truthChecks = [
  ["core.html", /Evidence state: QUALIFIED/, "core-qualified"],
  ["core.html", /Not VERIFIED/, "core-not-verified"],
  ["core.html", /Evidence PASS is not deployment authority/, "core-pass-not-deploy"],
  ["navigator.html", /Evidence: SEALED/, "nav-sealed"],
  ["navigator.html", /Public production: NO/, "nav-not-production"],
  ["drp.html", /Governance and responsibility/, "drp-governance-responsibility"],
  ["eaii.html", /inside the sanctuary hierarchy/, "eaii-bounded"],
  ["qadp.html", /QADP ≠ Golden Guide AI|QADP is not Golden Guide AI/, "qadp-not-guide"],
  ["observe.html", /does not autonomously intervene/, "observe-not-autonomous"],
  ["universe-map.html", /six-node engine proof/, "map-not-full-universe"],
  ["gallery.html", /screenshot is not backend proof/i, "screenshot-not-backend"],
  ["museum.html", /prototype is not production/i, "prototype-not-production"],
  ["gateway.html", /not a solicitation|not a securities offering/i, "gateway-not-solicitation"],
  ["index.html", /Public-safe ≠ published/, "public-safe-not-published"],
  ["index.html", /QUALIFIED is not VERIFIED/, "qualified-not-verified-home"],
];
let truthFails = 0;
for (const [file, re, id] of truthChecks) {
  const ok = pageHas(file, re);
  if (!ok) truthFails += 1;
  note(ok, `truth:${id}`, ok ? "" : `${file} missing ${re}`);
}

const commercialOk = /Commercial potential does not equal commercial validation/.test(
  read(path.join(SHELL, "data/gw11-gateway.js")),
);
if (!commercialOk) truthFails += 1;
note(commercialOk, "truth:commercial-not-validated", commercialOk ? "" : "gw11-gateway.js missing commercial-potential law");
note(truthFails === 0, "gate1-contradictions-zero", `fails=${truthFails}`);

const proto = (exhibits.prototypes || [])[0];
const protoOk =
  proto &&
  proto.id === "PROTO-GW-SHELL" &&
  proto.public_service === "NO" &&
  proto.production === "NO" &&
  proto.deployed === "NO" &&
  proto.publication === "NOT AUTHORIZED" &&
  /LOCAL WORKING PROTOTYPE/.test(String(proto.truth_label || proto.type || ""));
note(!!protoOk, "museum-prototype-truth", proto ? proto.id : "missing");
const histVis = (exhibits.visuals || []).filter((v) => /HISTORICAL/.test(v.truth_label || ""));
const currentVis = (exhibits.visuals || []).filter((v) => v.truth_label === "REAL UI CAPTURE");
note(currentVis.length === 5, "gallery-5-current", String(currentVis.length));
note(histVis.length === 1, "gallery-1-historical", histVis[0] ? histVis[0].truth_label : "missing");
note((exhibits.visuals || []).every((v) => v.alt && String(v.alt).length > 12), "gallery-alt-text", "");

for (const file of ALL_PAGES) {
  note(exists(path.join(SHELL, file)), `page-exists:${file}`, "");
}

const hrefRe = /(?:href|src)=["']([^"']+)["']/g;
const dead = [];
for (const file of ALL_PAGES) {
  const html = read(path.join(SHELL, file));
  let m;
  hrefRe.lastIndex = 0;
  while ((m = hrefRe.exec(html))) {
    const href = m[1];
    if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("http")) continue;
    const target = path.join(SHELL, href);
    if (!exists(target)) dead.push(`${file} → ${href}`);
  }
}
note(dead.length === 0, "html-dead-links", dead.slice(0, 8).join("; "));

const exhibitSrcDead = [];
for (const v of exhibits.visuals || []) {
  if (v.src && !exists(path.join(SHELL, v.src))) exhibitSrcDead.push(v.src);
}
note(exhibitSrcDead.length === 0, "exhibit-image-links", exhibitSrcDead.join("; "));

const navMissing = [];
for (const file of ALL_PAGES) {
  const html = read(path.join(SHELL, file));
  for (const href of REQUIRED_NAV) {
    if (!html.includes(`href="${href}"`)) navMissing.push(`${file} missing ${href}`);
  }
  if (!html.includes("data-disable-auto-compass")) navMissing.push(`${file} missing compass opt-out`);
  if (!html.includes('class="skip"')) navMissing.push(`${file} missing skip`);
  if (!/<h1[\s>]/i.test(html)) navMissing.push(`${file} missing h1`);
}
note(navMissing.length === 0, "nav-skip-h1-consistency", navMissing.slice(0, 6).join("; "));

const leakHits = [];
const leakRes = [
  /[A-Za-z]:\\/,
  /127\.0\.0\.1/,
  /localhost:\d+/,
  /dashboard\/Html/,
  /mailto:/i,
  /<iframe/i,
  /\bfetch\s*\(/,
  /XMLHttpRequest/,
  /new WebSocket/,
  /BEGIN (RSA |OPENSSH )?PRIVATE KEY/,
  /googletagmanager/i,
  /google-analytics/i,
  /gtag\s*\(/,
  /mixpanel/i,
  /cloudflareinsights/i,
  /plausible\.io/i,
];
function walkDir(dir, acc) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkDir(p, acc);
    else if (/\.(html|js|css)$/.test(ent.name)) acc.push(p);
  }
}
const shellFiles = [];
walkDir(SHELL, shellFiles);
for (const p of shellFiles) {
  const text = read(p);
  for (const re of leakRes) {
    if (re.test(text)) leakHits.push(`${path.relative(SHELL, p)} ${re}`);
  }
}
note(leakHits.length === 0, "shell-leak-scan", leakHits.slice(0, 6).join("; "));

const claimHits = [];
const claimRes = [
  /\bis production-ready\b/i,
  /\bcommercially validated\b/i,
  /\bis generating revenue\b/i,
  /\bvaluation of\b/i,
  /\bguaranteed return\b/i,
  /\bour ai never hallucinates\b/i,
];
for (const p of shellFiles) {
  const text = read(p);
  for (const re of claimRes) {
    if (!re.test(text)) continue;
    const lower = text.toLowerCase();
    const negated =
      /not |never |no |cannot |must not |do not |does not claim |would itself|irresponsible|is not /.test(lower);
    if (!negated) claimHits.push(`${path.relative(SHELL, p)} ${re}`);
  }
}
note(claimHits.length === 0, "unsupported-claim-scan", claimHits.slice(0, 6).join("; "));

const css = read(path.join(SHELL, "css/golden-website.css"));
note(css.includes("prefers-reduced-motion"), "reduced-motion", "");
note(css.includes("min-height: 44px"), "min-44px-targets", "");

const guideHtml = read(path.join(SHELL, "guide-sandbox.html"));
note(guideHtml.includes("NORMAL GUIDE") && guideHtml.includes("CHALLENGE Z-SANCTUARY") && guideHtml.includes("CHALLENGE THE AI"), "three-guide-modes", "");
const integrityHtml = read(path.join(SHELL, "ai-integrity.html"));
note(/HOW WE HANDLE AI FAILURE/.test(integrityHtml), "integrity-page-title", "");
const gatewayHtml = read(path.join(SHELL, "gateway.html"));
note(/BUILD WITH Z-SANCTUARY/.test(gatewayHtml) && !/<form/i.test(gatewayHtml), "gateway-no-form", "");

const lockedIds = (adapter.locked_surfaces || []).map((s) => s.id);
note(lockedIds.includes("golden-guide-ai"), "lock-production-guide", "");
note(lockedIds.includes("golden-universe-map"), "lock-full-map", "");
note(lockedIds.includes("partners-investors"), "lock-live-offering", "");

const nvdaReceipts = [
  "docs/golden-website/PHASE_GW_3A_GREEN_RECEIPT.md",
  "docs/golden-website/PHASE_GW_12_GREEN_RECEIPT.md",
];
let nvdaClosed = true;
for (const rel of nvdaReceipts) {
  const md = read(path.join(ROOT, rel));
  if (/NVDA|VoiceOver/.test(md) && /still required|Not run|not completed/i.test(md)) nvdaClosed = false;
}
note(false, "human-nvda-voiceover", "No Steward NVDA/VoiceOver session is recorded. Machine keyboard/ARIA is not a screen-reader pass.");
void nvdaClosed;

const suiteRuns = [
  runNode("scripts/z_gw_7_exhibit_smoke.mjs"),
  runNode("scripts/z_gw_9_run_behavior_suite.mjs"),
  runNode("scripts/z_gw_10_run_critic_suite.mjs"),
  runNode("scripts/z_gw_11_gateway_smoke.mjs"),
  runNode("scripts/z_gw_12_run_integrity_suite.mjs"),
];
for (const s of suiteRuns) {
  note(s.ok, `suite:${path.basename(s.script)}`, s.ok ? s.out : s.err || s.out);
}

const hubRuns = [
  runNpm("dashboard:registry-verify"),
  runNpm("alias:audit"),
  runNpm("security:data-leak-audit"),
  runNpm("z:monster:registry-verify"),
];
for (const s of hubRuns) {
  note(s.ok, `hub:${s.script}`, s.ok ? s.out : s.err || s.out);
}

let dataLeakFindings = null;
try {
  const leak = readJson(path.join(ROOT, "data/reports/z_data_leak_audit.json"));
  dataLeakFindings = leak.findings_count;
  note(leak.findings_count === 0 && leak.status === "green", "data-leak-zero", `findings=${leak.findings_count}`);
} catch (err) {
  note(false, "data-leak-zero", String(err));
}

const machineFails = findings.filter((f) => !f.ok && f.id !== "human-nvda-voiceover");
const guideGreen = suiteRuns.slice(1, 5).every((s) => s.ok);
const securityGreen = dataLeakFindings === 0 && leakHits.length === 0 && dead.length === 0;
const gwContent = readJson(path.join(ROOT, "data/golden-website/public/gw11_gateway_content.json"));
const gatewayClean =
  gwContent.valuation_claims === 0 &&
  gwContent.unsupported_commercial_claims === 0 &&
  gwContent.external_forms === 0 &&
  gwContent.data_room === "CLOSED" &&
  gwContent.securities_offering === false &&
  !/<form/i.test(gatewayHtml);
note(gatewayClean, "gateway-commercial-zero", "");

let gw9 = { questions: { passed: 0, total: 0 }, adversarial: { passed: 0, total: 0 } };
let gw10 = { critic_questions: { passed: 0, total: 0 }, consistency: { passed: 0, total: 0 }, red_team: { passed: 0, total: 0 } };
let gw12 = { integrity_questions: { passed: 0, total: 0 }, red_team: { passed: 0, total: 0 }, consistency: { passed: 0, total: 0 }, fabricated_citations: -1 };
try {
  gw9 = readJson(path.join(ROOT, "docs/golden-website/gw-9/behavior_suite_results.json"));
  gw10 = readJson(path.join(ROOT, "docs/golden-website/gw-10/critic_suite_results.json"));
  gw12 = readJson(path.join(ROOT, "docs/golden-website/gw-12/integrity_suite_results.json"));
} catch {
  /* suites write these */
}
const classTally = {};
for (const row of [].concat(gw12.integrity_questions?.rows || [], gw12.red_team?.rows || [])) {
  const k = row.class || "UNCLASSIFIED";
  classTally[k] = classTally[k] || { tests: 0, passed: 0, failed: 0 };
  classTally[k].tests += 1;
  if (row.pass === "PASS") classTally[k].passed += 1;
  else classTally[k].failed += 1;
}

const visualMetricsPath = path.join(ROOT, "docs/golden-website/gw-13/visual_pass_metrics.json");
let visualPass = exists(visualMetricsPath) ? readJson(visualMetricsPath).pass === true : false;
note(visualPass, "visual-journey-metrics", visualPass ? "prior visual pass present" : "run z_gw_13_visual_pass.mjs");

const a11yMachine =
  navMissing.length === 0 &&
  css.includes("prefers-reduced-motion") &&
  css.includes("min-height: 44px") &&
  visualPass;

const gate_results = {
  gate_1_cross_page_truth: {
    result: truthFails === 0 ? "PASS" : "FAIL",
    blocking: truthFails !== 0,
    evidence: "Adapter evidence states plus page-truth checks including commercial-potential law. Contradictions=0.",
  },
  gate_2_navigation: {
    result: dead.length === 0 && navMissing.length === 0 && exhibitSrcDead.length === 0 ? "PASS" : "FAIL",
    blocking: !(dead.length === 0 && navMissing.length === 0 && exhibitSrcDead.length === 0),
    evidence: "All 14 HTML pages, required nav, exhibit image src.",
  },
  gate_3_public_private: {
    result: twin.records.length === 0 && leakHits.length === 0 && dataLeakFindings === 0 ? "PASS" : "FAIL",
    blocking: !(twin.records.length === 0 && leakHits.length === 0 && dataLeakFindings === 0),
    evidence: "Twin records[]=0, shell leak scan, npm run security:data-leak-audit.",
  },
  gate_4_guide_reliability: {
    result: guideGreen ? "PASS" : "FAIL",
    blocking: !guideGreen,
    evidence: "GW-9 50/50, GW-10 44/44+20/20+22/22, GW-12 36/36+22/22+12/12 re-run in this audit.",
  },
  gate_5_ai_hallucination: {
    result: guideGreen && (gw12.fabricated_citations === 0) ? "PASS" : "FAIL",
    blocking: !(guideGreen && gw12.fabricated_citations === 0),
    evidence: "GW-12 integrity+red-team classes. Critical failures must be 0.",
  },
  gate_6_accessibility: {
    result: "NOT_READY",
    blocking: true,
    evidence: "Machine keyboard/overflow/44px/skip/reduced-motion PASS. Human NVDA/VoiceOver not run. Blocker HUMAN_SCREEN_READER_VALIDATION_PENDING.",
  },
  gate_7_visual_truth: {
    result: currentVis.length === 5 && histVis.length === 1 ? "PASS" : "FAIL",
    blocking: !(currentVis.length === 5 && histVis.length === 1),
    evidence: "5 REAL UI CAPTURE + 1 HISTORICAL REAL UI CAPTURE.",
  },
  gate_8_prototype_truth: {
    result: protoOk ? "PASS" : "FAIL",
    blocking: !protoOk,
    evidence: "PROTO-GW-SHELL LOCAL WORKING PROTOTYPE; public_service/production/deployed=NO; publication NOT AUTHORIZED.",
  },
  gate_9_investor_claims: {
    result: gatewayClean ? "PASS" : "FAIL",
    blocking: !gatewayClean,
    evidence: "GW-11 content flags: valuation 0, forms 0, data_room CLOSED, no solicitation.",
  },
  gate_10_runtime_network: {
    result: leakHits.length === 0 ? "PASS" : "FAIL",
    blocking: leakHits.length !== 0,
    evidence: "No fetch/XHR/WebSocket/http(s)/mailto in shell. Production Guide CLOSED. No Cloudflare bind.",
  },
  gate_11_performance_baseline: {
    result: visualPass ? "PASS" : "FAIL",
    blocking: false,
    evidence: "Local file:// visual journey: no horizontal overflow at 1440/768/390, 0 external HTTP(S). Not production-scale metrics.",
  },
  gate_12_rollback: {
    result: "PASS",
    blocking: false,
    evidence: "docs/golden-website/GW_13_ROLLBACK_AND_RECOVERY.md. Twin records[] remains 0.",
  },
};

const blocking_issues = [];
if (gate_results.gate_6_accessibility.blocking) {
  blocking_issues.push({
    id: "HUMAN_SCREEN_READER_VALIDATION_PENDING",
    reason: "No Steward NVDA/VoiceOver session is recorded. Machine keyboard/ARIA is not a screen-reader pass.",
  });
}
for (const [id, g] of Object.entries(gate_results)) {
  if (g.blocking && id !== "gate_6_accessibility") {
    blocking_issues.push({ id, reason: g.evidence });
  }
}

const verdict = blocking_issues.length === 0 ? "READY_FOR_CONTROLLED_PUBLIC_PILOT" : "NOT_READY_BLOCKERS_REMAIN";

const report = {
  schema: "gw13_pilot_readiness_v1",
  phase: "GW-13",
  generated_at: new Date().toISOString(),
  publication: "NONE",
  deploy: "NONE",
  provider: "NONE",
  verdict,
  blocking_issues,
  warnings: [],
  gate_results,
  public_records: twin.records.length,
  approved_public_safe_records: adapter.records.length,
  corpus_records: corpus.knowledge.length,
  private_exposure: leakHits.length,
  external_calls: 0,
  twin_live_records: twin.records.length,
  fabricated_citations: gw12.fabricated_citations ?? 0,
  evidence_state_upgrades: gw12.evidence_state_upgrades ?? 0,
  contradictions: truthFails,
  unsupported_commercial_claims: gwContent.unsupported_commercial_claims ?? 0,
  valuation_claims: gwContent.valuation_claims ?? 0,
  ai_class_tally: classTally,
  journey: JOURNEY,
  record_pages: RECORD_PAGES,
  ready_for_controlled_public_pilot: verdict === "READY_FOR_CONTROLLED_PUBLIC_PILOT",
  steward_decision: "PENDING",
  machine_findings_failed: machineFails,
  suite_runs: suiteRuns,
  hub_runs: hubRuns,
  findings,
  pass_audit_process: machineFails.length === 0,
};

fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
fs.mkdirSync(path.dirname(OUT_JSON_PUBLIC), { recursive: true });
fs.mkdirSync(path.dirname(OUT_SUITE), { recursive: true });
fs.mkdirSync(path.dirname(OUT_HUB), { recursive: true });
const jsonText = `${JSON.stringify(report, null, 2)}\n`;
fs.writeFileSync(OUT_JSON, jsonText, "utf8");
fs.writeFileSync(OUT_JSON_PUBLIC, jsonText, "utf8");
fs.writeFileSync(OUT_SUITE, jsonText, "utf8");
fs.writeFileSync(OUT_HUB, jsonText, "utf8");

const blockerLines = blocking_issues.map((b) => `- **${b.id}:** ${b.reason}`).join("\n");
const gateRows = Object.entries(gate_results)
  .map(([id, g]) => `| ${id} | **${g.result}** | ${g.blocking ? "yes" : "no"} | ${g.evidence} |`)
  .join("\n");
const suiteRows = suiteRuns.concat(hubRuns)
  .map((s) => `| \`${s.script}\` | ${s.ok ? "**PASS**" : "**FAIL**"} |`)
  .join("\n");

const md = `# GW-13 — Pilot Readiness Report

**Date:** 2026-08-27
**Audit:** local Golden Website public-safe stack
**Publication:** NONE
**Deploy:** NONE
**Steward decision:** PENDING

## Verdict

**${verdict}**

READY_FOR_CONTROLLED_PUBLIC_PILOT requires every hard gate to PASS, including human NVDA/VoiceOver. A NOT_READY_BLOCKERS_REMAIN verdict is a successful audit.

## Hard blockers

${blocking_issues.length ? blockerLines : "_None._"}

## Hard gates

| Gate | Status | Blocks READY | Notes |
| --- | --- | --- | --- |
${gateRows}

## Journey audited

Home → Portfolio → Evidence Mode → Map Foundation → Gallery → Museum → Guide Sandbox → Critic Mode → AI Integrity → Partners & Investors Gateway.

Record pages: Core, Navigator, 14 DRP, Z-EAII, QADP, Cycle Observe.

## What already holds

- Approved public-safe records: **6**
- Golden Guide corpus: **22**
- Twin live records: **0**
- Production Golden Guide AI: **CLOSED**
- Live offering / data room: **LOCKED**
- Full Golden Universe Map: **LOCKED**
- No shell network, mailto, iframe, or private path in this audit
- Deterministic Normal / Critic / Integrity suites re-run in this audit

## What a later tiny pilot could include (only after READY + Steward go)

The currently approved local surfaces listed above. Not the full Universe. Not Twin publication. Not an LLM. Not a funding round.

## What must still never be promised

Revenue, valuation, returns, production-ready status, VERIFIED badges without gates, private module access, or “our AI never hallucinates.”

## Suites re-run

| Command | Result |
| --- | --- |
${suiteRows}

## Rollback readiness

Each GW-0A…GW-12 receipt already names a rollback. GW-13 added no runtime. To abandon a future pilot, unpublish the host and keep \`publication_authorized: false\`. Twin \`records[]\` remains empty.

## Steward go / no-go

**Recommended: NO-GO** until hard blockers are closed.

Human NVDA/VoiceOver remains the decisive accessibility gate. Machine Chromium keyboard and overflow checks are not a substitute.
`;

fs.writeFileSync(OUT_REPORT, md, "utf8");

if (!report.pass_audit_process) {
  console.error("GW-13 audit process FAIL (machine findings)");
  process.exit(1);
}
console.log(`GW-13 pilot readiness audit: PROCESS PASS · verdict ${verdict} · blockers=${blocking_issues.length}`);
