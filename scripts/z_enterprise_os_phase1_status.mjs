#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DATA = path.join(ROOT, 'data');
const REPORTS = path.join(DATA, 'reports');
const INPUT_SEED = path.join(DATA, 'z_seoos_phase1_seed.json');
const INPUT_SPEC = path.join(ROOT, 'docs', 'Z-SOVEREIGN-ENTERPRISE-OS-PHASE1.md');
const OUT_JSON = path.join(REPORTS, 'z_enterprise_os_phase1_status.json');
const OUT_MD = path.join(REPORTS, 'z_enterprise_os_phase1_status.md');
const AUTHORITY = 'advisory_only_no_auto_execution';

function readJsonSafe(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function existsMeta(filePath) {
  try {
    if (!fs.existsSync(filePath)) return { present: false, mtime_iso: null };
    const st = fs.statSync(filePath);
    return { present: true, mtime_iso: new Date(st.mtimeMs).toISOString() };
  } catch {
    return { present: false, mtime_iso: null };
  }
}

function calcReadiness(seed, specMeta) {
  let score = 0;
  const checks = [];

  const hasSpec = !!specMeta.present;
  checks.push({ id: 'phase1_spec_doc', pass: hasSpec, weight: 20, note: 'Canonical phase1 spec exists.' });
  if (hasSpec) score += 20;

  const hasSeed = !!seed;
  checks.push({ id: 'seed_contract', pass: hasSeed, weight: 20, note: 'Seed contract JSON is readable.' });
  if (hasSeed) score += 20;

  const productCount = Array.isArray(seed?.products) ? seed.products.length : 0;
  const industryCount = Array.isArray(seed?.industries) ? seed.industries.length : 0;
  const ledgerCount = Array.isArray(seed?.ledger_seed) ? seed.ledger_seed.length : 0;
  const hasPortals = Array.isArray(seed?.communication_portals) && seed.communication_portals.length >= 6;

  const productsOk = productCount >= 3;
  checks.push({ id: 'seed_products_minimum', pass: productsOk, weight: 20, note: `Need >=3 products, found ${productCount}.` });
  if (productsOk) score += 20;

  const industriesOk = industryCount >= 3;
  checks.push({ id: 'seed_industries_minimum', pass: industriesOk, weight: 15, note: `Need >=3 industries, found ${industryCount}.` });
  if (industriesOk) score += 15;

  const ledgerOk = ledgerCount >= 3;
  checks.push({ id: 'ledger_seed_minimum', pass: ledgerOk, weight: 10, note: `Need >=3 ledger entries, found ${ledgerCount}.` });
  if (ledgerOk) score += 10;

  checks.push({ id: 'portal_roster', pass: hasPortals, weight: 15, note: 'Role-aware portal list present.' });
  if (hasPortals) score += 15;

  const posture = score >= 90 ? 'strong' : score >= 75 ? 'watch' : score >= 50 ? 'caution' : 'hold';
  return { score, posture, checks, productCount, industryCount, ledgerCount, hasPortals };
}

function buildReport() {
  const generatedAt = new Date().toISOString();
  const seed = readJsonSafe(INPUT_SEED);
  const specMeta = existsMeta(INPUT_SPEC);
  const seedMeta = existsMeta(INPUT_SEED);
  const readiness = calcReadiness(seed, specMeta);

  const nextActions = [
    'Implement frontend shell with local mock data wiring for Command Center + Products + Ledger.',
    'Map all Phase 1 portal cards to role-specific capability and escalation notes.',
    'Add Trust Passport UI wording guards (Internally Reviewed / Prototype Tested / Certification Pending / Third-Party Certified).',
    'Keep decisions human-approved; do not connect live payment/supplier/shipment APIs in Phase 1.',
  ];

  return {
    schema_version: 1,
    name: 'z-enterprise-os-phase1-status',
    generated_at: generatedAt,
    authority: AUTHORITY,
    inputs: {
      phase1_spec_doc: {
        path: 'docs/Z-SOVEREIGN-ENTERPRISE-OS-PHASE1.md',
        ...specMeta,
      },
      seed_contract: {
        path: 'data/z_seoos_phase1_seed.json',
        ...seedMeta,
      },
    },
    readiness: {
      score: readiness.score,
      posture: readiness.posture,
      checks: readiness.checks,
    },
    inventory: {
      products: readiness.productCount,
      industries: readiness.industryCount,
      ledger_seed_entries: readiness.ledgerCount,
      communication_portals_present: readiness.hasPortals,
    },
    phase1_scope: {
      completed: [
        'Canonical phase1 spec drafted.',
        'Seed contract file created for products/industries/ledger/portals.',
        'Status report generator implemented.',
      ],
      pending: [
        'Frontend dashboard implementation using local mock data.',
        'UI-level role flows and world map placeholder view.',
      ],
    },
    next_actions: nextActions,
    notes: 'Phase 1 status is advisory planning telemetry for structured build handoff.',
  };
}

function toMarkdown(report) {
  const lines = [];
  lines.push('# Z-Sovereign Enterprise OS — Phase 1 status');
  lines.push('');
  lines.push(`**Generated (UTC):** ${report.generated_at}`);
  lines.push(`**Authority:** \`${report.authority}\``);
  lines.push(`**Readiness:** **${report.readiness.posture.toUpperCase()}** · score **${report.readiness.score}/100**`);
  lines.push('');
  lines.push('## Inputs');
  lines.push('');
  lines.push(`- Spec doc: \`${report.inputs.phase1_spec_doc.path}\` · present=${report.inputs.phase1_spec_doc.present} · mtime=${report.inputs.phase1_spec_doc.mtime_iso || 'n/a'}`);
  lines.push(`- Seed contract: \`${report.inputs.seed_contract.path}\` · present=${report.inputs.seed_contract.present} · mtime=${report.inputs.seed_contract.mtime_iso || 'n/a'}`);
  lines.push('');
  lines.push('## Readiness checks');
  lines.push('');
  for (const c of report.readiness.checks) {
    lines.push(`- ${c.pass ? 'PASS' : 'MISS'} \`${c.id}\` (weight ${c.weight}) — ${c.note}`);
  }
  lines.push('');
  lines.push('## Inventory snapshot');
  lines.push('');
  lines.push(`- Products: **${report.inventory.products}**`);
  lines.push(`- Industries: **${report.inventory.industries}**`);
  lines.push(`- Ledger seed entries: **${report.inventory.ledger_seed_entries}**`);
  lines.push(`- Communication portals present: **${report.inventory.communication_portals_present}**`);
  lines.push('');
  lines.push('## Scope');
  lines.push('');
  lines.push('**Completed**');
  for (const item of report.phase1_scope.completed) lines.push(`- ${item}`);
  lines.push('');
  lines.push('**Pending**');
  for (const item of report.phase1_scope.pending) lines.push(`- ${item}`);
  lines.push('');
  lines.push('## Next actions');
  lines.push('');
  for (const item of report.next_actions) lines.push(`- ${item}`);
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('Phase 1 principle: structure before scale, proof before automation.');
  lines.push('');
  return lines.join('\n');
}

const report = buildReport();
fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
fs.writeFileSync(OUT_JSON, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
fs.writeFileSync(OUT_MD, toMarkdown(report), 'utf8');

console.log('OK: Enterprise OS Phase 1 status written:');
console.log(' ', path.relative(ROOT, OUT_JSON));
console.log(' ', path.relative(ROOT, OUT_MD));
console.log(`posture=${report.readiness.posture} score=${report.readiness.score}`);
