#!/usr/bin/env node
/**
 * Validates data/z_sovereign_products_registry.json — required fields and enums only.
 * Read-only check; does not mutate registry. Exit 1 on validation failure.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const REG = path.join(ROOT, 'data', 'z_sovereign_products_registry.json');
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_product_registry_verify.json');

const PRODUCT_TYPES = new Set(['physical', 'digital', 'service', 'hybrid']);
const STATUSES = new Set(['concept', 'mock', 'prototype', 'review', 'hold', 'ready']);
const RISKS = new Set(['low', 'medium', 'high']);
const TRUST = new Set([
  'mock',
  'internal-reviewed',
  'prototype-tested',
  'certification-pending',
  'third-party-certified',
]);

const REQUIRED = [
  'product_id',
  'name',
  'category',
  'project_origin',
  'product_type',
  'status',
  'public_summary',
  'internal_risk_level',
  'industry_category',
  'linked_modules',
  'trust_status',
  'next_action',
  'related_docs',
  'related_receipts',
];

function main() {
  const generatedAt = new Date().toISOString();
  const errors = [];

  if (!fs.existsSync(REG)) {
    console.error('[z_product_registry_verify] missing', path.relative(ROOT, REG));
    process.exit(1);
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(REG, 'utf8'));
  } catch (e) {
    console.error('[z_product_registry_verify] invalid JSON:', e.message);
    process.exit(1);
  }

  const products = data.products;
  if (!Array.isArray(products)) {
    errors.push('root.products must be an array');
  } else {
    products.forEach((p, idx) => {
      const prefix = `products[${idx}] (${p?.product_id || '?'})`;
      for (const k of REQUIRED) {
        if (p[k] === undefined || p[k] === null) {
          errors.push(`${prefix}: missing required field "${k}"`);
        }
      }
      if (p.linked_modules !== undefined && !Array.isArray(p.linked_modules)) {
        errors.push(`${prefix}: linked_modules must be an array`);
      }
      if (p.related_docs !== undefined && !Array.isArray(p.related_docs)) {
        errors.push(`${prefix}: related_docs must be an array`);
      }
      if (p.related_receipts !== undefined && !Array.isArray(p.related_receipts)) {
        errors.push(`${prefix}: related_receipts must be an array`);
      }
      if (p.product_type && !PRODUCT_TYPES.has(p.product_type)) {
        errors.push(`${prefix}: invalid product_type "${p.product_type}"`);
      }
      if (p.status && !STATUSES.has(p.status)) {
        errors.push(`${prefix}: invalid status "${p.status}"`);
      }
      if (p.internal_risk_level && !RISKS.has(p.internal_risk_level)) {
        errors.push(`${prefix}: invalid internal_risk_level "${p.internal_risk_level}"`);
      }
      if (p.trust_status && !TRUST.has(p.trust_status)) {
        errors.push(`${prefix}: invalid trust_status "${p.trust_status}"`);
      }
    });
  }

  const pass = errors.length === 0;
  const payload = {
    generated_at: generatedAt,
    registry_path: path.relative(ROOT, REG),
    pass,
    product_count: Array.isArray(products) ? products.length : 0,
    errors,
  };

  try {
    fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
    fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  } catch {
    /* optional report */
  }

  if (!pass) {
    console.error('[z_product_registry_verify] FAIL');
    errors.forEach((e) => console.error(' -', e));
    process.exit(1);
  }

  console.log(
    `[z_product_registry_verify] PASS (${payload.product_count} product(s)) → ${path.relative(ROOT, OUT_JSON)}`,
  );
}

main();
