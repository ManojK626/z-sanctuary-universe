#!/usr/bin/env node
/**
 * ZCO-2 — Read-only Compute Organism status (infrastructure awareness spine).
 * Reads doctrine docs, example JSON, package.json scripts list, and prior traffic report only.
 * Writes only data/reports/z_compute_organism_status.{json,md}.
 * Does not: orchestrate, control hardware, scan networks, deploy, merge, install, or execute devices.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = process.cwd();

const DOCS = {
  architecture: path.join(ROOT, 'docs', 'compute-organism', 'Z_COMPUTE_ORGANISM_ARCHITECTURE.md'),
  builder: path.join(ROOT, 'docs', 'compute-organism', 'Z_SSWS_AI_TOWER_BUILDER_INSTRUCTIONS.md'),
  arelium: path.join(ROOT, 'docs', 'compute-organism', 'Z_ARELIUM_SHIELD_INFRASTRUCTURE_ROLE.md'),
  omniswarm: path.join(ROOT, 'docs', 'compute-organism', 'Z_OMNISWARM_CLUSTER_MINIBOTS.md'),
  formulas: path.join(ROOT, 'docs', 'compute-organism', 'Z_FORMULA_INFRASTRUCTURE_ENGINE.md'),
  receipt_zco1: path.join(ROOT, 'docs', 'compute-organism', 'PHASE_ZCO_1_GREEN_RECEIPT.md'),
};

const EX_NODE = path.join(ROOT, 'data', 'examples', 'z_compute_node_registry.example.json');
const EX_SWARM = path.join(ROOT, 'data', 'examples', 'z_compute_swarm_roles.example.json');
const PKG = path.join(ROOT, 'package.json');
const R_TRAFFIC = path.join(ROOT, 'data', 'reports', 'z_traffic_minibots_status.json');
const SCRIPTS_DIR = path.join(ROOT, 'scripts');

const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_compute_organism_status.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_compute_organism_status.md');
const SCHEMA = 'z_compute_organism_status_v1';

const FORBIDDEN_SCRIPT_PATTERNS = [
  /overclock/i,
  /hardware.?control/i,
  /fan_pwm/i,
  /bios_flash/i,
  /k8s.?apply/i,
  /orchestrat(e|ion).*(run|exec)/i,
  /lan.?scan/i,
  /port.?scan/i,
];

const FORBIDDEN_PKG_SCRIPT_NAMES = [
  'z:compute:orchestrate',
  'z:compute:deploy',
  'z:compute:hardware',
  'z:compute:control',
];

function readJsonSafe(p) {
  try {
    return { ok: true, data: JSON.parse(fs.readFileSync(p, 'utf8')), path: p };
  } catch (e) {
    return { ok: false, error: String(e?.message || e), path: p };
  }
}

function fileOk(p) {
  try {
    return fs.existsSync(p) && fs.statSync(p).size > 0;
  } catch {
    return false;
  }
}

function validateNodeExample(data) {
  const issues = [];
  if (!data || typeof data !== 'object') {
    issues.push('root not object');
    return { ok: false, issues };
  }
  if (!String(data.schema || '').includes('compute_node')) issues.push('schema mismatch');
  if (!Array.isArray(data.nodes) || data.nodes.length < 1) issues.push('nodes[] missing or empty');
  const fed = data.federation;
  if (fed?.unified_motherboard_claim_allowed !== false) {
    issues.push('federation.unified_motherboard_claim_allowed must be false');
  }
  for (const n of data.nodes || []) {
    if (!n.node_id) issues.push('node missing node_id');
    if (!n.organism_role) issues.push(`node ${n.node_id || '?'} missing organism_role`);
  }
  return { ok: issues.length === 0, issues, node_count: data.nodes?.length ?? 0 };
}

function validateSwarmExample(data) {
  const issues = [];
  if (!data || typeof data !== 'object') {
    issues.push('root not object');
    return { ok: false, issues };
  }
  if (!String(data.schema || '').includes('swarm')) issues.push('schema mismatch');
  if (!Array.isArray(data.roles) || data.roles.length < 1) issues.push('roles[] missing or empty');
  const ids = new Set((data.roles || []).map((r) => r.minibot_id));
  for (const required of ['SecurityBot', 'GuardianBot', 'ClusterBot']) {
    if (!ids.has(required)) issues.push(`missing minibot ${required}`);
  }
  return { ok: issues.length === 0, issues, role_count: data.roles?.length ?? 0 };
}

function auditForbiddenRuntime(pkg) {
  const scripts = pkg?.scripts && typeof pkg.scripts === 'object' ? pkg.scripts : {};
  const hits = [];
  for (const name of Object.keys(scripts)) {
    const cmd = String(scripts[name] || '');
    if (FORBIDDEN_PKG_SCRIPT_NAMES.includes(name)) hits.push({ kind: 'package_script_name', name });
    for (const re of FORBIDDEN_SCRIPT_PATTERNS) {
      if (re.test(name) || re.test(cmd)) hits.push({ kind: 'pattern', name, pattern: String(re) });
    }
  }
  let computeScripts = [];
  try {
    computeScripts = fs
      .readdirSync(SCRIPTS_DIR)
      .filter((f) => /^z_compute/i.test(f) && f.endsWith('.mjs'));
  } catch {
    computeScripts = [];
  }
  const allowedComputeScripts = new Set([
    'z_compute_organism_status.mjs',
    'z_compute_intake_validate.mjs',
    'z_compute_upgrade_plan_draft.mjs',
  ]);
  const unexpected = computeScripts.filter((f) => !allowedComputeScripts.has(f));
  if (unexpected.length > 0) {
    hits.push({
      kind: 'scripts_dir',
      files: unexpected,
      note: 'Only read-only z_compute_*.mjs observer/intake/draft scripts allowed under scripts/z_compute*',
    });
  }
  return { absent: hits.length === 0, hits, compute_scripts: computeScripts };
}

function signalRank(s) {
  const u = String(s || '').toUpperCase();
  const R = { RED: 4, BLUE: 3, YELLOW: 2, GREEN: 1, UNKNOWN: 0 };
  return R[u] ?? 0;
}

function worstSignal(a, b) {
  return signalRank(a) >= signalRank(b)
    ? String(a || 'UNKNOWN').toUpperCase()
    : String(b || 'UNKNOWN').toUpperCase();
}

function rollupZco({ doctrineOk, examplesOk, runtimeAbsent, trafficSignal, warnings }) {
  if (!doctrineOk || !examplesOk || !runtimeAbsent) return 'RED';
  if (warnings.length > 0) return worstSignal('YELLOW', trafficSignal);
  return worstSignal('GREEN', trafficSignal);
}

function main() {
  const generated_at = new Date().toISOString();
  const warnings = [];

  const doctrine = {};
  for (const [key, p] of Object.entries(DOCS)) {
    doctrine[key] = { path: path.relative(ROOT, p).replace(/\\/g, '/'), present: fileOk(p) };
  }
  const doctrineOk = Object.values(doctrine).every((d) => d.present);

  const nodeR = readJsonSafe(EX_NODE);
  const swarmR = readJsonSafe(EX_SWARM);
  const nodeVal = nodeR.ok ? validateNodeExample(nodeR.data) : { ok: false, issues: [nodeR.error] };
  const swarmVal = swarmR.ok
    ? validateSwarmExample(swarmR.data)
    : { ok: false, issues: [swarmR.error] };
  const examplesOk = nodeVal.ok && swarmVal.ok;

  const pkgR = readJsonSafe(PKG);
  const runtime = pkgR.ok
    ? auditForbiddenRuntime(pkgR.data)
    : { absent: false, hits: [{ kind: 'package_json', error: pkgR.error }], compute_scripts: [] };

  const trafficR = readJsonSafe(R_TRAFFIC);
  const trafficSignal = trafficR.ok
    ? String(trafficR.data?.traffic_chief?.overall_signal || 'UNKNOWN').toUpperCase()
    : 'UNKNOWN';
  if (!trafficR.ok) warnings.push('traffic report missing — run npm run z:traffic');

  const zcoHasStatusScript = Boolean(pkgR.ok && pkgR.data?.scripts?.['z:compute:organism']);
  if (!zcoHasStatusScript) warnings.push('package.json missing z:compute:organism script');

  const overall_signal = rollupZco({
    doctrineOk,
    examplesOk,
    runtimeAbsent: runtime.absent,
    trafficSignal,
    warnings,
  });

  const report = {
    schema: SCHEMA,
    phase: 'ZCO-2',
    generated_at,
    law: 'Read-only infrastructure awareness. Observe → verify → suggest → human decides. Does not execute hardware or orchestration.',
    mode: 'Turtle / Observe-only',
    posture: {
      runtime_orchestration: 'CLOSED',
      hardware_control: 'DISABLED',
      deploy_authority: 'DISABLED',
      network_scan: 'DISABLED',
    },
    doctrine_docs: doctrine,
    doctrine_all_present: doctrineOk,
    examples: {
      node_registry: {
        path: path.relative(ROOT, EX_NODE).replace(/\\/g, '/'),
        read_ok: nodeR.ok,
        validation: nodeVal,
      },
      swarm_roles: {
        path: path.relative(ROOT, EX_SWARM).replace(/\\/g, '/'),
        read_ok: swarmR.ok,
        validation: swarmVal,
      },
      examples_validated: examplesOk ? 'PASS' : 'FAIL',
    },
    swarm_summary: swarmR.ok
      ? {
          registry_name: swarmR.data.registry_name,
          role_count: swarmVal.role_count,
          minibot_ids: (swarmR.data.roles || []).map((r) => r.minibot_id).sort(),
          swarm_chief_status: swarmR.data?.swarm_chief?.status ?? null,
        }
      : null,
    node_summary: nodeR.ok
      ? {
          title: nodeR.data.title,
          node_count: nodeVal.node_count,
          node_ids: (nodeR.data.nodes || []).map((n) => n.node_id),
          federation_mode: nodeR.data?.federation?.mode ?? null,
          nas_wait_nodes: (nodeR.data.nodes || []).filter((n) => n.nas_wait).map((n) => n.node_id),
        }
      : null,
    forbidden_runtime: runtime,
    global_hub_signal: {
      traffic_overall: trafficSignal,
      traffic_report: trafficR.ok ? path.relative(ROOT, R_TRAFFIC).replace(/\\/g, '/') : null,
    },
    readiness: {
      arelium_shield_doctrine: doctrine.arelium?.present ? 'PRESENT' : 'MISSING',
      swarm_doctrine: doctrine.omniswarm?.present ? 'PRESENT' : 'MISSING',
      builder_instructions: doctrine.builder?.present ? 'PRESENT' : 'MISSING',
      formula_infrastructure_doctrine: doctrine.formulas?.present ? 'PRESENT' : 'MISSING',
    },
    overall_signal,
    smallest_safe_next_action:
      overall_signal === 'GREEN'
        ? 'Doctrine and examples verified; optional ZCO-3 panel charter — AMK chooses.'
        : overall_signal === 'RED'
          ? 'Fix missing doctrine, example validation, or forbidden runtime hints before widening lanes.'
          : 'Refresh hub evidence (npm run verify:md, npm run z:traffic); AMK review if BLUE.',
    warnings,
    related_docs: [
      'docs/compute-organism/Z_COMPUTE_ORGANISM_ARCHITECTURE.md',
      'docs/compute-organism/Z_SSWS_AI_TOWER_BUILDER_INSTRUCTIONS.md',
      'docs/compute-organism/PHASE_ZCO_2_GREEN_RECEIPT.md',
    ],
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2), 'utf8');

  const md = [
    '# Z-Compute Organism status',
    '',
    '```text',
    'ZCO STATUS',
    '-----------',
    `Mode: ${report.mode}`,
    `Runtime orchestration: ${report.posture.runtime_orchestration}`,
    `Hardware control: ${report.posture.hardware_control}`,
    `Swarm doctrine: ${report.readiness.swarm_doctrine}`,
    `Arelium shield doctrine: ${report.readiness.arelium_shield_doctrine}`,
    `Builder instructions: ${report.readiness.builder_instructions}`,
    `Examples validated: ${report.examples.examples_validated}`,
    `Global signal (ZCO rollup): ${overall_signal}`,
    `Hub traffic signal: ${trafficSignal}`,
    '```',
    '',
    `**Generated:** ${generated_at}`,
    `**Schema:** \`${SCHEMA}\``,
    '',
    '## Law',
    '',
    report.law,
    '',
    '## Doctrine docs',
    '',
    '| doc | present |',
    '| --- | ------- |',
    ...Object.entries(doctrine).map(([k, d]) => `| ${k} | ${d.present ? 'yes' : '**no**'} |`),
    '',
    '## Node example summary',
    '',
    report.node_summary
      ? `- Nodes: **${report.node_summary.node_count}** — \`${report.node_summary.node_ids.join('`, `')}\``
      : '_Node example missing or invalid._',
    '',
    '## Swarm roles summary',
    '',
    report.swarm_summary
      ? `- Roles: **${report.swarm_summary.role_count}** — ${report.swarm_summary.minibot_ids.join(', ')}`
      : '_Swarm example missing or invalid._',
    '',
    '## Forbidden runtime audit',
    '',
    runtime.absent
      ? '- **PASS** — no forbidden orchestration/hardware script names detected.'
      : `- **FAIL** — review hits in JSON (\`${path.relative(ROOT, OUT_JSON)}\`).`,
    '',
    `## Rollup signal: **${overall_signal}**`,
    '',
    `**Smallest safe next action:** ${report.smallest_safe_next_action}`,
    '',
    'Full JSON: `data/reports/z_compute_organism_status.json`',
    '',
  ].join('\n');

  fs.writeFileSync(OUT_MD, md, 'utf8');

  console.log(
    JSON.stringify(
      {
        ok: true,
        overall_signal,
        examples_validated: report.examples.examples_validated,
        traffic_signal: trafficSignal,
        out_json: OUT_JSON,
        out_md: OUT_MD,
      },
      null,
      2
    )
  );
}

main();
