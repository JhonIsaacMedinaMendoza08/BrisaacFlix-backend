import { Router } from "express";
import {
    registerUser,
    listUsers,
    getUserById,
    updateUser,
    deleteUser,
    loginUser
} from "../controllers/usuario.controller.js";

import { registerUserValidator } from "../validators/usuario.validators.js";
import { validate } from "../middlewares/validate.js";
import { authorizeRoles } from "../middlewares/auth.js";
import passport from "passport"; 

const router = Router();

// Rutas públicas
router.post("/register", registerUserValidator, validate, registerUser);
router.post("/login", loginUser);

// Rutas protegidas con Passport
// Listar usuarios (solo admin)
router.get(
    "/",
    passport.authenticate("jwt", { session: false }),
    authorizeRoles("admin"),
    listUsers
);

// Obtener usuario por ID (usuario autenticado)
router.get(
    "/:id",
    passport.authenticate("jwt", { session: false }),
    getUserById
);

// Actualizar usuario (usuario autenticado)
router.put(
    "/:id",
    passport.authenticate("jwt", { session: false }),
    updateUser
);

// Eliminar usuario (solo admin)
router.delete(
    "/:id",
    passport.authenticate("jwt", { session: false }),
    deleteUser
);

export default router;
