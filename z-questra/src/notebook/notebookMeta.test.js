import { describe, expect, it } from 'vitest';
import { collectNotebookMeta } from './notebookMeta.js';

describe('collectNotebookMeta', () => {
  it('counts pages and extracts highlight tones', () => {
    const meta = collectNotebookMeta([
      { id: 'a', title: 'Study', body: '[[gold]]x[[/gold]] and [[mint]]y[[/mint]]' },
      { id: 'b', title: 'B', body: 'plain [[gold]]z[[/gold]]' },
    ]);
    expect(meta.pageCount).toBe(2);
    expect(meta.highlightTones).toEqual(['gold', 'mint']);
    expect(meta.firstPageTitle).toBe('Study');
  });

  it('defaults first title when empty', () => {
    expect(collectNotebookMeta([{ id: 'x', title: '  ', body: '' }]).firstPageTitle).toBe('Page 1');
  });
});
