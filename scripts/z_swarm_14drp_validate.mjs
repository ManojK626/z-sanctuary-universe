#!/usr/bin/env node
/**
 * Z-SWARM-14DRP-1 validator (read-only governance classifier).
 * Writes report artifacts; never executes runtime/deploy/billing/provider lanes.
 * Exit 1 only for RED.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const LAW_PATH = path.join(ROOT, 'data', 'z_swarm_14drp_agent_law_registry.json');
const ROLE_PATH = path.join(ROOT, 'data', 'z_formula_swarm_role_registry.json');
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_swarm_14drp_report.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_swarm_14drp_report.md');

const REPORT_SCHEMA = 'z_swarm_14drp_report_v1';

const REQUIRED_LAWS = [
  'Confirm real repo root before action.',
  'Never treat .cursor/projects as build root.',
  'Read evidence before recommending.',
  'Preserve project identity boundaries.',
  'Shared pattern does not mean shared entitlement.',
  'Classify RED / BLUE / YELLOW / GREEN before action.',
  'RED blocks movement.',
  'BLUE requires AMK/human.',
  'YELLOW stays quiet unless repeated/escalated.',
  'GREEN does not deploy.',
  'No secrets, billing, deploy, provider calls, bridges, child-data, voice/camera/GPS without charter.',
  'Use dry-run/check/report first.',
  'Keep rollback notes.',
  'AMK-Goku owns sacred moves.',
];

const ROLE_IDS = [
  'zuno_ai',
  'z_traffic_minibots',
  'z_troublemaker_ai',
  'z_formula_ai',
  'z_sage_warrior',
  'eagleeye_observer',
  'super_ghost',
  'vh100_security_shield',
  'mcburb_backup_awareness',
  'fbap_event_awareness',
  'z_ssws_workspace_spine',
  'z_api_spine',
  'z_aal_advisor',
  'z_susbv_overseer',
  'z_omnai_creative_advisor',
];

const FORBIDDEN_AUTHORITY_PATTERNS = [
  /\bdeploy\b/i,
  /\bbilling\b/i,
  /\bsecret/i,
  /\bprovider/i,
  /\bbridge[_\s-]*exec/i,
  /\bexecute(?:_|\s|-)?commands?\b/i,
  /\bauto(?:_|\s|-)?launch\b/i,
];

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    return { __error: error.message };
  }
}

function severityRank(signal) {
  const s = String(signal || '').toUpperCase();
  if (s === 'RED') return 4;
  if (s === 'BLUE') return 3;
  if (s === 'YELLOW') return 2;
  if (s === 'GREEN') return 1;
  return 0;
}

function worstSignal(current, next) {
  return severityRank(next) > severityRank(current) ? next : current;
}

function issue(signal, code, message, context = 'registry') {
  return { signal, code, message, context };
}

function hasAllRequiredStrings(values, required) {
  const source = new Set((Array.isArray(values) ? values : []).map((v) => String(v || '').trim()));
  return required.filter((v) => !source.has(v));
}

function anyMatch(list, patternList) {
  for (const item of list || []) {
    const text = String(item || '');
    for (const pattern of patternList) {
      if (pattern.test(text)) return true;
    }
  }
  return false;
}

function main() {
  const generatedAt = new Date().toISOString();
  const law = readJson(LAW_PATH);
  const formula = readJson(ROLE_PATH);
  const issues = [];

  if (law.__error) {
    issues.push(issue('RED', 'law_parse', `Could not parse ${path.basename(LAW_PATH)}: ${law.__error}`));
  }
  if (formula.__error) {
    issues.push(issue('RED', 'role_parse', `Could not parse ${path.basename(ROLE_PATH)}: ${formula.__error}`));
  }
  if (issues.some((i) => i.signal === 'RED')) {
    writeAndExit(generatedAt, law, formula, issues);
    return;
  }

  if (law.schema !== 'z_swarm_14drp_agent_law_registry_v1') {
    issues.push(issue('YELLOW', 'law_schema', 'Unexpected law registry schema.'));
  }
  if (formula.schema !== 'z_formula_swarm_role_registry_v1') {
    issues.push(issue('YELLOW', 'formula_schema', 'Unexpected formula role registry schema.'));
  }
  if (law.mode !== 'read_only_governance') {
    issues.push(issue('RED', 'law_mode', 'Law registry mode must be read_only_governance.'));
  }
  if (formula.mode !== 'symbolic_formula_and_read_only_classifier') {
    issues.push(issue('RED', 'formula_mode', 'Formula mode must be symbolic_formula_and_read_only_classifier.'));
  }

  const missingLaws = hasAllRequiredStrings(law.fourteen_drp_laws, REQUIRED_LAWS);
  if (missingLaws.length > 0) {
    issues.push(issue('RED', 'missing_drp_laws', `Missing DRP laws: ${missingLaws.join(' | ')}`));
  }

  const roleRows = Array.isArray(formula.role_registry) ? formula.role_registry : [];
  if (!Array.isArray(formula.role_registry)) {
    issues.push(issue('RED', 'role_registry_type', 'role_registry must be an array.'));
  }

  const roleIndex = new Map(roleRows.map((row) => [String(row.role_id || ''), row]));
  const missingRoles = ROLE_IDS.filter((id) => !roleIndex.has(id));
  if (missingRoles.length > 0) {
    issues.push(issue('YELLOW', 'missing_role_refs', `Missing optional role references: ${missingRoles.join(', ')}`));
  }

  for (const role of roleRows) {
    const roleId = String(role.role_id || '').trim() || 'unknown_role';
    const ctx = `role:${roleId}`;
    const requiredFields = [
      'role_id',
      'purpose',
      'reads_from',
      'allowed_actions',
      'forbidden_actions',
      'autonomy_level',
      'output_type',
      'escalation_rule',
    ];
    for (const field of requiredFields) {
      if (!(field in role)) {
        issues.push(issue('RED', 'role_field_missing', `Missing ${field}`, ctx));
      }
    }
    if (!Array.isArray(role.allowed_actions) || role.allowed_actions.length === 0) {
      issues.push(issue('RED', 'role_allowed_actions', 'allowed_actions must be a non-empty array.', ctx));
    }
    if (!Array.isArray(role.forbidden_actions) || role.forbidden_actions.length === 0) {
      issues.push(issue('RED', 'role_forbidden_actions', 'forbidden_actions must be a non-empty array.', ctx));
    }
    if (!String(role.autonomy_level || '').trim()) {
      issues.push(issue('RED', 'role_autonomy_level', 'autonomy_level is required.', ctx));
    }

    if (anyMatch(role.allowed_actions, FORBIDDEN_AUTHORITY_PATTERNS)) {
      issues.push(issue('RED', 'forbidden_authority_claim', 'allowed_actions claims forbidden authority.', ctx));
    }
  }

  const formulaText = JSON.stringify({
    formula_name: formula.formula_name,
    mode: formula.mode,
    forbidden_claims: formula.forbidden_claims,
    tree_map: formula.tree_map,
  });
  if (/physics|magic/i.test(formulaText) && !/symbolic/i.test(formulaText)) {
    issues.push(issue('RED', 'formula_claim_scope', 'Formula language implies literal magic/physics authority.'));
  }

  const gates = Array.isArray(formula.future_gates) ? formula.future_gates : [];
  if (!Array.isArray(formula.future_gates) || gates.length === 0) {
    issues.push(issue('YELLOW', 'future_gates_missing', 'future_gates should list future-gated capabilities.'));
  } else {
    for (const gate of gates) {
      if (String(gate.status || '') !== 'future_gated') {
        issues.push(issue('RED', 'future_gate_status', `Gate ${gate.gate_id || '(unknown)'} must be future_gated.`));
      }
    }
  }

  writeAndExit(generatedAt, law, formula, issues);
}

function writeAndExit(generatedAt, law, formula, issues) {
  let overall = 'GREEN';
  for (const it of issues) overall = worstSignal(overall, it.signal);

  const bySignal = {
    RED: issues.filter((i) => i.signal === 'RED').length,
    BLUE: issues.filter((i) => i.signal === 'BLUE').length,
    YELLOW: issues.filter((i) => i.signal === 'YELLOW').length,
    GREEN: issues.filter((i) => i.signal === 'GREEN').length,
  };

  const payload = {
    schema: REPORT_SCHEMA,
    generated_at: generatedAt,
    overall_signal: overall,
    law_registry_path: path.relative(ROOT, LAW_PATH).split(path.sep).join('/'),
    role_registry_path: path.relative(ROOT, ROLE_PATH).split(path.sep).join('/'),
    summary: {
      fourteen_drp_count: Array.isArray(law.fourteen_drp_laws) ? law.fourteen_drp_laws.length : 0,
      role_count: Array.isArray(formula.role_registry) ? formula.role_registry.length : 0,
      signal_counts: bySignal,
    },
    amk_gated_future_lanes: Array.isArray(formula.future_gates)
      ? formula.future_gates.map((g) => ({
          gate_id: g.gate_id,
          status: g.status,
          requires: g.requires || [],
        }))
      : [],
    rollback_note:
      'Revert added Z-SWARM-14DRP-1 docs/registries/script/package indicator rows and rerun verify:md, z:traffic, z:car2.',
    issues,
    locked_law: [
      'Swarm law != swarm execution.',
      'Z-Formula != magic authority.',
      'Mini-bot suggestion != permission.',
      'Quantum label != physics claim.',
      'GREEN != deploy.',
      'BLUE requires AMK.',
      'RED blocks movement.',
      'AMK-Goku owns sacred moves.',
    ],
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  const lines = [
    '# Z-SWARM-14DRP-1 validation report',
    '',
    `- Generated: ${generatedAt}`,
    `- Overall signal: **${overall}**`,
    `- Law registry: \`${payload.law_registry_path}\``,
    `- Role registry: \`${payload.role_registry_path}\``,
    '',
    '## Summary',
    '',
    `- 14 DRP entries: ${payload.summary.fourteen_drp_count}`,
    `- Role rows: ${payload.summary.role_count}`,
    `- RED: ${bySignal.RED}, BLUE: ${bySignal.BLUE}, YELLOW: ${bySignal.YELLOW}`,
    '',
    '## AMK-gated future lanes',
    '',
    ...(payload.amk_gated_future_lanes.length
      ? payload.amk_gated_future_lanes.map((g) => `- **${g.gate_id}** (${g.status}) — requires: ${g.requires.join(', ')}`)
      : ['- (none)']),
    '',
    '## Issues',
    '',
    ...(issues.length ? issues.map((i) => `- [${i.signal}] **${i.code}** (${i.context}): ${i.message}`) : ['- (none)']),
    '',
    '## Locked law',
    '',
    ...payload.locked_law.map((x) => `- ${x}`),
    '',
    `Rollback: ${payload.rollback_note}`,
    '',
  ];
  fs.writeFileSync(OUT_MD, lines.join('\n'), 'utf8');

  console.log(JSON.stringify({ ok: true, overall_signal: overall, out_json: OUT_JSON, out_md: OUT_MD }, null, 2));
  process.exit(overall === 'RED' ? 1 : 0);
}

main();
