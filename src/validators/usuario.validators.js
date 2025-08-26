import { body } from "express-validator";

export const registerUserValidator = [
    body("nombre")
        .isString().withMessage("El nombre debe ser texto")
        .isLength({ min: 2 }).withMessage("El nombre debe tener al menos 2 caracteres"),
    body("email")
        .isEmail().withMessage("Debe ser un correo válido"),
    body("contrasena")
        .isLength({ min: 8 }).withMessage("La contraseña debe tener mínimo 8 caracteres"),
];

