'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          const r = await fetch('/api/auth/logout', { method: 'POST' });
          if (r.ok) {
            router.push('/login?next=' + encodeURIComponent('/account'));
            router.refresh();
          }
        } finally {
          setBusy(false);
        }
      }}
      style={{
        padding: '0.45rem 1rem',
        borderRadius: 8,
        border: '1px solid rgba(0, 212, 255, 0.35)',
        background: 'rgba(15, 30, 55, 0.9)',
        color: '#e8f4ff',
        cursor: busy ? 'wait' : 'pointer',
        fontSize: '0.95rem',
      }}
    >
      {busy ? 'Signing out…' : 'Sign out'}
    </button>
  );
}
