#!/usr/bin/env node
/**
 * Task 008 — soft launch: build a static tree for Cloudflare Pages (Z-Bridge dashboard only).
 * Layout mirrors repo paths so ui/z_bridge_dashboard/app.js fetch() paths stay valid.
 *
 *   node scripts/z_cf_z_bridge_soft_bundle.mjs           # copy live hub data/z_bridge (review before deploy)
 *   node scripts/z_cf_z_bridge_soft_bundle.mjs --demo    # synthetic public-safe JSON only
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { zBridgePaths, Z_BRIDGE_REPO_ROOT } from './z_bridge/z_bridge_loader.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'dist', 'cf-z-bridge-soft');

const DEMO = {
  pool: {
    total_credits: 1000,
    available: 750,
    distributed_credits: 250,
    contributions: 40,
    status: 'demo',
    last_updated: new Date().toISOString()
  },
  users: {
    users: [
      { id: 'demo_user_1', credits: 100, daily_allocated: 0, reputation_score: 0.85, flagged: false },
      { id: 'demo_user_2', credits: 50, daily_allocated: 5, reputation_score: 0.72, flagged: false }
    ]
  },
  allocation_history: {
    allocations: [
      {
        userId: 'demo_user_1',
        amount: 10,
        source: 'demo',
        time: new Date().toISOString()
      }
    ]
  },
  logs: {
    events: [
      {
        ts: new Date().toISOString(),
        level: 'info',
        action: 'z_bridge_demo',
        detail: 'allocation_success',
        meta: { userId: 'demo_user_1' }
      }
    ]
  },
  intel: {
    users_total: 2,
    users_flagged: 0,
    allocations_success: 1,
    allocations_reduced: 0,
    allocations_blocked: 0,
    priority_score_avg: 0.785,
    priority_score_min: 0.72,
    priority_score_max: 0.85,
    last_event_at: new Date().toISOString()
  }
};

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const ent of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, ent.name);
    const d = path.join(dest, ent.name);
    if (ent.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function writeJson(p, obj) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, `${JSON.stringify(obj, null, 2)}\n`, 'utf8');
}

function main() {
  const demo = process.argv.includes('--demo');

  if (!demo) {
    const paths = zBridgePaths(Z_BRIDGE_REPO_ROOT);
    for (const srcPath of [paths.pool, paths.users, paths.allocationHistory, paths.logs]) {
      if (!fs.existsSync(srcPath)) {
        process.stderr.write(`[bundle] missing ${srcPath} — run bridge tooling or use --demo\n`);
        process.exit(1);
      }
    }
  }

  fs.rmSync(OUT, { recursive: true, force: true });

  const uiSrc = path.join(ROOT, 'ui', 'z_bridge_dashboard');
  const uiDest = path.join(OUT, 'ui', 'z_bridge_dashboard');
  copyDir(uiSrc, uiDest);

  const dataBridge = path.join(OUT, 'data', 'z_bridge');
  const reportsDir = path.join(OUT, 'data', 'reports');

  if (demo) {
    writeJson(path.join(dataBridge, 'pool.json'), DEMO.pool);
    writeJson(path.join(dataBridge, 'users.json'), DEMO.users);
    writeJson(path.join(dataBridge, 'allocation_history.json'), DEMO.allocation_history);
    writeJson(path.join(dataBridge, 'logs.json'), DEMO.logs);
    writeJson(path.join(reportsDir, 'z_bridge_intelligence_summary.json'), DEMO.intel);
  } else {
    const paths = zBridgePaths(Z_BRIDGE_REPO_ROOT);
    for (const srcPath of [paths.pool, paths.users, paths.allocationHistory, paths.logs]) {
      const destPath = path.join(dataBridge, path.basename(srcPath));
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.copyFileSync(srcPath, destPath);
    }
    const intelSrc = path.join(Z_BRIDGE_REPO_ROOT, 'data', 'reports', 'z_bridge_intelligence_summary.json');
    const intelDest = path.join(reportsDir, 'z_bridge_intelligence_summary.json');
    if (fs.existsSync(intelSrc)) {
      fs.mkdirSync(reportsDir, { recursive: true });
      fs.copyFileSync(intelSrc, intelDest);
    } else {
      writeJson(intelDest, { note: 'optional; run npm run bridge:intel:summary in hub' });
    }
  }

  const headersPath = path.join(OUT, '_headers');
  fs.writeFileSync(
    headersPath,
    [
      '/*',
      '  X-Frame-Options: DENY',
      '  X-Content-Type-Options: nosniff',
      '  Referrer-Policy: strict-origin-when-cross-origin',
      '  Permissions-Policy: geolocation=(), microphone=(), camera=()',
      ''
    ].join('\n'),
    'utf8'
  );

  const redirectsPath = path.join(OUT, '_redirects');
  fs.writeFileSync(redirectsPath, '/ /ui/z_bridge_dashboard/ 302\n', 'utf8');

  const metaPath = path.join(OUT, 'z_soft_launch_bundle.json');
  writeJson(metaPath, {
    generated_at: new Date().toISOString(),
    mode: demo ? 'demo' : 'hub_copy',
    note: 'Task 008 soft launch — static Z-Bridge dashboard only. Governance HOLD in hub is unchanged.',
    entry: '/ui/z_bridge_dashboard/'
  });

  process.stdout.write(`[bundle] OK → ${OUT} (${demo ? 'demo data' : 'copied from hub'})\n`);
}

main();
