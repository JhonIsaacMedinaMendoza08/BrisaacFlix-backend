// Zona de importacion de modulos
import { ObjectId } from "mongodb"; // Modulo para crar ID de mongoDB

// Array de estados para validacion al crear
const ESTADOS = new Set(['pendiente', 'rechazada', 'aprobada']); // creamos coleccion de valores unicos para validacion de atributo estado

// Creacion de Clase Tarea
export class Tarea{
    // Contructor definicion de atribbutos
    constructor({ _id, tmdbId, titulo, sinopsis, anio, poster, generos = [], estado = 'pendiente', createdAt, updatedAt, usuarioId})
    {   
        // Atributos Base
        this._id = _id ? new ObjectId(_id) : undefined;
        this.tmdbId = tmdbId; // obligatorio, referencia externa
        this.titulo = titulo?.trim();
        this.sinopsis = sinopsis?.trim();
        this.anio = anio; // año como string YYYY
        this.poster = poster?.trim();   // URL completa a poster
        this.generos = Array.isArray(generos) ? generos : [];
        // Control de negocio
        this.estado = ESTADOS.has(estado) ? estado : "pendiente";
        // Control de creacion
        this.usuarioId = usuarioId ? new ObjectId(usuarioId) : null;
        this.createdAt = createdAt ? new Date(createdAt) : new Date();
        this.updatedAt = updatedAt ? new Date(updatedAt) : new Date();
    }
    // Zona de creacion de metodos

    // 🔹 1. Serializar a documento plano (para guardar en MongoDB)
    toDocument() {
    return {
        ...(this._id && { _id: this._id }),
        tmdbId: this.tmdbId,
        titulo: this.titulo,
        sinopsis: this.sinopsis,
        anio: this.anio,
        poster: this.poster,
        generos: this.generos,
        estado: this.estado,
        usuarioId: this.usuarioId,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        };
    }
    // 🔹 2. Reconstruir instancia desde documento plano de MongoDB
    static fromDocument(doc) {
        if (!doc) return null;
        return new Contenido(doc);
    }
    // 🔹 3. Validar datos de negocio y formato
    validar() {
        // tmdbId requerido y debe ser número
        if (!this.tmdbId || typeof this.tmdbId !== "number") {
        throw new Error("tmdbId requerido y debe ser numérico");
        }
        // titulo requerido
        if (!this.titulo || typeof this.titulo !== "string") {
        throw new Error("titulo requerido/ inválido");
        }
        // sinopsis requerida
        if (!this.sinopsis || typeof this.sinopsis !== "string") {
        throw new Error("sinopsis requerida/ inválida");
        }
        // anio debe ser string YYYY válido
        if (!/^\d{4}$/.test(this.anio)) {
        throw new Error("anio inválido (use formato YYYY)");
        }
        // poster requerido (url mínima)
        if (!this.poster || typeof this.poster !== "string") {
        throw new Error("poster requerido/ inválido");
        }
        // generos debe ser array de strings u objetos {id, name}
        if (!Array.isArray(this.generos)) {
        throw new Error("generos debe ser un array");
        }
        // estado válido
        if (!ESTADOS.has(this.estado)) {
        throw new Error("estado inválido (use: pendiente | aprobado | rechazado)");
        }
        // usuarioId debe ser ObjectId
        if (!(this.usuarioId instanceof ObjectId)) {
        throw new Error("usuarioId inválido");
        }
        // createdAt y updatedAt deben ser fechas válidas
        if (!(this.createdAt instanceof Date) || isNaN(+this.createdAt)) {
        throw new Error("createdAt inválida");
        }
        if (!(this.updatedAt instanceof Date) || isNaN(+this.updatedAt)) {
        throw new Error("updatedAt inválida");
        }
    }
}


