// Z: apps\api\src\mirrorsoul_routes.mjs
import { processMirrorSoulEntry, getZesState, resolveHubForChildWorkspace } from 'z-sanctuary-mirrorsoul-slice';

/**
 * @param {import('express').Express} app
 * @param {{ hubRoot?: string }} [opt]
 */
export function registerMirrorSoulRoutes(app, opt = {}) {
  const hubRoot = opt.hubRoot ?? resolveHubForChildWorkspace(process.cwd());

  app.post('/api/mirrorsoul', async (req, res) => {
    try {
      const { text, user_id } = req.body || {};
      const out = await processMirrorSoulEntry({
        text,
        user_id: user_id || 'anonymous',
        hubRoot,
      });
      res.json(out);
    } catch (e) {
      if (e.code === 'VALIDATION') {
        return res.status(400).json({ error: e.message, code: 'VALIDATION' });
      }
      res.status(500).json({ error: 'process_failed', message: e?.message || String(e) });
    }
  });

  app.get('/api/zes/:userId', (req, res) => {
    const row = getZesState(req.params.userId, hubRoot);
    res.json({ user_id: req.params.userId, zes: row, advisory: true });
  });
}
