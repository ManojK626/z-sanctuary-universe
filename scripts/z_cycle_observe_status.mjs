#!/usr/bin/env node
/**
 * Z-CYCLE-OBSERVE-1 — Read-only continuous-cycle observer.
 * Reads registries, package.json scripts, and prior reports only.
 * Writes only data/reports/z_cycle_observe_status.{json,md}.
 * Does not execute the task queue, deploy, merge, install, scan disks, or touch NAS/secrets.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = process.cwd();

const POLICY = path.join(ROOT, 'data', 'z_cycle_observe_task_policy.json');
const PKG = path.join(ROOT, 'package.json');
const GROWTH = path.join(ROOT, 'data', 'z_ecosystem_growth_stage_registry.json');
const CRYSTAL = path.join(ROOT, 'data', 'z_crystal_dna_asset_manifest.json');
const ANYDEVICE_CAPSULE = path.join(ROOT, 'data', 'z_anydevice_ai_capsule_registry.json');
const ANYDEVICE_SYNTH = path.join(ROOT, 'data', 'z_anydevice_synthetic_devices.json');
const SATELLITE = path.join(ROOT, 'data', 'z_satellite_control_link_manifest.json');
const DOORWAY = path.join(ROOT, 'data', 'z_doorway_workspace_registry.json');
const R_TRAFFIC = path.join(ROOT, 'data', 'reports', 'z_traffic_minibots_status.json');
const R_CAR2 = path.join(ROOT, 'data', 'reports', 'z_car2_similarity_report.json');
const R_DRIFT = path.join(ROOT, 'data', 'reports', 'z_crystal_dna_drift_report.json');
const R_ANYDEV = path.join(ROOT, 'data', 'reports', 'z_anydevice_simulation_report.json');

const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_cycle_observe_status.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_cycle_observe_status.md');
const SCHEMA = 'z_cycle_observe_status_v1';

function readJsonSafe(p) {
  try {
    return { ok: true, path: p, data: JSON.parse(fs.readFileSync(p, 'utf8')) };
  } catch (e) {
    return { ok: false, path: p, error: String(e?.message || e) };
  }
}

function masterForbidden(policy) {
  const f = policy?.forbidden_observer_actions;
  return Array.isArray(f) ? [...f] : [];
}

function isObserveRelatedScript(name, cmd) {
  const c = String(cmd || '');
  const n = String(name || '');
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
      'z:deployment:readiness',
    ].includes(n)
  )
    return true;
  if (
    /z_registry_omni_verify|z_sanctuary_structure_verify|dashboard:registry-verify|z_execution_enforcer_gate/i.test(
      c
    )
  )
    return true;
  if (
    /z_crystal_dna_drift|z_anydevice_simulate|z_traffic_minibots|z_car2_scan|z_cycle_observe_status|z_deployment_readiness_status/i.test(
      c
    )
  )
    return true;
  return false;
}

function signalRank(s) {
  const u = String(s || '').toUpperCase();
  const R = { RED: 5, QUARANTINE: 4, HOLD: 3, BLUE: 3, NAS_WAIT: 3, YELLOW: 2, GREEN: 1 };
  return R[u] ?? 0;
}

function worstSignal(a, b) {
  return signalRank(a) >= signalRank(b)
    ? String(a || 'UNKNOWN').toUpperCase()
    : String(b || 'UNKNOWN').toUpperCase();
}

function buildTasks({
  policy,
  growth,
  traffic,
  car2,
  drift,
  anydev,
  crystalOk,
  crystalShards,
  doorwayEntries,
  satelliteSats,
  synthCount,
}) {
  const ff = masterForbidden(policy);
  const tasks = [];
  const push = (t) =>
    tasks.push({ ...t, forbidden_auto_actions: [...ff], related_files: t.related_files || [] });

  push({
    task_id: 'observe_reread_cycle_report',
    title: 'Re-read latest cycle observe status after other receipts refresh',
    category: 'L1_READ_ONLY_OBSERVE',
    source_system: 'Z-CYCLE-OBSERVE-1',
    signal: 'GREEN',
    recommended_next_action:
      'Open data/reports/z_cycle_observe_status.json in dashboard or editor; no execution.',
    requires_human: false,
    related_files: ['data/reports/z_cycle_observe_status.json', 'docs/Z_CYCLE_OBSERVE_SYSTEM.md'],
  });

  push({
    task_id: 'refresh_verify_md',
    title: 'Refresh markdown governance receipt',
    category: 'L2_REPORT_REFRESH',
    source_system: 'hub_npm',
    signal: 'GREEN',
    recommended_next_action: 'npm run verify:md',
    requires_human: false,
    related_files: ['package.json'],
  });

  push({
    task_id: 'refresh_traffic_minibots',
    title: 'Refresh traffic minibot status report',
    category: 'L2_REPORT_REFRESH',
    source_system: 'Z-TRAFFIC',
    signal: String(traffic?.overall_signal || 'UNKNOWN').toUpperCase(),
    recommended_next_action: 'npm run z:traffic',
    requires_human: false,
    related_files: ['data/reports/z_traffic_minibots_status.json'],
  });

  push({
    task_id: 'refresh_car2_similarity',
    title: 'Refresh CAR2 similarity scan report',
    category: 'L2_REPORT_REFRESH',
    source_system: 'Z-CAR2',
    signal: car2 && (car2.files_scanned != null || car2.scan) ? 'GREEN' : 'YELLOW',
    recommended_next_action: 'npm run z:car2',
    requires_human: false,
    related_files: ['data/reports/z_car2_similarity_report.json'],
  });

  push({
    task_id: 'refresh_crystal_dna_drift',
    title: 'Refresh Crystal DNA drift awareness report',
    category: 'L2_REPORT_REFRESH',
    source_system: 'Z-CRYSTAL-DNA-3',
    signal: String(drift?.overall_signal || 'UNKNOWN').toUpperCase(),
    recommended_next_action: 'npm run z:crystal:dna:drift',
    requires_human: false,
    related_files: [
      'data/reports/z_crystal_dna_drift_report.json',
      'data/z_crystal_dna_asset_manifest.json',
    ],
  });

  push({
    task_id: 'refresh_anydevice_simulation',
    title: 'Refresh AnyDevice synthetic simulation report',
    category: 'L2_REPORT_REFRESH',
    source_system: 'Z-ANYDEVICE-2',
    signal: (anydev?.warnings && anydev.warnings.length > 0 ? 'YELLOW' : 'GREEN').toUpperCase(),
    recommended_next_action: 'npm run z:anydevice:simulate',
    requires_human: false,
    related_files: [
      'data/reports/z_anydevice_simulation_report.json',
      'data/z_anydevice_synthetic_devices.json',
    ],
  });

  const driftSig = String(drift?.overall_signal || '').toUpperCase();
  if (driftSig && driftSig !== 'GREEN') {
    push({
      task_id: 'proposal_review_crystal_topology',
      title: 'Human review of Crystal DNA drift findings (no auto-repair)',
      category: 'L3_DOC_SYNC_PROPOSAL',
      source_system: 'Z-CRYSTAL-DNA-3',
      signal: driftSig,
      recommended_next_action:
        'Operator reads z_crystal_dna_drift_report.md and updates manifests or posture under separate PR.',
      requires_human: true,
      related_files: [
        'data/reports/z_crystal_dna_drift_report.md',
        'docs/Z_CRYSTAL_DNA_DRIFT_AWARENESS.md',
      ],
    });
  }

  if (traffic && String(traffic.overall_signal || '').toUpperCase() !== 'GREEN') {
    push({
      task_id: 'proposal_triage_traffic_signal',
      title: 'Triage traffic minibot non-GREEN signal',
      category: 'L3_DOC_SYNC_PROPOSAL',
      source_system: 'Z-TRAFFIC',
      signal: String(traffic.overall_signal).toUpperCase(),
      recommended_next_action:
        'Review z_traffic_minibots_status.json and linked indicators; no auto-fix.',
      requires_human: true,
      related_files: ['data/reports/z_traffic_minibots_status.json'],
    });
  }

  push({
    task_id: 'apply_control_links_after_review',
    title: 'Apply thin satellite control-link bridge sync (operator-gated)',
    category: 'L4_HUMAN_APPROVED_APPLY',
    source_system: 'Z-CONTROL-LINK-1',
    signal: 'BLUE',
    recommended_next_action:
      'npm run z:control-links:dry then z:control-links:apply only after explicit human review.',
    requires_human: true,
    related_files: [
      'data/z_satellite_control_link_manifest.json',
      'scripts/z_sync_control_links.mjs',
    ],
  });

  push({
    task_id: 'forbidden_autonomous_deploy',
    title: 'Autonomous deploy / merge / production bind',
    category: 'L5_FORBIDDEN_WITHOUT_CHARTER',
    source_system: 'hub_governance',
    signal: 'RED',
    recommended_next_action: 'Do not automate. AMK/human charter and sacred gates required.',
    requires_human: true,
    related_files: ['AGENTS.md', 'docs/AI_BUILDER_CONTEXT.md'],
  });

  push({
    task_id: 'forbidden_nas_mutation_from_observer',
    title: 'NAS mutation or real device connect from observer lane',
    category: 'L5_FORBIDDEN_WITHOUT_CHARTER',
    source_system: 'Z-CYCLE-OBSERVE-1',
    signal: 'RED',
    recommended_next_action: 'Never. Use chartered NAS and doorway flows only.',
    requires_human: true,
    related_files: ['data/z_cycle_observe_task_policy.json'],
  });

  const rollup = worstSignal(
    worstSignal(traffic?.overall_signal, drift?.overall_signal),
    anydev?.warnings?.length ? 'YELLOW' : 'GREEN'
  );

  return {
    tasks,
    rollup,
    coverage: {
      crystal_shards: crystalShards,
      crystal_manifest_ok: crystalOk,
      doorway_entries: doorwayEntries,
      satellites: satelliteSats,
      synthetic_devices: synthCount,
    },
  };
}

function main() {
  const generated_at = new Date().toISOString();
  const policyR = readJsonSafe(POLICY);
  if (!policyR.ok) {
    console.error(JSON.stringify({ ok: false, error: policyR.error }));
    process.exit(1);
  }
  const policy = policyR.data;
  const forbiddenMaster = masterForbidden(policy);

  const pkgR = readJsonSafe(PKG);
  const growthR = readJsonSafe(GROWTH);
  const crystalR = readJsonSafe(CRYSTAL);
  const adCapR = readJsonSafe(ANYDEVICE_CAPSULE);
  const adSynR = readJsonSafe(ANYDEVICE_SYNTH);
  const satR = readJsonSafe(SATELLITE);
  const doorR = readJsonSafe(DOORWAY);
  const trafficR = readJsonSafe(R_TRAFFIC);
  const car2R = readJsonSafe(R_CAR2);
  const driftR = readJsonSafe(R_DRIFT);
  const anydevR = readJsonSafe(R_ANYDEV);

  const warnings = [];
  [growthR, crystalR, adCapR, adSynR, satR, doorR, trafficR, car2R, driftR, anydevR].forEach(
    (r) => {
      if (!r.ok) warnings.push({ path: path.relative(ROOT, r.path), error: r.error });
    }
  );

  const scripts =
    pkgR.ok && pkgR.data.scripts && typeof pkgR.data.scripts === 'object' ? pkgR.data.scripts : {};
  const scriptNames = Object.keys(scripts);
  const active_verify_scripts = scriptNames.filter((n) => isObserveRelatedScript(n, scripts[n]));

  const growth = growthR.ok ? growthR.data : null;
  const stage = growth?.current_growth_stage || null;
  const sealed_systems = Array.isArray(growth?.sealed_systems) ? growth.sealed_systems : [];
  const comm = growth?.communication_rules || null;
  const ecoFeedback = growth?.ecosystem_feedback || null;
  const turtleLanes = Array.isArray(ecoFeedback?.recommended_next_lanes)
    ? ecoFeedback.recommended_next_lanes
    : [];

  const crystal = crystalR.ok ? crystalR.data : null;
  const shards = Array.isArray(crystal?.shards) ? crystal.shards : [];
  const crystalOk = crystalR.ok;

  const doorwayN = doorR.ok && Array.isArray(doorR.data?.entries) ? doorR.data.entries.length : 0;
  const satN = satR.ok && Array.isArray(satR.data?.satellites) ? satR.data.satellites.length : 0;
  const synthN = adSynR.ok && Array.isArray(adSynR.data?.devices) ? adSynR.data.devices.length : 0;

  const traffic = trafficR.ok ? trafficR.data : null;
  const car2 = car2R.ok ? car2R.data : null;
  const drift = driftR.ok ? driftR.data : null;
  const anydev = anydevR.ok ? anydevR.data : null;

  const { tasks, rollup, coverage } = buildTasks({
    policy,
    growth,
    traffic,
    car2,
    drift,
    anydev,
    crystalOk,
    crystalShards: shards.length,
    doorwayEntries: doorwayN,
    satelliteSats: satN,
    synthCount: synthN,
  });

  const latest_report_signals = {
    z_traffic_minibots_status: traffic
      ? { overall_signal: traffic.overall_signal ?? null, ok: traffic.ok ?? null }
      : { missing: true },
    z_car2_similarity_report: car2
      ? { ok: car2.ok ?? null, files_scanned: car2.files_scanned ?? null }
      : { missing: true },
    z_crystal_dna_drift_report: drift
      ? {
          overall_signal: drift.overall_signal ?? null,
          findings_count: drift.findings_count ?? null,
        }
      : { missing: true },
    z_anydevice_simulation_report: anydev
      ? { simulations: anydev.simulations?.length ?? 0, warnings: anydev.warnings?.length ?? 0 }
      : { missing: true },
  };

  const blocked_or_hold_tasks = tasks.filter((t) => {
    const s = String(t.signal || '').toUpperCase();
    if (t.category === 'L5_FORBIDDEN_WITHOUT_CHARTER') return true;
    if (t.category === 'L4_HUMAN_APPROVED_APPLY') return true;
    if (s === 'RED' || s === 'QUARANTINE' || s === 'HOLD' || s === 'NAS_WAIT') return true;
    if (s === 'BLUE') return true;
    return false;
  });

  const safe_autonomous_candidates = tasks.filter(
    (t) =>
      t.category === 'L1_READ_ONLY_OBSERVE' ||
      (t.category === 'L2_REPORT_REFRESH' && t.requires_human === false)
  );

  const report = {
    schema: SCHEMA,
    phase: 'Z-CYCLE-OBSERVE-1',
    generated_at,
    law: 'Observation tower only. Suggests and classifies; does not execute the task queue.',
    inputs_ok: {
      package_json: pkgR.ok,
      growth_registry: growthR.ok,
      crystal_manifest: crystalR.ok,
      anydevice_capsule: adCapR.ok,
      anydevice_synthetic: adSynR.ok,
      satellite_manifest: satR.ok,
      doorway_registry: doorR.ok,
      report_traffic: trafficR.ok,
      report_car2: car2R.ok,
      report_drift: driftR.ok,
      report_anydevice: anydevR.ok,
    },
    current_ecosystem_stage: stage,
    sealed_systems,
    active_verify_scripts: active_verify_scripts.sort(),
    active_verify_scripts_count: active_verify_scripts.length,
    npm_script_total: scriptNames.length,
    latest_report_signals,
    project_folder_coverage: {
      ...coverage,
      note: 'Counts from known registries only; no arbitrary folder scan.',
    },
    ai_ecosystem_communication_posture: comm,
    ecosystem_feedback: ecoFeedback,
    safe_autonomous_task_candidates: safe_autonomous_candidates.map((t) => t.task_id),
    blocked_hold_blue_red_tasks: blocked_or_hold_tasks.map((t) => ({
      task_id: t.task_id,
      category: t.category,
      signal: t.signal,
      requires_human: t.requires_human,
    })),
    next_recommended_turtle_mode_lanes: [
      ...turtleLanes,
      'cursor/zsanctuary/<one-domain> branches only',
      'Keep read-only observe and report refresh before L4 apply paths',
    ],
    task_queue: tasks,
    warnings,
    policy_ref: 'data/z_cycle_observe_task_policy.json',
    overall_observer_signal: rollup,
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2), 'utf8');

  const md = [
    '# Z-Cycle observe status',
    '',
    `**Generated:** ${generated_at}`,
    `**Schema:** \`${SCHEMA}\``,
    '',
    '## Law',
    '',
    report.law,
    '',
    '## Ecosystem stage',
    '',
    stage
      ? `- **id:** ${stage.id || '—'}\n- **label:** ${stage.label || '—'}`
      : '_Growth registry missing or unreadable._',
    '',
    '## Latest report signals',
    '',
    '```json',
    JSON.stringify(latest_report_signals, null, 2),
    '```',
    '',
    '## Coverage (registry-only)',
    '',
    `- Crystal shards: **${coverage.crystal_shards}** (manifest ok: ${coverage.crystal_manifest_ok})`,
    `- Doorway entries: **${coverage.doorway_entries}**`,
    `- Satellites: **${coverage.satellites}**`,
    `- Synthetic devices: **${coverage.synthetic_devices}**`,
    '',
    `## Observer rollup signal: **${rollup}**`,
    '',
    '## Task queue (do not auto-execute)',
    '',
    '| task_id | category | signal | requires_human |',
    '| ------- | -------- | ------ | -------------- |',
    ...tasks.map(
      (t) =>
        `| ${String(t.task_id).replace(/\|/g, '\\|')} | ${t.category} | ${t.signal} | ${t.requires_human ? 'yes' : 'no'} |`
    ),
    '',
    'Full JSON: `data/reports/z_cycle_observe_status.json`',
    '',
  ].join('\n');

  fs.writeFileSync(OUT_MD, md, 'utf8');

  console.log(
    JSON.stringify(
      {
        ok: true,
        overall_observer_signal: rollup,
        tasks: tasks.length,
        warnings: warnings.length,
        out_json: OUT_JSON,
        out_md: OUT_MD,
      },
      null,
      2
    )
  );
}

main();
