// Z: core/z_request_access_gate.js
// Request-only gate with signed, time-limited token verification.
(function () {
  const script = document.currentScript;
  const publicKeyPath = script?.dataset?.publicKey || '/config/z_request_access_public.pem';
  const revocationsPath =
    script?.dataset?.revocations || '/config/z_request_access_revocations.json';
  const requiredScope = script?.dataset?.scope || 'trust_portal_deep';
  const storageKey = `zRequestAccess:${requiredScope}`;
  const paramKey = script?.dataset?.param || 'z_access';

  const encoder = new TextEncoder();

  function base64UrlToBytes(input) {
    const padded = input
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(Math.ceil(input.length / 4) * 4, '=');
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }

  function bytesToUtf8(bytes) {
    return new TextDecoder().decode(bytes);
  }

  function pemToArrayBuffer(pemText) {
    const b64 = pemText
      .replace(/-----BEGIN PUBLIC KEY-----/g, '')
      .replace(/-----END PUBLIC KEY-----/g, '')
      .replace(/\s+/g, '');
    return base64UrlToBytes(b64.replace(/\+/g, '-').replace(/\//g, '_')).buffer;
  }

  async function importPublicKey(pemText) {
    const keyData = pemToArrayBuffer(pemText);
    return crypto.subtle.importKey('spki', keyData, { name: 'ECDSA', namedCurve: 'P-256' }, false, [
      'verify',
    ]);
  }

  function parseToken(token) {
    const parts = String(token || '').split('.');
    if (parts.length !== 2) throw new Error('invalid_token_format');
    const [payloadB64, sigB64] = parts;
    const payloadBytes = base64UrlToBytes(payloadB64);
    const signature = base64UrlToBytes(sigB64);
    const payload = JSON.parse(bytesToUtf8(payloadBytes));
    return { payloadB64, payload, signature };
  }

  function isPayloadValid(payload) {
    if (!payload || typeof payload !== 'object') return { ok: false, reason: 'payload_missing' };
    if (payload.scope !== requiredScope) return { ok: false, reason: 'scope_mismatch' };
    if (!payload.exp || Number(payload.exp) < Math.floor(Date.now() / 1000))
      return { ok: false, reason: 'expired' };
    if (payload.path_prefix && !location.pathname.startsWith(payload.path_prefix)) {
      return { ok: false, reason: 'path_mismatch' };
    }
    return { ok: true };
  }

  async function loadRevocations() {
    try {
      const res = await fetch(revocationsPath, { cache: 'no-store' });
      if (!res.ok) {
        return { revoked_jti: [], revoked_before_epoch: 0 };
      }
      const data = await res.json();
      return {
        revoked_jti: Array.isArray(data?.revoked_jti) ? data.revoked_jti : [],
        revoked_before_epoch: Number(data?.revoked_before_epoch || 0),
      };
    } catch {
      return { revoked_jti: [], revoked_before_epoch: 0 };
    }
  }

  function isRevoked(payload, revocations) {
    if (!payload) return true;
    if (payload?.jti && revocations.revoked_jti.includes(payload.jti)) return true;
    if (Number(payload?.iat || 0) <= Number(revocations.revoked_before_epoch || 0)) return true;
    return false;
  }

  function setLockedState(locked, reason = '') {
    document.querySelectorAll('[data-request-only]').forEach((el) => {
      if (locked) {
        el.setAttribute('aria-hidden', 'true');
        el.style.display = 'none';
      } else {
        el.removeAttribute('aria-hidden');
        el.style.display = '';
      }
    });
    const statusEl = document.getElementById('zReqGateStatus');
    if (statusEl) {
      statusEl.textContent = locked
        ? `Deep access locked${reason ? ` (${reason})` : ''}`
        : 'Deep access unlocked (time-limited)';
    }
  }

  function storeGrant(payload) {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(payload));
    } catch {
      // ignore storage failures
    }
  }

  function loadGrant() {
    try {
      const raw = sessionStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function clearGrant() {
    try {
      sessionStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
  }

  async function verifyAndGrant(token) {
    const pemRes = await fetch(publicKeyPath, { cache: 'no-store' });
    if (!pemRes.ok) throw new Error('public_key_missing');
    const pemText = await pemRes.text();
    const key = await importPublicKey(pemText);

    const { payloadB64, payload, signature } = parseToken(token);
    const validity = isPayloadValid(payload);
    if (!validity.ok) throw new Error(validity.reason);
    const revocations = await loadRevocations();
    if (isRevoked(payload, revocations)) throw new Error('revoked');

    const verified = await crypto.subtle.verify(
      { name: 'ECDSA', hash: 'SHA-256' },
      key,
      signature,
      encoder.encode(payloadB64)
    );
    if (!verified) throw new Error('signature_invalid');
    storeGrant(payload);
    setLockedState(false);
    return payload;
  }

  async function applyFromUrlOrSession() {
    setLockedState(true, 'request required');

    const url = new URL(window.location.href);
    const fromUrl = url.searchParams.get(paramKey);
    if (fromUrl) {
      try {
        await verifyAndGrant(fromUrl);
        url.searchParams.delete(paramKey);
        window.history.replaceState({}, '', url.toString());
        return;
      } catch (error) {
        setLockedState(true, String(error.message || error));
        return;
      }
    }

    const grant = loadGrant();
    if (!grant) return;
    const validity = isPayloadValid(grant);
    if (!validity.ok) {
      clearGrant();
      setLockedState(true, validity.reason);
      return;
    }
    const revocations = await loadRevocations();
    if (isRevoked(grant, revocations)) {
      clearGrant();
      setLockedState(true, 'revoked');
      return;
    }
    setLockedState(false);
  }

  window.ZRequestAccessGate = {
    unlockWithToken: verifyAndGrant,
    lock: () => {
      clearGrant();
      setLockedState(true, 'manual lock');
    },
    status: () => {
      const grant = loadGrant();
      if (!grant) return { state: 'locked' };
      return { state: 'granted', exp: grant.exp, scope: grant.scope };
    },
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => void applyFromUrlOrSession(), {
      once: true,
    });
  } else {
    void applyFromUrlOrSession();
  }
})();
