// Zona de importacion de modulos
import { ObjectId } from "mongodb"; // Modulo para crar ID de mongoDB

// Creacion de Clase Reseña
export class Resenia{
    // Contructor definicion de atribbutos
    constructor({ _id, contenidoId, titulo, comentario, calificacion, contadorLike = 0, contadorDisLike = 0, usuarioId, createdAt, updatedAt })
    {   
        // Atributos Base
        this._id = _id ? new ObjectId(_id) : undefined;
        this.contenidoId = contenidoId ? new ObjectId(contenidoId) : null;
        this.titulo = titulo?.trim();
        this.comentario = comentario?.trim();
        this.calificacion = calificacion;
        this.contadorLike = contadorLike;
        this.contadorDisLike = contadorDisLike;
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
        contenidoId: this.contenidoId,
        titulo: this.titulo,
        comentario: this.comentario,
        calificacion: this.calificacion,
        contadorLike: this.contadorLike,
        contadorDisLike: this.contadorDisLike,
        usuarioId: this.usuarioId,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        };
    }
    // 🔹 2. Reconstruir instancia desde documento plano de MongoDB
    static fromDocument(doc) {
        if (!doc) return null;
        return new Resenia(doc);
    }
    // 🔹 3. Validar datos de negocio y formato
    validar() {
        // contenidoId debe ser contenidoId
        if (!(this.contenidoId instanceof ObjectId)) {
            throw new Error("contenidoId inválido");
        }
        // titulo requerido
        if (!this.titulo || typeof this.titulo !== "string") {
            throw new Error("titulo requerido/ inválido");
        }
        // comentario requerida
        if (!this.comentario || typeof this.comentario !== "string") {
            throw new Error("comentario requerida/ inválida");
        }
        // calificacion requerida
        if (!this.calificacion || typeof this.calificacion !== "number" || this.calificacion <= 0 & this.calificacion >= 10) {
            throw new Error("calificacion requerido y debe ser numérico y un valor entre 0 y 10");
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


