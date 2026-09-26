#!/usr/bin/env node
/** GW-4A local shell smoke: six records, no private leaks, required pages. */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SHELL = path.join(ROOT, "docs", "golden-website", "shell");
const FORBIDDEN = [
  /127\.0\.0\.1/i,
  /localhost:\d+/i,
  /[A-Za-z]:\\/,
  /dashboard\/Html\//i,
  /BEGIN (RSA |OPENSSH )?PRIVATE KEY/,
  /\bsk-[A-Za-z0-9]{20,}/,
];
const required = [
  "index.html",
  "portfolio.html",
  "core.html",
  "navigator.html",
  "drp.html",
  "eaii.html",
  "qadp.html",
  "observe.html",
  "css/golden-website.css",
  "js/golden-website.js",
  "data/gw-approved-public-safe.js",
];
const errors = [];
for (const rel of required) {
  if (!fs.existsSync(path.join(SHELL, rel))) errors.push(`missing ${rel}`);
}

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

const twin = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw_public_knowledge_twin.json"), "utf8"));
if (!Array.isArray(twin.records) || twin.records.length !== 0) errors.push("Twin records[] must remain empty");

const adapter = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw_approved_public_safe_adapter.json"), "utf8"));
if (!Array.isArray(adapter.records) || adapter.records.length !== 6) {
  errors.push(`adapter records must be 6, got ${adapter.records?.length}`);
}
if (adapter.publication_authorized !== false) errors.push("publication_authorized must be false");
if (adapter.twin_live_records !== 0) errors.push("twin_live_records must be 0");
const ids = new Set(adapter.records.map((r) => r.canonical_id));
for (const id of ["z_sanctuary_core", "univ_workstation_navigator", "fourteen_drp_protocols", "z_eaii", "grounded_questions_qadp", "cycle_observe"]) {
  if (!ids.has(id)) errors.push(`missing adapter id ${id}`);
}
const core = adapter.records.find((r) => r.canonical_id === "z_sanctuary_core");
if (!core || core.evidence_state !== "QUALIFIED") errors.push("core must remain QUALIFIED");
const qadp = adapter.records.find((r) => r.canonical_id === "grounded_questions_qadp");
if (!qadp || !qadp.not_claimed.some((x) => /QADP is not Golden Guide AI/i.test(x))) {
  errors.push("QADP must explicitly not be Golden Guide AI");
}
if (String(JSON.stringify(adapter)).includes("smoke test")) errors.push("adapter must not carry internal smoke-test limitation");

for (const file of walk(SHELL)) {
  const text = fs.readFileSync(file, "utf8");
  for (const re of FORBIDDEN) {
    if (re.test(text)) errors.push(`forbidden pattern ${re} in ${path.relative(ROOT, file)}`);
  }
  if (/<iframe/i.test(text)) errors.push(`iframe not allowed in ${path.relative(ROOT, file)}`);
}

const home = fs.readFileSync(path.join(SHELL, "index.html"), "utf8");
if (!home.includes("data-disable-auto-compass")) errors.push("home must opt out of operator auto-compass inject");
if (!home.includes("QUALIFIED is not VERIFIED")) errors.push("home must distinguish QUALIFIED from VERIFIED");
if (!home.includes("public-safety review")) errors.push("home missing portfolio disclaimer");
const qadpHtml = fs.readFileSync(path.join(SHELL, "qadp.html"), "utf8");
if (!qadpHtml.includes("QADP ≠ Golden Guide AI") && !qadpHtml.includes("QADP is not Golden Guide AI")) {
  errors.push("qadp page must state QADP ≠ Golden Guide AI");
}
const css = fs.readFileSync(path.join(SHELL, "css/golden-website.css"), "utf8");
if (!css.includes("prefers-reduced-motion")) errors.push("missing reduced-motion CSS");

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("GW-4A shell smoke: PASS (6 records, Twin 0, no forbidden leaks)");
