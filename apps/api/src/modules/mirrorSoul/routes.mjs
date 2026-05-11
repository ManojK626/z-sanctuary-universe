// Z: apps\api\src\modules\mirrorSoul\routes.mjs
import express from 'express';
import { postEntry, postReflect, getHistory, postValidate } from './controller.mjs';

/**
 * @param {string} hubRoot
 */
export function createMirrorSoulRouter(hubRoot) {
  const r = express.Router();
  r.post('/entry', (req, res) => postEntry(hubRoot, req, res));
  r.post('/reflect', (req, res) => postReflect(hubRoot, req, res));
  r.get('/history', (req, res) => getHistory(hubRoot, req, res));
  r.post('/validate', (req, res) => postValidate(hubRoot, req, res));
  return r;
}
