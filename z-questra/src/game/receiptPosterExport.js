/**
 * Local-only SVG/PNG helpers for the receipt poster (no cloud).
 */

export function escapeXml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function buildReceiptPosterSvg(payload) {
  const {
    title = 'Z-QUESTRA · Local session receipt',
    subtitle = '',
    timestamp = '',
    pageCount = 0,
    highlightTones = [],
    ageMode = '',
    footerLines = [],
  } = payload;

  const tonesLine = highlightTones.length ? highlightTones.join(', ') : 'none listed';
  const footers = footerLines
    .map(
      (line, i) =>
        `<text x="40" y="${286 + i * 22}" fill="hsl(142 42% 62%)" font-family="Segoe UI, system-ui, sans-serif" font-size="13">${escapeXml(line)}</text>`,
    )
    .join('\n  ');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 640 420">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:hsl(268 35% 18%)"/>
      <stop offset="100%" style="stop-color:hsl(210 30% 14%)"/>
    </linearGradient>
  </defs>
  <rect width="640" height="420" fill="url(#bg)" rx="16"/>
  <rect x="24" y="24" width="592" height="372" fill="none" stroke="hsl(43 55% 55%)" stroke-width="2" rx="12" opacity="0.65"/>
  <text x="40" y="64" fill="hsl(42 28% 88%)" font-family="Segoe UI, system-ui, sans-serif" font-size="22" font-weight="700">${escapeXml(title)}</text>
  <text x="40" y="98" fill="hsl(185 40% 72%)" font-family="Segoe UI, system-ui, sans-serif" font-size="15">${escapeXml(subtitle)}</text>
  <text x="40" y="138" fill="hsl(46 22% 82%)" font-family="Segoe UI, system-ui, sans-serif" font-size="14">${escapeXml(`Local time: ${timestamp}`)}</text>
  <text x="40" y="168" fill="hsl(46 22% 82%)" font-family="Segoe UI, system-ui, sans-serif" font-size="14">${escapeXml(`Age mode: ${ageMode || '—'}`)}</text>
  <text x="40" y="198" fill="hsl(46 22% 82%)" font-family="Segoe UI, system-ui, sans-serif" font-size="14">${escapeXml(`Notebook pages (local): ${pageCount}`)}</text>
  <text x="40" y="228" fill="hsl(46 22% 82%)" font-family="Segoe UI, system-ui, sans-serif" font-size="14">${escapeXml(`Highlight tones used: ${tonesLine}`)}</text>
  ${footers}
</svg>`;
}
