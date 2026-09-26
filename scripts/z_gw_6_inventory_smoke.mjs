#!/usr/bin/env node
/** GW-6 inventory smoke: Twin empty, shortlists bounded, no shell gallery, no public Twin paths. */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const errors = [];
const twin = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw_public_knowledge_twin.json"), "utf8"));
if (!Array.isArray(twin.records) || twin.records.length !== 0) errors.push("Twin records[] must remain empty");
if (twin.publication_authorized === true) errors.push("publication_authorized must not be true");

const vis = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/gw6_visual_inventory.json"), "utf8"));
const proto = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/gw6_prototype_inventory.json"), "utf8"));
if (vis.twin_live_records !== 0 || proto.twin_live_records !== 0) errors.push("inventory twin_live_records must be 0");
if (vis.private_browser_exposure !== 0 || proto.private_browser_exposure !== 0) {
  errors.push("private_browser_exposure must be 0");
}
if (vis.assets.length !== vis.statistics.classified) errors.push("visual classified mismatch");
if (proto.prototypes.length !== proto.statistics.classified) errors.push("prototype classified mismatch");
const visFirst = vis.assets.filter((a) => a.first_exhibit);
const protoFirst = proto.prototypes.filter((p) => p.first_exhibit);
if (visFirst.length !== 6) errors.push(`visual shortlist must be 6, got ${visFirst.length}`);
if (protoFirst.length !== 4) errors.push(`prototype shortlist must be 4, got ${protoFirst.length}`);
if (visFirst.length > 6 || protoFirst.length > 4) errors.push("quota exceeded");

const ALLOWED = new Set([
  "READY_FOR_STEWARD_REVIEW",
  "NEEDS_SANITIZATION",
  "NEEDS_IDENTITY_REVIEW",
  "NEEDS_MORE_EVIDENCE",
  "KEEP_PRIVATE",
  "DO_NOT_PUBLISH",
]);
for (const a of vis.assets) {
  if (!ALLOWED.has(a.publication_recommendation)) errors.push(`bad visual rec ${a.id}`);
}
for (const p of proto.prototypes) {
  if (!ALLOWED.has(p.publication_recommendation)) errors.push(`bad proto rec ${p.id}`);
}

const shell = fs.readFileSync(path.join(ROOT, "docs/golden-website/shell/index.html"), "utf8");
if (!shell.includes("The Golden Website")) errors.push("shell home missing Golden Website identity");
const adapter = JSON.parse(fs.readFileSync(path.join(ROOT, "data/golden-website/public/gw_approved_public_safe_adapter.json"), "utf8"));
if (!Array.isArray(adapter.records) || adapter.records.length !== 6) errors.push("adapter must remain six records");

const FORBIDDEN = [/127\.0\.0\.1/i, /localhost:\d+/, /[A-Za-z]:\\/, /BEGIN (RSA |OPENSSH )?PRIVATE KEY/];
const publicPayloads = [
  "data/golden-website/public/gw_approved_public_safe_adapter.json",
  "data/golden-website/public/gw_map_foundation.json",
  "data/golden-website/public/gw_public_knowledge_twin.json",
];
for (const rel of publicPayloads) {
  const text = fs.readFileSync(path.join(ROOT, rel), "utf8");
  for (const re of FORBIDDEN) {
    if (re.test(text)) errors.push(`forbidden ${re} in public payload ${rel}`);
  }
}

const requiredDocs = [
  "docs/golden-website/GW_6_VISUAL_ASSET_INVENTORY.md",
  "docs/golden-website/GW_6_PROTOTYPE_INVENTORY.md",
  "docs/golden-website/GW_6_VISUAL_TO_PORTFOLIO_MAP.md",
  "docs/golden-website/GW_6_FIRST_EXHIBIT_SHORTLIST.md",
  "docs/golden-website/GW_6_GALLERY_AND_MUSEUM_POLICY.md",
  "docs/golden-website/PHASE_GW_6_GREEN_RECEIPT.md",
];
for (const rel of requiredDocs) {
  if (!fs.existsSync(path.join(ROOT, rel))) errors.push(`missing ${rel}`);
}

const identity = [
  ...vis.assets.filter((a) => a.identity_link === "NEEDS_IDENTITY_REVIEW" || a.publication_recommendation === "NEEDS_IDENTITY_REVIEW"),
  ...proto.prototypes.filter((p) => p.identity_link === "NEEDS_IDENTITY_REVIEW" || p.publication_recommendation === "NEEDS_IDENTITY_REVIEW"),
];
if (JSON.stringify(vis).includes("data/z_icis_3d_j_source_images") || JSON.stringify(proto).includes("data/z_icis_3d_j_source_images")) {
  errors.push("must not enumerate ICIS natural-image custody paths");
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(
  `GW-6 inventory smoke: PASS (visuals=${vis.assets.length} shortlist=${visFirst.length}; prototypes=${proto.prototypes.length} shortlist=${protoFirst.length}; identity_review_rows=${identity.length}; Twin=0)`,
);
