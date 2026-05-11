#!/usr/bin/env node
/**
 * ZUNO-A1 — Read-only ingestion: canonical MD snapshot → structured JSON.
 * No network, no mutations beyond writing the derived JSON artifact.
 *
 * Source: docs/z_zuno_technology_snapshot.md
 * Output: data/zuno_state_snapshot.json
 *
 * Run: npm run zuno:snapshot
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SNAPSHOT_MD = path.join(ROOT, 'docs', 'z_zuno_technology_snapshot.md');
const OUTPUT_JSON = path.join(ROOT, 'data', 'zuno_state_snapshot.json');

/** @param {string} s */
function stripTicks(s) {
  const t = s.trim();
  if (t.startsWith('`') && t.endsWith('`')) return t.slice(1, -1);
  return t;
}

/**
 * Parse GitHub-style pipe tables; returns array of row objects { col0: col1 } for 2-column tables.
 * @param {string} block
 */
function parseTwoColumnTables(block) {
  const lines = block.split(/\r?\n/);
  /** @type {Record<string, string>} */
  const merged = {};
  for (const line of lines) {
    if (!line.trim().startsWith('|')) continue;
    const cells = line
      .split('|')
      .map((c) => c.trim())
      .filter(Boolean);
    if (cells.length < 2) continue;
    if (/^[-:]+$/.test(cells[0]) || /^[-:]+$/.test(cells[1])) continue;
    const key = stripTicks(cells[0]);
    const val = stripTicks(cells[1]);
    if (!key || !val) continue;
    if (/^field$/i.test(key) || /^area$/i.test(key)) continue;
    merged[key] = val;
  }
  return merged;
}

/**
 * Split snapshot into numbered ## sections (## N. Title).
 * @param {string} md
 */
function extractNumberedSections(md) {
  /** @type {Record<string, string>} */
  const sections = {};
  const lines = md.split(/\r?\n/);
  let currentNum = null;
  /** @type {string[]} */
  let buf = [];

  function trimSectionBody(text) {
    return text.replace(/(\n*---\s*)+$/, '').trim();
  }

  function flush() {
    if (currentNum !== null) {
      sections[currentNum] = trimSectionBody(buf.join('\n'));
    }
    buf = [];
  }

  for (const line of lines) {
    const num = line.match(/^## (\d+)\.\s+.+$/);
    const otherH2 = line.match(/^## (?!(\d+)\.\s)/);

    if (num) {
      flush();
      currentNum = num[1];
    } else if (otherH2 && line.startsWith('## ')) {
      flush();
      currentNum = null;
    } else if (currentNum !== null) {
      buf.push(line);
    }
  }
  flush();
  return sections;
}

/**
 * Embed Monster Project registry checksum at ingest time so truth-layer alignment
 * can detect registry edits without re-running snapshot (read-only drift signal).
 * @param {string} root
 */
function buildTruthAlignmentRef(root) {
  const regPath = path.join(root, 'data', 'z_sanctuary_monster_project_registry.json');
  if (!fs.existsSync(regPath)) {
    return { present: false, reason: 'monster_registry_missing' };
  }
  try {
    const reg = JSON.parse(fs.readFileSync(regPath, 'utf8'));
    const ids = [...(reg._meta?.required_entry_ids || [])].filter((x) => typeof x === 'string' && x.trim()).sort();
    if (!ids.length) {
      return { present: false, reason: 'required_entry_ids_empty' };
    }
    const sha = crypto.createHash('sha256').update(JSON.stringify(ids)).digest('hex');
    return {
      present: true,
      monster_registry_relative: 'data/z_sanctuary_monster_project_registry.json',
      monster_required_count: ids.length,
      monster_required_ids_sha256: sha,
    };
  } catch {
    return { present: false, reason: 'monster_registry_invalid_json' };
  }
}

function main() {
  if (!fs.existsSync(SNAPSHOT_MD)) {
    console.error(`Snapshot not found: ${path.relative(ROOT, SNAPSHOT_MD)}`);
    process.exit(1);
  }

  const md = fs.readFileSync(SNAPSHOT_MD, 'utf8');
  const sections = extractNumberedSections(md);

  const identityBlock = sections['0'] || '';
  const hubBlock = sections['2'] || '';

  const identity = parseTwoColumnTables(identityBlock);
  const hub_gates = parseTwoColumnTables(hubBlock);

  const result = {
    schema: 'zuno_state_snapshot_v1',
    generated_at: new Date().toISOString(),
    source_file: path.relative(ROOT, SNAPSHOT_MD).replace(/\\/g, '/'),
    identity,
    hub_gates,
    executive_summary: sections['1'] || null,
    magical_canvas: sections['3'] || null,
    z_questra: sections['4'] || null,
    z_sme: sections['5'] || null,
    verification_rhythm: sections['6'] || null,
    explicit_non_claims: sections['7'] || null,
    suggested_next_lanes: sections['8'] || null,
    inference_hints: sections['9'] || null,
    core_system_truth: sections['10'] || null,
    truth_alignment_ref: buildTruthAlignmentRef(ROOT),
  };

  fs.mkdirSync(path.dirname(OUTPUT_JSON), { recursive: true });
  fs.writeFileSync(OUTPUT_JSON, `${JSON.stringify(result, null, 2)}\n`, 'utf8');

  console.log(
    JSON.stringify(
      {
        ok: true,
        out: path.relative(ROOT, OUTPUT_JSON).replace(/\\/g, '/'),
        snapshot_id: identity['Snapshot ID'] || null,
      },
      null,
      2,
    ),
  );
}

main();
