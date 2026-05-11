import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const registryPath = resolve('data', 'z_replica_fabric_registry.json');
const missionsPath = resolve('data', 'examples', 'z_replica_fabric_sample_missions.json');
const reportJsonPath = resolve('data', 'reports', 'z_replica_fabric_report.json');
const reportMdPath = resolve('data', 'reports', 'z_replica_fabric_report.md');
const indicatorPath = resolve('dashboard', 'data', 'amk_project_indicators.json');

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function truthyRisk(obj) {
  if (!obj || typeof obj !== 'object') return false;
  return Object.values(obj).some((v) => v === true || v === 'true' || v === 1 || v === '1');
}

function classifyMission(mission, projectIds, allowedOutputs, replicaClasses) {
  const flags = [];
  const executionRisk = mission.execution_risk ?? {};
  if (truthyRisk(executionRisk)) {
    const keys = Object.keys(executionRisk).filter((k) => executionRisk[k]);
    return { signal: 'RED', reasons: [`execution_risk enabled: ${keys.join(', ') || '(opaque)'}`] };
  }

  const allowedOut = toArray(mission.allowed_outputs);
  const unknownOut = allowedOut.filter((o) => !allowedOutputs.has(String(o)));
  if (unknownOut.length) flags.push(`allowed_outputs not in registry: ${unknownOut.join(', ')}`);

  const rc = mission.replica_class;
  if (rc && !replicaClasses.has(String(rc))) flags.push(`replica_class not in registry: ${rc}`);

  const rb = String(mission.rollback_note ?? '').trim();
  if (!rb) flags.push('rollback_note empty');

  const mk = mission.AMK_gate;
  if (mk === undefined || mk === null || String(mk).trim() === '') flags.push('AMK_gate missing');

  const proj = mission.project_id;
  if (proj && !projectIds.has(String(proj))) flags.push(`project_id not mapped in registry.project_mappings: ${proj}`);

  const prop = mission.proposal_flags ?? {};
  const wantsPersistent = prop.persistent_replica === true;
  const wantsExternal = prop.external_connector_lane === true;

  if (wantsPersistent || wantsExternal) {
    if (flags.length) return { signal: 'YELLOW_OVER_BLUE', reasons: flags.slice() };
    return { signal: 'BLUE', reasons: [wantsPersistent ? 'persistent_replica proposal' : 'external_connector_lane proposal'] };
  }

  if (flags.length) return { signal: 'YELLOW', reasons: flags };

  return { signal: 'GREEN', reasons: ['mock/report-only posture'] };
}

function mergeClassify(primary) {
  if (primary.signal === 'YELLOW_OVER_BLUE') {
    return {
      signal: 'BLUE',
      reasons: [...(primary.reasons || []), 'Proposal flagged; tighten metadata before charter ask.']
    };
  }
  return primary;
}

function validateRegistry(registry) {
  const red = [];
  const yellow = [];
  const ok = [];

  if (registry.mode === 'governed_replication_doctrine_only') ok.push('mode is governed_replication_doctrine_only.');
  else red.push('mode must be governed_replication_doctrine_only.');

  if (registry.runtime_self_replication_enabled === false) ok.push('runtime_self_replication_enabled is false.');
  else red.push('runtime_self_replication_enabled must be explicit false.');

  const override = toArray(registry.capabilities_enabled_override);
  if (override.length === 0) ok.push('capabilities_enabled_override is empty.');
  else red.push('capabilities_enabled_override must be empty — no forbidden capability overrides permitted.');

  const forbidden = toArray(registry.forbidden_replica_actions);
  const requiredForbidden = [
    'runtime_self_replication',
    'autonomous_deploy',
    'provider_call',
    'payment_activation',
    'secret_write',
    'external_webhook',
    'child_data_flow',
    'auto_merge',
    'production_connector',
    'file_system_sprawl',
    'unbounded_loop'
  ];
  const fset = new Set(forbidden.map(String));
  const missingFb = requiredForbidden.filter((x) => !fset.has(x));
  if (missingFb.length === 0) ok.push('forbidden_replica_actions covers mandated set.');
  else red.push(`forbidden_replica_actions missing: ${missingFb.join(', ')}`);

  const allowed = toArray(registry.allowed_replica_outputs);
  if (allowed.length >= 5) ok.push('allowed_replica_outputs present.');
  else red.push('allowed_replica_outputs incomplete.');

  const classes = toArray(registry.replica_classes);
  if (classes.length >= 4) ok.push('replica_classes populated.');
  else yellow.push('replica_classes unusually small.');

  const mapping = toArray(registry.project_mappings);
  if (!mapping.every((row) => row && row.project_id)) red.push('project_mappings rows must include project_id.');

  const cm = registry.core_model && typeof registry.core_model === 'object' ? registry.core_model : {};
  const ck = ['monocore_identity', 'shadow_replicas'];
  const coreOk = ck.every((k) => cm[k] === true);
  if (coreOk) ok.push('core_model primary doctrine flags true.');
  else yellow.push('core_model doctrine flags should be true for OMNAI translation slice.');

  return { ok, yellow, red, forbiddenList: forbidden.map(String) };
}

function overallSignal(regVal, missionResults) {
  if (regVal.red.length > 0) return 'RED';
  if (missionResults.some((m) => m.signal === 'RED')) return 'RED';
  if (missionResults.some((m) => m.signal === 'BLUE')) return 'BLUE';
  if (missionResults.some((m) => m.signal === 'YELLOW')) return 'YELLOW';
  if (regVal.yellow.length > 0) return 'YELLOW';
  return 'GREEN';
}

