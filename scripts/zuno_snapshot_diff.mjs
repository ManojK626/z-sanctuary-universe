#!/usr/bin/env node
/**
 * ZUNO-A2 — Read-only diff: current vs baseline snapshot JSON.
 * Writes data/reports/zuno_snapshot_diff.{json,md}. No auto-fix, no phase advancement.
 * Exit 0 when baseline missing or diff OK; exit 1 only on invalid/missing current JSON.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const CURRENT = path.join(ROOT, 'data', 'zuno_state_snapshot.json');
const BASELINE = path.join(ROOT, 'data', 'zuno_state_snapshot.baseline.json');
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'zuno_snapshot_diff.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'zuno_snapshot_diff.md');

const SCHEMA = 'zuno_snapshot_diff_v1';

/** @type {Set<string>} */
const POSTURE_IDENTITY_KEYS = new Set(['Posture', 'Autonomy level']);

/** @type {Set<string>} */
const NON_CLAIM_TOP_KEYS = new Set([
  'executive_summary',
  'explicit_non_claims',
  'inference_hints',
  'core_system_truth',
]);

/**
 * @param {string} pathStr
 * @param {string} [leaf]
 */
function classifyDelta(pathStr, leaf) {
  if (pathStr.startsWith('identity.') && leaf && POSTURE_IDENTITY_KEYS.has(leaf)) {
    return 'posture_changed';
  }
  const top = pathStr.split('.')[0];
  if (NON_CLAIM_TOP_KEYS.has(top)) return 'non_claim_changed';
  return 'changed';
}

/**
 * @param {Record<string, unknown>} before
 * @param {Record<string, unknown>} after
 * @param {string} prefix
 * @returns {{ type: string, path: string, before: unknown, after: unknown }[]}
 */
function diffFlatObjects(before, after, prefix) {
  const items = [];
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  for (const k of keys) {
    const p = `${prefix}.${k}`;
    const hasB = Object.prototype.hasOwnProperty.call(before, k);
    const hasA = Object.prototype.hasOwnProperty.call(after, k);
    if (hasB && !hasA) {
      items.push({ type: 'removed', path: p, before: before[k], after: null });
    } else if (!hasB && hasA) {
      items.push({ type: 'added', path: p, before: null, after: after[k] });
    } else if (hasB && hasA && before[k] !== after[k]) {
      const leaf = prefix === 'identity' ? k : undefined;
      items.push({
        type: classifyDelta(p, leaf),
        path: p,
        before: before[k],
        after: after[k],
      });
    }
  }
  return items;
}

/**
 * @param {Record<string, unknown>} baseline
 * @param {Record<string, unknown>} current
 * @returns {{ type: string, path: string, before: unknown, after: unknown }[]}
 */
function diffSnapshots(baseline, current) {
  const items = [];

  const ignoreCompare = new Set(['schema']);

  const topKeys = new Set([...Object.keys(baseline), ...Object.keys(current)]);
  for (const k of topKeys) {
    if (ignoreCompare.has(k)) continue;
    const hasB = Object.prototype.hasOwnProperty.call(baseline, k);
    const hasA = Object.prototype.hasOwnProperty.call(current, k);
    if ((k === 'identity' || k === 'hub_gates') && hasB && hasA) {
      const bObj = baseline[k];
      const aObj = current[k];
      if (
        bObj &&
        aObj &&
        typeof bObj === 'object' &&
        !Array.isArray(bObj) &&
        typeof aObj === 'object' &&
        !Array.isArray(aObj)
      ) {
        items.push(...diffFlatObjects(/** @type {Record<string, unknown>} */ (bObj), /** @type {Record<string, unknown>} */ (aObj), k));
        continue;
      }
    }

    if (hasB && !hasA) {
      items.push({ type: 'removed', path: k, before: baseline[k], after: null });
    } else if (!hasB && hasA) {
      items.push({ type: 'added', path: k, before: null, after: current[k] });
    } else if (hasB && hasA) {
      if (baseline[k] === current[k]) continue;
      if (k === 'generated_at' || k === 'source_file') {
        items.push({ type: 'changed', path: k, before: baseline[k], after: current[k] });
        continue;
      }
      if (typeof baseline[k] === 'string' && typeof current[k] === 'string') {
        items.push({
          type: NON_CLAIM_TOP_KEYS.has(k) ? 'non_claim_changed' : 'changed',
          path: k,
          before: baseline[k],
          after: current[k],
        });
      } else {
        items.push({ type: 'changed', path: k, before: baseline[k], after: current[k] });
      }
    }
  }

  return items;
}

