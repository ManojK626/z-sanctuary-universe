import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve('.');
const required = [
  'docs/Z_AMK_GUARDIAN_MOTION_SYSTEM.md',
  'docs/PHASE_Z_AMK_GUARDIAN_MOTION_1_GREEN_RECEIPT.md',
  'data/z_amk_guardian_motion_registry.json',
  'data/z_amk_guardian_motion_concept_seed.json',
  'concepts/z-amk-guardian-motion/README.md',
  'dashboard/Html/z-amk-guardian-motion-concept.html',
  'dashboard/scripts/z-amk-guardian-motion-concept-readonly.js',
  'dashboard/styles/z-amk-guardian-motion-concept.css',
];

const FORBIDDEN = ['how to build a weapon', 'how to fight', 'attack instruction', 'lethal force guide'];

async function main() {
  const missing = [];
  for (const rel of required) {
    try {
      await access(resolve(root, rel));
    } catch {
      missing.push(rel);
    }
  }

  const registry = JSON.parse(
    await readFile(resolve(root, 'data/z_amk_guardian_motion_registry.json'), 'utf8')
  );
  const seed = JSON.parse(
    await readFile(resolve(root, 'data/z_amk_guardian_motion_concept_seed.json'), 'utf8')
  );
  const doctrine = await readFile(resolve(root, 'docs/Z_AMK_GUARDIAN_MOTION_SYSTEM.md'), 'utf8');
  const js = await readFile(
    resolve(root, 'dashboard/scripts/z-amk-guardian-motion-concept-readonly.js'),
    'utf8'
  );

  const red = [];
  const passed = [];

  if (missing.length) red.push(`missing files: ${missing.join(', ')}`);
  else passed.push('all guardian motion Phase 1 files present');

  if (registry.schema !== 'z.amk.guardian.motion.registry.v1') {
    red.push('registry schema must be z.amk.guardian.motion.registry.v1');
  } else passed.push('registry schema ok');

  if (registry.locked_law?.no_real_combat_engineering !== true) {
    red.push('registry must set no_real_combat_engineering');
  } else passed.push('no combat engineering flag');

  if ((seed.forms || []).length < 3) red.push('seed must define three guardian forms');
  else passed.push('three guardian forms in seed');

  var formIds = (seed.forms || []).map((f) => f.id).sort().join(',');
  if (!formIds.includes('base_guardian') || !formIds.includes('hyper_guardian') || !formIds.includes('cosmic_guardian')) {
    red.push('seed must include base_guardian, hyper_guardian, cosmic_guardian');
  } else passed.push('base / hyper / cosmic forms present');

  if (js.includes('fetch(') && js.includes('http')) red.push('external HTTP fetch forbidden');
  else passed.push('local seed fetch only');

  const blob = js.toLowerCase();
  var forbiddenHit = false;
  for (const phrase of FORBIDDEN) {
    if (blob.includes(phrase)) {
      red.push(`forbidden phrase in docs/script: ${phrase}`);
      forbiddenHit = true;
    }
  }
  if (!forbiddenHit) passed.push('no forbidden combat phrases in sample scan');

  const html = await readFile(resolve(root, 'dashboard/Html/z-amk-guardian-motion-concept.html'), 'utf8');
  if (!html.includes('zgmPosterFrame')) red.push('poster mock frame missing in dashboard');
  else passed.push('cinematic poster mock present');

  const signal = red.length ? 'RED' : 'GREEN';
  console.log(`Z-AMK Guardian Motion signal: ${signal}`);
  passed.forEach((p) => console.log(`  ok: ${p}`));
  if (red.length) {
    red.forEach((r) => console.error(`  RED: ${r}`));
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
