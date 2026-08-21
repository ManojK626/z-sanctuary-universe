/**
 * Control discovery + safe click heuristics for Sanctuary E2E.
 */

const WAKE_RE =
  /\b(wake|deploy|ssws\s*start|start\s*ssws|start\s*ssr|ssr\s*wake|auto[- ]?merge|production\s*bind|cloudflare\s*bind|pay|payment|secret|password|delete\s*all)\b/i;

const HOLD_RE = /\b(hold|observe[_\s-]?only|steward|human\s*decision|no[- ]go|dormant|readonly|read[- ]only)\b/i;

export function isExternalHref(href, baseOrigin) {
  if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return { kind: 'non_nav', href };
  }
  try {
    const u = new URL(href, baseOrigin);
    if (u.origin !== baseOrigin) return { kind: 'external', href: u.href };
    return { kind: 'internal', href: u.pathname + u.search + u.hash };
  } catch {
    return { kind: 'invalid', href };
  }
}

export function classifyControlRisk(text, attrs = {}) {
  const blob = `${text || ''} ${attrs.id || ''} ${attrs.title || ''} ${attrs['aria-label'] || ''} ${attrs.name || ''}`;
  if (WAKE_RE.test(blob)) return 'GOVERNANCE_SENSITIVE';
  if (HOLD_RE.test(blob)) return 'HOLD_LABELED';
  if (attrs.disabled || attrs['aria-disabled'] === 'true') return 'DISABLED';
  return 'SAFE_CANDIDATE';
}

/**
 * Inventory interactive controls on the current page.
 */
export async function inventoryControls(page) {
  return page.evaluate(() => {
    function visible(el) {
      const st = window.getComputedStyle(el);
      if (st.display === 'none' || st.visibility === 'hidden' || st.opacity === '0') return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    }
    function labelOf(el) {
      return (
        (el.getAttribute('aria-label') || '') ||
        (el.getAttribute('title') || '') ||
        (el.id ? `#${el.id}` : '') ||
        (el.name ? `[name=${el.name}]` : '') ||
        (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80) ||
        el.tagName.toLowerCase()
      );
    }
    const selectors = [
      'button',
      'a[href]',
      '[role="button"]',
      '[role="tab"]',
      'input:not([type="hidden"])',
      'select',
      'textarea',
      '[role="checkbox"]',
      '[role="radio"]',
      '[role="switch"]',
      'summary',
      '[onclick]',
      '[data-action]',
    ];
    const seen = new Set();
    const items = [];
    for (const sel of selectors) {
      for (const el of document.querySelectorAll(sel)) {
        if (seen.has(el)) continue;
        seen.add(el);
        const tag = el.tagName.toLowerCase();
        const role = el.getAttribute('role') || '';
        const type = el.getAttribute('type') || '';
        const href = el.getAttribute('href') || '';
        const id = el.id || '';
        const name = el.getAttribute('name') || '';
        const title = el.getAttribute('title') || '';
        const aria = el.getAttribute('aria-label') || '';
        const text = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 120);
        const disabled = el.disabled === true || el.getAttribute('aria-disabled') === 'true';
        items.push({
          tag,
          role,
          type,
          href,
          id,
          name,
          title,
          ariaLabel: aria,
          text,
          label: labelOf(el),
          disabled,
          visible: visible(el),
          selectorHint: id
            ? `#${CSS.escape(id)}`
            : aria
              ? `[aria-label="${aria.replace(/"/g, '\\"')}"]`
              : tag,
        });
      }
    }
    return items;
  });
}

export async function attachMonitors(page) {
  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];
  const externalRequests = [];
  const localRequests = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push({ text: msg.text(), location: msg.location() });
    }
  });
  page.on('pageerror', (err) => {
    pageErrors.push(String(err && err.message ? err.message : err));
  });
  page.on('requestfailed', (req) => {
    failedRequests.push({ url: req.url(), error: req.failure()?.errorText || 'failed' });
  });
  page.on('request', (req) => {
    try {
      const u = new URL(req.url());
      if (u.hostname === '127.0.0.1' || u.hostname === 'localhost') {
        localRequests.push(u.pathname);
      } else if (/^(data|blob):/i.test(req.url())) {
        /* ignore */
      } else {
        externalRequests.push(req.url());
      }
    } catch {
      /* ignore */
    }
  });

  return {
    consoleErrors,
    pageErrors,
    failedRequests,
    externalRequests,
    localRequests,
    snapshot() {
      return {
        consoleErrors: [...consoleErrors],
        pageErrors: [...pageErrors],
        failedRequests: [...failedRequests],
        unexpectedExternal: [...new Set(externalRequests)].filter(
          (u) =>
            !/fonts\.googleapis|fonts\.gstatic|cdn\.jsdelivr|unpkg\.com|cdnjs\.cloudflare/i.test(u)
        ),
        expectedExternalRefs: [...new Set(externalRequests)].filter((u) =>
          /fonts\.googleapis|fonts\.gstatic|cdn\.jsdelivr|unpkg\.com|cdnjs\.cloudflare/i.test(u)
        ),
      };
    },
  };
}

export function isSensitiveControl(item) {
  return classifyControlRisk(item.text || item.label, item) === 'GOVERNANCE_SENSITIVE';
}
