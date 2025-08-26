// src/utils/responses.js

/**
 * Respuesta estándar de éxito.
 * @param {object} res - response de Express
 * @param {object|array|null} data - datos a devolver
 * @param {object|null} meta - metainformación (ej: paginación, conteo)
 * @param {number} status - código HTTP (default: 200)
 */
export function successResponse(res, data = null, meta = null, status = 200) {
  const payload = { ok: true, data };
  if (meta) payload.meta = meta;
  return res.status(status).json(payload);
}

/**
 * Respuesta para creación de recurso (201 Created).
 * @param {object} res
 * @param {object} data
 */
export function createdResponse(res, data) {
  return res.status(201).json({ ok: true, data });
}

/**
 * Respuesta vacía (204 No Content).
 * @param {object} res
 */
export function noContentResponse(res) {
  return res.status(204).send();
}

/**
 * Respuesta estándar de error.
 * @param {object} res - response de Express
 * @param {string} message - descripción legible del error
 * @param {number} status - código HTTP
 * @param {string|null} code - código de error (ej: NOT_FOUND, DUPLICATE_KEY)
 * @param {object|null} meta - info adicional
 */
export function errorResponse(res, message, status = 500, code = null, meta = null) {
  const payload = { ok: false, error: { code, message } };
  if (meta) payload.meta = meta;
  return res.status(status).json(payload);
}
