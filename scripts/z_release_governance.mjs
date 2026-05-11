#!/usr/bin/env node
/**
 * Task 007.6 — Release governance snapshot (human release switch + technical gates).
 * Writes data/reports/z_release_governance.json
 */
import fs from 'node:fs';
import path from 'node:path';
import { evaluateReleaseGovernance, normalizeReleaseControl } from './z_release_governance_core.mjs';

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const OUT = path.join(REPORTS_DIR, 'z_release_governance.json');
const CONTROL_PATH = path.join(ROOT, 'data', 'z_release_control.json');

function readJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function num(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function countOpenP1FromTaskList(taskList) {
  if (!Array.isArray(taskList)) return 0;
  return taskList.filter((task) => {
    const priority = String(task?.priority || '').toUpperCase();
    const status = String(task?.status || '').toLowerCase();
    return priority === 'P1' && !['done', 'closed', 'resolved'].includes(status);
  }).length;
}

function main() {
  const zuno = readJson(path.join(REPORTS_DIR, 'zuno_system_state_report.json')) || {};
  const taskList = readJson(path.join(ROOT, 'data', 'z_task_list.json')) || [];
  const metrics = zuno?.current?.metrics || {};

  const p1Open = Math.max(num(metrics.task_p1_open, 0), countOpenP1FromTaskList(taskList));
  const readinessPass = num(metrics.readiness_gates_pass, 0);
  const readinessTotal = Math.max(num(metrics.readiness_gates_total, 4), 1);
  const controlRaw = readJson(CONTROL_PATH);
  const control = normalizeReleaseControl(controlRaw);

  const snapshot = evaluateReleaseGovernance({
    p1Open,
    readinessPass,
    readinessTotal,
    control
  });

  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  fs.writeFileSync(OUT, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
  process.stdout.write(`${JSON.stringify(snapshot, null, 2)}\n`);
  process.stdout.write(`Written: ${OUT}\n`);
  process.exitCode = 0;
}

main();
