#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const REPORTS = path.join(ROOT, 'data', 'reports');

const ECOSPHERE = path.join(REPORTS, 'z_ai_ecosphere_ledger.json');
const ZCI = path.join(REPORTS, 'z_ci_intelligence.json');
const GARAGE = path.join(REPORTS, 'z_garage_upgrade_plan.json');
const VAULT_SPINE = path.join(REPORTS, 'z_vault_spine_manifest.json');
const COMM_HEALTH = path.join(REPORTS, 'z_communication_health.json');
const SYSTEM_HEALTH = path.join(REPORTS, 'z_system_health.json');
const OUTPUT = path.join(REPORTS, 'z_ai_consistency_alerts.json');

function readJson(file, fallback = null) {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

const ecosphere = readJson(ECOSPHERE, {});
const zci = readJson(ZCI, {});
const garage = readJson(GARAGE, {});
const vaultSpine = readJson(VAULT_SPINE, null);
const commHealth = readJson(COMM_HEALTH, null);
const systemHealth = readJson(SYSTEM_HEALTH, null);

const overallSync = Number(ecosphere?.overall?.sync_score || 0);
const ecosphereBand = String(ecosphere?.overall?.band || '').toLowerCase();
const garagePressure = String(garage?.pressure || '').toLowerCase();
const zciLow = Number(zci?.summary?.low_priority || 0);

const alerts = [];

if (overallSync > 80 && garagePressure === 'high') {
  alerts.push({
    type: 'MISMATCH_HEALTH_VS_PRESSURE',
    message: 'High ecosphere health but high upgrade pressure.',
    severity: 'medium',
  });
}

if (zciLow > 5 && ecosphereBand === 'green') {
  alerts.push({
    type: 'ZCI_LOW_VS_GREEN',
    message: 'Many low-priority ZCI projects despite green ecosphere.',
    severity: 'medium',
  });
}

if (overallSync < 60 && garagePressure === 'low') {
  alerts.push({
    type: 'UNDERREPORTED_RISK',
    message: 'Low ecosphere health but garage pressure remains low.',
    severity: 'high',
  });
}

if (vaultSpine && String(vaultSpine.status || '').toLowerCase() !== 'green') {
  alerts.push({
    type: 'VAULT_SPINE_INTEGRITY',
    message: 'Vault spine has broken or unverified documentation links.',
    severity: 'low',
  });
}

if (commHealth && String(commHealth.flow_status || '') === 'broken') {
  alerts.push({
    type: 'COMM_FLOW_BROKEN',
    message: 'Communication health reports broken flow (missing manifests or critical comms failure).',
    severity: 'medium',
  });
} else if (commHealth && String(commHealth.flow_status || '') === 'degraded') {
  alerts.push({
    type: 'COMM_FLOW_DEGRADED',
    message: 'Communication flow degraded — stale observers, drift, or commflow attention.',
    severity: 'low',
  });
}

if (
  systemHealth &&
  String(systemHealth.status || '').toLowerCase() === 'stable' &&
  Number(systemHealth.health_score ?? 0) > 80 &&
  commHealth &&
  String(commHealth.flow_status || '') &&
  String(commHealth.flow_status || '') !== 'healthy'
) {
  alerts.push({
    type: 'STRUCTURAL_FLOW_MISMATCH',
    message: 'Structural health is strong but communication flow is not healthy — possible silent disconnect.',
    severity: 'medium',
  });
}

const payload = {
  generated_at: new Date().toISOString(),
  inputs: {
    ecosphere_overall_sync: overallSync,
    ecosphere_band: ecosphereBand || 'unknown',
    garage_pressure: garagePressure || 'unknown',
    zci_low_priority: zciLow,
    vault_spine_status: vaultSpine?.status ?? null,
    communication_flow_status: commHealth?.flow_status ?? null,
    system_health_status: systemHealth?.status ?? null,
    system_health_score: systemHealth?.health_score ?? null,
  },
  alerts,
  total: alerts.length,
  status: alerts.length ? 'watch' : 'aligned',
};

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

console.log(`✅ Z AI consistency alerts: ${OUTPUT} (${payload.status})`);
