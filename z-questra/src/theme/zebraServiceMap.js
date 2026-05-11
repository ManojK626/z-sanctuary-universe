/**
 * Phase 2.3B — local metadata only for Z-Zebras Family inspector layer.
 * Readiness tags are roadmap labels — not certification or compliance claims.
 */

export const BRIDGE_NOT_CONNECTED = 'not_connected';

/** Standard / regulatory readiness roadmap labels (informational only) */
export const STANDARD_READINESS_TAG = {
  WCAG_2_2_READINESS: 'WCAG_2_2_READINESS',
  EAA_READINESS: 'EAA_READINESS',
  EN_301_549_READINESS: 'EN_301_549_READINESS',
  ISO_42001_AI_GOVERNANCE_READINESS: 'ISO_42001_AI_GOVERNANCE_READINESS',
  ISO_27001_SECURITY_READINESS: 'ISO_27001_SECURITY_READINESS',
  SOC2_TRUST_READINESS: 'SOC2_TRUST_READINESS',
  CHILD_PRIVACY_READINESS: 'CHILD_PRIVACY_READINESS',
};

export const ZEBRA_ROLES = [
  {
    zebraId: 'at-love',
    name: 'AT Love Zebra',
    icon: '🦓',
    role: 'Kindness / design guardian — keeps UI colorful, warm, inclusive.',
    currentStatus: 'local_preview',
    futureServiceRoute: 'z-sanctuary/zebras/at-love',
    standardReadinessTags: [],
    requiresConsent: false,
    requiresDRPGate: true,
    bridgeStatus: BRIDGE_NOT_CONNECTED,
  },
  {
    zebraId: 'inspector',
    name: 'Z-Inspector Zebra',
    icon: '🔍',
    role: 'Readability, harsh color spots, labels, unsafe motion — checklist mindset.',
    currentStatus: 'local_preview',
    futureServiceRoute: 'z-sanctuary/zebras/inspector',
    standardReadinessTags: [STANDARD_READINESS_TAG.WCAG_2_2_READINESS],
    requiresConsent: false,
    requiresDRPGate: true,
    bridgeStatus: BRIDGE_NOT_CONNECTED,
  },
  {
    zebraId: 'designer',
    name: 'Z-Designer Zebra',
    icon: '🎨',
    role: 'Color systems, panel identity, visual lanes — ties to Phase 2.3 tokens.',
    currentStatus: 'local_preview',
    futureServiceRoute: 'z-sanctuary/zebras/designer',
    standardReadinessTags: [],
    requiresConsent: false,
    requiresDRPGate: false,
    bridgeStatus: BRIDGE_NOT_CONNECTED,
  },
  {
    zebraId: 'code',
    name: 'Z-Code Zebra',
    icon: '⚙️',
    role: 'Component structure, reuse, coupling hygiene — manual review prompts.',
    currentStatus: 'local_preview',
    futureServiceRoute: 'z-sanctuary/zebras/code',
    standardReadinessTags: [],
    requiresConsent: false,
    requiresDRPGate: false,
    bridgeStatus: BRIDGE_NOT_CONNECTED,
  },
  {
    zebraId: 'performance',
    name: 'Z-Performance Zebra',
    icon: '📊',
    role: 'Bundle weight, CSS complexity, responsiveness — awareness cards only.',
    currentStatus: 'local_preview',
    futureServiceRoute: 'z-sanctuary/zebras/performance',
    standardReadinessTags: [],
    requiresConsent: false,
    requiresDRPGate: false,
    bridgeStatus: BRIDGE_NOT_CONNECTED,
  },
  {
    zebraId: 'access',
    name: 'Z-Access Zebra',
    icon: '♿',
    role: 'Contrast, focus, keyboard paths, motion safety — WCAG-aligned readiness, not a conformance report.',
    currentStatus: 'local_preview',
    futureServiceRoute: 'z-sanctuary/zebras/access',
    standardReadinessTags: [
      STANDARD_READINESS_TAG.WCAG_2_2_READINESS,
      STANDARD_READINESS_TAG.EAA_READINESS,
      STANDARD_READINESS_TAG.EN_301_549_READINESS,
    ],
    requiresConsent: false,
    requiresDRPGate: true,
    bridgeStatus: BRIDGE_NOT_CONNECTED,
  },
  {
    zebraId: 'kids',
    name: 'Z-Kids Zebra',
    icon: '🌈',
    role: 'Kids mode calm copy, soft color, low overstimulation — governance with guardians.',
    currentStatus: 'local_preview',
    futureServiceRoute: 'z-sanctuary/zebras/kids',
    standardReadinessTags: [STANDARD_READINESS_TAG.CHILD_PRIVACY_READINESS],
    requiresConsent: true,
    requiresDRPGate: true,
    bridgeStatus: BRIDGE_NOT_CONNECTED,
  },
  {
    zebraId: 'learn',
    name: 'Z-Learn Zebra',
    icon: '📓',
    role: 'Local Notebook under Z tools → Notes — opt-in localStorage; JSON export; no cloud.',
    currentStatus: 'local_preview',
    futureServiceRoute: 'z-sanctuary/zebras/learn',
    standardReadinessTags: [],
    requiresConsent: false,
    requiresDRPGate: true,
    bridgeStatus: BRIDGE_NOT_CONNECTED,
  },
  {
    zebraId: 'service',
    name: 'Z-Service Zebra',
    icon: '🌍',
    role: 'Scheduler / email / API bridge posture — disabled until explicit gate.',
    currentStatus: 'gated',
    futureServiceRoute: 'z-sanctuary/zebras/service',
    standardReadinessTags: [STANDARD_READINESS_TAG.SOC2_TRUST_READINESS],
    requiresConsent: true,
    requiresDRPGate: true,
    bridgeStatus: BRIDGE_NOT_CONNECTED,
  },
  {
    zebraId: 'drp',
    name: 'Z-DRP Zebra',
    icon: '🛡️',
    role: '14 DRP gate awareness — consent, privacy, fairness, dignity — human sign-off required for real gates.',
    currentStatus: 'local_preview',
    futureServiceRoute: 'z-sanctuary/zebras/drp',
    standardReadinessTags: [
      STANDARD_READINESS_TAG.ISO_42001_AI_GOVERNANCE_READINESS,
      STANDARD_READINESS_TAG.ISO_27001_SECURITY_READINESS,
    ],
    requiresConsent: true,
    requiresDRPGate: true,
    bridgeStatus: BRIDGE_NOT_CONNECTED,
  },
];

