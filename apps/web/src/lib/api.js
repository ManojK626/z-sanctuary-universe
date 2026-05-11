// Z: apps\web\src\lib\api.js
/**
 * @param {string} path Absolute path segment, e.g. `/dashboard/state`
 */
export async function apiFetch(path) {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const external = process.env.NEXT_PUBLIC_API_URL;
  const url = external
    ? `${String(external).replace(/\/$/, '')}${normalized}`
    : `/api${normalized}`;
  const resp = await fetch(url, { cache: 'no-store' });
  if (!resp.ok) {
    throw new Error(`API error ${resp.status}`);
  }
  return resp.json();
}
