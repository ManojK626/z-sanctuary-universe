/**
 * HTTP load / smoke for z-sanctuary-web (Next.js).
 *
 * Prerequisites: install k6 — https://k6.io/docs/get-started/installation/
 *
 * One-shot local test (build + server + k6 + teardown):
 *   npm run test:run:http-smoke
 *   npm run test:run:http-heavy
 *
 * Manual (from ZSanctuary_Universe repo root):
 *   npm run build --workspace=z-sanctuary-web
 *   $env:PORT='3001'; npm run start --workspace=z-sanctuary-web   # PowerShell; use a free port if :3000 is another app
 *   $env:BASE_URL='http://127.0.0.1:3001'; npm run stress:http
 *
 * If :3000 is not this Next app, `/z-qosmei` may 404 and thresholds will fail — always set BASE_URL to the
 * server that serves this repo’s routes.
 *
 * Env:
 *   BASE_URL   — default http://127.0.0.1:3000
 *   K6_PROFILE — omit or "smoke" = short light load; "heavy" = ramp to more VUs (still not a cloud-scale proof)
 */
/* global __ENV */
import http from 'k6/http';
import { check, sleep } from 'k6';

const base = (__ENV.BASE_URL || 'http://127.0.0.1:3000').replace(/\/+$/, '');
const profile = __ENV.K6_PROFILE || 'smoke';

const paths = ['/', '/z-qosmei', '/api/z-qosmei/manifest', '/api/dashboard/state'];

export const options =
  profile === 'heavy'
    ? {
        stages: [
          { duration: '1m', target: 50 },
          { duration: '3m', target: 200 },
          { duration: '1m', target: 0 },
        ],
        thresholds: {
          http_req_failed: ['rate<0.1'],
        },
      }
    : {
        vus: 10,
        duration: '30s',
        thresholds: {
          http_req_failed: ['rate<0.05'],
        },
      };

export default function run() {
  for (const p of paths) {
    const res = http.get(`${base}${p}`);
    check(res, {
      [`GET ${p} status`]: (r) => r.status >= 200 && r.status < 400,
    });
  }
  sleep(0.15);
}
