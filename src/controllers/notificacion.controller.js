
// Zona de importacion de modulos
import { ObjectId } from "mongodb";
import { Notificacion } from "../models/notificacion.model.js"; 
import { getCollection } from "../config/db.js"; 
import { createdResponse, successResponse, errorResponse } from "../utils/responses.js";


// Acceso a colecciones para notificaciones
function colNotificaciones() { return getCollection("notificaciones"); }


// Listar notificaciones (público) ->  GET /api/notificaciones
export async function listarNotificaciones(req, res, next) {
    try {
        const filtro = {};
        if (req.query.notificacionId) filtro.notificacionId = new ObjectId(req.query.notificacionId);
            const docs = await colNotificaciones().find(filtro).toArray();
            return successResponse(res, docs);
        } catch (err) {
        return next(err);
    }
}

// Crear Notificacion (usuario autenticado) ->  POST /api/notificacion
export async function crearNotificacion(req, res, next) {
    try {
        // Validaciones usuario Id logueado para carguarle la notificacion
        const usuarioId = req.user?.id; // desde token
        if (!usuarioId) return errorResponse(res, "No autenticado", 401, "NO_AUTH");

        const notificacion = new Notificacion({
            reseniaId: req.body.reseniaId,
            usuarioId: req.body.usuarioId, // Autenticacion de usuario requerida
            mensaje: req.body.mensaje,
        });

        notificacion.validar();
        const { insertedId } = await colNotificaciones().insertOne(notificacion.toDocument());
        return createdResponse(res, { id: insertedId });
    } catch (err) {
        return next(err);
    }
}

// Actualizar estado ->  PATCH /api/notificacion/:id/estado
export async function actualizarEstadoNotificacion(req, res, next) {
  try {
    const _id = new ObjectId(req.params.id);
    const nuevoEstado = String(req.body.estado).toLowerCase();

    const contenido = await colNotificaciones().findOne({ _id });
    if (!contenido) {
      return errorResponse(res, "Contenido no encontrado", 404, "NOT_FOUND");
    }

    if (nuevoEstado !== "aprobado" && nuevoEstado !== "leida") {
      return errorResponse(res, "Estado inválido", 400, "INVALID_STATE");
    }

    const { value: updated } = await colNotificaciones().findOneAndUpdate(
      { _id },
      { $set: { estado: nuevoEstado, updatedAt: new Date() } },
      { returnDocument: "after" }
    );

    return successResponse(res, updated);
  } catch (err) {
    return next(err);
  }
}


