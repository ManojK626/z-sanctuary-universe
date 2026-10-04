import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { buildReadinessPayload } from './z_readiness_attestation.mjs';

const ROOT = process.cwd();
const outPath = path.join(ROOT, 'data', 'reports', 'z_octave_readiness.json');

export async function refreshOctaveReadiness(options = {}) {
  const root = options.root || ROOT;
  const target = options.outPath || path.join(root, 'data', 'reports', 'z_octave_readiness.json');
  const built = await buildReadinessPayload({
    root,
    gatesPath: options.gatesPath,
    overridePath: options.overridePath,
    pilotSeedPath: options.pilotSeedPath,
    generatedAt: options.generatedAt,
  });
  if (!built.ok || !built.payload) return built;
  if (options.write === false) return built;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(built.payload, null, 2)}\n`);
  return { ...built, outPath: target };
}

function invokedDirectly() {
  const arg = process.argv[1];
  if (!arg) return false;
  return import.meta.url === pathToFileURL(arg).href;
}

async function main() {
  const result = await refreshOctaveReadiness();
  if (!result.ok) {
    console.error(`Z-OCTAVE readiness refresh blocked: ${result.code}`);
    process.exit(1);
  }
  console.log('✅ Z-OCTAVE readiness refreshed:', result.outPath || outPath);
}

if (invokedDirectly()) {
  main().catch((error) => {
    console.error(`Z-OCTAVE readiness refresh failed: ${error?.message || String(error)}`);
    process.exit(1);
  });
}
