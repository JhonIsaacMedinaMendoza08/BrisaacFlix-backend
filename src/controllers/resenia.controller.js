// src/controllers/contenido.controller.js
import { ObjectId } from "mongodb";
import { Tarea } from "../models/contenido.model.js"; 
import { getCollection } from "../config/db.js"; 
import { successResponse, errorResponse } from "../utils/responses.js";

// Reutilizamos la colección "Resenias"
function col() {
    return getCollection("resenias");
}

// Listar reseñas (público)
export async function listarResenias(req, res, next) {
    try {
        const filtro = {};
        if (req.query.estado) filtro.estado = req.query.estado;
        if (req.query.anio) filtro.anio = req.query.anio;

        const contenido = await col().find(filtro).toArray();
        return successResponse(res, contenido);
    } catch (err) {
        return next(err);
    }
}

// Obtener contenido por ID
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

// Crear contenido (usuario autenticado)
export async function crearContenido(req, res, next) {
    try {
        const tarea = new Tarea(req.body);
        tarea.validar();

        const { insertedId } = await col().insertOne(tarea.toDocument());
        const creado = await col().findOne({ _id: insertedId });

        return successResponse(res, creado, 201);
    } catch (err) {
    return next(err);
    }
}

// Contenido por usuario
export async function getContenidoByIdUsuario(req, res, next) {
    try {
        const usuarioId = new ObjectId(req.params.id);
        const docs = await col().find({ usuarioId }).toArray();
        return successResponse(res, docs);
    } catch (err) {
        return next(err);
    }
}

// Actualizar estado (admin)
export async function actualizarEstadoContenido(req, res, next) {
    try {
        const _id = new ObjectId(req.params.id);
        const nuevoEstado = req.body.estado;
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

// Eliminar contenido (admin)
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
