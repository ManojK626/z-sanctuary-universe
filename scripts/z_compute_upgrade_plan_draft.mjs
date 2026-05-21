#!/usr/bin/env node
/**
 * ZCO-6 — Read-only AI-assisted upgrade plan draft (advisory only).
 * Reads intake validation report + declared inventory JSON referenced therein.
 * Writes only data/reports/z_compute_upgrade_plan_draft.{json,md}.
 * Does not: scan hardware, shell, network, purchase links, prices, install, or orchestrate.
 * Exit code: 0 unless overall_signal is RED (then 1).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = process.cwd();

const DEFAULT_VALIDATION = path.join(ROOT, 'data', 'reports', 'z_compute_intake_validation.json');
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_compute_upgrade_plan_draft.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_compute_upgrade_plan_draft.md');
const SCHEMA = 'z_compute_upgrade_plan_draft_v1';

const PRICE_OR_URL_RE =
  /\$\s*\d|USD|EUR|GBP|amazon\.|ebay\.|newegg\.|bestbuy\.|aliexpress|http:\/\/|https:\/\//i;

function resolveValidationPath() {
  const env = process.env.ZCO_INTAKE_VALIDATION_PATH;
  if (env && String(env).trim()) {
    return path.isAbsolute(env) ? env : path.resolve(ROOT, env);
  }
  return DEFAULT_VALIDATION;
}

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function rel(p) {
  return path.relative(ROOT, p).replace(/\\/g, '/');
}

function safeTier(node) {
  const t = node?.constraints?.budget_tier;
  if (t && typeof t === 'string') return t;
  return 'undeclared';
}

function hasSparsePlanning(node) {
  const goals = node?.upgrade_goals;
  if (!Array.isArray(goals) || goals.length === 0) return false;
  const c = node?.constraints;
  const hasConstraints = c && typeof c === 'object' && Object.keys(c).length > 0;
  const hasReceipts = Boolean(node?.receipts_note && String(node.receipts_note).trim());
  return !hasConstraints && !hasReceipts;
}

function assertAdvisoryText(text) {
  if (PRICE_OR_URL_RE.test(String(text || ''))) {
    throw new Error(`Draft generator refused price/URL pattern in advisory text: ${text}`);
  }
}

function nextOrder(counter) {
  counter.n += 1;
  return counter.n;
}

function buildAssessPhase(node, counter) {
  const psu = node?.power?.psu_w_declared;
  const gpuW = Array.isArray(node.gpu)
    ? node.gpu.reduce((m, g) => Math.max(m, Number(g?.power_w_declared) || 0), 0)
    : 0;
  const item = `Review declared PSU (${psu ?? 'unknown'} W) vs GPU+CPU load on ${node.node_id}; confirm cooling notes before any acquire phase`;
  assertAdvisoryText(item);
  return {
    phase: 'assess',
    order: nextOrder(counter),
    node_id: node.node_id,
    item,
    estimated_cost_tier: 'minimal',
    amk_gate: false,
    signal: node?.power?.power_chain_safe_declared === false ? 'BLUE' : 'GREEN',
    minibot: 'PowerBot',
    advisory_only: true,
  };
}

function buildNasPrepare(node, counter) {
  const item = `Verify NAS mount and backup path for ${node.node_id} before routing workloads (NAS_WAIT — human only)`;
  assertAdvisoryText(item);
  return {
    phase: 'prepare',
    order: nextOrder(counter),
    node_id: node.node_id,
    item,
    estimated_cost_tier: 'minimal',
    amk_gate: true,
    signal: 'BLUE',
    minibot: 'StorageBot',
    advisory_only: true,
  };
}

function buildAcquirePhases(node, counter) {
  const goals = Array.isArray(node.upgrade_goals) ? node.upgrade_goals : [];
  const phases = [];
  for (const goal of goals) {
    const item = `Declared goal (advisory): ${String(goal).trim()} — AMK gate before acquire/install`;
    assertAdvisoryText(item);
    phases.push({
      phase: 'acquire',
      order: nextOrder(counter),
      node_id: node.node_id,
      item,
      estimated_cost_tier: safeTier(node),
      amk_gate: true,
      signal: 'BLUE',
      minibot: 'UpgradeBot',
      advisory_only: true,
    });
  }
  return phases;
}

function buildInstallPhase(node, counter, hadAcquire) {
  if (!hadAcquire) return null;
  const item = `Physical install for ${node.node_id} changes — human only; no hub auto-install`;
  assertAdvisoryText(item);
  return {
    phase: 'install',
    order: nextOrder(counter),
    node_id: node.node_id,
    item,
    estimated_cost_tier: 'minimal',
    amk_gate: true,
    signal: 'BLUE',
    minibot: 'ThermalBot',
    advisory_only: true,
  };
}

function buildValidatePhase(node, counter) {
  const item = `Update local inventory JSON for ${node.node_id}; re-run npm run z:compute:intake and z:compute:upgrade-draft`;
  assertAdvisoryText(item);
  return {
    phase: 'validate',
    order: nextOrder(counter),
    node_id: node.node_id,
    item,
    estimated_cost_tier: 'minimal',
    amk_gate: false,
    signal: 'GREEN',
    minibot: 'ExplainBot',
    advisory_only: true,
  };
}

function buildNodeAdvisory(node) {
  const counter = { n: 0 };
  const phases = [];
  const limitations = [];

  if (node.status === 'recycle_candidate' || node.role === 'recycle_dormant') {
    limitations.push(
      'Recycle/dormant node — revival requires separate AMK BLUE path before power-on'
    );
  }
  if (hasSparsePlanning(node)) {
    limitations.push(
      `${node.node_id}: sparse upgrade_goals — add constraints or receipts_note for fuller draft`
    );
  }

  phases.push(buildAssessPhase(node, counter));

  if (node.nas_wait === true || node.role === 'storage_nas') {
    phases.push(buildNasPrepare(node, counter));
  }

  const acquirePhases = buildAcquirePhases(node, counter);
  const hadAcquire = acquirePhases.length > 0;
  phases.push(...acquirePhases);

  const install = buildInstallPhase(node, counter, hadAcquire);
  if (install) phases.push(install);

  if (hadAcquire || node.nas_wait || node.status === 'active') {
    phases.push(buildValidatePhase(node, counter));
  }

  return {
    node_id: node.node_id,
    label: node.label || node.node_id,
    role: node.role,
    status: node.status,
    trust_status: node.trust_status,
    limitations,
    phases,
  };
}

function buildRecycleOpportunities(nodes) {
  return nodes
    .filter((n) => n.status === 'recycle_candidate' || n.role === 'recycle_dormant')
    .map((n) => ({
      node_id: n.node_id,
      summary: `Advisory: document reuse intent for ${n.node_id}; PSU/thermal audit before revival`,
      signal: 'BLUE',
      amk_gate: true,
      minibot: 'RecycleBot',
      advisory_only: true,
    }));
}

function rollupDraftSignal({ intakeSignal, inventoryReadOk, blocked }) {
  if (blocked || !inventoryReadOk || intakeSignal === 'RED') return 'RED';
  if (intakeSignal === 'YELLOW') return 'YELLOW';
  return 'GREEN';
}

function main() {
  const validationPath = resolveValidationPath();
  const generated_at = new Date().toISOString();
  const warnings = [];

  let validation = null;
  let validationReadOk = false;
  let validationError = null;

  try {
    if (!fs.existsSync(validationPath)) {
      validationError = `Intake validation report not found: ${rel(validationPath)} — run npm run z:compute:intake first`;
    } else {
      validation = readJson(validationPath);
      validationReadOk = true;
    }
  } catch (e) {
    validationError = String(e?.message || e);
  }

  const intakeSignal = validationReadOk
    ? String(validation.overall_signal || 'UNKNOWN').toUpperCase()
    : 'RED';

  const blocked = intakeSignal === 'RED' || !validationReadOk;

  let inventory = null;
  let inventoryReadOk = false;
  let inventoryPath = null;
  let inventoryError = null;

  if (!blocked && validationReadOk) {
    const invRel = validation.inventory_path;
    const invResolved = validation.inventory_path_resolved;
    inventoryPath = invResolved ? invResolved : invRel ? path.resolve(ROOT, invRel) : null;

    const envInv = process.env.ZCO_INVENTORY_PATH;
    if (envInv && String(envInv).trim()) {
      inventoryPath = path.isAbsolute(envInv) ? envInv : path.resolve(ROOT, envInv);
    }

    try {
      if (!inventoryPath || !fs.existsSync(inventoryPath)) {
        inventoryError = `Inventory not found: ${inventoryPath || '(unset)'}`;
      } else {
        inventory = readJson(inventoryPath);
        inventoryReadOk = true;
      }
    } catch (e) {
      inventoryError = String(e?.message || e);
    }
  }

  const nodes = inventoryReadOk && Array.isArray(inventory?.inventory) ? inventory.inventory : [];
  const node_advisories = inventoryReadOk ? nodes.map(buildNodeAdvisory) : [];
  const recycle_opportunities = inventoryReadOk ? buildRecycleOpportunities(nodes) : [];

  const phase_count = node_advisories.reduce((n, a) => n + a.phases.length, 0);

  const overall_signal = rollupDraftSignal({
    intakeSignal,
    inventoryReadOk: inventoryReadOk && !inventoryError,
    blocked,
  });

  const report = {
    schema: SCHEMA,
    phase: 'ZCO-6',
    generated_at,
    law: 'Advisory upgrade-plan draft only. No purchase links, prices, scan, shell, network, or install authority.',
    mode: 'Turtle / Advice-only',
    posture: {
      runtime_orchestration: 'CLOSED',
      hardware_control: 'DISABLED',
      telemetry_collection: 'DISABLED',
      purchase_links: 'DISABLED',
      price_quotes: 'DISABLED',
      install_authority: 'AMK_HUMAN_ONLY',
    },
    intake_validation: {
      path: rel(validationPath),
      read_ok: validationReadOk,
      overall_signal: validationReadOk ? intakeSignal : 'RED',
      inventory_path: validationReadOk ? validation.inventory_path : null,
      findings_count: validationReadOk ? (validation.findings?.length ?? 0) : 0,
    },
    inventory_path: inventoryPath ? rel(inventoryPath) : null,
    inventory_read_ok: inventoryReadOk,
    blocked,
    blocked_reason: blocked
      ? validationError ||
        inventoryError ||
        (intakeSignal === 'RED'
          ? 'Intake validator RED — fix inventory before drafting upgrades'
          : 'Draft blocked')
      : null,
    advisory_disclaimer:
      'This draft is educational governance output only. AMK-Goku approves acquire, wiring, power-on, and install. GREEN ≠ permission to buy or deploy.',
    limitations:
      overall_signal === 'YELLOW'
        ? [
            'Intake validation YELLOW — suggestions may be incomplete until operator clarifies sparse fields.',
            ...(validationReadOk && validation.findings?.length
              ? validation.findings.map((f) => `${f.severity} ${f.code}: ${f.message}`)
              : []),
          ]
        : [],
    node_advisories,
    recycle_opportunities,
    phase_count,
    overall_signal,
    smallest_safe_next_action:
      overall_signal === 'RED'
        ? 'Run npm run z:compute:intake on a clean inventory; resolve RED findings before upgrade draft.'
        : overall_signal === 'YELLOW'
          ? 'Clarify YELLOW intake findings; treat acquire phases as AMK-gated hypotheses only.'
          : 'Review phased draft with AMK; no acquire/install without explicit human gate.',
    warnings,
    related_docs: [
      'docs/compute-organism/ZCO_6_AI_ASSISTED_UPGRADE_PLAN_DRAFT.md',
      'docs/compute-organism/ZCO_4_UPGRADE_PLANNING_GUIDE.md',
      'docs/compute-organism/ZCO_5_LOCAL_INTAKE_VALIDATOR.md',
    ],
    related_commands: ['npm run z:compute:intake', 'npm run z:compute:upgrade-draft'],
  };

  if (!validationReadOk) {
    report.blocked = true;
    report.blocked_reason = validationError;
  }
  if (!blocked && !inventoryReadOk) {
    report.overall_signal = 'RED';
    report.blocked = true;
    report.blocked_reason = inventoryError;
  }

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2), 'utf8');

  const md = [
    '# Z-Compute upgrade plan draft (ZCO-6)',
    '',
    '```text',
    'ZCO UPGRADE PLAN DRAFT (ADVISORY)',
    '---------------------------------',
    `Mode: ${report.mode}`,
    `Runtime orchestration: ${report.posture.runtime_orchestration}`,
    `Hardware control: ${report.posture.hardware_control}`,
    `Purchase links: ${report.posture.purchase_links}`,
    `Price quotes: ${report.posture.price_quotes}`,
    `Install authority: ${report.posture.install_authority}`,
    `Intake signal: ${report.intake_validation.overall_signal}`,
    `Draft signal: ${report.overall_signal}`,
    `Blocked: ${report.blocked}`,
    `Phases drafted: ${report.phase_count}`,
    '```',
    '',
    `**Generated:** ${generated_at}`,
    '',
    report.law,
    '',
    report.advisory_disclaimer,
    '',
    report.blocked
      ? `**Blocked:** ${report.blocked_reason}`
      : report.limitations.length
        ? '## Limitations\n\n' + report.limitations.map((l) => `- ${l}`).join('\n')
        : '',
    '',
    report.blocked
      ? ''
      : [
          '## Node advisories',
          '',
          ...node_advisories.flatMap((na) => [
            `### ${na.node_id} (${na.role || 'unknown'})`,
            '',
            ...(na.limitations.length ? na.limitations.map((l) => `- _Note:_ ${l}`) : ['']),
            '',
            ...na.phases.map(
              (p) =>
                `- **${p.phase}** [#${p.order}] ${p.item} — signal **${p.signal}**, AMK gate: **${p.amk_gate}**, ${p.minibot}`
            ),
            '',
          ]),
          report.recycle_opportunities.length
            ? [
                '## Recycle opportunities',
                '',
                ...report.recycle_opportunities.map(
                  (r) => `- **${r.node_id}** — ${r.summary} (${r.signal}, AMK gate)`
                ),
                '',
              ].join('\n')
            : '',
        ].join('\n'),
    `**Smallest safe next action:** ${report.smallest_safe_next_action}`,
    '',
    'Full JSON: `data/reports/z_compute_upgrade_plan_draft.json`',
    '',
  ].join('\n');

  fs.writeFileSync(OUT_MD, md, 'utf8');

  const finalSignal = report.overall_signal;
  const out = {
    ok: finalSignal !== 'RED',
    overall_signal: finalSignal,
    blocked: report.blocked,
    intake_signal: report.intake_validation.overall_signal,
    phase_count: report.phase_count,
    out_json: OUT_JSON,
    out_md: OUT_MD,
  };

  console.log(JSON.stringify(out, null, 2));
  process.exit(finalSignal === 'RED' ? 1 : 0);
}

main();
