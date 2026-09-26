#!/usr/bin/env node
/** GW-4: shortlist shape, READY capsules present, Twin untouched, no shell leaks. */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const errors = [];
const twin = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw_public_knowledge_twin.json"), "utf8"));
if (!Array.isArray(twin.records) || twin.records.length !== 0) errors.push("Twin records[] must remain empty");
if (twin.publication_authorized === true) errors.push("Twin publication_authorized must not be true");

const sl = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/gw4_candidate_shortlist.json"), "utf8"));
const n = sl.candidates.length;
if (n < 8 || n > 12) errors.push(`shortlist must be 8–12, got ${n}`);
const allowed = new Set(sl.allowed_recommendations);
const counts = {};
for (const c of sl.candidates) {
  if (!allowed.has(c.publication_recommendation)) errors.push(`bad rec ${c.overlay_id} ${c.publication_recommendation}`);
  counts[c.publication_recommendation] = (counts[c.publication_recommendation] || 0) + 1;
  if (c.publication_recommendation === "READY_FOR_STEWARD_REVIEW") {
    if (!c.capsule) errors.push(`${c.overlay_id} READY missing capsule path`);
    else {
      const p = path.join(ROOT, c.capsule.replace(/\//g, path.sep));
      if (!fs.existsSync(p)) errors.push(`missing capsule ${c.capsule}`);
    }
  }
}
if (sl.twin_records_modified !== false) errors.push("twin_records_modified must be false");
if ((sl.already_in_local_shell || []).includes("z_sanctuary_core") === false) errors.push("must acknowledge existing Core");

const FORBIDDEN = [/127\.0\.0\.1/i, /localhost:\d+/, /[A-Za-z]:\\/, /BEGIN (RSA |OPENSSH )?PRIVATE KEY/];
function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}
for (const file of walk(path.join(ROOT, "docs/golden-website/capsules/gw4"))) {
  const text = fs.readFileSync(file, "utf8");
  for (const re of FORBIDDEN) {
    if (re.test(text)) errors.push(`forbidden ${re} in ${path.relative(ROOT, file)}`);
  }
  if (/<iframe/i.test(text)) errors.push(`iframe in ${path.relative(ROOT, file)}`);
}
const requiredDocs = [
  "docs/golden-website/GW_4_CANDIDATE_SHORTLIST.md",
  "docs/golden-website/GW_4_PORTFOLIO_INFORMATION_ARCHITECTURE.md",
  "docs/golden-website/GW_4_REUSE_MAP.md",
  "docs/golden-website/PHASE_GW_4_GREEN_RECEIPT.md",
];
for (const rel of requiredDocs) {
  if (!fs.existsSync(path.join(ROOT, rel))) errors.push(`missing ${rel}`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`GW-4 shortlist smoke: PASS (${n} candidates; READY=${counts.READY_FOR_STEWARD_REVIEW || 0}; Twin records=0)`);
