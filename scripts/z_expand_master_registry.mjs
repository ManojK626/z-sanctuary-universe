#!/usr/bin/env node
/**
 * One-shot / maintainer: merge hub seed rows + Z_module_registry.json + vision doctrine rows
 * into data/z_master_module_registry.json. Only adds expected_paths when files exist (no invention).
 *
 * Run from repo root: node scripts/z_expand_master_registry.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'data', 'z_master_module_registry.json');
const REG = path.join(ROOT, 'data', 'Z_module_registry.json');

function existsRel(rel) {
  if (!rel || typeof rel !== 'string') return false;
  return fs.existsSync(path.join(ROOT, rel.replace(/\\/g, '/')));
}

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

/** ZId whose canonical hub row uses a different `id`. */
const ZID_ALIASES = new Map([
  ['z-display-morph-engine', 'display_morph_engine'],
  ['z-soundscape-living-pulse', 'soundscape_pulse']
]);

const GAMBLING_ZIDS = new Set(['roulette', 'roulette-calculator']);

/** Doctrine-only rows (empty expected_paths unless user adds paths later). */
const VISION_ADDONS = [
  {
    id: 'soulmate_baby_predictor',
    name: 'Soulmate / baby prediction (concept)',
    category: 'love_social',
    registry_status: 'safety_hold',
    safety_class: 'high',
    required_status: 'planned_or_active',
    expected_paths: [],
    z_registry_zid: null,
    safety_flags: ['consent_sensitive_personal_projection'],
    doc_mentions: [],
    tags: ['vision', 'build_priority:P4'],
    notes: 'Doctrine only. Requires consent boundary doc before any data collection or UX.'
  },
  {
    id: 'zen_scheduler_hub',
    name: 'Zen scheduler / balance planner (concept)',
    category: 'planning_wellness',
    registry_status: 'planned_stub',
    safety_class: 'low',
    required_status: 'planned_or_active',
    expected_paths: [],
    z_registry_zid: null,
    safety_flags: [],
    tags: ['vision', 'build_priority:P5'],
    notes: 'Placeholder doctrine; wire real paths after spec.'
  },
  {
    id: 'z_gadget_mirrors_product',
    name: 'Z-Gadget Mirrors (hardware concept)',
    category: 'products_gadgets',
    registry_status: 'doctrine_only',
    safety_class: 'medium',
    required_status: 'planned_or_active',
    expected_paths: [],
    tags: ['vision']
  },
  {
    id: 'gps_safety_module',
    name: 'GPS / location safety posture (concept)',
    category: 'safety_emergency',
    registry_status: 'safety_hold',
    safety_class: 'high',
    required_status: 'planned_or_active',
    expected_paths: [],
    safety_flags: ['location_privacy_emergency_only'],
    doc_mentions: [
      {
        path: 'docs/safety/LOCATION_CAMERA_MIC_BOUNDARY.md',
        tokens: ['location', 'consent']
      }
    ],
    tags: ['vision', 'risk:location']
  },
  {
    id: 'gambling_prediction_voice',
    name: 'Gambling / prediction narration (concept)',
    category: 'gaming_compliance',
    registry_status: 'safety_hold',
    safety_class: 'high',
    required_status: 'planned_or_active',
    expected_paths: [],
    safety_flags: ['no_guaranteed_outcome_claims'],
    doc_mentions: [
      {
        path: 'docs/safety/GAMBLING_PREDICTION_BOUNDARY.md',
        tokens: ['gambling', 'prediction']
      }
    ],
    tags: ['vision', 'risk:gambling']
  },
  {
    id: 'ethical_monetization_layer',
    name: 'Ethical monetization / subscriptions (concept)',
    category: 'economy_monetization',
    registry_status: 'decision_required',
    safety_class: 'medium',
    required_status: 'needs_decision',
    expected_paths: [],
    tags: ['vision', 'governance']
  },
  {
    id: 'global_eco_marketplace_awareness',
    name: 'Eco / marketplace / global awareness spine (concept)',
    category: 'eco_global',
    registry_status: 'doctrine_only',
    safety_class: 'low',
    expected_paths: [],
    tags: ['vision']
  },
  {
    id: 'family_companion_grove',
    name: 'Family companion grove (concept)',
    category: 'family_companion',
    registry_status: 'planned_stub',
    safety_class: 'medium',
    expected_paths: [],
    tags: ['vision']
  },
  {
    id: 'movement_health_coach_lite',
    name: 'Movement / health coaching (non-medical posture)',
    category: 'health_movement',
    registry_status: 'safety_hold',
    safety_class: 'high',
    required_status: 'planned_or_active',
    expected_paths: [],
    safety_flags: ['non_medical_disclaimer'],
    doc_mentions: [
      {
        path: 'docs/safety/NON_MEDICAL_PRODUCT_BOUNDARY.md',
        tokens: ['non-medical', 'disclaimer']
      }
    ],
    tags: ['vision', 'risk:health']
  },
  {
    id: 'media_storytelling_os',
    name: 'Media / creative storytelling OS (concept)',
    category: 'media_creative',
    registry_status: 'doctrine_only',
    safety_class: 'low',
    expected_paths: [],
    tags: ['vision']
  },
  {
    id: 'outreach_pitch_compliance_pack',
    name: 'Docs / outreach / pitch / compliance pack (concept)',
    category: 'docs_outreach',
    registry_status: 'partial',
    safety_class: 'low',
    expected_paths: ['docs/Z-BUILD-GATE-MATRIX.md'],
    tags: ['vision']
  }
];

