#!/usr/bin/env node
/**
 * Z-Communication Health — Phase 6.2: flow integrity (manifests + AAFRTC + commflow + optional Zuno observer cross-check).
 * Advisory only. Freshness window: COMM_HEALTH_STALE_HOURS or default **36** (independent of Zuno observer threshold).
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const REPORTS = path.join(ROOT, 'data', 'reports');
const AAFRTC = path.join(REPORTS, 'z_aafrtc_context.json');
const GH = path.join(REPORTS, 'z_github_ai_comms_manifest.json');
const CF = path.join(REPORTS, 'z_cloudflare_ai_comms_manifest.json');
const COMMFLOW = path.join(REPORTS, 'z_ecosystem_commflow_verifier.json');
const ZUNO = path.join(REPORTS, 'zuno_system_state_report.json');
const OUTPUT = path.join(REPORTS, 'z_communication_health.json');

function readJsonSafe(file) {
  try {
    if (!fs.existsSync(file)) return null;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
}

function staleHoursEnv() {
  const comm = Number(process.env.COMM_HEALTH_STALE_HOURS);
  if (Number.isFinite(comm) && comm > 0) return comm;
  return 36;
}

function sourceManifestOrContext(absPath, thresholdMs, nowMs, withOk) {
  const present = fs.existsSync(absPath);
  if (!present) {
    return {
      present: false,
      fresh: false,
      ok: withOk ? null : null,
      generated_at: null,
      age_hours: null,
      stale: true,
    };
  }
  const m = readJsonSafe(absPath);
  const gen = m?.generated_at ?? null;
  const t = gen ? Date.parse(gen) : NaN;
  const valid = !Number.isNaN(t);
  const ageMs = valid ? nowMs - t : Infinity;
  const ageHours = valid ? Number((ageMs / 3600000).toFixed(2)) : null;
  const stale = !valid || ageMs > thresholdMs;
  const fresh = valid && !stale;
  let ok = null;
  if (withOk && typeof m?.ok === 'boolean') ok = m.ok;
  return {
    present: true,
    fresh,
    ok,
    generated_at: gen,
    age_hours: ageHours,
    stale,
  };
}

function observerFreshnessAggregate(gh, cf, aa, thresholdMs, nowMs) {
  const allPresent = gh.present && cf.present && aa.present;
  const stamps = [];
  if (gh.generated_at) stamps.push(Date.parse(gh.generated_at));
  if (cf.generated_at) stamps.push(Date.parse(cf.generated_at));
  if (aa.generated_at) stamps.push(Date.parse(aa.generated_at));
  const valid = stamps.length === 3 && stamps.every((x) => !Number.isNaN(x));
  if (!allPresent) {
    return {
      status: 'partial',
      stale_threshold_hours: thresholdMs / 3600000,
      max_age_hours: null,
      files_present: {
        aafrtc_context: aa.present,
        github_comms_manifest: gh.present,
        cloudflare_comms_manifest: cf.present,
      },
    };
  }
  if (!valid) {
    return {
      status: 'unknown',
      stale_threshold_hours: thresholdMs / 3600000,
      max_age_hours: null,
      files_present: {
        aafrtc_context: aa.present,
        github_comms_manifest: gh.present,
        cloudflare_comms_manifest: cf.present,
      },
    };
  }
  const oldest = Math.min(...stamps);
  const maxAgeMs = nowMs - oldest;
  const maxAgeHours = Number((maxAgeMs / 3600000).toFixed(2));
  const anyStale = stamps.some((t) => nowMs - t > thresholdMs);
  return {
    status: anyStale ? 'stale' : 'fresh',
    stale_threshold_hours: thresholdMs / 3600000,
    max_age_hours: maxAgeHours,
    files_present: {
      aafrtc_context: true,
      github_comms_manifest: true,
      cloudflare_comms_manifest: true,
    },
  };
}

function manifestAlignment(gh, cf) {
  const ghOk = gh.ok;
  const cfOk = cf.ok;
  let alignment = 'unknown';
  if (ghOk === true && cfOk === true) alignment = 'aligned';
  else if (ghOk === false || cfOk === false) alignment = 'drift';
  else if (ghOk !== null || cfOk !== null) alignment = 'partial';
  return {
    github_ok: ghOk,
    cloudflare_ok: cfOk,
    alignment,
  };
}

function commflowLayer(verifier) {
  if (!verifier || typeof verifier !== 'object') {
    return { posture: 'unknown', overall_status: null, generated_at: null };
  }
  const raw = String(verifier.overall_status || '').toLowerCase();
  let posture = 'unknown';
  if (raw === 'green') posture = 'aligned';
  else if (raw === 'amber') posture = 'attention';
  else if (raw === 'red') posture = 'blocked';
  return {
    posture,
    overall_status: raw || null,
    generated_at: verifier.generated_at ?? null,
  };
}

function layerScoreObserver(freshness) {
  switch (freshness.status) {
    case 'fresh':
      return 100;
    case 'stale':
      return 40;
    case 'partial':
      return 50;
    default:
      return 30;
  }
}

function layerScoreManifests(alignment) {
  switch (alignment) {
    case 'aligned':
      return 100;
    case 'partial':
      return 55;
    case 'drift':
      return 25;
    default:
      return 35;
  }
}

function layerScoreCommflow(posture) {
  switch (posture) {
    case 'aligned':
      return 100;
    case 'attention':
      return 55;
    case 'blocked':
      return 25;
    default:
      return 40;
  }
}

const generatedAt = new Date().toISOString();
const nowMs = Date.parse(generatedAt);
const thresholdMs = staleHoursEnv() * 3600 * 1000;

const ghDetail = sourceManifestOrContext(GH, thresholdMs, nowMs, true);
const cfDetail = sourceManifestOrContext(CF, thresholdMs, nowMs, true);
const aaDetail = sourceManifestOrContext(AAFRTC, thresholdMs, nowMs, false);
const verifier = readJsonSafe(COMMFLOW);
const zunoPrev = readJsonSafe(ZUNO);

const sources = {
  github_comms: {
    present: ghDetail.present,
    fresh: ghDetail.fresh,
    ok: ghDetail.ok,
    generated_at: ghDetail.generated_at,
    age_hours: ghDetail.age_hours,
  },
  cloudflare_comms: {
    present: cfDetail.present,
    fresh: cfDetail.fresh,
    ok: cfDetail.ok,
    generated_at: cfDetail.generated_at,
    age_hours: cfDetail.age_hours,
  },
  aafrtc_context: {
    present: aaDetail.present,
    fresh: aaDetail.fresh,
    generated_at: aaDetail.generated_at,
    age_hours: aaDetail.age_hours,
  },
};

const observer = observerFreshnessAggregate(ghDetail, cfDetail, aaDetail, thresholdMs, nowMs);
const manifests = manifestAlignment(ghDetail, cfDetail);
const flow = commflowLayer(verifier);

const issues = [];

if (!ghDetail.present) issues.push({ code: 'github_manifest_missing', severity: 'critical', message: 'GitHub AI comms manifest file missing' });
if (!cfDetail.present) issues.push({ code: 'cloudflare_manifest_missing', severity: 'critical', message: 'Cloudflare AI comms manifest file missing' });
if (!aaDetail.present) issues.push({ code: 'aafrtc_context_missing', severity: 'critical', message: 'AAFRTC context report missing' });
if (ghDetail.present && ghDetail.stale) issues.push({ code: 'github_stale', severity: 'warning', message: 'GitHub comms manifest older than freshness window' });
if (cfDetail.present && cfDetail.stale) issues.push({ code: 'cloudflare_stale', severity: 'warning', message: 'Cloudflare comms manifest older than freshness window' });
if (aaDetail.present && aaDetail.stale) issues.push({ code: 'aafrtc_stale', severity: 'warning', message: 'AAFRTC context older than freshness window' });
if (manifests.alignment === 'drift') {
  issues.push({ code: 'manifest_ok_mismatch', severity: 'high', message: 'One or more comms manifests report ok=false' });
}
if (flow.posture === 'blocked') {
  issues.push({ code: 'commflow_blocked', severity: 'warning', message: 'Ecosystem comm-flow verifier overall status is red' });
}

const cfState = zunoPrev?.external_observers?.cloudflare_observer_state;
const cfOkBool = cfDetail.ok;
if (zunoPrev && typeof cfState === 'string' && typeof cfOkBool === 'boolean') {
  if (cfState === 'synced' && cfOkBool === false) {
    issues.push({ code: 'observer_drift', severity: 'medium', message: 'Zuno observer state synced but Cloudflare manifest ok=false' });
  }
  if (cfState === 'drift' && cfOkBool === true) {
    issues.push({ code: 'observer_drift', severity: 'medium', message: 'Zuno observer state drift but Cloudflare manifest ok=true' });
  }
}

let observer_alignment = 'aligned';
if (issues.some((i) => i.code === 'observer_drift')) observer_alignment = 'drift';
else if (!ghDetail.present || !cfDetail.present || !aaDetail.present) observer_alignment = 'unknown';
else if (manifests.alignment === 'drift') observer_alignment = 'drift';

const sObs = layerScoreObserver(observer);
const sMan = layerScoreManifests(manifests.alignment);
const sFlow = layerScoreCommflow(flow.posture);
const healthScore = Math.round(sObs * 0.4 + sMan * 0.3 + sFlow * 0.3);

let structuralStatus = 'unknown';
if (healthScore >= 75 && flow.posture !== 'blocked') structuralStatus = 'stable';
else if (healthScore >= 48) structuralStatus = 'attention';
else structuralStatus = 'degraded';

let flow_status = 'healthy';
const critical = issues.filter((i) => i.severity === 'critical');
if (critical.length) flow_status = 'broken';
else if (
  issues.length > 0 ||
  structuralStatus !== 'stable' ||
  observer_alignment === 'drift' ||
  healthScore < 75
) {
  flow_status = 'degraded';
}

let note = '';
if (flow_status === 'healthy') {
  note = 'Communication flow healthy — manifests and observers within window; advisory only.';
} else if (flow_status === 'degraded') {
  note = 'Communication flow degraded — refresh comms/AAFRTC or review commflow; not a hard gate.';
} else {
  note = 'Communication flow broken — missing critical artifacts or manifest failure; remediate then re-verify.';
}

const output = {
  generated_at: generatedAt,
  health_score: healthScore,
  flow_status,
  status: structuralStatus,
  observer_alignment,
  issues,
  stale_threshold_hours: thresholdMs / 3600000,
  sources,
  observer_freshness: observer,
  manifests,
  commflow: {
    posture: flow.posture,
    overall_status: flow.overall_status,
    generated_at: flow.generated_at,
    source: 'data/reports/z_ecosystem_commflow_verifier.json',
  },
  note,
  zuno_cross_check: zunoPrev?.generated_at
    ? { used_previous_zuno_report: true, zuno_generated_at: zunoPrev.generated_at }
    : { used_previous_zuno_report: false },
  file_paths: {
    aafrtc_context: 'data/reports/z_aafrtc_context.json',
    github_ai_comms_manifest: 'data/reports/z_github_ai_comms_manifest.json',
    cloudflare_ai_comms_manifest: 'data/reports/z_cloudflare_ai_comms_manifest.json',
  },
};

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');

console.log('✅ Z-Communication Health generated');
console.log(`Output: ${OUTPUT} flow_status=${flow_status} score=${healthScore}`);
