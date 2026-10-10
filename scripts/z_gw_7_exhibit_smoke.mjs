#!/usr/bin/env node
/** GW-7 gallery/museum smoke: 6 visuals, 1 prototype, Twin 0, no gated exhibits. */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SHELL = path.join(ROOT, "docs/golden-website/shell");
const errors = [];
const twin = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw_public_knowledge_twin.json"), "utf8"));
if (!Array.isArray(twin.records) || twin.records.length !== 0) errors.push("Twin records[] must remain empty");

const exhibits = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw7_exhibits.json"), "utf8"));
if (exhibits.visuals.length !== 6) errors.push(`visuals must be 6, got ${exhibits.visuals.length}`);
if (exhibits.prototypes.length !== 1) errors.push(`prototypes must be 1, got ${exhibits.prototypes.length}`);
if (exhibits.historical_capture_count !== 1) errors.push("historical must be 1");
if (exhibits.current_capture_count !== 5) errors.push("current must be 5");
if (exhibits.twin_live_records !== 0) errors.push("twin_live_records must be 0");
if (exhibits.unapproved_exhibits_exposed !== 0) errors.push("unapproved_exhibits_exposed must be 0");
if (exhibits.private_browser_exposure !== 0) errors.push("private_browser_exposure must be 0");
if (exhibits.prototypes[0].id !== "PROTO-GW-SHELL") errors.push("only local shell prototype is approved");

const hist = exhibits.visuals.find((v) => v.id === "VIS-GW-002");
if (!hist || hist.truth_label !== "HISTORICAL REAL UI CAPTURE") errors.push("VIS-GW-002 must be HISTORICAL REAL UI CAPTURE");
if (!hist.explanation.includes("earlier two-record Golden Foundation Shell")) {
  errors.push("historical exhibit missing required explanation");
}
const currentLabels = exhibits.visuals.filter((v) => v.id !== "VIS-GW-002").every((v) => v.truth_label === "REAL UI CAPTURE");
if (!currentLabels) errors.push("current visuals must be REAL UI CAPTURE");

const blob = JSON.stringify(exhibits);
if (/[A-Za-z]:\\/.test(blob) || /127\.0\.0\.1/.test(blob) || /dashboard\/Html/.test(blob)) {
  errors.push("exhibits payload contains private path/IP/operator HTML");
}
if (/Knowledge Ask|Cycle Dashboard|Ecosphere|Golden Guide AI/i.test(blob)) {
  errors.push("gated prototype names must not appear in exhibit payload");
}

const required = ["gallery.html", "museum.html", "js/golden-exhibits.js", "data/gw-exhibits.js"];
for (const rel of required) {
  if (!fs.existsSync(path.join(SHELL, rel))) errors.push(`missing ${rel}`);
}
const gallery = fs.readFileSync(path.join(SHELL, "gallery.html"), "utf8");
const museum = fs.readFileSync(path.join(SHELL, "museum.html"), "utf8");
if (!gallery.includes("data-disable-auto-compass")) errors.push("gallery must disable auto-compass");
if (!museum.includes("data-disable-auto-compass")) errors.push("museum must disable auto-compass");
if (/<iframe/i.test(gallery) || /<iframe/i.test(museum)) errors.push("iframe not allowed");
if (!museum.includes("Additional prototypes remain behind sanitization")) {
  errors.push("museum missing gated-prototype sentence");
}

const adapter = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw_approved_public_safe_adapter.json"), "utf8"));
if (adapter.records.length !== 6) errors.push("adapter must remain 6 records");
const lockedIds = (adapter.locked_surfaces || []).map((s) => s.id);
if (lockedIds.includes("visual-gallery") || lockedIds.includes("prototype-museum")) {
  errors.push("Gallery and Museum must not remain in locked_surfaces");
}
if (!lockedIds.includes("golden-guide-ai") || !lockedIds.includes("golden-universe-map")) {
  errors.push("Guide AI production runtime and Full Universe Map must stay locked");
}
const guideLock = (adapter.locked_surfaces || []).find((s) => s.id === "golden-guide-ai");
if (guideLock && /sandbox/i.test(guideLock.name) && !/production/i.test(guideLock.name)) {
  errors.push("sandbox must not replace the locked production Guide label");
}

const FORBIDDEN = [/127\.0\.0\.1/i, /localhost:\d+/, /[A-Za-z]:\\/, /BEGIN (RSA |OPENSSH )?PRIVATE KEY/];
for (const rel of ["gallery.html", "museum.html", "js/golden-exhibits.js", "data/gw-exhibits.js"]) {
  const text = fs.readFileSync(path.join(SHELL, rel), "utf8");
  for (const re of FORBIDDEN) {
    if (re.test(text)) errors.push(`forbidden ${re} in ${rel}`);
  }
}

const css = fs.readFileSync(path.join(SHELL, "css/golden-website.css"), "utf8");
if (!css.includes("prefers-reduced-motion")) errors.push("missing reduced-motion CSS");
if (!css.includes("gallery-card--historical")) errors.push("missing historical gallery style");

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("GW-7 exhibit smoke: PASS (6 visuals, 1 prototype, Twin 0, gated names absent)");
