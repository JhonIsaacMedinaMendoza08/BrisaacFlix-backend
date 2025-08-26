import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/responses.js";

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return errorResponse(res, "Token requerido", 401, "NO_TOKEN");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecreto");
        req.user = decoded; // info del usuario en la request
        next();
    } catch (err) {
        return errorResponse(res, "Token inválido o expirado", 403, "INVALID_TOKEN");
    }
};
