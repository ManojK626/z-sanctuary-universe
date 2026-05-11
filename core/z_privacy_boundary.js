// Z: core/z_privacy_boundary.js
// Enforce intake boundary so raw uploads are never consumed directly.
(function () {
  const RAW_PREFIX = 'uploads/raw/';

  function normalize(p) {
    return String(p || '')
      .replaceAll('\\', '/')
      .replace(/^\.?\//, '');
  }

  function assertApprovedPath(filePath) {
    const normalized = normalize(filePath);
    if (normalized.startsWith(RAW_PREFIX)) {
      throw new Error('Privacy boundary violation: file must pass scan before processing.');
    }
    return true;
  }

  window.ZPrivacyBoundary = {
    RAW_PREFIX,
    assertApprovedPath,
  };
})();
