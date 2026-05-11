/**
 * Path constants for Cloudflare contingency + dashboard AI precaution docs and manifests.
 * Hub authority is unchanged; edge is optional. Run `npm run comms:cloudflare-ai` after edits.
 */
export const Z_CLOUDFLARE_AI_COMMS = {
  requirementsJson: 'data/z_cloudflare_ai_comms_requirements.json',
  manifestJson: 'data/reports/z_cloudflare_ai_comms_manifest.json',
  contingencyIdentityJson: 'data/z_cloudflare_contingency_identity.json',
  precautionsMd: 'docs/Z-CLOUDFLARE-AI-COMMS-PRECAUTIONS.md',
  monorepoGuideMd: 'MONOREPO_GUIDE.md',
  completionsFlowMd: 'docs/Z-COMPLETIONS-TEST-AND-COMMUNICATIONS-FLOW.md'
};
