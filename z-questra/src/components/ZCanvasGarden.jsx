import React, { useEffect, useRef } from 'react';
import { playGardenAllowPulse } from '../theme/playGardenTokens.js';
import { resolveTone } from '../theme/colorIdentityTokens.js';

const W = 420;
const H = 300;
const CX = W / 2;
const CY = H / 2;

function clampPlanets(n) {
  const x = Number(n);
  if (!Number.isFinite(x) || x < 1) return 1;
  return Math.min(Math.floor(x), 8);
}

/**
 * SVG “galaxy garden” preview + one-shot Canvas 2D star dust (no animation loop).
 */
export default function ZCanvasGarden({ notebookPageCount = 1, comfort, readinessCardCount = 0 }) {
  const canvasRef = useRef(null);
  const osReduced =
    typeof document !== 'undefined' && document.documentElement?.dataset?.zqOsReducedMotion === '1';
  const allowPulse = playGardenAllowPulse(comfort, osReduced);

  const nPlanets = clampPlanets(notebookPageCount);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    const dim = comfort?.brightness === 'photophobia';
    const count = dim ? 28 : 42;
    for (let i = 0; i < count; i++) {
      const x = (i * 97 + 13) % W;
      const y = (i * 61 + 29) % H;
      const l = dim ? 38 + (i % 12) : 52 + (i % 18);
      ctx.fillStyle = `hsla(${210 + (i % 70)}, 42%, ${l}%, ${dim ? 0.11 : 0.18})`;
      ctx.beginPath();
      ctx.arc(x, y, dim ? 0.9 : 1.15, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [comfort?.brightness]);

  const planets = [];
  const r = 92;
  for (let i = 0; i < nPlanets; i++) {
    const angle = (i / Math.max(nPlanets, 1)) * Math.PI * 2 - Math.PI / 2;
    planets.push({
      cx: CX + Math.cos(angle) * r,
      cy: CY + Math.sin(angle) * r,
      hue: (43 + i * 36) % 360,
    });
  }

  const guardianRing = resolveTone('commandGreen');
  const notebookHue = resolveTone('gold');

  return (
    <div
      className="zq-play-garden-canvas-wrap"
      style={{
        position: 'relative',
        borderRadius: 'var(--zq-radius)',
        overflow: 'hidden',
        border: '1px solid color-mix(in hsl, var(--zq-accent) 22%, transparent)',
        background: 'color-mix(in hsl, var(--zq-surface) 94%, hsl(268 22% 14%))',
      }}
    >
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        aria-hidden
        style={{ display: 'block', width: '100%', height: 'auto', opacity: 0.95 }}
      />
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`PlayGarden preview: ${nPlanets} notebook worlds, ${readinessCardCount} readiness nodes`}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <defs>
          <radialGradient id="zqPgCore" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="hsl(276 48% 52%)" stopOpacity={comfort?.brightness === 'photophobia' ? 0.35 : 0.55} />
            <stop offset="100%" stopColor="hsl(210 35% 28%)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx={CX} cy={CY} r="118" fill="none" stroke={guardianRing} strokeWidth="1.5" strokeDasharray="6 10" opacity={0.45} />

        <g className={allowPulse ? 'zq-play-garden-orbit--pulse' : undefined} style={{ transformOrigin: `${CX}px ${CY}px` }}>
          <circle cx={CX} cy={CY} r="74" fill="none" stroke={notebookHue} strokeWidth="1.2" opacity={0.35} />
          {planets.map((p, i) => (
            <circle
              key={i}
              cx={p.cx}
              cy={p.cy}
              r={comfort?.brightness === 'photophobia' ? 7 : 9}
              fill={`hsl(${p.hue} 52% ${comfort?.brightness === 'photophobia' ? 48 : 58}%)`}
              opacity={0.82}
              stroke="color-mix(in hsl, var(--zq-surface) 40%, transparent)"
              strokeWidth="1"
            />
          ))}
        </g>

        <circle cx={CX} cy={CY} r="22" fill="url(#zqPgCore)" opacity={0.9} />
        <text x={CX} y={CY + 4} textAnchor="middle" fill="var(--zq-text)" fontSize="11" fontWeight="600" opacity={0.85}>
          Z
        </text>

        <text x={12} y={22} fill="var(--zq-text-muted)" fontSize="11" fontWeight="600">
          Knowledge garden (preview)
        </text>
        <text x={12} y={38} fill="var(--zq-text-muted)" fontSize="10">
          Planets ≈ notebook pages · ring = guardian calm · stars = local canvas only
        </text>
      </svg>
    </div>
  );
}
