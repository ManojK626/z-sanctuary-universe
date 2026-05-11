#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const CREATOR_LOG = path.join(ROOT, 'data', 'logs', 'z_ai_task_accomplishments.jsonl');
const BUSINESS_LOG = path.join(ROOT, 'data', 'logs', 'z_ai_task_accomplishments_business.jsonl');
const OUTPUT = path.join(ROOT, 'data', 'reports', 'z_ai_signal_health.json');
const WINDOW_DAYS = 7;

const now = new Date();
const cutoff = new Date(now.getTime() - WINDOW_DAYS * 24 * 60 * 60 * 1000);

function readJsonLinesSafe(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, 'utf8');
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function entryTime(entry) {
  const t = entry?.ts ?? entry?.timestamp ?? entry?.generated_at ?? null;
  if (!t) return null;
  const d = new Date(t);
  return Number.isNaN(d.getTime()) ? null : d;
}

function countRecent(entries) {
  return entries.filter((entry) => {
    const t = entryTime(entry);
    return t && t >= cutoff;
  }).length;
}

function newestEntryIso(entries) {
  let max = null;
  for (const entry of entries) {
    const t = entryTime(entry);
    if (!t) continue;
    if (!max || t > max) max = t;
  }
  return max ? max.toISOString() : null;
}

const creatorAll = readJsonLinesSafe(CREATOR_LOG);
const businessAll = readJsonLinesSafe(BUSINESS_LOG);
const creatorEntries = countRecent(creatorAll);
const businessEntries = countRecent(businessAll);
const totalEntries = creatorEntries + businessEntries;
const lastEntryAt = newestEntryIso([...creatorAll, ...businessAll]);

let signalHealth = 'low';
let trend = 'insufficient';

if (totalEntries >= 7) {
  signalHealth = 'strong';
  trend = 'active';
} else if (totalEntries >= 3) {
  signalHealth = 'balanced';
  trend = 'stable';
}

let note = '';
if (signalHealth === 'low') {
  note = 'Low activity signal — system may appear stable but lacks real-world input.';
} else if (signalHealth === 'balanced') {
  note = 'Moderate activity — system evolving steadily.';
} else {
  note = 'Strong activity — system is actively evolving with real input.';
}

const output = {
  generated_at: now.toISOString(),
  window_days: WINDOW_DAYS,
  creator_entries: creatorEntries,
  business_entries: businessEntries,
  total_entries: totalEntries,
  last_entry_at: lastEntryAt,
  signal_health: signalHealth,
  trend,
  note,
};

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');

console.log('✅ Z-AI Signal Health generated');
console.log(`Output: ${OUTPUT}`);
