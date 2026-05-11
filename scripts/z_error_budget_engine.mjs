import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const CONFIG_PATH = path.join(ROOT, 'config', 'z_error_budget_profiles.json');
const OUT_JSON = path.join(REPORTS_DIR, 'z_error_budget.json');
const OUT_MD = path.join(REPORTS_DIR, 'z_error_budget.md');
const HISTORY_JSONL = path.join(REPORTS_DIR, 'z_error_budget_ledger.jsonl');

const severityRank = { green: 0, warn: 1, critical: 2, unknown: -1 };

function ensureReportsDir() {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

function readJson(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.warn(`Failed to read JSON from ${filePath}:`, error.message);
    return null;
  }
}

function listIncidentFiles(dir) {
  try {
    if (!fs.existsSync(dir)) return [];
    return fs
      .readdirSync(dir)
      .filter((fileName) => fileName.toLowerCase().endsWith('.json'))
      .map((fileName) => path.join(dir, fileName));
  } catch (error) {
    console.warn(`Failed to list incidents in ${dir}:`, error.message);
    return [];
  }
}

function parseTs(value) {
  if (!value) return null;
  const asNumber = Number(value);
  if (!Number.isNaN(asNumber)) return asNumber;
  const parsed = Date.parse(value);
  if (!Number.isNaN(parsed)) return parsed;
  return null;
}

function collectFailures({ sloGuard, incidentFiles, windowStartMs, windowEndMs }) {
  const failures = [];

  for (const incidentPath of incidentFiles) {
    const incident = readJson(incidentPath);
    if (!incident) continue;

    const ts =
      parseTs(incident.generated_at) ||
      parseTs(incident.ts) ||
      parseTs(incident.time) ||
      parseTs(incident.timestamp);
    if (!ts) continue;
    if (ts < windowStartMs || ts > windowEndMs) continue;

    const durationSeconds =
      Number(incident.duration_seconds) ||
      Number(incident.duration_sec) ||
      Number(incident.duration) ||
      0;

    failures.push({
      ts,
      source: 'incident',
      duration_seconds: Number.isFinite(durationSeconds) ? durationSeconds : 60,
      ref: path.basename(incidentPath),
      kind: incident.kind || incident.type || 'incident'
    });
  }

  const guardTs = parseTs(sloGuard?.generated_at);
  const guardStatus = String(sloGuard?.status || sloGuard?.state || '').toLowerCase();
  if (
    guardTs &&
    guardTs >= windowStartMs &&
    guardTs <= windowEndMs &&
    ['failed', 'fail', 'error'].includes(guardStatus)
  ) {
    failures.push({
      ts: guardTs,
      source: 'slo_guard',
      duration_seconds: 60,
      ref: 'z_slo_guard.json',
      kind: 'slo_guard_failed'
    });
  }

  failures.sort((a, b) => a.ts - b.ts);
  return failures;
}

function buildWindowSummary(failures, windowSeconds, sloTarget, warnBurn, criticalBurn) {
  const spentSeconds = failures.reduce(
    (sum, entry) => sum + (Number(entry.duration_seconds) || 0),
    0
  );
  const allowedSeconds = Math.round(windowSeconds * (1 - sloTarget));
  const remainingSeconds = allowedSeconds - spentSeconds;
  const elapsedSeconds = Math.max(1, windowSeconds);
  const spentRate = spentSeconds / elapsedSeconds;
  const allowedRate = Math.max(1, windowSeconds) ? allowedSeconds / windowSeconds : 0;
  const burnRate =
    allowedRate > 0 ? Number((spentRate / allowedRate).toFixed(3)) : spentSeconds > 0 ? Infinity : 0;

  let status = 'green';
  if (remainingSeconds <= 0 || burnRate === Infinity) {
    status = 'critical';
  } else if (burnRate >= criticalBurn) {
    status = 'critical';
  } else if (burnRate >= warnBurn) {
    status = 'warn';
  }

  return {
    spentSeconds,
    allowedSeconds,
    remainingSeconds,
    burnRate,
    status,
    failure_count: failures.length,
    sample_failures: failures.slice(-10)
  };
}

