// Zona de importacion de modulos
import { ObjectId } from "mongodb";
import { Resenia } from "../models/resenia.model.js"; 
import { getCollection } from "../config/db.js"; 
import { createdResponse, successResponse, errorResponse } from "../utils/responses.js";
import { log } from "console";

// Reutilizamos la colección "Resenias"
function col() {
    return getCollection("resenias");
}

// Listar Reseñas (público) ->  GET /api/resenias
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

// Obtener Reseñas por ID ->  GET /api/resenias/:id
export async function getReseniaById(req, res, next) {
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

// Crear Reseña (usuario autenticado) ->  POST /api/resenias
export async function crearResenia(req, res, next) {
    try {
        const resenia = new Resenia({
            contenidoId: req.body.contenidoId,
            titulo: req.body.titulo,
            comentario: req.body.comentario,
            calificacion: req.body.calificacion,
            usuarioId: req.body.usuarioId
        });
        resenia.validar();
        const { insertedId } = await col().insertOne(resenia.toDocument());
        return createdResponse(res, { id: insertedId });
    } catch (err) {
    return next(err);
    }
}

// Obtener Reseñas por usuario ->  GET /api/resenias/usuario/:id
export async function getReseniasByIdUsuario(req, res, next) {
    try {
        const usuarioId = new ObjectId(req.params.id);
        const docs = await col().find({ usuarioId }).toArray();
        return successResponse(res, docs);
    } catch (err) {
        return next(err);
    }
}

// Eliminar Reseña ->  DELETE /api/resenias/:id
export async function eliminarResenia(req, res, next) {
    try {
        const _id = new ObjectId(req.params.id);
        const { deletedCount } = await col().deleteOne({ _id });
        if (deletedCount === 0) {
            return errorResponse(res, "Reseña no encontrada", 404, "NOT_FOUND");
        }
        return successResponse(res, { deleted: true });
    } catch (err) {
        return next(err);
    }
}

// PUT || PATCH /api/resenias/:id
export async function updateResenia(req, res, next) {
    try {
    const _id = new ObjectId(req.params.id);

    // Construir $set solo con lo que venga
    const set = { updatedAt: new Date() };
    if (typeof req.body.titulo === "string") set.titulo = req.body.titulo.trim();
    if (typeof req.body.comentario === "string") set.comentario = req.body.comentario.trim();
    
    const upd = await col().updateOne({ _id }, { $set: set });

    if (upd.matchedCount === 0) {
        return errorResponse(res, "Reseña no encontrada", 404, "NOT_FOUND");
    }

    const updated = await col().findOne({ _id });
    return successResponse(res, updated, { message: "Reseña actualizada correctamente" });
    } catch (err) {
    if (err?.code === 11000) {
        return errorResponse(
        res,
        "El nombre de Reseña ya existe",
        409,
        "DUPLICATE_KEY",
        { key: "nombre" }
        );
    }
    return next(err);
    }
}
