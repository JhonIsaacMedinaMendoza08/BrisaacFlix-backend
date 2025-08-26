import { Router } from "express";
import { registerUser, listUsers, getUserById, updateUser, deleteUser, loginUser } from "../controllers/usuario.controller.js";
import { registerUserValidator } from "../validators/usuario.validators.js";
import { validate } from "../middlewares/validate.js";

const router = Router();

router.post("/register", registerUserValidator, validate, registerUser);
router.get("/" , listUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

router.post("/login", loginUser);

export default router;
