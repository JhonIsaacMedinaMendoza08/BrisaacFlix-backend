// Zona de importacion de modulos
import { ObjectId } from "mongodb"; // Modulo para crar ID de mongoDB
// Array de tipos
const ESTADO = new Set(['pendiente', 'leida']); 
// Creacion de Clase Reseña
export class Notificacion{
    // Contructor definicion de atribbutos
    constructor({
        reseniaId,
        usuarioId,
        mensaje,
        createdAt = new Date(),
        updatedAt = new Date(),
        estado
    })
    {
        this.reseniaId = new ObjectId(reseniaId);
        this.usuarioId = new ObjectId(usuarioId);
        this.mensaje = mensaje?.trim();
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.estado = ESTADO.has(estado) ? estado : "pendiente";
    }

    // Zona de creacion de metodos
    // Serializar a documento plano (para guardar en MongoDB)
    toDocument() {
    return {
        reseniaId: this.reseniaId,
        usuarioId: this.usuarioId,
        mensaje: this.mensaje,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        estado: this.estado
    };
    }
    // Reconstruir instancia desde documento plano de MongoDB
    static fromDocument(doc) {
        if (!doc) return null;
        return new Notificacion(doc);
    }
    // Validar datos de negocio y formato
    validar() {
        // reseniaId debe ser ObjectId
        if (!(this.reseniaId instanceof ObjectId)) {
            throw new Error("reseniaId inválido");
        }
         // usuarioId debe ser ObjectId
        if (!(this.usuarioId instanceof usuarioId)) {
            throw new Error("usuarioId inválido");
        }
        // mensaje requerida
        if (!this.mensaje || typeof this.mensaje !== "string") {
            throw new Error("mensaje requerida/ inválida");
        }
        // createdAt y updatedAt deben ser fechas válidas
        if (!(this.createdAt instanceof Date) || isNaN(+this.createdAt)) {
            throw new Error("createdAt inválida");
        }
        if (!(this.updatedAt instanceof Date) || isNaN(+this.updatedAt)) {
            throw new Error("updatedAt inválida");
        }
        // estado válido
        if (!ESTADO.has(this.estado)) {
            throw new Error("estado inválido (use: pendiente | leida )");
        }
    }
}


