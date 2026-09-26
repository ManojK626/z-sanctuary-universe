#!/usr/bin/env node
/**
 * GW-3: build public-safe UI adapter from approved capsules only.
 * Does not fill Twin records[]. Does not copy internal paths.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORE = path.join(ROOT, "data", "golden-website", "capsules", "gw_capsule_z_sanctuary_core.json");
const NAV = path.join(ROOT, "data", "golden-website", "capsules", "gw_capsule_univ_workstation_navigator.json");
const OUT_JSON = path.join(ROOT, "data", "golden-website", "public", "gw_approved_public_safe_adapter.json");
const OUT_JS = path.join(ROOT, "docs", "golden-website", "shell", "data", "gw-approved-public-safe.js");

const APPROVED_CORE_DESCRIPTION =
  "Z-Sanctuary is a governed multi-project AI development ecosystem with implemented and verified components, while many broader capabilities remain under controlled development.";

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function publicSafeText(s) {
  return String(s || "")
    .replace(/https?:\/\/127\.[^\s]+/gi, "")
    .replace(/https?:\/\/localhost[^\s]*/gi, "")
    .replace(/[A-Za-z]:\\[^\s]+/g, "")
    .replace(/dashboard\/Html\/[^\s]+/gi, "")
    .trim();
}

function stripInternalLimitations(lines) {
  return (lines || [])
    .map(publicSafeText)
    .filter((line) => line && !/smoke test/i.test(line));
}

const core = readJson(CORE);
const nav = readJson(NAV);

const adapter = {
  schema: "gw_approved_public_safe_adapter_v1",
  phase: "GW-3",
  sourced_from: "approved public-safe capsules (not Twin records, not private registries)",
  publication_authorized: false,
  twin_live_records: 0,
  local_shell_only: true,
  site: {
    name: "The Golden Website",
    subtitle: "Gateway to the Z-Sanctuary Universe",
    ecosystem: "Z-Sanctuary Universe",
    opening_line: "A governed multi-project AI development ecosystem.",
  },
  evidence_vocabulary: [
    {
      id: "VERIFIED",
      meaning: "Public-facing independent verification of a Golden Website claim.",
    },
    {
      id: "SEALED",
      meaning: "A named sanctuary slice receipt exists. Sealed is not deployed.",
    },
    {
      id: "QUALIFIED",
      meaning: "Present and supported internally. Not proven, not production-ready, not commercially validated.",
    },
    {
      id: "CONCEPT",
      meaning: "Vision or planned work. Must stay visibly concept.",
    },
    {
      id: "HOLD",
      meaning: "Held. Not offered as a public capability.",
    },
    {
      id: "CLOSED",
      meaning: "Closed. Not an active public capability.",
    },
  ],
  evidence_vocabulary_note:
    "Evidence classification describes current support for a capability. It is not a quality badge, commercial rating, or deployment status.",
  locked_surfaces: [
    { id: "golden-universe-map", name: "Golden Universe Map" },
    { id: "visual-gallery", name: "Visual Gallery" },
    { id: "prototype-museum", name: "Prototype Museum" },
    { id: "golden-guide-ai", name: "Golden Guide AI" },
    { id: "portfolio-atlas", name: "Portfolio Atlas" },
    { id: "evidence-atlas", name: "Evidence Atlas" },
    { id: "human-planet-impact", name: "Human & Planet Impact" },
    { id: "business-industry", name: "Business & Industry" },
    { id: "partners-investors", name: "Partners & Investors" },
  ],
  locked_label: "Coming through evidence gates",
  records: [
    {
      canonical_id: "z_sanctuary_core",
      public_name: "Z-Sanctuary Core",
      page: "core.html",
      journey: "What is Z-Sanctuary?",
      approved_public_description: APPROVED_CORE_DESCRIPTION,
      evidence_state: "QUALIFIED",
      public_evidence_gate: "PASS",
      prototype_class: null,
      public_production: false,
      classification: "APPROVED_PUBLIC_SAFE",
      publication: "NOT_YET_AUTHORIZED",
      what_exists: stripInternalLimitations(core.demonstrably_working),
      not_claimed: stripInternalLimitations(core.non_public_or_unproven),
      governance_summary:
        "Human-gated and evidence-first: observe, verify, suggest, then a human decides. Readiness is not deploy. Turtle Mode treats builders as guarded workers, not autopilot.",
      evidence_refs: (core.public_safe_evidence_references || []).map((r) => ({
        title: publicSafeText(r.title),
        supports: publicSafeText(r.supports),
        does_not_support: publicSafeText(r.does_not_support),
      })),
      development_posture: publicSafeText(core.implementation_state_public_wording),
    },
    {
      canonical_id: "univ_workstation_navigator",
      public_name: "Universal Workstation Navigator",
      page: "navigator.html",
      journey: "How do I explore it?",
      approved_public_description: publicSafeText(nav.simple_purpose),
      evidence_state: "SEALED",
      public_evidence_gate: "PASS",
      prototype_class: "WORKING",
      public_production: false,
      classification: "APPROVED_PUBLIC_SAFE",
      publication: "NOT_YET_AUTHORIZED",
      not_golden_universe_map: true,
      no_execution_authority: true,
      what_exists: stripInternalLimitations(nav.demonstrably_working),
      not_claimed: stripInternalLimitations(nav.non_public_or_unproven),
      evidence_refs: (nav.public_safe_evidence_references || []).map((r) => ({
        title: publicSafeText(r.title),
        supports: publicSafeText(r.supports),
        does_not_support: publicSafeText(r.does_not_support),
      })),
      development_posture: publicSafeText(nav.implementation_state_public_wording),
    },
  ],
};

if (adapter.records.length !== 2) {
  throw new Error("GW-3 adapter must contain exactly two approved records.");
}

fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
fs.mkdirSync(path.dirname(OUT_JS), { recursive: true });
fs.writeFileSync(OUT_JSON, `${JSON.stringify(adapter, null, 2)}\n`, "utf8");
fs.writeFileSync(
  OUT_JS,
  `/* Generated from approved capsules. Do not edit claims by hand. */\nwindow.GW_APPROVED = ${JSON.stringify(adapter, null, 2)};\n`,
  "utf8",
);
process.stdout.write(JSON.stringify({ records: adapter.records.length, json: path.relative(ROOT, OUT_JSON).split(path.sep).join("/") }, null, 2));
