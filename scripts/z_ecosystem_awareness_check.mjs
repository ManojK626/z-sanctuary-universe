#!/usr/bin/env node
/**
 * Z-AWARE-1 — Universal Ecosystem Awareness Spine (read-only).
 * Aggregates registry + optional project capsules; writes reports; exit 1 only on overall RED.
 * No deploy, API calls, child builds, servers, or bridge execution.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const REG_PATH = path.join(ROOT, 'data', 'z_ecosystem_awareness_registry.json');
const POL_PATH = path.join(ROOT, 'data', 'z_ecosystem_alert_policy.json');
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_ecosystem_awareness_report.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_ecosystem_awareness_report.md');

const SCHEMA_REPORT = 'z_ecosystem_awareness_report_v1';

const REGISTRY_PROJECT_KEYS = [
  'project_id',
  'display_name',
  'project_type',
  'repo_path_or_external_note',
  'capsule_path',
  'required_for_daily_status',
  'api_readiness_ref',
  'smoke_gate_ref',
  'indicator_ref',
  'notification_ref',
  'autonomy_level',
  'allowed_auto_checks',
  'human_gated_actions',
  'related_docs',
  'related_reports',
  'known_hold_reason',
  'deployment_status',
  'cloudflare_status',
  'owner_or_steward',
];

const CAPSULE_KEYS = [
  'schema',
  'project_id',
  'project_name',
  'primary_domain',
  'current_signal',
  'growth_percent',
  'required_checks',
  'api_health',
  'smoke_gate',
  'build_gate',
  'docs_gate',
  'autonomy_level',
  'allowed_auto_checks',
  'human_gated_actions',
  'related_docs',
  'related_reports',
  'notes',
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
  if (u === 'RED') return 3;
  if (u === 'BLUE') return 2;
  if (u === 'YELLOW') return 1;
  return 0;
}

function maxSeverity(a, b) {
  return rankSeverity(a) >= rankSeverity(b) ? a : b;
}

function validateRegistryShape(reg) {
  const issues = [];
  if (!reg || typeof reg !== 'object') {
    issues.push({ project_id: '—', severity: 'RED', code: 'registry_missing', message: 'Registry JSON missing or invalid.' });
    return issues;
  }
  if (reg.schema !== 'z_ecosystem_awareness_registry_v1') {
    issues.push({
      project_id: '—',
      severity: 'YELLOW',
      code: 'registry_schema',
      message: 'Unexpected registry schema field.',
    });
  }
  if (!Array.isArray(reg.projects)) {
    issues.push({ project_id: '—', severity: 'RED', code: 'registry_projects', message: 'registry.projects must be an array.' });
  }
  return issues;
}

function validateProjectRow(p) {
  const issues = [];
  const id = p?.project_id || '—';
  for (const k of REGISTRY_PROJECT_KEYS) {
    if (!(k in p)) {
      issues.push({ project_id: id, severity: 'RED', code: 'registry_row_field', message: `Missing field: ${k}` });
    }
  }
  if (typeof p.required_for_daily_status !== 'boolean') {
    issues.push({ project_id: id, severity: 'RED', code: 'required_flag', message: 'required_for_daily_status must be boolean.' });
  }
  if (!Array.isArray(p.allowed_auto_checks)) {
    issues.push({ project_id: id, severity: 'YELLOW', code: 'allowed_checks', message: 'allowed_auto_checks should be an array.' });
  }
  if (!Array.isArray(p.human_gated_actions)) {
    issues.push({ project_id: id, severity: 'RED', code: 'human_gated', message: 'human_gated_actions must be an array.' });
  }
  if (!Array.isArray(p.related_docs)) {
    issues.push({ project_id: id, severity: 'YELLOW', code: 'related_docs', message: 'related_docs must be an array (may be empty with known_hold_reason).' });
  }
  if (Array.isArray(p.related_docs) && p.related_docs.length === 0 && !String(p.known_hold_reason || '').trim()) {
    issues.push({
      project_id: id,
      severity: 'YELLOW',
      code: 'docs_or_reason',
      message: 'related_docs empty — ensure known_hold_reason explains absence when optional.',
    });
  }
  return issues;
}

function validateCapsule(caps, expectedProjectId) {
  const issues = [];
  const id = expectedProjectId || caps?.project_id || '—';
  if (!caps || typeof caps !== 'object' || caps.__error) {
    issues.push({ project_id: id, severity: 'RED', code: 'capsule_parse', message: caps?.__error || 'Invalid capsule JSON.' });
    return { issues, capsuleSignal: 'UNKNOWN' };
  }
  if (caps.schema !== 'z_project_awareness_capsule_v1') {
    issues.push({ project_id: id, severity: 'YELLOW', code: 'capsule_schema', message: 'Capsule schema not z_project_awareness_capsule_v1.' });
  }
  if (caps.project_id !== expectedProjectId) {
    issues.push({
      project_id: id,
      severity: 'RED',
      code: 'capsule_project_mismatch',
      message: `Capsule project_id ${caps.project_id} does not match registry ${expectedProjectId}.`,
    });
  }
  for (const k of CAPSULE_KEYS) {
    if (!(k in caps)) {
      issues.push({ project_id: id, severity: 'RED', code: 'capsule_field', message: `Capsule missing field: ${k}` });
    }
  }
  const sig = String(caps.current_signal || 'UNKNOWN').toUpperCase();
  if (!/^(GREEN|YELLOW|BLUE|RED|GOLD|PURPLE|UNKNOWN)$/.test(sig)) {
    issues.push({ project_id: id, severity: 'YELLOW', code: 'capsule_signal', message: `Unusual current_signal: ${sig}` });
  }
  return { issues, capsuleSignal: sig };
}

function main() {
  const generatedAt = new Date().toISOString();
  const reg = readJson(REG_PATH);
  const pol = readJson(POL_PATH);

  let issues = [];
  issues = issues.concat(validateRegistryShape(reg));

  if (pol && pol.__error) {
    issues.push({ project_id: '—', severity: 'RED', code: 'policy_parse', message: `Alert policy invalid: ${pol.__error}` });
  }

  const projectSummaries = [];
  const notificationCandidates = [];

  if (reg && Array.isArray(reg.projects)) {
    for (const p of reg.projects) {
      issues = issues.concat(validateProjectRow(p));
      const relCap = String(p.capsule_path || '').trim();
      const absCap = relCap ? path.join(ROOT, relCap) : null;
      let rowSeverity = 'GREEN';
      let capsuleSignal = 'UNKNOWN';
      let capsuleOk = false;

      if (!relCap) {
        if (p.required_for_daily_status) {
          const msg = 'Required project missing capsule_path.';
          issues.push({ project_id: p.project_id, severity: 'RED', code: 'missing_capsule_required', message: msg });
          rowSeverity = 'RED';
        } else {
          issues.push({
            project_id: p.project_id,
            severity: 'YELLOW',
            code: 'missing_capsule_optional',
            message: 'Optional project has no capsule in hub workspace (advisory).',
          });
          rowSeverity = 'YELLOW';
        }
      } else if (!fs.existsSync(absCap)) {
        const msg = p.required_for_daily_status ? 'Capsule file missing on disk.' : 'Capsule path set but file missing (optional project).';
        issues.push({
          project_id: p.project_id,
          severity: p.required_for_daily_status ? 'RED' : 'YELLOW',
          code: 'capsule_missing_file',
          message: msg,
        });
        rowSeverity = p.required_for_daily_status ? 'RED' : 'YELLOW';
      } else {
        const cap = readJson(absCap);
        const v = validateCapsule(cap, p.project_id);
        issues = issues.concat(v.issues);
        capsuleSignal = v.capsuleSignal;
        capsuleOk = !v.issues.some((i) => i.severity === 'RED');
        if (v.issues.some((i) => i.severity === 'RED')) rowSeverity = 'RED';
        else if (v.issues.some((i) => i.severity === 'BLUE')) rowSeverity = 'BLUE';
        else if (v.issues.some((i) => i.severity === 'YELLOW')) rowSeverity = maxSeverity(rowSeverity, 'YELLOW');
        else rowSeverity = maxSeverity(rowSeverity, capsuleSignal === 'YELLOW' ? 'YELLOW' : 'GREEN');
        if (cap && !cap.__error && (capsuleSignal === 'BLUE' || capsuleSignal === 'RED')) {
          rowSeverity = maxSeverity(rowSeverity, capsuleSignal);
        }
      }

      projectSummaries.push({
        project_id: p.project_id,
        display_name: p.display_name,
        row_severity: rowSeverity,
        capsule_signal: capsuleSignal,
        capsule_ok: capsuleOk,
        required_for_daily_status: p.required_for_daily_status,
        deployment_status: p.deployment_status,
        autonomy_level: p.autonomy_level,
      });

      if (rowSeverity === 'RED' || rowSeverity === 'BLUE') {
        notificationCandidates.push({
          project_id: p.project_id,
          signal: rowSeverity,
          title: rowSeverity === 'RED' ? `RED gate: ${p.display_name}` : `BLUE decision: ${p.display_name}`,
          detail: `See z_ecosystem_awareness_report.json issues[] for ${p.project_id}.`,
        });
      }
    }
  }

  let overall = 'GREEN';
  for (const iss of issues) {
    overall = maxSeverity(overall, iss.severity);
  }
  for (const s of projectSummaries) {
    if (s.row_severity === 'RED') overall = maxSeverity(overall, 'RED');
    if (s.row_severity === 'BLUE') overall = maxSeverity(overall, 'BLUE');
    if (s.row_severity === 'YELLOW') overall = maxSeverity(overall, 'YELLOW');
  }

  const dedup = [];
  const seen = new Set();
  for (const n of notificationCandidates) {
    const k = `${n.project_id}|${n.signal}|${n.title}`;
    if (seen.has(k)) continue;
    seen.add(k);
    dedup.push(n);
  }

  const payload = {
    schema: SCHEMA_REPORT,
    generated_at: generatedAt,
    overall_signal: overall,
    registry_path: path.relative(ROOT, REG_PATH),
    policy_path: path.relative(ROOT, POL_PATH),
    issues,
    projects: projectSummaries,
    notification_candidates_red_blue_only: dedup.filter((n) => n.signal === 'RED' || n.signal === 'BLUE'),
    law_note: pol && !pol.__error ? pol.law_note : '',
    note: 'YELLOW does not enqueue AMK notifications by default. Promote manually from candidates if policy changes.',
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  const md = [
    '# Z Ecosystem Awareness Report (Z-AWARE-1)',
    '',
    `- Generated: ${generatedAt}`,
    `- Overall signal: **${overall}**`,
    `- Registry: \`${payload.registry_path}\``,
    `- Policy: \`${payload.policy_path}\``,
    '',
    '## Project summary',
    '',
    ...projectSummaries.map(
      (r) =>
        `- **${r.project_id}** (${r.display_name}): row ${r.row_severity}, capsule ${r.capsule_signal}, required=${
          r.required_for_daily_status
        }`,
    ),
    '',
    '## Issues',
    '',
    ...(issues.length
      ? issues.map((i) => `- [${i.severity}] **${i.project_id}** ${i.code}: ${i.message}`)
      : ['- (none)']),
    '',
    '## AMK notification candidates (RED / BLUE only)',
    '',
    ...(payload.notification_candidates_red_blue_only.length
      ? payload.notification_candidates_red_blue_only.map((n) => `- **${n.signal}** ${n.title} — ${n.detail}`)
      : ['- (none this run — YELLOW/GREEN stay quiet per policy)']),
    '',
    payload.law_note ? `## Law\n\n${payload.law_note}\n` : '',
    '',
    payload.note,
    '',
  ];
  fs.writeFileSync(OUT_MD, md.join('\n'), 'utf8');

  console.log(
    JSON.stringify({
      ok: overall !== 'RED',
      overall_signal: overall,
      out_json: path.relative(ROOT, OUT_JSON).split(path.sep).join('/'),
      out_md: path.relative(ROOT, OUT_MD).split(path.sep).join('/'),
      notification_candidates: payload.notification_candidates_red_blue_only.length,
    }),
  );

  if (overall === 'RED') process.exit(1);
  process.exit(0);
}

main();
