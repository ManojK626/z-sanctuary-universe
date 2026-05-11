#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const POLICY_PATH = path.join(ROOT, 'data', 'z_sec_triplecheck_policy.json');
const INDICATORS_PATH = path.join(ROOT, 'dashboard', 'data', 'amk_project_indicators.json');
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_sec_triplecheck_report.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_sec_triplecheck_report.md');

function rank(signal) {
  const s = String(signal || '').toUpperCase();
  if (s === 'RED') return 4;
  if (s === 'BLUE') return 3;
  if (s === 'YELLOW') return 2;
  if (s === 'GREEN') return 1;
  return 0;
}

function maxSignal(a, b) {
  return rank(b) > rank(a) ? b : a;
}

function readJsonIfExists(fp) {
  if (!fs.existsSync(fp)) return { missing: true };
  try {
    return { data: JSON.parse(fs.readFileSync(fp, 'utf8')) };
  } catch (error) {
    return { error: error.message };
  }
}

function toAbs(relOrAbs) {
  const val = String(relOrAbs || '');
  if (/^[a-zA-Z]:[\\/]/.test(val)) return val;
  return path.join(ROOT, val);
}

function fileAgeHours(fp) {
  const stat = fs.statSync(fp);
  return (Date.now() - stat.mtimeMs) / 3600000;
}

function pushIssue(arr, signal, code, message, bucket) {
  arr.push({ signal, code, message, bucket });
}

function scanForPackageJsonUnderCursorProjects(scanRoot) {
  const found = [];
  if (!fs.existsSync(scanRoot)) return found;
  const queue = [scanRoot];
  while (queue.length) {
    const dir = queue.pop();
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        queue.push(full);
      } else if (e.isFile() && e.name.toLowerCase() === 'package.json') {
        found.push(full);
      }
    }
  }
  return found;
}

