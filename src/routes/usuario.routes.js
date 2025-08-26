import { Router } from "express";
import { registerUser, listUsers, getUserById, updateUser, deleteUser, loginUser } from "../controllers/usuario.controller.js";
import { registerUserValidator } from "../validators/usuario.validators.js";
import { validate } from "../middlewares/validate.js";
import { authMiddleware, authorizeRoles } from "../middlewares/auth.js";


const router = Router();

// Rutas públicas
// Registrar Usuario
router.post("/register", registerUserValidator, validate, registerUser);
// Login Usuario
router.post("/login", loginUser);

// Rutas protegidas
// Listar Usuarios (solo admin)
router.get("/", authMiddleware, authorizeRoles("admin"), listUsers);
// Obtener usuario por ID (usuario autenticado)
router.get("/:id", authMiddleware, getUserById); 
// Actualizar usuario (usuario autenticado)
router.put("/:id", authMiddleware, updateUser);
// Eliminar usuario (solo admin)
router.delete("/:id", authMiddleware, authorizeRoles("admin"), deleteUser);

export default router;
