import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/responses.js";

// Verifica que el token sea válido
export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return errorResponse(res, "Token requerido", 401, "NO_TOKEN");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecreto");
        req.user = decoded; // info del usuario dentro del request
        next();
    } catch (err) {
        return errorResponse(res, "Token inválido o expirado", 403, "INVALID_TOKEN");
    }
};

// Verifica que el usuario tenga rol permitido
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.rol)) {
            return errorResponse(res, "No tienes permisos para esta acción", 403, "FORBIDDEN");
        }
        next();
    };
};