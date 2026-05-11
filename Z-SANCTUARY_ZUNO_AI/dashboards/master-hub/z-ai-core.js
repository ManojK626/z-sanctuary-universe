const ZAI_TOWER = [
    { beast: 'Dragon', label: 'Z-Broker', duty: 'Syndicate partnerships & revenue share', workspace: 'Amk-Goku' },
    { beast: 'Owl', label: 'Z-Regulator', duty: 'Protocol enforcement & BioResponse', workspace: 'ZUNO' },
    { beast: 'Elephant', label: 'Z-Logistics', duty: 'Z-Loop returns & pod inventory', workspace: 'Hybrid' },
    { beast: 'Jaguar', label: 'Z-Accountant', duty: 'Stripe ledger & Z-Karma', workspace: 'ZUNO' },
    { beast: 'Fox', label: 'Z-Marketing', duty: 'Roulette education & narratives', workspace: 'ZUNO' },
    { beast: 'Giraffe', label: 'Z-Observer', duty: 'Workspace guard & manifest', workspace: 'All' },
    { beast: 'Phoenix', label: 'Z-Creator', duty: 'R&D + dashboard rebirth', workspace: 'Hybrid' }
];

const Z_FORMULAS = {
    EV: 'Σ(P(x) × V(x)) keeps the roulette EV negative (house edge).',
    RTP: '(Total Won / Total Bet) × 100% → target 96.5%',
    Z_KARMA: 'rewardPoints = floor(streakDays ×10 + syncSessions ×5)',
    BIOSESSION: 'Max 4 sessions / day with 2+ hour cooldown enforced by hardware lockout.'
};

const Z_SSWS = [
    'Only modify dashboards from their assigned root (Z-SANCTUARY vs Amk-Goku).',
    'Every dashboard must import ai-identifier + protocol-enforcer before running.',
    'Observer must confirm no cross-node globals exist before committing changes.'
];

function loadZObserverFacts() {
    return {
        tower: ZAI_TOWER,
        formulas: Z_FORMULAS,
        workflows: Z_SSWS
    };
}

if (typeof module !== 'undefined') {
    module.exports = { loadZObserverFacts };
}
