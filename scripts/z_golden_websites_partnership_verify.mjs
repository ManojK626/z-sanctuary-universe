#!/usr/bin/env node
/**
 * Z-GOLDEN-WEBSITES-PARTNERSHIP-ECONOMICS-0
 * Framework integrity only. No runtime, deploy, equity, or recruitment authorization.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function readJson(rel) {
  const p = path.join(ROOT, rel);
  assert.ok(fs.existsSync(p), `missing ${rel}`);
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function mustExist(rel) {
  assert.ok(fs.existsSync(path.join(ROOT, rel)), `missing ${rel}`);
}

const REQUIRED_DOCS = [
  'docs/Z_GOLDEN_WEBSITES_PARTNERSHIP_EQUITY_FRAMEWORK.md',
  'docs/Z_GOLDEN_WEBSITES_ECONOMIC_SCORECARD.md',
  'docs/Z_GOLDEN_WEBSITES_PARTNERSHIP_RECONCILIATION_0.md',
  'docs/PHASE_Z_GOLDEN_WEBSITES_PARTNERSHIP_ECONOMICS_0_GREEN_RECEIPT.md'
];

const CLASS_IDS = [
  'CLASS_1_CONTRIBUTORS',
  'CLASS_2_GROWTH_PARTNERS',
  'CLASS_3_STRATEGIC_PARTNERS',
  'CLASS_4_CORE_EXECUTIVE_LONG_TERM_ORGANISM_STEWARD'
];

const IP_CLASSES = [
  'BACKGROUND_IP',
  'FOREGROUND_IP',
  'Z_CORE_IP',
  'PROPERTY_IP',
  'THIRD_PARTY_IP',
  'AI_GENERATED_ASSETS'
];

function main() {
  for (const rel of REQUIRED_DOCS) mustExist(rel);
  mustExist('data/z_golden_websites_partnership_framework.json');

  const fw = readJson('data/z_golden_websites_partnership_framework.json');
  assert.equal(fw.framework_id, 'Z-GOLDEN-WEBSITES-PARTNERSHIP-ECONOMICS-0');
  assert.equal(fw.status, 'GREEN_FRAMEWORK_ONLY');
  assert.equal(fw.legal_status, 'PROPOSED_FRAMEWORK_ONLY');

  assert.equal(fw.runtime_authorization, false);
  assert.equal(fw.deployment_authorization, false);
  assert.equal(fw.publication_authorization, false);
  assert.equal(fw.equity_issuance_authorization, false);
  assert.equal(fw.recruitment_authorization, false);
  assert.equal(fw.icis_scope, 'UNCHANGED');

  const env = fw.strategic_dilution_envelope;
  assert.equal(env.strategic_dilution_envelope_pct, 15);
  assert.equal(env.issued_pct, 0);
  assert.equal(env.promised_pct, 0);
  for (const token of ['PROPOSED', 'RESERVED', 'NOT_ISSUED', 'NOT_PROMISED']) {
    assert.ok(env.envelope_semantics.includes(token), `envelope missing ${token}`);
  }
  assert.equal(env.legal_status, 'PROPOSED_FRAMEWORK_ONLY');
  assert.equal(env.unused_reserve_remains_unissued, true);

  const classes = fw.partner_classes.map((c) => c.id);
  assert.deepEqual(classes, CLASS_IDS);
  assert.equal(fw.partner_classes[0].default_parent_equity, 'NONE');
  assert.equal(fw.partner_classes[1].default_parent_equity, 'NONE');

  assert.equal(fw.website_economics.one_website_contribution_equals_whole_universe_ownership, false);
  assert.equal(fw.website_economics.revenue_sharing_status, 'FRAMEWORK_DEFINED_NOT_ACTIVATED');
  assert.equal(fw.website_economics.canonical_partner_rate_pct, null);
  assert.equal(fw.website_economics.economic_base.name, 'QUALIFIED_CONTRIBUTION_MARGIN');

  assert.equal(fw.lifetime_partnership.status, 'RETIRED_FOR_NEW_RECRUITMENT');

  const score = fw.contribution_scoring;
  assert.equal(score.label, 'PROPOSED_DECISION_SUPPORT');
  assert.equal(score.not_automatic_compensation, true);
  assert.equal(score.auto_grants_equity, false);
  assert.equal(score.auto_grants_revenue_share, false);
  assert.equal(score.auto_grants_access, false);
  assert.equal(score.auto_grants_executive_status, false);
  assert.equal(score.auto_grants_ip_ownership, false);
  assert.equal(score.human_review_mandatory, true);
  const dimSum = score.dimensions.reduce((n, d) => n + d.points, 0);
  assert.equal(dimSum, 100);
  assert.equal(score.total_points, 100);

  for (const ip of IP_CLASSES) {
    assert.ok(fw.ip_governance.classes.includes(ip), `IP missing ${ip}`);
  }
  assert.equal(fw.ip_governance.z_core_ip_transferred_by_website_contribution, false);

  assert.equal(fw.access_governance.least_privilege, true);
  assert.equal(fw.access_governance.partnership_equals_admin_access, false);
  assert.equal(fw.access_governance.revenue_share_equals_database_access, false);
  assert.equal(fw.access_governance.equity_equals_production_credentials, false);
  assert.equal(fw.access_governance.adviser_equals_source_of_truth_authority, false);

  const sc = fw.financial_scenarios;
  assert.equal(sc.label, 'ILLUSTRATIVE ONLY');
  for (const token of ['VALUATION', 'FORECAST', 'INVESTMENT RETURN']) {
    assert.ok(sc.not.includes(token), `scenarios missing not-token ${token}`);
  }
  for (const row of sc.parent_equity_table) {
    assert.equal(row.pct_1, row.value_usd * 0.01);
    assert.equal(row.pct_5, row.value_usd * 0.05);
    assert.equal(row.pct_15, row.value_usd * 0.15);
  }
  const ex = sc.property_revenue_share_example;
  assert.equal(ex.qualified_contribution_margin_usd * (ex.example_rate_pct / 100), ex.partner_economics_usd);
  assert.equal(ex.canonical_partner_rate_established, false);
  assert.equal(ex.label, 'ILLUSTRATIVE MODEL ONLY');

  assert.equal(
    fw.legal_boundaries.equity_issuance_options_warrants_revenue_share_employment_tax_securities,
    'LEGAL_REVIEW_REQUIRED'
  );
  assert.equal(
    fw.legal_boundaries.gambling_adjacent_golden_websites_or_modules,
    'SPECIALIST_REGULATORY_REVIEW_REQUIRED'
  );
  assert.equal(fw.legal_boundaries.disclaimer_establishes_legality, false);

  assert.equal(fw.golden_scorecard.status, 'DEFINED_NO_LIVE_ANALYTICS');
  assert.equal(fw.public_language_rules.public_partnership_page_deployed, false);
  assert.equal(fw.contribution_record_schema.records.length, 0);

  const recon = fs.readFileSync(path.join(ROOT, 'docs/Z_GOLDEN_WEBSITES_PARTNERSHIP_RECONCILIATION_0.md'), 'utf8');
  assert.ok(recon.includes('RETIRED_FOR_NEW_RECRUITMENT'));
  assert.ok(recon.includes('OmniEchoHeartcore.com'));
  assert.ok(/not canonical/i.test(recon));

  const receipt = fs.readFileSync(
    path.join(ROOT, 'docs/PHASE_Z_GOLDEN_WEBSITES_PARTNERSHIP_ECONOMICS_0_GREEN_RECEIPT.md'),
    'utf8'
  );
  assert.ok(receipt.includes('GREEN — FRAMEWORK ONLY'));
  assert.ok(receipt.includes('Commit:\nNONE') || receipt.includes('**NONE**'));
  assert.ok(receipt.includes('ICIS'));

  console.log('z:golden:partnership:verify PASS');
  console.log('status GREEN_FRAMEWORK_ONLY');
  console.log('issued_pct 0 promised_pct 0 envelope 15 PROPOSED/RESERVED');
  console.log('runtime/deploy/recruitment/equity issuance: all false');
}

main();
