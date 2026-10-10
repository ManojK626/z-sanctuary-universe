#!/usr/bin/env node
/** GW-11 gateway smoke: local informational page, no forms, Twin 0, Guide can route here. */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const errors = [];
const twin = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw_public_knowledge_twin.json"), "utf8"));
if (!Array.isArray(twin.records) || twin.records.length !== 0) errors.push("Twin records[] must remain empty");

const content = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw11_gateway_content.json"), "utf8"));
const qa = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw11_gateway_qa.json"), "utf8"));
if (content.pathways.length !== 5) errors.push("must have 5 pathways");
if (qa.investor_qa.length < 15) errors.push("investor Q&A count");
if (qa.partner_qa.length < 8) errors.push("partner Q&A count");
if (content.unsupported_commercial_claims !== 0) errors.push("unsupported commercial claims must be 0");
if (content.valuation_claims !== 0) errors.push("valuation claims must be 0");
if (content.external_forms !== 0) errors.push("external forms must be 0");
if (content.data_room !== "CLOSED") errors.push("data room must stay CLOSED");
if (!(content.what_still_needs_proving || []).some((x) => /screenshot is not backend proof/i.test(x))) {
  errors.push("proving list must keep screenshot ≠ backend proof");
}

const SHELL = path.join(ROOT, "docs/golden-website/shell");
for (const rel of ["gateway.html", "js/golden-gateway.js", "data/gw11-gateway.js"]) {
  if (!fs.existsSync(path.join(SHELL, rel))) errors.push(`missing ${rel}`);
}
const html = fs.readFileSync(path.join(SHELL, "gateway.html"), "utf8");
if (!html.includes("BUILD WITH Z-SANCTUARY")) errors.push("missing title");
if (!html.includes("What still needs proving")) errors.push("missing proving heading");
if (!html.includes("data-disable-auto-compass")) errors.push("must disable auto-compass");
if (/<form|<iframe|mailto:|type="email"/i.test(html)) errors.push("forms/email/iframe not allowed");
if (!fs.readFileSync(path.join(SHELL, "index.html"), "utf8").includes("gateway.html")) errors.push("home must link Gateway");

const routing = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw9_surface_routing.json"), "utf8"));
const commercial = routing.subjects.find((s) => s.subject_id === "commercial_status");
if (!commercial || !commercial.routes.includes("gateway.html")) errors.push("Guide commercial routes must include gateway.html");
if (!(routing.intents && routing.intents.gateway_question || []).includes("gateway.html")) {
  errors.push("gateway_question intent missing");
}

const adapter = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw_approved_public_safe_adapter.json"), "utf8"));
const locked = (adapter.locked_surfaces || []).find((s) => s.id === "partners-investors");
if (!locked || !/data room|offering/i.test(locked.name)) errors.push("live offering/data room must remain locked");

const payload = fs.readFileSync(path.join(SHELL, "data/gw11-gateway.js"), "utf8");
if (/[A-Za-z]:\\/.test(payload) || /127\.0\.0\.1/.test(payload) || /dashboard\/Html/.test(payload)) {
  errors.push("private path in gateway payload");
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`GW-11 gateway smoke: PASS (pathways=5, investor_qa=${qa.investor_qa.length}, partner_qa=${qa.partner_qa.length}, Twin=0)`);
