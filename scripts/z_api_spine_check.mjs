#!/usr/bin/env node
/**
 * Z-API-SPINE-1 — Universal API Power Cell registry validator (read-only).
 * Parses spine registry + communication flow policy; validates rows and collisions.
 * Writes JSON + MD reports. Exit 1 only when overall_signal is RED.
 * Does not start servers, run smoke commands, deploy, or call non-loopback URLs.
 * Optional: --with-health-probe — GET loopback URLs only where allow_health_probe is true.
 */
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { URL } from 'node:url';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const REG_PATH = path.join(ROOT, 'data', 'z_api_spine_registry.json');
const POL_PATH = path.join(ROOT, 'data', 'z_api_communication_flow_policy.json');
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_api_spine_report.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_api_spine_report.md');

const SCHEMA_REPORT = 'z_api_spine_report_v1';

const OBSERVER_KEYS = ['role_id', 'purpose', 'allowed_actions', 'forbidden_actions', 'autonomy_level', 'related_docs'];

const SERVICE_KEYS = [
  'service_id',
  'display_name',
  'project_id',
  'project_path_or_external_note',
  'service_type',
  'environment',
  'local_base_url',
  'health_path',
  'route_families',
  'frontend_consumers',
  'backend_dependencies',
  'smoke_command',
  'readiness_command',
  'api_gate_ref',
  'awareness_capsule_ref',
  'ownership',
  'risk_class',
  'autonomy_level',
  'deployment_status',
  'cloudflare_status',
  'data_sensitivity',
  'child_safety_relevance',
  'allowed_auto_checks',
  'human_gated_actions',
  'forbidden_auto_actions',
  'related_docs',
  'related_reports',
  'allow_health_probe',
  'explicit_route_sharing_with',
];

function readJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    return { __error: e.message };
  }
}

function rankSeverity(s) {
  const u = String(s || '').toUpperCase();
  if (u === 'RED') return 4;
  if (u === 'BLUE') return 3;
  if (u === 'YELLOW') return 2;
  if (u === 'GREEN') return 1;
  return 0;
}

function maxSeverity(a, b) {
  return rankSeverity(a) >= rankSeverity(b) ? a : b;
}

function normalizeRoute(r) {
  return String(r || '')
    .trim()
    .toLowerCase()
    .replace(/\/+$/, '') || '/';
}

function normName(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
}

function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

function isProdLike(env) {
  const e = String(env || '').toLowerCase();
  return e === 'production' || e === 'staging';
}

function sharingCovers(a, bId) {
  const arr = Array.isArray(a.explicit_route_sharing_with) ? a.explicit_route_sharing_with : [];
  return arr.map(String).includes(String(bId));
}

function isLoopbackUrl(u) {
  try {
    const x = new URL(u);
    return x.protocol === 'http:' && (x.hostname === '127.0.0.1' || x.hostname === 'localhost');
  } catch {
    return false;
  }
}

function probeHealth(service) {
  return new Promise((resolve) => {
    const base = String(service.local_base_url || '').replace(/\/+$/, '');
    const hp = String(service.health_path || '');
    const urlStr = hp ? `${base}${hp.startsWith('/') ? hp : `/${hp}`}` : base;
    let u;
    try {
      u = new URL(urlStr);
    } catch (e) {
      resolve({ ok: false, note: `bad_url: ${e.message}` });
      return;
    }
    if (!isLoopbackUrl(urlStr)) {
      resolve({ ok: false, note: 'non_loopback_refused' });
      return;
    }
    const req = http.get(urlStr, { timeout: 2500 }, (res) => {
      res.resume();
      resolve({ ok: res.statusCode >= 200 && res.statusCode < 400, statusCode: res.statusCode });
    });
    req.on('error', (err) => resolve({ ok: false, note: err.message }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ ok: false, note: 'timeout' });
    });
  });
}

function validatePolicy(pol) {
  const issues = [];
  if (!pol || pol.__error) {
    issues.push({ service_id: '—', severity: 'RED', code: 'policy_parse', message: pol?.__error || 'Policy missing.' });
    return issues;
  }
  if (!pol.alert_policy || typeof pol.alert_policy !== 'object') {
    issues.push({ service_id: '—', severity: 'YELLOW', code: 'alert_policy', message: 'alert_policy block recommended.' });
  }
  if (!Array.isArray(pol.forbidden_auto_actions)) {
    issues.push({ service_id: '—', severity: 'YELLOW', code: 'forbidden_auto', message: 'forbidden_auto_actions should be an array.' });
  }
  return issues;
}

