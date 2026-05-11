import { describe, expect, it } from 'vitest';
import { buildReceiptPosterSvg, escapeXml } from './receiptPosterExport.js';

describe('receiptPosterExport', () => {
  it('escapes XML', () => {
    expect(escapeXml('a & b < c')).toBe('a &amp; b &lt; c');
  });

  it('builds SVG with payload fields', () => {
    const svg = buildReceiptPosterSvg({
      title: 'Test',
      subtitle: 'Sub',
      timestamp: 'now',
      pageCount: 3,
      highlightTones: ['gold'],
      ageMode: 'kids',
      footerLines: ['Line one', 'Line two'],
    });
    expect(svg).toContain('Test');
    expect(svg).toContain('Notebook pages');
    expect(svg).toContain('gold');
    expect(svg).toContain('Line one');
  });
});
