#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const REPORTS = path.join(ROOT, 'data', 'reports');
const CURRENT_PATH = path.join(REPORTS, 'z_ai_ecosphere_ledger.json');
const PREV_PATH = path.join(REPORTS, 'z_ai_ecosphere_ledger.prev.json');
const OUTPUT = path.join(REPORTS, 'z_ai_ecosphere_delta.json');

function readJsonSafe(file) {
  try {
    if (!fs.existsSync(file)) return null;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
}

function ringMap(ledger) {
  const out = {};
  const rings = Array.isArray(ledger?.rings) ? ledger.rings : [];
  for (const r of rings) {
    out[String(r.id || r.ring_title || 'unknown')] = Number(r.sync_score || 0);
  }
  return out;
}

function computeDelta(current, previous) {
  if (!current) {
    return { first_run: false, message: 'Current ecosphere ledger missing.' };
  }
  if (!previous) {
    return {
      first_run: true,
      message: 'No previous snapshot available.',
      overall_change: 0,
      rings: {},
      new_tasks: 0,
    };
  }

  const currentOverall = Number(current?.overall?.sync_score || 0);
  const previousOverall = Number(previous?.overall?.sync_score || 0);
  const currentTasks = Number(current?.task_accomplishments?.total_entries || 0);
  const previousTasks = Number(previous?.task_accomplishments?.total_entries || 0);

  const currRings = ringMap(current);
  const prevRings = ringMap(previous);
  const allKeys = [...new Set([...Object.keys(currRings), ...Object.keys(prevRings)])];

  const rings = {};
  for (const key of allKeys) {
    const curr = Number(currRings[key] || 0);
    const prev = Number(prevRings[key] || 0);
    rings[key] = {
      change: curr - prev,
      current: curr,
      previous: prev,
    };
  }

  return {
    first_run: false,
    overall_change: currentOverall - previousOverall,
    rings,
    new_tasks: currentTasks - previousTasks,
  };
}

const current = readJsonSafe(CURRENT_PATH);
const previous = readJsonSafe(PREV_PATH);
const delta = computeDelta(current, previous);

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(
  OUTPUT,
  `${JSON.stringify({ generated_at: new Date().toISOString(), delta }, null, 2)}\n`,
  'utf8'
);

if (current) {
  fs.writeFileSync(PREV_PATH, `${JSON.stringify(current, null, 2)}\n`, 'utf8');
}

console.log(`✅ Z AI ecosphere delta: ${OUTPUT}`);
