#!/usr/bin/env node
/**
 * Z-UNIVERSE-DISCOVERY-1 — MC-0.5 read-only PC workspace discovery.
 * Scans ONLY configured pc_root from data/z_pc_root_projects.json + registry rows.
 * Writes: data/z_universe_project_registry.json, data/reports/z_universe_discovery_report.{json,md}
 * Does NOT: modify/delete/move projects, merge repos, deploy, or bypass governance.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PC_JSON = path.join(ROOT, 'data', 'z_pc_root_projects.json');
const DEPT_REG = path.join(ROOT, 'data', 'z_universe_department_registry.json');
const ECOSYSTEM_REG = path.join(ROOT, 'data', 'z_ecosystem_awareness_registry.json');
const INDICATORS = path.join(ROOT, 'dashboard', 'data', 'amk_project_indicators.json');
const ID_MAP = path.join(ROOT, 'data', 'z_universe_id_map.json');
const OUT_REG = path.join(ROOT, 'data', 'z_universe_project_registry.json');
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_universe_discovery_report.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_universe_discovery_report.md');
const SCHEMA_REG = 'z_universe_project_registry_v1_1';
const SCHEMA_REPORT = 'z_universe_discovery_report_v1_1';

/** Hub charter departments receive immutable IDs before disk projects (MC-0.5b). */
const CHARTER_DEPT_IDS = new Set(['zilwa', 'z_connect', 'vile', 'z_nexus_engine']);

const SKIP_TOP_LEVEL = new Set(['node_modules', '.cursor', '.git']);

const CORE_IDS = new Set(['zsanctuary-universe', 'z-sanctuary-universe-2-pc-root', 'z-labs']);

const ARCHIVE_IDS = new Set(['zsanctuary-universe-stub-retired', 'z-pets-care-compassion']);

const RESEARCH_IDS = new Set([
  'z-sanctuary-external-paas',
  'z-sanctuary-replit',
  'replit-roulette-z-amk-goku-mdcp',
]);

const CORE_DISK_NAMES = new Set(['Z_Sanctuary_Universe', 'Z_Sanctuary_Universe 2', 'Z_Labs']);

function readJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function norm(s) {
  return String(s || '')
    .replace(/\\/g, '/')
    .trim()
    .toLowerCase();
}

