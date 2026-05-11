import Link from 'next/link';

const t = { minHeight: '100vh', color: '#e8f4ff', padding: '1.75rem 1.5rem 3rem', maxWidth: '46rem' };

export default function TermsPage() {
  return (
    <main style={t}>
      <h1 style={{ color: '#7dd3fc', marginTop: 0 }}>Terms of use (baseline)</h1>
      <p style={{ lineHeight: 1.6, color: '#94a3b8' }}>
        The Sanctuary is an <strong>advisory, experimental</strong> surface unless a product page explicitly
        says otherwise. You agree not to rely on the site as legal, medical, financial, or safety instruction.
        <strong> Dev authentication</strong> (shared token) is <strong>not for production</strong> or public
        exposure. GGAESP scores, Zuno flow, and MirrorSoul outputs are <strong>not</strong> a substitute for
        professional help where that applies. Operators and partners must run legal review and governance sign-off
        before any revenue, hardware, or regulated use.
      </p>
      <p style={{ marginTop: '1.25rem' }}>
        <Link href="/" style={{ color: '#5eead4' }}>
          Home
        </Link>
        {' · '}
        <Link href="/privacy" style={{ color: '#5eead4' }}>
          Privacy
        </Link>
      </p>
    </main>
  );
}
