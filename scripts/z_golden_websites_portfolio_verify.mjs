#!/usr/bin/env node
/**
 * Z-GOLDEN-WEBSITES-PORTFOLIO-REGISTRY-0
 * Evidence registry integrity only. No deploy, recruitment, valuation, or ICIS mutation.
 */
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const IDENTITY = new Set([
  'CANONICAL_DOORWAY',
  'CANONICAL_PROPERTY',
  'MODULE',
  'OVERLAY',
  'CANDIDATE_PROPERTY',
  'HISTORICAL',
  'ALIAS',
  'UNRESOLVED',
  'NOT_A_PROPERTY'
]);
const REGULATORY = new Set([
  'STANDARD',
  'GAMBLING_ADJACENT',
  'FINANCIAL_ADJACENT',
  'HEALTH_ADJACENT',
  'CHILD_FACING',
  'PRIVACY_SENSITIVE',
  'AI_HIGH_IMPACT_REVIEW',
  'MULTI_REGULATED',
  'OTHER_REVIEW',
  'UNKNOWN'
]);

const REQUIRED_DOCS = [
  'docs/Z_GOLDEN_WEBSITES_PORTFOLIO_REGISTRY.md',
  'docs/Z_GOLDEN_WEBSITES_PROPERTY_EVIDENCE_CARDS.md',
  'docs/Z_GOLDEN_WEBSITES_PORTFOLIO_RECONCILIATION_0.md',
  'docs/PHASE_Z_GOLDEN_WEBSITES_PORTFOLIO_REGISTRY_0_GREEN_RECEIPT.md'
];

function readJson(rel) {
  const p = path.join(ROOT, rel);
  assert.ok(fs.existsSync(p), `missing ${rel}`);
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') {
    const out = {};
    for (const key of Object.keys(value).sort()) out[key] = stable(value[key]);
    return out;
  }
  return value;
}

export function computePortfolioRegistryDigest(reg) {
  const copy = { ...reg };
  delete copy.portfolio_registry_digest;
  return crypto.createHash('sha256').update(JSON.stringify(stable(copy))).digest('hex');
}

function walkValues(node, visit) {
  if (Array.isArray(node)) {
    for (const item of node) walkValues(item, visit);
    return;
  }
  if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) visit(k, v, node);
    for (const v of Object.values(node)) walkValues(v, visit);
  }
}

