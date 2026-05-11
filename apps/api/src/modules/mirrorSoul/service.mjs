// Z: apps\api\src\modules\mirrorSoul\service.mjs
import { createEntryV2, reflectV2, getHistoryV2, resolveValidationV2, validateFromUser } from 'z-sanctuary-mirrorsoul-slice';

/**
 * @param {string} hubRoot
 * @param {object} body
 */
export function mirrorSoulService(hubRoot) {
  return {
    async createEntry(body) {
      return createEntryV2({
        user_id: body?.user_id,
        text: body?.text,
        emotion: body?.emotion,
        intensity: body?.intensity,
        hubRoot,
      });
    },
    async reflect(body) {
      return reflectV2({
        user_id: body?.user_id,
        text: body?.text,
        emotion: body?.emotion,
        intensity: body?.intensity,
        hubRoot,
        logValidation: true,
      });
    },
    getHistory(userId, limit) {
      return getHistoryV2(String(userId), hubRoot, Number(limit) || 50);
    },
    resolveValidation(body) {
      return resolveValidationV2(hubRoot, {
        prediction_id: body?.prediction_id,
        outcome: body?.outcome,
        notes: body?.notes,
        actor: body?.actor,
      });
    },
    humanFeedback(body) {
      return validateFromUser(hubRoot, {
        prediction_id: body?.prediction_id,
        user_feedback: body?.user_feedback,
        notes: body?.notes,
      });
    },
  };
}
