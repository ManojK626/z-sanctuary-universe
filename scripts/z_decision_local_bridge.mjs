#!/usr/bin/env node
/**
 * Local bridge: same argv as `bots/decision/decision_actions.mjs` (panel / operator parity).
 * Usage: npm run decision:bridge -- <decision_id> <action>
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const target = path.join(__dirname, '..', 'bots', 'decision', 'decision_actions.mjs');
const r = spawnSync(process.execPath, [target, ...process.argv.slice(2)], { stdio: 'inherit' });
process.exit(r.status ?? 1);
