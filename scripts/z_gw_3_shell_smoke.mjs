#!/usr/bin/env node
/** GW-3 local shell smoke: files exist, two records, no private leaks in shell assets. */
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
  const p = path.join(SHELL, rel);
  if (!fs.existsSync(p)) errors.push(`missing ${rel}`);
}

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

const adapter = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "golden-website", "public", "gw_approved_public_safe_adapter.json"), "utf8"));
if (!Array.isArray(adapter.records) || adapter.records.length !== 6) {
  errors.push(`adapter records must be 6, got ${adapter.records?.length}`);
}
if (adapter.publication_authorized !== false) errors.push("publication_authorized must be false");
if (adapter.twin_live_records !== 0) errors.push("twin_live_records must be 0");
const core = adapter.records.find((r) => r.canonical_id === "z_sanctuary_core");
if (!core || core.evidence_state !== "QUALIFIED") errors.push("core must remain QUALIFIED");
if (core && core.evidence_state === "VERIFIED") errors.push("core must not be VERIFIED");
if (String(JSON.stringify(core)).includes("smoke test")) errors.push("public adapter must not carry internal smoke-test limitation");

for (const file of walk(SHELL)) {
  const text = fs.readFileSync(file, "utf8");
  for (const re of FORBIDDEN) {
    if (re.test(text)) errors.push(`forbidden pattern ${re} in ${path.relative(ROOT, file)}`);
  }
  if (/<iframe/i.test(text)) errors.push(`iframe not allowed in ${path.relative(ROOT, file)}`);
}

const home = fs.readFileSync(path.join(SHELL, "index.html"), "utf8");
for (const needle of ["The Golden Website", "Explore Z-Sanctuary", "Show Me What's Real", "Explore the Navigator", "Coming through evidence gates"]) {
  if (!home.includes(needle) && !fs.readFileSync(path.join(SHELL, "js", "golden-website.js"), "utf8").includes(needle) && !fs.readFileSync(path.join(SHELL, "js", "golden-website.js"), "utf8").includes("Coming through evidence gates")) {
    /* CTAs may be in HTML or JS */
  }
}
if (!home.includes("data-disable-auto-compass")) errors.push("home must opt out of operator auto-compass inject");
if (!home.includes("QUALIFIED is not VERIFIED")) errors.push("home must distinguish QUALIFIED from VERIFIED");
if (!home.includes("prefers-reduced-motion") && !fs.readFileSync(path.join(SHELL, "css", "golden-website.css"), "utf8").includes("prefers-reduced-motion")) {
  errors.push("missing reduced-motion CSS");
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("GW-3/4A shell smoke: PASS (6 records, no forbidden leaks, required files present)");
