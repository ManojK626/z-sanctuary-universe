#!/usr/bin/env node
/** GW-5 map foundation smoke: six nodes, five edges, Twin 0, no private leaks. */
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
const ALLOWED_IDS = [
  "z_sanctuary_core",
  "univ_workstation_navigator",
  "fourteen_drp_protocols",
  "z_eaii",
  "grounded_questions_qadp",
  "cycle_observe",
];
const errors = [];

const required = [
  "universe-map.html",
  "js/golden-universe-map.js",
  "data/gw-map-foundation.js",
];
for (const rel of required) {
  if (!fs.existsSync(path.join(SHELL, rel))) errors.push(`missing ${rel}`);
}

const twin = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw_public_knowledge_twin.json"), "utf8"));
if (!Array.isArray(twin.records) || twin.records.length !== 0) errors.push("Twin records[] must remain empty");

const map = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw_map_foundation.json"), "utf8"));
if (map.node_count !== 6 || map.nodes.length !== 6) errors.push(`node count must be 6, got ${map.nodes?.length}`);
if (!Array.isArray(map.edges) || map.edges.length !== 5) errors.push(`relationship count must be 5, got ${map.edges?.length}`);
if (map.private_nodes_loaded !== 0) errors.push("private_nodes_loaded must be 0");
if (map.unapproved_nodes_exposed !== 0) errors.push("unapproved_nodes_exposed must be 0");
if (map.twin_live_records !== 0) errors.push("twin_live_records must be 0");
if (map.publication_authorized !== false) errors.push("publication_authorized must be false");
const ids = map.nodes.map((n) => n.id);
if (ids.length !== new Set(ids).size) errors.push("duplicate map nodes");
for (const id of ids) {
  if (!ALLOWED_IDS.includes(id)) errors.push(`unapproved node ${id}`);
}
for (const id of ALLOWED_IDS) {
  if (!ids.includes(id)) errors.push(`missing node ${id}`);
}
const core = map.nodes.find((n) => n.id === "z_sanctuary_core");
if (!core || core.evidence_state !== "QUALIFIED") errors.push("core must remain QUALIFIED");
if (map.nodes.some((n) => n.evidence_state === "VERIFIED")) errors.push("no node may be VERIFIED in this foundation");
if (JSON.stringify(map).includes("ZS-FORMULA") || JSON.stringify(map).includes("overlay_id")) {
  errors.push("map must not carry overlay catalog ids");
}
const mapJs = fs.readFileSync(path.join(SHELL, "js/golden-universe-map.js"), "utf8");
if (/\bfetch\s*\(/.test(mapJs)) errors.push("map runtime must not fetch");

const html = fs.readFileSync(path.join(SHELL, "universe-map.html"), "utf8");
if (!html.includes("Foundation Preview — six approved public-safe capabilities only.")) {
  errors.push("map page missing foundation preview line");
}
if (!html.includes("This is not the complete Z-Sanctuary Universe.")) {
  errors.push("map page missing incomplete-universe line");
}
if (!html.includes("data-disable-auto-compass")) errors.push("map page must opt out of operator auto-compass inject");
if (!html.includes("QUALIFIED is not VERIFIED")) errors.push("map page must distinguish QUALIFIED from VERIFIED");

const css = fs.readFileSync(path.join(SHELL, "css/golden-website.css"), "utf8");
if (!css.includes("prefers-reduced-motion")) errors.push("missing reduced-motion CSS");

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

for (const file of [
  path.join(ROOT, "data/golden-website/public/gw_map_foundation.json"),
  ...walk(SHELL),
]) {
  const text = fs.readFileSync(file, "utf8");
  for (const re of FORBIDDEN) {
    if (re.test(text)) errors.push(`forbidden pattern ${re} in ${path.relative(ROOT, file)}`);
  }
  if (file.endsWith(".html") && /<iframe/i.test(text)) {
    errors.push(`iframe not allowed in ${path.relative(ROOT, file)}`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("GW-5 map smoke: PASS (6 nodes, 5 relationships, Twin 0, private 0)");
