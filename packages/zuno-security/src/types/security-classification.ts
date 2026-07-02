import type { SECURITY_CLASSIFICATIONS } from '../constants/classifications';

export type SecurityClassification = (typeof SECURITY_CLASSIFICATIONS)[number];
