/**
 * Z-Intelligence Core Export
 *
 * Main entry point for all AI subsystems.
 * Use this to import all intelligence modules in one line.
 */

// Memory subsystem
export { ZMemory, sharedMemory, type MemoryEntry, type MemoryConfig } from './memory/ZMemory';

// Learner subsystem
export {
  ZPatternLearner,
  learner,
  type Pattern,
  type LearnerConfig,
} from './learner/ZPatternLearner';

// Planner subsystem
export {
  ZPlannerAI,
  planner,
  type Intent,
  type Action,
  type PlannerConfig,
} from './planner/ZPlannerAI';

// Reflector subsystem
export {
  ZReflectorAI,
  reflector,
  type HealthIndicator,
  type ReflectionSnapshot,
  type ReflectorConfig,
} from './reflector/ZReflectorAI';

// Commander subsystem (orchestrator)
export {
  ZCommanderAI,
  commander,
  type CommanderConfig,
  type CommanderStatus,
  type CommanderState,
} from './commander/ZCommanderAI';

// Governance schemas and types
export {
  type ZAction,
  type ZActionType,
  type ZAuditEvent,
  type ZCondition,
  type ZConsentLevel,
  type ZConsentTimeoutPolicy,
  type ZContextSnapshot,
  type ZDashboardConfig,
  type ZDashboardPanel,
  type ZExecutionResult,
  type ZGovernanceAiAllowed,
  type ZGovernanceAiForbidden,
  type ZHumanDecision,
  type ZRiskClass,
  type ZRule,
  type ZRuleActionSet,
  type ZRuleAuditSeal,
  type ZRuleConsent,
  type ZRuleContextRequirements,
  type ZRuleGovernance,
  type ZRuleLifecycle,
  type ZRuleLifecycleStatus,
  type ZRuleTrigger,
  type ZTriggerType,
} from './governance/ZFlowTypes';

/**
 * Quick start example:
 *
 * import { commander, sharedMemory } from '@z-sanctuary/z-intelligence';
 *
 * // Initialize
 * commander.start();
 *
 * // Check status
 * const status = commander.getStatus();
 * console.log(`Running: ${status.state}, Patterns: ${status.patternCount}`);
 *
 * // Pause when done
 * commander.stop();
 */
