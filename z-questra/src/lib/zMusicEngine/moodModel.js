/**
 * @typedef {'alignment' | 'power' | 'journey'} ZMode
 */

/**
 * @param {object} input
 * @param {ZMode | undefined} [input.userSelected]
 * @param {'training' | 'rest' | 'reflection' | undefined} [input.context]
 * @param {'kids' | 'teens' | 'adults' | 'enterprise' | undefined} [input.ageMode]
 * @returns {ZMode}
 */
export function inferMode(input = {}) {
  const { userSelected, context, ageMode } = input;
  if (userSelected) return userSelected;

  const kidsGuardian = ageMode === 'kids';

  if (context === 'training') {
    if (kidsGuardian) return 'alignment';
    return 'power';
  }
  if (context === 'reflection') return 'journey';
  return 'alignment';
}
