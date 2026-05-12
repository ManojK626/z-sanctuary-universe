#!/usr/bin/env node
/**
 * Z-DEPLOYMENT-READINESS-OVERSEER-1 — Read-only deployment posture rollup (no deploy, no unsafe execution).
 * Reads hub registries and existing report JSON only. Writes only:
 *   data/reports/z_deployment_readiness_status.{json,md}
 * Does not: deploy, run Cloudflare production, mutate external services, scan arbitrary folders,
 * connect devices, touch secrets, auto-fix, auto-merge, or spawn autonomous agents.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = process.cwd();

const POLICY_PATH = path.join(ROOT, 'data', 'z_deployment_readiness_scoring_policy.json');
const PROJ_REG_PATH = path.join(ROOT, 'data', 'z_deployment_readiness_project_registry.json');
const PC_ROOT_PATH = path.join(ROOT, 'data', 'z_pc_root_projects.json');
const MODULE_MANIFEST = path.join(ROOT, 'data', 'z_module_manifest.json');
const PKG_PATH = path.join(ROOT, 'package.json');
const AI_BUILDER = path.join(ROOT, 'docs', 'AI_BUILDER_CONTEXT.md');
const GROWTH = path.join(ROOT, 'data', 'z_ecosystem_growth_stage_registry.json');
const CF_IDENTITY = path.join(ROOT, 'data', 'z_cloudflare_contingency_identity.json');
const SATELLITE = path.join(ROOT, 'data', 'z_satellite_control_link_manifest.json');
const DOORWAY_REG = path.join(ROOT, 'data', 'z_doorway_workspace_registry.json');

const R_CYCLE = path.join(ROOT, 'data', 'reports', 'z_cycle_observe_status.json');
const R_PC_ACT = path.join(ROOT, 'data', 'reports', 'z_pc_activation_receipt.json');
const R_DRIFT = path.join(ROOT, 'data', 'reports', 'z_crystal_dna_drift_report.json');
const R_ANY = path.join(ROOT, 'data', 'reports', 'z_anydevice_simulation_report.json');
const R_TRAFFIC = path.join(ROOT, 'data', 'reports', 'z_traffic_minibots_status.json');
const R_DASH = path.join(ROOT, 'data', 'reports', 'z_dashboard_registry_verify.json');
const R_DOOR = path.join(ROOT, 'data', 'reports', 'z_doorway_workspace_status.json');
const R_CTRL = path.join(ROOT, 'data', 'reports', 'z_control_link_sync_report.json');

const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_deployment_readiness_status.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_deployment_readiness_status.md');
const SCHEMA = 'z_deployment_readiness_status_v1';

function readJsonSafe(p) {
  try {
    return { ok: true, data: JSON.parse(fs.readFileSync(p, 'utf8')), path: p };
  } catch (e) {
    return { ok: false, error: String(e?.message || e), path: p };
  }
}

function fileMtimeIso(p) {
  try {
    if (!fs.existsSync(p)) return null;
    return fs.statSync(p).mtime.toISOString();
  } catch {
    return null;
  }
}

function hoursSince(iso) {
  if (!iso) return null;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return null;
  return (Date.now() - t) / (3600 * 1000);
}

function bandForScore(policy, score) {
  const s = Math.max(0, Math.min(100, Math.round(score)));
  const bands = policy?.readiness_bands || [];
  for (const b of bands) {
    if (s >= b.min && s <= b.max) return b;
  }
  return { label: 'unknown', estimated_build_phase: 'unknown' };
}

function signalRank(s) {
  const u = String(s || '').toUpperCase();
  const R = {
    RED: 5,
    QUARANTINE: 4,
    HOLD: 4,
    NAS_WAIT: 4,
    YELLOW: 3,
    BLUE: 2,
    GREEN: 1,
    UNKNOWN: 0,
  };
  return R[u] ?? 0;
}

function worstSignal(a, b) {
  return signalRank(a) >= signalRank(b)
    ? String(a || 'UNKNOWN').toUpperCase()
    : String(b || 'UNKNOWN').toUpperCase();
}

function countVerifyScripts(pkg) {
  const scripts = pkg?.scripts && typeof pkg.scripts === 'object' ? pkg.scripts : {};
  const keys = Object.keys(scripts);
  const pick = keys.filter((n) => {
    const c = String(scripts[n] || '');
    if (/^verify:/i.test(n)) return true;
    if (
      [
        'z:traffic',
        'z:car2',
        'z:crystal:dna:drift',
        'z:anydevice:simulate',
        'z:doorway:status',
        'z:control-links:dry',
        'z:cycle:observe',
        'z:pc:activation',
        'z:deployment:readiness',
      ].includes(n)
    )
      return true;
    if (/z_registry_omni_verify|z_sanctuary_structure_verify|dashboard:registry-verify/i.test(c))
      return true;
    return false;
  });
  return { count: pick.length, sample: pick.sort().slice(0, 48) };
}

function listPhaseReceipts() {
  const docsDir = path.join(ROOT, 'docs');
  if (!fs.existsSync(docsDir)) return { count: 0, newest_mtime: null };
  const names = fs.readdirSync(docsDir).filter((n) => /^PHASE_.*GREEN_RECEIPT\.md$/i.test(n));
  let newest = null;
  for (const n of names) {
    const st = fs.statSync(path.join(docsDir, n));
    if (!newest || st.mtimeMs > newest) newest = st.mtimeMs;
  }
  return { count: names.length, newest_mtime: newest ? new Date(newest).toISOString() : null };
}

function doorwayEntryCount(reg) {
  const e = reg?.entries ?? reg?.workspaces ?? reg?.doors;
  if (Array.isArray(e)) return e.length;
  if (Array.isArray(reg?.profiles)) return reg.profiles.length;
  return null;
}

function satelliteRollup(manifest) {
  const sats = Array.isArray(manifest?.satellites) ? manifest.satellites : [];
  let nasWait = 0;
  let enabled = 0;
  for (const s of sats) {
    if (String(s?.status || '').toUpperCase() === 'NAS_WAIT') nasWait += 1;
    if (s?.enabled === true) enabled += 1;
  }
  return { total: sats.length, enabled, nas_wait: nasWait };
}

function moduleStatusSeed(policy, status) {
  const m = policy?.module_status_seed || {};
  const k = String(status || 'default').toLowerCase();
  if (m[k] != null) return m[k];
  return m.default ?? 30;
}

function buildGlobalInputs(
  policy,
  pkg,
  {
    cycle,
    pcAct,
    drift,
    anyd,
    traffic,
    dash,
    doorRep,
    doorReg,
    sat,
    ctrl,
    cf,
    growth,
    receipts,
    aiBuilderMtime,
  }
) {
  const adj = policy?.ecosystem_readiness_adjustments || {};
  const obsSig = cycle.ok
    ? String(cycle.data.overall_observer_signal || '').toUpperCase()
    : 'UNKNOWN';
  const trSig = traffic.ok
    ? String(
        traffic.data.traffic_chief?.overall_signal || traffic.data.overall_signal || ''
      ).toUpperCase()
    : 'UNKNOWN';
  const drSig = drift.ok ? String(drift.data.overall_signal || '').toUpperCase() : 'UNKNOWN';
  const dashSt = dash.ok ? String(dash.data.status || '').toLowerCase() : 'unknown';
  const anyWarn = anyd.ok && Array.isArray(anyd.data.warnings) ? anyd.data.warnings.length : 0;

  let ecosystem_signal = 'GREEN';
  ecosystem_signal = worstSignal(ecosystem_signal, trSig);
  ecosystem_signal = worstSignal(ecosystem_signal, drSig);
  if (dashSt && dashSt !== 'green')
    ecosystem_signal = worstSignal(ecosystem_signal, dashSt === 'hold' ? 'YELLOW' : 'RED');
  if (anyWarn > 0) ecosystem_signal = worstSignal(ecosystem_signal, 'YELLOW');
  if (obsSig && obsSig !== 'GREEN')
    ecosystem_signal = worstSignal(ecosystem_signal, obsSig === 'BLUE' ? 'BLUE' : obsSig);

  const satR = satelliteRollup(sat.ok ? sat.data : {});
  if (satR.nas_wait > 0) ecosystem_signal = worstSignal(ecosystem_signal, 'BLUE');

  const cycleAge = hoursSince(cycle.ok ? cycle.data.generated_at : null);
  const driftAge = hoursSince(drift.ok ? drift.data.generated_at : null);
  const trafficAge = hoursSince(
    traffic.ok ? traffic.data.timestamp || traffic.data.generated_at : null
  );

  const stale = [];
  const conf = policy?.confidence || {};
  if (cycleAge != null && cycleAge > (conf.stale_report_hours_red || 240)) {
    stale.push({
      report: 'z_cycle_observe_status.json',
      hours: Math.round(cycleAge),
      severity: 'red',
    });
  } else if (cycleAge != null && cycleAge > (conf.stale_report_hours_yellow || 96)) {
    stale.push({
      report: 'z_cycle_observe_status.json',
      hours: Math.round(cycleAge),
      severity: 'yellow',
    });
  }

  let cloudflare_posture = 'CONTINGENCY_PREVIEW_HOLD';
  if (cf.ok && Array.isArray(cf.data?.purpose)) {
    cloudflare_posture = 'DOCUMENTED_CONTINGENCY_ONLY_NO_PRODUCTION_DEPLOY';
  }

  return {
    ecosystem_signal,
    cycle_observe: {
      present: cycle.ok,
      overall_observer_signal: cycle.ok ? (cycle.data.overall_observer_signal ?? null) : null,
      task_queue_length:
        cycle.ok && Array.isArray(cycle.data.task_queue) ? cycle.data.task_queue.length : null,
      generated_at: cycle.ok ? (cycle.data.generated_at ?? null) : null,
      age_hours: cycleAge != null ? Math.round(cycleAge * 10) / 10 : null,
    },
    pc_activation_receipt: {
      present: pcAct.ok,
      generated_at: pcAct.ok ? (pcAct.data.generated_at ?? null) : null,
    },
    crystal_dna_drift: {
      present: drift.ok,
      overall_signal: drift.ok ? (drift.data.overall_signal ?? null) : null,
      generated_at: drift.ok ? (drift.data.generated_at ?? null) : null,
      age_hours: driftAge != null ? Math.round(driftAge * 10) / 10 : null,
    },
    anydevice_simulation: {
      present: anyd.ok,
      warnings_count: anyWarn,
      simulations_count:
        anyd.ok && Array.isArray(anyd.data.simulations) ? anyd.data.simulations.length : null,
      generated_at: anyd.ok ? (anyd.data.generated_at ?? null) : null,
    },
    traffic_minibots: {
      present: traffic.ok,
      overall_signal: traffic.ok
        ? (traffic.data.traffic_chief?.overall_signal ?? traffic.data.overall_signal ?? null)
        : null,
      age_hours: trafficAge != null ? Math.round(trafficAge * 10) / 10 : null,
    },
    dashboard_registry_verify: {
      present: dash.ok,
      status: dash.ok ? (dash.data.status ?? null) : null,
      totals: dash.ok ? (dash.data.totals ?? null) : null,
      generated_at: dash.ok ? (dash.data.generated_at ?? null) : null,
    },
    doorway: {
      report_present: doorRep.ok,
      registry_path: 'data/z_doorway_workspace_registry.json',
      registry_entry_count: doorReg.ok ? doorwayEntryCount(doorReg.data) : null,
      overall_signal: doorRep.ok ? (doorRep.data.overall_signal ?? null) : null,
    },
    control_link: {
      sync_report_present: ctrl.ok,
      satellite_manifest: sat.ok
        ? {
            total: satR.total,
            enabled: satR.enabled,
            nas_wait: satR.nas_wait,
          }
        : { missing: true },
    },
    cloudflare: {
      posture: cloudflare_posture,
      identity_doc: 'data/z_cloudflare_contingency_identity.json',
      present: cf.ok,
    },
    docs_readiness: {
      phase_green_receipt_count: receipts.count,
      newest_phase_receipt_iso: receipts.newest_mtime,
      ai_builder_context_mtime: aiBuilderMtime,
    },
    ai_builder_awareness: {
      doc_path: 'docs/AI_BUILDER_CONTEXT.md',
      growth_registry_sealed_count:
        growth.ok && Array.isArray(growth.data?.sealed_systems)
          ? growth.data.sealed_systems.length
          : null,
    },
    hub_verification_scripts: countVerifyScripts(pkg),
    report_staleness_warnings: stale,
    adjustments_reference: adj,
  };
}

function applyEcosystemCaps(policy, baseScore, global) {
  let s = baseScore;
  const adj = policy?.ecosystem_readiness_adjustments || {};
  const obs = String(global.cycle_observe.overall_observer_signal || '').toUpperCase();
  const tr = String(global.traffic_minibots.overall_signal || '').toUpperCase();
  const dr = String(global.crystal_dna_drift.overall_signal || '').toUpperCase();
  const st = String(global.dashboard_registry_verify.status || '').toLowerCase();
  const anyW = global.anydevice_simulation.warnings_count || 0;
  const nasW = global.control_link.satellite_manifest?.nas_wait || 0;

  if (obs === 'BLUE' && adj.cycle_observe_blue_cap != null)
    s = Math.min(s, adj.cycle_observe_blue_cap);
  if (obs && obs !== 'GREEN' && obs !== 'BLUE') s -= adj.cycle_observe_non_green_penalty || 0;
  if (tr === 'RED') s -= adj.traffic_red_penalty || 0;
  else if (tr === 'YELLOW') s -= adj.traffic_yellow_penalty || 0;
  if (dr && dr !== 'GREEN') s -= adj.drift_non_green_penalty || 0;
  if (st && st !== 'green') s -= adj.dashboard_registry_not_green_penalty || 0;
  if (anyW > 0) s -= adj.anydevice_warning_penalty || 0;
  if (nasW > 0) s -= adj.nas_wait_satellite_penalty || 0;

  for (const w of global.report_staleness_warnings || []) {
    if (w.severity === 'yellow') s -= policy?.confidence?.stale_yellow_penalty || 0;
    if (w.severity === 'red') s -= policy?.confidence?.stale_red_penalty || 0;
  }

  const cap = policy?.automated_readiness_cap ?? 95;
  return Math.max(0, Math.min(cap, Math.round(s)));
}

function confidenceFor(policy, global, { pathOk, pkgOk }) {
  const c = policy?.confidence || {};
  let conf = c.base ?? 55;
  const bonus = Math.min(
    c.per_hub_verify_script_cap ?? 14,
    (global.hub_verification_scripts?.count || 0) * 2
  );
  conf += bonus;
  if (pkgOk) conf += c.sibling_package_json_found_bonus ?? 0;
  for (const w of global.report_staleness_warnings || []) {
    if (w.severity === 'yellow') conf -= c.stale_yellow_penalty ?? 6;
    if (w.severity === 'red') conf -= c.stale_red_penalty ?? 12;
  }
  if (!pathOk) conf -= 20;
  return Math.max(c.min_confidence ?? 16, Math.min(c.max_confidence ?? 96, Math.round(conf)));
}

function deploymentStatusLabel(policy, { readiness, pathOk, role, entityKind, ecosystemSignal }) {
  const L = policy?.deployment_status_labels || {};
  if (entityKind === 'hub_module') return L.module_manifest || 'HUB_MODULE_MANIFEST_ROW_ONLY';
  if (!pathOk && role !== 'hub') return L.path_hold || 'HOLD_UNREGISTERED_OR_EXTERNAL_PATH';
  if (['RED', 'QUARANTINE'].includes(String(ecosystemSignal || '').toUpperCase()))
    return L.signal_hold || 'HOLD_ECOSYSTEM_SIGNALS';
  if (readiness >= 61) return L.local_pilot || 'LOCAL_PILOT_REVIEW_ONLY';
  return L.observe_only || 'OBSERVE_ONLY_NOT_DEPLOYABLE';
}

function relatedReportsForEntity(projectId) {
  const base = [
    'data/reports/z_deployment_readiness_status.json',
    'data/reports/z_cycle_observe_status.json',
    'data/reports/z_pc_activation_receipt.json',
  ];
  if (projectId === 'zsanctuary-universe') {
    return [
      ...base,
      'data/reports/z_traffic_minibots_status.json',
      'data/reports/z_crystal_dna_drift_report.json',
      'data/reports/z_anydevice_simulation_report.json',
      'data/reports/z_dashboard_registry_verify.json',
      'data/reports/z_doorway_workspace_status.json',
      'data/reports/z_control_link_sync_report.json',
    ];
  }
  return base;
}

function main() {
  const policyR = readJsonSafe(POLICY_PATH);
  if (!policyR.ok) {
    console.error(JSON.stringify({ ok: false, error: policyR.error }));
    process.exit(1);
  }
  const policy = policyR.data;

  const projRegR = readJsonSafe(PROJ_REG_PATH);
  const projReg = projRegR.ok ? projRegR.data : {};

  const pcR = readJsonSafe(PC_ROOT_PATH);
  if (!pcR.ok) {
    console.error(
      JSON.stringify({ ok: false, error: 'z_pc_root_projects.json required', detail: pcR.error })
    );
    process.exit(1);
  }
  const pcRoot = String(pcR.data.pc_root || '').replace(/\\/g, '/');
  const projectsRaw = Array.isArray(pcR.data.projects) ? pcR.data.projects : [];
  const seen = new Map();
  for (const p of projectsRaw) {
    const id = p?.id;
    if (!id || seen.has(id)) continue;
    seen.set(id, p);
  }
  const projects = [...seen.values()];

  const modR = readJsonSafe(MODULE_MANIFEST);
  const modules = modR.ok && Array.isArray(modR.data.ZModules) ? modR.data.ZModules : [];

  const pkgR = readJsonSafe(PKG_PATH);
  const pkg = pkgR.ok ? pkgR.data : {};

  const cycle = readJsonSafe(R_CYCLE);
  const pcAct = readJsonSafe(R_PC_ACT);
  const drift = readJsonSafe(R_DRIFT);
  const anyd = readJsonSafe(R_ANY);
  const traffic = readJsonSafe(R_TRAFFIC);
  const dash = readJsonSafe(R_DASH);
  const doorRep = readJsonSafe(R_DOOR);
  const doorReg = readJsonSafe(DOORWAY_REG);
  const sat = readJsonSafe(SATELLITE);
  const ctrl = readJsonSafe(R_CTRL);
  const cf = readJsonSafe(CF_IDENTITY);
  const growth = readJsonSafe(GROWTH);
  const receipts = listPhaseReceipts();
  const aiBuilderMtime = fileMtimeIso(AI_BUILDER);

  const global = buildGlobalInputs(policy, pkg, {
    cycle,
    pcAct,
    drift,
    anyd,
    traffic,
    dash,
    doorRep,
    doorReg,
    sat,
    ctrl,
    cf,
    growth,
    receipts,
    aiBuilderMtime,
  });

  const overrides =
    projReg?.overrides && typeof projReg.overrides === 'object' ? projReg.overrides : {};
  const defaultOwner = projReg?.default_owner_overseer || 'Z-EAII roster';
  const defaultGate =
    projReg?.default_required_human_gate ||
    'AMK-Goku for merge, deploy, NAS-class moves, billing, and production edge bind';

  const entities = [];
  const roleSeeds = policy?.role_readiness_seed || {};

  for (const p of projects) {
    const id = p.id;
    const relPath = String(p.path || '').trim();
    const abs =
      relPath && pcRoot
        ? path.join(pcRoot.replace(/\//g, path.sep), relPath.replace(/\//g, path.sep))
        : '';
    const pathOk = Boolean(relPath && abs && fs.existsSync(abs));
    let pkgOk = false;
    if (pathOk) {
      try {
        pkgOk = fs.existsSync(path.join(abs, 'package.json'));
      } catch {
        pkgOk = false;
      }
    }

    const role = String(p.role || 'member').toLowerCase();
    let seed = roleSeeds[role] ?? roleSeeds.member ?? 38;
    if (role === 'hub') seed = roleSeeds.hub ?? 48;
    if (role === 'external') seed = roleSeeds.external ?? 28;

    let readiness = seed;
    if (!pathOk)
      readiness = Math.min(
        readiness,
        policy?.ecosystem_readiness_adjustments?.path_missing_cap ?? 36
      );
    if (role === 'external')
      readiness = Math.min(
        readiness,
        policy?.ecosystem_readiness_adjustments?.external_role_cap ?? 44
      );

    readiness = applyEcosystemCaps(policy, readiness, global);
    const band = bandForScore(policy, readiness);
    const conf = confidenceFor(policy, global, { pathOk, pkgOk: role === 'hub' ? true : pkgOk });
    const ov = overrides[id] || {};
    const blockers = [];
    if (!pathOk)
      blockers.push(
        'Registry path missing or not present on this machine — no local proof folder.'
      );
    if (role === 'external')
      blockers.push(
        'External / link-only lane — hub deployment readiness does not imply hosted app proof.'
      );
    if (String(global.crystal_dna_drift.overall_signal || '').toUpperCase() === 'BLUE')
      blockers.push(
        'Crystal DNA drift rollup BLUE — review drift report before widening execution.'
      );
    if ((global.anydevice_simulation.warnings_count || 0) > 0)
      blockers.push(
        'AnyDevice simulation reported warnings — keep synthetic posture; no real devices from this lane.'
      );

    const next_safe_tasks = [
      'npm run z:deployment:readiness',
      'npm run z:pc:activation',
      'npm run z:cycle:observe',
      'npm run verify:md',
      'npm run z:traffic',
      'npm run z:car2',
    ];
    if (!pathOk)
      next_safe_tasks.push(
        'Register or restore local path in data/z_pc_root_projects.json after operator verification.'
      );

    entities.push({
      entity_kind: 'pc_project',
      project_id: id,
      project_name: p.name || id,
      path: relPath || '(empty — link-only or unregistered)',
      path_resolved: pathOk ? abs.replace(/\\/g, '/') : null,
      owner_overseer: ov.owner_overseer || defaultOwner,
      maturity_stage: band.label,
      readiness_percent: readiness,
      confidence_percent: conf,
      deployment_status: deploymentStatusLabel(policy, {
        readiness,
        pathOk,
        role,
        entityKind: 'pc_project',
        ecosystemSignal: global.ecosystem_signal,
      }),
      blockers,
      next_safe_tasks,
      estimated_build_phase: band.estimated_build_phase,
      required_human_gate: ov.required_human_gate || defaultGate,
      related_reports: relatedReportsForEntity(id),
      related_docs: Array.isArray(ov.related_docs)
        ? [
            ...ov.related_docs,
            'docs/Z_DEPLOYMENT_READINESS_OVERSEER.md',
            'docs/AI_BUILDER_CONTEXT.md',
          ]
        : [
            'docs/Z_DEPLOYMENT_READINESS_OVERSEER.md',
            'docs/AI_BUILDER_CONTEXT.md',
            'docs/Z_ECOSYSTEM_GROWTH_STATUS.md',
          ],
      registry_role: p.role || null,
      local_package_json_present: role === 'hub' ? true : pkgOk,
    });
  }

  for (const m of modules) {
    const mid = `module:${m.ZId}`;
    const st = m.ZStatus || 'default';
    let readiness = moduleStatusSeed(policy, st);
    readiness = applyEcosystemCaps(policy, readiness, global);
    const band = bandForScore(policy, readiness);
    const conf = confidenceFor(policy, global, { pathOk: true, pkgOk: true });
    entities.push({
      entity_kind: 'hub_module',
      project_id: mid,
      project_name: m.ZDescription ? `${m.ZId} — ${m.ZDescription}` : m.ZId,
      path: '(hub manifest row — data/z_module_manifest.json)',
      path_resolved: null,
      owner_overseer: m.ZOwner ? `Module owner: ${m.ZOwner}` : defaultOwner,
      maturity_stage: band.label,
      readiness_percent: readiness,
      confidence_percent: conf,
      deployment_status:
        policy?.deployment_status_labels?.module_manifest || 'HUB_MODULE_MANIFEST_ROW_ONLY',
      blockers:
        String(st).toLowerCase() === 'planned'
          ? ['Module status planned — no runtime deployment implied from manifest alone.']
          : [],
      next_safe_tasks: [
        'npm run z:registry:sync',
        'npm run z:deployment:readiness',
        'docs/Z-MASTER-MODULES-REGISTER.md alignment under separate human-gated PR',
      ],
      estimated_build_phase: band.estimated_build_phase,
      required_human_gate: defaultGate,
      related_reports: [
        'data/reports/z_deployment_readiness_status.json',
        'data/reports/z_zuno_coverage_audit.json',
      ],
      related_docs: [
        projReg.hub_module_doc_anchor || 'docs/Z-MASTER-MODULES-REGISTER.md',
        'docs/Z_DEPLOYMENT_READINESS_OVERSEER.md',
      ],
      module_layer: m.ZLayer || null,
      module_status: st,
    });
  }

  const pcEntities = entities.filter((e) => e.entity_kind === 'pc_project');
  const modEntities = entities.filter((e) => e.entity_kind === 'hub_module');
  const meanPc =
    pcEntities.length > 0
      ? Math.round(pcEntities.reduce((a, e) => a + e.readiness_percent, 0) / pcEntities.length)
      : null;
  const meanMod =
    modEntities.length > 0
      ? Math.round(modEntities.reduce((a, e) => a + e.readiness_percent, 0) / modEntities.length)
      : null;

  const hubRow = pcEntities.find((e) => e.project_id === 'zsanctuary-universe');
  const hub_indicator_readiness_percent = hubRow ? hubRow.readiness_percent : meanPc;

  const generated_at = new Date().toISOString();
  const out = {
    schema: SCHEMA,
    phase: 'Z-DEPLOYMENT-READINESS-OVERSEER-1',
    generated_at,
    law: policy.law,
    global_readiness: global,
    rollups: {
      ecosystem_signal: global.ecosystem_signal,
      mean_readiness_percent_pc_projects: meanPc,
      mean_readiness_percent_hub_modules: meanMod,
      hub_indicator_readiness_percent,
      entity_counts: { pc_projects: pcEntities.length, hub_modules: modEntities.length },
      automated_readiness_cap: policy?.automated_readiness_cap ?? 95,
      automated_readiness_cap_note: policy?.automated_readiness_cap_note || null,
    },
    entities,
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(out, null, 2) + '\n', 'utf8');

  const md = [];
  md.push('# Z-DEPLOYMENT-READINESS-OVERSEER-1');
  md.push('');
  md.push(`**Generated:** ${generated_at}`);
  md.push(`**Ecosystem signal (advisory):** ${global.ecosystem_signal}`);
  md.push(`**Mean readiness (PC projects):** ${meanPc == null ? 'n/a' : `${meanPc}%`}`);
  md.push(`**Mean readiness (hub modules):** ${meanMod == null ? 'n/a' : `${meanMod}%`}`);
  md.push(
    `**Hub indicator readiness:** ${hub_indicator_readiness_percent == null ? 'n/a' : `${hub_indicator_readiness_percent}%`}`
  );
  md.push('');
  md.push('## Law');
  md.push('');
  md.push(String(policy.law || '').trim());
  md.push('');
  md.push('## PC projects (registry-driven)');
  md.push('');
  md.push('| project_id | readiness | confidence | deployment_status | maturity_stage |');
  md.push('| --- | ---: | ---: | --- | --- |');
  for (const e of pcEntities) {
    md.push(
      `| ${e.project_id} | ${e.readiness_percent}% | ${e.confidence_percent}% | ${e.deployment_status} | ${e.maturity_stage} |`
    );
  }
  md.push('');
  md.push('## Hub modules (manifest rows)');
  md.push('');
  md.push(`Count: **${modEntities.length}** (see JSON for full rows).`);
  md.push('');
  md.push('## Commands (refresh receipts)');
  md.push('');
  md.push('```bash');
  md.push('npm run z:deployment:readiness');
  md.push('npm run z:pc:activation');
  md.push('npm run z:cycle:observe');
  md.push('npm run verify:md');
  md.push('npm run z:traffic');
  md.push('npm run z:car2');
  md.push('```');
  md.push('');
  fs.writeFileSync(OUT_MD, md.join('\n') + '\n', 'utf8');

  console.log(JSON.stringify({ ok: true, wrote: [OUT_JSON, OUT_MD], rollups: out.rollups }));
}

main();
