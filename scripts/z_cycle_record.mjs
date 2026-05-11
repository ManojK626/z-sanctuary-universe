import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const MANIFEST_PATH = path.join(ROOT, 'sandbox', 'zgm_phase_lab', 'phase_manifest.json');
const GUARD_PATH = path.join(REPORTS_DIR, 'z_sandbox_phase_guard.json');
const SYNC_ROOT = path.join(ROOT, 'nas_ready', 'sync_packs');
const JOURNAL_PATH = path.join(ROOT, 'logs', 'sync_journal.log');
const LEDGER_PATH = path.join(REPORTS_DIR, 'z_cycle_ledger.jsonl');
const OUT_JSON = path.join(REPORTS_DIR, 'z_cycle_indicator.json');
const OUT_MD = path.join(REPORTS_DIR, 'z_cycle_indicator.md');

function readJsonSafe(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function readTextSafe(filePath) {
  try {
    if (!fs.existsSync(filePath)) return '';
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return '';
  }
}

function nowIso() {
  return new Date().toISOString();
}

function dateOnly(iso) {
  return String(iso || '').split('T')[0] || '';
}

function listSyncFolders() {
  if (!fs.existsSync(SYNC_ROOT)) return [];
  return fs
    .readdirSync(SYNC_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => ({
      name: d.name,
      abs: path.join(SYNC_ROOT, d.name),
    }))
    .sort((a, b) => b.name.localeCompare(a.name));
}

function parseHashFile(filePath) {
  const content = readTextSafe(filePath);
  const lines = content.split(/\r?\n/).filter(Boolean);
  let zipHash = null;
  let manifestHash = null;
  for (const line of lines) {
    const [name, value] = line.split(':').map((x) => (x || '').trim());
    if (!name || !value) continue;
    if (/\.zip$/i.test(name)) zipHash = value;
    if (/manifest\.json$/i.test(name)) manifestHash = value;
  }
  return { zipHash, manifestHash };
}

function parseLedger() {
  if (!fs.existsSync(LEDGER_PATH)) return [];
  const lines = fs
    .readFileSync(LEDGER_PATH, 'utf8')
    .split(/\r?\n/)
    .map((x) => x.trim())
    .filter(Boolean);
  const entries = [];
  for (const line of lines) {
    try {
      entries.push(JSON.parse(line));
    } catch {
      // Skip malformed historical line; keep append-only policy intact.
    }
  }
  return entries;
}

function determineAttitude({ freezeOk, guardStatus, hasArtifacts, hasJournalSignal }) {
  if (!freezeOk) return 'blocked';
  if (String(guardStatus || '').toLowerCase() !== 'green') return 'drift';
  if (!hasArtifacts || !hasJournalSignal) return 'caution';
  return 'calm';
}

function computeStreak(entries) {
  let streak = 0;
  for (let i = entries.length - 1; i >= 0; i -= 1) {
    if (entries[i]?.attitude === 'calm') streak += 1;
    else break;
  }
  return streak;
}

function buildSummary(entries) {
  const last = entries.length ? entries[entries.length - 1] : null;
  const attitudeCounts = entries.reduce((acc, item) => {
    const key = String(item?.attitude || 'unknown').toLowerCase();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const calmCount = attitudeCounts.calm || 0;
  const greenRate = entries.length ? Number(((calmCount / entries.length) * 100).toFixed(1)) : 0;
  const recent = entries.slice(-7);
  return {
    generated_at: nowIso(),
    status: last?.attitude === 'calm' ? 'green' : last ? 'hold' : 'unknown',
    total_cycles: entries.length,
    calm_streak: computeStreak(entries),
    calm_rate_pct: greenRate,
    latest_cycle: last,
    recent_attitudes: recent.map((x) => x.attitude),
    attitude_counts: attitudeCounts,
  };
}

function writeSummary(summary) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
  const latest = summary.latest_cycle;
  const md = [
    '# Z Indication Cycles',
    '',
    `Generated: ${summary.generated_at}`,
    `Status: ${String(summary.status || 'unknown').toUpperCase()}`,
    `Total cycles: ${summary.total_cycles}`,
    `Calm streak: ${summary.calm_streak}`,
    `Calm rate: ${summary.calm_rate_pct}%`,
    '',
    '## Latest Cycle',
    latest
      ? `- ${latest.cycle_id} · attitude=${latest.attitude} · freeze_ok=${latest.freeze_ok} · guard=${latest.phase_guard?.status || 'unknown'}`
      : '- none',
    '',
    '## Recent Attitudes',
    summary.recent_attitudes.length ? `- ${summary.recent_attitudes.join(' -> ')}` : '- none',
    '',
  ].join('\n');
  fs.writeFileSync(OUT_MD, md, 'utf8');
}

function main() {
  const manifest = readJsonSafe(MANIFEST_PATH);
  if (!manifest) {
    throw new Error(`Missing/invalid manifest: ${MANIFEST_PATH}`);
  }
  const guard = readJsonSafe(GUARD_PATH);

  const freeze = manifest.freeze || {};
  const freezeOk =
    manifest.operating_state === 'paused_pending_nas_sync' &&
    freeze.new_phase_development === true &&
    freeze.core_promotion === true &&
    freeze.auto_bridge === true &&
    freeze.core_writes === true;

  const syncFolders = listSyncFolders();
  const latestSync = syncFolders[0] || null;
  const latestFolder = latestSync?.name || null;
  const latestAbs = latestSync?.abs || null;
  const hashPath = latestAbs ? path.join(latestAbs, 'sha256.txt') : null;
  const packManifestPath = latestAbs ? path.join(latestAbs, 'manifest.json') : null;
  const zipPath = latestAbs ? path.join(latestAbs, 'ZSANCTUARY_SYNC_PACK_v1.zip') : null;
  const hashes = hashPath ? parseHashFile(hashPath) : { zipHash: null, manifestHash: null };
  const hasArtifacts = Boolean(
    latestFolder &&
      fs.existsSync(hashPath || '') &&
      fs.existsSync(packManifestPath || '') &&
      fs.existsSync(zipPath || '') &&
      hashes.zipHash &&
      hashes.manifestHash
  );

  const journal = readTextSafe(JOURNAL_PATH);
  const hasJournalSignal = latestFolder ? journal.includes(latestFolder) || journal.includes('Sync Pack v1.2') : false;

  const guardStatus = String(guard?.status || 'unknown').toLowerCase();
  const attitude = determineAttitude({
    freezeOk,
    guardStatus,
    hasArtifacts,
    hasJournalSignal,
  });

  const cycleTs = nowIso();
  const cycle = {
    cycle_id: cycleTs.replace(/[:.]/g, '-'),
    cycle_date: dateOnly(cycleTs),
    operator: 'AMK',
    operating_state: manifest.operating_state || 'unknown',
    freeze_ok: freezeOk,
    phase_guard: {
      status: guardStatus,
      report_path: 'data/reports/z_sandbox_phase_guard.json',
    },
    sync_pack: latestFolder
      ? {
          folder: `nas_ready/sync_packs/${latestFolder}`,
          zip: 'ZSANCTUARY_SYNC_PACK_v1.zip',
          sha256_zip: hashes.zipHash,
          sha256_manifest: hashes.manifestHash,
        }
      : null,
    reports_refresh: { status: 'ok' },
    attitude,
    notes: 'stabilization cycle record',
    created_at: cycleTs,
  };

  fs.mkdirSync(path.dirname(LEDGER_PATH), { recursive: true });
  fs.appendFileSync(LEDGER_PATH, `${JSON.stringify(cycle)}\n`, 'utf8');

  const entries = parseLedger();
  const summary = buildSummary(entries);
  writeSummary(summary);

  console.log(`✅ Cycle recorded. attitude=${attitude} total_cycles=${summary.total_cycles}`);
}

try {
  main();
} catch (error) {
  console.error(`❌ Cycle record failed: ${error.message}`);
  process.exit(1);
}
