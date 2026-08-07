#!/usr/bin/env node
/**
 * Alpha A2 — Z-EAII Knowledge Intelligence index (hub-scoped, cite-or-admit).
 * Reads allowlisted docs/registries/reports only. Writes:
 *   data/reports/z_eaii_knowledge_index.{json,md}
 * Does not: invent facts, call external APIs, touch vault/secrets, execute tasks,
 * deploy, or auto-answer without citations.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_eaii_knowledge_index.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_eaii_knowledge_index.md');
const SCHEMA = 'z_eaii_knowledge_index_v1';
const MAX_CHARS_PER_DOC = 120_000;
const MAX_CHUNK = 900;
const CHUNK_OVERLAP = 80;

/** Allowlisted relative paths — stewardship corpus only. */
const ALLOWLIST = [
  'docs/governance/Z_SANCTUARY_UNIVERSE_CONSTITUTION_V1.md',
  'docs/Z_SANCTUARY_STATE_OF_THE_UNIVERSE_REPORT_2026.md',
  'docs/Z-MASTER-MODULES-REGISTER.md',
  'docs/Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md',
  'docs/AI_BUILDER_CONTEXT.md',
  'docs/Z_BACKUP_READINESS_OPERATION.md',
  'docs/Z_BACKUP_WAVE1_RUNBOOK.md',
  'docs/Z_BACKUP_WAVE2_INVENTORY_PREP.md',
  'docs/governance/Z_STEWARDSHIP_CERTIFICATE_PROTOCOL.md',
  'docs/governance/Z_UNIFIED_STEWARDSHIP_FOUNDATION_REVIEW.md',
  'docs/governance/Z_TRIPLE_IDENTIFICATION_AUDIT_2026_07_24.md',
  'docs/governance/Z_FAMILY_AI_REGISTRY.md',
  'docs/Z-AI-QADP-QUESTIONS-ANSWERS-DIRECTED-PATHWAYS.md',
  'docs/Z-SUPER-CHAT-BLUEPRINT.md',
  'docs/PHASE_Z_SSWS_MORNING_COCKPIT_ALPHA_A1.md',
  'docs/PHASE_Z_SSWS_MORNING_COCKPIT_ALPHA_A1_GREEN_RECEIPT.md',
  'docs/PHASE_Z_EAII_KNOWLEDGE_INTELLIGENCE_ALPHA_A2.md',
  'docs/PHASE_Z_STEWARD_INTELLIGENCE_ALPHA_A4_CHARTER.md',
  'docs/PHASE_Z_STEWARDS_COMPASS_FUTURE.md',
  'docs/Z_SANCTUARY_OPERATIONS_CENTER_LAYERS.md',
  'docs/Z_SANCTUARY_BOOK_I_FOUNDATION_COMPLETE.md',
  'docs/Z_SANCTUARY_BOOK_II_AWAKENING.md',
  'docs/Z_SANCTUARY_BOOK_II_SEVEN_DAY_AWAKENING_OBSERVATION.md',
  'docs/OMEGA_4_ECOSYSTEM_EXCELLENCE_REVIEW.md',
  'docs/OMEGA_5_GREAT_AWAKENING_REPORT.md',
  'docs/OMEGA_6_ECOSYSTEM_NERVOUS_SYSTEM_CHARTER.md',
  'docs/Z_SANCTUARY_STEWARDSHIP_IS_THE_CENTER.md',
  'docs/Z_SANCTUARY_REGISTRY_ATLAS.md',
  'docs/Z_SANCTUARY_QUALITY_GATE_TAKEOFF_CHECKLIST.md',
  'docs/Z_SANCTUARY_BOOK_II_IDENTITY_SEAL.md',
  'docs/Z_SANCTUARY_BOOKS_I_II_DEDICATION.md',
  'docs/Z_ZES_SANCTUARY_LINK_CHARTER.md',
  'docs/Z_ZES_PHASE_0_STEWARDSHIP_BUILDER_BRIEF.md',
  'docs/Z_ZES_PHASE_0_5_REGISTRY_CITIZENSHIP.md',
  'docs/PHASE_Z_ZES_0_5_REGISTRY_CITIZENSHIP_GREEN_RECEIPT.md',
  'docs/Z_ZES_ROADMAP_LEDGER.md',
  'docs/Z_SANCTUARY_STATE_OF_THE_OS_2026.md',
  'docs/Z_SANCTUARY_STATE_OF_THE_OS_2026_SCORECARD.md',
  'docs/PHASE_Z_STATE_OF_THE_OS_FIRST_PASS_ACCEPTANCE.md',
  'docs/Z_SANCTUARY_INDICATOR_SOURCE_ATLAS.md',
  'docs/Z_SANCTUARY_FRESHNESS_CADENCE.md',
  'docs/Z_SANCTUARY_OPERATING_PHILOSOPHY_FIVE_PRINCIPLES.md',
  'docs/Z_SANCTUARY_TRUST_CHAIN.md',
  'docs/Z_IDENTITY_MANIFEST.md',
  'docs/PHASE_Z_BOOK_B_PHASE_0_STABLE.md',
  'docs/Z_BOOK_B_SETTLEMENT.md',
  'docs/PHASE_Z_BOOK_B_SETTLEMENT_PASS_1.md',
  'docs/PHASE_Z_BOOK_B_SETTLEMENT_PASS_2.md',
  'docs/PHASE_Z_BOOK_B_SETTLEMENT_PASS_3.md',
  'docs/PHASE_Z_BOOK_B_CONSTITUTIONALLY_MATURE.md',
  'docs/PHASE_Z_CONSTITUTIONAL_FREEZE_AND_STEWARD_RECOMMENDATIONS_2026_08_07.md',
  'docs/PHASE_Z_STEWARD_META_OBSERVATIONS_POST_FREEZE_2026_08_07.md',
  'docs/PHASE_Z_ERA_IV_STEWARDSHIP_IDENTITY_SEAL_2026_08_07.md',
  'docs/Z_SETTLEMENT_GUARD_PROTOCOL.md',
  'docs/Z_SETTLEMENT_STRUCTURAL_VERIFICATION_LOG.md',
  'docs/Z_ARCHITECTURAL_MATURITY_MILESTONE.md',
  'docs/Z_REGISTRY_CITIZENSHIP_PROTOCOL.md',
  'docs/Z_HUMAN_AGENT_DISTINCTION_SCHEMA.md',
  'docs/Z_REVOCATION_FRAMEWORK.md',
  'docs/Z_STEWARD_GATE_LOGIC.md',
  'docs/Z_AUDIT_RECEIPT_STRUCTURE.md',
  'docs/PHASE_Z_TRUST_CHAIN_ORDER_CHARTER.md',
  'docs/PHASE_Z_STATE_OF_THE_OS_L1_FOUNDATION_SEAL.md',
  'docs/Z_SANCTUARY_STATE_OF_THE_OS_2026_LAYER_1_FOUNDATION.md',
  'docs/Z_SANCTUARY_STATE_OF_THE_OS_2026_LAYER_2_ARCHITECTURE.md',
  'docs/Z_SANCTUARY_STATE_OF_THE_OS_2026_LAYER_3_KNOWLEDGE.md',
  'docs/Z_SANCTUARY_STATE_OF_THE_OS_2026_LAYER_4_OPERATIONS.md',
  'docs/Z_SANCTUARY_STATE_OF_THE_OS_2026_LAYER_5_RUNTIME.md',
  'docs/Z_SANCTUARY_STATE_OF_THE_OS_2026_LAYER_6_EXTERNAL.md',
  'docs/Z_SANCTUARY_STATE_OF_THE_OS_2026_LAYER_7_COMMERCIAL.md',
  'docs/Z_SANCTUARY_STATE_OF_THE_OS_2026_LAYER_8_HUMAN.md',
  'docs/Z_SANCTUARY_SYNCHRONIZE_2026_08_06.md',
  'docs/Z_SANCTUARY_STEWARD_DECISION_LOG.md',
  'docs/Z_SUPER_TURTLE_SUPERVISORY_LAYER.md',
  'docs/Genesis/MASTER_GENESIS_CORE_SPEC.md',
  'docs/PHASE_GENESIS_CORE_CHARTER.md',
  'data/z_zes_organism_citizenship.json',
  'docs/PHASE_TURTLE_QUALITY_GATE_RITUAL.md',
  'docs/PHASE_TURTLE_REGISTRY_ATLAS.md',
  'docs/PHASE_TURTLE_REPORT_AGE_BESIDE_STATUS.md',
  'docs/Z_SANCTUARY_BOOK_II_CHAPTER_2_GREAT_AWAKENING.md',
  'docs/Z_SANCTUARY_ECOSYSTEM_EXCELLENCE_BACKLOG.md',
  'docs/Z_CYCLE_OBSERVE_SYSTEM.md',
  'docs/Z_DEPLOYMENT_READINESS_OVERSEER.md',
  'docs/Z_SANCTUARY_CANONICAL_CONTROL_ROOT.md',
  'data/z_pc_root_projects.json',
  'data/z_module_manifest.json',
  'data/z_stewardship_certificate_registry.json',
  'data/z_family_ai_registry.json',
  'data/z_ecosystem_growth_stage_registry.json',
  'data/z_mdg_dashboard_registry.json',
  'data/z_sanctuary_monster_project_registry.json',
  'data/reports/z_backup_readiness_inventory.json',
  'data/reports/z_cycle_observe_status.json',
  'data/reports/z_deployment_readiness_status.json',
  'data/reports/z_kbozsu_codex.json',
];