function validateRegistryTop(reg) {
  const issues = [];
  if (!reg || reg.__error) {
    issues.push({ service_id: '—', severity: 'RED', code: 'registry_parse', message: reg?.__error || 'Registry missing.' });
    return issues;
  }
  if (reg.schema !== 'z_api_spine_registry_v1') {
    issues.push({ service_id: '—', severity: 'YELLOW', code: 'registry_schema', message: 'Unexpected registry schema.' });
  }
  if (!Array.isArray(reg.observer_roles)) {
    issues.push({ service_id: '—', severity: 'RED', code: 'observer_roles', message: 'observer_roles must be an array.' });
  } else {
    for (const role of reg.observer_roles) {
      const id = role?.role_id || '—';
      for (const k of OBSERVER_KEYS) {
        if (!(k in role)) {
          issues.push({ service_id: id, severity: 'RED', code: 'observer_field', message: `Observer role missing field: ${k}` });
        }
      }
      if (role && !Array.isArray(role.allowed_actions)) {
        issues.push({ service_id: id, severity: 'RED', code: 'observer_allowed', message: 'allowed_actions must be an array.' });
      }
      if (role && !Array.isArray(role.forbidden_actions)) {
        issues.push({ service_id: id, severity: 'RED', code: 'observer_forbidden', message: 'forbidden_actions must be an array.' });
      }
      if (role && !Array.isArray(role.related_docs)) {
        issues.push({ service_id: id, severity: 'RED', code: 'observer_docs', message: 'related_docs must be an array.' });
      }
    }
  }
  if (!Array.isArray(reg.spines)) {
    issues.push({ service_id: '—', severity: 'RED', code: 'spines', message: 'spines must be an array.' });
  }
  if (!Array.isArray(reg.services)) {
    issues.push({ service_id: '—', severity: 'RED', code: 'services', message: 'services must be an array.' });
  }
  return issues;
}

function validateServiceRow(s) {
  const issues = [];
  const id = s?.service_id || '—';
  for (const k of SERVICE_KEYS) {
    if (!(k in s)) {
      issues.push({ service_id: id, severity: 'RED', code: 'service_field', message: `Missing field: ${k}` });
    }
  }
  if (typeof s.child_safety_relevance !== 'boolean') {
    issues.push({ service_id: id, severity: 'RED', code: 'child_flag', message: 'child_safety_relevance must be boolean.' });
  }
  if (typeof s.allow_health_probe !== 'boolean') {
    issues.push({ service_id: id, severity: 'RED', code: 'probe_flag', message: 'allow_health_probe must be boolean.' });
  }
  for (const arrKey of [
    'route_families',
    'frontend_consumers',
    'backend_dependencies',
    'allowed_auto_checks',
    'human_gated_actions',
    'forbidden_auto_actions',
    'related_docs',
    'related_reports',
    'explicit_route_sharing_with',
  ]) {
    if (!Array.isArray(s[arrKey])) {
      issues.push({ service_id: id, severity: 'RED', code: arrKey, message: `${arrKey} must be an array.` });
    }
  }
  if (s.allow_health_probe && String(s.local_base_url || '').trim() && !isLoopbackUrl(String(s.local_base_url).trim())) {
    issues.push({
      service_id: id,
      severity: 'RED',
      code: 'probe_non_loopback',
      message: 'allow_health_probe true but local_base_url is not loopback http — refused in Phase 1.',
    });
  }
  return issues;
}

function duplicateServiceIds(services) {
  const seen = new Map();
  const dups = [];
  for (const s of services) {
    const id = String(s.service_id || '');
    if (!id) continue;
    seen.set(id, (seen.get(id) || 0) + 1);
  }
  for (const [id, c] of seen) {
    if (c > 1) dups.push(id);
  }
  return dups;
}

function duplicateBaseHealth(services) {
  const keyToIds = new Map();
  for (const s of services) {
    const b = String(s.local_base_url || '').trim();
    const h = String(s.health_path || '').trim();
    if (!b) continue;
    const key = `${b}||${h}`;
    if (!keyToIds.has(key)) keyToIds.set(key, []);
    keyToIds.get(key).push(s.service_id);
  }
  const collisions = [];
  for (const [key, ids] of keyToIds) {
    if (ids.length > 1) collisions.push({ key, service_ids: ids });
  }
  return collisions;
}

