
// Zona de importacion de modulos
import { ObjectId } from "mongodb";
import { Contenido } from "../models/contenido.model.js"; 
import { getCollection } from "../config/db.js"; 
import { createdResponse, successResponse, errorResponse } from "../utils/responses.js";


// Acceso a colecciones para contenidos
function colContenido() { return getCollection("contenidos"); }
function colReseñas() { return getCollection("resenias"); }

// Funcion para paginacion correcta de datos
function parsePagination(req, defaultLimit = 10) {
  const page = Math.max(parseInt(req.query.page || "1", 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || String(defaultLimit), 10), 1), 100);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

// Solo contenido aprobado, con filtros y promedio de reseñas ->  GET /api/contenido
export async function listarPublico(req, res, next) {
  try {
    const { q, generoId, anio, sort = "newest" } = req.query;

    const match = { estado: "aprobado" };
    if (anio) match.anio = anio;
    if (generoId) match.generos = { $elemMatch: { id: parseInt(generoId, 10) } };
    if (q) {
      match.$text = { $search: q }; // requiere índice de texto (ver sugerencia en el modelo)
    }

    // base pipeline
    const pipeline = [
      { $match: match },
      // join con reseñas para promedio y conteo
      {
        $lookup: {
          from: "resenias",
          localField: "_id",
          foreignField: "contenidoId",
          as: "resenias",
        },
      },
      {
        $addFields: {
          ratingCount: { $size: "$resenias" },
          ratingAvg: {
            $cond: [
              { $gt: [{ $size: "$resenias" }, 0] },
              { $avg: "$resenias.calificacion" },
              null,
            ],
          },
        },
      },
      { $project: { resenias: 0 } },
    ];

    // Orden
    const sortStage = (() => {
      switch (sort) {
        case "oldest": return { createdAt: 1 };
        case "topRated": return { ratingAvg: -1, ratingCount: -1, createdAt: -1 };
        case "mostReviewed": return { ratingCount: -1, createdAt: -1 };
        case "newest":
        default: return { createdAt: -1 };
      }
    })();

    pipeline.push({ $sort: sortStage });

    // 🔹 IMPORTANTE: NO agregamos skip ni limit aquí

    const items = await colContenido().aggregate(pipeline).toArray();

    return successResponse(res, items);
  } catch (err) {
    return next(err);
  }
}

// Obtener todos los generos disponibles en DB de contenidos -> GET /api/contenido/generos
export async function listarGeneros(req, res, next) {
  try {
    const pipeline = [
      { $match: { estado: "aprobado" } }, // solo aprobados
      { $unwind: "$generos" }, // desarma el array generos
      {
        $group: {
          _id: "$generos.id",
          name: { $first: "$generos.name" },
        },
      },
      { $sort: { name: 1 } }, // opcional, orden alfabético
      {
        $project: {
          _id: 0,
          id: "$_id",
          name: 1,
        },
      },
    ];

    const generos = await colContenido().aggregate(pipeline).toArray();

    return successResponse(res, generos);
  } catch (err) {
    return next(err);
  }
}

// Lista con filtros, cualquier estado (público)  ->  GET /api/contenido/admin
export async function listarAdmin(req, res, next) {
  try {
    // ❌ no usamos paginación
    const { estado, q, anio } = req.query;

    const match = {};
    if (estado) match.estado = estado;
    if (anio) match.anio = anio;
    if (q) match.$text = { $search: q };

    const pipeline = [
      { $match: match },
      {
        $lookup: {
          from: "resenias",
          localField: "_id",
          foreignField: "contenidoId",
          as: "resenias",
        },
      },
      {
        $addFields: {
          ratingCount: { $size: "$resenias" },
          ratingAvg: {
            $cond: [
              { $gt: [{ $size: "$resenias" }, 0] },
              { $avg: "$resenias.calificacion" },
              null,
            ],
          },
        },
      },
      { $project: { resenias: 0 } },
      { $sort: { createdAt: -1 } },
    ];

    const items = await colContenido().aggregate(pipeline).toArray();

    return successResponse(res, items, { total: items.length });
  } catch (err) {
    return next(err);
  }
}

// Devuelve solo si está aprobada; si es admin u owner, devuelve cualquiera. ->  GET /api/contenido/:id
export async function getContenidoById(req, res, next) {
  try {
    const _id = new ObjectId(req.params.id);

    // buscamos y calculamos promedio
    const pipeline = [
      { $match: { _id } },
      {
        $lookup: {
          from: "resenias",
          localField: "_id",
          foreignField: "contenidoId",
          as: "resenias",
        },
      },
      {
        $addFields: {
          ratingCount: { $size: "$resenias" },
          ratingAvg: {
            $cond: [
              { $gt: [{ $size: "$resenias" }, 0] },
              { $avg: "$resenias.calificacion" },
              null,
            ],
          },
        },
      },
      { $project: { resenias: 0 } },
    ];

    const docs = await colContenido().aggregate(pipeline).toArray();
    const doc = docs[0];
    if (!doc) return errorResponse(res, "Contenido no encontrado", 404, "NOT_FOUND");

    // si no está aprobada, solo admin u owner la pueden ver
    if (doc.estado !== "aprobado") {
      const isAdmin = req.user?.rol === "admin";
      const isOwner = req.user && String(doc.usuarioId) === String(req.user.id);
      if (!isAdmin && !isOwner) {
        return errorResponse(res, "Contenido no disponible", 403, "FORBIDDEN");
      }
    }

    return successResponse(res, doc);
  } catch (err) {
    return next(err);
  }
}

