// Zona de importacion de modulos
import { Router } from "express"; // rutas de express
import { validate } from "../middlewares/validate.js"; // Validator-express
import { listarReseniasRules, getReseniaByIdRules, crearReseniaRules, getReseniasByIdUsuarioRules, updateReseniaByIdRules, eliminarReseniaRules} from "../validators/resenia.rules.js";
import { listarResenias, getReseniaById, crearResenia, getReseniasByIdUsuario, updateResenia, eliminarResenia} from "../controllers/resenia.controller.js";

// Inicializacion de rutas de express
const routes = Router();

// Rutas de Contenido

// Rutas Publicas
routes.get("/", listarReseniasRules, validate, listarResenias); // Para obtener todas las Reseñas
routes.get("/:id", getReseniaByIdRules, validate, getReseniaById); // Para obtener una Reseña por ID

// Rutas de Usuario (Iniciado Session)
routes.post("/", crearReseniaRules, validate, crearResenia); // POST para crear Reseña
routes.get("/usuario/:id", getReseniasByIdUsuarioRules, validate, getReseniasByIdUsuario); // GET Para obtener las Reseñas creadas por el usuario
routes.patch("/:id", updateReseniaByIdRules, validate, updateResenia) // PATCH para actualizar el contenido de una Reseña
routes.delete("/:id", eliminarReseniaRules, validate, eliminarResenia); // DELETE Borrar Contenido (Exclusivo Admistrador)

// Exportamos todas las rutas en routes
export default routes;