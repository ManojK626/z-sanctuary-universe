import { describe, expect, it } from 'vitest';
import { splitHighlightMarkup, wrapWithTone } from './notebookMarkup.js';

describe('notebookMarkup', () => {
  it('splits nested-safe flat pairs', () => {
    const parts = splitHighlightMarkup('a [[gold]]b[[/gold]] c');
    expect(parts).toEqual([
      { type: 'text', text: 'a ' },
      { type: 'hl', tone: 'gold', text: 'b' },
      { type: 'text', text: ' c' },
    ]);
  });

  it('wrapWithTone inserts markers', () => {
    const { nextBody, caret } = wrapWithTone('hello world', 6, 11, 'mint');
    expect(nextBody).toBe('hello [[mint]]world[[/mint]]');
    expect(caret).toBe(nextBody.length);
  });
});
