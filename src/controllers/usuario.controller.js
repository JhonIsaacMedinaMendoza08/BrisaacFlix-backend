// src/controllers/contenido.controller.js
import { ObjectId } from "mongodb";
import { Usuario } from "../models/usuario.model.js";
import { getCollection } from "../config/db.js";
import { successResponse, errorResponse } from "../utils/responses.js";
import bcrypt from "bcrypt";


// Helpers para respuestas estándar

// Colección de usuarios
function col() {
    return getCollection("usuarios");
}

export const registerUser = async (req, res, next) => {
    try {
        const { nombre, email, contrasena } = req.body;

        // Verificar duplicidad
        const existe = await col().findOne({ email });
        if (existe) {
            return errorResponse(res, "El correo ya está registrado", 409, "EMAIL_DUPLICADO");
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(contrasena, 10);

        // Crear instancia de usuario
        const usuario = new Usuario({
            nombre,
            email,
            contrasena: hashedPassword,
        });

        usuario.validar(); // Validación del modelo

        // Insertar en BD
        const result = await col().insertOne(usuario.toDocument());

        return successResponse(res, {
            id: result.insertedId,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol
        }, 201);

    } catch (error) {
        return errorResponse(res, error.message, 500, "REGISTRO_ERROR");
    }
};

export const listUsers = async (req, res) => {
    try {
        const usuarios = await col()
            .find({})
            .project({ contrasena: 1, nombre: 1, email: 1, rol: 1, createdAt: 1 })
            .toArray();

        return successResponse(res, usuarios, 200);
    } catch (error){
        return errorResponse(res, error.message, 500, "LISTAR_USUARIOS_ERROR");
    }
};