#!/usr/bin/env node
/**
 * Z-Whale Bus Comms Runner
 * Deck orchestrator for comms_sync and surface_reinforce, with optional Zuno refresh.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'data', 'reports');
const OUT_JSON = path.join(REPORTS, 'z_whale_bus_run.json');

const argv = process.argv.slice(2);
const deckArg = argv.find((x) => x.startsWith('--decks='));
const deckListRaw = deckArg ? deckArg.split('=')[1] : 'comms_sync';
const decks = deckListRaw
  .split(',')
  .map((x) => x.trim())
  .filter(Boolean);
const withZuno = argv.includes('--zuno');

function npmCommand() {
  return 'npm';
}

function run(label, command, args, softFail = false) {
  const printable = `${command} ${args.join(' ')}`.trim();
  console.log(`\n[WHALE-BUS] ${label}`);
  console.log(`[WHALE-BUS] > ${printable}`);
  const res = spawnSync(command, args, { cwd: ROOT, stdio: 'inherit', shell: true });
  const code = res.status ?? 1;
  const ok = code === 0 || softFail;
  return { label, command: printable, exit_code: code, ok, soft_fail: softFail };
}

function commsSyncSteps() {
  const npm = npmCommand();
  return [
    ['GitHub AI comms sync', npm, ['run', 'comms:github-ai'], false],
    ['Cloudflare AI comms sync', npm, ['run', 'comms:cloudflare-ai'], false],
    ['AI communication health', npm, ['run', 'ai:communication:health'], false],
    ['Ecosystem commflow verify', npm, ['run', 'ecosystem:commflow:verify'], true],
    ['AI ecosphere ledger refresh', npm, ['run', 'ai:ecosphere:ledger'], false],
    ['Formula sync check', npm, ['run', 'ai:formula:sync'], false],
  ];
}

function surfaceReinforceSteps() {
  const npm = npmCommand();
  return [
    ['SSWS shadow verify', npm, ['run', 'ssws:shadow-verify'], false],
    ['AI system health', npm, ['run', 'ai:system:health'], false],
    ['SPI structural pattern intelligence', npm, ['run', 'spi:analyze'], false],
    ['SPI decision advisor', npm, ['run', 'spi:advice'], false],
    ['Adaptive learning cycle', npm, ['run', 'learning:cycle'], false],
    ['QOSMEI core signal fusion', npm, ['run', 'qosmei:signal'], false],
    ['Cross-system synthesizer', npm, ['run', 'cross:system'], false],
    ['Predictive intelligence (Phase 5)', npm, ['run', 'predictive:intel'], false],
    ['Prediction validation (Phase 5.5)', npm, ['run', 'prediction:validate'], false],
    ['QOSMEI core signal fusion (post-predictive)', npm, ['run', 'qosmei:signal'], false],
    ['AI status writer', 'node', ['scripts/z_ai_status_writer.js'], false],
    ['Dashboard registry verify', npm, ['run', 'dashboard:registry-verify'], false],
  ];
}

function main() {
  const started = new Date().toISOString();
  const plan = [];
  if (decks.includes('comms_sync')) plan.push(...commsSyncSteps());
  if (decks.includes('surface_reinforce')) plan.push(...surfaceReinforceSteps());
  if (withZuno) plan.push(['Zuno state refresh', npmCommand(), ['run', 'zuno:state'], false]);

  if (plan.length === 0) {
    console.error('[WHALE-BUS] No valid decks provided. Use --decks=comms_sync,surface_reinforce');
    process.exit(1);
  }

  const steps = [];
  for (const [label, cmd, args, softFail] of plan) {
    const result = run(label, cmd, args, softFail);
    steps.push(result);
    if (!result.ok) {
      break;
    }
  }

  const failed = steps.find((s) => !s.ok);
  const payload = {
    generated_at: new Date().toISOString(),
    started_at: started,
    decks,
    with_zuno: withZuno,
    status: failed ? 'red' : 'green',
    steps,
  };
  fs.mkdirSync(REPORTS, { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  console.log(`\n[WHALE-BUS] Report: ${OUT_JSON} status=${payload.status}`);
  if (failed) process.exit(1);
}

main();
