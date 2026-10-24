/**
 * Read-only view of the adaptive adoption registry.
 * Displays recorded evidence. Does not classify viewports or write status.
 */
(function (factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.ZAnyDeviceEvidenceView = api;
})(function () {
  var RECORDED_PLATFORM = {
    capability: 'PROVEN_TWO_HOST_PLATFORM_CAPABILITY',
    canonicalOnMain: 'YES',
    ecosystemWideGreen: 'NO',
  };

  function textValue(value) {
    if (value === undefined || value === null || value === '') return 'UNKNOWN';
    return String(value);
  }

  function debtList(value) {
    if (!Array.isArray(value) || value.length === 0) return [];
    return value.map(function (item) {
      return String(item);
    });
  }

  function rowFrom(entry, role) {
    var source = entry || {};
    return {
      role: role,
      project: textValue(source.project_id),
      surface: textValue(source.canonical_surface),
      status: textValue(source.status),
      testedSha: textValue(source.canonical_source_sha),
      contractVersion: textValue(source.contract_version),
      runtimeVersion: textValue(source.adaptive_runtime_version),
      lastTested: textValue(source.last_tested_at),
      chromium: textValue(source.chromium_result),
      firefox: textValue(source.firefox_result),
      webkit: textValue(source.webkit_result),
      viewportCoverage: textValue(source.viewport_coverage),
      pointerFine: textValue(source.pointer_fine),
      pointerCoarse: textValue(source.pointer_coarse),
      hover: textValue(source.hover),
      noHover: textValue(source.no_hover),
      keyboard: textValue(source.keyboard_result),
      reducedMotion: textValue(source.reduced_motion_result),
      safeArea: textValue(source.safe_area_result),
      dynamicViewport: textValue(source.dynamic_viewport_result),
      businessTruth: textValue(source.business_truth_parity),
      physicalDevice: textValue(source.physical_device_evidence),
      openP0: debtList(source.open_p0),
      openP1: debtList(source.open_p1),
      openP2: debtList(source.open_p2),
      receipt: textValue(source.evidence_receipt || source.note),
      syntheticEvidence: textValue(source.viewport_coverage),
      browserFamilyEvidence: [
        'Chromium ' + textValue(source.chromium_result),
        'Firefox ' + textValue(source.firefox_result),
        'WebKit ' + textValue(source.webkit_result),
      ].join(' · '),
    };
  }

  function rowsFromRegistry(registry) {
    var book = registry || {};
    var rows = [];
    (book.entries || []).forEach(function (entry) {
      rows.push(rowFrom(entry, 'HOST'));
    });
    (book.fixtures || []).forEach(function (entry) {
      rows.push(rowFrom(entry, 'FIXTURE'));
    });
    (book.legacy_surfaces || []).forEach(function (entry) {
      rows.push(rowFrom(entry, 'LEGACY_SURFACE'));
    });
    (book.candidate_backlog || []).forEach(function (entry) {
      rows.push(rowFrom(entry, 'CANDIDATE'));
    });
    return rows;
  }

  function debtCount(rows, key) {
    return rows.reduce(function (total, row) {
      return total + row[key].length;
    }, 0);
  }

  function platformSummary(rows) {
    var hosts = rows.filter(function (row) {
      return row.role === 'HOST';
    });
    return {
      capability: RECORDED_PLATFORM.capability,
      canonicalOnMain: RECORDED_PLATFORM.canonicalOnMain,
      ecosystemWideGreen: RECORDED_PLATFORM.ecosystemWideGreen,
      greenHosts: hosts.filter(function (row) {
        return row.status === 'GREEN';
      }).length,
      openP0: debtCount(rows, 'openP0'),
      openP1: debtCount(rows, 'openP1'),
      openP2: debtCount(rows, 'openP2'),
    };
  }

  function matchesStatus(row, filter) {
    if (filter === 'ALL') return true;
    if (filter === 'HAS P0') return row.openP0.length > 0;
    if (filter === 'HAS P1') return row.openP1.length > 0;
    if (filter === 'HAS P2') return row.openP2.length > 0;
    if (filter === 'LEGACY') return row.status === 'LEGACY' || row.status.indexOf('LEGACY') === 0;
    return row.status === filter;
  }

  function filterRows(rows, filter) {
    return rows.filter(function (row) {
      return matchesStatus(row, filter || 'ALL');
    });
  }

  function driftLabel(testedSha, currentSha) {
    if (!testedSha || !currentSha || testedSha === 'UNKNOWN' || currentSha === 'UNKNOWN') return 'UNKNOWN';
    if (testedSha === currentSha) return 'SAME_RECORDED_SHA';
    return 'DRIFT OBSERVED';
  }

  return {
    textValue: textValue,
    rowsFromRegistry: rowsFromRegistry,
    platformSummary: platformSummary,
    filterRows: filterRows,
    driftLabel: driftLabel,
  };
});
