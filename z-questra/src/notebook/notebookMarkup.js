/**
 * Multicolor highlight markup: [[tone]]segment[[/tone]] — tone matches colorIdentityTokens keys.
 */

const PAIR_RE = /\[\[(\w+)\]\]([\s\S]*?)\[\[\/\1\]\]/g;

export function splitHighlightMarkup(s) {
  if (!s) return [{ type: 'text', text: '' }];
  const parts = [];
  let last = 0;
  let m;
  const re = new RegExp(PAIR_RE.source, 'g');
  while ((m = re.exec(s)) !== null) {
    if (m.index > last) {
      parts.push({ type: 'text', text: s.slice(last, m.index) });
    }
    parts.push({ type: 'hl', tone: m[1], text: m[2] });
    last = re.lastIndex;
  }
  if (last < s.length) {
    parts.push({ type: 'text', text: s.slice(last) });
  }
  return parts.length ? parts : [{ type: 'text', text: s }];
}

export const WRAP_TONES = ['gold', 'aqua', 'mint', 'rose', 'lavender', 'sky'];

export function wrapWithTone(body, start, end, tone) {
  const before = body.slice(0, start);
  const mid = body.slice(start, end);
  const after = body.slice(end);
  const wrapped = `[[${tone}]]${mid}[[/${tone}]]`;
  return { nextBody: before + wrapped + after, caret: start + wrapped.length };
}
