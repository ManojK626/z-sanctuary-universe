import { filterOutput } from '../guardian/filterOutput.js';

export const MAX_IMPORT_PAGES = 200;
export const MAX_IMPORT_BODY_CHARS = 100_000;

function makePageId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `p-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Validates Z-QUESTRA Local Notebook export payloads only (no cloud schema).
 */
export function validateNotebookImportPayload(data) {
  if (!data || typeof data !== 'object') {
    return { ok: false, error: 'Not a JSON object.' };
  }
  if (data.app !== 'z-questra') {
    return { ok: false, error: 'Unknown app — expected z-questra export.' };
  }
  if (data.kind !== 'local-notebook') {
    return { ok: false, error: 'Unknown kind — expected local-notebook.' };
  }
  if (data.version !== 1) {
    return { ok: false, error: 'Unsupported notebook version.' };
  }
  if (!Array.isArray(data.pages)) {
    return { ok: false, error: 'Missing pages array.' };
  }
  if (data.pages.length === 0) {
    return { ok: false, error: 'Export has no pages.' };
  }
  if (data.pages.length > MAX_IMPORT_PAGES) {
    return { ok: false, error: `Too many pages (max ${MAX_IMPORT_PAGES}).` };
  }

  const pages = [];
  for (let i = 0; i < data.pages.length; i++) {
    const p = data.pages[i];
    if (!p || typeof p !== 'object') {
      return { ok: false, error: `Invalid page at index ${i}.` };
    }
    if (typeof p.id !== 'string' || !p.id.trim()) {
      return { ok: false, error: `Page ${i}: id must be a non-empty string.` };
    }
    if (typeof p.title !== 'string') {
      return { ok: false, error: `Page ${i}: title must be a string.` };
    }
    const body = typeof p.body === 'string' ? p.body : '';
    if (body.length > MAX_IMPORT_BODY_CHARS) {
      return { ok: false, error: `Page ${i}: body exceeds safe length.` };
    }
    pages.push({ id: p.id.trim(), title: p.title, body });
  }

  return { ok: true, pages };
}

/** Guardian-first summary for operator review before apply (display only). */
export function buildImportPreviewSummary(pages, options = {}) {
  const maxTitles = options.maxTitles ?? 8;
  const snippetLen = options.snippetLen ?? 180;
  const titles = pages.slice(0, maxTitles).map((p) => (p.title?.trim() ? p.title : 'Untitled'));
  const titlesOmitted = pages.length > maxTitles ? pages.length - maxTitles : 0;
  const firstBody = pages[0]?.body ?? '';
  const guardianFull = filterOutput(firstBody);
  const guardianSnippet = guardianFull.slice(0, snippetLen);
  return {
    pageCount: pages.length,
    titles,
    titlesOmitted,
    guardianSnippet,
    guardianSnippetTruncated: guardianFull.length > guardianSnippet.length,
    exportedAt: typeof options.exportedAt === 'string' ? options.exportedAt : null,
  };
}

/** Replace notebook entirely with validated pages (keeps export ids). */
export function applyImportReplace(importedPages) {
  return importedPages.map((p) => ({
    id: p.id,
    title: p.title,
    body: typeof p.body === 'string' ? p.body : '',
  }));
}

/** Append imported pages with fresh ids so tabs stay unique. */
export function applyImportMerge(existingPages, importedPages) {
  const clones = importedPages.map((p) => ({
    id: makePageId(),
    title: p.title,
    body: typeof p.body === 'string' ? p.body : '',
  }));
  return [...existingPages, ...clones];
}
