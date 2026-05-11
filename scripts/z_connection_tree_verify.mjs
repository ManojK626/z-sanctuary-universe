#!/usr/bin/env node
/**
 * Z-Connection Tree Lite — validate mock JSON (no network, no writes).
 * Ensures consent-first markers, visibility enum, and forbidden location/rank fields absent.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const MOCK = path.join(ROOT, 'data', 'z_connection_tree_lite_mock.json');

const VIS = new Set(['public_alias', 'hidden', 'private']);
const FORBIDDEN_KEY_FRAGMENTS = [
  'latitude',
  'longitude',
  'geolocation',
  'gps',
  'exact_address',
  'street_address',
  'lat_lng',
];
const FORBIDDEN_RANK_FRAGMENTS = ['leaderboard', 'scoreboard', 'recruit', 'rank_order', 'ranking_tier'];

function collectKeys(obj, prefix, out) {
  if (obj == null) return;
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => collectKeys(item, `${prefix}[${i}]`, out));
    return;
  }
  if (typeof obj === 'object') {
    for (const k of Object.keys(obj)) {
      out.push({ path: `${prefix}.${k}`, key: k });
      collectKeys(obj[k], `${prefix}.${k}`, out);
    }
  }
}

function keyForbidden(key) {
  const lower = String(key).toLowerCase();
  for (const f of FORBIDDEN_KEY_FRAGMENTS) {
    if (lower.includes(f)) return `location-like key fragment: ${f}`;
  }
  for (const f of FORBIDDEN_RANK_FRAGMENTS) {
    if (lower.includes(f)) return `ranking/recruit-like key fragment: ${f}`;
  }
  return null;
}

function main() {
  const errors = [];
  if (!fs.existsSync(MOCK)) {
    errors.push(`missing ${path.relative(ROOT, MOCK)}`);
    console.error(errors.join('\n'));
    process.exit(1);
  }
  let data;
  try {
    data = JSON.parse(fs.readFileSync(MOCK, 'utf8'));
  } catch (e) {
    errors.push(`invalid JSON: ${e.message}`);
    console.error(errors.join('\n'));
    process.exit(1);
  }

  if (data.content_class !== 'mock_demo_only') {
    errors.push(`content_class must be "mock_demo_only", got ${JSON.stringify(data.content_class)}`);
  }
  if (data.privacy_mode !== 'consent_first') {
    errors.push(`privacy_mode must be "consent_first", got ${JSON.stringify(data.privacy_mode)}`);
  }
  if (!Array.isArray(data.nodes)) {
    errors.push('nodes must be an array');
  }
  if (typeof data.next_action !== 'string' || !data.next_action.trim()) {
    errors.push('next_action must be a non-empty string');
  }
  const ethics = data.ethics;
  if (!ethics || typeof ethics !== 'object') {
    errors.push('ethics must be an object');
  } else {
    const need = ['opt-in-only', 'anonymized-public-nodes', 'no-rank-pressure', 'delete-or-hide-anytime'];
    for (const k of need) {
      if (!(k in ethics)) errors.push(`ethics missing key: ${k}`);
    }
  }

  const keyRows = [];
  collectKeys(data, '$', keyRows);
  for (const { path: p, key } of keyRows) {
    const bad = keyForbidden(key);
    if (bad) errors.push(`${p}: forbidden (${bad})`);
  }

  if (Array.isArray(data.nodes)) {
    const required = [
      'node_id',
      'display_name',
      'avatar_symbol',
      'join_era',
      'region_label',
      'visibility',
      'invited_by_node_id',
      'branches_created_count',
      'contribution_note',
    ];
    data.nodes.forEach((node, i) => {
      if (!node || typeof node !== 'object') {
        errors.push(`nodes[${i}] must be an object`);
        return;
      }
      for (const f of required) {
        if (!(f in node)) errors.push(`nodes[${i}] missing field: ${f}`);
      }
      if (node.visibility != null && !VIS.has(node.visibility)) {
        errors.push(`nodes[${i}].visibility invalid: ${JSON.stringify(node.visibility)}`);
      }
      if (typeof node.branches_created_count !== 'number' || node.branches_created_count < 0) {
        errors.push(`nodes[${i}].branches_created_count must be a non-negative number`);
      }
    });
  }

  if (errors.length) {
    console.error('Z-Connection Tree Lite verify FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
    process.exit(1);
  }
  console.log(`OK: ${path.relative(ROOT, MOCK)} passes z_connection_tree_verify checks.`);
}

main();
