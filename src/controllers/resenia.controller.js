// Zona de importacion de modulos
import { ObjectId } from "mongodb";
import { Resenia } from "../models/resenia.model.js"; 
import { Notificacion } from "../models/notificacion.model.js"; 
import { getCollection } from "../config/db.js"; 
import { createdResponse, successResponse, errorResponse } from "../utils/responses.js";

// Reutilizamos la colección "Resenias"
function col() { return getCollection("resenias"); }
function colNotificaciones() { return getCollection("notificaciones"); }

// Listar Reseñas (público) ->  GET /api/resenias
export async function listarResenias(req, res, next) {
  try {
    const filtro = {};
    if (req.query.contenidoId) filtro.contenidoId = new ObjectId(req.query.contenidoId);
    const docs = await col().find(filtro).toArray();
    return successResponse(res, docs);
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
            return errorResponse(res, "Reseña no encontrada", 404, "NOT_FOUND");
        }
        return successResponse(res, doc);
    } catch (err) {
        return next(err);
    }
}

// Crear Reseña (usuario autenticado) ->  POST /api/resenias
export async function crearResenia(req, res, next) {
    try {

        // Validaciones usuario Id logueado para carguarle la notificacion
        const usuarioId = req.user?.id; // desde token
        if (!usuarioId) return errorResponse(res, "No autenticado", 401, "NO_AUTH");

        // Creacion de Reseña
        const resenia = new Resenia({
            contenidoId: req.body.contenidoId,
            titulo: req.body.titulo,
            comentario: req.body.comentario,
            calificacion: req.body.calificacion,
            usuarioId: req.body.usuarioId // Autenticacion de usuario requerida
        });

        const notificacion = new Notificacion({
            reseniaId: req.body.reseniaId,
            usuarioId: req.body.usuarioId, // Autenticacion de usuario requerida
            mensaje: req.body.mensaje,
        });

        notificacion.validar();
        const { insertedIdNotificacion } = await colNotificaciones().insertOne(notificacion.toDocument());
        resenia.validar();
        const { insertedId } = await col().insertOne(resenia.toDocument());
        return createdResponse(res, { id: insertedId }, { id: insertedIdNotificacion });
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
    const reseña = await col().findOne({ _id });
    if (!reseña) {
      return errorResponse(res, "Reseña no encontrada", 404, "NOT_FOUND");
    }

    if (reseña.usuarioId.toString() !== req.user.id.toString() && req.user.rol !== "admin") {
      return errorResponse(res, "No autorizado para eliminar esta reseña", 403, "FORBIDDEN");
    }

    await col().deleteOne({ _id });
    return successResponse(res, { deleted: true });
  } catch (err) {
    return next(err);
  }
}

// Modificar Reseña -> PUT || PATCH /api/resenias/:id
export async function updateResenia(req, res, next) {
  try {
    const _id = new ObjectId(req.params.id);
    const reseña = await col().findOne({ _id });
    if (!reseña) {
      return errorResponse(res, "Reseña no encontrada", 404, "NOT_FOUND");
    }

    if (reseña.usuarioId.toString() !== req.user.id.toString()) {
      return errorResponse(res, "No autorizado para modificar esta reseña", 403, "FORBIDDEN");
    }

    const set = { updatedAt: new Date() };
    if (typeof req.body.titulo === "string") set.titulo = req.body.titulo.trim();
    if (typeof req.body.comentario === "string") set.comentario = req.body.comentario.trim();
    if (typeof req.body.calificacion === "number") set.calificacion = req.body.calificacion;

    await col().updateOne({ _id }, { $set: set });
    const updated = await col().findOne({ _id });

    return successResponse(res, updated, { message: "Reseña actualizada correctamente" });
  } catch (err) {
    return next(err);
  }
}

// Dar Like || Dislike reseña
export async function votarResenia(req, res, next) {
  try {
    const _id = new ObjectId(req.params.id);
    const { tipo } = req.body; // "like" o "dislike"

    if (!["like", "dislike"].includes(tipo)) {
      return errorResponse(res, "Tipo de voto inválido", 400, "INVALID_VOTE");
    }

    const reseña = await col().findOne({ _id });
    if (!reseña) return errorResponse(res, "Reseña no encontrada", 404, "NOT_FOUND");
    
    // Condicional para no poder dar like a reseñas creadas por el mismo usuario
    if (reseña.usuarioId.toString() === req.user.id.toString()) {
      return errorResponse(res, "No puedes votar en tu propia reseña", 403, "SELF_VOTE_NOT_ALLOWED");
    }

    const campo = tipo === "like" ? "likesUsuarios" : "dislikesUsuarios";
    const opuesto = tipo === "like" ? "dislikesUsuarios" : "likesUsuarios";

    // Evitar doble voto
    if (reseña[campo]?.includes(req.user.id)) {
      return errorResponse(res, `Ya diste ${tipo} a esta reseña`, 400, "ALREADY_VOTED");
    }

    await col().updateOne(
      { _id },
      {
        $addToSet: { [campo]: req.user.id },
        $pull: { [opuesto]: req.user.id },
        $set: { updatedAt: new Date() },
      }
    );

    const updated = await col().findOne({ _id });
    return successResponse(res, updated, { message: `Voto registrado (${tipo})` });
  } catch (err) {
    return next(err);
  }
}

// -> GET /api/v1/resenias/buscar?titulo=naruto
export async function searchReseniasByTitulo(req, res, next) {
  try {
    const titulo = req.params.titulo;
    if (!titulo) {
      return errorResponse(res, "El parámetro 'titulo' es requerido", 400, "VALIDATION_ERROR");
    }

    const resenias = await col().find({
      titulo: { $regex: titulo, $options: "i" } // búsqueda insensible a mayúsculas/minúsculas
    }).toArray();

    return successResponse(res, resenias, {
      message: `Reseñas encontradas para: ${titulo}`
    });
  } catch (err) {
    return next(err);
  }
}
