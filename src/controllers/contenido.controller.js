// Zona de importacion de modulos
import { ObjectId } from "mongodb";
import { Contenido } from "../models/contenido.model.js"; 
import { getCollection } from "../config/db.js"; 
import { createdResponse, successResponse, errorResponse } from "../utils/responses.js";

// Reutilizamos la colección "contenido"
function col() {
    return getCollection("contenido");
}

// Listar contenido (público)  ->  GET /api/contenido
export async function listarContenido(_req, res, next) {
    try {
        const tareas = await col().find().sort({ createdAt: -1 }).toArray();
        return successResponse(res, tareas, { total: tareas.length });
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

// Crear contenido (usuario autenticado) ->  POST /api/contenido
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
        contenido.validar();
        const { insertedId } = await col().insertOne(contenido.toDocument());
        return createdResponse(res, { id: insertedId });
    } catch (err) {
    return next(err);
    }
}

// Contenido por usuario ->  GET /api/contenido/usuario/:id
export async function getContenidoByIdUsuario(req, res, next) {
    try {
        const usuarioId = new ObjectId(req.params.id);
        const docs = await col().find({ usuarioId }).toArray();
        return successResponse(res, docs);
    } catch (err) {
        return next(err);
    }
}

// Actualizar estado (admin)->  PATCH /api/contenido/:id/estado
export async function actualizarEstadoContenido(req, res, next) {
    try {
        const _id = new ObjectId(req.params.id);
        const nuevoEstado = req.body.estado;
        console.log(nuevoEstado);        
        const contenido = await col().findOne({ _id });
        if (!contenido) {
            return errorResponse(res, "Contenido no encontrado", 404, "NOT_FOUND");
        }
        if (nuevoEstado !== "aprobada" && nuevoEstado !== "rechazada") {
            return errorResponse(res, `Transición inválida: Estado nuevo debe ser aprobada o rechazada`, 400,"INVALID_TRANSITION");
        }
        const { value: updated } = await col().findOneAndUpdate(
            { _id },
            { $set: { estado: nuevoEstado, updatedAt: new Date() } },
            { returnDocument: "after" }
        );
        return successResponse(res, updated);
    } catch (err) {
        return next(err);
    }
}

// Eliminar contenido (admin)->  DELETE /api/contenido/:id
export async function eliminarContenido(req, res, next) {
    try {
        const _id = new ObjectId(req.params.id);
        const { deletedCount } = await col().deleteOne({ _id });
        if (deletedCount === 0) {
            return errorResponse(res, "Contenido no encontrado", 404, "NOT_FOUND");
        }
        return successResponse(res, { deleted: true });
    } catch (err) {
        return next(err);
    }
}


