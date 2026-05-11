#!/usr/bin/env node
/**
 * Append validated events to data/logs/z_ai_learning_log.jsonl
 * Advisory data entry helper for STIL/EML.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const LOG = path.join(ROOT, 'data', 'logs', 'z_ai_learning_log.jsonl');

function usage() {
  console.log(`Usage:
  node scripts/z_learning_log_append.mjs --event-json '{"timestamp":"...","strategy":"increase_signal","successful":true}'
  node scripts/z_learning_log_append.mjs --event-file data/tmp/event.json
  node scripts/z_learning_log_append.mjs --event-json '{...}' --dry-run

Required fields:
  - timestamp (ISO string)
  - successful (boolean)
One of:
  - strategy (string)
  - domain (string)
`);
}

function parseArgs(argv) {
  const out = { eventJson: null, eventFile: null, dryRun: false, help: false };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--event-json') out.eventJson = argv[++i] ?? null;
    else if (a === '--event-file') out.eventFile = argv[++i] ?? null;
    else if (a === '--dry-run') out.dryRun = true;
    else if (a === '--help' || a === '-h') out.help = true;
  }
  return out;
}

function readInput(args) {
  if (args.eventJson) return JSON.parse(args.eventJson);
  if (args.eventFile) {
    const p = path.resolve(ROOT, args.eventFile);
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  }
  throw new Error('Missing input. Use --event-json or --event-file.');
}

function validateEvent(event) {
  const issues = [];
  const ts = new Date(event?.timestamp);
  if (!event || typeof event !== 'object') issues.push('event must be an object');
  if (!event?.timestamp || Number.isNaN(ts.getTime())) issues.push('timestamp must be a valid ISO date');
  if (typeof event?.successful !== 'boolean') issues.push('successful must be boolean');
  if (!String(event?.strategy || '').trim() && !String(event?.domain || '').trim()) {
    issues.push('either strategy or domain is required');
  }
  if (event?.impact_score !== undefined && !Number.isFinite(Number(event.impact_score))) {
    issues.push('impact_score must be numeric when provided');
  }
  return issues;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    usage();
    return;
  }
  let event;
  try {
    event = readInput(args);
  } catch (error) {
    console.error(`❌ Input error: ${error?.message || String(error)}`);
    usage();
    process.exit(1);
  }

  const issues = validateEvent(event);
  if (issues.length > 0) {
    console.error('❌ Validation failed:');
    for (const i of issues) console.error(`- ${i}`);
    process.exit(1);
  }

  const normalized = {
    ...event,
    timestamp: new Date(event.timestamp).toISOString(),
    impact_score: event.impact_score === undefined ? undefined : Number(event.impact_score),
  };
  if (normalized.impact_score === undefined) delete normalized.impact_score;

  const line = `${JSON.stringify(normalized)}\n`;
  if (args.dryRun) {
    console.log(`✅ Valid event (dry-run): ${line.trim()}`);
    return;
  }

  fs.mkdirSync(path.dirname(LOG), { recursive: true });
  fs.appendFileSync(LOG, line, 'utf8');
  console.log(`✅ Appended learning event to ${LOG}`);
}

main();
