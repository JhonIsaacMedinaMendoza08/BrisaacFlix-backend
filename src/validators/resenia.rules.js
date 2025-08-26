import { body, param, query } from "express-validator";
import { ObjectId } from "mongodb";


// 1. Listar Reseñas → permite opcionalmente filtros como ?estado, ?anio
export const listarReseniasRules = [
];

// 2. Obtener Reseña por ID
export const getReseniaByIdRules = [
    param("id")
        .trim()
        .isMongoId()
        .withMessage("El parámetro :id debe ser un ObjectId válido"),
];

// 3. Crear Reseña (usuario autenticado)
export const crearReseniaRules = [
    body("contenidoId")
        .exists()
        .withMessage("contenidoId requerido")
        .bail()
        .custom(val => ObjectId.isValid(val))
        .withMessage("contenidoId debe ser un ObjectId válido"),

    body("titulo")
        .exists()
        .withMessage("titulo requerido")
        .bail()
        .isString()
        .withMessage("titulo debe ser string")
        .bail()
        .notEmpty()
        .withMessage("titulo no puede estar vacío"),

    body("comentario")
        .exists()
        .withMessage("comentario requerida")
        .bail()
        .isString()
        .withMessage("sinocomentariopsis debe ser string")
        .bail()
        .notEmpty()
        .withMessage("comentario no puede estar vacía"),

    body("calificacion")
        .exists()
        .withMessage("calificacion requerido")
        .bail()
        .isInt({ min: 0 })
        .withMessage("calificacion debe ser un número positivo"),
        
    body("contadorLike")
        .exists()
        .withMessage("contadorLike requerido")
        .bail()
        .isInt({ min: 0 })
        .withMessage("contadorLike debe ser un número positivo"),

    body("contadoDisLike")
        .exists()
        .withMessage("contadoDisLike requerido")
        .bail()
        .isInt({ min: 0 })
        .withMessage("contadoDisLike debe ser un número positivo"),

    body("usuarioId")
        .exists()
        .withMessage("usuarioId requerido")
        .bail()
        .custom(val => ObjectId.isValid(val))
        .withMessage("usuarioId debe ser un ObjectId válido"),
];

// 4. Obtener Reseña creado por usuario
export const getReseniaByIdUsuarioRules = [
    param("id")
        .trim()
        .custom(val => ObjectId.isValid(val))
        .withMessage("El parámetro :id debe ser un ObjectId válido"),
];

// 5. Actualizar contenido de Reseña
export const updateReseniaByIdRules = [
    param("id")
        .trim()
        .custom(val => ObjectId.isValid(val))
        .withMessage("El parámetro :id debe ser un ObjectId válido"),
        
    body("titulo")
        .exists()
        .withMessage("titulo requerido")
        .bail()
        .isString()
        .withMessage("titulo debe ser string")
        .bail()
        .notEmpty()
        .withMessage("titulo no puede estar vacío"),

    body("comentario")
        .exists()
        .withMessage("comentario requerida")
        .bail()
        .isString()
        .withMessage("sinocomentariopsis debe ser string")
        .bail()
        .notEmpty()
        .withMessage("comentario no puede estar vacía"),

    body("calificacion")
        .exists()
        .withMessage("calificacion requerido")
        .bail()
        .isInt({ min: 0 })
        .withMessage("calificacion debe ser un número positivo"),
];

// 6. Eliminar contenido (solo Admin)
export const eliminarRseniaRules = [
    param("id")
        .trim()
        .isMongoId()
        .withMessage("El parámetro :id debe ser un ObjectId válido"),
];
