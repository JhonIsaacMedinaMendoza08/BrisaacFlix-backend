import { body, param, query } from "express-validator";
import { ObjectId } from "mongodb";

const ESTADOS = ["pendiente", "leida"];

// Listar Reseñas → permite opcionalmente filtros como ?estado, ?anio
export const listarPublicoTodasRules = [
];

// Crear notificaciones
export const crearNotificacionRules = [
    body("reseniaId")
        .exists()
        .withMessage("reseniaId requerido")
        .bail()
        .custom(val => ObjectId.isValid(val))
        .withMessage("reseniaId debe ser un ObjectId válido"),

    body("usuarioId")
        .exists()
        .withMessage("usuarioId requerido")
        .bail()
        .custom(val => ObjectId.isValid(val))
        .withMessage("usuarioId debe ser un ObjectId válido"),

    body("mensaje")
        .exists()
        .withMessage("mensaje requerido")
        .bail()
        .isString()
        .withMessage("mensaje debe ser string")
        .bail()
        .notEmpty()
        .withMessage("mensaje no puede estar vacío"),
];

// Actualizar estado (solo Admin)
export const actualizarEstadoNotificacionRules = [
    param("id").trim().isMongoId().withMessage("El parámetro :id debe ser un ObjectId válido"),
    body("estado")
        .exists().withMessage("estado requerido")
        .bail()
        .isString()
        .bail()
        .customSanitizer(v => (typeof v === "string" ? v.trim().toLowerCase() : v))
        .isIn(ESTADOS)
        .withMessage(`estado inválido (use: ${ESTADOS.join(" | ")})`),
];