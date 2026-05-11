/**
 * Provider adapter metadata — mirrors docs/orchestration/ZUNO_PROVIDER_ADAPTER_CONTRACT.md.
 * No secrets; enabled=false is expected until governance explicitly allows.
 */
export type ZProviderRiskClass = 'low' | 'medium' | 'high';

export interface ZProviderAdapter {
  readonly id: string;
  readonly name: string;
  readonly capabilities: readonly string[];
  readonly riskClass: ZProviderRiskClass;
  readonly enabled: boolean;
}