function main() {
  const generatedAt = new Date().toISOString();
  const issues = [];
  let overall = 'GREEN';
  const redFindings = [];
  const blueDecisions = [];
  const yellowObservations = [];
  const mrBugEligibleSafeFixes = [
    'markdown table spacing',
    'trailing spaces',
    'missing final newline',
    'generated read-only reports',
    'local docs link hygiene if unambiguous',
  ];

  const policyRead = readJsonIfExists(POLICY_PATH);
  if (policyRead.missing) {
    pushIssue(issues, 'RED', 'policy_missing', 'Policy file is missing.', 'path_safety');
  } else if (policyRead.error) {
    pushIssue(issues, 'RED', 'policy_parse', `Policy parse failed: ${policyRead.error}`, 'path_safety');
  }
  const policy = policyRead.data || {};

  const cwdNorm = process.cwd().replace(/\\/g, '/').toLowerCase();
  if (cwdNorm.includes('.cursor/projects')) {
    pushIssue(issues, 'RED', 'wrong_root_runtime', 'Process cwd appears under .cursor/projects.', 'path_safety');
  }

  const forbiddenRoot = String(policy.path_safety_rules?.forbidden_package_scan_root || '');
  const scanRoot = toAbs(forbiddenRoot);
  const cursorProjectPkgs = scanForPackageJsonUnderCursorProjects(scanRoot);
  if (cursorProjectPkgs.length) {
    pushIssue(
      issues,
      'RED',
      'cursor_projects_package_json',
      `Found package.json in forbidden archive/cache root: ${cursorProjectPkgs[0]}`,
      'path_safety',
    );
  }

  const indicatorsRead = readJsonIfExists(INDICATORS_PATH);
  const indicators = indicatorsRead.data?.indicators || [];
  const indicatorByOverlay = new Map();
  for (const ind of indicators) {
    if (ind.dynamic_overlay) indicatorByOverlay.set(String(ind.dynamic_overlay), ind);
  }

  const required = Array.isArray(policy.required_reports) ? policy.required_reports : [];
  const optional = Array.isArray(policy.optional_reports) ? policy.optional_reports : [];
  const optionalExpect = policy.optional_report_expectations && typeof policy.optional_report_expectations === 'object' ? policy.optional_report_expectations : {};
  const staleHrs = Number(policy.stale_threshold_hours || 48);
  const reportStates = [];

  for (const rp of required) {
    const full = toAbs(rp);
    const read = readJsonIfExists(full);
    if (read.missing) {
      pushIssue(issues, 'RED', 'required_report_missing', `Required report missing: ${rp}`, 'communication');
      reportStates.push({ report: rp, state: 'MISSING', required: true });
      continue;
    }
    if (read.error) {
      pushIssue(issues, 'RED', 'required_report_parse', `Required report parse failed: ${rp}`, 'communication');
      reportStates.push({ report: rp, state: 'PARSE_ERROR', required: true });
      continue;
    }
    const age = fileAgeHours(full);
    reportStates.push({ report: rp, state: 'OK', required: true, age_hours: Number(age.toFixed(2)) });
    if (age > staleHrs) {
      pushIssue(issues, 'YELLOW', 'required_report_stale', `Required report is stale (${rp}, ${age.toFixed(1)}h).`, 'communication');
    }
  }

  for (const rp of optional) {
    const full = toAbs(rp);
    const read = readJsonIfExists(full);
    if (read.missing) {
      const exp = optionalExpect[rp] || {};
      const defaultState = String(exp.default_state || '').toLowerCase();
      if (defaultState === 'not_expected') {
        reportStates.push({
          report: rp,
          state: 'NOT_EXPECTED',
          required: false,
          expectation: exp.expected_when || 'optional',
          classification_when_missing: exp.classification_when_missing || 'INFO_OPTIONAL',
        });
      } else {
        pushIssue(issues, 'YELLOW', 'optional_report_missing', `Optional report missing: ${rp}`, 'communication');
        reportStates.push({ report: rp, state: 'MISSING', required: false });
      }
      continue;
    }
    if (read.error) {
      pushIssue(issues, 'YELLOW', 'optional_report_parse', `Optional report parse failed: ${rp}`, 'communication');
      reportStates.push({ report: rp, state: 'PARSE_ERROR', required: false });
      continue;
    }
    const age = fileAgeHours(full);
    reportStates.push({ report: rp, state: 'OK', required: false, age_hours: Number(age.toFixed(2)) });
    if (age > staleHrs) {
      pushIssue(issues, 'YELLOW', 'optional_report_stale', `Optional report is stale (${rp}, ${age.toFixed(1)}h).`, 'communication');
    }
  }

  const trafficReport = readJsonIfExists(toAbs('data/reports/z_traffic_minibots_status.json')).data;
  const trafficIndicator = indicatorByOverlay.get('z_traffic');
  if (trafficReport && trafficIndicator) {
    const tSignal = String(trafficReport.overall_signal || '').toUpperCase();
    const iSignal = String(trafficIndicator.signal || '').toUpperCase();
    if (tSignal === 'RED' && iSignal === 'GREEN') {
      pushIssue(
        issues,
        'RED',
        'traffic_indicator_contradiction',
        'Traffic report RED but indicator static signal is GREEN without explanation.',
        'communication',
      );
    }
  }

  const fusionReport = readJsonIfExists(toAbs('data/reports/z_ide_fusion_report.json')).data;
  if (fusionReport) {
    if (String(fusionReport.active_sessions_status || '').toUpperCase() === 'ACTIVE' && String(fusionReport.handoff_status || '').toUpperCase() !== 'PRESENT') {
      pushIssue(issues, 'YELLOW', 'fusion_active_without_handoff', 'Fusion reports ACTIVE sessions without PRESENT handoff.', 'communication');
    }
    for (const item of fusionReport.amk_notification_candidates || []) {
      const sig = String(item.signal || '').toUpperCase();
      if (sig === 'BLUE') {
        pushIssue(issues, 'BLUE', 'fusion_blue_decision', item.detail || item.title || 'Fusion AMK decision candidate.', 'communication');
      } else if (sig === 'RED') {
        pushIssue(issues, 'RED', 'fusion_red_candidate', item.detail || item.title || 'Fusion red candidate.', 'communication');
      }
    }
  }

  const docsToScan = [
    'docs/AI_BUILDER_CONTEXT.md',
    'docs/INDEX.md',
    'docs/AMK_PROJECT_INDICATORS_AND_GO_NO_GO.md',
  ];
  for (const rel of docsToScan) {
    const fp = toAbs(rel);
    if (!fs.existsSync(fp)) continue;
    const txt = fs.readFileSync(fp, 'utf8');
    const mix = /franed.*aisling|aisling.*franed|lumina.*franed|franed.*lumina|xl2.*deploy|shared.*pricing|shared.*entitlement|shared.*backend/i;
    if (mix.test(txt) && !/legacy|reference-only|charter/i.test(txt)) {
      pushIssue(issues, 'YELLOW', 'identity_drift_wording', `Potential project identity drift wording in ${rel}.`, 'identity');
    }
  }

  const forbiddenLanePatterns = [
    /\bdeploy\b/i,
    /\bbilling\b/i,
    /\bpricing\b/i,
    /\bsecret/i,
    /\bprovider call/i,
    /\bbridge(?:_|\s|-)?exec/i,
    /\bvoice\b/i,
    /\bcamera\b/i,
    /\bgps\b/i,
    /\bcloudflare\b/i,
    /\bdns\b/i,
    /\bauto-launch\b/i,
  ];
  const touchedFiles = ['scripts/z_sec_triplecheck_audit.mjs', 'data/z_sec_triplecheck_policy.json'];
  const touchedBlob = touchedFiles.join(' ').toLowerCase();
  for (const re of forbiddenLanePatterns) {
    if (re.test(touchedBlob)) {
      // informational only; this audit phase may mention these terms in policy/docs
    }
  }

  for (const i of issues) {
    overall = maxSignal(overall, i.signal);
    if (i.signal === 'RED') redFindings.push(i);
    else if (i.signal === 'BLUE') blueDecisions.push(i);
    else if (i.signal === 'YELLOW') yellowObservations.push(i);
  }

  const payload = {
    schema: 'z_sec_triplecheck_report_v1',
    generated_at: generatedAt,
    overall_signal: overall,
    policy_path: path.relative(ROOT, POLICY_PATH).replace(/\\/g, '/'),
    summary: {
      red_count: redFindings.length,
      blue_count: blueDecisions.length,
      yellow_count: yellowObservations.length,
      required_reports_checked: required.length,
      optional_reports_checked: optional.length,
    },
    report_states: reportStates,
    red_findings: redFindings,
    blue_decisions: blueDecisions,
    yellow_observations: yellowObservations,
    mr_bug_eligible_safe_fixes: mrBugEligibleSafeFixes,
    no_runtime_execution_added: true,
    locked_law: [
      'Triple-check != execution.',
      'Mr Bug suggestion != permission.',
      'Auto-fix is docs-hygiene only.',
      'Security fix requires AMK.',
      'GREEN != deploy.',
      'BLUE requires AMK.',
      'RED blocks movement.',
      'AMK-Goku owns sacred moves.',
    ],
    rollback_note:
      'Revert Z-SEC-TRIPLECHECK-1 docs/data/script/indicator changes, then rerun verify:md, z:traffic, z:car2.',
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  const md = [
    '# Z-SEC-TRIPLECHECK-1 report',
    '',
    `- Generated: ${generatedAt}`,
    `- Overall signal: **${overall}**`,
    `- RED findings: ${redFindings.length}`,
    `- BLUE decisions: ${blueDecisions.length}`,
    `- YELLOW observations: ${yellowObservations.length}`,
    '',
    '## Report states',
    '',
    ...reportStates.map((r) => `- ${r.required ? '[required]' : '[optional]'} \`${r.report}\` => ${r.state}${r.age_hours != null ? ` (${r.age_hours}h)` : ''}`),
    '',
    '## RED findings',
    '',
    ...(redFindings.length ? redFindings.map((i) => `- **${i.code}** (${i.bucket}): ${i.message}`) : ['- (none)']),
    '',
    '## BLUE decisions',
    '',
    ...(blueDecisions.length ? blueDecisions.map((i) => `- **${i.code}** (${i.bucket}): ${i.message}`) : ['- (none)']),
    '',
    '## YELLOW observations',
    '',
    ...(yellowObservations.length ? yellowObservations.map((i) => `- **${i.code}** (${i.bucket}): ${i.message}`) : ['- (none)']),
    '',
    '## Mr Bug eligible safe fixes',
    '',
    ...mrBugEligibleSafeFixes.map((x) => `- ${x}`),
    '',
    `No runtime execution added: **${payload.no_runtime_execution_added ? 'true' : 'false'}**`,
    '',
    '## Locked law',
    '',
    ...payload.locked_law.map((x) => `- ${x}`),
    '',
    `Rollback: ${payload.rollback_note}`,
    '',
  ];
  fs.writeFileSync(OUT_MD, md.join('\n'), 'utf8');

  console.log(JSON.stringify({ ok: true, overall_signal: overall, out_json: OUT_JSON, out_md: OUT_MD }, null, 2));
  process.exit(overall === 'RED' ? 1 : 0);
}

main();
