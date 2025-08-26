// Zona de importacion de modulos
import { validationResult } from "express-validator"; // validacion de Body con express-validator

// Funcion de activacion de validadores con express-validator
export function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ ok: false, errors: errors.array() });
  }
  next();
}