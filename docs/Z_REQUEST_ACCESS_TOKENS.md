# Z Request Access Tokens

## Goal

Enable time-limited access to request-only sections without exposing internal data by default.

## Flow

1. Generate key pair (once):
   - `npm run access:keygen`
2. Sign token for approved request:
   - `npm run access:sign -- --scope=trust_portal_deep --hours=8 --path-prefix=/Amk_Goku%20Worldwide%20Loterry/ui/public_trust/`
3. Send approved user a URL with `?z_access=<token>`.
4. Portal verifies signature + expiry + path scope, then unlocks request-only blocks.

## Security Notes

- Private key lives in `vault/personal/z_request_access_private.pem` (local only).
- Public key is loaded from `config/z_request_access_public.pem`.
- Access is session-scoped and expires automatically.
- Manual lock is always available.
