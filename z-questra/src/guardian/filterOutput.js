/**
 * Guardian-aware text pipeline for previews — no HTML execution; strips risky patterns.
 */

const MAX_LEN = 50_000;

export function filterOutput(raw) {
  if (typeof raw !== 'string') return '';
  let s = raw;
  s = s.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '[removed]');
  s = s.replace(/<\/?script\b[^>]*>/gi, '[removed]');
  s = s.replace(/on\w+\s*=/gi, '');
  s = s.replace(/javascript\s*:/gi, '');
  s = s.replace(/data\s*:\s*text\/html/gi, '[removed]');
  if (s.length > MAX_LEN) {
    return `${s.slice(0, MAX_LEN)}\n…`;
  }
  return s;
}
