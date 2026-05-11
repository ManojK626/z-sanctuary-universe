'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const shell = {
  minHeight: '100vh',
  background: '#0a0e27',
  color: '#e8f4ff',
  padding: '1.75rem 2rem 3rem',
};

const stepBox = {
  marginTop: '1.25rem',
  padding: '1rem 1.15rem',
  borderRadius: 12,
  background: 'rgba(15, 24, 48, 0.95)',
  border: '1px solid rgba(17, 214, 194, 0.28)',
};

export default function ContinuationPage() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch('/data/z-suc-2-continuation-manifest.json', { cache: 'no-store' });
        const j = await r.json();
        if (!r.ok) throw new Error(j?.message || r.status);
        if (!cancelled) setData(j);
      } catch (e) {
        if (!cancelled) setErr(e?.message || String(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="sanctuary-focus-column sanctuary-focus-column--tight" style={shell}>
      <h1 style={{ marginTop: 0, color: '#11d6c2' }}>Continuation lab (Z-SUC-2)</h1>
      <p style={{ color: '#a0e4cb', lineHeight: 1.55, maxWidth: '52rem' }}>
        This page reads the checked-in manifest only — no vault paths on the server. Corpus files stay under{' '}
        <strong>Amk-Goku Vaults/Z-SUC-2</strong> on your machine; the hub shows metadata for navigation and build
        alignment.
      </p>

      {data?.governance ? (
        <section
          style={{
            marginTop: '1.25rem',
            padding: '1.1rem 1.2rem',
            borderRadius: 12,
            background: 'rgba(20, 35, 55, 0.55)',
            border: '1px solid rgba(132, 204, 255, 0.25)',
            maxWidth: '52rem',
          }}
        >
          <h2 style={{ marginTop: 0, fontSize: '1.05rem', color: '#7dd3fc' }}>
            AI structures, capabilities & safe mode
          </h2>
          <p style={{ color: '#b8c5d6', fontSize: '0.86rem', lineHeight: 1.5, marginBottom: '0.75rem' }}>
            {data.governance.authoritativeRoof}
          </p>
          {data.governance.safeModeDefinition ? (
            <>
              <p style={{ color: '#e8f4ff', fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                <strong>Safe mode:</strong> {data.governance.safeModeDefinition.summary}
              </p>
              {Array.isArray(data.governance.safeModeDefinition.inHubToday) ? (
                <ul style={{ color: '#9cb8d6', fontSize: '0.84rem', margin: '0.4rem 0' }}>
                  {data.governance.safeModeDefinition.inHubToday.map((s) => (
                    <li key={s} style={{ margin: '0.2rem 0' }}>
                      {s}
                    </li>
                  ))}
                </ul>
              ) : null}
              {data.governance.safeModeDefinition.inCorpusNotAutoWired ? (
                <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '0.5rem 0 0' }}>
                  {data.governance.safeModeDefinition.inCorpusNotAutoWired}
                </p>
              ) : null}
            </>
          ) : null}
          {Array.isArray(data.governance.useByStructure) && data.governance.useByStructure.length ? (
            <div style={{ marginTop: '1rem' }}>
              <h3 style={{ fontSize: '0.95rem', color: '#a5f3fc', marginBottom: '0.5rem' }}>How to use each structure</h3>
              {data.governance.useByStructure.map((u) => (
                <div
                  key={u.id}
                  style={{
                    marginBottom: '0.75rem',
                    padding: '0.55rem 0.7rem',
                    background: 'rgba(10, 20, 36, 0.75)',
                    borderRadius: 8,
                    border: '1px solid rgba(45, 74, 110, 0.6)',
                  }}
                >
                  <div style={{ fontWeight: 600, color: '#fde68a', fontSize: '0.84rem' }}>{u.id}</div>
                  <div style={{ color: '#8ab4d8', fontSize: '0.8rem' }}>{u.role}</div>
                  {Array.isArray(u.capabilities) && u.capabilities.length ? (
                    <div style={{ color: '#6ee7b7', fontSize: '0.78rem', marginTop: '0.25rem' }}>
                      <strong>Capabilities:</strong> {u.capabilities.join(' · ')}
                    </div>
                  ) : null}
                  {u.safeUse ? (
                    <div style={{ color: '#cbd5e1', fontSize: '0.78rem', marginTop: '0.3rem' }}>
                      <strong>Safe use:</strong> {u.safeUse}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
          {Array.isArray(data.governance.newAiOrCoreEngineChecklist) &&
          data.governance.newAiOrCoreEngineChecklist.length ? (
            <div style={{ marginTop: '1rem' }}>
              <h3 style={{ fontSize: '0.95rem', color: '#a5f3fc', marginBottom: '0.45rem' }}>
                Checklist for new AIs or core engines
              </h3>
              <ol style={{ color: '#b8c5d6', fontSize: '0.8rem', lineHeight: 1.55, paddingLeft: '1.2rem', margin: 0 }}>
                {data.governance.newAiOrCoreEngineChecklist.map((c) => (
                  <li key={c} style={{ margin: '0.25rem 0' }}>
                    {c}
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
          {Array.isArray(data.governance.relatedHubDocs) && data.governance.relatedHubDocs.length ? (
            <p style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.9rem' }}>
              See also: {data.governance.relatedHubDocs.join(' · ')}
            </p>
          ) : null}
        </section>
      ) : null}

      <section style={stepBox}>
        <h2 style={{ marginTop: 0, fontSize: '1.05rem', color: '#ffd166' }}>Step 1 — Refresh slices</h2>
        <p style={{ margin: '0.35rem 0 0', color: '#8ab4d8', fontSize: '0.92rem' }}>
          In <code>Z_Sanctuary_Universe 2</code>: <code>npm run suc2:export-slices</code> (and optionally{' '}
          <code>npm run suc2:export-pii</code> for 01 only — never host PII on a public site).
        </p>
      </section>

      <section style={{ ...stepBox, marginTop: '0.85rem' }}>
        <h2 style={{ marginTop: 0, fontSize: '1.05rem', color: '#ffd166' }}>Step 2 — Local reader pack</h2>
        <p style={{ margin: '0.35rem 0 0', color: '#8ab4d8', fontSize: '0.92rem' }}>
          <code>npm run suc2:build-reader</code> then <code>npm run suc2:serve-reader</code> to browse copies under{' '}
          <code>lab-outputs/z-suc-2-reader/</code>.
        </p>
      </section>

      <section style={{ ...stepBox, marginTop: '0.85rem' }}>
        <h2 style={{ marginTop: 0, fontSize: '1.05rem', color: '#ffd166' }}>Step 3 — Sync manifest into hub</h2>
        <p style={{ margin: '0.35rem 0 0', color: '#8ab4d8', fontSize: '0.92rem' }}>
          After exports change: <code>npm run suc2:sync-manifest-hub</code> from the continuation lab so this page stays
          current (merges reader stats into <code>public/data/z-suc-2-continuation-manifest.json</code>).
        </p>
      </section>

      <section style={{ ...stepBox, marginTop: '0.85rem' }}>
        <h2 style={{ marginTop: 0, fontSize: '1.05rem', color: '#ffd166' }}>Step 4 — Product build (hub)</h2>
        <p style={{ margin: '0.35rem 0 0', color: '#8ab4d8', fontSize: '0.92rem' }}>
          Follow <code>Z-SUC-1-MODULE-BUILD-PLAN</code> in the vault: MirrorSoul hardening, companions, or roulette
          thin slice in <code>apps/web</code> / <code>apps/api</code>. Placeholder for optics stack:{' '}
          <Link href="/project-aura" style={{ color: '#11d6c2' }}>
            Project AURA / Z-HOLO
          </Link>
          .
        </p>
      </section>

      <h2 style={{ marginTop: '1.75rem', fontSize: '1.1rem' }}>Manifest</h2>
      {err ? (
        <p style={{ color: '#ffb4b4' }}>Could not load manifest: {err}</p>
      ) : !data ? (
        <p style={{ color: '#8ab4d8' }}>Loading…</p>
      ) : (
        <>
          <p style={{ color: '#8ab4d8', fontSize: '0.88rem' }}>
            {data.title} · schema v{data.schemaVersion} · {data.files?.length || 0} files ·{' '}
            <a href="/data/z-suc-2-continuation-manifest.json" style={{ color: '#a0e4cb' }}>
              raw JSON
            </a>
            {data.moduleHintsSource ? (
              <>
                {' '}
                · product/module layer: <code style={{ color: '#a0e4cb' }}>{data.moduleHintsSource}</code> (lab repo,
                curated)
              </>
            ) : null}
          </p>
          <div style={{ overflowX: 'auto', marginTop: '0.75rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ color: '#8ab4d8', textAlign: 'left' }}>
                  <th style={{ padding: '0.45rem 0.5rem', borderBottom: '1px solid #2a3f55' }}>#</th>
                  <th style={{ padding: '0.45rem 0.5rem', borderBottom: '1px solid #2a3f55' }}>Vault path</th>
                  <th style={{ padding: '0.45rem 0.5rem', borderBottom: '1px solid #2a3f55' }}>Range</th>
                  <th style={{ padding: '0.45rem 0.5rem', borderBottom: '1px solid #2a3f55' }}>Bytes</th>
                  <th style={{ padding: '0.45rem 0.5rem', borderBottom: '1px solid #2a3f55' }}>Class</th>
                </tr>
              </thead>
              <tbody>
                {(data.files || []).map((f) => (
                  <tr key={f.slice} style={{ color: '#dce9f7' }}>
                    <td style={{ padding: '0.4rem 0.5rem', borderBottom: '1px solid #1f2d40' }}>{f.slice}</td>
                    <td style={{ padding: '0.4rem 0.5rem', borderBottom: '1px solid #1f2d40', wordBreak: 'break-all' }}>
                      {f.folder}/{f.name}
                    </td>
                    <td style={{ padding: '0.4rem 0.5rem', borderBottom: '1px solid #1f2d40', whiteSpace: 'nowrap' }}>
                      {f.range}
                    </td>
                    <td style={{ padding: '0.4rem 0.5rem', borderBottom: '1px solid #1f2d40' }}>{f.bytes}</td>
                    <td style={{ padding: '0.4rem 0.5rem', borderBottom: '1px solid #1f2d40' }}>{f.class}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h2 style={{ marginTop: '2rem', fontSize: '1.1rem', color: '#ffd166' }}>
            Products, inventions & named modules (corpus vs hub)
          </h2>
          <p style={{ color: '#8ab4d8', fontSize: '0.86rem', maxWidth: '52rem', lineHeight: 1.55 }}>
            The plain manifest only listed files and byte sizes — it did not surface <strong>ideas turned into pasted
            code/specs</strong> that are not fully shipped in this hub. Each block below maps one slice: what the text
            names, what is partially coded in the corpus, and what actually exists in <code>ZSanctuary_Universe</code>{' '}
            today.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '0.75rem' }}>
            {(data.files || [])
              .filter((f) => f.summary || f.hubBuildStatus)
              .map((f) => (
                <article
                  key={`${f.slice}-${f.name}`}
                  style={{
                    padding: '0.9rem 1rem',
                    borderRadius: 10,
                    background: 'rgba(15, 24, 48, 0.92)',
                    border: '1px solid rgba(255, 209, 102, 0.2)',
                  }}
                >
                  <div style={{ fontWeight: 600, color: '#11d6c2', marginBottom: '0.35rem' }}>
                    Slice {f.slice} — {f.name}
                  </div>
                  {f.summary ? (
                    <p style={{ margin: '0 0 0.5rem', color: '#dce9f7', fontSize: '0.9rem' }}>{f.summary}</p>
                  ) : null}
                  {Array.isArray(f.namedModulesInCorpus) && f.namedModulesInCorpus.length ? (
                    <p style={{ margin: '0 0 0.35rem', color: '#a0e4cb', fontSize: '0.82rem' }}>
                      <strong style={{ color: '#8ab4d8' }}>Named in corpus:</strong> {f.namedModulesInCorpus.join(' · ')}
                    </p>
                  ) : null}
                  {Array.isArray(f.productsAndInventions) && f.productsAndInventions.length ? (
                    <ul style={{ margin: '0.25rem 0 0.5rem', paddingLeft: '1.15rem', color: '#b8c5d6', fontSize: '0.82rem' }}>
                      {f.productsAndInventions.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  ) : null}
                  {f.hubBuildStatus ? (
                    <p style={{ margin: '0.35rem 0 0', color: '#fde68a', fontSize: '0.84rem' }}>
                      <strong style={{ color: '#ca8a04' }}>Hub today:</strong> {f.hubBuildStatus}
                    </p>
                  ) : null}
                  {f.partialCodeNote ? (
                    <p style={{ margin: '0.35rem 0 0', color: '#94a3b8', fontSize: '0.78rem' }}>{f.partialCodeNote}</p>
                  ) : null}
                </article>
              ))}
          </div>
          {data.syncNote ? (
            <p style={{ marginTop: '1rem', fontSize: '0.82rem', color: '#6b8aa8' }}>{data.syncNote}</p>
          ) : null}
        </>
      )}
    </main>
  );
}
