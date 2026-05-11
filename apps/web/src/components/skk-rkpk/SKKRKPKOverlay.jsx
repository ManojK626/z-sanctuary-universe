'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Sparks from './Sparks.jsx';
import { useGovernanceState } from './useGovernanceState.js';
import { speak } from './useVoice.js';

const moodColors = {
  calm: '#00d4ff',
  balanced: '#a0e4cb',
  warning: '#ffb703',
  overload: '#ff006e',
  celebrate: '#ffe066',
};

function CompanionScene({ mood }) {
  const color = moodColors[mood] || '#00d4ff';
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[2, 3, 4]} intensity={1.2} color={color} />
      <mesh position={[-1.3, 0, 0]}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[1.3, 0, 0]}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial color="#a0e4cb" />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.6, 0.03, 16, 90]} />
        <meshStandardMaterial color="#00d4ff" transparent opacity={0.4} />
      </mesh>
    </>
  );
}

export default function SKKRKPKOverlay() {
  const { mood, message, completionPct, skk, rkpk } = useGovernanceState();
  const [mute, setMute] = useState(true);
  const lastMood = useRef('');
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 520;

  useEffect(() => {
    if (!lastMood.current) {
      lastMood.current = mood;
      return;
    }
    if (lastMood.current !== mood && !mute) {
      if (skk) speak(`SKK: ${skk}`, { rate: 0.98, pitch: 0.9 });
      if (rkpk) {
        setTimeout(() => speak(`RKPK: ${rkpk}`, { rate: 0.95, pitch: 1.05 }), 600);
      }
    }
    lastMood.current = mood;
  }, [mood, skk, rkpk, mute]);

  return (
    <section
      style={{
        maxWidth: 520,
        border: '1px solid #00d4ff',
        borderRadius: 12,
        padding: '1rem',
        background: 'rgba(10, 14, 39, 0.92)',
      }}
    >
      <h2 style={{ marginTop: 0 }}>SKK + RKPK Companion</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
        <span>Mood: {mood}</span>
        <span>Completion: {completionPct}%</span>
      </div>
      <div style={{ height: 6, background: '#1d2235', borderRadius: 999, margin: '0.5rem 0' }}>
        <div
          style={{
            height: '100%',
            width: `${completionPct}%`,
            background: 'linear-gradient(90deg, #00d4ff, #a0e4cb)',
            borderRadius: 999,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      <p style={{ margin: '0.5rem 0', color: '#a0e4cb' }}>{message}</p>
      <div style={{ display: 'grid', gap: '0.4rem' }}>
        <div>
          <strong>SKK:</strong> {skk || '...'}
        </div>
        <div>
          <strong>RKPK:</strong> {rkpk || '...'}
        </div>
      </div>
      <div style={{ marginTop: '0.7rem', display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={() => setMute((prev) => !prev)}
          style={{
            background: '#00d4ff',
            color: '#0a0e27',
            border: 'none',
            padding: '0.35rem 0.75rem',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          {mute ? 'Muted' : 'Voice'}
        </button>
      </div>
      <div style={{ height: isMobile ? 180 : 240, marginTop: '0.8rem' }}>
        <Canvas camera={{ position: [0, 0, 4] }}>
          <CompanionScene mood={mood} />
          <Sparks active={mood === 'celebrate'} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.6} />
        </Canvas>
      </div>
    </section>
  );
}
