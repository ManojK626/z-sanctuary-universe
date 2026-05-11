import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  NOTEBOOK_DATA_KEY,
  buildNotebookExportPayload,
  loadNotebookPages,
  readNotebookRemember,
  saveNotebookPages,
  writeNotebookRemember,
} from './notebookStorage.js';

describe('notebookStorage', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it('remember toggles and clears data when off', () => {
    vi.stubGlobal('localStorage', localStorage);
    expect(readNotebookRemember()).toBe(false);
    writeNotebookRemember(true);
    expect(readNotebookRemember()).toBe(true);
    saveNotebookPages([{ id: 'a', title: 'T', body: '' }]);
    expect(localStorage.getItem(NOTEBOOK_DATA_KEY)).toBeTruthy();
    writeNotebookRemember(false);
    expect(readNotebookRemember()).toBe(false);
    expect(localStorage.getItem(NOTEBOOK_DATA_KEY)).toBe(null);
  });

  it('loadNotebookPages returns stored pages', () => {
    vi.stubGlobal('localStorage', localStorage);
    writeNotebookRemember(true);
    localStorage.setItem(
      NOTEBOOK_DATA_KEY,
      JSON.stringify({ version: 1, pages: [{ id: 'x', title: 'One', body: 'b' }] }),
    );
    expect(loadNotebookPages()).toEqual([{ id: 'x', title: 'One', body: 'b' }]);
  });

  it('buildNotebookExportPayload shapes JSON backup', () => {
    const p = buildNotebookExportPayload([{ id: '1', title: 'A', body: '' }]);
    expect(p.app).toBe('z-questra');
    expect(p.kind).toBe('local-notebook');
    expect(p.pages).toHaveLength(1);
  });
});
