#!/usr/bin/env node
/**
 * Read-only validation: Monster Project registry JSON has required structure
 * and every _meta.required_entry_id appears in entries[].id.
 * Does not mutate the registry. Exit 1 on failure. Writes a receipt JSON.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const REG = path.join(ROOT, 'data', 'z_sanctuary_monster_project_registry.json');
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_monster_project_registry_verify.json');

const REP = new Set(['metadata', 'docs', 'ui', 'simulation', 'registry', 'code', 'mixed']);

function main() {
  const generatedAt = new Date().toISOString();
  const errors = [];

  if (!fs.existsSync(REG)) {
    console.error('[z_monster_project_registry_verify] missing', path.relative(ROOT, REG));
    process.exit(1);
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(REG, 'utf8'));
  } catch (e) {
    console.error('[z_monster_project_registry_verify] invalid JSON:', e.message);
    process.exit(1);
  }

  const meta = data._meta;
  if (!meta || typeof meta !== 'object') {
    errors.push('root._meta must be an object');
  }

  const entries = data.entries;
  if (!Array.isArray(entries)) {
    errors.push('root.entries must be an array');
  }

  const ids = new Set();
  if (Array.isArray(entries)) {
    entries.forEach((row, idx) => {
      const prefix = `entries[${idx}]`;
      if (!row || typeof row !== 'object') {
        errors.push(`${prefix}: must be an object`);
        return;
      }
      if (typeof row.id !== 'string' || !row.id.trim()) {
        errors.push(`${prefix}: missing or empty id`);
      } else {
        if (ids.has(row.id)) errors.push(`duplicate id "${row.id}"`);
        ids.add(row.id);
      }
      if (typeof row.label !== 'string' || !row.label.trim()) {
        errors.push(`${prefix} (${row.id || '?'}): missing label`);
      }
      if (typeof row.family !== 'string' || !row.family.trim()) {
        errors.push(`${prefix} (${row.id || '?'}): missing family`);
      }
      if (row.representation !== undefined && !REP.has(row.representation)) {
        errors.push(`${prefix} (${row.id || '?'}): invalid representation "${row.representation}"`);
      }
    });
  }

  const required = meta?.required_entry_ids;
  if (!Array.isArray(required) || required.length === 0) {
    errors.push('_meta.required_entry_ids must be a non-empty array');
  } else if (Array.isArray(entries)) {
    for (const rid of required) {
      if (typeof rid !== 'string' || !rid.trim()) {
        errors.push(`required_entry_ids contains invalid entry: ${JSON.stringify(rid)}`);
      } else if (!ids.has(rid)) {
        errors.push(`required id "${rid}" missing from entries`);
      }
    }
  }

  const bo = data.build_order;
  if (bo !== undefined && !Array.isArray(bo)) {
    errors.push('root.build_order must be an array when present');
  }

  const rings = data.rings_and_spines;
  if (rings !== undefined && !Array.isArray(rings)) {
    errors.push('root.rings_and_spines must be an array when present');
  }

  const pass = errors.length === 0;
  const payload = {
    generated_at: generatedAt,
    registry_path: path.relative(ROOT, REG),
    pass,
    entry_count: Array.isArray(entries) ? entries.length : 0,
    required_count: Array.isArray(required) ? required.length : 0,
    errors,
  };

  try {
    fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
    fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  } catch {
    /* optional report */
  }

  if (!pass) {
    console.error('[z_monster_project_registry_verify] FAIL');
    errors.forEach((e) => console.error(' -', e));
    process.exit(1);
  }

  console.log(
    `[z_monster_project_registry_verify] PASS (${payload.entry_count} entries, ${payload.required_count} required) → ${path.relative(ROOT, OUT_JSON)}`,
  );
}

main();
