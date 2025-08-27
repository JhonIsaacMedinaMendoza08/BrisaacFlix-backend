// Zona de importacion de modulos

import { body, param, query } from "express-validator";
import { ObjectId } from "mongodb";

// Conjunto de estados válidos
const ESTADOS = ["pendiente", "aprobada", "rechazada"];

// 1. Listar Contenido → permite opcionalmente filtros como ?estado, ?anio
export const listarContenidoRules = [
    query("estado")
        .optional()
        .isIn(ESTADOS)
        .withMessage(`estado inválido (use: ${ESTADOS.join(" | ")})`),
    query("anio")
        .optional()
        .matches(/^\d{4}$/)
        .withMessage("anio debe ser formato YYYY"),
];

// 2. Obtener contenido por ID
export const getContenidoByIdRules = [
    param("id")
        .trim()
        .isMongoId()
        .withMessage("El parámetro :id debe ser un ObjectId válido"),
];

// 3. Crear Contenido (usuario autenticado)
export const crearContenidoRules = [
    body("tmdbId")
        .exists()
        .withMessage("tmdbId requerido")
        .bail()
        .isInt({ min: 1 })
        .withMessage("tmdbId debe ser un número positivo"),

    body("titulo")
        .exists()
        .withMessage("titulo requerido")
        .bail()
        .isString()
        .withMessage("titulo debe ser string")
        .bail()
        .notEmpty()
        .withMessage("titulo no puede estar vacío"),

    body("sinopsis")
        .exists()
        .withMessage("sinopsis requerida")
        .bail()
        .isString()
        .withMessage("sinopsis debe ser string")
        .bail()
        .notEmpty()
        .withMessage("sinopsis no puede estar vacía"),

    body("anio")
        .exists()
        .withMessage("anio requerido")
        .bail()
        .matches(/^\d{4}$/)
        .withMessage("anio inválido (use formato YYYY)"),

    body("poster")
        .exists()
        .withMessage("poster requerido")
        .bail()
        .isURL()
        .withMessage("poster debe ser una URL válida"),

    body("generos")
        .optional()
        .isArray()
        .withMessage("generos debe ser un array"),

    body("estado")
        .optional()
        .isIn(ESTADOS)
        .withMessage(`estado inválido (use: ${ESTADOS.join(" | ")})`),

    body("usuarioId")
        .exists()
        .withMessage("usuarioId requerido")
        .bail()
        .custom(val => ObjectId.isValid(val))
        .withMessage("usuarioId debe ser un ObjectId válido"),
];

// 4. Obtener contenido creado por usuario
export const getContenidoByIdUsuarioRules = [
    param("id")
        .trim()
        .custom(val => ObjectId.isValid(val))
        .withMessage("El parámetro :id debe ser un ObjectId válido"),
];

// 5. Actualizar estado (solo Admin)
export const actualizarEstadoContenidoRules = [
    param("id")
        .trim()
        .isMongoId()
        .withMessage("El parámetro :id debe ser un ObjectId válido"),

    body("estado")
        .exists()
        .withMessage("estado requerido")
        .bail()
        .isString()
        .withMessage("estado debe ser string")
        .bail()
        .customSanitizer(v => (typeof v === "string" ? v.trim().toLowerCase() : v))
        .isIn(ESTADOS)
        .withMessage(`estado inválido (use: ${ESTADOS.join(" | ")})`),
];

// 6. Eliminar contenido (solo Admin)
export const eliminarContenidoRules = [
    param("id")
        .trim()
        .isMongoId()
        .withMessage("El parámetro :id debe ser un ObjectId válido"),
];
