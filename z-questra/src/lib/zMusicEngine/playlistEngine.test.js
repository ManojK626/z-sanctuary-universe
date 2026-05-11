import { describe, expect, it } from 'vitest';
import { buildPlaylist, buildDefaultPlaylist, explainTrack } from './playlistEngine.js';
import { Z_MUSIC_SEED_TRACKS } from './seedTracks.js';

describe('buildPlaylist', () => {
  it('filters by mode and caps length', () => {
    const { tracks, explanation } = buildPlaylist('alignment', Z_MUSIC_SEED_TRACKS, { maxTracks: 4 });
    expect(tracks.length).toBeLessThanOrEqual(4);
    expect(tracks.every((t) => t.mode === 'alignment')).toBe(true);
    expect(explanation.confidence).toBeGreaterThan(0);
    expect(explanation.signals_considered).toContain('catalog_mode_filter');
  });

  it('applies kids energy cap unless explicit power', () => {
    const { tracks } = buildDefaultPlaylist('power', { ageMode: 'kids', userExplicitPower: false, maxTracks: 8 });
    expect(tracks.every((t) => t.energy <= 0.72)).toBe(true);
  });

  it('allows full power tracks for kids when user explicitly chose power', () => {
    const { tracks } = buildDefaultPlaylist('power', { ageMode: 'kids', userExplicitPower: true, maxTracks: 8 });
    expect(tracks.some((t) => t.energy > 0.72)).toBe(true);
  });
});

describe('explainTrack', () => {
  it('returns explanation fields', () => {
    const t = Z_MUSIC_SEED_TRACKS[0];
    const ex = explainTrack(t, 'alignment', { signals: ['unit_test'] });
    expect(ex.what_changed).toContain(t.title);
    expect(ex.signals_considered).toContain('unit_test');
    expect(ex.confidence).toBeGreaterThanOrEqual(0);
    expect(ex.confidence).toBeLessThanOrEqual(1);
  });
});
