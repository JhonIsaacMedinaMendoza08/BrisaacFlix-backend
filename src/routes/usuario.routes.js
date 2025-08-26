import { Router } from "express";
import { registerUser, listUsers, getUserById, updateUser, deleteUser } from "../controllers/usuario.controller.js";
import { registerUserValidator } from "../validators/usuario.validators.js";
import { validate } from "../middlewares/validate.js";

const router = Router();

router.post("/register", registerUserValidator, validate, registerUser);
router.get("/" , listUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);


export default router;
