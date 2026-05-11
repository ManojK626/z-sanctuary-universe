// Z: z_colour\z_colour_engine.js
import { ZColourProfiles } from './z_colour_profiles.js';

/**
 * Living Workspace Tag: Z-Colour Harisha Engine
 * Description: chooses palette profiles based on Harisha + World Pulse context and logs shifts.
 */
function setProfileVars(profile) {
  const root = document.documentElement;
  if (!root) return;
  root.style.setProperty('--z-bg', profile.bg);
  root.style.setProperty('--z-fg', profile.fg);
  root.style.setProperty('--z-accent', profile.accent);
  root.style.setProperty('--z-motion', profile.motion);
}

export function decideColourProfile(context = {}) {
  const harisha =
    typeof context.harishaScore === 'number'
      ? context.harishaScore
      : (window.ZHarisha?.getScore?.() ?? 100);
  const pulseMood = context.pulseMood || window.ZWorldPulse?.getState?.()?.snapshot?.summary?.mood;
  const interactionRate =
    typeof context.interactionRate === 'number'
      ? context.interactionRate
      : (window.ZInteraction?.rate ?? 0);
  const focusMode = context.focusMode || window.ZFocus?.active;

  if (harisha < 40 || pulseMood === 'turbulent') return 'alert';
  if (harisha < 60 || interactionRate > 120) return 'fatigue_protect';
  if (pulseMood === 'tense') return 'calm';
  if (focusMode) return 'focus';

  return 'neutral';
}

export function applyProfile(profileName) {
  const profile = ZColourProfiles[profileName] || ZColourProfiles.neutral;
  setProfileVars(profile);
  window.ZChronicle?.log('z_colour.shift', {
    profile: profileName,
    harisha: window.ZHarisha?.getScore?.() ?? 100,
    pulse: window.ZWorldPulse?.getState?.()?.snapshot?.summary?.mood || 'calm',
    ts: new Date().toISOString(),
  });
}
