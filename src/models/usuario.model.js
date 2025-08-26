// Zona de importacion de modulos
import { ObjectId } from "mongodb"; // Modulo para crar ID de mongoDB


// Creacion de Clase Tarea
export class Usuario {
    // Contructor definicion de atribbutos
    constructor({ _id, nombre, email, contrasena, rol, createdAt, updatedAt }) {
        // Atributos Base
        this._id = _id ? new ObjectId(_id) : undefined;
        this.nombre = nombre?.trim();
        this.email = email?.trim().toLowerCase();
        this.contrasena = contrasena; // no se trimea ni modifica
        this.rol = rol?.trim().toLowerCase() || 'usuario'; // por defecto usuario
        // Control de creacion
        this.createdAt = createdAt ? new Date(createdAt) : new Date();
        this.updatedAt = updatedAt ? new Date(updatedAt) : new Date();
    }
    // Zona de creacion de metodos

    // 🔹 1. Serializar a documento plano (para guardar en MongoDB)
    toDocument() {
        return {
            ...(this._id && { _id: this._id }),
            nombre: this.nombre,
            email: this.email,
            contrasena: this.contrasena,
            rol: this.rol,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
    // 🔹 2. Reconstruir instancia desde documento plano de MongoDB
    static fromDocument(doc) {
        if (!doc) return null;
        return new Usuario(doc);
    }
    // 🔹 3. Validar datos de negocio y formato
    validar() {
        // nombre requerido
        if (!this.nombre || typeof this.nombre !== "string") {
            throw new Error("nombre requerido/ inválido");
        }
        // email requerido y formato básico
        if (!this.email || typeof this.email !== "string" || !this.email.includes("@")) {
            throw new Error("email requerido/ inválido");
        }
        // contrasena requerida y al menos 6 caracteres
        if (!this.contrasena || typeof this.contrasena !== "string" || this.contrasena.length < 8) {
            throw new Error("contrasena requerida y mínimo 8 caracteres");
        }
        // rol debe ser 'usuario' o 'admin'
        const ROLES = new Set(['usuario', 'admin']);
        if (!ROLES.has(this.rol)) {
            throw new Error("rol inválido");
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


