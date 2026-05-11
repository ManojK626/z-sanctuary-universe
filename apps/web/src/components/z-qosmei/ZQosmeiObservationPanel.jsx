'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  WHEEL_EU,
  WHEEL_US,
  allPocketIndices,
  capDroughtReport,
  droughtsAtEnd,
  formatPocketLabel,
  generateDemoSpins,
  lastRecurrenceGaps,
  maxRunLengthPerPocket,
  perPocketCounts,
  sessionFingerprint,
  stepDivide,
  stepMultiply,
  stepPlusMinus,
  validateSpins,
} from '../../lib/z_qosmei_observation.js';
import { parseDbzSegmentFile } from '../../lib/dbz_segment_import.js';
import ManifestClaimsScope, {
  CLAIMS_FALLBACK_OBSERVATION,
  CLAIMS_FALLBACK_OPERATIONAL,
} from './ManifestClaimsScope.jsx';

/** Virtualized table body — constant row height for scroll math (long histories stay smooth). */
const V_ROW_PX = 26;
const V_OVERSCAN = 6;

/** Virtualized spin log (chronological stream). */
const SPIN_LOG_ROW = 22;
const SPIN_LOG_OVERSCAN = 10;

export default function ZQosmeiObservationPanel() {
  const [manifest, setManifest] = useState(null);
  const [manifestErr, setManifestErr] = useState(null);
  const [wheel, setWheel] = useState(WHEEL_EU);
  const [spins, setSpins] = useState(() => generateDemoSpins(WHEEL_EU, 220, 42));
  const [demoSeed, setDemoSeed] = useState(42);
  const [paste, setPaste] = useState('');
  const [ladder, setLadder] = useState(0);
  const [importBusy, setImportBusy] = useState(false);
  const [importNote, setImportNote] = useState(null);
  const [segmentSnapshot, setSegmentSnapshot] = useState(null);
  const [vScrollTop, setVScrollTop] = useState(0);
  const [vViewH, setVViewH] = useState(320);
  const vScrollRef = useRef(null);
  const [showSpinLog, setShowSpinLog] = useState(true);
  const [slScrollTop, setSlScrollTop] = useState(0);
  const [slViewH, setSlViewH] = useState(200);
  const slRef = useRef(null);

  const loadManifest = useCallback(() => {
    fetch('/api/z-qosmei/manifest')
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then(setManifest)
      .catch((e) => setManifestErr(e.message));
  }, []);

  useEffect(() => {
    loadManifest();
  }, [loadManifest]);

  useEffect(() => {
    const el = vScrollRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(() => {
      setVViewH(el.clientHeight || 320);
    });
    ro.observe(el);
    setVViewH(el.clientHeight || 320);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!showSpinLog) return undefined;
    const el = slRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(() => {
      setSlViewH(el.clientHeight || 200);
    });
    ro.observe(el);
    setSlViewH(el.clientHeight || 200);
    return () => ro.disconnect();
  }, [showSpinLog]);

  useEffect(() => {
    const el = vScrollRef.current;
    if (el) el.scrollTop = 0;
    setVScrollTop(0);
  }, [wheel]);

  useEffect(() => {
    const el = slRef.current;
    if (el) el.scrollTop = 0;
    setSlScrollTop(0);
  }, [wheel, spins.length]);

  const lpbsCap = manifest?.observation?.lpbsDisplayCap ?? 48;
  const dbzPrefixLines = manifest?.observation?.dbzPrefixLines ?? 800;
  const claimsScope = manifest?.ethics?.claimsScope;
  const claimsOperational = claimsScope?.operational ?? CLAIMS_FALLBACK_OPERATIONAL;
  const claimsObservation = claimsScope?.observation ?? CLAIMS_FALLBACK_OBSERVATION;

  const validation = validateSpins(wheel, spins);
  const counts = perPocketCounts(wheel, spins);
  const droughts = droughtsAtEnd(wheel, spins);
  const capped = capDroughtReport(droughts, lpbsCap);
  const maxRuns = maxRunLengthPerPocket(wheel, spins);
  const gaps = lastRecurrenceGaps(wheel, spins, 3);

  const rows = useMemo(() => {
    return allPocketIndices(wheel).map((p) => ({
      p,
      label: formatPocketLabel(p),
      count: counts[p],
      drought: droughts[p],
      capped: capped[p],
      maxRun: maxRuns[p],
      lastGaps: gaps[p],
    }));
  }, [wheel, counts, droughts, capped, maxRuns, gaps]);

  const sorted = useMemo(() => {
    return [...rows].sort((a, b) => b.drought - a.drought);
  }, [rows]);

  const insight = useMemo(() => {
    if (!spins.length) return null;
    let maxD = -1;
    let maxP = 0;
    for (const r of rows) {
      if (r.drought > maxD) {
        maxD = r.drought;
        maxP = r.p;
      }
    }
    const hot = rows.reduce((a, b) => (a.count > b.count ? a : b));
    const mix = sessionFingerprint(spins, demoSeed);
    return {
      longestDroughtPocket: formatPocketLabel(maxP),
      longestDrought: maxD,
      hottestPocket: hot.label,
      hottestCount: hot.count,
      sessionMix: mix,
    };
  }, [rows, spins, demoSeed]);

  const applyDemo = () => {
    setSpins(generateDemoSpins(wheel, 220, demoSeed));
  };

  const applyPaste = () => {
    const parts = paste
      .split(/[\s,;]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const parsed = [];
    for (const p of parts) {
      if (p === '00' || p === '37') {
        parsed.push(37);
        continue;
      }
      const n = Number(p);
      if (!Number.isFinite(n)) continue;
      parsed.push(Math.round(n));
    }
    setSpins(parsed);
  };

  const onDbzFile = async (e) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    setImportBusy(true);
    setImportNote('Reading…');
    try {
      const r = await parseDbzSegmentFile(f, {
        prefixLines: dbzPrefixLines,
        onProgress: ({ phase, lines }) => {
          if (phase === 'spins') setImportNote(`Importing spins… ${lines.toLocaleString()}`);
        },
      });
      if (r.mode === 'spins' && r.spins?.length) {
        setWheel(r.wheel);
        setSpins(r.spins);
        setSegmentSnapshot(null);
        setImportNote(`Loaded ${r.spins.length.toLocaleString()} ordered spins (${r.wheel}) · ${f.name}`);
      } else if (r.mode === 'aggregate' && r.pocketCounts) {
        setSegmentSnapshot({
          fileName: f.name,
          pocketCounts: r.pocketCounts,
          meta: r.meta,
          rValue: r.rValue,
          tripleSamples: r.tripleSamples,
          wheel: r.wheel,
        });
        setWheel(r.wheel);
        setImportNote(
          `Segment snapshot from ${f.name} — per-pocket counts from export (no spin order). Drought/LPBS columns still follow the spin list below until you import ordered spins.`
        );
      } else {
        setImportNote((r.warnings && r.warnings.join(' · ')) || 'Could not parse this file.');
      }
    } catch (err) {
      setImportNote(err instanceof Error ? err.message : String(err));
    } finally {
      setImportBusy(false);
    }
  };

  const formulaKeys = manifest?.formulaFamilies ? Object.keys(manifest.formulaFamilies) : [];

  const snapshotMax =
    segmentSnapshot?.pocketCounts?.length > 0
      ? Math.max(...segmentSnapshot.pocketCounts, 1)
      : 1;

  const vRowCount = sorted.length;
  const vStart = Math.max(
    0,
    Math.min(
      Math.max(0, vRowCount - 1),
      Math.floor(vScrollTop / V_ROW_PX) - V_OVERSCAN
    )
  );
  const vEnd = Math.min(
    vRowCount,
    Math.max(
      vStart + 1,
      Math.ceil((vScrollTop + vViewH) / V_ROW_PX) + V_OVERSCAN
    )
  );
  const vSlice = sorted.slice(vStart, vEnd);
  const vTopPad = vStart * V_ROW_PX;
  const vBottomPad = Math.max(0, vRowCount - vEnd) * V_ROW_PX;

  const slCount = spins.length;
  const slStart =
    slCount === 0
      ? 0
      : Math.max(
          0,
          Math.min(
            Math.max(0, slCount - 1),
            Math.floor(slScrollTop / SPIN_LOG_ROW) - SPIN_LOG_OVERSCAN
          )
        );
  const slEnd =
    slCount === 0
      ? 0
      : Math.min(
          slCount,
          Math.max(
            slStart + 1,
            Math.ceil((slScrollTop + slViewH) / SPIN_LOG_ROW) + SPIN_LOG_OVERSCAN
          )
        );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        background: 'linear-gradient(180deg, #0d1522 0%, #0a0f17 100%)',
        color: '#e8f0ff',
        borderLeft: '1px solid rgba(17,214,194,0.25)',
        fontSize: '0.8rem',
      }}
    >
      <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <h2 style={{ margin: 0, fontSize: '1rem', color: '#ffd166' }}>Observation · LPBS window</h2>
        <p style={{ margin: '0.35rem 0 0', color: '#8ab4d8', lineHeight: 1.45 }}>
          Manifest-driven labels; math is explainable counts and droughts (no prediction guarantees).
        </p>
        <ManifestClaimsScope
          variant="panel"
          operational={claimsOperational}
          observation={claimsObservation}
        />
        {formulaKeys.length > 0 ? (
          <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {formulaKeys.map((k) => (
              <span
                key={k}
                style={{
                  padding: '0.15rem 0.45rem',
                  borderRadius: 8,
                  background: 'rgba(17,214,194,0.12)',
                  border: '1px solid rgba(17,214,194,0.35)',
                  fontSize: '0.72rem',
                }}
              >
                {k}
                {manifest.formulaFamilies[k]?.shadow ? ' · shadow' : ''}
              </span>
            ))}
          </div>
        ) : manifestErr ? (
          <p style={{ color: '#ff8a8a', marginBottom: 0 }}>Manifest: {manifestErr}</p>
        ) : (
          <p style={{ color: '#8899aa', marginBottom: 0 }}>Loading manifest…</p>
        )}
      </div>

      <div style={{ padding: '0.6rem 1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
        <span style={{ color: '#a0e4cb' }}>Wheel</span>
        <select
          value={wheel}
          onChange={(e) => {
            const w = e.target.value;
            setWheel(w);
            setSpins(generateDemoSpins(w, 220, demoSeed));
          }}
          style={{
            background: '#111a28',
            color: '#fff',
            border: '1px solid rgba(17,214,194,0.4)',
            borderRadius: 8,
            padding: '0.25rem 0.5rem',
          }}
        >
          <option value={WHEEL_EU}>European (37)</option>
          <option value={WHEEL_US}>American incl. 00 (38)</option>
        </select>
        <label style={{ color: '#a0e4cb', display: 'flex', alignItems: 'center', gap: 6 }}>
          Demo seed
          <input
            type="number"
            value={demoSeed}
            onChange={(e) => setDemoSeed(Number(e.target.value))}
            style={{ width: 72, background: '#111a28', color: '#fff', border: '1px solid #334', borderRadius: 6 }}
          />
        </label>
        <button
          type="button"
          onClick={applyDemo}
          style={{
            padding: '0.25rem 0.65rem',
            borderRadius: 8,
            border: '1px solid #ffd16655',
            background: '#2a2218',
            color: '#ffd166',
            cursor: 'pointer',
          }}
        >
          Regenerate demo
        </button>
      </div>

      <div style={{ padding: '0 0.6rem 0.6rem', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <label style={{ color: '#8ab4d8', fontSize: '0.75rem' }}>
          Paste spins (0–36, use 00 or 37 for double-zero)
        </label>
        <textarea
          value={paste}
          onChange={(e) => setPaste(e.target.value)}
          placeholder="e.g. 12 4 4 00 14 …"
          rows={2}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            background: '#0a1018',
            color: '#dde',
            border: '1px solid #2a3f55',
            borderRadius: 8,
            fontFamily: 'ui-monospace, monospace',
            fontSize: '0.75rem',
            marginTop: 4,
          }}
        />
        <button
          type="button"
          onClick={applyPaste}
          style={{
            marginTop: 6,
            alignSelf: 'flex-start',
            padding: '0.2rem 0.55rem',
            borderRadius: 8,
            border: '1px solid #11d6c2',
            background: '#0c2220',
            color: '#11d6c2',
            cursor: 'pointer',
            fontSize: '0.75rem',
          }}
        >
          Apply pasted history
        </button>
        {!validation.ok ? (
          <p style={{ color: '#ff9b9b', margin: '0.35rem 0 0' }}>
            Invalid spin at index {validation.index}: {validation.value} (wheel {wheel})
          </p>
        ) : null}

        <div style={{ marginTop: '0.75rem', paddingTop: '0.65rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <label style={{ color: '#8ab4d8', fontSize: '0.75rem' }}>
            DBZ segment file (.txt) — aggregate exports read first {dbzPrefixLines} lines only; plain one-number-per-line
            files stream fully (cap 250k spins)
          </label>
          <input
            type="file"
            accept=".txt,text/plain"
            disabled={importBusy}
            onChange={onDbzFile}
            style={{ marginTop: 6, fontSize: '0.75rem', color: '#ccd' }}
          />
          {importNote ? (
            <p style={{ color: '#aab', margin: '0.4rem 0 0', fontSize: '0.72rem', lineHeight: 1.45 }}>{importNote}</p>
          ) : null}
        </div>

        {segmentSnapshot ? (
          <div
            style={{
              marginTop: '0.6rem',
              padding: '0.5rem',
              borderRadius: 10,
              background: 'rgba(17,214,194,0.06)',
              border: '1px solid rgba(17,214,194,0.25)',
              maxHeight: '11rem',
              overflow: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <strong style={{ color: '#11d6c2', fontSize: '0.75rem' }}>Export snapshot · {segmentSnapshot.fileName}</strong>
              <button
                type="button"
                onClick={() => setSegmentSnapshot(null)}
                style={{
                  fontSize: '0.65rem',
                  padding: '0.15rem 0.4rem',
                  borderRadius: 6,
                  border: '1px solid #445',
                  background: '#151d2a',
                  color: '#aab',
                  cursor: 'pointer',
                }}
              >
                Clear
              </button>
            </div>
            <div style={{ fontSize: '0.68rem', color: '#8899aa', marginBottom: 6 }}>
              r={segmentSnapshot.rValue ?? '—'} · meta p/a/m/d/l:{' '}
              {[segmentSnapshot.meta?.p, segmentSnapshot.meta?.a, segmentSnapshot.meta?.m, segmentSnapshot.meta?.d, segmentSnapshot.meta?.l]
                .filter(Boolean)
                .join(' / ') || '—'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {segmentSnapshot.pocketCounts.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 22, color: '#8ab4d8', fontSize: '0.65rem' }}>{formatPocketLabel(i)}</span>
                  <div
                    style={{
                      flex: 1,
                      height: 6,
                      background: '#1a2535',
                      borderRadius: 3,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${(c / snapshotMax) * 100}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #11d6c2, #ffd166)',
                        borderRadius: 3,
                      }}
                    />
                  </div>
                  <span style={{ width: 36, textAlign: 'right', fontSize: '0.65rem', color: '#ccd' }}>{c}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {insight ? (
        <div
          style={{
            margin: '0 1rem 0.6rem',
            padding: '0.5rem 0.65rem',
            borderRadius: 10,
            background: 'rgba(255,209,102,0.08)',
            border: '1px solid rgba(255,209,102,0.25)',
            fontSize: '0.75rem',
            lineHeight: 1.5,
          }}
        >
          <strong style={{ color: '#ffd166' }}>Insight (descriptive)</strong>
          <div>
            Longest current drought: <strong>{insight.longestDroughtPocket}</strong> ({insight.longestDrought} spins)
          </div>
          <div>
            Most hits in this sample: <strong>{insight.hottestPocket}</strong> ({insight.hottestCount}×)
          </div>
          <div style={{ color: '#8899aa', marginTop: 4 }}>
            Stream fingerprint (reproducible with seed): {insight.sessionMix.toFixed(4)} — for aligning demos across
            machines, not randomness certification.
          </div>
        </div>
      ) : null}

      <div style={{ padding: '0 1rem 0.5rem', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ color: '#a0e4cb' }}>Demo ladder (p/m/d, clamp ≥0)</span>
        <span style={{ fontFamily: 'monospace', color: '#ffd166' }}>{ladder}</span>
        <button
          type="button"
          onClick={() => setLadder((s) => stepPlusMinus(s, 1))}
          style={ladderBtn}
        >
          +1
        </button>
        <button
          type="button"
          onClick={() => setLadder((s) => stepPlusMinus(s, -1))}
          style={ladderBtn}
        >
          −1
        </button>
        <button type="button" onClick={() => setLadder((s) => stepMultiply(s))} style={ladderBtn}>
          ×2
        </button>
        <button type="button" onClick={() => setLadder((s) => stepDivide(s))} style={ladderBtn}>
          ÷2
        </button>
        <button type="button" onClick={() => setLadder(0)} style={ladderBtn}>
          reset
        </button>
      </div>

      <div style={{ padding: '0 1rem 0.5rem', flexShrink: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            flexWrap: 'wrap',
            marginBottom: 6,
          }}
        >
          <strong style={{ color: '#11d6c2', fontSize: '0.78rem' }}>
            Spin history ({slCount.toLocaleString()} · oldest → newest)
          </strong>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            {slCount > 0 ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    const el = slRef.current;
                    if (el) el.scrollTop = 0;
                  }}
                  style={spinNavBtn}
                >
                  Top
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const el = slRef.current;
                    if (el) el.scrollTop = el.scrollHeight;
                  }}
                  style={spinNavBtn}
                >
                  Latest
                </button>
              </>
            ) : null}
            <button
              type="button"
              onClick={() => setShowSpinLog((v) => !v)}
              style={spinNavBtn}
            >
              {showSpinLog ? 'Hide log' : 'Show log'}
            </button>
          </div>
        </div>
        {!showSpinLog ? null : slCount === 0 ? (
          <p style={{ margin: 0, fontSize: '0.7rem', color: '#667788' }}>No spins — paste, import, or generate demo.</p>
        ) : (
          <div
            ref={slRef}
            onScroll={(e) => setSlScrollTop(e.currentTarget.scrollTop)}
            style={{
              maxHeight: '12rem',
              minHeight: '6.5rem',
              overflow: 'auto',
              borderRadius: 10,
              border: '1px solid rgba(17,214,194,0.25)',
              background: '#0a1018',
              fontSize: '0.68rem',
            }}
          >
            <div style={{ height: slCount * SPIN_LOG_ROW, position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  transform: `translateY(${slStart * SPIN_LOG_ROW}px)`,
                }}
              >
                {spins.slice(slStart, slEnd).map((pocket, j) => {
                  const i = slStart + j;
                  return (
                    <div
                      key={i}
                      style={{
                        height: SPIN_LOG_ROW,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '0 0.5rem',
                        boxSizing: 'border-box',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        fontFamily: 'ui-monospace, monospace',
                      }}
                    >
                      <span style={{ color: '#667788', width: '4.25rem', flexShrink: 0 }}>{i + 1}</span>
                      <span style={{ color: '#ffd166', width: '2rem', flexShrink: 0 }}>{formatPocketLabel(pocket)}</span>
                      <span style={{ color: '#556677', fontSize: '0.62rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        idx {i} · wheel {wheel}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      <div
        ref={vScrollRef}
        onScroll={(e) => setVScrollTop(e.currentTarget.scrollTop)}
        style={{
          flex: 1,
          minHeight: 0,
          overflow: 'auto',
          padding: '0 0.5rem 0.75rem',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.72rem',
            tableLayout: 'fixed',
          }}
        >
          <thead
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 2,
              background: 'linear-gradient(180deg, #0d1522 0%, #0d1522 85%, transparent 100%)',
            }}
          >
            <tr style={{ color: '#8ab4d8', textAlign: 'left' }}>
              <th style={{ ...th, width: '10%' }}>#</th>
              <th style={{ ...th, width: '12%' }}>N</th>
              <th style={{ ...th, width: '18%' }}>Drought</th>
              <th style={{ ...th, width: '14%' }}>≤{lpbsCap}</th>
              <th style={{ ...th, width: '14%' }}>Max run</th>
              <th style={{ ...th, width: '32%' }}>Last gaps</th>
            </tr>
          </thead>
          <tbody>
            {vTopPad > 0 ? (
              <tr aria-hidden>
                <td colSpan={6} style={{ height: vTopPad, padding: 0, border: 'none', lineHeight: 0 }} />
              </tr>
            ) : null}
            {vSlice.map((r) => (
              <tr
                key={r.p}
                style={{
                  height: V_ROW_PX,
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  verticalAlign: 'middle',
                }}
              >
                <td style={{ ...td, height: V_ROW_PX, overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.p}</td>
                <td style={{ ...td, height: V_ROW_PX }}>{r.label}</td>
                <td style={{ ...td, height: V_ROW_PX }}>{r.drought}</td>
                <td style={{ ...td, height: V_ROW_PX }}>{r.capped}</td>
                <td style={{ ...td, height: V_ROW_PX }}>{r.maxRun}</td>
                <td
                  style={{
                    ...td,
                    height: V_ROW_PX,
                    fontFamily: 'ui-monospace, monospace',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={r.lastGaps.length ? r.lastGaps.join(', ') : ''}
                >
                  {r.lastGaps.length ? r.lastGaps.join(', ') : '—'}
                </td>
              </tr>
            ))}
            {vBottomPad > 0 ? (
              <tr aria-hidden>
                <td colSpan={6} style={{ height: vBottomPad, padding: 0, border: 'none', lineHeight: 0 }} />
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <p style={{ padding: '0.5rem 1rem', margin: 0, fontSize: '0.68rem', color: '#667788', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        Spin history uses virtual scrolling for large imports. Drought table: longest drought first. “Last gaps” =
        spins between hits (is-equal-to style). Entertainment / research only.
      </p>
    </div>
  );
}

const th = { padding: '0.35rem 0.25rem', fontWeight: 600 };
const td = { padding: '0.28rem 0.25rem' };
const ladderBtn = {
  padding: '0.15rem 0.4rem',
  borderRadius: 6,
  border: '1px solid #445',
  background: '#151d2a',
  color: '#ccd',
  cursor: 'pointer',
  fontSize: '0.72rem',
};

const spinNavBtn = {
  padding: '0.12rem 0.45rem',
  borderRadius: 6,
  border: '1px solid rgba(17,214,194,0.35)',
  background: 'rgba(0,0,0,0.35)',
  color: '#11d6c2',
  cursor: 'pointer',
  fontSize: '0.65rem',
};
