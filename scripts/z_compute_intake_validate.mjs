#!/usr/bin/env node
/**
 * ZCO-5 — Read-only local hardware intake validator.
 * Reads ONE operator-declared inventory JSON (ZCO_INVENTORY_PATH or default example).
 * Writes only data/reports/z_compute_intake_validation.{json,md}.
 * Does not: scan hardware, shell, network, BIOS, telemetry, control devices, or orchestrate.
 * Exit code: 0 unless overall_signal is RED (then 1).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = process.cwd();

const DEFAULT_INVENTORY = path.join(
  ROOT,
  'data',
  'examples',
  'zco_hardware_inventory.example.json'
);
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_compute_intake_validation.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_compute_intake_validation.md');
const SCHEMA = 'z_compute_intake_validation_v1';

const VALID_ROLES = new Set([
  'ai_workstation',
  'control_hub',
  'compute_worker',
  'inference_edge',
  'storage_nas',
  'network_bridge',
  'recycle_dormant',
  'backup_standby',
  'planned_build',
]);

const VALID_STATUS = new Set(['active', 'dormant', 'recycle_candidate', 'retired', 'planned']);
const VALID_TRUST = new Set([
  'trusted',
  'provisional',
  'unknown',
  'degraded',
  'quarantine_advisory',
]);

const FORBIDDEN_KEYS = new Set([
  'telemetry_stream',
  'live_scan',
  'bios_access',
  'fan_control',
  'gpu_overclock',
  'shell_exec',
  'auto_discovery',
  'remote_wake',
  'auto_cluster_join',
  'live_telemetry',
  'wmi_scan',
  'auto_discovered',
  'unified_memory_fusion',
  'port_scan',
  'lan_scan',
  'arp_sweep',
  'fan_pwm',
  'remote_exec',
  'kubectl_apply',
  'scheduler_execute',
]);

const FORBIDDEN_STRING_PATTERNS = [
  {
    id: 'unified_motherboard',
    re: /unified\s+motherboard\s+fusion|fused\s+motherboard|single\s+literal\s+cpu\s+brain/i,
    signal: 'RED',
  },
  {
    id: 'fake_quantum',
    re: /fake\s+quantum|quantum\s+speedup|quantum\s+compute\s+claim/i,
    signal: 'RED',
  },
  {
    id: 'orchestration_control',
    re: /auto[\s-]?orchestrat(e|ion)\s+(enabled|active|execute)|k8s\s*apply|scheduler\s*execute/i,
    signal: 'RED',
  },
  {
    id: 'shell_runtime',
    re: /\bshell\s*exec\b|execute\s+shell\b|remote\s+wake\s+enabled/i,
    signal: 'RED',
  },
  {
    id: 'live_telemetry',
    re: /\b(enable|enabled|uses|using)\s+live\s+telemetry\b|\btelemetry\s+stream\s+enabled\b/i,
    signal: 'RED',
  },
  {
    id: 'auto_discovery',
    re: /\b(enable|enabled|uses|using)\s+auto[\s-]?discover/i,
    signal: 'RED',
  },
  {
    id: 'unsafe_power',
    re: /unsafe\s+power\s+chain|psu\s+chain\s+enable|daisy[\s-]?chain\s+psu/i,
    signal: 'RED',
  },
  { id: 'infinite_scale', re: /infinite\s+scale|unlimited\s+nodes\s+forever/i, signal: 'RED' },
  { id: 'gpu_overclock', re: /\bgpu\s+overclock\s+enabled|\bauto\s+overclock\b/i, signal: 'RED' },
];

/** Meta/doc fields may mention forbidden concepts in negative law text — skip wording scan. */
function skipWordingPath(keyPath) {
  return /^(law|scope_note|title|related_|schema|phase|updated_at|site_id)(\[|$)/.test(keyPath);
}

function resolveInventoryPath() {
  const env = process.env.ZCO_INVENTORY_PATH;
  if (env && String(env).trim()) {
    return path.isAbsolute(env) ? env : path.resolve(ROOT, env);
  }
  return DEFAULT_INVENTORY;
}

function signalRank(s) {
  const u = String(s || '').toUpperCase();
  return { RED: 3, YELLOW: 2, GREEN: 1, UNKNOWN: 0 }[u] ?? 0;
}

function worstSignal(a, b) {
  return signalRank(a) >= signalRank(b) ? String(a).toUpperCase() : String(b).toUpperCase();
}

function walkJson(value, keyPath, hits) {
  if (value === null || value === undefined) return;
  if (typeof value === 'string') {
    if (skipWordingPath(keyPath)) return;
    for (const p of FORBIDDEN_STRING_PATTERNS) {
      if (p.re.test(value)) {
        hits.push({
          kind: 'forbidden_wording',
          path: keyPath,
          pattern_id: p.id,
          signal: p.signal,
          excerpt: value.slice(0, 120),
        });
      }
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, i) => walkJson(item, `${keyPath}[${i}]`, hits));
    return;
  }
  if (typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      const lower = k.toLowerCase();
      if (FORBIDDEN_KEYS.has(lower)) {
        hits.push({
          kind: 'forbidden_field',
          path: keyPath ? `${keyPath}.${k}` : k,
          field: k,
          signal: 'RED',
        });
      }
      walkJson(v, keyPath ? `${keyPath}.${k}` : k, hits);
    }
  }
}

