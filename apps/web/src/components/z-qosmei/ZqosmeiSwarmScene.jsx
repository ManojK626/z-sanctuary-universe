'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { playSwarmPulse, unlockAudio } from '../../lib/z_qosmei_web_audio.js';

const COLORS = [0x00ffaa, 0xff4444, 0xffdd44, 0x4488ff, 0xaa44ff];
const SPICE = [0xffd700, 0xff4500, 0x228b22, 0x8b4513, 0xff1493, 0x00ced1];

const QUALITY = {
  high: {
    ico: 2,
    particles: 96,
    orbs: 5,
    pairs: 12,
    blocks: 16,
    orbSeg: 32,
    pairSeg: 12,
    maxPr: 2,
  },
  balanced: {
    ico: 1,
    particles: 56,
    orbs: 5,
    pairs: 8,
    blocks: 12,
    orbSeg: 24,
    pairSeg: 10,
    maxPr: 2,
  },
  potato: {
    ico: 0,
    particles: 28,
    orbs: 3,
    pairs: 4,
    blocks: 8,
    orbSeg: 12,
    pairSeg: 8,
    maxPr: 1,
  },
};

const MSGS = [
  'Z-QOSMEI pulse → swarm nodes spawned (demo)',
  'Shadow + Micro-Z hooks reserved for orchestration wiring',
  'Superposition threads (visual); production = workers + queues + mirrors',
  'Z-Mega × LPBS-flex × GGAESP-360 metaphor → one governance spine',
  'Triple-decker bus / spines / octo-core: map to hub services',
];
const ICONS = ['⚛️', '🍛', '🌶️', '💠', '🫂'];

/**
 * @param {{ quality: 'high' | 'balanced' | 'potato'; reducedMotion: boolean; soundEnabled: boolean }} props
 */
