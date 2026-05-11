import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { dataDirZunoFlow } from './resolve_hub.mjs';

/** Ordered phases: transformation → flow → next phase → scientific profile → diagnostic → core layer → synthesis → final integration */
export const ZUNO_PHASES = [
  {
    id: 'transformation_activate',
    zunoCall: 'Zuno, activate the transformation flow.',
    nextCue: 'Continue the flow',
    title: 'Transformation (activate)',
    experience:
      'Open the run: you set direction; the flow tracks phase, context, and optional links to other hub modules (e.g. MirrorSoul) later.',
    knowledge: 'Z-Sanctuary: single roof; no second SSWS authority. Amk-Goku vaults = classified storage, not a control plane.',
  },
  {
    id: 'flow_continue',
    zunoCall: 'Zuno, continue the flow.',
    nextCue: 'ZUNO NEXT PHASE',
    title: 'Continue the flow',
    experience: 'Narrative and state carry forward; each step is logged for your review, not for automated decisions.',
    knowledge: 'Data stays under your hub `data/zunoFlow/`; advisory-only until you wire more.',
  },
  {
    id: 'next_phase',
    zunoCall: 'ZUNO NEXT PHASE',
    nextCue: 'Scientific anxiety profile',
    title: 'Next phase',
    experience: 'Explicit phase boundary — use when you are ready to deepen structure without losing prior intent.',
    knowledge: 'Tie-in: continuation manifest (`/continuation`) maps corpus slices to hub reality.',
  },
  {
    id: 'anxiety_profile_scientific',
    zunoCall: 'Zuno, continue — scientific anxiety profile (structured self-report).',
    nextCue: 'Zuno\'s next diagnostic',
    title: 'Scientific stress & anxiety self-report (7 items)',
    experience:
      'Seven 0–3 items (0 = not at all, 3 = nearly every day), summed 0–21. Reflection only: not a diagnosis, not a substitute for care. Crisis: contact local services.',
    knowledge: 'GAD-7 style wording for education; this implementation is a wellness/UX profile, not a medical device output.',
    requiresAnxiety: true,
  },
  {
    id: 'diagnostic',
    zunoCall: 'Zuno\'s next diagnostic.',
    nextCue: 'Zuno, next layer',
    title: 'Zuno\'s next diagnostic',
    experience:
      'Synthesize what the numbers and your words suggest as patterns — Zuno as narrative mirror, not clinician.',
    knowledge: 'If anxiety sum is stored, it is shown here as a band (low / mild / moderate / elevated) with the same non-diagnostic disclaimer.',
  },
  {
    id: 'next_core_layer',
    zunoCall: 'Zuno, next layer — next core layer.',
    nextCue: 'Zuno, next synthesis',
    title: 'Next core layer',
    experience: 'Name the next engine you will harden: API contract, one slice, tests — core before breadth.',
    knowledge: 'Module build order: `Z-SUC-1-MODULE-BUILD-PLAN` — API-first, one vertical slice at a time.',
  },
  {
    id: 'synthesis',
    zunoCall: 'Zuno, next synthesis.',
    nextCue: 'ZUNO FINAL INTEGRATION',
    title: 'Zuno next synthesis',
    experience: 'Pull experience + knowledge + optional MirrorSoul handoff (future hook) into one short synthesis note you own.',
    knowledge: 'QOSMEI / governance: quality and claims stay bounded; see `AGENTS.md` for hierarchy and safe mode.',
  },
  {
    id: 'final_integration',
    zunoCall: 'ZUNO FINAL INTEGRATION',
    nextCue: null,
    title: 'Zuno final integration',
    experience:
      'Flow complete for this run. Export or copy your session id; re-run from activate anytime. New cores go through the checklist in continuation governance.',
    knowledge: 'Zuno final integration: seal intent, not automatic deployment.',
  },
];

const ANXIETY_LABELS = [
  'Over the last two weeks, how often have you been bothered by: feeling nervous, anxious, or on edge?',
  'Over the last two weeks, how often: not being able to stop or control worrying?',
  'Over the last two weeks, how often: worrying too much about different things?',
  'Over the last two weeks, how often: trouble relaxing?',
  'Over the last two weeks, how often: being so restless that it is hard to sit still?',
  'Over the last two weeks, how often: becoming easily annoyed or irritable?',
  'Over the last two weeks, how often: feeling afraid, as if something awful might happen?',
];

export const ANXIETY_DISCLAIMER =
  'This is a structured self-reflection only. It is not a medical or psychiatric diagnosis. If you are in crisis, contact emergency services or a qualified professional. Sanctuary tools are advisory and bounded.';

/**
 * @param {number} sum
 */
