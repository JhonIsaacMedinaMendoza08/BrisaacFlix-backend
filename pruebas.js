// src/validators/contenido.validators.js
import { body, param, query } from "express-validator";
import { ObjectId } from "mongodb";

const ESTADOS = ["pendiente", "aprobada", "rechazada"];
const SORTS = ["newest", "oldest", "topRated", "mostReviewed"];

// LISTA PÚBLICA: /api/contenido  (solo aprobados, con filtros)
export const listarPublicoRules = [
  query("q").optional().isString().trim().isLength({ min: 1 }).withMessage("q debe ser string"),
  query("generoId").optional().isInt({ min: 1 }).withMessage("generoId debe ser numérico"),
  query("anio").optional().matches(/^\d{4}$/).withMessage("anio debe ser formato YYYY"),
  query("sort").optional().isIn(SORTS).withMessage(`sort inválido (use: ${SORTS.join(" | ")})`),
  query("page").optional().isInt({ min: 1 }).toInt().withMessage("page debe ser entero >= 1"),
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt().withMessage("limit debe ser 1..100"),
];

// LISTA ADMIN: /api/contenido/admin
export const listarAdminRules = [
  query("estado").optional().isIn(ESTADOS).withMessage(`estado inválido (use: ${ESTADOS.join(" | ")})`),
  query("q").optional().isString().trim(),
  query("anio").optional().matches(/^\d{4}$/).withMessage("anio debe ser formato YYYY"),
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
];

// GET por ID (público, devuelve si está aprobada; admin/owner pueden ver cualquiera)
export const getContenidoByIdRules = [
  param("id").trim().isMongoId().withMessage("El parámetro :id debe ser un ObjectId válido"),
];

// CREAR (usuario logueado; usuarioId viene del token)
export const crearContenidoRules = [
  body("tmdbId").exists().withMessage("tmdbId requerido").bail().isInt({ min: 1 }).withMessage("tmdbId debe ser un número positivo"),
  body("titulo").exists().withMessage("titulo requerido").bail().isString().notEmpty(),
  body("sinopsis").exists().withMessage("sinopsis requerida").bail().isString().notEmpty(),
  body("anio").exists().withMessage("anio requerido").bail().matches(/^\d{4}$/).withMessage("anio inválido (YYYY)"),
  body("poster").exists().withMessage("poster requerido").bail().isURL().withMessage("poster debe ser URL válida"),
  body("generos").optional().isArray().withMessage("generos debe ser un array"),
  // estado se ignora al crear (si lo envían, lo descartamos en el controller)
];

// MIS CONTENIDOS (usuario logueado)
export const listarMisContenidosRules = [
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
];

// PATCH estado (admin)
export const actualizarEstadoContenidoRules = [
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

// PATCH edición (owner o admin)
export const editarContenidoRules = [
  param("id").trim().isMongoId().withMessage("El parámetro :id debe ser un ObjectId válido"),
  body("titulo").optional().isString().notEmpty(),
  body("sinopsis").optional().isString().notEmpty(),
  body("anio").optional().matches(/^\d{4}$/).withMessage("anio inválido (YYYY)"),
  body("poster").optional().isURL().withMessage("poster debe ser URL válida"),
  body("generos").optional().isArray(),
];

// DELETE (admin)
export const eliminarContenidoRules = [
  param("id").trim().isMongoId().withMessage("El parámetro :id debe ser un ObjectId válido"),
];
