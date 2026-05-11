#!/usr/bin/env node
/**
 * Z-Operator digest — aggregates public-safe hub signals for Super Chat + reminders.
 * Run after verify, readiness, or on a schedule. No vault reads.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'data', 'reports', 'z_operator_digest.json');

function readJson(rel) {
  try {
    return JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
  } catch {
    return null;
  }
}

function main() {
  const enforcer = readJson('data/reports/z_execution_enforcer.json');
  const gov = readJson('data/reports/z_release_governance.json');
  const bridge = readJson('data/reports/z_readiness_gate.json');
  const reg = readJson('data/z_pc_root_projects.json');
  const arrbce = readJson('data/reports/z_arrbce_last_run.json');
  const system = readJson('data/system-status.json');

  const projects = Array.isArray(reg?.projects) ? reg.projects : [];
  const external = projects.filter((p) => p.role === 'external').length;

  const checks = enforcer?.checks || {};
  const govSnap = checks.governance || gov;

  const next = [];
  if (enforcer?.action === 'BLOCK') {
    next.push('Clear enforcer blockers (see data/reports/z_execution_enforcer.json), then node scripts/z_execution_enforcer.mjs');
  }
  if (govSnap && govSnap.final_status === 'HOLD' && govSnap.technical_ready) {
    next.push('Governance HOLD but technically ready — edit data/z_release_control.json only when you intentionally approve release.');
  }
  if (bridge?.summary?.status !== 'PASS') {
    next.push('Run npm run readiness:gate until 4/4 PASS, then node scripts/z_zuno_state_report.mjs');
  }
  if (!system || system.verify === 'UNKNOWN') {
    next.push('Run npm run verify:ci or npm run system-status:refresh for system-status.json');
  }
  next.push('Super Chat: companion uses this digest when refreshed — run npm run operator:digest after major hub changes.');
  next.push('Cloudflare Task 008: see MONOREPO Cloudflare roadmap; /z-cf-task008-roadmap');

  const digest = {
    generated_at: new Date().toISOString(),
    role: 'operator_digest',
    note: 'Shadow-style snapshot for Z-Super Chat + creator reminders. Refresh with npm run operator:digest.',
    system_status: system
      ? { verify: system.verify, status: system.status, last_check_iso: system.last_check_iso || null }
      : null,
    enforcer: enforcer
      ? {
          action: enforcer.action,
          release_gate: checks.release_gate ?? null,
          p1_open: checks.p1_open,
          readiness: `${checks.readiness_pass ?? '?'}/${checks.readiness_total ?? '?'}`,
          blockers_head: Array.isArray(enforcer.blockers) ? enforcer.blockers.slice(0, 3) : []
        }
      : null,
    governance: govSnap
      ? {
          final_status: govSnap.final_status,
          technical_ready: govSnap.technical_ready,
          manual_release: govSnap.manual_release,
          readiness: govSnap.readiness
        }
      : null,
    bridge_readiness: bridge
      ? {
          summary_status: bridge.summary?.status,
          readiness: bridge.readiness,
          gates_pass: bridge.summary?.gates_pass,
          gates_total: bridge.summary?.gates_total
        }
      : null,
    registry: {
      project_count: projects.length,
      external_hosted_count: external
    },
    arrbce: arrbce
      ? { completed_at_iso: arrbce.completed_at_iso || arrbce.completed_at || null, ok: arrbce.ok, mode: arrbce.mode }
      : null,
    suggested_next_steps: [...new Set(next)].slice(0, 8)
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, `${JSON.stringify(digest, null, 2)}\n`, 'utf8');
  process.stdout.write(`Operator digest written: ${OUT}\n`);
}

main();
