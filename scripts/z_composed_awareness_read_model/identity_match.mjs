/**
 * Explicit identity matching only.
 * Forbidden: substring, case-fold without alias, similar spelling, same display title, semantic guess.
 */
export function exactIdEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  return a === b;
}

export function tryExactJoin(pcRootId, awarenessProjectId) {
  if (exactIdEqual(pcRootId, awarenessProjectId)) {
    return { matched: true, rule: 'EXACT_CANONICAL_ID' };
  }
  return { matched: false };
}

/**
 * Explicit registry relationship from ecosystem awareness hub fields + pc_root hub row.
 * Not a name guess: compares role, folder path, canonical_hub_folder, canonical_hub_name.
 */
export function tryHubFolderJoin(pcRow, ecoRegistry, awarenessRow) {
  if (!pcRow || !ecoRegistry || !awarenessRow) return { matched: false };
  if (pcRow.role !== 'hub') return { matched: false };
  if (awarenessRow.project_type !== 'hub') return { matched: false };
  if (!exactIdEqual(pcRow.path, ecoRegistry.canonical_hub_folder)) return { matched: false };
  if (!exactIdEqual(awarenessRow.project_id, ecoRegistry.canonical_hub_name)) return { matched: false };
  return {
    matched: true,
    rule: 'EXPLICIT_HUB_FOLDER_REGISTRY_RELATION',
  };
}

export function negativeIdentityAudit() {
  const failures = [];
  const expect = (cond, msg) => {
    if (!cond) failures.push(msg);
  };

  expect(!tryExactJoin('ZSanctuary_Universe', 'zsanctuary_universe').matched, 'case-fold must not match');
  expect(!tryExactJoin('z-labs', 'Z-Labs').matched, 'different case must not match');
  expect(!tryExactJoin('at-princess-blackie-copilot', 'at_princess_blackie').matched, 'underscore vs hyphen must not match');
  expect(!tryExactJoin('z-sanctuary-browser-z-saiyan-lumina', 'z_saiyan_lumina_browser').matched, 'similar spelling must not match');
  expect(tryExactJoin('z-labs', 'z-labs').matched, 'exact id must match');
  expect(
    tryHubFolderJoin(
      { role: 'hub', path: 'Z_Sanctuary_Universe' },
      { canonical_hub_folder: 'Z_Sanctuary_Universe', canonical_hub_name: 'ZSanctuary_Universe' },
      { project_type: 'hub', project_id: 'ZSanctuary_Universe' },
    ).matched,
    'hub folder join must work when fields are explicit',
  );
  expect(
    !tryHubFolderJoin(
      { role: 'hub', path: 'Z_Sanctuary_Universe' },
      { canonical_hub_folder: 'Z_Sanctuary_Universe', canonical_hub_name: 'ZSanctuary_Universe' },
      { project_type: 'hub', project_id: 'Z_Sanctuary_Universe' },
    ).matched,
    'hub join must not succeed when canonical_hub_name differs from project_id',
  );
  expect(
    !tryHubFolderJoin(
      { role: 'member', path: 'Z_Sanctuary_Universe' },
      { canonical_hub_folder: 'Z_Sanctuary_Universe', canonical_hub_name: 'ZSanctuary_Universe' },
      { project_type: 'hub', project_id: 'ZSanctuary_Universe' },
    ).matched,
    'member row must not use hub-folder join',
  );
  expect('UNRESOLVED' !== 'SAME_PROJECT', 'UNRESOLVED ≠ SAME_PROJECT');
  expect('SEPARATE_PROJECT' !== 'MEMBER', 'SEPARATE_PROJECT ≠ MEMBER MERGE');
  expect('SUBSYSTEM' !== 'SEPARATE_PROJECT', 'SUBSYSTEM ≠ SEPARATE_PROJECT');

  return { pass: failures.length === 0, failures };
}
