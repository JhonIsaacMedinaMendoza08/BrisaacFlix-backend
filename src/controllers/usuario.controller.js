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
    } catch (error) {
        return errorResponse(res, error.message, 500, "LISTAR_USUARIOS_ERROR");
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validar que el id sea un ObjectId válido
        if (!ObjectId.isValid(id)) {
            return errorResponse(res, "ID inválido", 400, "INVALID_ID");
        }

        // Buscar usuario por ID
        const usuario = await col()
            .findOne({ _id: new ObjectId(id) }, { projection: { contrasena: 1, nombre: 1, email: 1, rol: 1, createdAt: 1 } });

        if (!usuario) {
            return errorResponse(res, "Usuario no encontrado", 404, "NOT_FOUND");
        }

        return successResponse(res, usuario, 200);
    } catch (error) {
        return errorResponse(res, error.message, 500, "GET_USER_ERROR");
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email, contrasena } = req.body;

        // Validar ID
        if (!ObjectId.isValid(id)) {
            return errorResponse(res, "ID inválido", 400, "INVALID_ID");
        }

        // Buscar si el usuario existe
        const usuario = await col().findOne({ _id: new ObjectId(id) });
        if (!usuario) {
            return errorResponse(res, "Usuario no encontrado", 404, "NOT_FOUND");
        }

        // Si se envía email, verificar duplicidad (excepto el mismo usuario)
        if (email && email !== usuario.email) {
            const emailExiste = await col().findOne({ email });
            if (emailExiste) {
                return errorResponse(res, "El correo ya está registrado por otro usuario", 409, "EMAIL_DUPLICADO");
            }
        }

        // Preparar datos a actualizar
        const updateFields = {};
        if (nombre) updateFields.nombre = nombre.trim();
        if (email) updateFields.email = email.trim().toLowerCase();
        if (contrasena) updateFields.contrasena = await bcrypt.hash(contrasena, 10);
        updateFields.updatedAt = new Date();

        // Ejecutar update
        const result = await col().updateOne(
            { _id: new ObjectId(id) },
            { $set: updateFields }
        );

        if (result.matchedCount === 0) {
            return errorResponse(res, "No se pudo actualizar el usuario", 500, "UPDATE_ERROR");
        }

        return successResponse(res, {
            id,
            ...updateFields
        }, 200);

    } catch (error) {
        return errorResponse(res, error.message, 500, "UPDATE_USER_ERROR");
    }
};