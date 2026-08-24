import { SOURCE_PATHS } from './constants.mjs';
import { conflictRecord, uniqueRequiredIds } from './identity.mjs';

export function adaptLedger(ledger) {
  const ringsIn = Array.isArray(ledger?.rings) ? ledger.rings : [];
  const ids = ringsIn.map((r) => r?.id);
  const uniq = uniqueRequiredIds(ids, 'AI_ECOSPHERE_P0_MISSING_AI_ID', 'AI_ECOSPHERE_P0_DUPLICATE_AI_ID');
  if (uniq.hard_stop) return uniq;

  const generated_at = ledger.generated_at;
  const overall = ledger.overall || {};
  const entries = [
    {
      ledger_kind: 'OVERALL',
      source_id: 'overall',
      band: overall.band,
      band_namespace: 'AI_ECOSPHERE_LEDGER',
      sync_score: overall.sync_score,
      potential_label: overall.potential_label,
      color: overall.color,
      verified_active: false,
      origin: 'DERIVED_REAL',
      note: 'LEDGER ENTRY ≠ LIVE AI; GREEN ≠ ACTIVE; sync_score ≠ truth/authority',
      provenance: {
        path: SOURCE_PATHS.ledger,
        source_record: 'overall',
        source_namespace: 'AI_ECOSPHERE_LEDGER',
        generated_at,
        origin: 'DERIVED_REAL',
      },
    },
    ...[...ringsIn]
      .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
      .map((r) => ({
        ledger_kind: 'RING',
        source_id: r.id,
        ring_title: r.ring_title,
        band: r.band,
        band_namespace: 'AI_ECOSPHERE_LEDGER',
        sync_score: r.sync_score,
        potential_label: r.potential_label,
        color: r.color,
        detail: r.detail,
        verified_active: false,
        origin: 'DERIVED_REAL',
        note: 'LEDGER ENTRY ≠ LIVE AI; band ≠ runtime',
        provenance: {
          path: SOURCE_PATHS.ledger,
          source_record: `rings[id=${r.id}]`,
          source_namespace: 'AI_ECOSPHERE_LEDGER',
          generated_at,
          origin: 'DERIVED_REAL',
        },
      })),
  ];

  const conflicts = [];
  const deltaRings = ledger.delta?.rings || {};
  for (const r of ringsIn) {
    const d = deltaRings[r.id];
    if (d && typeof d.current === 'number' && typeof r.sync_score === 'number' && d.current !== r.sync_score) {
      conflicts.push(
        conflictRecord({
          entity_ref: `ECOSPHERE_RING::${r.id}`,
          semantic_field: 'ledger.ring.sync_score',
          claims: [
            { source: SOURCE_PATHS.ledger, record: `rings[id=${r.id}].sync_score`, value: r.sync_score },
            { source: SOURCE_PATHS.ledger, record: `delta.rings[${r.id}].current`, value: d.current },
          ],
          source_refs: [SOURCE_PATHS.ledger],
        }),
      );
    }
  }

  const alertSync = ledger.consistency_alerts?.inputs?.ecosphere_overall_sync;
  if (typeof alertSync === 'number' && typeof overall.sync_score === 'number' && alertSync !== overall.sync_score) {
    conflicts.push(
      conflictRecord({
        entity_ref: 'AI_ECOSPHERE_LEDGER::overall',
        semantic_field: 'ledger.overall.sync_score',
        claims: [
          { source: SOURCE_PATHS.ledger, record: 'overall.sync_score', value: overall.sync_score },
          {
            source: SOURCE_PATHS.ledger,
            record: 'consistency_alerts.inputs.ecosphere_overall_sync',
            value: alertSync,
          },
        ],
        source_refs: [SOURCE_PATHS.ledger],
      }),
    );
  }

  const unmatched_records = [];
  if (ledger.task_accomplishments) {
    unmatched_records.push({
      reason: 'LEDGER_TASK_SAMPLES_NOT_TYPED_IDENTITY',
      source_key: 'task_accomplishments',
      source_value: ledger.task_accomplishments,
      origin: 'DERIVED_REAL',
      note: 'Retained; actor_id is not a Project World association',
      provenance: {
        path: SOURCE_PATHS.ledger,
        source_record: 'task_accomplishments',
        source_namespace: 'AI_ECOSPHERE_LEDGER',
        generated_at,
        origin: 'DERIVED_REAL',
      },
    });
  }

  return {
    governance_note: ledger.governance_note,
    generated_at,
    entries,
    conflicts,
    unmatched_records,
  };
}
