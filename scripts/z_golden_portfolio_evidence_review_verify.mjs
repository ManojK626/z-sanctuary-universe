#!/usr/bin/env node
/**
 * Z-GOLDEN-PORTFOLIO-EVIDENCE-REVIEW-0
 * Decision-support integrity. Does not rewrite Portfolio Registry 0.
 */
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { computePortfolioRegistryDigest } from './z_golden_websites_portfolio_verify.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SEALED_REGISTRY_DIGEST = 'd1f108dc9a405221977f35d0a19306d47f2713e08dd4aa02488234de9e84245d';
const OUTCOMES = new Set([
  'ADMIT_AS_CANDIDATE',
  'KEEP_AS_MODULE',
  'KEEP_AS_OVERLAY',
  'KEEP_AS_DOORWAY',
  'RECONCILE_FIRST',
  'OBSERVE',
  'SLEEP',
  'RETIRE_REVIEW',
  'INSUFFICIENT_EVIDENCE',
  'NOT_APPLICABLE'
]);

const REQUIRED_DOCS = [
  'docs/Z_GOLDEN_PORTFOLIO_EVIDENCE_REVIEW_0.md',
  'docs/PHASE_Z_GOLDEN_PORTFOLIO_EVIDENCE_REVIEW_0_GREEN_RECEIPT.md'
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

export function computeEvidenceReviewDigest(rev) {
  const copy = { ...rev };
  delete copy.golden_portfolio_evidence_review_digest;
  return crypto.createHash('sha256').update(JSON.stringify(stable(copy))).digest('hex');
}

function main() {
  for (const rel of REQUIRED_DOCS) {
    assert.ok(fs.existsSync(path.join(ROOT, rel)), `missing ${rel}`);
  }

  const fw = readJson('data/z_golden_websites_partnership_framework.json');
  assert.equal(fw.status, 'GREEN_FRAMEWORK_ONLY');
  assert.equal(fw.strategic_dilution_envelope.issued_pct, 0);

  const reg = readJson('data/z_golden_websites_portfolio_registry.json');
  assert.equal(reg.portfolio_registry_digest, SEALED_REGISTRY_DIGEST);
  assert.equal(computePortfolioRegistryDigest(reg), SEALED_REGISTRY_DIGEST);
  assert.equal(reg.portfolio_summary.canonical_doorways, 1);
  assert.equal(reg.portfolio_summary.canonical_properties, 0);
  assert.equal(reg.portfolio_summary.candidate_properties, 0);

  const rev = readJson('data/z_golden_portfolio_evidence_review_0.json');
  assert.equal(rev.review_id, 'Z-GOLDEN-PORTFOLIO-EVIDENCE-REVIEW-0');
  assert.equal(rev.status, 'DECISION_SUPPORT_ONLY');
  assert.equal(rev.source_registry_digest, SEALED_REGISTRY_DIGEST);
  assert.equal(rev.canonical_registry_rewritten, false);
  assert.equal(rev.new_canonical_websites_created, 0);
  assert.equal(rev.canonical_property_count_changed, false);
  assert.equal(rev.runtime_authorization, false);
  assert.equal(rev.deployment_authorization, false);
  assert.equal(rev.recruitment_authorization, false);
  assert.equal(rev.partnership_activation, false);
  assert.equal(rev.revenue_share_activation, false);
  assert.equal(rev.telemetry_installation, false);
  assert.equal(rev.domain_mutation, false);
  assert.equal(rev.valuation_fields_factual, false);
  assert.equal(rev.icis_scope, 'UNCHANGED');
  assert.equal(rev.admission_test.admit_as_candidate_equals_canonical_property, false);

  const moduleIds = reg.modules.map((m) => m.property_id).sort();
  const reviewedMods = rev.module_reviews.map((m) => m.object_id).sort();
  assert.deepEqual(reviewedMods, moduleIds);
  assert.equal(rev.module_reviews.length, 6);
  assert.ok(rev.module_reviews.every((m) => m.admission_outcome === 'KEEP_AS_MODULE'));

  const overlayIds = reg.overlays.map((m) => m.property_id).sort();
  const reviewedOv = rev.overlay_reviews.map((m) => m.object_id).sort();
  assert.deepEqual(reviewedOv, overlayIds);
  assert.equal(rev.overlay_reviews.length, 3);
  assert.ok(rev.overlay_reviews.every((m) => m.admission_outcome === 'KEEP_AS_OVERLAY'));

  const unresolvedIds = reg.unresolved_identities.map((m) => m.property_id).sort();
  const reviewedUn = rev.unresolved_identity_reviews.map((m) => m.object_id).sort();
  assert.deepEqual(reviewedUn, unresolvedIds);
  assert.ok(rev.unresolved_identity_reviews.every((m) => m.admission_outcome === 'RECONCILE_FIRST'));
  assert.ok(rev.unresolved_identity_reviews.every((m) => m.promoted_in_canonical_registry === false));

  assert.equal(rev.doorway_review.object_id, 'gw-doorway-golden-website');
  assert.equal(rev.doorway_review.admission_outcome, 'KEEP_AS_DOORWAY');
  assert.ok(Array.isArray(rev.candidate_admissions));
  assert.equal(rev.candidate_admissions.length, 0);

  const all = [
    rev.doorway_review,
    ...rev.module_reviews,
    ...rev.overlay_reviews,
    ...rev.unresolved_identity_reviews,
    rev.historical_review
  ];
  for (const row of all) {
    assert.ok(OUTCOMES.has(row.admission_outcome), `bad outcome ${row.admission_outcome}`);
  }
  assert.ok(!JSON.stringify(rev).includes('"valuation_usd"'));

  const digest = computeEvidenceReviewDigest(rev);
  assert.equal(rev.golden_portfolio_evidence_review_digest, digest);

  const receipt = fs.readFileSync(
    path.join(ROOT, 'docs/PHASE_Z_GOLDEN_PORTFOLIO_EVIDENCE_REVIEW_0_GREEN_RECEIPT.md'),
    'utf8'
  );
  assert.ok(receipt.includes('GREEN — DECISION SUPPORT ONLY'));
  assert.ok(receipt.includes('Candidate admissions'));

  console.log('z:golden:portfolio:evidence-review:verify PASS');
  console.log('candidate_admissions 0');
  console.log(`golden_portfolio_evidence_review_digest ${digest}`);
}

const isDirect =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirect) main();