function mapLayerFamily(layer, zid) {
  const l = String(layer || '').toLowerCase();
  if (GAMBLING_ZIDS.has(zid)) return 'gaming_compliance';
  if (l === 'core') return 'core_engines';
  if (l === 'governance') return 'trust_audit_governance';
  if (l === 'ecosphere') return 'eco_global';
  if (l === 'ai-tower' || l === 'ai-agent') return 'ai_tower_agents';
  if (l === 'ai-companion') return 'family_companion';
  if (l === 'social') return 'love_social';
  if (l === 'games') return 'gaming_modules';
  if (l === 'packages') return 'core_engines';
  if (l === 'ops') return 'trust_audit_governance';
  return 'trust_audit_governance';
}

function entryPathsFromZM(zm) {
  const en = zm.ZEntry && String(zm.ZEntry).trim();
  if (!en) return [];
  /** Single path token from registry (no glob). */
  const norm = en.replace(/\\/g, '/');
  if (norm.includes(' ') || norm.startsWith('http')) return [];
  if (!existsRel(norm)) return [];
  return [norm];
}

function rowFromZModule(zm) {
  const zid = zm.ZId;
  const paths = entryPathsFromZM(zm);
  let registry_status = 'planned_stub';
  let safety_class = 'low';
  const safety_flags = [];

  if (GAMBLING_ZIDS.has(zid)) {
    registry_status = 'safety_hold';
    safety_class = 'high';
    safety_flags.push('gambling_adjacent_compliance');
  } else if (paths.length) {
    registry_status = zm.ZStatus === 'planned' ? 'partial' : 'implemented';
  } else if (String(zm.ZDescription || '').toLowerCase().includes('advisory')) {
    registry_status = 'doctrine_only';
  }

  return {
    id: zid,
    name: zm.ZName || zid,
    category: mapLayerFamily(zm.ZLayer, zid),
    registry_status,
    safety_class,
    required_status: 'planned_or_active',
    expected_paths: paths,
    z_registry_zid: zid,
    safety_flags,
    doc_mentions: [],
    tags: [`z_layer:${zm.ZLayer || 'unknown'}`],
    notes: zm.ZDescription || ''
  };
}

function main() {
  const reg = readJson(REG);
  const existing = readJson(OUT);
  const seedModules = Array.isArray(existing.modules) ? existing.modules : [];

  const byId = new Map();
  for (const m of seedModules) {
    if (m?.id) byId.set(m.id, { ...m });
  }

  /** Link aliases */
  for (const [zid, customId] of ZID_ALIASES) {
    const row = byId.get(customId);
    if (row) row.z_registry_zid = zid;
  }

  const zmods = reg.ZModules || [];
  for (const zm of zmods) {
    const zid = zm.ZId;
    if (!zid) continue;
    if (ZID_ALIASES.has(zid)) continue;
    if (byId.has(zid)) continue;
    byId.set(zid, rowFromZModule(zm));
  }

  for (const v of VISION_ADDONS) {
    if (!byId.has(v.id)) byId.set(v.id, { ...v });
  }

  /** core_engines_registry_datafile: align with new file */
  const coreRow = byId.get('core_engines_registry_datafile');
  if (coreRow) {
    coreRow.registry_status = 'implemented';
    coreRow.required_status = 'planned_or_active';
    coreRow.safety_class = coreRow.safety_class || 'low';
    if (!coreRow.tags) coreRow.tags = [];
    if (!coreRow.tags.includes('registry:engines')) coreRow.tags.push('registry:engines');
  }

  /** enrich mirror + lottery with boundary doc checks */
  const ms = byId.get('mirrorsoul_hub_slice');
  if (ms) {
    ms.doc_mentions = [
      {
        path: 'docs/safety/MIRRORSOUL_PRIVACY_BOUNDARY.md',
        tokens: ['MirrorSoul', 'privacy']
      }
    ];
  }
  const lt = byId.get('public_trust_portal_lottery');
  if (lt) {
    lt.doc_mentions = [
      {
        path: 'docs/safety/LOTTERY_RESPONSIBLE_USE_BOUNDARY.md',
        tokens: ['lottery', 'responsible']
      }
    ];
  }

  /** Seed hub rows: add registry_status if missing */
  for (const [id, row] of byId) {
    if (!row.registry_status) {
      const tp = Array.isArray(row.expected_paths) ? row.expected_paths.length : 0;
      const found = (row.expected_paths || []).filter((p) => existsRel(p)).length;
      if (tp === 0) row.registry_status = 'partial';
      else if (found === tp) row.registry_status = 'implemented';
      else if (found > 0) row.registry_status = 'partial';
      else row.registry_status = 'planned_stub';
    }
    if (!row.safety_class) row.safety_class = row.safety_flags?.length ? 'high' : 'low';
    if (!Array.isArray(row.tags)) row.tags = [];
    if (!row.required_status) row.required_status = 'planned_or_active';
  }

  const modules = [...byId.values()].sort((a, b) => String(a.id).localeCompare(String(b.id)));

  const doc = {
    _meta: {
      ...(existing._meta || {}),
      schema: 'z_master_module_registry_v2',
      purpose:
        'Truth list for scripts/z_zuno_coverage_audit.mjs — merge of hub seeds, Z_module_registry (paths only when files exist), and vision doctrine rows.',
      expansion_tool: 'scripts/z_expand_master_registry.mjs',
      expanded_at: new Date().toISOString()
    },
    modules
  };

  fs.writeFileSync(OUT, JSON.stringify(doc, null, 2), 'utf8');
  console.log(JSON.stringify({ ok: true, out: 'data/z_master_module_registry.json', count: modules.length }, null, 2));
}

main();
