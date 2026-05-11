import { describe, expect, it } from 'vitest';
import {
  applyImportMerge,
  applyImportReplace,
  buildImportPreviewSummary,
  validateNotebookImportPayload,
} from './importNotebookJson.js';

const validExport = {
  app: 'z-questra',
  kind: 'local-notebook',
  version: 1,
  exportedAt: '2026-05-01T00:00:00.000Z',
  pages: [
    { id: 'a1', title: 'First', body: 'hello [[gold]]x[[/gold]]' },
    { id: 'b2', title: 'Second', body: '' },
  ],
};

describe('validateNotebookImportPayload', () => {
  it('accepts canonical export', () => {
    const r = validateNotebookImportPayload(validExport);
    expect(r.ok).toBe(true);
    expect(r.pages).toHaveLength(2);
  });

  it('rejects wrong app or kind', () => {
    expect(validateNotebookImportPayload({ ...validExport, app: 'other' }).ok).toBe(false);
    expect(validateNotebookImportPayload({ ...validExport, kind: 'cloud' }).ok).toBe(false);
  });

  it('rejects bad pages', () => {
    expect(validateNotebookImportPayload({ ...validExport, pages: [] }).ok).toBe(false);
    expect(
      validateNotebookImportPayload({
        ...validExport,
        pages: [{ id: '', title: 'x', body: '' }],
      }).ok,
    ).toBe(false);
  });
});

describe('buildImportPreviewSummary', () => {
  it('uses filterOutput for snippet', () => {
    const pages = [{ id: '1', title: 'T', body: '<script>x</script>ok' }];
    const s = buildImportPreviewSummary(pages);
    expect(s.guardianSnippet).toContain('[removed]');
    expect(s.pageCount).toBe(1);
  });

  it('marks truncated guardian snippet', () => {
    const long = 'z'.repeat(400);
    const s = buildImportPreviewSummary([{ id: '1', title: 'T', body: long }], { snippetLen: 80 });
    expect(s.guardianSnippetTruncated).toBe(true);
    expect(s.guardianSnippet.length).toBeLessThanOrEqual(80);
  });
});

describe('applyImportReplace / applyImportMerge', () => {
  it('replace keeps ids', () => {
    const next = applyImportReplace(validExport.pages);
    expect(next[0].id).toBe('a1');
  });

  it('merge assigns new ids', () => {
    const existing = [{ id: 'keep', title: 'Old', body: '' }];
    const next = applyImportMerge(existing, validExport.pages);
    expect(next).toHaveLength(3);
    expect(next[0].id).toBe('keep');
    expect(next[1].id).not.toBe('a1');
    expect(next[2].id).not.toBe('b2');
  });
});