function gitProbe(abs) {
  if (!abs || !fs.existsSync(abs)) {
    return { is_git: false, branch: '', head: '', dirty: null, status: 'path_missing' };
  }
  try {
    execSync('git rev-parse --is-inside-work-tree', {
      cwd: abs,
      encoding: 'utf8',
      timeout: 6000,
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    const branch = execSync('git branch --show-current', {
      cwd: abs,
      encoding: 'utf8',
      timeout: 6000,
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    const head = execSync('git rev-parse --short HEAD', {
      cwd: abs,
      encoding: 'utf8',
      timeout: 6000,
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    const dirty = Boolean(
      execSync('git status --porcelain', {
        cwd: abs,
        encoding: 'utf8',
        timeout: 6000,
        stdio: ['ignore', 'pipe', 'ignore'],
      }).trim()
    );
    return { is_git: true, branch, head, dirty, status: 'ok' };
  } catch {
    return { is_git: false, branch: '', head: '', dirty: null, status: 'not_a_repo' };
  }
}

function detectStack(abs) {
  if (!abs || !fs.existsSync(abs)) return [];
  const stack = [];
  const checks = [
    ['package.json', 'node/javascript'],
    ['pnpm-lock.yaml', 'pnpm'],
    ['requirements.txt', 'python'],
    ['pyproject.toml', 'python'],
    ['pubspec.yaml', 'flutter/dart'],
    ['Cargo.toml', 'rust'],
    ['go.mod', 'go'],
    ['pom.xml', 'java/maven'],
  ];
  for (const [f, label] of checks) {
    if (fs.existsSync(path.join(abs, f))) stack.push(label);
  }
  if (fs.existsSync(path.join(abs, 'packages'))) stack.push('monorepo');
  if (fs.existsSync(path.join(abs, 'dashboard'))) stack.push('dashboard');
  return [...new Set(stack)];
}

function docProbe(abs) {
  if (!abs || !fs.existsSync(abs)) {
    return { readme: false, docs_dir: false, docs_count: 0, coverage: 'missing' };
  }
  const readme = ['README.md', 'readme.md', 'Readme.md'].some((f) =>
    fs.existsSync(path.join(abs, f))
  );
  const docsPath = path.join(abs, 'docs');
  let docs_count = 0;
  let docs_dir = false;
  if (fs.existsSync(docsPath) && fs.statSync(docsPath).isDirectory()) {
    docs_dir = true;
    try {
      docs_count = fs
        .readdirSync(docsPath, { withFileTypes: true })
        .filter((d) => d.isFile() && d.name.endsWith('.md')).length;
    } catch {
      docs_count = 0;
    }
  }
  let coverage = 'minimal';
  if (readme && docs_dir && docs_count >= 5) coverage = 'strong';
  else if (readme || docs_dir) coverage = 'partial';
  else coverage = 'missing';
  return { readme, docs_dir, docs_count, coverage };
}

function classifyLane(meta) {
  if (
    ARCHIVE_IDS.has(meta.id) ||
    meta.role === 'retired_stub' ||
    meta.migration_status === 'stub'
  ) {
    return 'archive';
  }
  if (CORE_IDS.has(meta.id) || CORE_DISK_NAMES.has(meta.disk_name)) {
    return 'core';
  }
  if (RESEARCH_IDS.has(meta.id) || meta.hosting === 'replit' || meta.role === 'external') {
    return meta.path_missing ? 'unknown' : 'research';
  }
  if (meta.path_missing && meta.role === 'external') return 'unknown';
  if (meta.path_missing) return 'unknown';
  if (meta.role === 'hub' || meta.id === 'zsanctuary-universe') return 'core';
  const stack = meta.technology_stack || [];
  if (stack.length === 0 && !meta.doc_probe?.readme) return 'unknown';
  if (meta.notes?.includes('stub') || meta.migration_status === 'stub') return 'archive';
  return 'growing';
}

const MC_INTEGRATED_REGISTRY_IDS = new Set(['zsanctuary-universe']);

function missionControlStatus(meta, deptIds, inIndicators) {
  if (MC_INTEGRATED_REGISTRY_IDS.has(meta.registry_id)) return 'integrated';
  if (meta.integration === 'integrated_department') return 'integrated';
  if (meta.registry_id && meta.on_disk) return 'registered_awaiting_integration';
  if (meta.disk_only) return 'disk_unregistered';
  if (meta.role === 'external' && !meta.path) return 'link_only_external';
  if (inIndicators) return 'registered_awaiting_integration';
  return 'unknown';
}

function statusSignals(meta) {
  const lane = meta.classification_lane;
  const docs = meta.documentation_status;
  return {
    architecture:
      meta.registry_id === 'zsanctuary-universe' || (lane === 'core' && meta.path_ok)
        ? 'GREEN'
        : lane === 'archive'
          ? 'BLUE'
          : 'YELLOW',
    governance: meta.merge_hold !== false ? 'GREEN' : 'UNKNOWN',
    documentation: docs === 'strong' ? 'GREEN' : docs === 'partial' ? 'YELLOW' : 'RED',
    development: meta.repository_status?.is_git ? 'YELLOW' : 'UNKNOWN',
    testing: meta.technology_stack?.includes('node/javascript') ? 'YELLOW' : 'UNKNOWN',
    security: lane === 'core' ? 'GREEN' : 'UNKNOWN',
    commercial: meta.commercial_status || 'UNKNOWN',
    deployment: 'RED',
    overall_status: meta.path_missing ? 'RED' : meta.path_ok ? 'YELLOW' : 'UNKNOWN',
  };
}

function listPcRootDirs(pcRoot) {
  try {
    return fs
      .readdirSync(pcRoot, { withFileTypes: true })
      .filter((d) => d.isDirectory() && !SKIP_TOP_LEVEL.has(d.name))
      .map((d) => d.name)
      .sort();
  } catch (e) {
    return { error: String(e.message || e), dirs: [] };
  }
}

function pathKey(p) {
  return norm(p).replace(/\/+$/, '');
}

function loadIdMap() {
  const raw = readJson(ID_MAP);
  if (raw?.assignments && typeof raw.next_sequence === 'number') return raw;
  return {
    schema: 'z_universe_id_map_v1',
    law_note: 'Immutable Universe IDs — never reassign, never reuse.',
    next_sequence: 8,
    assignments: {},
  };
}

function saveIdMap(idMap) {
  fs.mkdirSync(path.dirname(ID_MAP), { recursive: true });
  fs.writeFileSync(ID_MAP, `${JSON.stringify(idMap, null, 2)}\n`, 'utf8');
}

function stableKey(meta) {
  if (meta.registry_id) return meta.registry_id;
  if (meta.suggested_registry_id) return meta.suggested_registry_id;
  return `disk:${pathKey(meta.local_root_path)}`;
}

function assignUniverseId(key, displayName, idMap, nowIso) {
  const existing = idMap.assignments[key];
  if (existing?.universe_id) {
    if (displayName && !existing.display_name) existing.display_name = displayName;
    return existing.universe_id;
  }
  const seq = idMap.next_sequence;
  const universe_id = `ZSU-${String(seq).padStart(4, '0')}`;
  idMap.next_sequence = seq + 1;
  idMap.assignments[key] = {
    universe_id,
    stable_key: key,
    display_name: displayName || key,
    first_discovered: nowIso.slice(0, 10),
    assigned_at: nowIso,
  };
  return universe_id;
}

function lastActivityProbe(abs, git) {
  if (!abs || !fs.existsSync(abs)) {
    return { iso: null, source: 'none', confidence: 'unknown' };
  }
  let best = null;
  let source = 'filesystem';
  for (const f of ['package.json', 'README.md', 'AGENTS.md']) {
    const fp = path.join(abs, f);
    if (fs.existsSync(fp)) {
      const m = fs.statSync(fp).mtime.toISOString();
      if (!best || m > best) {
        best = m;
        source = f;
      }
    }
  }
  if (git?.is_git) {
    try {
      const log = execSync('git log -1 --format=%cI', {
        cwd: abs,
        encoding: 'utf8',
        timeout: 6000,
        stdio: ['ignore', 'pipe', 'ignore'],
      }).trim();
      if (log && (!best || log > best)) {
        best = log;
        source = 'git_last_commit';
      }
    } catch {
      /* ignore */
    }
  }
  return {
    iso: best,
    source,
    confidence: best ? 'confirmed' : 'unknown',
  };
}

function conf(level, source) {
  return { level, source };
}

function buildConfidence(meta, activity) {
  const nameSource = meta.in_pc_root_registry
    ? 'z_pc_root_projects.json'
    : meta.disk_only
      ? 'disk_scan'
      : 'unknown';
  const pathLevel = meta.path_missing
    ? 'unknown'
    : meta.in_pc_root_registry
      ? 'confirmed'
      : 'inferred';
  const stackLevel =
    meta.technology_stack?.length && !meta.technology_stack.includes('unknown')
      ? 'inferred'
      : 'unknown';
  const docLevel =
    meta.documentation_status === 'strong'
      ? 'confirmed'
      : meta.documentation_status === 'partial'
        ? 'inferred'
        : 'unknown';
  const gitLevel = meta.repository_status?.is_git
    ? meta.repository_status.branch
      ? 'confirmed'
      : 'inferred'
    : meta.path_missing
      ? 'unknown'
      : 'inferred';

  return {
    universe_id: conf('confirmed', 'z_universe_id_map.json'),
    project_name: conf(meta.in_pc_root_registry ? 'confirmed' : 'inferred', nameSource),
    local_root_path: conf(pathLevel, meta.in_pc_root_registry ? 'registry_path' : 'disk_listing'),
    classification_lane: conf(
      meta.classification_lane === 'unknown' ? 'unknown' : 'inferred',
      'discovery_heuristics'
    ),
    documentation_status: conf(docLevel, 'doc_probe'),
    technology_stack: conf(stackLevel, 'stack_probe'),
    repository_status: conf(gitLevel, 'git_probe'),
    last_activity: conf(activity.confidence, activity.source),
    mission_control_status: conf('inferred', 'department_and_indicator_registry'),
  };
}

function buildTimeline(meta, idMap, key, nowIso, activity) {
  const assignment = idMap.assignments[key];
  return {
    first_discovered: assignment?.first_discovered || nowIso.slice(0, 10),
    last_reviewed: nowIso.slice(0, 10),
    last_activity: activity.iso ? activity.iso.slice(0, 10) : null,
    lifecycle_stage: meta.current_phase || meta.classification_lane || 'unknown',
  };
}

function enrichProject(meta, idMap, nowIso) {
  const key = stableKey(meta);
  meta.stable_key = key;
  meta.universe_id = assignUniverseId(key, meta.project_name, idMap, nowIso);
  const activity = lastActivityProbe(meta.absolute_path, meta.repository_status);
  meta.timeline = buildTimeline(meta, idMap, key, nowIso, activity);
  meta.confidence = buildConfidence(meta, activity);
  meta.last_review = meta.timeline.last_reviewed;
  meta.last_activity = meta.timeline.last_activity;
  return meta;
}

function buildCharterProjects(deptReg, idMap, nowIso) {
  const rows = [];
  for (const d of deptReg?.departments || []) {
    if (!CHARTER_DEPT_IDS.has(d.id)) continue;
    const key = `charter:${d.id}`;
    const universe_id = assignUniverseId(key, d.display_name, idMap, nowIso);
    rows.push({
      universe_id,
      stable_key: key,
      kind: 'charter_in_hub',
      project_name: d.display_name,
      registry_id: key,
      department_id: d.id,
      system_id: d.system_id,
      local_root_path: '',
      classification_lane: 'core',
      mission_control_status: 'integrated',
      current_phase: d.default_phase,
      merge_hold: d.merge_hold !== false,
      turtle_mode: true,
      runtime_coupling: false,
      recommended_next_action: d.recommended_next,
      status_doc: d.status_doc,
      handbook_doc: d.handbook_doc,
      timeline: {
        first_discovered: idMap.assignments[key]?.first_discovered || nowIso.slice(0, 10),
        last_reviewed: nowIso.slice(0, 10),
        last_activity: null,
        lifecycle_stage: d.default_phase,
      },
      confidence: {
        universe_id: conf('confirmed', 'z_universe_id_map.json'),
        project_name: conf('confirmed', 'z_universe_department_registry.json'),
        lifecycle_stage: conf('confirmed', 'department_default_phase'),
        last_activity: conf('unknown', 'charter_in_hub_no_disk_root'),
      },
    });
  }
  return rows.sort((a, b) => a.universe_id.localeCompare(b.universe_id));
}

function findDuplicateCandidates(projects) {
  const byPath = new Map();
  const dups = [];
  for (const p of projects) {
    const key = pathKey(p.local_root_path);
    if (!key) continue;
    if (byPath.has(key)) {
      dups.push({
        path: p.local_root_path,
        project_ids: [byPath.get(key).registry_id, p.registry_id].filter(Boolean),
        reason: 'same_local_path_multiple_registry_ids',
      });
    } else {
      byPath.set(key, p);
    }
  }
  const hubNested = projects.filter((p) =>
    p.local_root_path?.includes('Z_Sanctuary_Universe/Z_Sanctuary_Universe 2')
  );
  if (hubNested.length) {
    dups.push({
      path: 'Z_Sanctuary_Universe/Z_Sanctuary_Universe 2 vs Z_Sanctuary_Universe 2',
      project_ids: ['z-sanctuary-universe-2-continuation', 'z-sanctuary-universe-2-pc-root'],
      reason: 'duplicate_continuation_tree',
    });
  }
  return dups;
}

function buildDependencyHints(projects) {
  const hub = projects.find((p) => p.registry_id === 'zsanctuary-universe');
  const hints = [];
  if (hub) {
    hints.push({
      from: 'zsanctuary-universe',
      to: 'all_members',
      type: 'governance_hub',
      note: 'Canonical control root',
    });
  }
  const labs = projects.find((p) => p.registry_id === 'z-labs');
  if (labs)
    hints.push({
      from: 'z-labs',
      to: 'zsanctuary-universe',
      type: 'markdown_relay',
      note: 'Satellite control link',
    });
  const vileNote = projects.find((p) => p.registry_id === 'zsanctuary-universe');
  if (vileNote)
    hints.push({
      from: 'vile_packages',
      to: 'zsanctuary-universe/packages',
      type: 'shared_packages',
      note: 'Hub monorepo packages',
    });
  const zConnect = {
    from: 'z-connect_charter',
    to: 'zsanctuary-universe/docs/z-connect',
    type: 'hub_docs',
    note: 'No runtime coupling',
  };
  hints.push(zConnect);
  return hints;
}

function recommendedAction(meta) {
  if (meta.path_missing) return 'Restore path or archive registry row — human gate';
  if (meta.disk_only) return 'Register in z_pc_root_projects.json after AMK review';
  if (meta.classification_lane === 'unknown') return 'Add README/docs; classify lane after review';
  if (meta.mission_control_status === 'registered_awaiting_integration') {
    return 'Visible in registry — awaiting Mission Control department mapping';
  }
  if (meta.registry_id === 'zsanctuary-universe') return 'Track A: VILE merge · protect Merge Hold';
  return 'Turtle Mode — observe; no runtime coupling without charter';
}

function probeRegistryRow(row, pcRoot, deptIds, indicatorIds) {
  const rel = row.path || '';
  const abs = rel ? path.join(pcRoot, rel.replace(/\//g, path.sep)) : '';
  const path_ok = Boolean(rel && fs.existsSync(abs));
  const path_missing = Boolean(rel && !path_ok);
  const git = gitProbe(path_ok ? abs : null);
  const stack = detectStack(path_ok ? abs : null);
  const doc = docProbe(path_ok ? abs : null);
  const disk_name = rel ? rel.split('/')[0] : '';

  const meta = {
    registry_id: row.id,
    project_name: row.name,
    local_root_path: rel ? rel.replace(/\\/g, '/') : '',
    absolute_path: path_ok ? abs : '',
    description: row.notes || '',
    technology_stack: stack,
    repository_status: git,
    role: row.role || 'member',
    hosting: row.hosting || 'local',
    path_ok,
    path_missing,
    on_disk: path_ok,
    disk_only: false,
    disk_name,
    documentation_status: doc.coverage,
    doc_probe: doc,
    testing_status: stack.includes('node/javascript')
      ? 'package.json present — verify unknown'
      : 'unknown',
    commercial_status: row.notes?.includes('Commerce HOLD') ? 'HOLD' : 'unknown',
    security_status: row.role === 'hub' ? 'hub_governance' : 'unknown',
    integration_status: deptIds.has(row.id)
      ? 'department_linked'
      : row.formula_aware
        ? 'eaii_registered'
        : 'registry_only',
    related_departments: [],
    dependencies: row.role === 'hub' ? [] : ['zsanctuary-universe'],
    known_risks: path_missing ? ['path_missing_on_disk'] : [],
    merge_hold: true,
    runtime_coupling: false,
    turtle_mode: true,
    migration_status: row.migration_status || '',
    in_pc_root_registry: true,
    in_ecosystem_awareness: false,
    in_mission_control_departments: deptIds.has(row.id),
    in_amk_indicators: indicatorIds.has(row.id) || indicatorIds.has(row.name),
  };

  meta.classification_lane = classifyLane(meta);
  meta.mission_control_status = missionControlStatus(meta, deptIds, meta.in_amk_indicators);
  meta.status_dimensions = statusSignals(meta);
  meta.current_phase =
    meta.classification_lane === 'core' && row.role === 'hub' ? 'Foundation' : 'Turtle / observe';
  meta.recommended_next_action = recommendedAction(meta);
  meta.last_review = new Date().toISOString().slice(0, 10);
  meta.owner = 'AMK-Goku';
  meta.priority =
    meta.classification_lane === 'core' ? 'high' : meta.path_missing ? 'review' : 'normal';
  meta.notes = row.notes || '';

  return meta;
}

function probeDiskOnly(name, pcRoot, registeredPaths) {
  const rel = name;
  const abs = path.join(pcRoot, name);
  if (!fs.existsSync(abs)) return null;
  const key = pathKey(rel);
  if (registeredPaths.has(key)) return null;

  const git = gitProbe(abs);
  const stack = detectStack(abs);
  const doc = docProbe(abs);
  const slug = norm(name)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const meta = {
    registry_id: '',
    project_name: name,
    local_root_path: rel,
    absolute_path: abs,
    description: 'Discovered on disk — not in z_pc_root_projects.json',
    technology_stack: stack,
    repository_status: git,
    role: 'discovered',
    hosting: 'local',
    path_ok: true,
    path_missing: false,
    on_disk: true,
    disk_only: true,
    disk_name: name,
    documentation_status: doc.coverage,
    doc_probe: doc,
    testing_status: 'unknown',
    commercial_status: 'unknown',
    security_status: 'unknown',
    integration_status: 'unregistered',
    related_departments: [],
    dependencies: [],
    known_risks: ['not_in_pc_root_registry'],
    merge_hold: true,
    runtime_coupling: false,
    turtle_mode: true,
    in_pc_root_registry: false,
    in_ecosystem_awareness: false,
    in_mission_control_departments: false,
    in_amk_indicators: false,
    suggested_registry_id: `discovered-${slug}`,
  };

  meta.classification_lane = CORE_DISK_NAMES.has(name)
    ? 'core'
    : classifyLane({ ...meta, id: slug, path_missing: false });
  meta.mission_control_status = 'disk_unregistered';
  meta.status_dimensions = statusSignals(meta);
  meta.current_phase = 'Discovered — needs registration';
  meta.recommended_next_action = 'Register in z_pc_root_projects.json after AMK review';
  meta.last_review = new Date().toISOString().slice(0, 10);
  meta.owner = 'AMK-Goku';
  meta.priority = 'review';
  meta.notes = 'MC-0.5 disk discovery';

  return meta;
}

function summarize(projects) {
  const lanes = { core: 0, growing: 0, research: 0, archive: 0, unknown: 0 };
  const integration = {
    integrated: 0,
    registered_awaiting_integration: 0,
    disk_unregistered: 0,
    link_only_external: 0,
    unknown: 0,
  };
  let docsStrong = 0;
  let docsPartial = 0;
  let docsMissing = 0;
  let governanceMergeHold = 0;

  for (const p of projects) {
    lanes[p.classification_lane] = (lanes[p.classification_lane] || 0) + 1;
    integration[p.mission_control_status] = (integration[p.mission_control_status] || 0) + 1;
    if (p.documentation_status === 'strong') docsStrong++;
    else if (p.documentation_status === 'partial') docsPartial++;
    else docsMissing++;
    if (p.merge_hold) governanceMergeHold++;
  }

  return {
    total_registered_projects: projects.length,
    classification: lanes,
    integration,
    documentation_coverage: { strong: docsStrong, partial: docsPartial, missing: docsMissing },
    governance_coverage: {
      merge_hold_active: governanceMergeHold,
      turtle_mode: projects.filter((p) => p.turtle_mode).length,
      no_runtime_coupling: projects.filter((p) => !p.runtime_coupling).length,
    },
  };
}

function main() {
  const pcData = readJson(PC_JSON);
  if (!pcData?.projects) {
    console.error('Invalid', PC_JSON);
    process.exit(1);
  }

  const pcRoot = path.resolve(
    String(pcData.pc_root || path.join(ROOT, '..')).replace(/\//g, path.sep)
  );
  const deptReg = readJson(DEPT_REG);
  const ecoReg = readJson(ECOSYSTEM_REG);
  const indicators = readJson(INDICATORS);

  const deptIds = new Set((deptReg?.departments || []).map((d) => d.id));
  const ecoIds = new Set((ecoReg?.projects || []).map((p) => p.project_id));
  const indicatorIds = new Set();
  for (const row of indicators?.indicators || indicators?.rows || []) {
    if (row?.id) indicatorIds.add(row.id);
    if (row?.project_id) indicatorIds.add(row.project_id);
  }

  const registeredPaths = new Set();
  for (const row of pcData.projects) {
    if (row.path) registeredPaths.add(pathKey(row.path));
  }

  const projects = pcData.projects.map((row) => {
    const p = probeRegistryRow(row, pcRoot, deptIds, indicatorIds);
    p.in_ecosystem_awareness = ecoIds.has(row.id) || ecoIds.has(row.name);
    return p;
  });

  const diskList = listPcRootDirs(pcRoot);
  const diskNames = Array.isArray(diskList) ? diskList : diskList.dirs || [];
  for (const name of diskNames) {
    const extra = probeDiskOnly(name, pcRoot, registeredPaths);
    if (extra) projects.push(extra);
  }

  const nowIso = new Date().toISOString();
  const idMap = loadIdMap();
  for (let i = 0; i < projects.length; i += 1) {
    projects[i] = enrichProject(projects[i], idMap, nowIso);
  }
  saveIdMap(idMap);

  const charter_projects = buildCharterProjects(deptReg, idMap, nowIso);

  const summary = summarize(projects);
  const duplicate_candidates = findDuplicateCandidates(projects);
  const dependency_map = buildDependencyHints(projects);

  const missing_from_mission_control = projects
    .filter((p) => p.mission_control_status !== 'integrated' && p.on_disk)
    .map((p) => ({
      project_name: p.project_name,
      registry_id: p.registry_id || p.suggested_registry_id,
      status: p.mission_control_status,
      recommended_next_action: p.recommended_next_action,
    }));

  const registry = {
    schema: SCHEMA_REG,
    generated_at: new Date().toISOString(),
    pc_root: pcRoot.replace(/\\/g, '/'),
    hub: pcData.hub || 'Z_Sanctuary_Universe',
    law_note:
      'Read-only discovery registry. Observer/orchestrator — no runtime coupling. Changes to PC projects require human gate.',
    posture: {
      merge_hold: true,
      turtle_mode: true,
      runtime_authorized: false,
      no_project_modifications: true,
    },
    summary,
    duplicate_candidates,
    dependency_map,
    missing_from_mission_control,
    id_map_path: 'data/z_universe_id_map.json',
    charter_projects,
    'rojects,'
  };''

  const report = {
    schema: SCHEMA_REPORT,
    generated_at: registry.generated_at,
    executive_summary: {
      total_discovered: projects.length,
      on_disk: projects.filter((p) => p.on_disk).length,
      path_missing: projects.filter((p) => p.path_missing).length,
      disk_unregistered: projects.filter((p) => p.disk_only).length,
      classification: summary.classification,
      integration: summary.integration,
    },
    already_integrated: projects.filter((p) => p.mission_control_status === 'integrated'),
    registered_awaiting: projects.filter(
      (p) => p.mission_control_status === 'registered_awaiting_integration'
    ),
    future_candidates: projects.filter((p) => p.classification_lane === 'growing'),
    archived_references: projects.filter((p) => p.classification_lane === 'archive'),
    documentation_gaps: projects.filter((p) => p.documentation_status === 'missing'),
    risks: [
      {
        id: 'merge_hold',
        severity: 'BLUE',
        message: 'Merge Hold active — sacred moves require AMK gate',
      },
      {
        id: 'duplicate_trees',
        severity: 'YELLOW',
        message: 'Z_Sanctuary_Universe 2 exists nested and at PC root',
      },
      {
        id: 'path_missing',
        severity: 'YELLOW',
        message: `${projects.filter((p) => p.path_missing).length} registry paths missing on disk`,
      },
      {
        id: 'disk_unregistered',
        severity: 'YELLOW',
        message: `${projects.filter((p) => p.disk_only).length} disk folders not in registry`,
      },
    ],
    recommendations: [
      'Review disk_unregistered folders — register in z_pc_root_projects.json after AMK gate',
      'Consolidate duplicate registry ids (at-princess-blackie-copilot / copitol)',
      'Clarify canonical Z_Sanctuary_Universe 2 path before SSWS promotion',
      'Track A unchanged: VILE merge before application runtime',
      'Re-run npm run z:universe:discovery after registry edits',
    ],
    proposed_next_steps: [
      'AMK review z_universe_discovery_report.md',
      'Register Backups folder purpose or exclude explicitly',
      'MC-1: read-only dashboard overlay from registry JSON (active)',
    ],
    registry_path: 'data/z_universe_project_registry.json',
  };

  fs.mkdirSync(path.dirname(OUT_REG), { recursive: true });
  fs.writeFileSync(OUT_REG, `${JSON.stringify(registry, null, 2)}\n`, 'utf8');
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  const md = [
    '# Z-Sanctuary Universe Discovery Report (MC-0.5)',
    '',
    `Generated: ${registry.generated_at}`,
    '',
    '**Posture:** Read-only discovery · no project modifications · Merge Hold active',
    '',
    '## Executive summary',
    '',
    `| Metric | Count |`,
    `| ------ | ----- |`,
    `| Total projects discovered | ${projects.length} |`,
    `| On disk | ${projects.filter((p) => p.on_disk).length} |`,
    `| Path missing (registry) | ${projects.filter((p) => p.path_missing).length} |`,
    `| Disk unregistered | ${projects.filter((p) => p.disk_only).length} |`,
    '',
    '## Classification breakdown',
    '',
    '| Lane | Count |',
    '| ---- | ----- |',
    ...Object.entries(summary.classification).map(([k, v]) => `| ${k} | ${v} |`),
    '',
    '## Integration coverage',
    '',
    '| Status | Count |',
    '| ------ | ----- |',
    ...Object.entries(summary.integration).map(([k, v]) => `| ${k} | ${v} |`),
    '',
    '## Documentation coverage',
    '',
    `- Strong: ${summary.documentation_coverage.strong}`,
    `- Partial: ${summary.documentation_coverage.partial}`,
    `- Missing: ${summary.documentation_coverage.missing}`,
    '',
    '## Duplicate candidates',
    '',
    ...duplicate_candidates.map(
      (d) => `- **${d.reason}**: ${d.path} (${(d.project_ids || []).join(', ')})`
    ),
    '',
    '## Missing from Mission Control (on disk)',
    '',
    ...missing_from_mission_control.slice(0, 25).map((m) => `- ${m.project_name} — ${m.status}`),
    '',
    '## All projects',
    '',
    '| Project | Universe ID | Lane | On disk | MC status | Docs | Next action |',
    '| ------- | ----------- | ---- | ------- | --------- | ---- | ----------- |',
    ...projects.map(
      (p) =>
        `| ${p.project_name} | ${p.universe_id || '—'} | ${p.classification_lane} | ${p.on_disk ? 'yes' : 'no'} | ${p.mission_control_status} | ${p.documentation_status} | ${String(p.recommended_next_action).slice(0, 60)}… |`
    ),
    '',
    '## Hub charter projects (immutable IDs)',
    '',
    ...charter_projects.map((c) => `- **${c.universe_id}** ${c.project_name} — ${c.current_phase}`),
    '',
    '## Validation',
    '',
    '- No projects modified',
    '- No runtime code introduced in sibling repos',
    '- Merge Hold preserved',
    '- Turtle Mode preserved',
    '',
    'Command: `npm run z:universe:discovery`',
    '',
    'Docs: [Z_UNIVERSE_DISCOVERY_ARCHITECTURE.md](../docs/dashboard/Z_UNIVERSE_DISCOVERY_ARCHITECTURE.md)',
  ];

  fs.writeFileSync(OUT_MD, md.join('\n'), 'utf8');

  console.log(
    JSON.stringify({
      ok: true,
      projects: projects.length,
      disk_unregistered: projects.filter((p) => p.disk_only).length,
      out_registry: OUT_REG,
      out_report: OUT_MD,
    })
  );
}

main();