function validateInventory(data) {
  const findings = [];
  const add = (severity, code, message, extra = {}) =>
    findings.push({ severity, code, message, ...extra });

  if (!data || typeof data !== 'object') {
    add('RED', 'root_invalid', 'Root must be a JSON object');
    return { findings, inventory_count: 0 };
  }

  if (!String(data.schema || '').includes('hardware_inventory')) {
    add('YELLOW', 'schema_hint', 'schema should include zco_hardware_inventory');
  }

  if (!Array.isArray(data.inventory) || data.inventory.length < 1) {
    add('RED', 'inventory_missing', 'inventory[] required and must not be empty');
    return { findings, inventory_count: 0 };
  }

  const seenIds = new Set();
  let idx = 0;
  for (const node of data.inventory) {
    const prefix = `inventory[${idx}]`;
    idx += 1;

    if (!node || typeof node !== 'object') {
      add('RED', 'node_invalid', `${prefix} must be an object`);
      continue;
    }

    if (!node.node_id) add('RED', 'node_id_required', `${prefix}.node_id required`);
    else if (seenIds.has(node.node_id)) {
      add('RED', 'duplicate_node_id', `Duplicate node_id: ${node.node_id}`);
    } else seenIds.add(node.node_id);

    if (!node.label) add('YELLOW', 'label_missing', `${prefix}.label recommended`);
    if (!node.role) add('RED', 'role_required', `${prefix}.role required`);
    else if (!VALID_ROLES.has(node.role)) {
      add('YELLOW', 'role_unknown', `${prefix}.role "${node.role}" not in known role set`);
    }

    if (!node.status) add('RED', 'status_required', `${prefix}.status required`);
    else if (!VALID_STATUS.has(node.status)) {
      add('YELLOW', 'status_unknown', `${prefix}.status "${node.status}" unusual`);
    }

    if (!node.trust_status) add('RED', 'trust_required', `${prefix}.trust_status required`);
    else if (!VALID_TRUST.has(node.trust_status)) {
      add('YELLOW', 'trust_unknown', `${prefix}.trust_status "${node.trust_status}" unusual`);
    }

    if (!node.motherboard && !node.cpu) {
      add('YELLOW', 'hardware_sparse', `${prefix}: declare motherboard or cpu (coarse OK)`);
    }

    if (node.power?.power_chain_safe_declared === false) {
      add(
        'YELLOW',
        'power_chain_declared_unsafe',
        `${prefix}: power_chain_safe_declared false — AMK review`
      );
    }

    if (node.nas_wait === true && node.status === 'active') {
      add(
        'YELLOW',
        'nas_wait_active',
        `${prefix}: nas_wait with status active — clarify mount posture`
      );
    }

    if (Array.isArray(node.upgrade_goals) && node.upgrade_goals.length > 0) {
      const hasConstraints = Boolean(node.constraints && Object.keys(node.constraints).length);
      if (!node.receipts_note && !hasConstraints) {
        add(
          'YELLOW',
          'upgrade_plan_sparse',
          `${prefix}: upgrade_goals without constraints/receipts_note`
        );
      }
    }
  }

  if (data.federation && data.federation.unified_motherboard_claim_allowed !== false) {
    add(
      'RED',
      'unified_motherboard_claim',
      'federation.unified_motherboard_claim_allowed must be false if present'
    );
  }

  const forbiddenHits = [];
  walkJson(data, '', forbiddenHits);
  for (const h of forbiddenHits) {
    add(h.signal, h.kind, h.path || h.pattern_id, {
      field: h.field,
      pattern_id: h.pattern_id,
      excerpt: h.excerpt,
    });
  }

  return { findings, inventory_count: data.inventory.length, node_ids: [...seenIds] };
}

