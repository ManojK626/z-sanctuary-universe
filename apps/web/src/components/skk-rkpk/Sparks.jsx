import { useMemo } from 'react';
import { Points } from '@react-three/drei';

export default function Sparks({ active }) {
  const points = useMemo(() => {
    const arr = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i += 1) {
      arr[i * 3] = (Math.random() - 0.5) * 4;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 3;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    return arr;
  }, []);

  if (!active) return null;

  return (
    <Points positions={points} stride={3}>
      <pointsMaterial size={0.03} color="#ffe066" />
    </Points>
  );
}
