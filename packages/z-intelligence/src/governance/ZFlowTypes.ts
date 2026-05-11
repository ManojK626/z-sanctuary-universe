export type ZTriggerType = 'event' | 'time' | 'threshold' | 'manual';
export type ZRiskClass = 'low' | 'medium' | 'high' | 'sacred';
export type ZConsentLevel = 'auto' | 'notify' | 'require_human';
export type ZConsentTimeoutPolicy = 'wait' | 'cancel' | 'escalate';
export type ZActionType =
  | 'ui_banner'
  | 'ui_modal'
  | 'start_breathing_timer'
  | 'dim_effects'
  | 'reduce_audio'
  | 'soft_lock_module'
  | 'start_cooldown'
  | 'notify_contact'
  | 'write_audit_note'
  | 'pause_module'
  | 'resume_module';
export type ZGovernanceAiAllowed = 'observe' | 'suggest' | 'simulate' | 'explain';
export type ZGovernanceAiForbidden = 'execute' | 'authorize' | 'modify_rules' | 'bypass_consent';

export interface ZRuleTrigger {
  type: ZTriggerType;
  source: string;
  event_type: string;
  payload_schema_ref?: string;
}

export interface ZRuleContextRequirements {
  z_state: boolean;
  lpbs_state: boolean;
  ggaesp_360: boolean;
  wellbeing_state: boolean;
  session_meta: boolean;
}

export type ZConditionOperator =
  | 'eq'
  | 'ne'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'in'
  | 'not_in'
  | 'exists';

export interface ZCondition {
  path: string;
  op: ZConditionOperator;
  value: unknown;
}

export interface ZRuleConsent {
  level: ZConsentLevel;
  timeout_policy: ZConsentTimeoutPolicy;
  timeout_seconds?: number;
}

export interface ZAction {
  type: ZActionType;
  params: Record<string, unknown>;
}

export interface ZRuleActionSet {
  allowed_actions: ZAction[];
  max_repetitions: number;
  cooldown_seconds: number;
  rollback_allowed: boolean;
}

export interface ZRuleGovernance {
  ai_allowed: ZGovernanceAiAllowed[];
  ai_forbidden: ZGovernanceAiForbidden[];
  human_override: 'always_true';
}

export interface ZRuleAuditSeal {
  ethical_intent: string;
  creator_signature: string;
  creation_time: string;
  version: string;
}

export type ZRuleLifecycleStatus = 'draft' | 'active' | 'paused' | 'retired';

export interface ZRuleLifecycle {
  status: ZRuleLifecycleStatus;
  activation_date: string;
  review_interval_days: number;
}

export interface ZRule {
  rule_id: string;
  rule_name: string;
  trigger: ZRuleTrigger;
  context_requirements: ZRuleContextRequirements;
  conditions?: ZCondition[];
  risk_class: ZRiskClass;
  consent: ZRuleConsent;
  action_set: ZRuleActionSet;
  governance: ZRuleGovernance;
  audit_seal: ZRuleAuditSeal;
  lifecycle: ZRuleLifecycle;
}

export interface ZContextSnapshot {
  timestamp: string;
  module: string;
  z_state: Record<string, unknown>;
  lpbs_state: Record<string, unknown>;
  ggaesp_360: {
    momentum: number;
    stability: number;
    deviation: number;
    trend_slope: number;
  };
  wellbeing_state: {
    focus_level: number;
    fatigue_index: number;
    stress_index: number;
    sleep_debt_hours?: number;
  };
  session_meta: {
    session_id: string;
    duration_seconds: number;
  };
}

export interface ZHumanDecision {
  approved?: boolean;
  human_id?: string;
  decision_time?: string;
}

export type ZExecutionResult = 'executed' | 'aborted' | 'blocked' | 'failed';

export interface ZAuditEvent {
  audit_id: string;
  timestamp: string;
  rule_id: string;
  trigger_event_type: string;
  risk_class: ZRiskClass;
  consent_level: ZConsentLevel;
  human_decision?: ZHumanDecision | null;
  execution_result: ZExecutionResult;
  actions_executed?: string[];
  context_hash: string;
  notes?: string;
}

export interface ZDashboardPanel {
  id: string;
  title: string;
  type: 'live_spine' | 'rule_registry' | 'consent_center' | 'stability';
}

export interface ZDashboardConfig {
  panels: ZDashboardPanel[];
}
