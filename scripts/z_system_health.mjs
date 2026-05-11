#!/usr/bin/env node
/**
 * Z-System Health — single structural summary from ZCI + garage pressure.
 * Advisory only; no gates or auto-fix.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const ZCI_PATH = path.join(ROOT, 'data', 'reports', 'z_ci_intelligence.json');
const GARAGE_PATH = path.join(ROOT, 'data', 'reports', 'z_garage_upgrade_plan.json');
const OUTPUT = path.join(ROOT, 'data', 'reports', 'z_system_health.json');

function readJsonSafe(file) {
  try {
    if (!fs.existsSync(file)) return null;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
}

const zci = readJsonSafe(ZCI_PATH);
const garage = readJsonSafe(GARAGE_PATH);
const projects = Array.isArray(zci?.projects) ? zci.projects : [];

let healthy = 0;
let warning = 0;
let critical = 0;

for (const p of projects) {
  const score = Number(p.score) || 0;
  if (score >= 85) healthy++;
  else if (score >= 60) warning++;
  else critical++;
}

const total = projects.length;
const healthScore = total > 0 ? Math.round((healthy / total) * 100) : 0;

let status = 'unknown';
if (!zci) {
  status = 'unknown';
} else if (healthScore >= 85 && critical === 0) {
  status = 'stable';
} else if (critical > 0) {
  status = 'degraded';
} else {
  status = 'moderate';
}

const pressure = garage?.pressure != null ? String(garage.pressure) : 'unknown';

let note = '';
if (status === 'stable') {
  note = 'System structurally healthy with minor areas for improvement.';
} else if (status === 'moderate') {
  note = 'System stable but some modules need attention.';
} else if (status === 'degraded') {
  note = 'Critical weaknesses detected — stabilization recommended.';
} else {
  note = 'Insufficient data to determine system health.';
}

const output = {
  generated_at: new Date().toISOString(),
  modules_total: total,
  healthy_modules: healthy,
  warning_modules: warning,
  critical_modules: critical,
  health_score: healthScore,
  status,
  pressure,
  note,
};

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');

console.log('✅ Z-System Health generated');
console.log(`Output: ${OUTPUT}`);