// Crear contenido (usuario autenticado) ->  POST /api/contenido
export async function crearContenido(req, res, next) {
  try {
    const usuarioId = req.user?.id; // desde token
    if (!usuarioId) return errorResponse(res, "No autenticado", 401, "NO_AUTH");

    // Evitamos que el cliente fuerce usuarioId/estado
    const payload = {
      tmdbId: req.body.tmdbId,
      tipo: req.body.tipo,
      titulo: req.body.titulo,
      sinopsis: req.body.sinopsis,
      anio: req.body.anio,
      poster: req.body.poster,
      generos: req.body.generos,
      estado: "pendiente",
      usuarioId, // dueño
    };

    // chequear duplicado por tmdbId
    const dup = await colContenido().findOne({ tmdbId: payload.tmdbId });
    if (dup) {
      return errorResponse(res, "El tmdbId ya fue solicitado", 409, "TMDB_DUPLICADO");
    }

    const contenido = new Contenido(payload);
    contenido.validar();

    const { insertedId } = await colContenido().insertOne(contenido.toDocument());
    return createdResponse(res, { id: insertedId });
  } catch (err) {
    return next(err);
  }
}

// Contenido por usuario (usuario autenticado) ->  GET /api/contenido/mios
export async function listarMisContenidos(req, res, next) {
  try {
    const usuarioId = req.user?.id;
    if (!usuarioId) return errorResponse(res, "No autenticado", 401, "NO_AUTH");

    const { page, limit, skip } = parsePagination(req);

    const match = { usuarioId: new ObjectId(usuarioId) };

    const [items, total] = await Promise.all([
      colContenido().find(match).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      colContenido().countDocuments(match),
    ]);

    return successResponse(res, items, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    return next(err);
  }
}

// Modificar contenido (admin) ->  PATCH /api/contenido/:id
export async function editarContenido(req, res, next) {
  try {
    const _id = new ObjectId(req.params.id);
    const doc = await colContenido().findOne({ _id });
    if (!doc) return errorResponse(res, "Contenido no encontrado", 404, "NOT_FOUND");

    const isAdmin = req.user?.rol === "admin";
    const isOwner = req.user && String(doc.usuarioId) === String(req.user.id);
    if (!isAdmin && !isOwner) {
      return errorResponse(res, "No tienes permiso para editar este contenido", 403, "FORBIDDEN");
    }

    const set = { updatedAt: new Date() };
    if (typeof req.body.titulo === "string") set.titulo = req.body.titulo.trim();
    if (typeof req.body.sinopsis === "string") set.sinopsis = req.body.sinopsis.trim();
    if (typeof req.body.anio === "string") set.anio = req.body.anio;
    if (typeof req.body.poster === "string") set.poster = req.body.poster.trim();
    if (Array.isArray(req.body.generos)) set.generos = req.body.generos;

    // Si edita el owner (no admin) y el estado era aprobada/rechazada, vuelve a pendiente para nueva revisión.
    if (!isAdmin) set.estado = "pendiente";

    const { value: updated } = await colContenido().findOneAndUpdate(
      { _id },
      { $set: set },
      { returnDocument: "after" }
    );

    return successResponse(res, updated);
  } catch (err) {
    return next(err);
  }
}

// Actualizar estado (admin)->  PATCH /api/contenido/:id/estado
export async function actualizarEstadoContenido(req, res, next) {
  try {
    const _id = new ObjectId(req.params.id);
    const nuevoEstado = String(req.body.estado).toLowerCase();

    const contenido = await colContenido().findOne({ _id });
    if (!contenido) {
      return errorResponse(res, "Contenido no encontrado", 404, "NOT_FOUND");
    }

    if (nuevoEstado !== "aprobado" && nuevoEstado !== "rechazado" && nuevoEstado !== "pendiente") {
      return errorResponse(res, "Estado inválido", 400, "INVALID_STATE");
    }

    const { value: updated } = await colContenido().findOneAndUpdate(
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

    // Primero intentamos eliminar el contenido
    const { deletedCount } = await colContenido().deleteOne({ _id });
    if (deletedCount === 0) {
      return errorResponse(res, "Contenido no encontrado", 404, "NOT_FOUND");
    }

    // Luego, eliminar todas las reseñas asociadas a ese contenido
    const { deletedCount: reseñasEliminadas } = await colReseñas().deleteMany({
      contenidoId: _id,
    });

    return successResponse(res, {
      deleted: true,
      reseñasEliminadas,
      message: `Contenido y ${reseñasEliminadas} reseñas eliminadas correctamente`,
    });
  } catch (err) {
    return next(err);
  }
}

// filtrado por categoria -> GET /api/v1/contenidos/categoria/:categoria
export async function getContenidosByCategoria(req, res, next) {
  try {
    const categoria = req.params.categoria;

    const contenidos = await colContenido().find({
      "generos.name": categoria
    }).toArray();

    return successResponse(res, contenidos, {
      message: `Contenidos filtrados por categoría: ${categoria}`
    });
  } catch (err) {
    return next(err);
  }
}

// filtrado por titulo -> GET /api/v1/contenidos/buscar?titulo=naruto
export async function searchContenidosByTitulo(req, res, next) {
  try {
    const titulo = req.params.titulo;
    if (!titulo) {
      return errorResponse(res, "El parámetro 'titulo' es requerido", 400, "VALIDATION_ERROR");
    }

    const contenidos = await colContenido().find({
      titulo: { $regex: titulo, $options: "i" } // búsqueda insensible a mayúsculas/minúsculas
    }).toArray();

    return successResponse(res, contenidos, {
      message: `Resultados de búsqueda para: ${titulo}`
    });
  } catch (err) {
    return next(err);
  }
}

// Listado por popularidad -> GET /api/contenidos/populares
export async function listarPorPopularidad(req, res, next) {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const count = await colContenido().countDocuments({});
    console.log("Total contenidos en DB:", count);

    const data = await colContenido().aggregate([
      // 1. Filtrar solo aprobados
      {
        $match: { estado: "aprobado" }
      },
      // 2. Traer reseñas relacionadas
      {
        $lookup: {
          from: "resenias",
          localField: "_id",
          foreignField: "contenidoId",
          as: "resenias"
        }
      },
      // 3. Calcular promedio y cantidad de reseñas
      {
        $addFields: {
          ratingAvg: { $avg: "$resenias.calificacion" },
          ratingCount: { $size: "$resenias" }
        }
      },
      // 4. Calcular popularidad
      {
      $addFields: {
        popularidad: {
          $cond: [
            { $gt: ["$ratingCount", 0] },
            "$ratingAvg",
            0
          ]
        }
      }
      },
      // 5. Ordenar por popularidad descendente
      { $sort: { popularidad: -1 } },
      // 6. Paginación
      { $skip: skip },
      { $limit: parseInt(limit) },
      // 7. Proyección limpia
      {
        $project: {
          titulo: 1,
          poster: 1,
          anio: 1,
          generos: 1,
          estado: 1,
          ratingAvg: { $ifNull: ["$ratingAvg", 0] },
          ratingCount: 1,
          popularidad: 1
        }
      }
    ]).toArray();

    res.json({ ok: true, data });
  } catch (error) {
    console.error("❌ Error en listarPopulares:", error);
    res.status(500).json({
      ok: false,
      error: { code: "SERVER_ERROR", message: error.message }
    });
  }
};

// Listar por tipo (pelicula o serie) -> GET /api/contenido/tipo/:tipo
export async function listarPorTipo(req, res, next) {
  try {
    const { tipo } = req.params;
    const { page, limit, skip } = parsePagination(req);
    const { q, generoId, anio, sort = "newest" } = req.query;

    // Validar tipo
    if (!["pelicula", "serie"].includes(tipo)) {
      return errorResponse(res, "Tipo inválido (use: pelicula | serie)", 400, "INVALID_TYPE");
    }

    const match = { estado: "aprobado", tipo };
    if (anio) match.anio = anio;
    if (generoId) match.generos = { $elemMatch: { id: parseInt(generoId, 10) } };
    if (q) {
      match.$text = { $search: q }; // requiere índice de texto
    }

    const pipeline = [
      { $match: match },
      {
        $lookup: {
          from: "resenias",
          localField: "_id",
          foreignField: "contenidoId",
          as: "resenias",
        },
      },
      {
        $addFields: {
          ratingCount: { $size: "$resenias" },
          ratingAvg: {
            $cond: [
              { $gt: [{ $size: "$resenias" }, 0] },
              { $avg: "$resenias.calificacion" },
              null,
            ],
          },
        },
      },
      { $project: { resenias: 0 } },
    ];

    // Orden
    const sortStage = (() => {
      switch (sort) {
        case "oldest": return { createdAt: 1 };
        case "topRated": return { ratingAvg: -1, ratingCount: -1, createdAt: -1 };
        case "mostReviewed": return { ratingCount: -1, createdAt: -1 };
        case "newest":
        default: return { createdAt: -1 };
      }
    })();

    pipeline.push({ $sort: sortStage });
    pipeline.push({ $skip: skip }, { $limit: limit });

    const [items, total] = await Promise.all([
      colContenido().aggregate(pipeline).toArray(),
      colContenido().countDocuments(match),
    ]);

    return successResponse(res, items, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    return next(err);
  }
}

