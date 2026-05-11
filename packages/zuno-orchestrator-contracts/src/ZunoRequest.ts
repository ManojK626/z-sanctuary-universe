import type { ZCapability } from './ZCapability';
import type { ZFormulaRef } from './ZFormulaRef';

/**
 * Inbound orchestrator request (conceptual). No execution implied.
 */
export interface ZunoRequest {
  readonly id: string;
  readonly createdAtIso?: string;
  readonly intentSummary: string;
  /** Owning project / repo lane label, e.g. ZSanctuary_Universe */
  readonly projectScope: string;
  readonly capabilitiesSought: readonly ZCapability[];
  readonly formulaRef?: ZFormulaRef;
  readonly metadata?: Readonly<Record<string, string>>;
}
