import { describe, expect, it } from 'vitest';
import { getAudioSourceForSeedTrack, Z_SME_AUDIO_SOURCES } from './audioSources.js';

describe('audioSources', () => {
  it('lists three hero sources linked to seed ids', () => {
    expect(Z_SME_AUDIO_SOURCES.length).toBe(3);
    expect(Z_SME_AUDIO_SOURCES.map((s) => s.seedTrackId).sort()).toEqual(['al-1', 'jy-1', 'pw-1']);
  });

  it('resolves by seed track id', () => {
    const a = getAudioSourceForSeedTrack('al-1');
    expect(a?.trackId).toBe('aligned-with-nature');
    expect(a?.mode).toBe('alignment');
    expect(getAudioSourceForSeedTrack('unknown')).toBeNull();
  });
});
