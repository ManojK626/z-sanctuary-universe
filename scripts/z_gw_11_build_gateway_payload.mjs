#!/usr/bin/env node
/** GW-11: copy public-safe gateway content into the local shell payload. */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, "data/golden-website/public/gw11_gateway_content.json");
const QA = path.join(ROOT, "data/golden-website/public/gw11_gateway_qa.json");
const OUT_JS = path.join(ROOT, "docs/golden-website/shell/data/gw11-gateway.js");

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

const content = readJson(CONTENT);
const qa = readJson(QA);
if (content.pathways.length !== 5) throw new Error("GW-11 requires five informational pathways");
if (content.unsupported_commercial_claims !== 0) throw new Error("unsupported commercial claims must be 0");
if (content.valuation_claims !== 0) throw new Error("valuation claims must be 0");
if (content.external_forms !== 0) throw new Error("external forms must be 0");
if (content.data_room !== "CLOSED") throw new Error("data room must stay CLOSED");
if (qa.investor_qa.length < 15) throw new Error("investor Q&A too small");
if (qa.partner_qa.length < 8) throw new Error("partner Q&A too small");

const blob = JSON.stringify(content) + JSON.stringify(qa);
if (/[A-Za-z]:\\/.test(blob) || /127\.0\.0\.1/.test(blob) || /mailto:/i.test(blob)) {
  throw new Error("contact/path token in gateway payload");
}
if (/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/.test(blob)) {
  throw new Error("email address in gateway payload");
}
if (/valuation is \d|worth \$\d|\bROI of\b|\bgenerating revenue\b/i.test(blob) && !/no approved|not revenue|not publish|no public/i.test(blob)) {
  throw new Error("valuation/return invention in gateway payload");
}

const payload = {
  schema: "gw11_gateway_payload_v1",
  phase: "GW-11",
  runtime_status: "SANDBOX_LOCAL_ONLY",
  publication_authorized: false,
  content,
  qa,
};

fs.mkdirSync(path.dirname(OUT_JS), { recursive: true });
fs.writeFileSync(
  OUT_JS,
  `/* Generated GW-11 gateway content. Public-safe only. No forms. */\nwindow.GW11_GATEWAY = ${JSON.stringify(payload, null, 2)};\n`,
  "utf8",
);
process.stdout.write(
  JSON.stringify(
    {
      pathways: content.pathways.length,
      investor_qa: qa.investor_qa.length,
      partner_qa: qa.partner_qa.length,
      js: "docs/golden-website/shell/data/gw11-gateway.js",
    },
    null,
    2,
  ),
);
