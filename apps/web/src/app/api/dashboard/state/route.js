/**
 * Embedded governance state for SKK + RKPK companion UI when no external API (port 3333) is running.
 * Shape matches what useGovernanceState expects.
 */
export async function GET() {
  const body = {
    mood: 'balanced',
    message: 'Governance dashboard connected (embedded demo state). Connect NEXT_PUBLIC_API_URL for live backend.',
    completionPct: 72,
    skk: 'Stability kernel: coherence nominal; registry and verify gates green.',
    rkpk: 'Rhythm key: observability ladder pacing aligned with manifest ethics scope.',
  };
  return Response.json(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
