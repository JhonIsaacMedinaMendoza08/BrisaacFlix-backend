
// Zona de importacion de modulos
import { ObjectId } from "mongodb";
import { Contenido } from "../models/contenido.model.js"; 
import { getCollection } from "../config/db.js"; 
import { createdResponse, successResponse, errorResponse } from "../utils/responses.js";


// Reutilizamos la colección "contenido"
function col() {
    return getCollection("contenido");
}

// Listar todo el contenido (admin)  ->  GET /api/contenido
export async function listarContenido(_req, res, next) {
    try {
        const contenido = await col().find().sort({ createdAt: -1 }).toArray();
        return successResponse(res, contenido, { total: contenido.length });
    } catch (err) {
    return next(err);
    }
}

// Listar contenido con estado "aprobada" (público)  ->  GET /api/contenido/aprobada
export async function getContenidoAprobada(_req, res, next) {
    try {
        const contenido = await col().find({ estado: "aprobada" }).sort({ createdAt: -1 }).toArray();
        return successResponse(res, contenido, { total: contenido.length });
    } catch (err) {
        return next(err);
    }
}

// Listar contenido con estado "pendiente" (admin)  ->  GET /api/contenido/pendiente
export async function listarContenidoPendiente(_req, res, next) {
    try {
        const contenido = await col().find({ estado: "pendiente" }).sort({ createdAt: -1 }).toArray();
        return successResponse(res, contenido, { total: contenido.length });
    } catch (err) {
        return next(err);
    }
}

// Obtener Reseñas por ID ->  GET /api/contenido/:id
export async function getContenidoById(req, res, next) {
    try {
        const _id = new ObjectId(req.params.id);

        const doc = await col().findOne({ _id });
        if (!doc) {
            return errorResponse(res, "Contenido no encontrado", 404, "NOT_FOUND");
        }
    return successResponse(res, doc);
    } catch (err) {
        return next(err);
    }
}

// Crear contenido (usuario autenticado) ->  POST /api/:id/contenido
export async function crearContenido(req, res, next) {
    try {
        const contenido = new Contenido({
            tmdbId: req.body.tmdbId,
            titulo: req.body.titulo,
            sinopsis: req.body.sinopsis,
            anio: req.body.anio,
            poster: req.body.poster,
            generos: req.body.generos,
            estado: req.body.estado,
            usuarioId: req.body.usuarioId
        });
        // Verificacion de duplicidad de Titulo
        const existe = await col().findOne({ titulo: contenido.titulo });
        if (existe) {
            return errorResponse(res, "El titulo ya está registrado", 409, "TITULO_DUPLICADO");
        }
        contenido.validar();
        const { insertedId } = await col().insertOne(contenido.toDocument());
        return createdResponse(res, { id: insertedId });

    } catch (err) {
    return next(err);
    }
}

// Contenido por usuario (usuario autenticado) ->  GET /api/contenido/usuario/:id
export async function getContenidoByIdUsuario(req, res, next) {
    try {
        const usuarioId = new ObjectId(req.params.id);
        if (req.user.rol !== "admin" && !usuarioId.equals(req.user._id)) {
            return errorResponse(res, "No autorizado para ver este contenido", 403, "FORBIDDEN");
        }

        const docs = await col().find({ usuarioId }).toArray();
        return successResponse(res, docs);
    } catch (err) {
        return next(err);
    }
}

// Actualizar estado (admin)->  PATCH /api/contenido/:id/estado
export async function actualizarEstadoContenido(req, res, next) {
    try {
        if (req.user.rol !== "admin") {
            return errorResponse(res, "No autorizado", 403, "FORBIDDEN");
        }

        const _id = new ObjectId(req.params.id);
        const nuevoEstado = req.body.estado;

        if (!["aprobada", "rechazada"].includes(nuevoEstado)) {
            return errorResponse(res, "Estado inválido", 400, "INVALID_TRANSITION");
        }

        const { value: updated } = await col().findOneAndUpdate(
            { _id },
            { $set: { estado: nuevoEstado, updatedAt: new Date() } },
            { returnDocument: "after" }
        );

        if (!updated) {
            return errorResponse(res, "Contenido no encontrado", 404, "NOT_FOUND");
        }

        return successResponse(res, updated);
    } catch (err) {
        return next(err);
    }
}

// Eliminar contenido (admin)->  DELETE /api/contenido/:id
export async function eliminarContenido(req, res, next) {
    try {
        const _id = new ObjectId(req.params.id);
        const contenido = await col().findOne({ _id });

        if (!contenido) {
            return errorResponse(res, "Contenido no encontrado", 404, "NOT_FOUND");
        }

        if (req.user.rol !== "admin" && !contenido.usuarioId.equals(req.user._id)) {
            return errorResponse(res, "No tienes permiso para eliminar", 403, "FORBIDDEN");
        }

        await col().deleteOne({ _id });
        return successResponse(res, { deleted: true });
    } catch (err) {
        return next(err);
    }
}