export const READINESS_CARDS = [
  {
    id: 'visual-comfort',
    title: 'Visual comfort readiness',
    summary: 'Comfort bar, age modes, low-light / photophobia paths — local checklist only.',
    standardReadinessTags: [],
    mockTier: 'Free Safe Mode',
  },
  {
    id: 'accessibility',
    title: 'Accessibility readiness',
    summary:
      'Design aligned with accessibility best practice; not a WCAG conformance certificate. Official testing requires qualified review.',
    standardReadinessTags: [
      STANDARD_READINESS_TAG.WCAG_2_2_READINESS,
      STANDARD_READINESS_TAG.EAA_READINESS,
      STANDARD_READINESS_TAG.EN_301_549_READINESS,
    ],
    mockTier: 'Certified-Ready Pack (roadmap)',
  },
  {
    id: 'kids-learning',
    title: 'Kids learning readiness',
    summary: 'Soft language and color posture; COPPA/GDPR Article 8 are legal contexts — not legal advice here.',
    standardReadinessTags: [STANDARD_READINESS_TAG.CHILD_PRIVACY_READINESS],
    mockTier: 'Student / Kids Learning Mode',
  },
  {
    id: 'notes-diary',
    title: 'Notes / diary readiness',
    summary: 'Local Notebook available — opt-in device memory, guardian preview, JSON backup only.',
    standardReadinessTags: [],
    mockTier: 'Family Mode (preview)',
  },
  {
    id: 'scheduler',
    title: 'Scheduler readiness',
    summary: 'Mock slot cards — no calendar sync, no email.',
    standardReadinessTags: [],
    mockTier: 'Family Mode (preview)',
  },
  {
    id: 'service-bridge',
    title: 'Service bridge readiness',
    summary: 'Future API/email posture — gated; bridge status not connected.',
    standardReadinessTags: [STANDARD_READINESS_TAG.SOC2_TRUST_READINESS],
    mockTier: 'Enterprise Mode (roadmap)',
  },
  {
    id: 'cert-roadmap',
    title: 'Certification-readiness roadmap',
    summary: 'Evidence checklist mindset — official certification requires external qualified audit.',
    standardReadinessTags: Object.values(STANDARD_READINESS_TAG),
    mockTier: 'Certified-Ready Pack (roadmap)',
  },
];

/** Short operator checklist — all informational */
export const ZEBRA_LOCAL_CHECKLIST_ITEMS = [
  { id: 'c1', label: 'Comfort bar labels visible and toggles respond', done: true },
  { id: 'c2', label: 'Reduced motion path respected (user + OS)', done: true },
  { id: 'c3', label: 'Photophobia / low-light reduce glow in UI tokens', done: true },
  { id: 'c4', label: 'Kids mode uses softer copy and palette intent', done: true },
  { id: 'c5', label: 'No live API, email, voice, or Z-Sanctuary runtime in this build', done: true },
];

export const CERTIFICATION_DISCLAIMER =
  'Readiness support only. Official certification requires qualified legal, accessibility, security, or audit review.';
