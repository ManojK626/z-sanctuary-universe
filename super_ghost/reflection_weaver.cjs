const templates = {
  calm: 'System remained calm; only routine actions occurred.',
  alert: 'Safe Pack was active; minor adjustments resolved potential drift.',
  turbulent: 'Increased activity triggered additional observation and restraint.',
};

function synthesize(data) {
  const score = data.safePack.length + data.zoneChanges.length;
  let tone = 'calm';
  if (score >= 5) tone = 'turbulent';
  else if (score >= 2) tone = 'alert';

  const narrative = templates[tone];

  return {
    tone,
    narrative,
    summary: {
      safePackEvents: data.safePack.length,
      zoneChanges: data.zoneChanges.length,
      observations: data.chronicle.length,
    },
  };
}

module.exports = { synthesize };
