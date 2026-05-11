const { ZChronicle } = global;

function lastNDays(days = 7) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return (ZChronicle?.events || []).filter((entry) => {
    const ts = entry.ts ? Date.parse(entry.ts) : 0;
    return ts >= cutoff;
  });
}

function collect() {
  return {
    chronicle: lastNDays(7),
    zoneChanges: lastNDays(7).filter((entry) => entry.type === 'zoning.changed'),
    safePack: lastNDays(7).filter((entry) => entry.type?.includes('safe_pack')),
    globalPulse: lastNDays(7).filter((entry) => entry.event === 'world_pulse.hourly'),
    collectedAt: new Date().toISOString(),
  };
}

module.exports = { collect };
