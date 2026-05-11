#!/usr/bin/env node
/**
 * Z-MAOS — read-only ecosystem status (L0/L2). No merge, deploy, install, or external connect.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());

function readJson(rel) {
  try {
    const p = path.join(ROOT, rel);
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function exists(rel) {
  return fs.existsSync(path.join(ROOT, rel));
}

function main() {
  console.log('Z-MAOS status (read-only)');
  console.log(`cwd: ${ROOT}`);
  console.log('');

  const reg = readJson('tools/z-maos/project_registry.json');
  if (!reg?.projects) {
    console.log('[WARN] Missing or invalid tools/z-maos/project_registry.json');
  } else {
    console.log('Projects (registry):');
    for (const p of reg.projects) {
      let pathLabel = 'true';
      if (p.repoPath == null || p.repoPath === '') {
        pathLabel = 'n/a (external)';
      } else if (p.repoPath !== '.') {
        pathLabel = String(fs.existsSync(path.resolve(ROOT, p.repoPath)));
      }
      console.log(`  - ${p.id}: ${p.name}`);
      console.log(`      coupling=${p.allowedCoupling} path_ok=${pathLabel}`);
      if (p.repoPathNote) console.log(`      note: ${p.repoPathNote}`);
    }
  }

  const manifest = readJson('tools/z-maos/workspace_health_manifest.json');
  if (manifest?.hubFileChecks) {
    console.log('');
    console.log('Hub file checks:');
    for (const c of manifest.hubFileChecks) {
      const ok = exists(c.path);
      console.log(`  [${ok ? 'OK' : 'MISS'}] ${c.label}: ${c.path}`);
    }
  }

  const consent = readJson('tools/z-maos/consent_matrix.json');
  if (consent?.gatedActions?.length) {
    console.log('');
    console.log(`Consent-gated action categories: ${consent.gatedActions.length} (see tools/z-maos/consent_matrix.json)`);
  }

  console.log('');
  console.log('Next safe action (hub): node scripts/z_sanctuary_structure_verify.mjs');
  console.log('Charter: docs/z-maos/Z_MAOS_CHARTER.md');
}

main();
