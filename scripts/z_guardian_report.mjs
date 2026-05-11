#!/usr/bin/env node
/**
 * Aggregates system snapshot + registry names + guardian suggestions into one JSON report
 * for Zuno, dashboards, and humans (read-only; no external calls).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildGuardianSuggestions } from '../packages/z-sanctuary-core/ai/guardianSuggestions.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const STATUS_PATH = path.join(ROOT, 'data', 'system-status.json');
const PC_PATH = path.join(ROOT, 'data', 'z_pc_root_projects.json');
const FRESHNESS_PATH = path.join(ROOT, 'data', 'reports', 'z_project_freshness.json');
const OUT_PATH = path.join(ROOT, 'data', 'reports', 'z_guardian_report.json');

function readJsonSafe(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function loadProjectNames() {
  const d = readJsonSafe(PC_PATH);
  if (!d || !Array.isArray(d.projects)) return [];
  return d.projects.map((p) => p.name).filter(Boolean);
}

function scoreFromBand(value, okThreshold, watchThreshold) {
  if (value >= okThreshold) return 100;
  if (value >= watchThreshold) return 70;
  return 40;
}

function computeFormulaPosture(system, freshness) {
  const projects = Number(freshness?.summary?.projects_scanned || 0);
  const present = Number(freshness?.summary?.present || 0);
  const missing = Number(freshness?.summary?.missing || 0);
  const dirty = Number(freshness?.summary?.dirty_worktrees || 0);
  const stale30 = Number(freshness?.summary?.stale_heads_over_30d || 0);
  const presenceRatio = projects > 0 ? present / projects : 0;

  const K = scoreFromBand(presenceRatio, 0.95, 0.8);
  const D = scoreFromBand(system?.verify === 'PASS' ? 1 : 0, 1, 0.5);
  const P = scoreFromBand(1 - Math.min(1, stale30 / Math.max(1, projects)), 0.8, 0.5);
  const E = scoreFromBand(missing === 0 ? 1 : 0, 1, 0.5);
  const R = scoreFromBand(1 - Math.min(1, dirty / Math.max(1, projects)), 0.85, 0.6);
  const drpFilter = Math.max(0, 100 - (missing * 20 + dirty * 8 + stale30 * 5));
  const omegaIndex = Math.round((K * 0.2 + D * 0.2 + P * 0.2 + E * 0.2 + R * 0.2) * (drpFilter / 100));
  const zUiReadiness = Math.round(((E + drpFilter + R) / 3) * 0.9 + D * 0.1);

  const posture = omegaIndex >= 85 ? 'green' : omegaIndex >= 65 ? 'watch' : 'hold';

  return {
    posture,
    scores: { K, D, P, E, R, drp_filter: drpFilter, omega_index: omegaIndex, z_ui_readiness: zUiReadiness },
    interpretation: {
      governance: posture === 'green' ? 'promote_with_guardrails' : posture === 'watch' ? 'fix_then_promote' : 'stabilize_only',
      media: drpFilter >= 80 ? 'safe_to_publish_with_audit' : 'publish_readonly_updates_only',
      business: omegaIndex >= 70 ? 'scale_incrementally' : 'maintain_and_reduce_risk',
      qa_criticism_ai:
        zUiReadiness >= 80
          ? 'enable_full_critique_with_actionable_feedback'
          : 'enable_advisory_mode_only_with_human_review',
    },
    notes: [
      'Formula posture is computed from current system status and project freshness signals.',
      'DRP reinforcement lowers posture when missing, stale, or dirty cross-project signals increase.',
    ],
  };
}

const system = readJsonSafe(STATUS_PATH);
const names = loadProjectNames();
const suggestions = buildGuardianSuggestions(system);
const freshness = readJsonSafe(FRESHNESS_PATH);
const formulaPosture = computeFormulaPosture(system, freshness);

const payload = {
  generated_at: new Date().toISOString(),
  hub_root: ROOT,
  system_status: system,
  registered_projects: names,
  registered_project_count: names.length,
  suggestions,
  suggestion_count: suggestions.length,
  formula_posture: formulaPosture,
  ...(freshness ? { project_freshness: freshness } : {})
};

fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
console.log(`✅ Guardian report: ${OUT_PATH} (${suggestions.length} suggestion(s))`);
