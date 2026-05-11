import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const gatesPath = path.join(ROOT, 'products', 'Z-OCTAVE', 'integration', 'readiness-gates.js');
const outPath = path.join(ROOT, 'data', 'reports', 'z_octave_readiness.json');
const overridePath = path.join(ROOT, 'data', 'reports', 'z_octave_gate_overrides.json');
const pilotSeedPath = path.join(ROOT, 'data', 'reports', 'z_octave_pilot_seed.json');

async function main() {
  const gatesUrl = pathToFileURL(gatesPath).href;
  const mod = await import(gatesUrl);
  let gates = mod.getZOctaveReadinessGates ? mod.getZOctaveReadinessGates() : [];
  const readyDefault = mod.isZOctavePublicReady ? mod.isZOctavePublicReady() : gates.every((g) => g.pass);

  let overrides = null;
  try {
    overrides = JSON.parse(fs.readFileSync(overridePath, 'utf8'));
  } catch {
    overrides = null;
  }

  if (overrides?.gates?.length) {
    const map = new Map(overrides.gates.map((g) => [g.id, g]));
    gates = gates.map((g) => {
      const ov = map.get(g.id);
      return ov ? { ...g, pass: ov.pass ?? g.pass, note: ov.note ?? g.note } : g;
    });
  }

  const ready = gates.every((g) => g.pass);
  const pilotSeed = fs.existsSync(pilotSeedPath);

  const payload = {
    generated_at: new Date().toISOString(),
    product: 'Z-OCTAVE',
    ready: overrides?.ready_override ?? ready,
    gates,
    overrides: overrides ? { updated_at: overrides.updated_at || null } : null,
    base_ready: readyDefault,
    pilot_seed: pilotSeed,
  };

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2));

  console.log('✅ Z-OCTAVE readiness refreshed:', outPath);
}

main();
