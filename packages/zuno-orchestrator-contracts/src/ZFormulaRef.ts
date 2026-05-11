/**
 * Pointer to a formula frame (documentation / registry id), not executable magic.
 */
export interface ZFormulaRef {
  readonly id: string;
  readonly docPath?: string;
  readonly version?: string;
}
