import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'data', 'reports');
const OVERRIDES = path.join(REPORTS, 'z_octave_gate_overrides.json');
const PILOT_SEED = path.join(REPORTS, 'z_octave_pilot_seed.json');

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

function refreshOverrides(now) {
  const current = readJson(OVERRIDES);
  const payload = {
    updated_at: now,
    refreshed_at: now,
    gates: Array.isArray(current?.gates) ? current.gates : [],
    ...(current?.ready_override !== undefined ? { ready_override: current.ready_override } : {}),
  };
  writeJson(OVERRIDES, payload);
}

function refreshPilotSeed(now) {
  const current = readJson(PILOT_SEED);
  const payload = {
    generated_at: current?.generated_at || now,
    refreshed_at: now,
    source: current?.source || 'z_octave_artifacts_refresh',
    ...(current && typeof current === 'object' ? current : {}),
  };
  writeJson(PILOT_SEED, payload);
}

const now = new Date().toISOString();
refreshOverrides(now);
refreshPilotSeed(now);
console.log('✅ Z-OCTAVE artifacts refreshed.');
