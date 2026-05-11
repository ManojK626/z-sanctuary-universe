import Link from 'next/link';

const wrap = {
  minHeight: '100vh',
  color: '#e8f4ff',
  padding: '1.5rem 1rem 2.5rem',
};

const grid = {
  display: 'grid',
  gap: '0.9rem',
  gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
};

const card = {
  border: '1px solid rgba(125, 211, 252, 0.24)',
  borderRadius: 12,
  padding: '0.9rem',
  background: 'rgba(10, 20, 40, 0.62)',
};

function StackCard({ title, gate, note }) {
  return (
    <div style={card}>
      <div style={{ fontWeight: 700, color: '#bae6fd' }}>{title}</div>
      <div style={{ fontSize: '0.82rem', color: '#fcd34d', marginTop: '0.35rem' }}>Gate: {gate}</div>
      <div style={{ fontSize: '0.9rem', color: '#cbd5e1', marginTop: '0.35rem' }}>{note}</div>
    </div>
  );
}

export const metadata = {
  title: 'Z-Stack Lite · Z-Sanctuary',
};

export default function ZStackLitePage() {
  return (
    <main className="sanctuary-focus-column" style={wrap}>
      <h1 style={{ marginTop: 0, color: '#c4b5fd' }}>Z-Stack Lite shell</h1>
      <p style={{ color: '#94a3b8', lineHeight: 1.5 }}>
        Navigation-first dashboard shell. This is not full platform execution.
      </p>

      <div style={grid}>
        <StackCard title="Life" gate="BUILD NOW (lite)" note="Safety and reflective user pathways." />
        <StackCard title="Power" gate="PREPARE ONLY" note="Operational controls and future capability rails." />
        <StackCard title="Creation" gate="PREPARE ONLY" note="Creator tools, storyboards, and content mocks." />
        <StackCard
          title="PRM-Δ transparency"
          gate="PREPARE ONLY"
          note="Legacy extract: educational receipt/provenance card (display only)."
        />
        <StackCard
          title="CRI index explainer"
          gate="PREPARE ONLY"
          note="Legacy extract: Carbon-Regeneration-Inequality sample index (illustrative only)."
        />
        <StackCard title="Future" gate="WAIT" note="B2B, relay, and high-complexity platform modules." />
        <StackCard title="Expansion" gate="ARCHIVE/PREPARE" note="Far-horizon OS/ROM/holo concepts." />
      </div>

      <p style={{ marginTop: '1rem' }}>
        <Link href="/safety" style={{ color: '#7dd3fc' }}>
          Open Safety Core
        </Link>
        {' · '}
        <Link href="/mirrorsoul" style={{ color: '#5eead4' }}>
          Open MirrorSoul
        </Link>
      </p>
    </main>
  );
}
