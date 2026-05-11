#!/usr/bin/env node
/**
 * Z-MAOS opening cycle — prints runbook steps and optional file checks.
 * Optional: --write → data/reports/z_maos_opening_cycle.md (no secrets).
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());

function readJson(rel) {
  try {
    return JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
  } catch {
    return null;
  }
}

function exists(rel) {
  return fs.existsSync(path.join(ROOT, rel));
}

const STEPS = [
  'Identify active repo/project',
  'Verify workspace root',
  'Check phase/freeze posture',
  'Check extension readiness (see docs/z-maos/EXTENSION_AND_TOOL_READINESS.md)',
  'Run safe status scripts (operator choice)',
  'Read latest reports under data/reports/',
  'Show next safe action (see npm run z:maos-status)',
  'Route tasks to mini-bots (npm run z:maos-route -- <keyword>)',
  'Require AMK consent for risky actions (docs/z-maos/AMK_CONSENT_GATES.md)',
];

function main() {
  const write = process.argv.includes('--write');
  console.log('Z-MAOS opening cycle (checklist only — no deploy/merge/install)\n');
  STEPS.forEach((s, i) => console.log(`${i + 1}. ${s}`));

  const manifest = readJson('tools/z-maos/workspace_health_manifest.json');
  if (manifest?.hubFileChecks) {
    console.log('\nManifest file checks:');
    for (const c of manifest.hubFileChecks) {
      console.log(`  [${exists(c.path) ? 'OK' : 'MISS'}] ${c.path}`);
    }
  }

  if (!write) {
    console.log('\nTip: pass --write to emit data/reports/z_maos_opening_cycle.md');
    return;
  }

  const lines = [
    '# Z-MAOS opening cycle report',
    '',
    `- Generated: ${new Date().toISOString()}`,
    `- Hub root: \`${ROOT}\``,
    '',
    '## Steps acknowledged',
    '',
    ...STEPS.map((s, i) => `${i + 1}. ${s}`),
    '',
    '## Manifest checks',
    '',
  ];
  if (manifest?.hubFileChecks) {
    for (const c of manifest.hubFileChecks) {
      lines.push(`- ${exists(c.path) ? '[OK]' : '[MISS]'} \`${c.path}\` (${c.label})`);
    }
  }
  lines.push('', '_No risky actions executed by this script._', '');
  const outDir = path.join(ROOT, 'data', 'reports');
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'z_maos_opening_cycle.md');
  fs.writeFileSync(outPath, `${lines.join('\n')}\n`, 'utf8');
  console.log(`\nWrote: ${outPath}`);
}

main();
