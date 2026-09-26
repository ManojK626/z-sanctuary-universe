#!/usr/bin/env node
/**
 * GW-0A one-shot overlay builder.
 * Does not replace existing registries. Does not add an npm verify gate.
 * Writes data/golden-website/gw_portfolio_registry.json from canonical sources.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "data", "golden-website", "gw_portfolio_registry.json");

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
}

function walk(dir, acc = [], n = 0) {
  if (n > 8) return acc;
  let ents;
  try {
    ents = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const e of ents) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (["node_modules", ".git", ".venv-icis-bioclip2", ".pytest_cache"].includes(e.name)) continue;
      walk(p, acc, n + 1);
    } else acc.push(p);
  }
  return acc;
}

function rel(abs) {
  return path.relative(ROOT, abs).split(path.sep).join("/");
}

function rec(partial) {
  return {
    canonical_id: partial.canonical_id,
    id_status: partial.id_status || "CANONICAL",
    name: partial.name,
    type: partial.type,
    parent_organism_project: partial.parent_organism_project || "z-sanctuary-universe",
    purpose: partial.purpose || "",
    evidence_state: partial.evidence_state,
    implementation_state: partial.implementation_state || "UNDECLARED",
    source_of_truth: partial.source_of_truth || [],
    receipts_tests: partial.receipts_tests || [],
    html_prototypes: partial.html_prototypes || [],
    visual_mockups: partial.visual_mockups || [],
    related_ai: partial.related_ai || [],
    related_engines: partial.related_engines || [],
    dependencies: partial.dependencies || [],
    ethical_public_benefit_role: partial.ethical_public_benefit_role || "Internal sanctuary capability; public-benefit claim not validated for Golden Website.",
    economic_role: partial.economic_role || ["ENABLER"],
    customer_beneficiary: partial.customer_beneficiary || "AMK-Goku / hub operators (internal)",
    revenue_pathway: partial.revenue_pathway || "None claimed. Overlay only.",
    commercial_status: partial.commercial_status || "POTENTIAL_NOT_VALIDATED",
    public_exposure_class: partial.public_exposure_class || "PRIVATE",
    security_class: partial.security_class || "INTERNAL",
    human_validation_needed: partial.human_validation_needed !== false,
    golden_website_surfaces: partial.golden_website_surfaces || [],
    next_evidence_gate: partial.next_evidence_gate || "Steward review before any Golden Website surface mapping (GW-1).",
    ...(partial.prototype_class ? { prototype_class: partial.prototype_class } : {}),
    notes: partial.notes || "",
  };
}

function evidenceFromModuleStatus(status) {
  if (status === "safety_hold") return "HOLD";
  if (status === "decision_required") return "HOLD";
  if (status === "implemented" || status === "partial") return "QUALIFIED";
  return "CONCEPT";
}

function implFromModuleStatus(status) {
  if (status === "implemented") return "IMPLEMENTED_HUB";
  if (status === "partial") return "PARTIAL";
  if (status === "safety_hold") return "SAFETY_HOLD";
  if (status === "doctrine_only") return "DOCTRINE";
  if (status === "decision_required") return "DECISION_REQUIRED";
  return "PLANNED_STUB";
}

function evidenceFromProject(p) {
  if (p.migration_status === "path_missing" || p.hosting === "missing") return "HOLD";
  if (p.role === "external") return "CONCEPT";
  return "QUALIFIED";
}

function exposureFromProject(p) {
  if (p.dashboard_url && String(p.dashboard_url).includes("127.0.0.1")) return "DO_NOT_PUBLISH";
  if (p.role === "external" || p.hosting === "missing") return "PRIVATE";
  return "PRIVATE";
}

function monsterEvidence(entry) {
  if (entry.id === "bee_vision") return "CLOSED";
  if (["one_penny_engine", "give_and_receive", "money_pathway_cores", "z_passport", "panic_mode", "heart_and_genes"].includes(entry.id)) {
    return "HOLD";
  }
  if (entry.representation === "code" || entry.representation === "ui" || entry.representation === "mixed") return "QUALIFIED";
  return "CONCEPT";
}

function monsterEconomic(entry) {
  if (["one_penny_engine", "give_and_receive", "money_pathway_cores"].includes(entry.id)) {
    return ["RESEARCH_IP", "EXPERIMENTAL"];
  }
  if (["z_pee_planetary_ethics", "ggaesp_360", "recovery_angels", "aftercare"].includes(entry.id)) {
    return ["PUBLIC_BENEFIT", "ENABLER"];
  }
  if (entry.family === "economics") return ["RESEARCH_IP"];
  return ["ENABLER", "EXPERIMENTAL"];
}

function monsterExposure(entry) {
  if (entry.id === "bee_vision") return "DO_NOT_PUBLISH";
  if (["tmk_goku_codex", "heart_and_genes", "z_passport", "money_pathway_cores"].includes(entry.id)) {
    return "DO_NOT_PUBLISH";
  }
  if (["one_penny_engine", "give_and_receive"].includes(entry.id)) return "QUALIFIED_DATA_ROOM";
  return "PRIVATE";
}

function protoClassFromMdg(tile) {
  if (["hodp-skk-rkpk", "ssws-morning-cockpit", "eaii-knowledge-ask", "mdgev-self"].includes(tile.id)) return "WORKING";
  if (["z-qa-rp", "z-ai-ecosphere", "z-bridge-task006", "html-links-hub"].includes(tile.id)) return "PARTIAL";
  if (tile.id === "radio-garden") return "PARTIAL";
  return "PARTIAL";
}

const files = walk(ROOT);
const htmlDash = files.filter((f) => f.endsWith(".html")).map(rel).filter((r) => r.startsWith("dashboard/") || r.startsWith("docs/public/"));
const receipts = files.filter((f) => /PHASE_.*RECEIPT/i.test(f) || /GREEN_RECEIPT/i.test(f)).map(rel);
const imgs = files
  .filter((f) => /\.(png|jpg|jpeg|webp|gif|svg)$/i.test(f))
  .map(rel)
  .filter((r) => r.startsWith("docs/") || r.startsWith("dashboard/") || r.startsWith("data/"));

const pc = readJson("data/z_pc_root_projects.json");
const monster = readJson("data/z_sanctuary_monster_project_registry.json");
const mods = readJson("data/z_master_module_registry.json");
const engines = readJson("data/z_core_engines_registry.json");
const mdg = readJson("data/z_mdg_dashboard_registry.json");
const catalog = readJson("dashboard/data/z_universe_service_catalog.json");

const records = [];
const seen = new Set();

function add(partial) {
  if (seen.has(partial.canonical_id)) return;
  seen.add(partial.canonical_id);
  records.push(rec(partial));
}

add({
  canonical_id: "ZS-PROJECT-000",
  id_status: "TEMPORARY_PENDING_CANONICAL_REVIEW",
  name: "Z-Sanctuary Golden Website (future public knowledge twin)",
  type: "PROJECT",
  parent_organism_project: "z-sanctuary-universe",
  purpose: "Future public presentation layer. GW-0A is reconciliation only; no UI, deploy, or runtime.",
  evidence_state: "CONCEPT",
  implementation_state: "NOT_STARTED_PUBLIC_UI",
  source_of_truth: [
    "docs/golden-website/GW_0A_CANONICAL_PORTFOLIO_RECONCILIATION.md",
    "data/golden-website/gw_portfolio_registry.json",
  ],
  receipts_tests: ["docs/golden-website/PHASE_GW_0A_GREEN_RECEIPT.md"],
  ethical_public_benefit_role: "Intended public-benefit explanation of sanctuary work after sanitization. Not live.",
  economic_role: ["PLATFORM_REVENUE", "PUBLIC_BENEFIT", "EXPERIMENTAL"],
  customer_beneficiary: "Future public visitors, partners, and beneficiaries — not yet validated",
  revenue_pathway: "None. Commercial pathways remain POTENTIAL_NOT_VALIDATED.",
  public_exposure_class: "PRIVATE",
  next_evidence_gate: "Steward approval required before GW-1 Public Knowledge Twin foundation.",
  notes: "Placeholder organism for the Golden Website. Do not treat as launched.",
});

for (const p of pc.projects) {
  add({
    canonical_id: p.id,
    id_status: "CANONICAL",
    name: p.name,
    type: "PROJECT",
    parent_organism_project: p.role === "hub" ? "z-sanctuary-universe" : "z-sanctuary-universe",
    purpose: `PC-root registry project. Role: ${p.role}. ${p.notes || ""}`.trim(),
    evidence_state: evidenceFromProject(p),
    implementation_state: p.migration_status || p.role || "registered",
    source_of_truth: ["data/z_pc_root_projects.json"],
    related_engines: p.role === "hub" ? ["z_sanctuary_core"] : [],
    economic_role: p.id === "z-worksphere-marketplace-hub" ? ["MARKETPLACE", "EXPERIMENTAL"] : ["ENABLER"],
    public_exposure_class: exposureFromProject(p),
    security_class: p.id === "amk-goku-vaults" ? "VAULT" : "INTERNAL",
    next_evidence_gate: "Do not publish sibling paths or local dashboard URLs. Steward maps which projects may appear on the Knowledge Twin.",
    notes: p.dashboard_url && String(p.dashboard_url).includes("127.0.0.1")
      ? "Local dashboard URL present in PC-root registry; omitted from Golden Website overlay."
      : p.notes || "",
  });
}

for (const retired of pc.retired_projects || []) {
  add({
    canonical_id: retired.id,
    id_status: "CANONICAL",
    name: retired.name,
    type: "PROJECT",
    purpose: `Retired alias. Successor: ${retired.successor_path || "unknown"}.`,
    evidence_state: "CLOSED",
    implementation_state: "RETIRED",
    source_of_truth: ["data/z_pc_root_projects.json"],
    economic_role: ["ENABLER"],
    commercial_status: "NOT_COMMERCIAL",
    public_exposure_class: "DO_NOT_PUBLISH",
    next_evidence_gate: "Keep as archive alias only. Do not revive the stub name on the public site.",
    notes: retired.notes || "",
  });
}

for (const e of engines.engines) {
  add({
    canonical_id: e.id,
    id_status: "CANONICAL",
    name: e.name,
    type: "ENGINE",
    purpose: e.role,
    evidence_state: e.status === "active_or_partial" ? "QUALIFIED" : "CONCEPT",
    implementation_state: e.status,
    source_of_truth: ["data/z_core_engines_registry.json", "docs/Z_SANCTUARY_ENGINE_INDEX.md"],
    related_engines: [e.id],
    economic_role: ["ENABLER", "RESEARCH_IP"],
    public_exposure_class: "PUBLIC_AFTER_SANITIZATION",
    next_evidence_gate: "Engine index itself warns presence ≠ runtime. Public copy must say doctrine/partial, not production engine.",
    notes: "Also listed in monster registry for ghost_core and alien_core — same IDs, not renamed.",
  });
}

for (const entry of monster.entries) {
  if (entry.id === "ghost_core" || entry.id === "alien_core") continue;
  add({
    canonical_id: entry.id,
    id_status: "CANONICAL",
    name: entry.label,
    type: "MODULE",
    purpose: entry.notes,
    evidence_state: monsterEvidence(entry),
    implementation_state: `monster_representation:${entry.representation}`,
    source_of_truth: [
      "data/z_sanctuary_monster_project_registry.json",
      "docs/Z_SANCTUARY_MONSTER_PROJECT_MASTER_MAP.md",
    ],
    related_engines: ["z_sanctuary_core"],
    economic_role: monsterEconomic(entry),
    public_exposure_class: monsterExposure(entry),
    security_class: ["tmk_goku_codex", "heart_and_genes"].includes(entry.id) ? "VAULT" : "INTERNAL",
    next_evidence_gate:
      entry.id === "bee_vision"
        ? "Bee Vision runtime remains CLOSED. Do not publish as a live capability."
        : "Keep symbolic vs shipped explicit. No silent runtime from catalog presence.",
    notes: `family=${entry.family}`,
  });
}

for (const m of mods.modules) {
  add({
    canonical_id: m.id,
    id_status: "CANONICAL",
    name: m.name,
    type: "MODULE",
    purpose: m.notes || `Master module registry row (${m.category}).`,
    evidence_state: evidenceFromModuleStatus(m.registry_status),
    implementation_state: implFromModuleStatus(m.registry_status),
    source_of_truth: ["data/z_master_module_registry.json", "docs/Z_SANCTUARY_MODULE_INDEX.md"],
    related_ai: m.category === "ai_tower_agents" ? ["ZS-AI-005"] : [],
    economic_role: m.registry_status === "safety_hold" ? ["ENABLER"] : ["ENABLER", "EXPERIMENTAL"],
    public_exposure_class: m.registry_status === "safety_hold" ? "DO_NOT_PUBLISH" : "PRIVATE",
    security_class: m.safety_class === "high" ? "INTERNAL" : "INTERNAL",
    next_evidence_gate: "Implemented in hub ≠ VERIFIED for public Golden Website. Module index generated 2026-05-02 may be stale vs this JSON.",
    notes: `registry_status=${m.registry_status}; category=${m.category}`,
  });
}

const curated = [
  {
    canonical_id: "ZS-AI-001",
    name: "Z-EAII",
    type: "AI",
    purpose: "Registry, ping, AIDFU, doorway — Organiser + hub operational intelligence. Not a public chatbot.",
    evidence_state: "QUALIFIED",
    implementation_state: "HUB_AND_ORGANISER",
    source_of_truth: ["docs/Z-MASTER-MODULES-REGISTER.md", "docs/Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md"],
    html_prototypes: ["dashboard/panels/z-eaii-knowledge-ask.html"],
    related_engines: ["z_sanctuary_core"],
    economic_role: ["ENABLER"],
    public_exposure_class: "PUBLIC_AFTER_SANITIZATION",
    next_evidence_gate: "Public description may name the role; must not expose registry internals or live ping endpoints.",
  },
  {
    canonical_id: "ZS-AI-002",
    name: "Z-Super Overseer AI",
    type: "AI",
    purpose: "Operational roof: Z-EAII + auto-run discipline + Z-SSWS. Authority metaphor, not a deployable public agent.",
    evidence_state: "QUALIFIED",
    implementation_state: "DOCTRINE_PLUS_HUB_TASKS",
    source_of_truth: ["docs/Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md"],
    related_ai: ["ZS-AI-001", "ZS-AI-003"],
    related_engines: ["z_sanctuary_core"],
    economic_role: ["ENABLER"],
    public_exposure_class: "PUBLIC_AFTER_SANITIZATION",
  },
  {
    canonical_id: "ZS-AI-003",
    name: "Z-SSWS",
    type: "AI",
    purpose: "Workspace structure / Super Saiyan Workspace System — local operator cockpit, not public orchestration.",
    evidence_state: "QUALIFIED",
    implementation_state: "HUB_PANELS_AND_TASKS",
    source_of_truth: ["docs/Z-MASTER-MODULES-REGISTER.md"],
    html_prototypes: ["dashboard/panels/z-ssws-morning-cockpit.html"],
    related_ai: ["ZS-AI-002"],
    economic_role: ["ENABLER"],
    public_exposure_class: "PRIVATE",
  },
  {
    canonical_id: "ZS-AI-004",
    name: "Zuno",
    type: "AI",
    purpose: "State / reflection observer. Derived ingest snapshots. Not a public product brain.",
    evidence_state: "QUALIFIED",
    implementation_state: "SNAPSHOT_AND_REPORTS",
    source_of_truth: ["docs/z_zuno_technology_snapshot.md", "data/zuno_state_snapshot.json"],
    receipts_tests: [],
    economic_role: ["ENABLER"],
    public_exposure_class: "PRIVATE",
    next_evidence_gate: "Do not publish raw Zuno telemetry. Sanitized role description only after steward review.",
  },
  {
    canonical_id: "ZS-AI-005",
    name: "AI Tower / mini-bot layer",
    type: "AI",
    purpose: "Planned/stub tower agents in master module registry. Overlaps QADP, Knowledge Ask, and ecosphere ledger.",
    evidence_state: "CONCEPT",
    implementation_state: "PLANNED_STUB_CLUSTER",
    source_of_truth: ["data/z_master_module_registry.json", "docs/Z-SSWS-MINI-BOT-AI-TOWER-MARKDOWN-RELAY.md"],
    related_ai: ["ZS-AI-001"],
    economic_role: ["EXPERIMENTAL", "ENABLER"],
    public_exposure_class: "PRIVATE",
  },
  {
    canonical_id: "ZS-AI-006",
    name: "Z-ICIS (insect scientific memory organism)",
    type: "AI",
    purpose: "Governed scientific lane: observe → encode → compare. Not a language decoder. Bee Vision runtime CLOSED.",
    evidence_state: "SEALED",
    implementation_state: "SEALED_SLICES_PLUS_PIN_HOLD",
    source_of_truth: ["docs/Z-MASTER-MODULES-REGISTER.md", "docs/Z_ICIS_SCIENTIFIC_CONSTITUTION_1.md"],
    receipts_tests: ["docs/PHASE_Z_ICIS_3D_J1_NATURAL_IMAGE_STEWARD_ACQUISITION_GATE_RECEIPT.md"],
    visual_mockups: [
      "data/z_icis_visual_assets/fixture-research-plate.svg",
      "data/z_icis_visual_assets/fixture-synthetic-insect.svg",
      "data/z_icis_visual_assets/fixture-ambiguous-silhouette.svg",
    ],
    economic_role: ["RESEARCH_IP", "PUBLIC_BENEFIT"],
    customer_beneficiary: "Scientific / public-benefit research (not a consumer product)",
    public_exposure_class: "DO_NOT_PUBLISH",
    security_class: "SCIENTIFIC_PRIVATE",
    next_evidence_gate: "No natural JPEG in repo. J2 / Bee Vision / ICIS-4 CLOSED. Public site must not claim live insect AI.",
    notes: "Sealed refers to governed scientific receipts, not public verification of a Golden Website feature.",
  },
  {
    canonical_id: "ZS-AI-007",
    name: "Folder Manager AI",
    type: "AI",
    purpose: "Vault, snapshots, policy. Read-only sincerity frequency for personal history. Not public.",
    evidence_state: "QUALIFIED",
    implementation_state: "HUB_POLICY",
    source_of_truth: ["docs/Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md", "docs/vault/Vault_Policy_Sheet.md"],
    economic_role: ["ENABLER"],
    public_exposure_class: "DO_NOT_PUBLISH",
    security_class: "VAULT",
  },
  {
    canonical_id: "ZS-AI-008",
    name: "Z-HODP (Head Organiser Dashboards)",
    type: "AI",
    purpose: "Primary organism dashboard surface. Working local frontend. Not a public Golden Website.",
    evidence_state: "QUALIFIED",
    implementation_state: "WORKING_LOCAL_UI",
    source_of_truth: ["docs/Z-MASTER-MODULES-REGISTER.md"],
    html_prototypes: ["dashboard/Html/index-skk-rkpk.html"],
    related_ai: ["ZS-AI-001", "ZS-AI-003"],
    related_engines: ["z_sanctuary_core"],
    economic_role: ["ENABLER", "PLATFORM_REVENUE"],
    public_exposure_class: "PRIVATE",
    prototype_class: "WORKING",
    notes: "Working frontend is not proof of public backend, billing, or edge bind.",
  },
  {
    canonical_id: "ZS-AI-009",
    name: "Z-AI QADP (Questions, Answers & Directed Pathways)",
    type: "AI",
    purpose: "Hub pattern for grounded Q&A: citations, registry-first, human gates. Overlaps Knowledge Ask and Z-Q&A&RP.",
    evidence_state: "QUALIFIED",
    implementation_state: "DOCTRINE_PLUS_HUB_UI",
    source_of_truth: ["docs/Z-AI-QADP-QUESTIONS-ANSWERS-DIRECTED-PATHWAYS.md"],
    html_prototypes: ["dashboard/z-qa-rp/index.html", "dashboard/panels/z-eaii-knowledge-ask.html"],
    related_ai: ["ZS-AI-001"],
    economic_role: ["ENABLER"],
    public_exposure_class: "PUBLIC_AFTER_SANITIZATION",
    next_evidence_gate: "Do not merge QADP, Knowledge Ask, Cloudflare Ask AI, and Z-Q&A&RP into one public product without steward alias decision.",
  },
  {
    canonical_id: "ZS-AI-010",
    name: "Stakeholder / Business / HR / Financials / Joker AIs (vision)",
    type: "AI",
    purpose: "Documented stakeholder and business-AI concepts. Payment gateway is not live commercial.",
    evidence_state: "CONCEPT",
    implementation_state: "DOCTRINE_ONLY",
    source_of_truth: ["docs/Z-STAKEHOLDERS-AND-BUSINESS-AI.md"],
    economic_role: ["ENTERPRISE_B2B", "EXPERIMENTAL"],
    customer_beneficiary: "Future operators / partners — not validated customers",
    revenue_pathway: "None evidenced.",
    commercial_status: "POTENTIAL_NOT_VALIDATED",
    public_exposure_class: "QUALIFIED_DATA_ROOM",
    next_evidence_gate: "No billing, no payment provider, no public investor claim from this row.",
  },
  {
    canonical_id: "ZS-FORMULA-001",
    name: "Ω(♾️) compassion formula",
    type: "FORMULA",
    purpose: "Architectural compassion anchor. Doctrine, not a billed engine.",
    evidence_state: "CONCEPT",
    implementation_state: "DOCTRINE",
    source_of_truth: ["docs/Z-ULTRA-INSTINCTS-AND-FORMULAS.md"],
    economic_role: ["RESEARCH_IP", "PUBLIC_BENEFIT"],
    public_exposure_class: "PUBLIC_AFTER_SANITIZATION",
    commercial_status: "NOT_COMMERCIAL",
  },
  {
    canonical_id: "ZS-FORMULA-002",
    name: "14 DRP Protocols",
    type: "FORMULA",
    purpose: "Universal agent law / non-harm stack. Binding internally; not a product SKU.",
    evidence_state: "QUALIFIED",
    implementation_state: "DOCTRINE_AND_GATES",
    source_of_truth: ["docs/Z_SWARM_14DRP_UNIVERSAL_AGENT_LAW.md"],
    economic_role: ["PUBLIC_BENEFIT", "ENABLER"],
    public_exposure_class: "PUBLIC_AFTER_SANITIZATION",
    commercial_status: "NOT_COMMERCIAL",
  },
  {
    canonical_id: "ZS-FORMULA-003",
    name: "GGAESP 360° ring",
    type: "FORMULA",
    purpose: "Governance / accuracy / polarity / compassion filter. Monster id ggaesp_360 is the catalog twin.",
    evidence_state: "CONCEPT",
    implementation_state: "DOCTRINE",
    source_of_truth: ["docs/Z-NEW-MODULE-DISCIPLINE.md", "data/z_sanctuary_monster_project_registry.json"],
    related_ai: ["ggaesp_360"],
    economic_role: ["PUBLIC_BENEFIT", "ENABLER"],
    public_exposure_class: "PUBLIC_AFTER_SANITIZATION",
    commercial_status: "NOT_COMMERCIAL",
    notes: "Alias of monster id ggaesp_360 — do not mint a second public name.",
  },
  {
    canonical_id: "ZS-EVIDENCE-001",
    name: "Hub green-receipt corpus",
    type: "EVIDENCE",
    purpose: "Inventory pointer to existing PHASE_* / GREEN_RECEIPT files. Not a claim that all are public-safe.",
    evidence_state: "QUALIFIED",
    implementation_state: "CORPUS_PRESENT",
    source_of_truth: ["docs/"],
    receipts_tests: ["docs/golden-website/PHASE_GW_0A_GREEN_RECEIPT.md"],
    economic_role: ["ENABLER"],
    commercial_status: "NOT_COMMERCIAL",
    public_exposure_class: "PRIVATE",
    notes: `Filesystem count at GW-0A build: ${receipts.length} receipt-like files. Individual receipts are not duplicated as overlay rows.`,
  },
  {
    canonical_id: "ZS-EVIDENCE-002",
    name: "Universal Workstation Navigator green receipt",
    type: "EVIDENCE",
    purpose: "Example of a sealed read-only dashboard receipt usable as a citation pattern for future public copy.",
    evidence_state: "SEALED",
    implementation_state: "RECEIPT_ON_HUB",
    source_of_truth: ["docs/dashboard/Z_UNIVERSE_NAVIGATOR_GREEN_RECEIPT.md"],
    html_prototypes: ["dashboard/Html/index-skk-rkpk.html"],
    economic_role: ["ENABLER"],
    commercial_status: "NOT_COMMERCIAL",
    public_exposure_class: "PUBLIC_AFTER_SANITIZATION",
  },
  {
    canonical_id: "ZS-EVIDENCE-003",
    name: "Commercial readiness / SUSBV pathway",
    type: "EVIDENCE",
    purpose: "Go-live checklist and self-benchmarks. Absence of live billing is itself evidence.",
    evidence_state: "CONCEPT",
    implementation_state: "CHECKLIST_AND_AUDIT_DOCS",
    source_of_truth: ["docs/COMMERCIAL-READINESS.md", "docs/pricing-and-benchmarks.md", "docs/Z-ECOSYSTEM-CAUSE-EFFECT-MARKET-MAP.md"],
    receipts_tests: ["docs/commercial/PHASE_ZSUSBV_1_GREEN_RECEIPT.md"],
    economic_role: ["PLATFORM_REVENUE", "ENTERPRISE_B2B", "RESEARCH_IP"],
    revenue_pathway: "Documented aspiration only. No live commercial lane evidenced.",
    commercial_status: "POTENTIAL_NOT_VALIDATED",
    public_exposure_class: "QUALIFIED_DATA_ROOM",
    next_evidence_gate: "Do not publish prices, guarantees, or 'ready for sale' claims.",
  },
  {
    canonical_id: "ZS-VISUAL-001",
    name: "ICIS scientific visual fixtures",
    type: "VISUAL",
    purpose: "Synthetic research plates for ICIS-3. Not Golden Website mockups. Do not publish as product screenshots.",
    evidence_state: "SEALED",
    implementation_state: "FIXTURES_IN_REPO",
    source_of_truth: ["docs/Z_ICIS_3_VISUAL_EVIDENCE_FOUNDATION.md"],
    visual_mockups: imgs.filter((p) => p.includes("z_icis")),
    related_ai: ["ZS-AI-006"],
    economic_role: ["RESEARCH_IP"],
    commercial_status: "NOT_COMMERCIAL",
    public_exposure_class: "DO_NOT_PUBLISH",
    security_class: "SCIENTIFIC_PRIVATE",
  },
  {
    canonical_id: "ZS-VISUAL-002",
    name: "Z-Auto Screenshots & Sounds Detectors (doctrine)",
    type: "VISUAL",
    purpose: "Consent-first capture concept for games. No Golden Website screenshot library found in docs/dashboard image inventory.",
    evidence_state: "CONCEPT",
    implementation_state: "DOCTRINE",
    source_of_truth: ["docs/Z-AUTO-SCREENSHOTS-SOUNDS-DETECTORS.md"],
    prototype_class: "CONCEPT",
    economic_role: ["EXPERIMENTAL", "ENABLER"],
    public_exposure_class: "PRIVATE",
    next_evidence_gate: "Do not imply a public screenshot product. Capture remains consent-gated and non-shipping as a public feature.",
  },
  {
    canonical_id: "univ_workstation_navigator",
    id_status: "CANONICAL",
    name: "Universal Workstation Navigator",
    type: "PROTOTYPE",
    purpose: catalog.services.find((s) => s.id === "univ_workstation_navigator")?.purpose || "Read-only navigator.",
    evidence_state: "SEALED",
    implementation_state: "READ_ONLY_UI",
    source_of_truth: ["dashboard/data/z_universe_service_catalog.json", "docs/dashboard/Z_UNIVERSE_WORKSTATION_NAVIGATOR.md"],
    receipts_tests: ["docs/dashboard/Z_UNIVERSE_NAVIGATOR_GREEN_RECEIPT.md"],
    html_prototypes: ["dashboard/Html/index-skk-rkpk.html"],
    prototype_class: "WORKING",
    economic_role: ["ENABLER"],
    public_exposure_class: "PUBLIC_AFTER_SANITIZATION",
    notes: "Working local UI. bridge_status not_connected. Not a public site.",
  },
];

for (const c of curated) {
  add({
    id_status: c.id_status || "TEMPORARY_PENDING_CANONICAL_REVIEW",
    ...c,
  });
}

for (const tile of mdg.tiles) {
  if (tile.id === "hodp-skk-rkpk") {
    add({
      canonical_id: tile.id,
      id_status: "CANONICAL",
      name: tile.title,
      type: "PROTOTYPE",
      purpose: tile.description,
      evidence_state: "QUALIFIED",
      implementation_state: "WORKING_LOCAL_UI",
      source_of_truth: ["data/z_mdg_dashboard_registry.json"],
      html_prototypes: [String(tile.href || "").replace(/^\//, "")],
      prototype_class: "WORKING",
      related_ai: ["ZS-AI-008"],
      economic_role: ["ENABLER"],
      public_exposure_class: "PRIVATE",
      notes: "Same surface as Z-HODP. Alias, not a second product.",
    });
    continue;
  }
  add({
    canonical_id: tile.id,
    id_status: "CANONICAL",
    name: tile.title,
    type: "PROTOTYPE",
    purpose: tile.description,
    evidence_state: "QUALIFIED",
    implementation_state: "DASHBOARD_TILE",
    source_of_truth: ["data/z_mdg_dashboard_registry.json"],
    html_prototypes: [String(tile.href || "").replace(/^\//, "")],
    prototype_class: protoClassFromMdg(tile),
    economic_role: ["ENABLER", "EXPERIMENTAL"],
    public_exposure_class: "PRIVATE",
  });
}

const extraProtos = [
  {
    id: "ZS-PROTOTYPE-001",
    name: "AMK-Goku Main Control Map",
    html: "dashboard/Html/amk-goku-main-control.html",
    sot: ["docs/PHASE_AMK_MAP_1_GREEN_RECEIPT.md"],
    klass: "WORKING",
    evidence: "SEALED",
  },
  {
    id: "ZS-PROTOTYPE-002",
    name: "Cycle Observe read-only dashboard",
    html: "dashboard/panels/z-cycle-dashboard-readonly.html",
    sot: ["docs/Z_CYCLE_DASHBOARD_SYSTEM.md"],
    klass: "WORKING",
    evidence: "QUALIFIED",
  },
  {
    id: "ZS-PROTOTYPE-003",
    name: "Universal Canvas lite",
    html: "dashboard/panels/z_uccr_universal_canvas_lite.html",
    sot: ["docs/Z_SANCTUARY_MONSTER_PROJECT_MASTER_MAP.md"],
    klass: "PARTIAL",
    evidence: "CONCEPT",
  },
  {
    id: "ZS-PROTOTYPE-004",
    name: "Zilwa exhibit hub (HTML family representative)",
    html: "dashboard/Html/zilwa-exhibit-hub.html",
    sot: ["dashboard/Html/zilwa-exhibit-hub.html"],
    klass: "SIMULATED",
    evidence: "CONCEPT",
  },
  {
    id: "ZS-PROTOTYPE-005",
    name: "Living Ecosphere Map HTML",
    html: "dashboard/Html/z-universe-ecosphere-map.html",
    sot: ["docs/dashboard/Z_SANCTUARY_LIVING_ECOSPHERE_MAP.md", "dashboard/data/z_universe_service_catalog.json"],
    klass: "WORKING",
    evidence: "QUALIFIED",
    canonicalPrefer: "zmv_ecosphere_map_readonly",
  },
  {
    id: "ZS-PROTOTYPE-006",
    name: "Addon dashboard HTML",
    html: "dashboard/Html/z-addon-dashboard.html",
    sot: ["data/z_mdg_dashboard_registry.json"],
    klass: "PARTIAL",
    evidence: "CONCEPT",
  },
  {
    id: "ZS-PROTOTYPE-007",
    name: "Crystal DNA map panel",
    html: "dashboard/panels/z-crystal-dna-map.html",
    sot: ["dashboard/panels/z-crystal-dna-map.html"],
    klass: "CONCEPT",
    evidence: "CONCEPT",
  },
];

for (const p of extraProtos) {
  const cid = p.canonicalPrefer || p.id;
  add({
    canonical_id: cid,
    id_status: p.canonicalPrefer ? "CANONICAL" : "TEMPORARY_PENDING_CANONICAL_REVIEW",
    name: p.name,
    type: "PROTOTYPE",
    purpose: "Hub HTML/dashboard prototype. Working frontend ≠ full capability.",
    evidence_state: p.evidence,
    implementation_state: "LOCAL_HTML",
    source_of_truth: p.sot,
    html_prototypes: [p.html],
    prototype_class: p.klass,
    economic_role: ["ENABLER", "EXPERIMENTAL"],
    public_exposure_class: p.klass === "SIMULATED" || p.klass === "CONCEPT" ? "PRIVATE" : "PRIVATE",
  });
}

const payload = {
  schema: "gw_portfolio_registry_v1",
  phase: "GW-0A",
  generated_at: new Date().toISOString(),
  posture: "reconciliation_overlay_not_authority",
  doctrine: [
    "federation ≠ authority",
    "topology ≠ ownership",
    "observe → verify → suggest → human decides",
    "readiness ≠ deploy",
    "organization ≠ control",
    "layered tools ≠ the soul",
  ],
  id_policy: {
    prefer_existing_canonical_ids: true,
    temporary_prefixes: [
      "ZS-PROJECT-",
      "ZS-MODULE-",
      "ZS-ENGINE-",
      "ZS-AI-",
      "ZS-FORMULA-",
      "ZS-PROTOTYPE-",
      "ZS-VISUAL-",
      "ZS-EVIDENCE-",
    ],
    temporary_marker: "TEMPORARY_PENDING_CANONICAL_REVIEW",
    no_silent_rename: true,
  },
  evidence_states: ["VERIFIED", "SEALED", "QUALIFIED", "CONCEPT", "HOLD", "CLOSED"],
  economic_roles: [
    "DIRECT_PRODUCT",
    "PLATFORM_REVENUE",
    "MARKETPLACE",
    "ENTERPRISE_B2B",
    "RESEARCH_IP",
    "ENABLER",
    "PUBLIC_BENEFIT",
    "EXPERIMENTAL",
  ],
  prototype_classes: ["WORKING", "PARTIAL", "SIMULATED", "CONCEPT", "PRIVATE"],
  public_exposure_classes: [
    "PUBLIC_SAFE",
    "PUBLIC_AFTER_SANITIZATION",
    "QUALIFIED_DATA_ROOM",
    "PRIVATE",
    "DO_NOT_PUBLISH",
  ],
  notes: [
    "This overlay does not replace z_master_module_registry.json, z_pc_root_projects.json, monster registry, engine index, or MDG tiles.",
    "VERIFIED is unused in GW-0A because existence and hub implementation are not public-site verification.",
    "No record is mapped to a live Golden Website surface yet (golden_website_surfaces remains empty).",
  ],
  path_discoveries: [
    {
      requested: "docs/Z_FULL_BUILD_CHECKLIST.md",
      actual: "docs/Z-FULL-BUILD-CHECKLIST.md",
    },
    {
      requested: "data/z_module_registry.json",
      actuals: [
        "data/z_master_module_registry.json",
        "data/z_module_manifest.json",
        "data/Z_module_registry.json",
        "docs/z_module_registry.json",
      ],
      note: "Do not treat copies as a new canonical list. See alias report.",
    },
    {
      requested: "living_workspace_manifest.json",
      actual: "docs/living_workspace_manifest.json",
      copies: [
        "packages/living-workspace-package/living_workspace_manifest.json",
        "releases/2026-01-28/docs/living_workspace_manifest.json",
      ],
    },
  ],
  inventory: {
    pc_root_projects: pc.projects.length,
    retired_projects: (pc.retired_projects || []).length,
    monster_entries: monster.entries.length,
    master_modules: mods.modules.length,
    core_engines: engines.engines.length,
    mdg_tiles: mdg.tiles.length,
    catalog_services: catalog.services.length,
    html_dashboard_or_public: htmlDash.length,
    receipt_like_files: receipts.length,
    visuals_docs_dash_data: imgs.length,
  },
  records,
};

const byEvidence = {};
const byEconomic = {};
const byType = {};
const byIdStatus = {};
let protoRecords = 0;
let visualRecords = 0;
for (const r of records) {
  byEvidence[r.evidence_state] = (byEvidence[r.evidence_state] || 0) + 1;
  byType[r.type] = (byType[r.type] || 0) + 1;
  byIdStatus[r.id_status] = (byIdStatus[r.id_status] || 0) + 1;
  for (const role of r.economic_role || []) {
    byEconomic[role] = (byEconomic[role] || 0) + 1;
  }
  if (r.type === "PROTOTYPE") protoRecords += 1;
  if (r.type === "VISUAL") visualRecords += 1;
}

payload.counts = {
  portfolio_records: records.length,
  by_type: byType,
  by_evidence_state: byEvidence,
  by_economic_role: byEconomic,
  by_id_status: byIdStatus,
  prototype_overlay_records: protoRecords,
  visual_overlay_records: visualRecords,
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
process.stdout.write(
  JSON.stringify(
    {
      out: rel(OUT),
      portfolio_records: records.length,
      by_evidence_state: byEvidence,
      by_economic_role: byEconomic,
      by_type: byType,
      by_id_status: byIdStatus,
      inventory: payload.inventory,
    },
    null,
    2,
  ),
);
