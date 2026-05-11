#!/usr/bin/env node
/**
 * Merge creator + business AI task JSONL logs → UTF-8 CSV (Excel-friendly BOM).
 * Output: data/reports/z_ai_task_accomplishments.csv
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const CREATOR = path.join(ROOT, 'data', 'logs', 'z_ai_task_accomplishments.jsonl');
const BUSINESS = path.join(ROOT, 'data', 'logs', 'z_ai_task_accomplishments_business.jsonl');
const OUT = path.join(ROOT, 'data', 'reports', 'z_ai_task_accomplishments.csv');

function readLines(abs) {
  if (!fs.existsSync(abs)) return [];
  return fs
    .readFileSync(abs, 'utf8')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

function parseRow(line, namespace) {
  try {
    const o = JSON.parse(line);
    if (!o.task && typeof o.rating_pct !== 'number') return null;
    return {
      namespace: o.namespace || namespace,
      ts: o.ts || o.timestamp || '',
      actor_class: o.actor_class ?? '',
      actor_id: o.actor_id ?? '',
      task: o.task ?? '',
      rating_pct: o.rating_pct ?? '',
      potential_note: o.potential_note ?? '',
      drp_ok: o.drp_ok === true ? 'true' : o.drp_ok === false ? 'false' : '',
    };
  } catch {
    return null;
  }
}

function csvEscape(val) {
  const s = String(val ?? '');
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function main() {
  const rows = [];
  for (const line of readLines(CREATOR)) {
    const r = parseRow(line, 'creator');
    if (r) rows.push(r);
  }
  for (const line of readLines(BUSINESS)) {
    const r = parseRow(line, 'business');
    if (r) rows.push(r);
  }

  const header = [
    'namespace',
    'ts',
    'actor_class',
    'actor_id',
    'task',
    'rating_pct',
    'potential_note',
    'drp_ok',
  ];
  const lines = [header.join(',')];
  for (const r of rows) {
    lines.push(
      [
        csvEscape(r.namespace),
        csvEscape(r.ts),
        csvEscape(r.actor_class),
        csvEscape(r.actor_id),
        csvEscape(r.task),
        csvEscape(r.rating_pct),
        csvEscape(r.potential_note),
        csvEscape(r.drp_ok),
      ].join(',')
    );
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  const body = lines.join('\r\n');
  fs.writeFileSync(OUT, `\uFEFF${body}\r\n`, 'utf8');
  console.log(`✅ AI task log CSV: ${OUT} (${rows.length} row(s))`);
}

main();