function buildMd(report) {
  const lines = [
    '# Z-Replica Fabric Report',
    '',
    `- Overall signal: **${report.signal}**`,
    `- Registry mode: ${report.mode}`,
    `- Timestamp: ${report.generated_at}`,
    '',
    '## Registry checks',
    ''
  ];
  for (const x of report.registry_validation.passed) lines.push(`- PASS: ${x}`);
  for (const x of report.registry_validation.advisory ?? []) lines.push(`- ADVISORY: ${x}`);
  for (const x of report.registry_validation.red) lines.push(`- RED: ${x}`);
  lines.push('', '## Mission classification', '');
  for (const row of report.mission_results) {
    lines.push(`### ${row.mission_id}`, '');
    lines.push(`- Signal: **${row.signal}**`);
    lines.push(`- Project: ${row.project_id}`);
    lines.push(`- Replica class: ${row.replica_class}`);
    if (row.reasons && row.reasons.length) lines.push(`- Notes: ${row.reasons.join('; ')}`);
    lines.push('');
  }
  lines.push('## Summary', '');
  lines.push(`- GREEN-class missions: ${report.summary.green_count}`);
  lines.push(`- YELLOW-class missions: ${report.summary.yellow_count}`);
  lines.push(`- BLUE-class missions: ${report.summary.blue_count}`);
  lines.push(`- RED-class missions: ${report.summary.red_count}`);
  lines.push('', '## Locked law', '');
  for (const law of toArray(report.locked_law)) lines.push(`- ${law}`);
  return `${lines.join('\n')}\n`;
}

async function syncIndicator(signal) {
  try {
    const indicatorDoc = JSON.parse(await readFile(indicatorPath, 'utf8'));
    const indicators = toArray(indicatorDoc.indicators);
    const index = indicators.findIndex((row) => row.id === 'z_replica_fabric_governance');
    if (index >= 0) {
      indicators[index].signal = signal;
      indicatorDoc.indicators = indicators;
      await writeFile(indicatorPath, `${JSON.stringify(indicatorDoc, null, 2)}\n`, 'utf8');
    }
  } catch {
    // optional in partial workspaces
  }
}

async function main() {
  const registry = JSON.parse(await readFile(registryPath, 'utf8'));
  const missionsDoc = JSON.parse(await readFile(missionsPath, 'utf8'));
  const includeFixtures = process.env.Z_REPLICA_FABRIC_INCLUDE_FIXTURES === '1';
  let missions = toArray(missionsDoc.missions);
  if (includeFixtures) missions = [...missions, ...toArray(missionsDoc.fixture_missions)];

  const regVal = validateRegistry(registry);
  const projectIds = new Set(toArray(registry.project_mappings).map((r) => String(r.project_id)));
  const allowedOutputs = new Set(toArray(registry.allowed_replica_outputs).map(String));
  const replicaClasses = new Set(toArray(registry.replica_classes).map(String));

  /** @type {Array<{ mission_id: string; project_id?: string; replica_class?: string; signal: string; reasons: string[] }>} */
  const missionResults = [];
  for (const m of missions) {
    const mid = m.mission_id ?? '(missing mission_id)';
    const requiredKeys = ['mission_id', 'project_id', 'replica_class', 'allowed_outputs', 'forbidden_actions', 'rollback_note', 'AMK_gate'];
    const missingKeys = requiredKeys.filter((k) => m[k] === undefined || m[k] === null);
    if (missingKeys.length) {
      missionResults.push({
        mission_id: mid,
        project_id: m.project_id,
        replica_class: m.replica_class,
        signal: 'RED',
        reasons: [`missing required fields: ${missingKeys.join(', ')}`]
      });
      continue;
    }
    let raw = classifyMission(m, projectIds, allowedOutputs, replicaClasses);
    raw = mergeClassify(raw);
    missionResults.push({
      mission_id: m.mission_id,
      project_id: m.project_id,
      replica_class: m.replica_class,
      signal: raw.signal,
      reasons: raw.reasons || []
    });
  }

  const signal = overallSignal(regVal, missionResults);

  const report = {
    schema: 'z.replica.fabric.report.v1',
    module_id: 'z_replica_fabric_governance',
    signal,
    mode: registry.mode ?? 'unknown',
    registry_name: registry.registry_name ?? 'Z-Replica Fabric',
    generated_at: new Date().toISOString(),
    fixtures_included: includeFixtures,
    registry_validation: {
      passed: regVal.ok,
      advisory: regVal.yellow,
      red: regVal.red
    },
    mission_results: missionResults,
    summary: {
      green_count: missionResults.filter((x) => x.signal === 'GREEN').length,
      yellow_count: missionResults.filter((x) => x.signal === 'YELLOW').length,
      blue_count: missionResults.filter((x) => x.signal === 'BLUE').length,
      red_count: missionResults.filter((x) => x.signal === 'RED').length
    },
    locked_law: toArray(registry.locked_law),
    related_docs: toArray(registry.related_docs),
    related_reports: toArray(registry.related_reports)
  };

  await mkdir(dirname(reportJsonPath), { recursive: true });
  await writeFile(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  await writeFile(reportMdPath, buildMd(report), 'utf8');
  await syncIndicator(signal);

  console.log(`Z-Replica Fabric signal: ${signal}`);
  process.exit(signal === 'RED' ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
