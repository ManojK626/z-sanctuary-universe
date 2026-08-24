export function adaptDrift(drift) {
  const findingsIn = Array.isArray(drift?.findings) ? drift.findings : [];
  const findings = findingsIn.map((f, index) => ({
    source_index: index,
    code: f.code,
    signal: {
      namespace: 'CRYSTAL_DNA_DRIFT',
      value: f.signal,
      origin: 'REAL_SOURCE',
      note: 'CRYSTAL_DNA_DRIFT HOLD ≠ Z Logic HOLD; not project deployment HOLD',
    },
    message: f.message,
    refs: Array.isArray(f.refs) ? f.refs : [],
    origin: 'DERIVED_REAL',
    provenance: {
      path: 'data/reports/z_crystal_dna_drift_report.json',
      finding_code: f.code,
    },
    note: 'DRIFT ≠ CORRUPTION automatically; DRIFT ≠ REPAIR',
  }));
  findings.sort((a, b) => {
    const ka = `${a.code}\0${(a.refs || []).join(',')}\0${a.message || ''}`;
    const kb = `${b.code}\0${(b.refs || []).join(',')}\0${b.message || ''}`;
    return ka < kb ? -1 : ka > kb ? 1 : 0;
  });
  return {
    overall_signal: {
      namespace: 'CRYSTAL_DNA_DRIFT',
      value: drift?.overall_signal,
      origin: 'REAL_SOURCE',
    },
    law: drift?.law,
    findings,
    origin: 'DERIVED_REAL',
    provenance: { path: 'data/reports/z_crystal_dna_drift_report.json' },
  };
}