export default function ZqosmeiSwarmScene({ quality, reducedMotion, soundEnabled }) {
  const mountRef = useRef(null);
  const soundRef = useRef(soundEnabled);
  const [zes, setZes] = useState(0);
  const [feathers, setFeathers] = useState(0);
  /** @type {React.MutableRefObject<{ zes: number }>} */
  const zesRef = useRef({ zes: 0 });

  useEffect(() => {
    soundRef.current = soundEnabled;
  }, [soundEnabled]);
  const [log, setLog] = useState(
    /** @type {{ text: string; icon: string }[]} */ ([
      { text: 'Z-QOSMEI scene online — merged Next + Three (npm)', icon: '💠' },
    ])
  );

  const addLog = useCallback((text, icon = '⚛️') => {
    setLog((prev) => {
      const next = [...prev, { text, icon }];
      return next.slice(-40);
    });
    setZes((z) => {
      const n = z + Math.floor(Math.random() * 85) + 55;
      zesRef.current.zes = n;
      return n;
    });
  }, []);

  useEffect(() => {
    zesRef.current.zes = zes;
  }, [zes]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return undefined;

    const q = QUALITY[quality] || QUALITY.balanced;
    const rm = reducedMotion ? 0.35 : 1;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      antialias: quality !== 'potato',
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, q.maxPr));
    container.appendChild(renderer.domElement);

    const hive = new THREE.Mesh(
      new THREE.IcosahedronGeometry(3.6, q.ico),
      new THREE.MeshBasicMaterial({ color: 0xffd166, wireframe: true })
    );
    scene.add(hive);

    const zoodo = new THREE.Mesh(
      new THREE.SphereGeometry(1.15, q.orbSeg, q.orbSeg),
      new THREE.MeshBasicMaterial({ color: 0xff6b6b })
    );
    scene.add(zoodo);

    const orbs = [];
    for (let i = 0; i < q.orbs; i++) {
      const orb = new THREE.Mesh(
        new THREE.SphereGeometry(0.65, q.orbSeg, q.orbSeg),
        new THREE.MeshBasicMaterial({ color: COLORS[i % COLORS.length] })
      );
      orb.userData.angle = i * ((Math.PI * 2) / q.orbs);
      orbs.push(orb);
      scene.add(orb);
    }

    const quantumPairs = [];
    for (let i = 0; i < q.pairs; i++) {
      const pair = new THREE.Group();
      const p1 = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, q.pairSeg, q.pairSeg),
        new THREE.MeshBasicMaterial({ color: 0x11d6c2 })
      );
      const p2 = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, q.pairSeg, q.pairSeg),
        new THREE.MeshBasicMaterial({ color: 0xffd166 })
      );
      pair.add(p1);
      pair.add(p2);
      pair.userData.phase = i;
      quantumPairs.push(pair);
      scene.add(pair);
    }

    const sentinelBlocks = [];
    for (let i = 0; i < q.blocks; i++) {
      const block = new THREE.Mesh(
        new THREE.BoxGeometry(0.75, 0.75, 0.75),
        new THREE.MeshBasicMaterial({ color: 0xffd166, wireframe: true })
      );
      block.userData.angle = i * ((Math.PI * 2) / q.blocks);
      sentinelBlocks.push(block);
      scene.add(block);
    }

    const swarmParticles = [];
    const spawnParticles = (n, useSpice) => {
      for (let i = 0; i < n; i++) {
        const col = useSpice ? SPICE[i % SPICE.length] : 0x11d6c2;
        const p = new THREE.Mesh(
          new THREE.SphereGeometry(0.09, 6, 6),
          new THREE.MeshBasicMaterial({ color: col })
        );
        p.userData.speed = (0.015 + Math.random() * 0.04) * rm;
        swarmParticles.push(p);
        scene.add(p);
      }
    };
    spawnParticles(q.particles, true);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const setSize = () => {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    setSize();
    camera.position.set(0, 17, 36);

    const ro = new ResizeObserver(setSize);
    ro.observe(container);

    let angle = 0;
    let animId = 0;
    const loop = () => {
      animId = requestAnimationFrame(loop);
      if (document.visibilityState === 'hidden') return;

      controls.update();
      const z = zesRef.current.zes;
      const spin = 0.0008 * rm;
      hive.rotation.y += spin;
      angle += 0.0025 * rm;

      zoodo.position.x = Math.sin(angle) * 16;
      zoodo.position.z = Math.cos(angle) * 16;

      orbs.forEach((orb) => {
        orb.userData.angle += (0.009 + z / 2200) * rm;
        orb.position.x = Math.cos(orb.userData.angle) * 11;
        orb.position.z = Math.sin(orb.userData.angle) * 11;
        orb.position.y = Math.sin(orb.userData.angle * 2.3) * 6.5;
      });

      quantumPairs.forEach((pair) => {
        pair.userData.phase += 0.018 * rm;
        pair.children[0].position.x = Math.sin(pair.userData.phase) * 7;
        pair.children[1].position.x = -Math.sin(pair.userData.phase) * 7;
      });

      sentinelBlocks.forEach((block) => {
        block.userData.angle += (0.005 + z / 3500) * rm;
        block.position.x = Math.cos(block.userData.angle) * 14.5;
        block.position.z = Math.sin(block.userData.angle) * 14.5;
        block.position.y = Math.sin(block.userData.angle * 1.6) * 8.5;
      });

      swarmParticles.forEach((p, i) => {
        p.position.x = Math.sin(angle * p.userData.speed + i) * (8 + (i % 5));
        p.position.z = Math.cos(angle * p.userData.speed + i) * (8 + (i % 5));
        p.position.y = Math.sin(angle * 2 + i) * 4;
      });

      renderer.render(scene, camera);
    };
    loop();

    const onClick = async () => {
      await unlockAudio();
      if (soundRef.current) playSwarmPulse();
      setFeathers((f) => {
        const n = f + 1;
        return n;
      });
      spawnParticles(quality === 'potato' ? 2 : 3, Math.random() > 0.5);
      addLog(MSGS[Math.floor(Math.random() * MSGS.length)], ICONS[Math.floor(Math.random() * ICONS.length)]);
    };
    container.addEventListener('click', onClick);

    setTimeout(() => addLog('Vision merged: quantum metaphor ↔ real engineering', '⚛️'), 800);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      container.removeEventListener('click', onClick);
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          const m = obj.material;
          if (Array.isArray(m)) m.forEach((x) => x.dispose());
          else m.dispose();
        }
      });
    };
  }, [quality, reducedMotion, addLog]);

  const wingsPct = Math.min(100, feathers * 14);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '48vh', background: '#0a0f17' }}>
      <div ref={mountRef} style={{ position: 'absolute', inset: 0 }} />

      <div
        style={{
          position: 'absolute',
          top: 52,
          left: 12,
          zIndex: 5,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          padding: '0.65rem 0.85rem',
          borderRadius: 16,
          border: '1px solid rgba(17,214,194,0.35)',
          maxWidth: 'min(100% - 24px, 20rem)',
          pointerEvents: 'none',
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
            fontWeight: 700,
            color: '#ffd166',
            textShadow: '0 0 24px rgba(255,209,102,0.35)',
          }}
        >
          Z-QOSMEI
        </h1>
        <p style={{ margin: '0.25rem 0 0', fontSize: '0.7rem', color: '#11d6c2', lineHeight: 1.35 }}>
          Quantum Omni-Swarm · Flex 360 · Next + Three (bundled)
        </p>
        <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 700, color: '#ffd166', marginTop: 4 }}>
          {zes.toLocaleString()}
        </div>
        <p style={{ margin: '0.15rem 0 0', fontSize: '0.75rem', color: '#11d6c2' }}>Ledger pulse (demo) · click scene</p>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 52,
          right: 12,
          zIndex: 5,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          padding: '0.5rem 0.75rem',
          borderRadius: 16,
          border: '1px solid rgba(17,214,194,0.35)',
          pointerEvents: 'none',
        }}
      >
        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffd166' }}>
          Feathers: {feathers} → Wings: {wingsPct}%
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          zIndex: 5,
          width: 'min(100% - 24px, 22rem)',
          maxHeight: '9rem',
          overflowY: 'auto',
          background: 'rgba(0,0,0,0.78)',
          backdropFilter: 'blur(8px)',
          padding: '0.45rem 0.6rem',
          borderRadius: 16,
          border: '1px solid rgba(17,214,194,0.3)',
          fontSize: '0.68rem',
          color: '#dde',
          pointerEvents: 'none',
        }}
      >
        {log.map((line, i) => (
          <div key={`${i}-${line.text.slice(0, 12)}`} style={{ padding: '0.2rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {line.icon} {line.text}
          </div>
        ))}
      </div>
    </div>
  );
}
