// Z: z_colour\z_colour_binding.js
import { decideColourProfile, applyProfile } from './z_colour_engine.js';

function refresh() {
  const score = window.ZHarisha?.getScore?.() ?? 100;
  const pulse = window.ZWorldPulse?._lastSnapshot ? window.ZWorldPulse._lastSnapshot.summary : {};
  const profile = decideColourProfile({ harishaScore: score, pulseMood: pulse.mood || 'calm' });
  applyProfile(profile);
}

window.addEventListener('harisha:update', () => refresh());
window.addEventListener('z-world-pulse', () => refresh());

refresh();
