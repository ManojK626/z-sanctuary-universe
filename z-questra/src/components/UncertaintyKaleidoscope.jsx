import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  KALEIDOSCOPE_PATTERNS,
  KALEIDOSCOPE_RANDOMNESS,
  playGardenAllowPulse,
} from '../theme/playGardenTokens.js';

const W = 320;
const H = 320;

function mulberry32(a) {
  return function next() {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hueRotate(base, spread, rnd) {
  return (base + (rnd() - 0.5) * spread + 720) % 360;
}

function drawKaleidoscope(ctx, { angle, seed, randomness, pattern, comfort }) {
  const photo = comfort?.brightness === 'photophobia';
  const spread = randomness === 'calm' ? 14 : randomness === 'balanced' ? 32 : 52;
  const segments = pattern === 'star' ? 18 : pattern === 'soft' ? 10 : 14;
  const rnd = mulberry32(seed);
  const cx = W / 2;
  const cy = H / 2;
  const radius = photo ? 118 : 132;

  ctx.clearRect(0, 0, W, H);
  ctx.globalAlpha = 1;
  ctx.fillStyle = photo ? 'hsl(222 16% 14%)' : 'hsl(268 24% 16%)';
  ctx.fillRect(0, 0, W, H);

  const baseHue = 38 + (rnd() * 40 + seed) % 80;

  for (let i = 0; i < segments; i++) {
    const a0 = angle + (i * Math.PI * 2) / segments;
    const a1 = angle + ((i + 1) * Math.PI * 2) / segments;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a0) * radius, Math.sin(a0) * radius);
    ctx.lineTo(Math.cos(a1) * radius, Math.sin(a1) * radius);
    ctx.closePath();

    const h = hueRotate(baseHue + i * (360 / segments), spread, rnd);
    const s = photo ? 38 : 48 + rnd() * 18;
    const l = photo ? 38 + rnd() * 12 : 44 + rnd() * 18;

    if (pattern === 'soft') {
      const g = ctx.createRadialGradient(0, 0, 4, 0, 0, radius * 0.95);
      g.addColorStop(0, `hsla(${h}, ${s}%, ${Math.min(92, l + 22)}%, ${photo ? 0.35 : 0.55})`);
      g.addColorStop(1, `hsla(${(h + 40) % 360}, ${s}%, ${l}%, ${photo ? 0.42 : 0.75})`);
      ctx.fillStyle = g;
    } else if (pattern === 'mirror') {
      const g = ctx.createLinearGradient(0, 0, Math.cos(a0) * radius, Math.sin(a0) * radius);
      g.addColorStop(0, `hsla(${h}, ${s}%, ${l + 10}%, ${photo ? 0.45 : 0.78})`);
      g.addColorStop(1, `hsla(${(h + 120) % 360}, ${s - 6}%, ${l - 8}%, ${photo ? 0.35 : 0.62})`);
      ctx.fillStyle = g;
    } else if (pattern === 'spiral') {
      ctx.fillStyle = `hsla(${h}, ${s}%, ${l}%, ${photo ? 0.48 : 0.72})`;
    } else {
      ctx.fillStyle = `hsla(${h}, ${Math.min(72, s + 10)}%, ${Math.min(58, l)}%, ${photo ? 0.5 : 0.78})`;
    }

    ctx.globalAlpha = photo ? 0.58 : 0.88;
    ctx.fill();

    if (pattern === 'spiral') {
      ctx.strokeStyle = `hsla(${(h + 180) % 360}, 55%, ${photo ? 52 : 62}%, ${photo ? 0.25 : 0.35})`;
      ctx.lineWidth = photo ? 1 : 1.2;
      ctx.beginPath();
      const turns = 3 + rnd() * 2;
      for (let t = 0; t < 48; t++) {
        const u = t / 47;
        const r = u * radius * 0.92;
        const ang = a0 + u * turns * Math.PI;
        const x = Math.cos(ang) * r;
        const y = Math.sin(ang) * r;
        if (t === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    if (pattern === 'mirror') {
      ctx.strokeStyle = `hsla(${h}, 70%, 78%, ${photo ? 0.12 : 0.22})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    ctx.restore();
  }

  ctx.globalAlpha = 1;
}

export default function UncertaintyKaleidoscope({ comfort }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const angleRef = useRef(0);
  const [randomness, setRandomness] = useState('balanced');
  const [pattern, setPattern] = useState('mirror');
  const [seed, setSeed] = useState(() => (Math.random() * 0xffffffff) >>> 0);

  const osReduced =
    typeof document !== 'undefined' && document.documentElement?.dataset?.zqOsReducedMotion === '1';
  const motionOn = playGardenAllowPulse(comfort, osReduced);

  const paint = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    drawKaleidoscope(ctx, {
      angle: angleRef.current,
      seed,
      randomness,
      pattern,
      comfort,
    });
  }, [seed, randomness, pattern, comfort]);

  useEffect(() => {
    paint();
  }, [paint]);

  useEffect(() => {
    if (!motionOn) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      animRef.current = null;
      paint();
      return undefined;
    }

    let last = performance.now();
    const speed =
      randomness === 'calm' ? 0.045 : randomness === 'balanced' ? 0.09 : 0.14;

    const tick = (now) => {
      const dt = Math.min(48, now - last);
      last = now;
      angleRef.current += (speed * dt) / 2600;
      paint();
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [motionOn, randomness, paint]);

  function gentleShuffle() {
    setSeed((Math.random() * 0xffffffff) >>> 0);
    if (!motionOn) {
      angleRef.current = Math.random() * Math.PI * 2;
      paint();
    }
  }

  return (
    <div className="zq-kaleidoscope" data-testid="zq-uncertainty-kaleidoscope">
      <h4 style={{ margin: '0 0 0.35rem', fontSize: '0.88rem', color: 'hsl(310 48% 72%)' }}>
        Uncertainty Kaleidoscope
      </h4>
      <p style={{ margin: '0 0 0.55rem', fontSize: '0.74rem', color: 'var(--zq-text-muted)', lineHeight: 1.45 }}>
        This is a visual learning toy for <strong>randomness</strong> and <strong>pattern</strong>. It does{' '}
        <strong>not</strong> predict outcomes. Enjoy gentle symmetry — not stakes, scores, or prizes.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.76rem', opacity: 0.85 }}>Randomness:</span>
        {KALEIDOSCOPE_RANDOMNESS.map((o) => (
          <button
            key={o.id}
            type="button"
            className="zq-btn-age"
            aria-pressed={randomness === o.id}
            data-testid={`zq-kaleido-random-${o.id}`}
            onClick={() => setRandomness(o.id)}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', alignItems: 'center', marginBottom: '0.55rem' }}>
        <span style={{ fontSize: '0.76rem', opacity: 0.85 }}>Pattern:</span>
        {KALEIDOSCOPE_PATTERNS.map((o) => (
          <button
            key={o.id}
            type="button"
            className="zq-btn-age"
            aria-pressed={pattern === o.id}
            data-testid={`zq-kaleido-pattern-${o.id}`}
            onClick={() => setPattern(o.id)}
          >
            {o.label}
          </button>
        ))}
        <button type="button" className="zq-btn-age" data-testid="zq-kaleido-shuffle" onClick={gentleShuffle}>
          New gentle mix
        </button>
      </div>

      {!motionOn ? (
        <p style={{ margin: '0 0 0.45rem', fontSize: '0.72rem', color: 'var(--zq-text-muted)' }}>
          Slow motion is paused (reduced motion, photophobia-safe path, or OS setting). Use controls or New gentle mix to
          refresh the image.
        </p>
      ) : (
        <p style={{ margin: '0 0 0.45rem', fontSize: '0.72rem', color: 'var(--zq-text-muted)' }}>
          Drift is intentionally slow — no flashing or strobing.
        </p>
      )}

      <div
        style={{
          borderRadius: 'var(--zq-radius)',
          overflow: 'hidden',
          border: '1px solid color-mix(in hsl, hsl(276 45% 52%) 28%, transparent)',
          maxWidth: `${W}px`,
        }}
      >
        <canvas ref={canvasRef} width={W} height={H} data-testid="zq-kaleidoscope-canvas" style={{ display: 'block', width: '100%', height: 'auto' }} />
      </div>
    </div>
  );
}
