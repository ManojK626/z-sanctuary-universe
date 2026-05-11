import Link from 'next/link';

export const metadata = {
  title: 'Project AURA · Z-HOLO — Z-Sanctuary',
  description: 'Placeholder roadmap for Nature’s Being AR interface and holographic shell (Z-HOLO).',
};

const box = {
  padding: '1rem 1.15rem',
  borderRadius: 12,
  background: 'rgba(15, 24, 48, 0.95)',
  border: '1px solid rgba(255, 209, 102, 0.22)',
  marginTop: '1rem',
};

export default function ProjectAuraPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#0a0e27',
        color: '#e8f4ff',
        padding: '1.75rem 2rem 3rem',
        maxWidth: '52rem',
      }}
    >
      <h1 style={{ marginTop: 0, color: '#ffd166' }}>Project AURA / Z-HOLO</h1>
      <p style={{ color: '#a0e4cb', lineHeight: 1.55 }}>
        Placeholder route for the optics + holographic stack described in Z-SUC-2 (Gemini threads, waveguide/Micro-LED,
        Bee Vision, Sanctuary bridge). No device firmware here — hub stays API-first; this page tracks agreed phases.
      </p>

      <section style={box}>
        <h2 style={{ marginTop: 0, color: '#11d6c2', fontSize: '1.05rem' }}>Z-HOLO — holographic shell (step-by-step)</h2>
        <ol style={{ color: '#8ab4d8', lineHeight: 1.65, margin: '0.5rem 0 0', paddingLeft: '1.25rem' }}>
          <li>Freeze a minimal scene graph (Three.js / R3F) that matches dashboard tone — reuse Z-QOSMEI lighting cues.</li>
          <li>Define one “aura ring” data channel from hub state (read-only) — no PII in the first wire.</li>
          <li>Add a dev flag so HOLO layers never load until explicitly enabled (performance + approvals).</li>
          <li>Document trust boundary: HOLO reads public manifest + signed dashboard snippets only.</li>
        </ol>
      </section>

      <section style={box}>
        <h2 style={{ marginTop: 0, color: '#11d6c2', fontSize: '1.05rem' }}>Project AURA — wearable bridge (step-by-step)</h2>
        <ol style={{ color: '#8ab4d8', lineHeight: 1.65, margin: '0.5rem 0 0', paddingLeft: '1.25rem' }}>
          <li>Map AURA v3 pillars from vault slice 01–03 into OpenAPI-style capability stubs (sensors, edge AI, ethics).</li>
          <li>Pair with MirrorSoul: only emotional summaries cross the wire — same pattern as existing journal API.</li>
          <li>Ship a “concept card” in the web app (this page expanded) before any hardware SDK dependency.</li>
          <li>When lab exports change, refresh{' '}
            <Link href="/continuation" style={{ color: '#11d6c2' }}>
              /continuation
            </Link>{' '}
            manifest sync.
          </li>
        </ol>
      </section>

      <p style={{ marginTop: '1.5rem', fontSize: '0.88rem', color: '#6b8aa8' }}>
        Related: <Link href="/mirrorsoul">MirrorSoul</Link> · <Link href="/continuation">Continuation lab</Link> ·{' '}
        <Link href="/z-qosmei">Z-QOSMEI</Link>
      </p>
    </main>
  );
}
