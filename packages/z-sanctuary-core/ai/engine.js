import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { formatCompanionInsight } from './systemInterpreter.js';
import { buildGuardianSuggestions } from './guardianSuggestions.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AI_DIR = __dirname;

const DEFAULT_PERSONA = {
  id: 'default',
  name: 'Companion',
  tone: 'neutral',
  purpose: 'assist',
  style: 'brief',
  signature: 'Listening…'
};

function normalizePersonaId(id) {
  const s = String(id || 'zuno')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-');
  if (['zuno', 'zulu', 'aisling-sol', 'amk-ghost', 'quan-ai'].includes(s)) return s;
  return 'zuno';
}

function loadPersona(personaId) {
  const id = normalizePersonaId(personaId);
  const filePath = path.join(AI_DIR, `${id}.json`);
  try {
    if (!fs.existsSync(filePath)) return { ...DEFAULT_PERSONA, name: id };
    const raw = fs.readFileSync(filePath, 'utf8');
    return { ...DEFAULT_PERSONA, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_PERSONA };
  }
}

/**
 * Heuristic: user wants a structured list of projects from the registry.
 */
export function wantsProjectListing(message) {
  const m = String(message || '').toLowerCase();
  if (m.includes('show') && m.includes('project')) return true;
  if (m.includes('list') && (m.includes('project') || m.includes('ecosystem'))) return true;
  if (m.includes('my ai') && m.includes('project')) return true;
  if (m.includes('registered project')) return true;
  return false;
}

/**
 * Rich reply with paths and optional dashboard links (registry-aware, no LLM).
 */
export function buildProjectListingReply(persona, projects, pcRoot, hubName) {
  const p = persona || DEFAULT_PERSONA;
  const root = String(pcRoot || '').replace(/\\/g, '/');
  const lines = [
    `${p.name} — ${p.signature}`,
    '',
    `Hub: ${hubName || '—'} · PC root: ${root || '—'}`,
    '',
    'Registered projects:'
  ];
  for (const proj of projects || []) {
    const name = proj.name || proj.id || '—';
    const role = proj.role ? ` [${proj.role}]` : '';
    const relPath = proj.path ? `${root}/${String(proj.path).replace(/\\/g, '/')}` : '';
    lines.push(`• ${name}${role}`);
    if (relPath) lines.push(`  Path: ${relPath}`);
    if (proj.dashboard_url) lines.push(`  Dashboard: ${proj.dashboard_url}`);
  }
  lines.push('');
  lines.push('Tip: open the hub dashboard (Z-HODP) or run verify tasks from the sanctuary repo.');
  return lines.join('\n');
}

/**
 * One-line clip for companion text (no HTML).
 * @param {string} s
 * @param {number} [max]
 */
