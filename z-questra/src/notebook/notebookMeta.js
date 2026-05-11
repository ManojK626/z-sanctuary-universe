const HIGHLIGHT_OPEN_RE = /\[\[(\w+)\]\]/g;

/**
 * Aggregates local notebook metadata for receipt poster / PlayGarden (no network).
 */
export function collectNotebookMeta(pages) {
  const list = Array.isArray(pages) ? pages : [];
  const highlightTones = new Set();
  for (const p of list) {
    const body = typeof p?.body === 'string' ? p.body : '';
    let m;
    const re = new RegExp(HIGHLIGHT_OPEN_RE.source, 'g');
    while ((m = re.exec(body)) !== null) {
      highlightTones.add(m[1]);
    }
  }
  return {
    pageCount: list.length,
    highlightTones: [...highlightTones].sort(),
    firstPageTitle: typeof list[0]?.title === 'string' && list[0].title.trim() ? list[0].title.trim() : 'Page 1',
  };
}