function main() {
  for (const rel of REQUIRED_DOCS) {
    assert.ok(fs.existsSync(path.join(ROOT, rel)), `missing ${rel}`);
  }

  const fw = readJson('data/z_golden_websites_partnership_framework.json');
  assert.equal(fw.status, 'GREEN_FRAMEWORK_ONLY');
  assert.equal(fw.strategic_dilution_envelope.issued_pct, 0);

  const reg = readJson('data/z_golden_websites_portfolio_registry.json');
  assert.equal(reg.registry_id, 'Z-GOLDEN-WEBSITES-PORTFOLIO-REGISTRY-0');
  assert.equal(reg.status, 'EVIDENCE_REGISTRY_ONLY');
  assert.equal(reg.icis_scope, 'UNCHANGED');
  assert.equal(reg.runtime_authorization, false);
  assert.equal(reg.deployment_authorization, false);
  assert.equal(reg.publication_authorization, false);
  assert.equal(reg.recruitment_authorization, false);
  assert.equal(reg.equity_issuance_authorization, false);
  assert.equal(reg.revenue_share_activation, false);
  assert.equal(reg.parent_equity_issued_pct, 0);
  assert.equal(reg.parent_equity_promised_pct, 0);
  assert.equal(reg.valuation_fields_factual, false);

  const buckets = [
    'properties',
    'modules',
    'overlays',
    'unresolved_identities',
    'historical_identities',
    'not_a_property'
  ];
  const ids = new Set();
  for (const key of buckets) {
    assert.ok(Array.isArray(reg[key]), `missing array ${key}`);
    for (const row of reg[key]) {
      assert.ok(row.property_id, `${key} row missing property_id`);
      assert.ok(!ids.has(row.property_id), `duplicate id ${row.property_id}`);
      ids.add(row.property_id);
      assert.ok(IDENTITY.has(row.identity_class), `bad identity_class ${row.identity_class}`);
    }
  }

  const doorways = reg.properties.filter((p) => p.identity_class === 'CANONICAL_DOORWAY');
  const canonProps = reg.properties.filter((p) => p.identity_class === 'CANONICAL_PROPERTY');
  const candidates = reg.properties.filter((p) => p.identity_class === 'CANDIDATE_PROPERTY');
  assert.equal(doorways.length, 1);
  assert.equal(canonProps.length, 0);
  assert.equal(candidates.length, 0);
  const door = doorways[0];
  assert.equal(door.canonical_name, 'Golden Website');
  assert.equal(door.property_type, 'ECOSYSTEM_DOORWAY');
  assert.ok(Array.isArray(door.evidence_sources) && door.evidence_sources.length > 0);
  assert.equal(door.owns_z_core ?? door.ip_boundary.owns_z_core, false);
  assert.equal(door.ip_boundary.uses_z_core, true);
  assert.notEqual(door.partner_eligibility, door.partner_readiness);
  assert.equal(door.partner_readiness, 'NOT_READY');
  assert.notEqual(door.partner_readiness, 'PILOT_READY');
  assert.equal(door.golden_score, 'NOT_COMPUTED');
  assert.equal(door.economic_maturity_state, 'NOT_GOLDEN');
  assert.equal(door.parent_equity_relevance, 'NONE');
  assert.ok(REGULATORY.has(door.regulatory.regulatory_class));
  assert.equal(door.portfolio_posture_binding, 'NON_BINDING_DECISION_SUPPORT');

  walkValues(door.metrics, (k, v) => {
    if (k === 'value') assert.notEqual(v, 0, 'metric value must not be numeric 0');
  });
  walkValues(door.ai_economics, (k, v) => {
    if (k === 'value') assert.notEqual(v, 0, 'AI metric value must not be numeric 0');
  });

  const names = [
    ...reg.unresolved_identities.map((r) => r.canonical_name),
    ...reg.historical_identities.map((r) => r.canonical_name)
  ].join(' | ');
  assert.ok(/Golden Magnets/i.test(names));
  assert.ok(/Genius Magnet/i.test(names));
  assert.ok(/OmniEchoHeartcore/i.test(names));
  for (const u of reg.unresolved_identities) {
    assert.equal(u.promoted_to_property, false);
    assert.equal(u.identity_class, 'UNRESOLVED');
    assert.notEqual(u.identity_class, 'CANONICAL_PROPERTY');
    assert.notEqual(u.identity_class, 'CANONICAL_DOORWAY');
  }
  const omni = reg.unresolved_identities.find((r) => /OmniEchoHeartcore/i.test(r.canonical_name));
  assert.equal(omni.not_canonical, true);
  assert.equal(omni.canonicality, 'UNRESOLVED');

  const gambling = reg.not_a_property.filter((r) => r.regulatory_class === 'GAMBLING_ADJACENT');
  assert.ok(gambling.length >= 2);
  for (const g of gambling) {
    assert.equal(g.specialist_regulatory_review_required, true);
    assert.equal(g.identity_class, 'NOT_A_PROPERTY');
  }

  const s = reg.portfolio_summary;
  assert.equal(s.canonical_doorways, doorways.length);
  assert.equal(s.canonical_properties, canonProps.length);
  assert.equal(s.candidate_properties, candidates.length);
  assert.equal(s.modules, reg.modules.length);
  assert.equal(s.overlays, reg.overlays.length);
  assert.equal(s.historical, reg.historical_identities.length);
  assert.equal(s.unresolved, reg.unresolved_identities.length);
  assert.equal(s.not_a_property, reg.not_a_property.length);
  assert.equal(s.aliases, door.aliases.filter((a) => a.relationship_state === 'CONFIRMED').length);
  assert.equal(s.properties_with_measured_revenue, 0);
  assert.equal(s.properties_with_measured_ai_cost, 0);
  assert.equal(s.properties_with_complete_scorecards, 0);
  assert.equal(s.properties_partner_review_ready, 0);
  assert.equal(
    s.properties_requiring_regulatory_review,
    reg.properties.filter((p) => p.regulatory?.legal_review_required || p.regulatory?.specialist_regulatory_review_required)
      .length
  );

  const atlas = fs.readFileSync(path.join(ROOT, 'docs/Z_GOLDEN_WEBSITES_PORTFOLIO_REGISTRY.md'), 'utf8');
  assert.ok(atlas.includes('not an active fleet') || atlas.includes('Not an active fleet') || /plural/i.test(atlas));
  assert.ok(/PROPOSED/i.test(atlas) || /proposed portfolio/i.test(atlas));

  const digest = computePortfolioRegistryDigest(reg);
  assert.equal(reg.portfolio_registry_digest, digest, 'portfolio_registry_digest mismatch');

  const receipt = fs.readFileSync(
    path.join(ROOT, 'docs/PHASE_Z_GOLDEN_WEBSITES_PORTFOLIO_REGISTRY_0_GREEN_RECEIPT.md'),
    'utf8'
  );
  assert.ok(receipt.includes('GREEN — EVIDENCE REGISTRY ONLY'));
  assert.ok(receipt.includes('ICIS'));

  console.log('z:golden:portfolio:verify PASS');
  console.log(`canonical_doorways ${s.canonical_doorways}`);
  console.log(`canonical_properties ${s.canonical_properties}`);
  console.log(`candidate_properties ${s.candidate_properties}`);
  console.log(`unresolved ${s.unresolved}`);
  console.log(`portfolio_registry_digest ${digest}`);
}

const isDirect =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirect) main();
