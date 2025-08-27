// Zona de importacion de modulos
import { Router } from "express"; // rutas de express
import { validate } from "../middlewares/validate.js"; // Validator-express
import { auth, isAdmin } from "../middlewares/auth.js"; // Passport para validacion de usuarios
import { 
    listarReseniasRules, 
    getReseniaByIdRules, 
    crearReseniaRules, 
    getReseniasByIdUsuarioRules, 
    updateReseniaByIdRules, 
    eliminarReseniaRules
} from "../validators/resenia.validators.js";
import { 
    listarResenias, 
    getReseniaById, 
    crearResenia, 
    getReseniasByIdUsuario, 
    updateResenia, 
    eliminarResenia,
    votarResenia,
} from "../controllers/resenia.controller.js";

// Inicializacion de rutas de express
const routes = Router();


// Rutas Publicas
routes.get("/", listarReseniasRules, validate, listarResenias); // Para obtener todas las Reseñas
routes.get("/:id", getReseniaByIdRules, validate, getReseniaById); // Para obtener una Reseña por ID

// Usuario autenticado
routes.post("/", auth, crearReseniaRules, validate, crearResenia); // POST para crear Reseña
routes.get("/usuario/:id", auth, getReseniasByIdUsuarioRules, validate, getReseniasByIdUsuario); // GET Para obtener las Reseñas creadas por el usuario
routes.patch("/:id", auth, updateReseniaByIdRules, validate, updateResenia); // PATCH para actualizar el contenido de una Reseña
routes.delete("/:id", auth, eliminarReseniaRules, validate, eliminarResenia); // DELETE Borrar Contenido (Exclusivo Admistrador)

// Interacciones
routes.post("/:id/votar", auth, votarResenia);

// Exportamos todas las rutas en routes
export default routes;