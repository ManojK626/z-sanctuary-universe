// Z: apps\web\src\components\skk-rkpk\useGovernanceState.js
import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api.js';

export const moods = ['calm', 'balanced', 'warning', 'overload', 'celebrate'];

export function useGovernanceState() {
  const [mood, setMood] = useState('calm');
  const [message, setMessage] = useState('Loading...');
  const [completionPct, setCompletionPct] = useState(0);
  const [skk, setSkk] = useState('');
  const [rkpk, setRkpk] = useState('');

  useEffect(() => {
    let alive = true;
    let timer;

    async function load() {
      try {
        const data = await apiFetch('/dashboard/state');
        if (!alive) return;
        setMood(data.mood || 'calm');
        setMessage(data.message || 'Loading...');
        setCompletionPct(data.completionPct ?? 0);
        setSkk(data.skk || '');
        setRkpk(data.rkpk || '');
      } catch {
        if (!alive) return;
        setMood('warning');
        setMessage('Dashboard state unavailable. Check API.');
      }
    }

    load();
    timer = setInterval(load, 15000);
    return () => {
      alive = false;
      if (timer) clearInterval(timer);
    };
  }, []);

  return { mood, message, completionPct, skk, rkpk };
}
