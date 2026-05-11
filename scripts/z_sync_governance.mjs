import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, '..');
const labsRoot =
  process.env.Z_LABS_ROOT ||
  resolve(repoRoot, '..', 'ZSanctuary_Labs');
const force = process.argv.includes('--force');
const entries = [
  {
    src: '.vscode/tasks.json',
    dest: '.vscode/tasks.json'
  },
  {
    src: 'AI_FOLDER_MANAGER.md',
    dest: 'AI_FOLDER_MANAGER.md'
  },
  {
    src: 'docs/Z_FORMULA_INTEGRATED.md',
    dest: 'docs/Z_FORMULA_INTEGRATED.md'
  },
  {
    src: 'scripts/z_formula_validator.mjs',
    dest: 'scripts/z_formula_validator.mjs'
  },
  {
    src: 'Z_LAB_TASK_STRUCTURE.md',
    dest: 'Z_LAB_TASK_STRUCTURE.md'
  },
  {
    src: 'config/z_slo_targets.json',
    dest: 'config/z_slo_targets.json'
  },
  {
    src: 'config/z_workspace_identity.json',
    dest: 'config/z_workspace_identity.json'
  }
];
const hashStorePath = resolve(
  repoRoot,
  'config',
  'z_governance_hashes.json'
);
const logPath = resolve(repoRoot, 'logs', 'governance_sync.log');
const logChecksumPath = resolve(
  repoRoot,
  'config',
  'governance_sync_log.sha256'
);
const manifestPath = resolve(labsRoot, 'lab_manifest.json');

const now = new Date().toISOString();

async function ensureDir(filePath) {
  await fs.mkdir(dirname(filePath), { recursive: true });
}

async function safeReadJson(path) {
  try {
    const raw = await fs.readFile(path, 'utf8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function safeReadChecksum(path) {
  try {
    return (await fs.readFile(path, 'utf8')).trim();
  } catch {
    return null;
  }
}

async function hashFile(path) {
  const data = await fs.readFile(path);
  return createHash('sha256').update(data).digest('hex');
}

async function run() {
  console.log(`Governance sync starting (${force ? 'force' : 'strict'}).`);

  const labsExists = await fs
    .access(labsRoot)
    .then(() => true)
    .catch(() => false);
  if (!labsExists) {
    throw new Error(`Labs workspace not found at ${labsRoot}`);
  }

  const storedLogChecksum = await safeReadChecksum(logChecksumPath);
  const logExists = await fs
    .access(logPath)
    .then(() => true)
    .catch(() => false);
  if (logExists && storedLogChecksum) {
    const currentLogHash = await hashFile(logPath);
    if (currentLogHash !== storedLogChecksum) {
      throw new Error(
        `Blocked: governance log checksum mismatch (expected ${storedLogChecksum}, actual ${currentLogHash}).`
      );
    }
  }

  const hashes = await safeReadJson(hashStorePath);
  const logLines = [];

  for (const entry of entries) {
    const sourcePath = resolve(repoRoot, entry.src);
    const destPath = resolve(labsRoot, entry.dest);
    const relativeDest = entry.dest.replace(/\\/g, '/');

    const sourceExists = await fs
      .access(sourcePath)
      .then(() => true)
      .catch(() => false);
    if (!sourceExists) {
      throw new Error(`Missing governance source: ${sourcePath}`);
    }

    const sourceHash = await hashFile(sourcePath);
    const destExists = await fs
      .access(destPath)
      .then(() => true)
      .catch(() => false);

    if (destExists) {
      const destHash = await hashFile(destPath);
      const recordedHash = hashes[relativeDest];

      if (destHash === sourceHash) {
        logLines.push(`${relativeDest} already synchronized.`);
        hashes[relativeDest] = sourceHash;
        continue;
      }

      if (!recordedHash) {
        if (!force) {
          throw new Error(
            `Drift detected for ${relativeDest}; destination lacks trusted hash. Re-run with --force if you want to overwrite.`
          );
        }
      } else if (destHash !== recordedHash && !force) {
        throw new Error(
          `Drift detected for ${relativeDest}; destination hash ${destHash} does not match recorded ${recordedHash}.`
        );
      }
    }

    await ensureDir(destPath);
    await fs.copyFile(sourcePath, destPath);
    hashes[relativeDest] = sourceHash;
    logLines.push(`${relativeDest} synchronized.`);
  }

  await fs.writeFile(hashStorePath, JSON.stringify(hashes, null, 2));
  await fs.mkdir(dirname(logPath), { recursive: true });

  const logEntry = `[${now}] governance:sync ${
    force ? '(force)' : ''
  } — ${logLines.join('; ')}${'\n'}`;
  await fs.appendFile(logPath, logEntry);

  const newLogHash = await hashFile(logPath);
  await ensureDir(logChecksumPath);
  await fs.writeFile(logChecksumPath, newLogHash);

  const manifest = await safeReadJson(manifestPath);
  manifest.last_registry_sync_at = now;
  manifest.governance = {
    ...(manifest.governance ?? {}),
    last_sync_at: now,
    sync_entries: entries.map((entry) => entry.dest),
    last_log_checksum: newLogHash
  };
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

  console.log('Governance sync complete.');
}

run().catch((error) => {
  console.error('Governance sync failed:', error);
  process.exitCode = 1;
});
