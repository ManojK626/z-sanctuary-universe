import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const overridePath = path.join(ROOT, 'data', 'reports', 'z_octave_gate_overrides.json');

const [id, passRaw, ...noteParts] = process.argv.slice(2);
if (!id || !passRaw) {
  console.error('Usage: node scripts/z_octave_gate_set.mjs <gate_id> <true|false> [note]');
  process.exit(1);
}

const pass = passRaw === 'true';
const note = noteParts.join(' ').trim();

let overrides = { updated_at: null, gates: [] };
try {
  overrides = JSON.parse(fs.readFileSync(overridePath, 'utf8'));
  if (!Array.isArray(overrides.gates)) overrides.gates = [];
} catch {
  // fresh
}

const idx = overrides.gates.findIndex((g) => g.id === id);
const entry = { id, pass, ...(note ? { note } : {}) };
if (idx >= 0) overrides.gates[idx] = entry;
else overrides.gates.push(entry);

overrides.updated_at = new Date().toISOString();

fs.mkdirSync(path.dirname(overridePath), { recursive: true });
fs.writeFileSync(overridePath, JSON.stringify(overrides, null, 2));

console.log('✅ Gate override set:', entry);