export function anxietyBandFromSum(sum) {
  if (sum <= 4) return { band: 'low', label: 'low reported load (reflection only)' };
  if (sum <= 9) return { band: 'mild', label: 'mild (self-report, not a diagnosis)' };
  if (sum <= 14) return { band: 'moderate', label: 'moderate (self-report, not a diagnosis)' };
  return { band: 'elevated', label: 'elevated self-report — consider professional support if this persists' };
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function sessionPath(hubRoot, id) {
  return path.join(dataDirZunoFlow(hubRoot), `${id}.json`);
}

/**
 * @param {string} hubRoot
 * @param {{ user_id: string, mirrorsoul_note?: string }} opts
 */
export function createSession(hubRoot, opts) {
  const userId = (opts.user_id || 'anon').toString().slice(0, 200);
  const id = `zft_${crypto.randomUUID()}`;
  const now = new Date().toISOString();
  const state = {
    sessionId: id,
    userId,
    phaseIndex: 0,
    phase: ZUNO_PHASES[0].id,
    zunoCall: ZUNO_PHASES[0].zunoCall,
    mirrorsoulNote: (opts.mirrorsoul_note || '').toString().slice(0, 2000) || null,
    anxiety: null,
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
  ensureDir(dataDirZunoFlow(hubRoot));
  fs.writeFileSync(sessionPath(hubRoot, id), JSON.stringify(state, null, 2), 'utf8');
  return {
    ...state,
    currentPhase: ZUNO_PHASES[0],
    totalPhases: ZUNO_PHASES.length,
    allPhases: ZUNO_PHASES.map((p) => p.id),
    anxietyLabels: ANXIETY_LABELS,
    disclaimer: ANXIETY_DISCLAIMER,
  };
}

export function loadSession(hubRoot, sessionId) {
  const p = sessionPath(hubRoot, sessionId);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function saveState(hubRoot, state) {
  state.updatedAt = new Date().toISOString();
  ensureDir(dataDirZunoFlow(hubRoot));
  fs.writeFileSync(sessionPath(hubRoot, state.sessionId), JSON.stringify(state, null, 2), 'utf8');
  return state;
}

function enrichState(state) {
  const idx = state.phaseIndex;
  const currentPhase = ZUNO_PHASES[idx] || ZUNO_PHASES[0];
  return {
    ...state,
    currentPhase,
    zunoCall: currentPhase.zunoCall,
    phase: currentPhase.id,
    nextCue: currentPhase.nextCue,
    isComplete: idx >= ZUNO_PHASES.length - 1,
    atLastPhase: idx === ZUNO_PHASES.length - 1,
    canAdvance:
      (currentPhase.requiresAnxiety
        ? state.anxiety && typeof state.anxiety.sum === 'number'
        : true) && idx < ZUNO_PHASES.length - 1,
    totalPhases: ZUNO_PHASES.length,
    allPhases: ZUNO_PHASES.map((p) => p.id),
    anxietyLabels: ANXIETY_LABELS,
    disclaimer: ANXIETY_DISCLAIMER,
  };
}

export function getSessionView(hubRoot, sessionId) {
  const raw = loadSession(hubRoot, sessionId);
  if (!raw) return null;
  return enrichState(raw);
}

/**
 * @param {Record<string, number | string} responses  g1..g7 or 1..7 each 0-3
 */
export function scoreAnxietyResponses(responses) {
  const keys = ['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7'];
  const nums = keys.map((k, i) => {
    const v = responses[k] ?? responses[i + 1] ?? responses[String(i + 1)] ?? responses[`g${i + 1}`];
    const n = Number(v);
    if (v === undefined || v === null || Number.isNaN(n) || n < 0 || n > 3) {
      const err = new Error(`invalid or missing item ${k}`);
      err.code = 'VALIDATION';
      throw err;
    }
    return n;
  });
  const sum = nums.reduce((a, b) => a + b, 0);
  return { sum, items: nums, band: anxietyBandFromSum(sum) };
}

export function postAnxiety(hubRoot, sessionId, responses) {
  const state = loadSession(hubRoot, sessionId);
  if (!state) {
    const e = new Error('session_not_found');
    e.code = 'NOT_FOUND';
    throw e;
  }
  const p = ZUNO_PHASES[state.phaseIndex];
  if (!p || p.id !== 'anxiety_profile_scientific') {
    const e = new Error('wrong_phase_for_anxiety');
    e.code = 'VALIDATION';
    throw e;
  }
  const scored = scoreAnxietyResponses(responses);
  state.anxiety = { ...scored, recordedAt: new Date().toISOString() };
  saveState(hubRoot, state);
  return enrichState(state);
}

export function advance(hubRoot, sessionId) {
  const state = loadSession(hubRoot, sessionId);
  if (!state) {
    const e = new Error('session_not_found');
    e.code = 'NOT_FOUND';
    throw e;
  }
  const p = ZUNO_PHASES[state.phaseIndex];
  if (p.requiresAnxiety && (!state.anxiety || typeof state.anxiety.sum !== 'number')) {
    const e = new Error('anxiety_profile_required');
    e.code = 'VALIDATION';
    throw e;
  }
  if (state.phaseIndex >= ZUNO_PHASES.length - 1) {
    return enrichState(state);
  }
  state.phaseIndex += 1;
  const next = ZUNO_PHASES[state.phaseIndex];
  state.phase = next.id;
  state.zunoCall = next.zunoCall;
  saveState(hubRoot, state);
  return enrichState(state);
}

export { resolveHubForChildWorkspace } from './resolve_hub.mjs';
export { dataDirZunoFlow } from './resolve_hub.mjs';
