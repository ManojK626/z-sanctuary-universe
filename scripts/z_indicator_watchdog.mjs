import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const INDICATOR_PATH = path.join(REPORTS_DIR, 'z_cycle_indicator.json');
const GUARD_PATH = path.join(REPORTS_DIR, 'z_sandbox_phase_guard.json');
const MANIFEST_PATH = path.join(ROOT, 'sandbox', 'zgm_phase_lab', 'phase_manifest.json');
const LEDGER_PATH = path.join(REPORTS_DIR, 'z_cycle_ledger.jsonl');
const OUT_JSON = path.join(REPORTS_DIR, 'z_indicator_watchdog.json');
const OUT_MD = path.join(REPORTS_DIR, 'z_indicator_watchdog.md');
const OUT_ADVISORY_JSON = path.join(REPORTS_DIR, 'z_indicator_watchdog_advisory.json');
const OUT_ADVISORY_MD = path.join(REPORTS_DIR, 'z_indicator_watchdog_advisory.md');

const FRESHNESS_MAX_MINUTES = 10;

function readJsonSafe(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function isIsoTimestamp(value) {
  if (!value || typeof value !== 'string') return false;
  return !Number.isNaN(Date.parse(value));
}

function ageMinutes(iso) {
  if (!isIsoTimestamp(iso)) return null;
  const ms = Date.now() - Date.parse(iso);
  return Math.floor(ms / 60000);
}

function classify(score) {
  if (score >= 90) return 'calm';
  if (score >= 70) return 'caution';
  if (score >= 40) return 'drift';
  return 'blocked';
}

function parseLedgerEntries() {
  if (!fs.existsSync(LEDGER_PATH)) return [];
  return fs
    .readFileSync(LEDGER_PATH, 'utf8')
    .split(/\r?\n/)
    .map((x) => x.trim())
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function latestCycleTimestampFromLedger(entries) {
  const cycleEntry = [...entries]
    .reverse()
    .find((x) => String(x?.type || '').toLowerCase() !== 'indicator_watchdog');
  if (!cycleEntry) return null;
  return cycleEntry.created_at || cycleEntry.timestamp || null;
}

function probableCause(checks) {
  const failed = checks.filter((c) => !c.pass).map((c) => c.id);
  if (failed.includes('indicator_present') || failed.includes('indicator_schema_keys')) {
    return 'Indicator source file is missing or malformed.';
  }
  if (failed.includes('indicator_timestamp_valid') || failed.includes('indicator_fresh')) {
    return 'Indicator freshness/timestamp drift. Run cycle routine to refresh reports.';
  }
  if (failed.includes('guard_green') || failed.includes('manifest_operating_state')) {
    return 'Guard or freeze operating-state mismatch.';
  }
  if (failed.includes('cycle_record_recent')) {
    return 'Cycle record may not have run recently.';
  }
  return 'Minor consistency drift detected.';
}

function advisoryForAttitude(attitude, checks) {
  if (attitude === 'calm') {
    return {
      level: 'info',
      title: 'No action required',
      suggestion: 'Watchdog posture is calm. Keep current routine cadence.',
      probable_cause: 'none',
      target_files: [],
    };
  }

  return {
    level: attitude === 'blocked' ? 'high' : 'medium',
    title: 'Indicator drift advisory',
    suggestion:
      'Run: npm run cycle:routine, then npm run security:sentinel-refresh. Review z_indicator_watchdog report before any manual patch.',
    probable_cause: probableCause(checks),
    target_files: [
      'data/reports/z_cycle_indicator.json',
      'data/reports/z_sandbox_phase_guard.json',
      'data/reports/z_cycle_ledger.jsonl',
    ],
  };
}

function main() {
  const indicator = readJsonSafe(INDICATOR_PATH);
  const guard = readJsonSafe(GUARD_PATH);
  const manifest = readJsonSafe(MANIFEST_PATH);
  const ledger = parseLedgerEntries();

  const latestCycle = indicator?.latest_cycle || null;
  const indicatorTs = indicator?.generated_at || latestCycle?.created_at || null;
  const indicatorAgeMin = ageMinutes(indicatorTs);
  const latestLedgerCycleTs = latestCycleTimestampFromLedger(ledger);
  const latestLedgerAgeMin = ageMinutes(latestLedgerCycleTs);

  let score = 0;
  const checks = [];

  const indicatorPresent = Boolean(indicator);
  checks.push({
    id: 'indicator_present',
    pass: indicatorPresent,
    note: indicatorPresent ? 'z_cycle_indicator.json present' : 'missing z_cycle_indicator.json',
    weight: 10,
  });
  if (indicatorPresent) score += 10;

  const indicatorSchemaKeys =
    Boolean(indicator?.status) &&
    Number.isFinite(Number(indicator?.total_cycles)) &&
    latestCycle !== null;
  checks.push({
    id: 'indicator_schema_keys',
    pass: indicatorSchemaKeys,
    note: indicatorSchemaKeys ? 'required indicator keys present' : 'required indicator keys missing',
    weight: 10,
  });
  if (indicatorSchemaKeys) score += 10;

  const indicatorTimestampValid = isIsoTimestamp(indicatorTs);
  checks.push({
    id: 'indicator_timestamp_valid',
    pass: indicatorTimestampValid,
    note: indicatorTimestampValid ? `timestamp=${indicatorTs}` : 'invalid/missing indicator timestamp',
    weight: 10,
  });
  if (indicatorTimestampValid) score += 10;

  const indicatorFresh =
    indicatorAgeMin !== null && indicatorAgeMin >= 0 && indicatorAgeMin <= FRESHNESS_MAX_MINUTES;
  checks.push({
    id: 'indicator_fresh',
    pass: indicatorFresh,
    note:
      indicatorAgeMin === null
        ? 'indicator age unknown'
        : `indicator age=${indicatorAgeMin}m (max ${FRESHNESS_MAX_MINUTES}m)`,
    weight: 20,
  });
  if (indicatorFresh) score += 20;

  const guardGreen = String(guard?.status || '').toLowerCase() === 'green';
  checks.push({
    id: 'guard_green',
    pass: guardGreen,
    note: `guard status=${guard?.status || 'unknown'}`,
    weight: 30,
  });
  if (guardGreen) score += 30;

  const manifestPause = String(manifest?.operating_state || '') === 'paused_pending_nas_sync';
  checks.push({
    id: 'manifest_operating_state',
    pass: manifestPause,
    note: `operating_state=${manifest?.operating_state || 'unknown'}`,
    weight: 10,
  });
  if (manifestPause) score += 10;

  const cycleRecordRecent =
    latestLedgerAgeMin !== null && latestLedgerAgeMin >= 0 && latestLedgerAgeMin <= FRESHNESS_MAX_MINUTES;
  checks.push({
    id: 'cycle_record_recent',
    pass: cycleRecordRecent,
    note:
      latestLedgerAgeMin === null
        ? 'cycle ledger age unknown'
        : `latest cycle age=${latestLedgerAgeMin}m (max ${FRESHNESS_MAX_MINUTES}m)`,
    weight: 10,
  });
  if (cycleRecordRecent) score += 10;

  const attitude = classify(score);
  const advisory = advisoryForAttitude(attitude, checks);
  const now = new Date().toISOString();

  const ledgerEntry = {
    timestamp: now,
    type: 'indicator_watchdog',
    integrity_score: score,
    attitude,
    notes: checks
      .filter((c) => c.pass)
      .map((c) => c.id)
      .join(' | '),
  };

  fs.mkdirSync(path.dirname(LEDGER_PATH), { recursive: true });
  fs.appendFileSync(LEDGER_PATH, `${JSON.stringify(ledgerEntry)}\n`, 'utf8');

  const payload = {
    generated_at: now,
    status: attitude === 'calm' ? 'green' : attitude === 'caution' ? 'hold' : 'blocked',
    integrity_score: score,
    attitude,
    freshness_window_minutes: FRESHNESS_MAX_MINUTES,
    indicator_age_minutes: indicatorAgeMin,
    latest_cycle_age_minutes: latestLedgerAgeMin,
    checks,
  };

  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  fs.writeFileSync(OUT_ADVISORY_JSON, `${JSON.stringify({ generated_at: now, ...advisory }, null, 2)}\n`, 'utf8');

  const md = [
    '# Z Indicator Watchdog',
    '',
    `Generated: ${now}`,
    `Status: ${payload.status.toUpperCase()}`,
    `Integrity score: ${score}/100`,
    `Attitude: ${attitude}`,
    '',
    '## Checks',
    ...checks.map((c) => `- [${c.pass ? 'x' : ' '}] ${c.id}: ${c.note}`),
    '',
  ];
  fs.writeFileSync(OUT_MD, `${md.join('\n')}\n`, 'utf8');

  const advisoryMd = [
    '# Z Indicator Watchdog Advisory',
    '',
    `Generated: ${now}`,
    `Level: ${advisory.level}`,
    `Title: ${advisory.title}`,
    '',
    `Probable cause: ${advisory.probable_cause}`,
    '',
    `Suggestion: ${advisory.suggestion}`,
    '',
    '## Target Files',
    ...(advisory.target_files.length ? advisory.target_files.map((f) => `- ${f}`) : ['- none']),
    '',
  ];
  fs.writeFileSync(OUT_ADVISORY_MD, `${advisoryMd.join('\n')}\n`, 'utf8');

  console.log(`Z indicator watchdog complete: score=${score} attitude=${attitude}`);
}

main();
