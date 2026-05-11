import { describe, expect, it } from 'vitest';
import { inferMode } from './moodModel.js';

describe('inferMode', () => {
  it('respects explicit user selection', () => {
    expect(inferMode({ userSelected: 'journey', context: 'training', ageMode: 'adults' })).toBe('journey');
  });

  it('maps training to power for non-kids', () => {
    expect(inferMode({ context: 'training', ageMode: 'adults' })).toBe('power');
  });

  it('uses alignment for kids training guardian default', () => {
    expect(inferMode({ context: 'training', ageMode: 'kids' })).toBe('alignment');
  });

  it('still allows explicit power for kids', () => {
    expect(inferMode({ userSelected: 'power', context: 'training', ageMode: 'kids' })).toBe('power');
  });

  it('maps reflection to journey', () => {
    expect(inferMode({ context: 'reflection' })).toBe('journey');
  });

  it('defaults to alignment', () => {
    expect(inferMode({})).toBe('alignment');
  });
});