const DENY_SUBSTR = ['vault', 'safe_pack', 'node_modules', '.env', 'credentials', 'secret'];

function sha256(text) {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
}

function relPosix(p) {
  return p.split(path.sep).join('/');
}

function isDenied(rel) {
  const low = rel.toLowerCase();
  return DENY_SUBSTR.some((d) => low.includes(d));
}

function readText(abs) {
  const raw = fs.readFileSync(abs, 'utf8');
  if (raw.length > MAX_CHARS_PER_DOC) return raw.slice(0, MAX_CHARS_PER_DOC);
  return raw;
}

function titleFrom(rel, text) {
  if (rel.endsWith('.md')) {
    const m = text.match(/^#\s+(.+)$/m);
    if (m) return m[1].trim();
  }
  if (rel.endsWith('.json')) {
    try {
      const j = JSON.parse(text);
      return j.title || j.name || j.full_name || j.schema || path.basename(rel);
    } catch {
      /* fall through */
    }
  }
  return path.basename(rel);
}

function chunkText(text, rel) {
  const norm = text.replace(/\r\n/g, '\n');
  const chunks = [];
  if (norm.length <= MAX_CHUNK) {
    chunks.push({ text: norm, offset: 0 });
    return chunks;
  }
  let i = 0;
  while (i < norm.length) {
    const end = Math.min(norm.length, i + MAX_CHUNK);
    chunks.push({ text: norm.slice(i, end), offset: i });
    if (end >= norm.length) break;
    i = Math.max(0, end - CHUNK_OVERLAP);
  }
  return chunks;
}

function extractTags(rel, text) {
  const tags = new Set();
  const low = `${rel}\n${text}`.toLowerCase();
  const KEYS = [
    ['constitution', 'constitution'],
    ['steward', 'stewardship'],
    ['backup', 'backup'],
    ['wave 1', 'backup'],
    ['tourism', 'tourism'],
    ['zilwa', 'tourism'],
    ['astralis', 'astralis'],
    ['ai tower', 'ai-tower'],
    ['ssws', 'ssws'],
    ['eaii', 'eaii'],
    ['morning cockpit', 'mission-control'],
    ['mission control', 'mission-control'],
    ['indicator', 'indicators'],
    ['governance', 'governance'],
    ['registry', 'registry'],
    ['certificate', 'certificate'],
    ['git', 'git'],
    ['remote', 'backup'],
    ['omega', 'observation'],
    ['Ω-', 'observation'],
    ['nhv', 'nhv'],
    ['needs human verification', 'nhv'],
    ['zuno', 'ai'],
    ['overseer', 'ai'],
    ['family ai', 'family-ai'],
  ];
  for (const [needle, tag] of KEYS) {
    if (low.includes(needle)) tags.add(tag);
  }
  return [...tags];
}

function buildRelationships(pc, family, modules) {
  const nodes = [];
  const edges = [];

  nodes.push({ id: 'amk-goku', label: 'AMK-Goku', kind: 'steward' });
  nodes.push({ id: 'ssws-morning-cockpit', label: 'SSWS Morning Cockpit', kind: 'surface' });
  nodes.push({ id: 'z-eaii', label: 'Z-EAII', kind: 'ai' });
  nodes.push({ id: 'amk-indicators', label: 'AMK Indicators', kind: 'surface' });
  edges.push({ from: 'amk-goku', to: 'ssws-morning-cockpit', rel: 'opens-daily' });
  edges.push({ from: 'ssws-morning-cockpit', to: 'z-eaii', rel: 'asks' });
  edges.push({ from: 'z-eaii', to: 'amk-indicators', rel: 'feeds-insights' });

  const projects = Array.isArray(pc?.projects) ? pc.projects : [];
  for (const p of projects) {
    const id = p.id || p.project_id;
    if (!id) continue;
    nodes.push({
      id,
      label: p.name || id,
      kind: 'project',
      role: p.role || null,
      path: p.path || null,
      hosting: p.hosting || null,
    });
    edges.push({ from: 'ssws-morning-cockpit', to: id, rel: 'observes' });
    const blob = JSON.stringify(p).toLowerCase();
    if (blob.includes('astralis') || /tourism|zilwa/i.test(blob)) {
      edges.push({ from: id, to: 'theme-tourism', rel: 'related-theme' });
    }
  }

  if (!nodes.find((n) => n.id === 'theme-tourism')) {
    nodes.push({ id: 'theme-tourism', label: 'Tourism theme', kind: 'theme' });
  }

  const fam = family?.entries || family?.ais || family?.members || [];
  if (Array.isArray(fam)) {
    for (const a of fam) {
      const id = a.id || a.name;
      if (!id) continue;
      const nid = `family-${id}`;
      nodes.push({ id: nid, label: a.name || id, kind: 'family-ai' });
      edges.push({ from: 'z-eaii', to: nid, rel: 'registers' });
    }
  }

  const mods = modules?.modules || [];
  if (Array.isArray(mods)) {
    for (const m of mods.slice(0, 80)) {
      const id = m.id || m.module_id;
      if (!id) continue;
      nodes.push({ id: `mod-${id}`, label: m.title || m.name || id, kind: 'module' });
    }
  }

  return { nodes, edges, note: 'Derived from registries only — not a complete universe graph.' };
}

function stewardBriefing(bundle) {
  const discoveries = [];
  const risks = [];
  const missing = [];
  const recommendations = [];
  const outstanding = [];
  const recent = [];

  discoveries.push('Alpha A1 Morning Cockpit sealed SUCCESS / BASELINE FROZEN.');
  discoveries.push('Alpha A2 Z-EAII knowledge index available — cite-or-admit.');
  discoveries.push('Book II — Awakening officially OPEN (2026-08-02). Guiding principle: Awaken. Don\'t Replace.');
  discoveries.push('Seven-Day Awakening Observation active — patterns before features.');

  const inv = bundle.backupInv?.summary;
  if (inv) {
    if (inv.no_remote_backup > 0) {
      risks.push(`${inv.no_remote_backup} scanned trees have no HTTP remote (Wave 1B still open).`);
    }
    if (inv.organiser_backups_folder_empty) {
      risks.push('Organiser Backups/ lacks verified off-PC coverage (staging ≠ complete backup).');
    }
  }

  outstanding.push('Wave 1B independent destination (AMK gate).');
  outstanding.push('Foundation stewardship commit/PR timing (AMK gate).');
  outstanding.push('Complete Seven-Day Awakening Observation before A3/A4 builds.');
  missing.push('Full off-PC restore drill certificate (COMPLETE) not yet present.');
  recommendations.push(
    'Book II Chapter 1: use Morning Cockpit + EAII daily; fill the seven-day observation log.'
  );
  recommendations.push(
    'Do not rush Alpha A3 — awaken what exists; one better steward decision per morning is the mission.'
  );
  recommendations.push('Keep Morning Cockpit as daily open; Steward Intelligence stays A4 charter-only.');
  recent.push('Constitution v1.0 FROZEN · State of the Universe 2026 accepted · Stewardship Era open.');
  recent.push('Book I Foundation COMPLETE · Book II Awakening OPEN · Intelligence Principle Article XII.');

  return {
    generated_for: 'What should AMK-Goku know today?',
    todays_discoveries: discoveries,
    todays_risks: risks,
    todays_missing_links: missing,
    todays_recommendations: recommendations,
    outstanding_nhv: outstanding,
    recent_changes: recent,
    law: 'Observation / citation only — no automatic execution.',
  };
}

function main() {
  const documents = [];
  const chunks = [];
  const missing = [];
  let chunkId = 0;

  for (const rel of ALLOWLIST) {
    if (isDenied(rel)) continue;
    const abs = path.join(ROOT, ...rel.split('/'));
    if (!fs.existsSync(abs)) {
      missing.push(rel);
      continue;
    }
    let text;
    try {
      text = readText(abs);
    } catch (e) {
      missing.push(`${rel} (${e.message})`);
      continue;
    }
    const title = titleFrom(rel, text);
    const tags = extractTags(rel, text);
    const hash = sha256(text);
    const docId = `doc-${documents.length + 1}`;
    documents.push({
      id: docId,
      path: relPosix(rel),
      title,
      tags,
      bytes: Buffer.byteLength(text, 'utf8'),
      sha256: hash,
      mtime: fs.statSync(abs).mtime.toISOString(),
    });
    for (const ch of chunkText(text, rel)) {
      chunkId += 1;
      chunks.push({
        id: `c${chunkId}`,
        doc_id: docId,
        path: relPosix(rel),
        title,
        tags,
        offset: ch.offset,
        text: ch.text,
      });
    }
  }

  const pc = safeJson('data/z_pc_root_projects.json');
  const family = safeJson('data/z_family_ai_registry.json');
  const modules = safeJson('data/z_module_manifest.json');
  const backupInv = safeJson('data/reports/z_backup_readiness_inventory.json');
  const certs = safeJson('data/z_stewardship_certificate_registry.json');
  const deploy = safeJson('data/reports/z_deployment_readiness_status.json');

  const projects_no_git_remote = [];
  if (backupInv?.projects || backupInv?.trees || backupInv?.entries) {
    const rows = backupInv.projects || backupInv.trees || backupInv.entries || [];
    for (const row of rows) {
      const remote = row.http_remote || row.remote || row.git_remote;
      const has = row.has_http_remote === true || (typeof remote === 'string' && remote.startsWith('http'));
      if (!has) {
        projects_no_git_remote.push({
          id: row.id || row.project_id || row.name,
          path: row.path || null,
          note: row.note || 'No HTTP remote recorded in backup inventory',
        });
      }
    }
  } else if (backupInv?.summary) {
    projects_no_git_remote.push({
      id: '_summary',
      path: null,
      note: `${backupInv.summary.no_remote_backup ?? '?'} trees without remote — see inventory report for row detail`,
    });
  }

  const stale_review_proxies = [];
  const projects = Array.isArray(pc?.projects) ? pc.projects : [];
  for (const p of projects) {
    const hosting = String(p.hosting || '');
    if (!p.path || p.role === 'external' || hosting === 'link-only' || hosting === 'missing') {
      stale_review_proxies.push(
        `${p.name || p.id}: proxy=${!p.path ? 'NO_PATH' : hosting || p.role || 'external'} (not a real last-reviewed date)`
      );
    }
  }

  const tourism_hits = chunks
    .filter((c) => (c.tags || []).includes('tourism') || /tourism|zilwa/i.test(c.text))
    .slice(0, 40)
    .map((c) => ({ path: c.path, title: c.title, chunk_id: c.id }));

  const ai_tower_hits = chunks
    .filter((c) => (c.tags || []).includes('ai-tower') || /ai tower/i.test(c.text))
    .slice(0, 40)
    .map((c) => ({ path: c.path, title: c.title, chunk_id: c.id }));

  const constitution_hits = documents.filter((d) => d.tags.includes('constitution'));

  const index = {
    schema: SCHEMA,
    phase: 'ALPHA-A2',
    generated_at: new Date().toISOString(),
    law: [
      'Never invent facts.',
      'If confidence is low → Needs Human Verification (NHV).',
      'If no hub evidence → say so explicitly.',
      'Always cite source path.',
      'Observation only — no automatic execution.',
    ],
    search_modes: [
      'quick',
      'natural',
      'timeline',
      'dependency',
      'steward',
      'explain',
      'morning',
    ],
    stats: {
      documents: documents.length,
      chunks: chunks.length,
      missing_allowlist: missing.length,
      relationships_nodes: 0,
      relationships_edges: 0,
    },
    allowlist: ALLOWLIST,
    missing_allowlist: missing,
    documents,
    chunks,
    relationships: buildRelationships(pc, family, modules),
    curated: {
      projects_no_git_remote,
      tourism_related: tourism_hits,
      ai_tower_mentions: ai_tower_hits,
      constitution_sources: constitution_hits.map((d) => ({ path: d.path, title: d.title })),
      stewardship_certificates: (certs?.certificates || []).map((c) => ({
        id: c.id,
        status: c.verification_status || c.status,
        path: 'data/z_stewardship_certificate_registry.json',
      })),
      deploy_signal:
        deploy?.global_readiness?.ecosystem_signal ||
        deploy?.rollups?.ecosystem_signal ||
        null,
      stale_review_proxies,
    },
    morning_briefing: stewardBriefing({ backupInv }),
  };

  index.stats.relationships_nodes = index.relationships.nodes.length;
  index.stats.relationships_edges = index.relationships.edges.length;

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(index, null, 2), 'utf8');

  const md = [
    '# Z-EAII Knowledge Index (Alpha A2)',
    '',
    `Generated: ${index.generated_at}`,
    '',
    `Documents: **${index.stats.documents}** · Chunks: **${index.stats.chunks}** · Missing allowlist: **${index.stats.missing_allowlist}**`,
    '',
    '## Law',
    ...index.law.map((l) => `- ${l}`),
    '',
    '## Morning briefing (excerpt)',
    ...index.morning_briefing.todays_recommendations.map((r) => `- ${r}`),
    '',
    '## Documents indexed',
    ...documents.map((d) => `- \`${d.path}\` — ${d.title}`),
    '',
    missing.length ? `## Missing allowlist entries\n${missing.map((m) => `- ${m}`).join('\n')}` : '',
    '',
    '_Cite-or-admit. No invention._',
    '',
  ].join('\n');
  fs.writeFileSync(OUT_MD, md, 'utf8');

  console.log(`Z-EAII knowledge index → ${relPosix(path.relative(ROOT, OUT_JSON))}`);
  console.log(
    `docs=${documents.length} chunks=${chunks.length} missing=${missing.length} nodes=${index.stats.relationships_nodes}`
  );
}

function safeJson(rel) {
  const abs = path.join(ROOT, ...rel.split('/'));
  try {
    return JSON.parse(fs.readFileSync(abs, 'utf8'));
  } catch {
    return null;
  }
}

main();
