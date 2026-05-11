#!/usr/bin/env node
/**
 * Generates a learning-event JSON template for STIL/EML logging.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());

function parseArgs(argv) {
  const out = {
    outFile: null,
    strategy: 'increase_signal',
    domain: 'signal',
    success: true,
    impact: 10,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--out') out.outFile = argv[++i] ?? null;
    else if (a === '--strategy') out.strategy = argv[++i] ?? out.strategy;
    else if (a === '--domain') out.domain = argv[++i] ?? out.domain;
    else if (a === '--success') out.success = String(argv[++i]).toLowerCase() === 'true';
    else if (a === '--impact') out.impact = Number(argv[++i]);
  }
  return out;
}

function makeTemplate(args) {
  const now = new Date().toISOString();
  return {
    timestamp: now,
    strategy: args.strategy,
    domain: args.domain,
    source: 'manual',
    action_taken: 'Describe the actual action taken',
    successful: Boolean(args.success),
    impact_score: Number.isFinite(args.impact) ? args.impact : 0,
    before: {
      coherence_score: 53,
      signal_health: 'low',
      flow_status: 'degraded',
    },
    after: {
      coherence_score: 68,
      signal_health: 'medium',
      flow_status: 'healthy',
    },
    notes: 'Optional context: why this worked or failed',
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const payload = makeTemplate(args);
  const asJson = `${JSON.stringify(payload, null, 2)}\n`;

  if (!args.outFile) {
    process.stdout.write(asJson);
    return;
  }

  const outPath = path.resolve(ROOT, args.outFile);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, asJson, 'utf8');
  console.log(`✅ Learning template written: ${outPath}`);
}

main();
