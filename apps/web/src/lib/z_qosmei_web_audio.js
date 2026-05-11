/**
 * Lightweight Web Audio “shockwave” — no external assets; requires user gesture to unlock.
 */

let ctx = null;

export function unlockAudio() {
  if (typeof window === 'undefined') return Promise.resolve();
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return Promise.resolve();
  if (!ctx) ctx = new Ctx();
  if (ctx.state === 'suspended') return ctx.resume();
  return Promise.resolve();
}

/** Short bright tick + soft tail (game-console-ish). */
export function playSwarmPulse() {
  if (!ctx || ctx.state !== 'running') return;
  const t0 = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, t0);
  master.gain.exponentialRampToValueAtTime(0.12, t0 + 0.02);
  master.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.14);
  master.connect(ctx.destination);

  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, t0);
  osc.frequency.exponentialRampToValueAtTime(220, t0 + 0.1);
  osc.connect(master);
  osc.start(t0);
  osc.stop(t0 + 0.15);

  const noise = ctx.createBufferSource();
  const nbuf = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
  const d = nbuf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.15;
  noise.buffer = nbuf;
  const ng = ctx.createGain();
  ng.gain.setValueAtTime(0.04, t0);
  ng.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.05);
  noise.connect(ng);
  ng.connect(master);
  noise.start(t0);
  noise.stop(t0 + 0.06);
}
