import express from 'express';
import {
  createSession,
  getSessionView,
  advance,
  postAnxiety,
} from 'z-sanctuary-zuno-transformation-slice';

export function createZunoFlowRouter(hubRoot) {
  const r = express.Router();

  r.post('/activate', (req, res) => {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    try {
      const out = createSession(hubRoot, {
        user_id: body.user_id,
        mirrorsoul_note: body.mirrorsoul_note,
      });
      res.json({ ok: true, ...out });
    } catch (e) {
      res.status(500).json({ ok: false, error: e?.message || String(e) });
    }
  });

  r.get('/:sessionId', (req, res) => {
    const v = getSessionView(hubRoot, req.params.sessionId);
    if (!v) {
      return res.status(404).json({ error: 'session_not_found' });
    }
    return res.json({ ok: true, ...v });
  });

  r.post('/:sessionId/next', (req, res) => {
    try {
      const out = advance(hubRoot, req.params.sessionId);
      return res.json({ ok: true, ...out });
    } catch (e) {
      if (e?.code === 'NOT_FOUND') return res.status(404).json({ error: e.message });
      if (e?.code === 'VALIDATION')
        return res.status(400).json({ error: e.message, code: 'VALIDATION' });
      return res.status(500).json({ error: e?.message || String(e) });
    }
  });

  r.post('/:sessionId/anxiety', (req, res) => {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    try {
      const out = postAnxiety(hubRoot, req.params.sessionId, body);
      return res.json({ ok: true, ...out });
    } catch (e) {
      if (e?.code === 'NOT_FOUND') return res.status(404).json({ error: e.message });
      if (e?.code === 'VALIDATION')
        return res.status(400).json({ error: e.message, code: 'VALIDATION' });
      return res.status(500).json({ error: e?.message || String(e) });
    }
  });

  return r;
}
