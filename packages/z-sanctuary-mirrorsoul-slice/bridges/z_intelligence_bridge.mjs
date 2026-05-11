/**
 * Human-in-the-loop: reads hub reports + text — no auto-actions, no life decisions.
 * Optional async refresh: MIRRORSOUL_INTEL_ASYNC=1 runs `npm run predictive:intel` in background (not request-blocking).
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { buildAdvisoryContext } from '../advisory.mjs';

const KEYWORDS = [
  { re: /stuck|block|stagnat|trap/i, signal: 'resistance' },
  { re: /excit|hope|eager|lift|glow|grateful/i, signal: 'growth' },
  { re: /tired|exhaust|sad|grief|fear|anxious|overwhelm/i, signal: 'sensitivity' },
  { re: /angry|frustrat|rage|heat/i, signal: 'edge' },
  { re: /lost|confus|fog|uncert/i, signal: 'uncertainty' },
  { re: /calm|soft|still|breath|peace/i, signal: 'grounding' },
];

function maybeSpawnPredictiveRefresh(hubRoot) {
  if (process.env.MIRRORSOUL_INTEL_ASYNC !== '1' || !hubRoot) return;
  const hubPkg = path.join(hubRoot, 'package.json');
  if (!fs.existsSync(hubPkg)) return;
  const p = path.join(hubRoot, 'package.json');
  try {
    if (!JSON.parse(fs.readFileSync(p, 'utf8'))?.scripts?.['predictive:intel']) return;
  } catch {
    return;
  }
  const child = spawn(
    process.platform === 'win32' ? 'npm.cmd' : 'npm',
    ['run', 'predictive:intel'],
    {
      cwd: hubRoot,
      stdio: 'ignore',
      detached: true,
      env: { ...process.env, NODE_ENV: process.env.NODE_ENV || 'development' },
    }
  );
  child.unref();
}

function baseSignalsFromText(text) {
  const t = String(text);
  const signals = [];
  for (const { re, signal } of KEYWORDS) {
    if (re.test(t) && !signals.includes(signal)) signals.push(signal);
  }
  if (signals.length === 0) signals.push('presence');
  return signals;
}

function combinedConfidence(signals, ctx) {
  let c = 0.55 + Math.min(0.25, signals.length * 0.05);
  if (ctx?.predictive_hint?.summary) c += 0.05;
  if (ctx?.spi_context?.top_note) c += 0.05;
  if (ctx?.qosmei_context?.recommendation) c += 0.05;
  return Math.min(0.95, c);
}

function buildNarration(signals) {
  const hasR = signals.includes('resistance');
  const hasG = signals.includes('growth');
  if (hasR && hasG) {
    return 'You are holding two forces at once — room for both resistance and growth without forcing a premature resolution.';
  }
  if (hasR) {
    return 'Something in you is pausing; that can be data, not failure. Stay with what you feel without having to fix it in one pass.';
  }
  if (signals.includes('sensitivity')) {
    return 'The system registers softness or strain. Move gently; you do not have to process everything today.';
  }
  return 'Your words land as they are. Reflection only — not a decision from the machine.';
}

function buildSuggestion(signals) {
  if (signals.includes('uncertainty')) {
    return 'Name one small true thing you know today; leave the rest as unknown without chasing closure.';
  }
  if (signals.includes('resistance') && signals.includes('growth')) {
    return 'Observe the tension; do not require it to collapse into a single verdict yet.';
  }
  return 'Rest with this page as long as you need; you can return when you are ready.';
}

/**
 * @param {object} input
 * @param {string} input.text
 * @param {string} [input.user_id]
 * @param {string} [input.emotion]
 * @param {number} [input.intensity] 0..1
 * @param {string} input.hubRoot
 */
export async function analyzeEmotion(input) {
  const { text, hubRoot, emotion, intensity } = input;
  if (typeof text !== 'string' || !text.trim()) {
    return {
      reflection: 'I need a few words to reflect with you.',
      signals: [],
      suggestion: 'Add a line of honest text, then try again.',
      confidence: 0.3,
    };
  }

  maybeSpawnPredictiveRefresh(hubRoot);

  const ctx = hubRoot ? buildAdvisoryContext(hubRoot) : {};
  const signals = baseSignalsFromText(text);
  if (emotion) signals.push(`label:${String(emotion)}`);
  const conf = combinedConfidence(signals, ctx);
  const q = ctx.qosmei_context?.recommendation;
  const extra =
    q && String(q).length
      ? ` (Ecosystem note, advisory: ${String(q).slice(0, 200)}${String(q).length > 200 ? '…' : ''})`
      : '';
  return {
    reflection: `${buildNarration(signals)}${extra}`,
    signals: [...new Set(signals)].slice(0, 12),
    suggestion: buildSuggestion(signals) + (typeof intensity === 'number' && intensity > 0.7 ? ' Intensity is high: shorter sessions are allowed.' : ''),
    confidence: conf,
    _advisory: ctx,
    intensity: typeof intensity === 'number' ? Math.max(0, Math.min(1, intensity)) : null,
  };
}
