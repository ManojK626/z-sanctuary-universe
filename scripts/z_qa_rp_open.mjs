#!/usr/bin/env node
/**
 * Print Z-Q&A&RP dashboard URL (and optionally open browser).
 * Usage: node scripts/z_qa_rp_open.mjs [--open]
 * Env: Z_MDGEV_BASE (default http://127.0.0.1:3000) — same as Z-MDGEV; match your static server root.
 */
import path from 'node:path';
import { spawn } from 'node:child_process';

const ROOT = path.resolve(process.cwd());
const relWeb = '/dashboard/z-qa-rp/index.html';
const filePath = path.join(ROOT, 'dashboard', 'z-qa-rp', 'index.html');

const base = (process.env.Z_MDGEV_BASE || 'http://127.0.0.1:3000').replace(/\/+$/, '');
const url = `${base}${relWeb}`;

console.log('');
console.log('Z-Q&A&RP · Pathways & DRP');
console.log('  File:     ', filePath);
console.log('  Registry: ', path.join(ROOT, 'data', 'z_qa_rp_registry.json'));
console.log('  Serve:    npx serve .  (from hub root, any port)');
console.log('  URL:      ', url);
console.log('  Override: set Z_MDGEV_BASE=http://127.0.0.1:PORT before running');
console.log('');

if (process.argv.includes('--open')) {
  const platform = process.platform;
  if (platform === 'win32') {
    spawn('cmd', ['/c', 'start', '', url], { detached: true, stdio: 'ignore' }).unref();
  } else if (platform === 'darwin') {
    spawn('open', [url], { detached: true, stdio: 'ignore' }).unref();
  } else {
    spawn('xdg-open', [url], { detached: true, stdio: 'ignore' }).unref();
  }
  console.log('Opening browser…');
}
