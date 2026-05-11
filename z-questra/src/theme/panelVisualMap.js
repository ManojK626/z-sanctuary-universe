/**
 * Phase 2.3 — per-panel visual identity (department colours, tones, guardian posture).
 * Frontend metadata only; complements sanctuaryRouteMap.js.
 */

export const PANEL_VISUAL_MAP = {
  'zuno-guide': {
    panelId: 'zuno-guide',
    department: 'guide',
    accentColor: 'lavender',
    headingColor: 'aqua',
    highlightColor: 'gold',
    lineColor: 'sky',
    guardianLevel: 'standard',
    ageModeSuitability: ['kids', 'teens', 'adults', 'enterprise'],
    motionStyle: 'subtle',
    icon: '🜁',
  },
  'learning-cards': {
    panelId: 'learning-cards',
    department: 'education',
    accentColor: 'mint',
    headingColor: 'leaf',
    highlightColor: 'peach',
    lineColor: 'amber',
    guardianLevel: 'age_mode_filtered',
    ageModeSuitability: ['kids', 'teens', 'adults'],
    motionStyle: 'subtle',
    icon: '📇',
  },
  'workstation-shell': {
    panelId: 'workstation-shell',
    department: 'command',
    accentColor: 'cyan',
    headingColor: 'commandGreen',
    highlightColor: 'amber',
    lineColor: 'commandMagenta',
    guardianLevel: 'standard',
    ageModeSuitability: ['teens', 'adults', 'enterprise'],
    motionStyle: 'none',
    icon: '⬡',
  },
  'visual-structure': {
    panelId: 'visual-structure',
    department: 'knowledge',
    accentColor: 'violet',
    headingColor: 'sky',
    highlightColor: 'gold',
    lineColor: 'aqua',
    guardianLevel: 'standard',
    ageModeSuitability: ['kids', 'teens', 'adults', 'enterprise'],
    motionStyle: 'subtle',
    icon: '◇',
  },
  'z-music-engine': {
    panelId: 'z-music-engine',
    department: 'music',
    accentColor: 'sky',
    headingColor: 'lavender',
    highlightColor: 'mint',
    lineColor: 'aqua',
    guardianLevel: 'age_mode_filtered',
    ageModeSuitability: ['kids', 'teens', 'adults', 'enterprise'],
    motionStyle: 'subtle',
    icon: '🎧',
  },
};

export function getPanelVisualIdentity(panelId) {
  return PANEL_VISUAL_MAP[panelId] || PANEL_VISUAL_MAP['zuno-guide'];
}