function routeFamilyCollisions(services) {
  const routeMap = new Map();
  for (const s of services) {
    const fams = Array.isArray(s.route_families) ? s.route_families : [];
    for (const raw of fams) {
      const nr = normalizeRoute(raw);
      if (!nr || nr === '/') continue;
      if (!routeMap.has(nr)) routeMap.set(nr, []);
      routeMap.get(nr).push(s);
    }
  }
  const collisions = [];
  for (const [route, list] of routeMap) {
    if (list.length < 2) continue;
    const ids = list.map((x) => x.service_id);
    let explicitOk = true;
    for (let i = 0; i < list.length; i++) {
      for (let j = 0; j < list.length; j++) {
        if (i === j) continue;
        if (!sharingCovers(list[i], list[j].service_id)) explicitOk = false;
      }
    }
    if (explicitOk) continue;
    const anyProd = list.some((x) => isProdLike(x.environment));
    const allRef = list.every((x) => String(x.environment || '').toLowerCase() === 'reference_only');
    if (allRef) continue;
    collisions.push({
      route_family: route,
      service_ids: ids,
      severity: anyProd ? 'RED' : 'YELLOW',
      code: anyProd ? 'route_collision_prod' : 'route_collision_advisory',
    });
  }
  return collisions;
}

function wordingSimilarityIssues(services) {
  const issues = [];
  const rows = services.filter((s) => s.display_name);
  for (let i = 0; i < rows.length; i++) {
    for (let j = i + 1; j < rows.length; j++) {
      const a = rows[i];
      const b = rows[j];
      const na = normName(a.display_name);
      const nb = normName(b.display_name);
      if (na.length < 6 || nb.length < 6) continue;
      const dist = levenshtein(na, nb);
      const maxLen = Math.max(na.length, nb.length);
      const sim = 1 - dist / maxLen;
      const substring = na.includes(nb) || nb.includes(na);
      if ((sim >= 0.82 && na.slice(0, 4) === nb.slice(0, 4)) || (substring && Math.abs(na.length - nb.length) <= 4)) {
        if (String(a.risk_class) !== String(b.risk_class)) {
          issues.push({
            service_id: `${a.service_id}|${b.service_id}`,
            severity: 'YELLOW',
            code: 'wording_similarity',
            message: `Similar display names with different risk_class: "${a.display_name}" vs "${b.display_name}".`,
          });
        }
      }
    }
  }
  return issues;
}

