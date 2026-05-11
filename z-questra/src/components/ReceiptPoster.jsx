import React, { useCallback, useMemo, useState } from 'react';
import { buildReceiptPosterSvg } from '../game/receiptPosterExport.js';

function padIsoLocal(d) {
  try {
    return d.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return d.toISOString();
  }
}

function drawPosterOnCanvas(ctx, payload) {
  const { title, subtitle, timestamp, pageCount, highlightTones, ageMode, footerLines } = payload;
  const tonesLine = highlightTones.length ? highlightTones.join(', ') : 'none listed';

  const grd = ctx.createLinearGradient(0, 0, 640, 420);
  grd.addColorStop(0, 'hsl(268 35% 18%)');
  grd.addColorStop(1, 'hsl(210 30% 14%)');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, 640, 420);

  ctx.strokeStyle = 'hsla(43, 55%, 55%, 0.65)';
  ctx.lineWidth = 2;
  ctx.strokeRect(24, 24, 592, 372);

  ctx.fillStyle = 'hsl(42 28% 88%)';
  ctx.font = '700 22px "Segoe UI", system-ui, sans-serif';
  ctx.fillText(title, 40, 64);

  ctx.fillStyle = 'hsl(185 40% 72%)';
  ctx.font = '15px "Segoe UI", system-ui, sans-serif';
  ctx.fillText(subtitle, 40, 98);

  ctx.fillStyle = 'hsl(46 22% 82%)';
  ctx.font = '14px "Segoe UI", system-ui, sans-serif';
  let y = 138;
  ctx.fillText(`Local time: ${timestamp}`, 40, y);
  y += 30;
  ctx.fillText(`Age mode: ${ageMode || '—'}`, 40, y);
  y += 30;
  ctx.fillText(`Notebook pages (local): ${pageCount}`, 40, y);
  y += 30;
  ctx.fillText(`Highlight tones used: ${tonesLine}`, 40, y);

  ctx.fillStyle = 'hsl(142 42% 62%)';
  ctx.font = '13px "Segoe UI", system-ui, sans-serif';
  y = 286;
  for (const line of footerLines) {
    ctx.fillText(line, 40, y);
    y += 22;
  }
}

export default function ReceiptPoster({ notebookMeta, ageMode }) {
  const meta = notebookMeta && typeof notebookMeta === 'object' ? notebookMeta : {};
  const pageCount = Number(meta.pageCount) > 0 ? meta.pageCount : 0;
  const highlightTones = Array.isArray(meta.highlightTones) ? meta.highlightTones : [];
  const subtitle = typeof meta.firstPageTitle === 'string' ? meta.firstPageTitle : '';
  const [issuedAt] = useState(() => new Date());

  const payload = useMemo(
    () => ({
      title: 'Z-QUESTRA · Local session receipt',
      subtitle: subtitle ? `Notebook front page: ${subtitle}` : 'Notebook front page: —',
      timestamp: padIsoLocal(issuedAt),
      pageCount,
      highlightTones,
      ageMode: typeof ageMode === 'string' ? ageMode : '',
      footerLines: [
        'Local-only creative proof — not a score, prize, forecast, or certainty.',
        'Z-Zebras: readiness family preview only — no certification or bridge claims.',
        'Guardian path: stay kind, stay honest, stay local until gates say otherwise.',
      ],
    }),
    [issuedAt, subtitle, pageCount, highlightTones, ageMode],
  );

  const downloadSvg = useCallback(() => {
    const svg = buildReceiptPosterSvg(payload);
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `z-questra-receipt-${new Date().toISOString().slice(0, 10)}.svg`;
    a.rel = 'noopener';
    a.click();
    URL.revokeObjectURL(url);
  }, [payload]);

  const downloadPng = useCallback(() => {
    const c = document.createElement('canvas');
    c.width = 640;
    c.height = 420;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    drawPosterOnCanvas(ctx, payload);
    c.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `z-questra-receipt-${new Date().toISOString().slice(0, 10)}.png`;
      a.rel = 'noopener';
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  }, [payload]);

  return (
    <div className="zq-receipt-poster" data-testid="zq-receipt-poster">
      <h4 style={{ margin: '0 0 0.35rem', fontSize: '0.88rem', color: 'hsl(43 58% 62%)' }}>Receipt Poster</h4>
      <p style={{ margin: '0 0 0.55rem', fontSize: '0.74rem', color: 'var(--zq-text-muted)', lineHeight: 1.45 }}>
        A proud local memento from your session — download SVG or PNG on this device only. No cloud upload.
      </p>

      <div
        style={{
          borderRadius: 'var(--zq-radius)',
          border: '1px solid color-mix(in hsl, hsl(43 55% 52%) 32%, transparent)',
          padding: '0.65rem 0.75rem',
          marginBottom: '0.55rem',
          background: 'color-mix(in hsl, hsl(268 22% 20%) 85%, var(--zq-surface))',
          fontSize: '0.78rem',
          lineHeight: 1.5,
          color: 'var(--zq-text)',
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{payload.title}</div>
        <div style={{ color: 'var(--zq-text-muted)', marginBottom: '0.35rem' }}>{payload.subtitle}</div>
        <div>Local time: {payload.timestamp}</div>
        <div>Age mode: {payload.ageMode || '—'}</div>
        <div>Notebook pages (local): {payload.pageCount}</div>
        <div>Highlight tones used: {payload.highlightTones.length ? payload.highlightTones.join(', ') : 'none listed'}</div>
        {payload.footerLines.map((line) => (
          <div key={line} style={{ marginTop: '0.35rem', color: 'hsl(142 38% 58%)', fontSize: '0.74rem' }}>
            {line}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
        <button type="button" className="zq-btn-age" data-testid="zq-receipt-download-svg" onClick={downloadSvg}>
          Download SVG
        </button>
        <button type="button" className="zq-btn-age" data-testid="zq-receipt-download-png" onClick={downloadPng}>
          Download PNG
        </button>
      </div>
    </div>
  );
}
