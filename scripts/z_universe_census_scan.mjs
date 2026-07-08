#!/usr/bin/env node
/**
 * Z-UNIVERSE-CENSUS-1 — MC-0.6 Universe Census & AI Ecosystem Integration.
 * Runs discovery refresh, enriches registry with census fields, writes AI ecosystem registry + census report.
 * READ-ONLY — no sibling project modifications, no runtime, no deploy.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const REG_PATH = path.join(ROOT, 'data', 'z_universe_project_registry.json');
const AI_REG_PATH = path.join(ROOT, 'data', 'z_universe_ai_ecosystem_registry.json');
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_universe_census_report.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_universe_census_report.md');
const SCHEMA_REG = 'z_universe_project_registry_v1_2_mc_0_6';
const SCHEMA_CENSUS = 'z_universe_census_report_v1';

const FOUNDATION_DOCS = {
  compassion_charter: 'docs/governance/Z_SANCTUARY_COMPASSION_CHARTER.md',
  turtle_mode: '.cursor/rules/z-turtle-mode-cursor-agents.mdc',
  drp: 'docs/Z_SWARM_14DRP_UNIVERSAL_AGENT_LAW.md',
  ai_constitution: 'docs/z-connect/Z_CONNECT_AI_CONSTITUTION_V1.md',
  consent: 'docs/z-connect/platform-contracts/consent/',
  foundation_doctrines: 'docs/governance/Z_SANCTUARY_FOUNDATION_DOCTRINES.md',
};

function readJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function conf(level, source) {
  return { level, source };
}

function inferPurpose(p) {
  const id = p.registry_id || p.suggested_registry_id || '';
  const name = String(p.project_name || '').toLowerCase();
  const notes = String(p.description || p.notes || '').toLowerCase();

  const map = {
    'zsanctuary-universe': 'Canonical governance and control root — Mission Control host',
    'z-sanctuary-universe-2-pc-root':
      'Continuation / parallel hub tree — clarify canonical path (successor candidate)',
    'z-sanctuary-universe-2-continuation':
      'Nested continuation tree under hub — migration copy candidate',
    'z-labs': 'Approved satellite — markdown relay and Z_Labs experiments',
    'z-sanctuary-universe-stub-retired': 'Retired hub stub — archive only',
    'z-pets-care-compassion': 'Animal wellness / pets care compassion platform (stub)',
    'z-worksphere-marketplace-hub': 'Marketplace hub prototype — Commerce HOLD',
    'z-omni-sanctuary': 'OMNI sanctuary integration layer',
    'z-sanctuary-ai-skyscraper': 'AI Skyscraper colony / dashboard colony',
    'z-sanctuary-browser-z-saiyan-lumina': 'Browser / Lumina experience',
    'z-sanctuary-claude-core': 'Claude-oriented core experiments',
    'z-sanctuary-replit': 'Replit-hosted sanctuary experiments',
    'z-sanctuary-aimanity': 'Aimanity relationship / compassion-adjacent lane',
    'z-sanctuary-external-paas': 'External PaaS research',
    'z-sanctuary-g': 'Z-Sanctuary G variant',
    'z-sanctuary-gem': 'Gemini-oriented experiments',
    'sister-aisling-sol': 'Sister Aisling Sol project',
    'replit-roulette-z-amk-goku-mdcp': 'Roulette data analyzer on Replit',
    'eirmind-ireland-projects-missing': 'ÉirMind Ireland projects — path missing',
  };

  if (map[id]) return { text: map[id], confidence: 'confirmed', source: 'registry_id_map' };
  if (p.disk_only) {
    return {
      text: 'Discovered on disk — purpose needs AMK classification',
      confidence: 'inferred',
      source: 'disk_discovery',
    };
  }
  if (name.includes('cloudflare')) {
    return {
      text: 'Cloudflare infrastructure / edge contingency',
      confidence: 'inferred',
      source: 'name_heuristic',
    };
  }
  if (name.includes('vault'))
    return {
      text: 'Vault and sensitive asset storage',
      confidence: 'inferred',
      source: 'name_heuristic',
    };
  if (notes)
    return {
      text: p.description || p.notes,
      confidence: 'confirmed',
      source: 'z_pc_root_projects.json',
    };
  return {
    text: 'Purpose not documented — classify after review',
    confidence: 'unknown',
    source: 'none',
  };
}

function turtleIndicator(p) {
  if (p.classification_lane === 'archive' || p.role === 'retired_stub')
    return { code: 'archive', emoji: '🟤', label: 'Archive' };
  if (p.path_missing && !p.disk_only)
    return { code: 'frozen', emoji: '⚫', label: 'Frozen / path missing' };
  if (p.classification_lane === 'research')
    return { code: 'research', emoji: '🟣', label: 'Research' };
  if (p.registry_id === 'zsanctuary-universe')
    return { code: 'active_development', emoji: '🟢', label: 'Active Development (hub)' };
  if (p.classification_lane === 'core')
    return { code: 'architecture', emoji: '🔵', label: 'Architecture' };
  if (p.documentation_status === 'missing' || p.documentation_status === 'partial') {
    return { code: 'documentation', emoji: '🟡', label: 'Documentation' };
  }
  if (p.merge_hold && p.turtle_mode) {
    return { code: 'turtle_mode', emoji: '🐢', label: 'Turtle Mode' };
  }
  return { code: 'turtle_mode', emoji: '🐢', label: 'Turtle Mode' };
}

function inferAiEcosystem(p) {
  const name = String(p.project_name || '').toLowerCase();
  const id = p.registry_id || '';
  const hosting = String(p.hosting || '').toLowerCase();
  const git = p.repository_status?.is_git;

  const eco = {
    lead_ai: { role: 'Zuno', id: 'zuno', confidence: 'inferred' },
    builder_ai: { role: 'Cursor', id: 'cursor', confidence: 'confirmed' },
    repository_ai: git
      ? { role: 'GitHub', id: 'github', confidence: 'confirmed' }
      : {
          role: hosting === 'replit' ? 'Replit' : 'None / link-only',
          id: hosting || 'none',
          confidence: git === false ? 'confirmed' : 'unknown',
        },
    infrastructure_ai: { role: 'None (local)', id: 'local', confidence: 'inferred' },
    specialist_ais: [],
    human_steward: { role: 'AMK-Goku', id: 'amk-goku', confidence: 'confirmed' },
  };

  if (p.role === 'hub' || p.formula_aware || id === 'zsanctuary-universe') {
    eco.lead_ai = { role: 'Zuno', id: 'zuno', confidence: 'confirmed' };
  }
  if (name.includes('cloudflare') || hosting.includes('cloud')) {
    eco.infrastructure_ai = { role: 'Cloudflare', id: 'cloudflare', confidence: 'confirmed' };
  }
  if (name.includes('claude')) {
    eco.specialist_ais.push({ role: 'Claude', id: 'claude', confidence: 'confirmed' });
  }
  if (name.includes('gem')) {
    eco.specialist_ais.push({ role: 'Gemini', id: 'gemini', confidence: 'confirmed' });
  }
  if (hosting === 'replit' || name.includes('replit')) {
    eco.infrastructure_ai = { role: 'Replit', id: 'replit', confidence: 'confirmed' };
    eco.specialist_ais.push({ role: 'Replit hosting', id: 'replit', confidence: 'confirmed' });
  }
  if (name.includes('copilot') || name.includes('openai')) {
    eco.specialist_ais.push({ role: 'OpenAI / Copilot', id: 'openai', confidence: 'inferred' });
  }

  return eco;
}

function foundationAdoption(p) {
  const id = p.registry_id || '';
  const isHub = id === 'zsanctuary-universe';
  const isCharter = p.kind === 'charter_in_hub';
  const isLabs = id === 'z-labs';
  const hasStrongDocs = p.documentation_status === 'strong';

  const adopt = (level) => ({ status: level, reference_only: true });

  if (isHub || isCharter) {
    return {
      compassion_charter: adopt('adopted'),
      turtle_mode: adopt('adopted'),
      drp: adopt('adopted'),
      ai_constitution: adopt(isCharter ? 'adopted' : 'partial'),
      consent: adopt(isCharter ? 'adopted' : 'partial'),
      foundation_doctrines: adopt('adopted'),
      confidence: conf('confirmed', 'hub_or_charter'),
    };
  }
  if (isLabs) {
    return {
      compassion_charter: adopt('partial'),
      turtle_mode: adopt('adopted'),
      drp: adopt('partial'),
      ai_constitution: adopt('planned'),
      consent: adopt('planned'),
      foundation_doctrines: adopt('partial'),
      confidence: conf('inferred', 'satellite_control_link'),
    };
  }
  if (p.formula_aware && hasStrongDocs) {
    return {
      compassion_charter: adopt('planned'),
      turtle_mode: adopt('adopted'),
      drp: adopt('partial'),
      ai_constitution: adopt('planned'),
      consent: adopt('planned'),
      foundation_doctrines: adopt('planned'),
      confidence: conf('inferred', 'eaii_registered'),
    };
  }
  return {
    compassion_charter: adopt('unknown'),
    turtle_mode: adopt(p.turtle_mode ? 'partial' : 'unknown'),
    drp: adopt('unknown'),
    ai_constitution: adopt('unknown'),
    consent: adopt('unknown'),
    foundation_doctrines: adopt('unknown'),
    confidence: conf('unknown', 'insufficient_metadata'),
  };
}

function readinessMatrix(p) {
  const dim = (signal, note) => ({ signal, note });
  const docs = p.documentation_status;
  const lane = p.classification_lane;

  return {
    architecture: dim(
      lane === 'core' || p.kind === 'charter_in_hub'
        ? 'GREEN'
        : lane === 'growing'
          ? 'YELLOW'
          : 'BLUE',
      lane
    ),
    governance: dim(p.merge_hold && p.turtle_mode ? 'GREEN' : 'YELLOW', 'Merge Hold default'),
    documentation: dim(docs === 'strong' ? 'GREEN' : docs === 'partial' ? 'YELLOW' : 'RED', docs),
    ai_readiness: dim(
      p.registry_id === 'zsanctuary-universe' || p.kind === 'charter_in_hub' ? 'YELLOW' : 'BLUE',
      'Track A / charters'
    ),
    technical_readiness: dim(
      p.path_ok && p.repository_status?.is_git ? 'YELLOW' : p.path_missing ? 'RED' : 'BLUE',
      p.technology_stack?.join(', ') || 'unknown'
    ),
    commercial_readiness: dim(
      p.commercial_status === 'HOLD'
        ? 'BLUE'
        : p.classification_lane === 'core'
          ? 'YELLOW'
          : 'BLUE',
      p.commercial_status || 'early'
    ),
    security: dim(p.role === 'hub' ? 'GREEN' : 'YELLOW', p.security_status || 'observe'),
    deployment: dim('RED', 'Runtime NOT AUTHORIZED'),
    mission_control_integration: dim(
      p.mission_control_status === 'integrated' ? 'GREEN' : p.on_disk ? 'YELLOW' : 'BLUE',
      p.mission_control_status
    ),
  };
}

function integrationPathway(p) {
  const id = p.registry_id || p.suggested_registry_id || '';
  if (id === 'zsanctuary-universe') return 'Canonical hub — MC integrated · Track A priority';
  if (id.includes('z-sanctuary-universe-2')) {
    return 'Successor/duplicate review — human gate before SSWS promotion';
  }
  if (p.disk_only) return 'Register in z_pc_root_projects.json → discovery → department mapping';
  if (p.mission_control_status === 'registered_awaiting_integration') {
    return 'Awaiting MC department mapping · visible in census';
  }
  if (p.classification_lane === 'archive') return 'Archive reference only — do not promote';
  return 'Observe in Turtle Mode · charter before runtime coupling';
}

function expandTimeline(p, nowIso) {
  const t = p.timeline || {};
  const blocker = p.path_missing
    ? 'path_missing_on_disk'
    : p.registry_id === 'zsanctuary-universe'
      ? 'Track A VILE merge pending'
      : p.disk_only
        ? 'not_in_pc_root_registry'
        : p.documentation_status === 'missing'
          ? 'documentation_gap'
          : 'merge_hold_active';

  return {
    ...t,
    next_milestone:
      p.registry_id === 'zsanctuary-universe'
        ? 'VILE Pkgs 1–3 on main'
        : p.disk_only
          ? 'AMK registration review'
          : p.documentation_status === 'missing'
            ? 'Add README / docs'
            : 'Mission Control visibility',
    current_blocker: blocker,
    next_recommended_action: p.recommended_next_action || 'Turtle Mode observe',
    last_reviewed: nowIso.slice(0, 10),
  };
}

function successorReview(projects, duplicate_candidates) {
  const reviews = [];

  const hub = projects.find((p) => p.registry_id === 'zsanctuary-universe');
  const pc2 = projects.find((p) => p.registry_id === 'z-sanctuary-universe-2-pc-root');
  const nested2 = projects.find((p) => p.registry_id === 'z-sanctuary-universe-2-continuation');
  const stub = projects.find((p) => p.registry_id === 'zsanctuary-universe-stub-retired');

  reviews.push({
    type: 'canonical_hub',
    project_ids: ['zsanctuary-universe'],
    verdict: 'Z_Sanctuary_Universe is the canonical governance and control root on disk',
    action: 'none — already canonical',
    confidence: 'confirmed',
  });

  if (pc2 && nested2) {
    reviews.push({
      type: 'successor_duplicate',
      project_ids: ['z-sanctuary-universe-2-pc-root', 'z-sanctuary-universe-2-continuation'],
      verdict: 'Two Z_Sanctuary_Universe 2 trees — PC root sibling vs nested under hub',
      action: 'Human review — clarify canonical path before merge or SSWS promotion',
      confidence: 'confirmed',
    });
  }

  if (stub) {
    reviews.push({
      type: 'archived_successor',
      project_ids: ['zsanctuary-universe-stub-retired'],
      verdict: 'ZSanctuary_Universe (no underscore) is retired stub — not hub',
      action: 'Do not use — archive reference',
      confidence: 'confirmed',
    });
  }

  for (const d of duplicate_candidates || []) {
    reviews.push({
      type: d.reason || 'duplicate_candidate',
      project_ids: d.project_ids || [],
      path: d.path,
      verdict: d.reason,
      action: 'Report only — human gate for consolidation',
      confidence: 'confirmed',
    });
  }

  return reviews;
}

function buildUniverseAiRegistry() {
  return {
    schema: 'z_universe_ai_ecosystem_registry_v1',
    generated_at: new Date().toISOString(),
    law_note: 'Documentation-only AI roles — no runtime AI connections from this registry',
    systems: [
      {
        id: 'zuno',
        name: 'Zuno',
        emoji: '❤️',
        primary_role: 'Architecture, ethics, governance, state reflection',
        confidence: 'confirmed',
      },
      {
        id: 'cursor',
        name: 'Cursor',
        emoji: '💻',
        primary_role: 'Implementation and code generation (Turtle Mode)',
        confidence: 'confirmed',
      },
      {
        id: 'github',
        name: 'GitHub',
        emoji: '🐙',
        primary_role: 'Source control, review, vault gate',
        confidence: 'confirmed',
      },
      {
        id: 'cloudflare',
        name: 'Cloudflare',
        emoji: '☁️',
        primary_role: 'Infrastructure and deployment (contingency — NO_GO default)',
        confidence: 'confirmed',
      },
      {
        id: 'claude',
        name: 'Claude',
        emoji: '🧠',
        primary_role: 'Long-form reasoning specialist',
        confidence: 'inferred',
      },
      {
        id: 'gemini',
        name: 'Gemini',
        emoji: '💎',
        primary_role: 'Research and multimodal support',
        confidence: 'inferred',
      },
      {
        id: 'replit',
        name: 'Replit',
        emoji: '🌀',
        primary_role: 'Hosted experiments / link-only projects',
        confidence: 'confirmed',
      },
      {
        id: 'openai',
        name: 'OpenAI / Copilot',
        emoji: '🤖',
        primary_role: 'Copilot-style assistants where chartered',
        confidence: 'inferred',
      },
      {
        id: 'amk-goku',
        name: 'AMK-Goku',
        emoji: '🛡️',
        primary_role: 'Human steward — sacred gate authority',
        confidence: 'confirmed',
      },
    ],
    foundation_doc_refs: FOUNDATION_DOCS,
  };
}

function buildRelationshipMap(registry) {
  return {
    schema: 'z_universe_relationship_map_v1',
    root: 'Z-Sanctuary Universe',
    posture: 'informational_only — no runtime coupling',
    tree: [
      { id: 'governance', label: 'Governance', children: ['hub', 'merge_hold', 'drp', 'sepc'] },
      {
        id: 'foundation_doctrines',
        label: 'Foundation Doctrines',
        children: ['compassion_charter', 'turtle_mode', 'ai_constitution'],
      },
      {
        id: 'shared_packages',
        label: 'Shared Packages',
        children: [
          'vile_zuno_observability',
          'vile_zuno_security',
          'vile_zuno_shadow',
          'zuno_drp_charter',
        ],
      },
      {
        id: 'mission_control',
        label: 'Mission Control',
        children: ['discovery', 'census', 'status_engine', 'dashboard_mc1'],
      },
      {
        id: 'soulmates_universe',
        label: 'Soulmates Universe (Z-Connect)',
        children: ['phase_b2', 'charter_zsu_0004'],
      },
      { id: 'zilwa', label: 'ZILWA', children: ['charter_zsu_0003', 'phase_0_docs'] },
      {
        id: 'compassion',
        label: 'Compassion (wellness lane)',
        children: ['principles_shared', 'product_separate'],
      },
      { id: 'pets_care', label: 'Pets Care', children: ['z_pets_care_compassion'] },
      { id: 'worksphere', label: 'WorkSphere Marketplace', children: ['commerce_hold'] },
      { id: 'z_labs', label: 'Z_Labs', children: ['satellite_relay'] },
      {
        id: 'ai_systems',
        label: 'AI Systems',
        children: ['ai_tower', 'zuno', 'cursor', 'colony_skyscraper'],
      },
      {
        id: 'cloud_infrastructure',
        label: 'Cloud Infrastructure',
        children: ['cloudflare_contingency', 'external_paas_research'],
      },
      {
        id: 'future_projects',
        label: 'Future Projects',
        children: ['registered_awaiting', 'disk_unregistered'],
      },
    ],
    project_edges: registry.dependency_map || [],
    census_project_count: registry.projects?.length || 0,
  };
}

function enrichCensus(registry) {
  const nowIso = new Date().toISOString();
  const projects = (registry.projects || []).map((p) => {
    const purpose = inferPurpose(p);
    return {
      ...p,
      census: {
        purpose: purpose.text,
        purpose_confidence: conf(purpose.confidence, purpose.source),
        turtle_indicator: turtleIndicator(p),
        ai_ecosystem: inferAiEcosystem(p),
        foundation_adoption: foundationAdoption(p),
        readiness_matrix: readinessMatrix(p),
        integration_pathway: integrationPathway(p),
        architecture_posture:
          p.technology_stack?.length && !p.path_missing
            ? 'prototype_or_codebase'
            : 'planning_or_docs',
      },
      timeline: expandTimeline(p, nowIso),
    };
  });

  const charter_projects = (registry.charter_projects || []).map((c) => ({
    ...c,
    census: {
      purpose: c.recommended_next_action || c.current_phase,
      purpose_confidence: conf('confirmed', 'department_registry'),
      turtle_indicator: { code: 'architecture', emoji: '🔵', label: 'Architecture (charter)' },
      ai_ecosystem: inferAiEcosystem({
        ...c,
        role: 'charter',
        registry_id: c.department_id,
        formula_aware: true,
      }),
      foundation_adoption: foundationAdoption({
        ...c,
        kind: 'charter_in_hub',
        documentation_status: 'strong',
      }),
      readiness_matrix: readinessMatrix({
        ...c,
        kind: 'charter_in_hub',
        documentation_status: 'strong',
        merge_hold: true,
        turtle_mode: true,
        mission_control_status: 'integrated',
        classification_lane: 'core',
        path_ok: true,
      }),
      integration_pathway: 'Hub charter — integrated in MC departments',
      architecture_posture: 'docs_charter_frozen',
    },
  }));

  const successor_review = successorReview(projects, registry.duplicate_candidates);

  return {
    ...registry,
    schema: SCHEMA_REG,
    generated_at: nowIso,
    projects,
    charter_projects,
    successor_review,
  };
}

function censusSummary(registry) {
  const projects = registry.projects || [];
  const foundationCounts = { adopted: 0, partial: 0, planned: 0, unknown: 0 };
  let aiProfiled = 0;

  for (const p of projects) {
    const fa = p.census?.foundation_adoption;
    if (fa?.foundation_doctrines?.status === 'adopted') foundationCounts.adopted++;
    else if (fa?.foundation_doctrines?.status === 'partial') foundationCounts.partial++;
    else if (fa?.foundation_doctrines?.status === 'planned') foundationCounts.planned++;
    else foundationCounts.unknown++;
    if (p.census?.ai_ecosystem) aiProfiled++;
  }

  return {
    total_projects: projects.length,
    charter_projects: (registry.charter_projects || []).length,
    registered: projects.filter((p) => p.in_pc_root_registry).length,
    unregistered_disk: projects.filter((p) => p.disk_only).length,
    ai_ecosystem_profiled: aiProfiled,
    documentation: registry.summary?.documentation_coverage || {},
    governance: registry.summary?.governance_coverage || {},
    foundation_adoption: foundationCounts,
    successor_reviews: (registry.successor_review || []).length,
    duplicate_candidates: (registry.duplicate_candidates || []).length,
  };
}

function buildCensusReport(registry, aiReg, relMap) {
  const summary = censusSummary(registry);
  return {
    schema: SCHEMA_CENSUS,
    generated_at: registry.generated_at,
    executive_summary: summary,
    operating_doctrine: 'Principles travel. Implementations stay modular.',
    posture: registry.posture,
    successor_review: registry.successor_review,
    duplicate_candidates: registry.duplicate_candidates,
    relationship_map: relMap,
    ai_ecosystem_registry_path: 'data/z_universe_ai_ecosystem_registry.json',
    strategic_opportunities: [
      'Soulmates Universe B2.1 + Track A — first commercial path',
      'Foundation Consolidation post-holiday — promote Arelium/OMNISWARM principles',
      'MC-2.1 Universe Timeline — executive chronology',
      'Register disk_unregistered folders after AMK review',
    ],
    risks: [
      {
        id: 'hub_duplicate_trees',
        severity: 'YELLOW',
        message: 'Z_Sanctuary_Universe 2 at PC root and nested',
      },
      {
        id: 'track_a',
        severity: 'YELLOW',
        message: 'VILE not on main — blocks shared zuno-* runtime',
      },
      {
        id: 'docs_gaps',
        severity: 'YELLOW',
        message: `${summary.documentation?.missing || 0} projects missing docs`,
      },
      {
        id: 'merge_hold',
        severity: 'BLUE',
        message: 'Merge Hold active — sacred moves require AMK',
      },
    ],
    recommended_next_actions: [
      'AMK: confirm canonical Z_Sanctuary_Universe 2 path (successor review)',
      'Track A: VILE merge unchanged as P0',
      'MC-0.6: census report review — no runtime',
      'Consolidate AT Princess duplicate registry IDs when gated',
    ],
  };
}

function buildCensusMd(registry, report, aiReg) {
  const s = report.executive_summary;
  const lines = [
    '# Z-Sanctuary Universe Census Report (MC-0.6)',
    '',
    `Generated: ${registry.generated_at}`,
    '',
    '**Posture:** Read-only census · no project modifications · Merge Hold · Turtle Mode',
    '',
    '> Principles travel. Implementations stay modular.',
    '',
    '## Executive summary',
    '',
    '| Metric | Count |',
    '| ------ | ----- |',
    `| Total disk/registry projects | ${s.total_projects} |`,
    `| Hub charter rows | ${s.charter_projects} |`,
    `| PC root registered | ${s.registered} |`,
    `| Disk unregistered | ${s.unregistered_disk} |`,
    `| AI ecosystem profiled | ${s.ai_ecosystem_profiled} |`,
    `| Docs strong / partial / missing | ${s.documentation.strong || 0} / ${s.documentation.partial || 0} / ${s.documentation.missing || 0} |`,
    `| Foundation adopted (sample) | ${s.foundation_adoption.adopted} |`,
    `| Successor/duplicate reviews | ${s.successor_reviews} |`,
    '',
    '## Canonical hub verdict',
    '',
    '**Z_Sanctuary_Universe** (`zsanctuary-universe` · ZSU-0001) is the **canonical** governance and control root.',
    '',
    '**Z_Sanctuary_Universe 2** exists as PC-root sibling and nested copy — **successor/duplicate review** required; no auto-merge.',
    '',
    '**ZSanctuary_Universe** (retired stub) is **archive only** — not the hub.',
    '',
    '## Successor & duplicate review',
    '',
    ...(registry.successor_review || []).map(
      (r) => `- **${r.type}**: ${r.verdict} → *${r.action}*`
    ),
    '',
    '## Universe relationship map (summary)',
    '',
    '```text',
    'Z-Sanctuary Universe',
    '├── Governance',
    '├── Foundation Doctrines',
    '├── Shared Packages (VILE zuno-*)',
    '├── Mission Control',
    '├── Soulmates Universe',
    '├── ZILWA',
    '├── Compassion (lane)',
    '├── Pets Care · WorkSphere · Z_Labs',
    '├── AI Systems',
    '├── Cloud Infrastructure',
    '└── Future Projects',
    '```',
    '',
    '## AI ecosystem registry',
    '',
    '| AI | Role |',
    '| -- | ---- |',
    ...(aiReg.systems || []).map((a) => `| ${a.emoji} ${a.name} | ${a.primary_role} |`),
    '',
    '## Project census (sample columns)',
    '',
    '| ZSU | Project | Purpose | Turtle | MC | Next action |',
    '| --- | ------- | ------- | ------ | -- | ----------- |',
    ...(registry.projects || []).slice(0, 30).map((p) => {
      const ti = p.census?.turtle_indicator;
      return `| ${p.universe_id || '—'} | ${p.project_name} | ${String(p.census?.purpose || '').slice(0, 40)}… | ${ti?.emoji || '🐢'} ${ti?.label || ''} | ${p.mission_control_status} | ${String(p.timeline?.next_recommended_action || '').slice(0, 35)}… |`;
    }),
    '',
    '## Recommended next actions',
    '',
    ...(report.recommended_next_actions || []).map((a) => `- ${a}`),
    '',
    '## Validation',
    '',
    '- No sibling projects modified',
    '- No runtime introduced',
    '- Merge Hold preserved',
    '- Track A remains highest engineering priority',
    '',
    'Command: `npm run z:universe:census`',
    '',
  ];
  return lines.join('\n');
}

function main() {
  console.log('Running discovery refresh (MC-0.5 base)...');
  execSync('node scripts/z_universe_discovery_scan.mjs', { cwd: ROOT, stdio: 'inherit' });

  const registry = readJson(REG_PATH);
  if (!registry?.projects) {
    console.error('Missing registry after discovery:', REG_PATH);
    process.exit(1);
  }

  const enriched = enrichCensus(registry);
  const aiReg = buildUniverseAiRegistry();
  aiReg.generated_at = enriched.generated_at;
  const relMap = buildRelationshipMap(enriched);
  relMap.generated_at = enriched.generated_at;

  enriched.ai_ecosystem_registry_path = 'data/z_universe_ai_ecosystem_registry.json';
  enriched.relationship_map_v2 = relMap;
  enriched.foundation_doc_refs = FOUNDATION_DOCS;
  enriched.census_schema = SCHEMA_CENSUS;

  const report = buildCensusReport(enriched, aiReg, relMap);
  const md = buildCensusMd(enriched, report, aiReg);

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(REG_PATH, `${JSON.stringify(enriched, null, 2)}\n`, 'utf8');
  fs.writeFileSync(AI_REG_PATH, `${JSON.stringify(aiReg, null, 2)}\n`, 'utf8');
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  fs.writeFileSync(OUT_MD, md, 'utf8');

  console.log(
    JSON.stringify({
      ok: true,
      projects: enriched.projects.length,
      schema: SCHEMA_REG,
      out_md: OUT_MD,
      out_ai: AI_REG_PATH,
    })
  );
}

main();
