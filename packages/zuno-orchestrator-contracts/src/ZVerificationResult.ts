/**
 * Output verifier layer result — see docs/orchestration/ZUNO_OUTPUT_VERIFIER.md.
 */
export type ZVerificationLayer =
  | 'syntactic'
  | 'grounded'
  | 'safe'
  | 'scoped'
  | 'honest';

export interface ZVerificationResult {
  readonly ok: boolean;
  readonly layer: ZVerificationLayer;
  readonly messages?: readonly string[];
}
