import Link from 'next/link';
import { ExperienceForm } from './ExperienceForm.jsx';

const wrap = { color: '#e8f4ff', padding: '1rem 0 2.5rem' };

export const metadata = {
  title: 'Experience profile · Z-Sanctuary',
};

export default function ExperiencePage() {
  return (
    <main className="sanctuary-focus-column" style={wrap}>
      <h1 style={{ color: '#a5b4fc', marginTop: 0 }}>Experience profile</h1>
      <ExperienceForm />
      <p style={{ marginTop: '2rem' }}>
        <Link href="/account" style={{ color: '#7dd3fc' }}>
          ← Back to account
        </Link>
        {' · '}
        <Link href="/" style={{ color: '#7dd3fc' }}>
          Home
        </Link>
      </p>
    </main>
  );
}
