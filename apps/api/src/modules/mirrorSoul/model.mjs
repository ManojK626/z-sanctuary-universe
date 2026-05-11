// Z: apps\api\src\modules\mirrorSoul\model.mjs
export const MAX_TEXT = 32000;

export function errValidation(message) {
  const e = new Error(message);
  e.code = 'VALIDATION';
  return e;
}
