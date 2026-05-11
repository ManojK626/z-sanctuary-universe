#!/usr/bin/env node
/**
 * Writes data/system-status.json from verify results or from --ci-pass after a green pipeline.
 * Run standalone to re-check: node scripts/z_system_status_refresh.mjs
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'data', 'system-status.json');
const PC_JSON = path.join(ROOT, 'data', 'z_pc_root_projects.json');

function readRegistryMeta() {
  try {
    const d = JSON.parse(fs.readFileSync(PC_JSON, 'utf8'));
    const projects = Array.isArray(d.projects) ? d.projects.length : 0;
    return { hub: d.hub || '', projects };
  } catch {
    return { hub: '', projects: 0 };
  }
}

function runVerifyCiSteps() {
  const node = process.execPath;
  const steps = [
    [node, [path.join(ROOT, 'scripts/z_cursor_folder_bootstrap.mjs'), '--verify']],
    [node, [path.join(ROOT, 'scripts/z_sanctuary_structure_verify.mjs')]],
    [node, [path.join(ROOT, 'scripts/z_registry_omni_verify.mjs')]]
  ];
  for (const [cmd, args] of steps) {
    const r = spawnSync(cmd, args, { cwd: ROOT, stdio: 'pipe', shell: false });
    if ((r.status ?? 1) !== 0) return false;
  }
  return true;
}

function writeStatus({ verifyPass, source }) {
  const { hub, projects } = readRegistryMeta();
  const iso = new Date().toISOString();
  const verify = verifyPass ? 'PASS' : 'FAIL';
  let status = 'unknown';
  if (verify === 'PASS' && projects > 0) status = 'healthy';
  else if (verify === 'PASS') status = 'degraded';
  else status = 'unhealthy';

  const payload = {
    verify,
    projects,
    last_check: iso.slice(0, 10),
    last_check_iso: iso,
    status,
    hub,
    source
  };
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  console.log(`✅ system-status written: ${OUT} (verify=${verify}, status=${status})`);
}

const ciPass = process.argv.includes('--ci-pass');

if (ciPass) {
  writeStatus({ verifyPass: true, source: 'verify:ci' });
  process.exit(0);
}

const ok = runVerifyCiSteps();
writeStatus({ verifyPass: ok, source: 'z_system_status_refresh' });
process.exit(ok ? 0 : 1);
