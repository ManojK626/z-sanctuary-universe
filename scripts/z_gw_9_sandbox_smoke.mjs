#!/usr/bin/env node
/** GW-9 sandbox smoke: 22 corpus records, Twin 0, no provider, locked production Guide, sandbox page present. */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const errors = [];
const twin = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw_public_knowledge_twin.json"), "utf8"));
if (!Array.isArray(twin.records) || twin.records.length !== 0) errors.push("Twin records[] must remain empty");

const corpus = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw8_approved_knowledge_corpus.json"), "utf8"));
if (!Array.isArray(corpus.knowledge) || corpus.knowledge.length !== 22) errors.push(`corpus must be 22, got ${corpus.knowledge && corpus.knowledge.length}`);
if (corpus.private_data_included !== 0) errors.push("private_data_included must be 0");
if (corpus.unauthorized_subjects_included !== 0) errors.push("unauthorized_subjects_included must be 0");

const SHELL = path.join(ROOT, "docs/golden-website/shell");
const required = [
  "guide-sandbox.html",
  "js/golden-guide-engine.js",
  "js/golden-guide-sandbox.js",
  "data/gw9-guide-sandbox.js",
];
for (const rel of required) {
  if (!fs.existsSync(path.join(SHELL, rel))) errors.push(`missing ${rel}`);
}

const html = fs.readFileSync(path.join(SHELL, "guide-sandbox.html"), "utf8");
if (!html.includes("data-disable-auto-compass")) errors.push("sandbox must disable auto-compass");
if (!html.includes("GOLDEN GUIDE AI — SANDBOX") && !html.includes("GOLDEN GUIDE AI &mdash; SANDBOX")) {
  errors.push("sandbox title lock missing");
}
if (!html.includes("ASK Z-SANCTUARY")) errors.push("CTA ASK Z-SANCTUARY missing");
if (!html.includes("LOCAL EVIDENCE-GROUNDED PREVIEW")) errors.push("local preview label missing");
if (!html.includes("NO PRIVATE SANCTUARY ACCESS")) errors.push("no-private label missing");
if (!html.includes("NO EXECUTION AUTHORITY")) errors.push("no-execution label missing");
if (!html.includes("NO EXTERNAL AI PROVIDER")) errors.push("no-provider label missing");
if (!html.includes("LOCAL PREVIEW")) errors.push("LOCAL PREVIEW missing");
if (!html.includes("Golden Guide AI ≠ Zuno") && !html.includes("Golden Guide AI is not Zuno")) {
  errors.push("identity law missing on sandbox page");
}
if (/<iframe/i.test(html)) errors.push("iframe not allowed");
if (/openai|anthropic|embeddings|vector/i.test(html)) errors.push("provider/embedding mention in sandbox html");

const adapter = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw_approved_public_safe_adapter.json"), "utf8"));
const locked = adapter.locked_surfaces || [];
const lockedIds = locked.map((s) => s.id);
if (!lockedIds.includes("golden-universe-map")) errors.push("Full Golden Universe Map must stay locked");
const guideLock = locked.find((s) => s.id === "golden-guide-ai");
if (!guideLock) errors.push("production Golden Guide AI id must remain in locked_surfaces");
if (!/production/i.test(guideLock.name)) errors.push("locked Guide label must remain production runtime");
if (/sandbox/i.test(guideLock.name)) errors.push("sandbox must not be the locked production label");

const index = fs.readFileSync(path.join(SHELL, "index.html"), "utf8");
if (!index.includes("guide-sandbox.html")) errors.push("home must link the sandbox");
if (!html.includes('aria-live')) errors.push("sandbox must announce responses");

const payload = fs.readFileSync(path.join(SHELL, "data/gw9-guide-sandbox.js"), "utf8");
if (!payload.includes('"knowledge_id": "K-CORE-PURPOSE"')) errors.push("payload missing approved corpus");
if (/[A-Za-z]:\\/.test(payload) || /127\.0\.0\.1/.test(payload)) errors.push("private path/IP in sandbox payload");
if (/dashboard\/Html/.test(payload)) errors.push("operator HTML in sandbox payload");

const engine = fs.readFileSync(path.join(SHELL, "js/golden-guide-engine.js"), "utf8");
if (/\bfetch\s*\(|XMLHttpRequest|new WebSocket/.test(engine)) {
  errors.push("engine must not include network/provider calls");
}
if (/\bopenai\s*\(|anthropic\s*\(|new Embedding/.test(engine)) {
  errors.push("engine must not construct provider clients");
}

const FORBIDDEN = [/127\.0\.0\.1/i, /localhost:\d+/, /[A-Za-z]:\\/, /BEGIN (RSA |OPENSSH )?PRIVATE KEY/];
for (const rel of required) {
  const text = fs.readFileSync(path.join(SHELL, rel), "utf8");
  for (const re of FORBIDDEN) {
    if (re.test(text)) errors.push(`forbidden ${re} in ${rel}`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("GW-9 sandbox smoke: PASS (22 records, Twin 0, production runtime locked, sandbox labelled LOCAL PREVIEW)");
