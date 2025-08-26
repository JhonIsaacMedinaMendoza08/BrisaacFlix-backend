import { Router } from "express";
import { registerUser, listUsers } from "../controllers/usuario.controller.js";
import { registerUserValidator } from "../validators/usuario.validators.js";
import { validate } from "../middlewares/validate.js";

const router = Router();

router.post("/register", registerUserValidator, validate, registerUser);
router.get("/" , listUsers)


export default router;