function summarize(items) {
  const s = {
    added: 0,
    removed: 0,
    changed: 0,
    non_claim_changed: 0,
    posture_changed: 0,
  };
  for (const it of items) {
    if (it.type in s) s[it.type] += 1;
  }
  return s;
}

function truncate(s, n = 200) {
  const t = typeof s === 'string' ? s : JSON.stringify(s);
  if (t.length <= n) return t;
  return `${t.slice(0, n)}…`;
}

/** @param {Record<string, unknown>} payload */
function writeMarkdown(payload) {
  const lines = [
    '# Zuno snapshot diff',
    '',
    `**Generated:** ${payload.generated_at}`,
    '',
    `| Field | Value |`,
    `| ---- | ---- |`,
    `| Status | ${payload.status} |`,
    `| Baseline | ${payload.baseline_path || '—'} |`,
    `| Current | ${payload.current_path} |`,
    '',
    '## Summary',
    '',
    `| Type | Count |`,
    `| ---- | ----: |`,
  ];
  for (const [k, v] of Object.entries(payload.summary)) {
    lines.push(`| ${k} | ${v} |`);
  }
  lines.push('', '## Deltas', '');
  if (!payload.items.length) {
    lines.push('_No structural deltas._', '');
  } else {
    lines.push('| Type | Path | Before (truncated) | After (truncated) |');
    lines.push('| ---- | ---- | ---- | ---- |');
    for (const it of payload.items) {
      lines.push(
        `| ${it.type} | ${String(it.path).replace(/\|/g, '\\|')} | ${truncate(it.before).replace(/\|/g, '\\|')} | ${truncate(it.after).replace(/\|/g, '\\|')} |`,
      );
    }
    lines.push('');
  }
  lines.push('---', '', '*Read-only report — no auto-fix or phase advancement.*', '');
  return lines.join('\n');
}

function main() {
  if (!fs.existsSync(CURRENT)) {
    console.error('Missing data/zuno_state_snapshot.json — run npm run zuno:snapshot first.');
    process.exit(1);
  }

  let current;
  try {
    current = JSON.parse(fs.readFileSync(CURRENT, 'utf8'));
  } catch (e) {
    console.error('Invalid current snapshot JSON:', e instanceof Error ? e.message : e);
    process.exit(1);
  }

  if (!fs.existsSync(BASELINE)) {
    const payload = {
      schema: SCHEMA,
      generated_at: new Date().toISOString(),
      status: 'no_baseline',
      baseline_path: null,
      current_path: path.relative(ROOT, CURRENT).replace(/\\/g, '/'),
      summary: { added: 0, removed: 0, changed: 0, non_claim_changed: 0, posture_changed: 0 },
      items: [],
      note: 'Run npm run zuno:snapshot:baseline after zuno:snapshot to seed a baseline, then re-run this diff.',
    };
    fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
    fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
    fs.writeFileSync(
      OUT_MD,
      writeMarkdown({
        ...payload,
        baseline_path: '(none)',
      }),
      'utf8',
    );
    console.log(JSON.stringify({ ok: true, status: 'no_baseline', out_json: OUT_JSON, out_md: OUT_MD }, null, 2));
    process.exit(0);
    return;
  }

  let baseline;
  try {
    baseline = JSON.parse(fs.readFileSync(BASELINE, 'utf8'));
  } catch (e) {
    console.error('Invalid baseline snapshot JSON:', e instanceof Error ? e.message : e);
    process.exit(1);
  }

  const items = diffSnapshots(baseline, current);
  const summary = summarize(items);

  const payload = {
    schema: SCHEMA,
    generated_at: new Date().toISOString(),
    status: 'ok',
    baseline_path: path.relative(ROOT, BASELINE).replace(/\\/g, '/'),
    current_path: path.relative(ROOT, CURRENT).replace(/\\/g, '/'),
    summary,
    items,
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  fs.writeFileSync(OUT_MD, writeMarkdown(payload), 'utf8');

  console.log(JSON.stringify({ ok: true, status: 'ok', summary, out_json: OUT_JSON, out_md: OUT_MD }, null, 2));
  process.exit(0);
}

main();