async function main() {
  const withProbe = process.argv.includes('--with-health-probe');
  const generatedAt = new Date().toISOString();
  const reg = readJson(REG_PATH);
  const pol = readJson(POL_PATH);

  let issues = [];
  issues = issues.concat(validatePolicy(pol));
  issues = issues.concat(validateRegistryTop(reg));

  const services = reg && Array.isArray(reg.services) ? reg.services : [];
  const serviceSummaries = [];
  const probeResults = [];

  for (const s of services) {
    issues = issues.concat(validateServiceRow(s));
    serviceSummaries.push({
      service_id: s.service_id,
      display_name: s.display_name,
      environment: s.environment,
      deployment_status: s.deployment_status,
      cloudflare_status: s.cloudflare_status,
      risk_class: s.risk_class,
    });
  }

  const dupIds = duplicateServiceIds(services);
  for (const id of dupIds) {
    issues.push({ service_id: id, severity: 'RED', code: 'duplicate_service_id', message: `Duplicate service_id: ${id}` });
  }

  const baseHealth = duplicateBaseHealth(services);
  for (const c of baseHealth) {
    const probeDup = services.filter((s) => c.service_ids.includes(s.service_id) && s.allow_health_probe);
    issues.push({
      service_id: c.service_ids.join('|'),
      severity: probeDup.length >= 2 ? 'RED' : 'YELLOW',
      code: 'duplicate_base_health',
      message: `Duplicate local_base_url+health_path: ${c.key} (${c.service_ids.join(', ')})`,
    });
  }

  const routeCols = routeFamilyCollisions(services);
  for (const rc of routeCols) {
    issues.push({
      service_id: rc.service_ids.join('|'),
      severity: rc.severity,
      code: rc.code,
      message: `Route family "${rc.route_family}" claimed by: ${rc.service_ids.join(', ')} without explicit_route_sharing_with.`,
    });
  }

  issues = issues.concat(wordingSimilarityIssues(services));

  if (withProbe) {
    for (const s of services) {
      if (!s.allow_health_probe || !String(s.local_base_url || '').trim()) continue;
      const r = await probeHealth(s);
      probeResults.push({ service_id: s.service_id, ...r });
      if (!r.ok) {
        issues.push({
          service_id: s.service_id,
          severity: 'YELLOW',
          code: 'health_probe',
          message: `Health probe: ${r.note || `status ${r.statusCode}`}`,
        });
      }
    }
  }

  let overall = 'GREEN';
  for (const iss of issues) {
    overall = maxSeverity(overall, iss.severity);
  }

  const notificationCandidates = [];
  for (const iss of issues) {
    if (iss.severity === 'RED') {
      notificationCandidates.push({
        signal: 'RED',
        title: `RED: ${iss.code}`,
        detail: `${iss.service_id}: ${iss.message}`,
      });
    }
    if (iss.severity === 'BLUE') {
      notificationCandidates.push({
        signal: 'BLUE',
        title: `BLUE: ${iss.code}`,
        detail: `${iss.service_id}: ${iss.message}`,
      });
    }
  }

  for (const s of services) {
    const ds = String(s.deployment_status || '');
    const cf = String(s.cloudflare_status || '');
    if (cf === 'UNKNOWN' && ['high', 'sacred'].includes(String(s.risk_class || '').toLowerCase())) {
      notificationCandidates.push({
        signal: 'BLUE',
        title: `BLUE: cloudflare posture for ${s.service_id}`,
        detail: 'UNKNOWN cloudflare_status with elevated risk_class — AMK charter before edge bind.',
      });
      overall = maxSeverity(overall, 'BLUE');
    }
    if (ds === 'NO_GO' && String(s.environment || '').toLowerCase() !== 'reference_only') {
      notificationCandidates.push({
        signal: 'BLUE',
        title: `BLUE: deployment NO_GO for ${s.service_id}`,
        detail: 'Human lane required before treating service as shippable.',
      });
      overall = maxSeverity(overall, 'BLUE');
    }
  }

  const dedup = [];
  const seen = new Set();
  for (const n of notificationCandidates) {
    const k = `${n.signal}|${n.title}|${n.detail}`;
    if (seen.has(k)) continue;
    seen.add(k);
    dedup.push(n);
  }

  const payload = {
    schema: SCHEMA_REPORT,
    generated_at: generatedAt,
    overall_signal: overall,
    registry_path: path.relative(ROOT, REG_PATH).split(path.sep).join('/'),
    policy_path: path.relative(ROOT, POL_PATH).split(path.sep).join('/'),
    cli: { with_health_probe: withProbe },
    services: serviceSummaries,
    route_collision_notes: routeCols,
    wording_collision_notes: issues.filter((i) => i.code === 'wording_similarity'),
    issues,
    notification_candidates_red_blue_only: dedup.filter((n) => n.signal === 'RED' || n.signal === 'BLUE'),
    health_probe_results: withProbe ? probeResults : [],
    law_note: pol && !pol.__error ? pol.law_note : '',
    note: 'YELLOW stays quiet for AMK notifications by default. API spine is not a gateway and not a service mesh.',
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  const md = [
    '# Z-API-SPINE-1 — API Power Cell report',
    '',
    `- Generated: ${generatedAt}`,
    `- Overall signal: **${overall}**`,
    `- Registry: \`${payload.registry_path}\``,
    `- Policy: \`${payload.policy_path}\``,
    withProbe ? '- Health probe: **enabled** (loopback only)' : '- Health probe: **off** (default Phase 1)',
    '',
    '## Services',
    '',
    ...serviceSummaries.map((r) => `- **${r.service_id}** — ${r.display_name} (${r.environment}, deploy=${r.deployment_status}, CF=${r.cloudflare_status})`),
    '',
    '## Route / wording notes',
    '',
    ...(routeCols.length ? routeCols.map((c) => `- **${c.severity}** route \`${c.route_family}\`: ${c.service_ids.join(', ')}`) : ['- (none)']),
    '',
    ...(payload.wording_collision_notes.length
      ? payload.wording_collision_notes.map((i) => `- **YELLOW** ${i.message}`)
      : ['- (no wording collisions flagged)']),
    '',
    '## Issues',
    '',
    ...(issues.length ? issues.map((i) => `- [${i.severity}] **${i.service_id}** ${i.code}: ${i.message}`) : ['- (none)']),
    '',
    '## AMK notification candidates (RED / BLUE only)',
    '',
    ...(payload.notification_candidates_red_blue_only.length
      ? payload.notification_candidates_red_blue_only.map((n) => `- **${n.signal}** ${n.title} — ${n.detail}`)
      : ['- (none)']),
    '',
    payload.law_note ? `## Law\n\n${payload.law_note}\n` : '',
    '',
    payload.note,
    '',
  ];
  fs.writeFileSync(OUT_MD, md.join('\n'), 'utf8');

  console.log(JSON.stringify({ ok: true, overall_signal: overall, out_json: OUT_JSON, out_md: OUT_MD }, null, 2));

  process.exit(overall === 'RED' ? 1 : 0);
}

main();
