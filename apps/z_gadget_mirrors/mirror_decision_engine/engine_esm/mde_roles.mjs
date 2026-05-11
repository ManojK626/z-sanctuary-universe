function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export function computeRoleAlignmentScore(profile, selectedRole) {
  const roles = profile?.role_strengths || {};
  const strength = Number(roles[selectedRole] ?? 5);
  return clamp(Math.round((strength / 10) * 100), 0, 100);
}
