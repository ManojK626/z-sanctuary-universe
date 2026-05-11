/**
 * 14 DRP / governance posture snapshot at a point in time (read-only shape).
 * Final semantics belong in governance docs and future evaluator scripts.
 */
export type ZDRPOverall = 'pass' | 'pending_human' | 'blocked';

export interface ZDRPDecision {
  readonly overall: ZDRPOverall;
  readonly dimensions?: Readonly<Record<string, 'ok' | 'review' | 'blocked'>>;
  readonly rationale?: readonly string[];
}
