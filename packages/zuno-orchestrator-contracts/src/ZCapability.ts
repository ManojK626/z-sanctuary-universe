/**
 * Declares a capability family the orchestrator may route (doctrine-level taxonomy).
 * Does not imply runtime dispatch or external APIs.
 */
export type ZCapabilityFamily =
  | 'text_reasoning'
  | 'code'
  | 'image'
  | 'audio'
  | 'music'
  | 'video'
  | 'pdf_document'
  | 'research'
  | 'automation_script'
  | 'evaluation_verify'
  | 'accessibility'
  | 'governance';

export interface ZCapability {
  readonly family: ZCapabilityFamily;
  /** Optional fine-grained labels, e.g. lint, structure_verify */
  readonly labels?: readonly string[];
}
