// Z: products/Z-OCTAVE/integration/readiness-gates.js
const gates = [
  { id: 'core_stability', label: 'Core stability', pass: false, note: 'Awaiting stability hold' },
  { id: 'ethics_lock', label: 'Ethics lock', pass: false, note: 'Crisis Charter pending final' },
  {
    id: 'pilot_ready',
    label: 'Pilot readiness',
    pass: false,
    note: 'Pilot folders seeded; awaiting data',
  },
  {
    id: 'governance_signal',
    label: 'SKK/RKPK green',
    pass: false,
    note: 'Awaiting first guardian pass',
  },
];

export function getZOctaveReadinessGates() {
  return gates.slice();
}

export function isZOctavePublicReady() {
  return gates.every((g) => g.pass);
}

export function setZOctaveGate(id, pass, note) {
  const gate = gates.find((g) => g.id === id);
  if (!gate) return false;
  gate.pass = Boolean(pass);
  if (note) gate.note = note;
  return true;
}
