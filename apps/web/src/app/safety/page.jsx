import Link from 'next/link';

const wrap = {
  minHeight: '100vh',
  color: '#e8f4ff',
  padding: '1.5rem 1rem 2.5rem',
};

const card = {
  marginTop: '1rem',
  padding: '1rem',
  borderRadius: 12,
  border: '1px solid rgba(125, 211, 252, 0.3)',
  background: 'rgba(10, 20, 40, 0.7)',
};

export const metadata = {
  title: 'Safety Core · Z-Sanctuary',
};

export default function SafetyPage() {
  return (
    <main className="sanctuary-focus-column sanctuary-focus-column--tight" style={wrap}>
      <h1 style={{ marginTop: 0, color: '#7dd3fc' }}>Z-Safety Core v1.7 · Lifeline Flow Lite</h1>
      <p style={{ color: '#93c5fd', lineHeight: 1.55 }}>
        This route is supportive guidance only. It is <strong>not</strong> medical, legal, or emergency-response
        replacement.
      </p>

      <section style={card}>
        <h2 style={{ marginTop: 0, fontSize: '1.1rem', color: '#bae6fd' }}>Step 1 — Pause and stabilize</h2>
        <ul style={{ marginTop: '0.5rem' }}>
          <li>Take 4 slow breaths.</li>
          <li>Place both feet on the floor and name 3 things you can see.</li>
          <li>Drink water if available.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={{ marginTop: 0, fontSize: '1.1rem', color: '#bae6fd' }}>Step 2 — Choose your next safe move</h2>
        <p style={{ marginBottom: '0.5rem' }}>
          If you want reflective support, use MirrorSoul. If you feel at risk, contact local emergency/professional
          support now.
        </p>
        <p style={{ margin: 0 }}>
          <Link href="/mirrorsoul" style={{ color: '#5eead4' }}>
            Open MirrorSoul
          </Link>
          {' · '}
          <Link href="/account" style={{ color: '#a5b4fc' }}>
            Account
          </Link>
          {' · '}
          <Link href="/terms" style={{ color: '#93c5fd' }}>
            Terms
          </Link>
        </p>
      </section>

      <section style={card}>
        <h2 style={{ marginTop: 0, fontSize: '1.1rem', color: '#bae6fd' }}>Step 3 — Escalation signpost</h2>
        <p style={{ margin: 0 }}>
          If there is immediate danger to you or someone else, call your local emergency number now. For ongoing
          distress, contact a licensed professional in your region.
        </p>
      </section>
    </main>
  );
}
