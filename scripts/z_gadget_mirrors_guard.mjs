import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'data', 'reports');
const OUT_JSON = path.join(REPORTS, 'z_gadget_mirrors_status.json');
const OUT_MD = path.join(REPORTS, 'z_gadget_mirrors_status.md');

const requiredFiles = [
  'apps/z_gadget_mirrors/module.json',
  'apps/z_gadget_mirrors/docs/MDE_OVERVIEW.md',
  'apps/z_gadget_mirrors/docs/MODULE_CONTRACT.md',
  'apps/z_gadget_mirrors/mirror_decision_engine/data/device_profiles.sample.json',
  'apps/z_gadget_mirrors/mirror_decision_engine/data/sustainability_baselines.sample.json',
  'apps/z_gadget_mirrors/mirror_decision_engine/engine_esm/mde_switching.mjs',
  'apps/z_gadget_mirrors/mirror_decision_engine/engine_esm/mde_weighted.mjs',
  'apps/z_gadget_mirrors/mirror_decision_engine/engine_esm/mde_adaptive_weights.mjs',
  'apps/z_gadget_mirrors/mirror_decision_engine/engine_esm/mde_profile_suggester.mjs',
  'apps/z_gadget_mirrors/mirror_decision_engine/engine_esm/mde_forecast.mjs',
  'apps/z_gadget_mirrors/mirror_decision_engine/engine_esm/mde_stability.mjs',
  'apps/z_gadget_mirrors/mirror_decision_engine/engine_esm/mde_narrative.mjs',
  'apps/z_gadget_mirrors/ui_web_portal/index.html',
  'apps/z_gadget_mirrors/ui_web_portal/app.js',
];

const checks = requiredFiles.map((rel) => {
  const abs = path.join(ROOT, rel);
  return { id: rel, pass: fs.existsSync(abs), note: fs.existsSync(abs) ? 'present' : 'missing' };
});

async function main() {
  let syntaxPass = true;
  try {
    await import(
      pathToFileURL(
        path.join(ROOT, 'apps/z_gadget_mirrors/mirror_decision_engine/engine_esm/mde_switching.mjs')
      ).href
    );
    await import(
      pathToFileURL(
        path.join(ROOT, 'apps/z_gadget_mirrors/mirror_decision_engine/engine_esm/mde_weighted.mjs')
      ).href
    );
    await import(
      pathToFileURL(
        path.join(
          ROOT,
          'apps/z_gadget_mirrors/mirror_decision_engine/engine_esm/mde_adaptive_weights.mjs'
        )
      ).href
    );
    await import(
      pathToFileURL(
        path.join(
          ROOT,
          'apps/z_gadget_mirrors/mirror_decision_engine/engine_esm/mde_profile_suggester.mjs'
        )
      ).href
    );
    await import(
      pathToFileURL(
        path.join(ROOT, 'apps/z_gadget_mirrors/mirror_decision_engine/engine_esm/mde_forecast.mjs')
      ).href
    );
    await import(
      pathToFileURL(
        path.join(ROOT, 'apps/z_gadget_mirrors/mirror_decision_engine/engine_esm/mde_stability.mjs')
      ).href
    );
    await import(
      pathToFileURL(
        path.join(ROOT, 'apps/z_gadget_mirrors/mirror_decision_engine/engine_esm/mde_narrative.mjs')
      ).href
    );
  } catch {
    syntaxPass = false;
  }
  checks.push({
    id: 'engine_imports',
    pass: syntaxPass,
    note: syntaxPass ? 'esm imports ok' : 'esm import failure',
  });

  const status = checks.every((c) => c.pass) ? 'green' : 'hold';
  const payload = {
    generated_at: new Date().toISOString(),
    status,
    checks,
    note:
      status === 'green'
        ? 'Z-Gadget Mirrors module is structurally healthy.'
        : 'Z-Gadget Mirrors module has missing/broken artifacts.',
  };

  fs.mkdirSync(REPORTS, { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(payload, null, 2));
  fs.writeFileSync(
    OUT_MD,
    [
      '# Z Gadget Mirrors Status',
      '',
      `Generated: ${payload.generated_at}`,
      `Status: ${payload.status.toUpperCase()}`,
      '',
      '## Checks',
      ...checks.map((c) => `- [${c.pass ? 'x' : ' '}] ${c.id}: ${c.note}`),
      '',
      `Note: ${payload.note}`,
      '',
    ].join('\n')
  );

  console.log(`✅ Z Gadget Mirrors status written: ${OUT_JSON}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
