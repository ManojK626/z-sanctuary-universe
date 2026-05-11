// Z: apps\api\src\modules\mirrorSoul\controller.mjs
import { MAX_TEXT, errValidation } from './model.mjs';
import { mirrorSoulService } from './service.mjs';

function validateText(text) {
  if (typeof text !== 'string' || !text.trim()) {
    throw errValidation('text is required (non-empty string)');
  }
  if (text.length > MAX_TEXT) {
    throw errValidation(`text too long (max ${MAX_TEXT})`);
  }
}

/**
 * @param {string} hubRoot
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function postEntry(hubRoot, req, res) {
  try {
    const body = req.body || {};
    validateText(body.text);
    const s = mirrorSoulService(hubRoot);
    const out = await s.createEntry(body);
    return res.json(out);
  } catch (e) {
    if (e?.code === 'VALIDATION') {
      return res.status(400).json({ error: e.message, code: 'VALIDATION' });
    }
    return res.status(500).json({ error: 'create_failed', message: e?.message || String(e) });
  }
}

/**
 * @param {string} hubRoot
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function postReflect(hubRoot, req, res) {
  try {
    const body = req.body || {};
    validateText(body.text);
    const s = mirrorSoulService(hubRoot);
    const out = await s.reflect(body);
    return res.json({
      reflection: out.reflection,
      signals: out.signals,
      suggestion: out.suggestion,
      confidence: out.confidence,
      id: out.id,
      user_id: out.user_id,
      ts: out.ts,
      reflection_id: out.reflection_id,
      prediction_id: out.prediction_id,
      validation_status: out.validation_status,
      remind_in_hours: out.remind_in_hours,
    });
  } catch (e) {
    if (e?.code === 'VALIDATION') {
      return res.status(400).json({ error: e.message, code: 'VALIDATION' });
    }
    return res.status(500).json({ error: 'reflect_failed', message: e?.message || String(e) });
  }
}

/**
 * @param {string} hubRoot
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export function getHistory(hubRoot, req, res) {
  const userId = req.query?.user_id;
  if (!userId) {
    return res.status(400).json({ error: 'user_id required', code: 'VALIDATION' });
  }
  const limit = req.query?.limit || 50;
  const s = mirrorSoulService(hubRoot);
  return res.json({ user_id: userId, entries: s.getHistory(String(userId), limit) });
}

/**
 * @param {string} hubRoot
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export function postValidate(hubRoot, req, res) {
  try {
    const s = mirrorSoulService(hubRoot);
    const body = req.body || {};
    if (body.user_feedback != null && String(body.user_feedback).trim() !== '') {
      const out = s.humanFeedback(body);
      return res.json(out);
    }
    const row = s.resolveValidation(body);
    return res.json({ ok: true, resolution: row });
  } catch (e) {
    if (e?.code === 'VALIDATION') {
      return res.status(400).json({ error: e.message, code: 'VALIDATION' });
    }
    return res.status(500).json({ error: 'validate_failed', message: e?.message || String(e) });
  }
}
