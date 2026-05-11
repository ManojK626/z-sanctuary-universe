import fs from 'node:fs';
import path from 'node:path';

export function readOptionalJson(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

export function buildAdvisoryContext(hubRoot) {
  const rep = (name) => path.join(hubRoot, 'data', 'reports', name);
  const spi = readOptionalJson(rep('z_structural_patterns.json')) || {};
  const qos = readOptionalJson(rep('z_qosmei_core_signal.json')) || {};
  const pred = readOptionalJson(rep('z_predictive_intelligence.json')) || {};
  const predSummary =
    pred.drp_note ||
    (Array.isArray(pred.predictions) && pred.predictions[0]
      ? `signal=${pred.predictions[0].id} conf=${pred.predictions[0].confidence}`
      : null);
  return {
    spi_context: {
      advisory_only: true,
      system_phase: spi.system_phase,
      risk_band: spi.risk_band,
      top_note: spi.top_note,
    },
    predictive_hint: {
      advisory_only: true,
      summary: predSummary,
    },
    qosmei_context: {
      advisory_only: true,
      phase: qos.phase,
      posture: qos.posture,
      recommendation: qos.recommendation,
    },
  };
}
