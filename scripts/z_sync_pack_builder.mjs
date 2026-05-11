import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const MANIFEST_PATH = path.join(ROOT, 'sandbox', 'zgm_phase_lab', 'phase_manifest.json');
const OUT_BASE = path.join(ROOT, 'nas_ready', 'sync_packs');
const STAGING_ROOT = path.join(ROOT, '.tmp', 'sync_pack_stage');
const JOURNAL_PATH = path.join(ROOT, 'logs', 'sync_journal.log');

const INCLUDE_MAP = [
  { source: 'core', target: 'CORE_ENGINE' },
  { source: path.join('sandbox', 'zgm_phase_lab'), target: 'SANDBOX_ISOLATED' },
  { source: 'docs', target: 'ARCHITECTURE_BLUEPRINTS' },
  { source: path.join('data', 'reports'), target: 'REPORTS' },
  { source: 'policies', target: 'GOVERNANCE/policies' },
  { source: 'rules', target: 'GOVERNANCE/rules' },
];

const EXCLUDE_DIRS = new Set([
  'node_modules',
  '.git',
  '.next',
  'dist',
  'build',
  '.cache',
  '__pycache__',
  '.pytest_cache',
  'tmp',
  'temp',
]);

function nowIso() {
  return new Date().toISOString();
}

function dateFolder() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function assertFreezeState() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    throw new Error(`phase manifest missing: ${MANIFEST_PATH}`);
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  if (manifest.operating_state !== 'paused_pending_nas_sync') {
    throw new Error('manifest operating_state is not paused_pending_nas_sync');
  }

  const freeze = manifest.freeze || {};
  const required = ['new_phase_development', 'core_promotion', 'auto_bridge', 'core_writes'];
  for (const key of required) {
    if (freeze[key] !== true) {
      throw new Error(`freeze flag is not true: ${key}`);
    }
  }
}

function copyFiltered(sourceAbs, targetAbs) {
  fs.cpSync(sourceAbs, targetAbs, {
    recursive: true,
    force: true,
    filter: (src) => {
      const base = path.basename(src);
      if (EXCLUDE_DIRS.has(base)) return false;
      return true;
    },
  });
}

function sha256(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

function zipStaging(stageDir, zipPath) {
  const script = `
    $ErrorActionPreference='Stop';
    Compress-Archive -Path '${stageDir}\\*' -DestinationPath '${zipPath}' -CompressionLevel Optimal -Force
  `;
  const ps = spawnSync('powershell', ['-NoProfile', '-Command', script], {
    encoding: 'utf8',
  });
  if (ps.status !== 0) {
    throw new Error(`zip failed: ${ps.stderr || ps.stdout || 'unknown powershell error'}`);
  }
}

function writeJournal(entry) {
  fs.mkdirSync(path.dirname(JOURNAL_PATH), { recursive: true });
  fs.appendFileSync(JOURNAL_PATH, `${entry}\n`, 'utf8');
}

function buildManifest(zipName) {
  return {
    protocol: 'Sovereign Sync v1.2',
    pack_version: 'v1',
    created_at: nowIso(),
    source_node: 'Z-DEV-01',
    intended_vault: 'Z-NAS-01',
    bundle_scope: 'core+sandbox+governance+reports+architecture',
    freeze_state_validated: true,
    notes: 'Freeze-validated governance export',
    artifact: zipName,
  };
}

function cleanDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function main() {
  assertFreezeState();

  const folder = dateFolder();
  const outDir = path.join(OUT_BASE, folder);
  const zipName = 'ZSANCTUARY_SYNC_PACK_v1.zip';
  const zipPath = path.join(outDir, zipName);
  const manifestPath = path.join(outDir, 'manifest.json');
  const hashPath = path.join(outDir, 'sha256.txt');

  cleanDir(STAGING_ROOT);
  fs.mkdirSync(STAGING_ROOT, { recursive: true });
  fs.mkdirSync(outDir, { recursive: true });

  const copied = [];
  for (const item of INCLUDE_MAP) {
    const src = path.join(ROOT, item.source);
    if (!fs.existsSync(src)) continue;
    const dst = path.join(STAGING_ROOT, item.target);
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    copyFiltered(src, dst);
    copied.push(item.target);
  }

  zipStaging(STAGING_ROOT, zipPath);
  const manifest = buildManifest(zipName);
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  const zipHash = sha256(zipPath);
  const manifestHash = sha256(manifestPath);
  fs.writeFileSync(
    hashPath,
    `${zipName}: ${zipHash}\nmanifest.json: ${manifestHash}\n`,
    'utf8'
  );

  writeJournal(
    `${nowIso()} | Sync Pack v1.2 | Freeze Validated | fileset=${copied.join(',')} | sha256=${zipHash}`
  );

  cleanDir(STAGING_ROOT);
  console.log(`✅ Sync pack created: ${zipPath}`);
}

try {
  main();
} catch (error) {
  console.error(`❌ Sync pack aborted: ${error.message}`);
  process.exit(1);
}