function run() {
  const nowIso = new Date().toISOString();
  const config = readJson(CONFIG_PATH);

  if (!config?.profiles?.length) {
    console.error(`Missing/invalid config: ${CONFIG_PATH}`);
    process.exitCode = 1;
    return;
  }

  ensureReportsDir();

  const defaultWindows = Array.isArray(config.default?.windows_days)
    ? config.default.windows_days
    : [7];
  const warnBurn = Number(config.default?.warn_burn_rate ?? 1.0);
  const criticalBurn = Number(config.default?.critical_burn_rate ?? 2.0);

  const outputs = [];

  for (const profile of config.profiles) {
    const name = String(profile.name || 'UNKNOWN');
    const sloTarget = Math.min(1, Math.max(0, Number(profile.slo_target ?? 0.99)));
    const windowsDays =
      Array.isArray(profile.windows_days) && profile.windows_days.length
        ? profile.windows_days
        : defaultWindows;

    const sloGuardPath = path.join(ROOT, profile.sources?.slo_guard || 'data/reports/z_slo_guard.json');
    const incidentsDir = path.join(
      ROOT,
      profile.sources?.incidents_dir || 'data/reports/incidents'
    );

    const sloGuard = readJson(sloGuardPath);
    const incidentFiles = listIncidentFiles(incidentsDir);

    const profileOutput = {
      profile: name,
      slo_target: sloTarget,
      windows: []
    };

    for (const days of windowsDays) {
      const windowSeconds = Math.round(Number(days) * 86400);
      if (windowSeconds <= 0) continue;
      const nowMs = Date.now();
      const windowMs = windowSeconds * 1000;
      const windowStartMs = nowMs - windowMs;
      const failures = collectFailures({
        sloGuard,
        incidentFiles,
        windowStartMs,
        windowEndMs: nowMs
      });

      const windowSummary = buildWindowSummary(
        failures,
        windowSeconds,
        sloTarget,
        warnBurn,
        criticalBurn
      );

      profileOutput.windows.push({
        window_days: Number(days),
        window_start: new Date(windowStartMs).toISOString(),
        window_end: new Date(nowMs).toISOString(),
        allowed_downtime_seconds: windowSummary.allowedSeconds,
        spent_downtime_seconds: windowSummary.spentSeconds,
        remaining_downtime_seconds: windowSummary.remainingSeconds,
        burn_rate: Number.isFinite(windowSummary.burnRate)
          ? Number(windowSummary.burnRate.toFixed(3))
          : windowSummary.burnRate,
        status: windowSummary.status,
        failure_count: windowSummary.failure_count,
        sample_failures: windowSummary.sample_failures
      });
    }

    if (profileOutput.windows.length) {
      const worstWindow = profileOutput.windows.reduce((worst, current) => {
        return severityRank[current.status] > severityRank[worst.status] ? current : worst;
      }, profileOutput.windows[0]);
      profileOutput.overall_status = worstWindow.status;
    } else {
      profileOutput.overall_status = 'unknown';
    }

    outputs.push(profileOutput);
  }

  const overall = outputs.reduce(
    (worst, candidate) => {
      return severityRank[candidate.overall_status] > severityRank[worst.overall_status]
        ? candidate
        : worst;
    },
    outputs[0]
  );

  const payload = {
    generated_at: nowIso,
    mode: 'read-only',
    overall_status: overall?.overall_status || 'unknown',
    profiles: outputs,
    notes:
      'Error budget is computed from incidents + guard status. No auto-actions. Adjust incident duration_seconds to improve precision.'
  };

  fs.writeFileSync(OUT_JSON, JSON.stringify(payload, null, 2) + '\n', 'utf8');

  const md = [];
  md.push('# Z Error Budget Report', '');
  md.push(`Generated: ${payload.generated_at}`);
  md.push(`Mode: ${payload.mode}`);
  md.push(`Overall: **${String(payload.overall_status).toUpperCase()}**`, '');

  for (const profile of payload.profiles) {
    md.push(`## ${profile.profile}`, '');
    md.push(`SLO target: ${profile.slo_target}`, '');
    for (const window of profile.windows) {
      md.push(`### Window ${window.window_days}d — ${String(window.status).toUpperCase()}`);
      md.push(`- Allowed downtime: ${window.allowed_downtime_seconds}s`);
      md.push(`- Spent downtime: ${window.spent_downtime_seconds}s`);
      md.push(`- Remaining: ${window.remaining_downtime_seconds}s`);
      md.push(`- Burn rate: ${window.burn_rate}`);
      md.push(`- Failure count: ${window.failure_count}`);
      md.push('');
    }
  }

  fs.writeFileSync(OUT_MD, md.join('\n') + '\n', 'utf8');

  const ledgerEntry = {
    ts: payload.generated_at,
    type: 'error_budget',
    overall_status: payload.overall_status,
    profiles: payload.profiles.map((profile) => ({
      profile: profile.profile,
      overall_status: profile.overall_status
    }))
  };
  fs.appendFileSync(HISTORY_JSONL, JSON.stringify(ledgerEntry) + '\n', 'utf8');

  console.log(`✅ Error budget written: ${OUT_JSON}`);
}

run();