function clipLine(s, max = 160) {
  const t = String(s || '').trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

/**
 * Plain-text Ω / DRP posture from guardian report (advisory; same signal as dashboard badge).
 * @param {object | null | undefined} fp `formula_posture` from z_guardian_report.json
 */
export function formatFormulaPostureBlock(fp) {
  if (!fp || typeof fp !== 'object') return '';
  const posture = String(fp.posture || 'unknown').toUpperCase();
  const s = fp.scores && typeof fp.scores === 'object' ? fp.scores : {};
  const interp = fp.interpretation && typeof fp.interpretation === 'object' ? fp.interpretation : {};
  const lines = [
    `Ω formula posture (DRP advisory): ${posture} · omega_index=${s.omega_index ?? '—'} · drp_filter=${s.drp_filter ?? '—'} · z_ui_readiness=${s.z_ui_readiness ?? '—'}`,
    `K=${s.K ?? '—'} D=${s.D ?? '—'} P=${s.P ?? '—'} E=${s.E ?? '—'} R=${s.R ?? '—'}`
  ];
  for (const key of ['governance', 'media', 'business', 'qa_criticism_ai']) {
    const v = interp[key];
    if (v) lines.push(`${key}: ${clipLine(v)}`);
  }
  lines.push('Heuristic from guardian report — not a substitute for gates or human approval.');
  return lines.join('\n');
}

/**
 * @param {object | null} systemStatus from data/system-status.json
 * @param {string[]} projectNames
 * @param {object | null} [formulaPosture] from guardian report `formula_posture`
 */
export function formatSystemAwarenessBlock(systemStatus, projectNames, formulaPosture = null) {
  const names = Array.isArray(projectNames) ? projectNames : [];
  const hasStatus = systemStatus && systemStatus.verify !== 'UNKNOWN';
  const insight = hasStatus ? formatCompanionInsight(systemStatus, names) : '';
  const fpBlock = formatFormulaPostureBlock(formulaPosture);

  if (!insight && !fpBlock) return '';

  const parts = [];
  if (insight) {
    parts.push(`AI insight (system interpretation):\n${insight}`);
    const tips = hasStatus ? buildGuardianSuggestions(systemStatus) : [];
    if (tips.length) {
      parts.push(`Guardian:\n${tips
        .slice(0, 4)
        .map((t) => `• ${t}`)
        .join('\n')}`);
    }
  }
  if (fpBlock) parts.push(fpBlock);

  return `\n\n—\n${parts.join('\n\n')}`;
}

/**
 * Compact operator digest for Super Chat (read-only aggregate of hub JSON).
 * @param {object | null} digest from data/reports/z_operator_digest.json
 */
export function formatOperatorDigestBlock(digest) {
  if (!digest || typeof digest !== 'object') return '';
  const lines = ['Operator digest (hub snapshot — refresh: npm run operator:digest):'];
  lines.push(`• Stamp: ${digest.generated_at || '—'}`);
  if (digest.enforcer) {
    const e = digest.enforcer;
    lines.push(
      `• Enforcer: ${e.action ?? '—'} · release_gate: ${e.release_gate ?? '—'} · P1: ${e.p1_open ?? '—'} · readiness: ${e.readiness ?? '—'}`
    );
  }
  if (digest.governance) {
    const g = digest.governance;
    lines.push(
      `• Governance: ${g.final_status ?? '—'} · technical_ready: ${g.technical_ready} · manual_release: ${g.manual_release}`
    );
  }
  if (digest.bridge_readiness) {
    const b = digest.bridge_readiness;
    lines.push(`• Z-Bridge readiness: ${b.summary_status ?? '—'} (${b.readiness ?? '—'})`);
  }
  if (digest.registry) {
    lines.push(
      `• Registry: ${digest.registry.project_count ?? '—'} projects · external hosted: ${digest.registry.external_hosted_count ?? 0}`
    );
  }
  if (Array.isArray(digest.suggested_next_steps) && digest.suggested_next_steps.length) {
    lines.push(`• Next step: ${digest.suggested_next_steps[0]}`);
  }
  lines.push('(Advisory — confirm with MONOREPO and enforcer before irreversible actions.)');
  return `\n\n—\n${lines.join('\n')}`;
}

/**
 * Dynamic persona-driven reply (data from JSON + real registry names; optional project-list mode).
 * @param {string} personaId
 * @param {string} message
 * @param {string[]} projectNames
 * @param {object[]} [projectsFull] full `projects` array from z_pc_root_projects.json
 * @param {{ pc_root?: string, hub?: string, systemStatus?: object | null, formulaPosture?: object | null, operatorDigest?: object | null }} [meta]
 */
export function getAIResponse(personaId, message, projectNames = [], projectsFull = null, meta = {}) {
  const persona = loadPersona(personaId);
  const names = Array.isArray(projectNames) ? projectNames : [];
  const full = Array.isArray(projectsFull) ? projectsFull : [];
  const fp = meta.formulaPosture ?? null;

  if (wantsProjectListing(message) && full.length > 0) {
    let out = buildProjectListingReply(persona, full, meta.pc_root, meta.hub);
    if (meta.systemStatus || fp) out += formatSystemAwarenessBlock(meta.systemStatus || null, names, fp);
    if (meta.operatorDigest) out += formatOperatorDigestBlock(meta.operatorDigest);
    return out;
  }

  const ecosystem =
    names.length > 0
      ? ` I see your ecosystem includes: ${names.slice(0, 12).join(', ')}${names.length > 12 ? '…' : ''}.`
      : '';

  const msg = String(message || '').trim().slice(0, 500);
  const context = msg ? ` (${persona.style})` : '';
  const tail = msg ? ` You said: “${msg}”.` : '';

  let out = `${persona.name}${context}: ${persona.signature}${ecosystem}${tail}`;
  if (meta.systemStatus || fp) out += formatSystemAwarenessBlock(meta.systemStatus || null, names, fp);
  if (meta.operatorDigest) out += formatOperatorDigestBlock(meta.operatorDigest);
  return out;
}

export { normalizePersonaId, loadPersona };
