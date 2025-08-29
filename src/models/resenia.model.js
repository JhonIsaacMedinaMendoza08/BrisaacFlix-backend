// Zona de importacion de modulos
import { ObjectId } from "mongodb"; // Modulo para crar ID de mongoDB
// Array de tipos
const TIPOS = new Set(['pelicula', 'serie']); 
// Creacion de Clase Reseña
export class Resenia{
    // Contructor definicion de atribbutos
    constructor({
        contenidoId,
        titulo,
        comentario,
        calificacion,
        usuarioId,
        createdAt = new Date(),
        updatedAt = new Date(),
        likesUsuarios = [],
        dislikesUsuarios = []
    })
    {
        this.contenidoId = new ObjectId(contenidoId);
        this.titulo = titulo?.trim();
        this.comentario = comentario?.trim();
        this.calificacion = calificacion;
        this.usuarioId = new ObjectId(usuarioId);
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.likesUsuarios = likesUsuarios;   // array de ObjectId
        this.dislikesUsuarios = dislikesUsuarios; // array de ObjectId
    }

    // Zona de creacion de metodos
    // Serializar a documento plano (para guardar en MongoDB)
    toDocument() {
    return {
        contenidoId: this.contenidoId,
        titulo: this.titulo,
        comentario: this.comentario,
        calificacion: this.calificacion,
        tipo: this.tipo,
        usuarioId: this.usuarioId,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        likesUsuarios: this.likesUsuarios,
        dislikesUsuarios: this.dislikesUsuarios
    };
    }
    // Reconstruir instancia desde documento plano de MongoDB
    static fromDocument(doc) {
        if (!doc) return null;
        return new Resenia(doc);
    }
    // Validar datos de negocio y formato
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
        if (!this.calificacion || typeof this.calificacion !== "number" || this.calificacion < 0 || this.calificacion > 10) {
            throw new Error("calificacion requerida y debe ser numérica entre 0 y 10");
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


