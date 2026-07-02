import type { VERIFICATION_STAGES } from '../constants/stages';

export type VerificationStage = (typeof VERIFICATION_STAGES)[number];
