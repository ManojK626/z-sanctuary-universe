import React, { useEffect, useMemo, useRef, useState } from 'react';
import HighlightText from './HighlightText.jsx';
import { filterOutput } from '../guardian/filterOutput.js';
import { splitHighlightMarkup, WRAP_TONES, wrapWithTone } from '../notebook/notebookMarkup.js';
import {
  applyImportMerge,
  applyImportReplace,
  buildImportPreviewSummary,
  validateNotebookImportPayload,
} from '../notebook/importNotebookJson.js';
import { collectNotebookMeta } from '../notebook/notebookMeta.js';
import {
  buildNotebookExportPayload,
  loadNotebookPages,
  readNotebookRemember,
  saveNotebookPages,
  writeNotebookRemember,
} from '../storage/notebookStorage.js';

function newPageId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `p-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function defaultPages() {
  return [{ id: newPageId(), title: 'Page 1', body: '' }];
}

function renderPreviewParts(filteredBody) {
  return splitHighlightMarkup(filteredBody).map((part, i) => {
    if (part.type === 'text') {
      return (
        <span key={i} style={{ whiteSpace: 'pre-wrap' }}>
          {part.text}
        </span>
      );
    }
    return (
      <HighlightText key={i} tone={part.tone} variant="emphasis">
        <span style={{ whiteSpace: 'pre-wrap' }}>{part.text}</span>
      </HighlightText>
    );
  });
}

export default function LocalNotebookPanel({ onNotebookMetaChange }) {
  const bodyRef = useRef(null);
  const importFileRef = useRef(null);
  const [rememberNotebook, setRememberNotebook] = useState(() => readNotebookRemember());
  const [pages, setPages] = useState(() => {
    const loaded = loadNotebookPages();
    return loaded && loaded.length ? loaded.map((p) => ({ ...p, body: typeof p.body === 'string' ? p.body : '' })) : defaultPages();
  });
  const [activeId, setActiveId] = useState(() => pages[0]?.id ?? null);
  const [importError, setImportError] = useState(null);
  const [importReview, setImportReview] = useState(null);
  const [importStrategy, setImportStrategy] = useState('replace');

  const activeIndex = pages.findIndex((p) => p.id === activeId);
  const safeIndex = activeIndex >= 0 ? activeIndex : 0;
  const active = pages[safeIndex] ?? pages[0];

  useEffect(() => {
    if (!rememberNotebook) return;
    saveNotebookPages(pages);
  }, [rememberNotebook, pages]);

  useEffect(() => {
    if (!pages.some((p) => p.id === activeId)) {
      setActiveId(pages[0]?.id ?? null);
    }
  }, [pages, activeId]);

  useEffect(() => {
    onNotebookMetaChange?.(collectNotebookMeta(pages));
  }, [pages, onNotebookMetaChange]);

  const filteredBody = useMemo(() => filterOutput(active?.body ?? ''), [active?.body]);

  function updateActive(patch) {
    setPages((prev) => prev.map((p) => (p.id === active.id ? { ...p, ...patch } : p)));
  }

  function addPage() {
    const id = newPageId();
    setPages((prev) => [...prev, { id, title: `Page ${prev.length + 1}`, body: '' }]);
    setActiveId(id);
  }

  function removePage(id) {
    setPages((prev) => {
      if (prev.length <= 1) return prev;
      const next = prev.filter((p) => p.id !== id);
      return next.length ? next : defaultPages();
    });
    if (id === activeId) {
      setActiveId(null);
    }
  }

  function onRememberChange(e) {
    const on = e.target.checked;
    setRememberNotebook(on);
    writeNotebookRemember(on);
    if (on) {
      saveNotebookPages(pages);
    }
  }

  function resetImportUi() {
    setImportError(null);
    setImportReview(null);
    if (importFileRef.current) importFileRef.current.value = '';
  }

  function onImportFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError(null);
    setImportReview(null);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = typeof reader.result === 'string' ? reader.result : '';
        const data = JSON.parse(text);
        const validated = validateNotebookImportPayload(data);
        if (!validated.ok) {
          setImportError(validated.error);
          return;
        }
        const summary = buildImportPreviewSummary(validated.pages, {
          exportedAt: typeof data.exportedAt === 'string' ? data.exportedAt : null,
        });
        setImportReview({ pages: validated.pages, summary, fileName: file.name });
        setImportStrategy('replace');
      } catch {
        setImportError('Could not read JSON — check the file is valid UTF-8 export.');
      }
    };
    reader.onerror = () => setImportError('File read failed.');
    reader.readAsText(file, 'UTF-8');
  }

  function applyNotebookImport() {
    if (!importReview?.pages?.length) return;
    const imported = importReview.pages;
    const strat = importStrategy;
    resetImportUi();
    if (strat === 'replace') {
      const next = applyImportReplace(imported);
      setPages(next);
      setActiveId(next[0]?.id ?? null);
      return;
    }
    setPages((prev) => {
      const next = applyImportMerge(prev, imported);
      const lastId = next[next.length - 1]?.id ?? null;
      if (lastId) {
        requestAnimationFrame(() => setActiveId(lastId));
      }
      return next;
    });
  }

  function exportJson() {
    const payload = buildNotebookExportPayload(pages);
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `z-questra-notebook-${new Date().toISOString().slice(0, 10)}.json`;
    a.rel = 'noopener';
    a.click();
    URL.revokeObjectURL(url);
  }

  function applyTone(tone) {
    const ta = bodyRef.current;
    const body = active.body ?? '';
    const start = ta ? ta.selectionStart : body.length;
    const end = ta ? ta.selectionEnd : body.length;
    const { nextBody, caret } = wrapWithTone(body, start, end, tone);
    updateActive({ body: nextBody });
    requestAnimationFrame(() => {
      if (!bodyRef.current) return;
      bodyRef.current.focus();
      bodyRef.current.setSelectionRange(caret, caret);
    });
  }

  return (
    <section
      id="zq-local-notebook"
      className="zq-local-notebook"
      aria-labelledby="zq-notebook-title"
      style={{
        marginTop: '1rem',
        padding: '0.85rem 1rem',
        borderRadius: 'var(--zq-radius)',
        border: '1px solid color-mix(in hsl, hsl(350 55% 58%) 28%, transparent)',
        background: 'color-mix(in hsl, var(--zq-surface) 94%, hsl(310 18% 18%))',
      }}
    >
      <h3 id="zq-notebook-title" style={{ margin: '0 0 0.35rem', fontSize: '1rem', color: 'hsl(350 55% 68%)' }}>
        <span aria-hidden>📓</span> Z tools → Notes · Local Notebook
      </h3>
      <p style={{ margin: '0 0 0.65rem', fontSize: '0.76rem', color: 'var(--zq-text-muted)', lineHeight: 1.45 }}>
        Multiple pages, highlights via <code>[[tone]]…[[/tone]]</code>, guardian-filtered preview. No voice, email,
        calendar, cloud sync, accounts, or Z-Sanctuary bridge. Scheduler stays a readiness placeholder only.
      </p>

      <label className="zq-remember-local" style={{ marginBottom: '0.65rem' }}>
        <input
          type="checkbox"
          checked={rememberNotebook}
          onChange={onRememberChange}
          data-testid="zq-notebook-remember"
        />
        <span>
          Remember notebook on <strong>this device only</strong> (localStorage). Off = session-only; nothing hidden.
        </span>
      </label>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', alignItems: 'center', marginBottom: '0.65rem' }}>
        <span style={{ fontSize: '0.78rem', opacity: 0.85 }}>Pages:</span>
        {pages.map((p) => (
          <button
            key={p.id}
            type="button"
            className="zq-btn-age"
            aria-pressed={p.id === active.id}
            onClick={() => setActiveId(p.id)}
          >
            {p.title?.slice(0, 18) || 'Untitled'}
            {p.title?.length > 18 ? '…' : ''}
          </button>
        ))}
        <button type="button" className="zq-btn-age" onClick={addPage}>
          + Page
        </button>
        {pages.length > 1 ? (
          <button type="button" className="zq-btn-age" onClick={() => removePage(active.id)}>
            Remove page
          </button>
        ) : null}
        <button type="button" className="zq-btn-age" onClick={exportJson} data-testid="zq-notebook-export">
          Export JSON
        </button>
        <input
          ref={importFileRef}
          type="file"
          accept="application/json,.json"
          style={{ display: 'none' }}
          aria-hidden
          onChange={onImportFileChange}
        />
        <button
          type="button"
          className="zq-btn-age"
          data-testid="zq-notebook-import"
          onClick={() => importFileRef.current?.click()}
        >
          Import JSON
        </button>
      </div>

      {importError ? (
        <div
          role="alert"
          style={{
            marginBottom: '0.65rem',
            padding: '0.45rem 0.55rem',
            borderRadius: 'var(--zq-radius)',
            border: '1px solid color-mix(in hsl, hsl(0 55% 52%) 40%, transparent)',
            background: 'color-mix(in hsl, hsl(0 45% 48%) 10%, var(--zq-surface))',
            fontSize: '0.78rem',
          }}
        >
          {importError}
        </div>
      ) : null}

      {importReview ? (
        <div
          data-testid="zq-notebook-import-review"
          style={{
            marginBottom: '0.85rem',
            padding: '0.65rem 0.75rem',
            borderRadius: 'var(--zq-radius)',
            border: '1px solid color-mix(in hsl, hsl(205 55% 52%) 35%, transparent)',
            background: 'color-mix(in hsl, hsl(205 40% 42%) 10%, var(--zq-surface))',
          }}
        >
          <div style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem' }}>Import review</div>
          <p style={{ margin: '0 0 0.35rem', fontSize: '0.76rem', color: 'var(--zq-text-muted)' }}>
            File: <strong>{importReview.fileName}</strong>
            {importReview.summary.exportedAt ? (
              <>
                {' '}
                · Exported: <strong>{importReview.summary.exportedAt}</strong>
              </>
            ) : null}
          </p>
          <p style={{ margin: '0 0 0.35rem', fontSize: '0.78rem' }}>
            <strong>{importReview.summary.pageCount}</strong> page(s). Titles:{' '}
            {importReview.summary.titles.join(', ')}
            {importReview.summary.titlesOmitted > 0
              ? ` (+${importReview.summary.titlesOmitted} more)`
              : ''}
          </p>
          <div style={{ fontSize: '0.72rem', marginBottom: '0.45rem', color: 'var(--zq-text-muted)' }}>
            Guardian snippet (first page, <code>filterOutput</code> only):
          </div>
          <pre
            style={{
              margin: '0 0 0.55rem',
              padding: '0.45rem',
              borderRadius: '6px',
              fontSize: '0.76rem',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              background: 'color-mix(in hsl, var(--zq-bg) 88%, transparent)',
              border: '1px solid color-mix(in hsl, hsl(142 45% 48%) 28%, transparent)',
            }}
          >
            {importReview.summary.guardianSnippet || '(empty)'}
            {importReview.summary.guardianSnippetTruncated ? '…' : ''}
          </pre>

          <fieldset style={{ margin: '0 0 0.55rem', padding: 0, border: 'none' }}>
            <legend style={{ fontSize: '0.78rem', marginBottom: '0.35rem', fontWeight: 600 }}>
              Apply imported pages
            </legend>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', marginBottom: '0.25rem' }}>
              <input
                type="radio"
                name="zq-import-strategy"
                checked={importStrategy === 'replace'}
                onChange={() => setImportStrategy('replace')}
              />
              Replace all current pages
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem' }}>
              <input
                type="radio"
                name="zq-import-strategy"
                checked={importStrategy === 'merge'}
                onChange={() => setImportStrategy('merge')}
              />
              Merge (append copies with new ids)
            </label>
          </fieldset>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            <button type="button" className="zq-btn-age" data-testid="zq-notebook-import-apply" onClick={applyNotebookImport}>
              Apply import
            </button>
            <button type="button" className="zq-btn-age" onClick={resetImportUi}>
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.78rem' }}>
        Title
        <input
          type="text"
          value={active?.title ?? ''}
          onChange={(e) => updateActive({ title: e.target.value })}
          style={{
            display: 'block',
            width: '100%',
            marginTop: '0.25rem',
            padding: '0.4rem 0.5rem',
            borderRadius: 'var(--zq-radius)',
            border: '1px solid color-mix(in hsl, var(--zq-accent) 25%, transparent)',
            background: 'var(--zq-surface)',
            color: 'var(--zq-text)',
          }}
        />
      </label>

      <div className="zq-notebook-editor-grid" style={{ display: 'grid', gap: '0.65rem' }}>
        <div>
          <div style={{ fontSize: '0.78rem', marginBottom: '0.25rem', opacity: 0.9 }}>Body · wrap selection:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.35rem' }}>
            {WRAP_TONES.map((t) => (
              <button key={t} type="button" className="zq-btn-age" onClick={() => applyTone(t)}>
                {t}
              </button>
            ))}
          </div>
          <textarea
            ref={bodyRef}
            value={active?.body ?? ''}
            onChange={(e) => updateActive({ body: e.target.value })}
            rows={10}
            style={{
              width: '100%',
              resize: 'vertical',
              padding: '0.5rem',
              borderRadius: 'var(--zq-radius)',
              border: '1px solid color-mix(in hsl, var(--zq-accent) 22%, transparent)',
              background: 'var(--zq-bg)',
              color: 'var(--zq-text)',
              fontFamily: 'inherit',
              fontSize: '0.88rem',
              lineHeight: 1.45,
            }}
            aria-label="Notebook body"
          />
        </div>

        <div>
          <div style={{ fontSize: '0.78rem', marginBottom: '0.25rem', opacity: 0.9 }}>Guardian preview (filterOutput)</div>
          <div
            role="region"
            aria-label="Filtered notebook preview"
            style={{
              minHeight: '6rem',
              padding: '0.55rem 0.65rem',
              borderRadius: 'var(--zq-radius)',
              border: '1px solid color-mix(in hsl, hsl(142 45% 48%) 35%, transparent)',
              background: 'color-mix(in hsl, hsl(142 35% 42%) 8%, var(--zq-surface))',
              fontSize: '0.88rem',
              lineHeight: 1.45,
            }}
          >
            {renderPreviewParts(filteredBody)}
          </div>
          <p style={{ margin: '0.35rem 0 0', fontSize: '0.72rem', color: 'var(--zq-text-muted)' }}>
            Preview runs through <code>filterOutput</code> before highlight parsing — no HTML execution.
          </p>
        </div>
      </div>
    </section>
  );
}
