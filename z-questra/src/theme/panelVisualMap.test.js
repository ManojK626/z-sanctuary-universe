import { describe, expect, it } from 'vitest';
import { getPanelVisualIdentity, PANEL_VISUAL_MAP } from './panelVisualMap.js';

describe('panelVisualMap', () => {
  it('defines core panels with identity fields', () => {
    for (const id of ['zuno-guide', 'learning-cards', 'workstation-shell', 'visual-structure', 'z-music-engine']) {
      const p = PANEL_VISUAL_MAP[id];
      expect(p.panelId).toBe(id);
      expect(p.department).toBeTruthy();
      expect(p.accentColor).toBeTruthy();
      expect(p.headingColor).toBeTruthy();
      expect(p.highlightColor).toBeTruthy();
      expect(p.lineColor).toBeTruthy();
      expect(p.guardianLevel).toBeTruthy();
      expect(Array.isArray(p.ageModeSuitability)).toBe(true);
    }
  });

  it('getPanelVisualIdentity falls back for unknown id', () => {
    const x = getPanelVisualIdentity('unknown-panel');
    expect(x.panelId).toBe('zuno-guide');
  });
});
