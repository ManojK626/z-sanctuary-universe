#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const WATCHDOG_PATH = path.resolve(ROOT, '..', 'Z-EAII-Watchdog.log');
const OUT_JSON = path.join(REPORTS_DIR, 'z_trust_scorecard.json');
const OUT_MD = path.join(REPORTS_DIR, 'z_trust_scorecard.md');

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function lastWatchdogTimestamp() {
  try {
    const text = fs.readFileSync(WATCHDOG_PATH, 'utf8');
    const rows = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('#'));
    if (!rows.length) return null;
    const ts = rows[rows.length - 1].split('|')[0]?.trim();
    const ms = Date.parse(ts);
    return Number.isNaN(ms) ? null : new Date(ms).toISOString();
  } catch {
    return null;
  }
}

function scorePenalty(status, map) {
  if (!status) return map.unknown ?? 0;
  return map[status] ?? map.unknown ?? 0;
}

const observer = readJson(path.join(REPORTS_DIR, 'z_cross_project_observer.json'));
const freshness = readJson(path.join(REPORTS_DIR, 'z_report_freshness.json'));
const boundary = readJson(path.join(REPORTS_DIR, 'z_boundary_service_ownership.json'));
const releaseGate = readJson(path.join(REPORTS_DIR, 'z_release_gate.json'));
const lastWatchdogAt = lastWatchdogTimestamp();

let score = 100;
const penalties = [];

const observerPenalty = scorePenalty(observer?.status, { green: 0, watch: 10, hold: 25, unknown: 15 });
score -= observerPenalty;
penalties.push(`observer=${observer?.status || 'unknown'} (-${observerPenalty})`);

const freshPenalty = scorePenalty(freshness?.status, { green: 0, hold: 20, unknown: 15 });
score -= freshPenalty;
penalties.push(`freshness=${freshness?.status || 'unknown'} (-${freshPenalty})`);

const staleCritical = Number(freshness?.checks?.critical_24h_stale || 0);
const stalePenalty = Math.min(20, staleCritical * 3);
score -= stalePenalty;
penalties.push(`critical_24h_stale=${staleCritical} (-${stalePenalty})`);

const boundaryCount = Array.isArray(boundary?.violations) ? boundary.violations.length : 0;
const boundaryPenalty = Math.min(30, boundaryCount * 15);
score -= boundaryPenalty;
penalties.push(`boundary_violations=${boundaryCount} (-${boundaryPenalty})`);

if (releaseGate?.verdict && releaseGate.verdict !== 'go') {
  score -= 10;
  penalties.push(`release_gate=${releaseGate.verdict} (-10)`);
} else {
  penalties.push(`release_gate=${releaseGate?.verdict || 'unknown'} (-0)`);
}

if (lastWatchdogAt) {
  const ageMs = Date.now() - Date.parse(lastWatchdogAt);
  const ageHours = ageMs / 36e5;
  if (ageHours > 48) {
    score -= 10;
    penalties.push(`watchdog_age_hours=${ageHours.toFixed(1)} (-10)`);
  } else {
    penalties.push(`watchdog_age_hours=${ageHours.toFixed(1)} (-0)`);
  }
} else {
  score -= 10;
  penalties.push('watchdog_recent_event=missing (-10)');
}

score = Math.max(0, Math.min(100, Math.round(score)));
const grade = score >= 90 ? 'A' : score >= 75 ? 'B' : score >= 60 ? 'C' : score >= 45 ? 'D' : 'E';
const releaseGateStatus = score >= 80 && boundaryCount === 0 && freshness?.status === 'green' ? 'go' : 'hold';

const payload = {
  generated_at: new Date().toISOString(),
  trust_score: score,
  grade,
  release_gate: releaseGateStatus,
  components: {
    observer_status: observer?.status || 'unknown',
    freshness_status: freshness?.status || 'unknown',
    critical_24h_stale: staleCritical,
    boundary_violations: boundaryCount,
    last_watchdog_at: lastWatchdogAt,
    last_release_gate_verdict: releaseGate?.verdict || 'unknown',
  },
  penalties,
};

fs.mkdirSync(REPORTS_DIR, { recursive: true });
fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

const md = [
  '# Z Trust Scorecard',
  '',
  `Generated: ${payload.generated_at}`,
  `Trust score: **${payload.trust_score} / 100** (grade ${payload.grade})`,
  `Release gate recommendation: **${payload.release_gate.toUpperCase()}**`,
  '',
  '## Components',
  `- observer: ${payload.components.observer_status}`,
  `- freshness: ${payload.components.freshness_status}`,
  `- critical stale (24h): ${payload.components.critical_24h_stale}`,
  `- boundary violations: ${payload.components.boundary_violations}`,
  `- last watchdog: ${payload.components.last_watchdog_at || 'missing'}`,
  `- last release gate verdict: ${payload.components.last_release_gate_verdict}`,
  '',
  '## Penalties',
  ...payload.penalties.map((p) => `- ${p}`),
  '',
];
fs.writeFileSync(OUT_MD, md.join('\n'), 'utf8');

console.log(`Trust scorecard written: ${OUT_JSON} score=${payload.trust_score} grade=${payload.grade}`);
