export function calculatePriorityScore(user) {
  const reputation = typeof user?.reputation_score === 'number' ? user.reputation_score : 1;

  const dailyAllocated = typeof user?.daily_allocated === 'number' ? user.daily_allocated : 0;
  const lowUsageBonus = dailyAllocated === 0 ? 1.2 : dailyAllocated < 10 ? 1.1 : 1.0;
  const consistencyBonus = user?.flagged ? 0.8 : 1.0;
  const heavyUsagePenalty = dailyAllocated > 15 ? 0.8 : dailyAllocated > 10 ? 0.9 : 1.0;

  const score = reputation * 0.5 + lowUsageBonus * 0.3 + consistencyBonus * 0.2;
  return Math.max(0.5, score * heavyUsagePenalty);
}

export function applyIntelligentAllocation(requested, user) {
  const priority = calculatePriorityScore(user);
  const adjusted = Math.floor(requested * priority);
  return {
    priority_score: priority,
    adjusted_amount: Math.max(1, adjusted)
  };
}
