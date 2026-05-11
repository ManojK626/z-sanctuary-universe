// Z: core\z_kairocell_engine.js
export function createKairoCellEngine(opts = {}) {
  const config = {
    defaultSpace: opts.defaultSpace || 'symbolic',
    defaultCellUnit: opts.defaultCellUnit || 'symbolic',
    defaultCellSize: typeof opts.defaultCellSize === 'number' ? opts.defaultCellSize : 4.5,
  };

  function computePhase(input) {
    const d = typeof input.distanceToTarget === 'number' ? input.distanceToTarget : null;

    if (input.intent === 'observe') return 'OBSERVE';
    if (d !== null && d <= 1) return 'LAST_INCH_TWIST';
    if (d !== null && d <= 5) return 'APPROACH';
    return 'ALIGN';
  }

  function chooseGrammar(input) {
    if (input.context === 'chaos' || input.recoveryNeeded) return 'COCKROACH';
    if (input.intent === 'precision') return 'MANTIS';
    if (input.intent === 'burst') return 'JAGUAR';
    if (input.intent === 'pressure') return 'TIGER';
    if (input.intent === 'flow') return 'SERPENT';
    return 'CATERPILLAR';
  }

  function evaluate(input = {}) {
    const phase = computePhase(input);
    const grammar = chooseGrammar(input);

    const result = {
      ts: new Date().toISOString(),
      module: input.module || 'unknown',
      ring: {
        angleDeg: typeof input.angleDeg === 'number' ? input.angleDeg : 0,
        vector: Array.isArray(input.vector) ? input.vector : [1, 0],
      },
      cell: {
        space: input.space || config.defaultSpace,
        sizeUnit: input.sizeUnit || config.defaultCellUnit,
        sizeValue: typeof input.sizeValue === 'number' ? input.sizeValue : config.defaultCellSize,
        index: Array.isArray(input.cellIndex) ? input.cellIndex : [0, 0],
      },
      posture: input.posture || 'UNKNOWN',
      phase,
      grammar,
      output: {
        recommendedAction: input.intent || 'observe',
        confidence: typeof input.confidence === 'number' ? input.confidence : 0.66,
        riskLevel: input.riskLevel || 'LOW',
        auditReason: `phase=${phase}; grammar=${grammar}`,
      },
    };

    if (window.ZChronicle) window.ZChronicle.record({ source: 'kairocell', event: result });
    if (window.ZSuperGhost) window.ZSuperGhost.ingest(result);

    return result;
  }

  return { evaluate };
}

function bootKairoCell() {
  if (typeof window === 'undefined') return;
  if (window.ZKairoCell) return;

  window.ZKairoCell = createKairoCellEngine();
  window.ZChronicle?.write?.({
    type: 'z.kairocell.boot',
    ts: new Date().toISOString(),
    status: 'online',
  });
}

bootKairoCell();