function rollup(findings) {
  let overall = 'GREEN';
  for (const f of findings) {
    overall = worstSignal(overall, f.severity);
  }
  return overall;
}

function main() {
  const inventoryPath = resolveInventoryPath();
  const generated_at = new Date().toISOString();
  const warnings = [];

  let readOk = false;
  let data = null;
  let readError = null;

  try {
    if (!fs.existsSync(inventoryPath)) {
      readError = `File not found: ${inventoryPath}`;
    } else {
      data = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));
      readOk = true;
    }
  } catch (e) {
    readError = String(e?.message || e);
  }

  let validation = { findings: [], inventory_count: 0, node_ids: [] };
  if (readOk) {
    validation = validateInventory(data);
  } else {
    validation.findings.push({
      severity: 'RED',
      code: 'read_failed',
      message: readError || 'Could not read inventory JSON',
    });
  }

  const overall_signal = readOk ? rollup(validation.findings) : 'RED';
  const redCount = validation.findings.filter((f) => f.severity === 'RED').length;
  const yellowCount = validation.findings.filter((f) => f.severity === 'YELLOW').length;

  const report = {
    schema: SCHEMA,
    phase: 'ZCO-5',
    generated_at,
    law: 'Read-only intake validation. Operator-declared JSON only. No scan, shell, network, or device control.',
    mode: 'Turtle / Observe-only',
    posture: {
      runtime_orchestration: 'CLOSED',
      hardware_control: 'DISABLED',
      telemetry_collection: 'DISABLED',
      network_probe: 'DISABLED',
    },
    inventory_path: path.relative(ROOT, inventoryPath).replace(/\\/g, '/'),
    inventory_path_resolved: inventoryPath,
    env_var: 'ZCO_INVENTORY_PATH',
    default_fallback: path.relative(ROOT, DEFAULT_INVENTORY).replace(/\\/g, '/'),
    read_ok: readOk,
    inventory_count: validation.inventory_count,
    node_ids: validation.node_ids || [],
    findings: validation.findings,
    counts: { red: redCount, yellow: yellowCount, green: validation.findings.length === 0 ? 1 : 0 },
    overall_signal,
    smallest_safe_next_action:
      overall_signal === 'GREEN'
        ? 'Inventory shape acceptable for declared planning; copy to gitignored local manifest when ready.'
        : overall_signal === 'RED'
          ? 'Remove forbidden fields/claims; fix required fields before treating inventory as valid.'
          : 'Clarify YELLOW findings; AMK for power or NAS_WAIT conflicts.',
    warnings,
    related_docs: [
      'docs/compute-organism/ZCO_5_LOCAL_INTAKE_VALIDATOR.md',
      'docs/compute-organism/ZCO_5_VALIDATION_RULES.md',
      'docs/compute-organism/ZCO_4_HARDWARE_SCHEMA.md',
    ],
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2), 'utf8');

  const md = [
    '# Z-Compute intake validation (ZCO-5)',
    '',
    '```text',
    'ZCO INTAKE VALIDATION',
    '---------------------',
    `Mode: ${report.mode}`,
    `Runtime orchestration: ${report.posture.runtime_orchestration}`,
    `Hardware control: ${report.posture.hardware_control}`,
    `Telemetry collection: ${report.posture.telemetry_collection}`,
    `Inventory: ${report.inventory_path}`,
    `Nodes declared: ${report.inventory_count}`,
    `Overall signal: ${overall_signal}`,
    `RED: ${redCount}  YELLOW: ${yellowCount}`,
    '```',
    '',
    `**Generated:** ${generated_at}`,
    '',
    report.law,
    '',
    '## Findings',
    '',
    validation.findings.length
      ? validation.findings
          .map(
            (f) => `- **${f.severity}** \`${f.code}\` — ${f.message}${f.path ? ` (${f.path})` : ''}`
          )
          .join('\n')
      : '_No findings — declared inventory passed validation rules._',
    '',
    `**Smallest safe next action:** ${report.smallest_safe_next_action}`,
    '',
    'Full JSON: `data/reports/z_compute_intake_validation.json`',
    '',
  ].join('\n');

  fs.writeFileSync(OUT_MD, md, 'utf8');

  const out = {
    ok: overall_signal !== 'RED',
    overall_signal,
    inventory_path: report.inventory_path,
    red: redCount,
    yellow: yellowCount,
    out_json: OUT_JSON,
    out_md: OUT_MD,
  };

  console.log(JSON.stringify(out, null, 2));
  process.exit(overall_signal === 'RED' ? 1 : 0);
}

main();
