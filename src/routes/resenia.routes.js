// Zona de importacion de modulos
import { Router } from "express"; // rutas de express
import { validate } from "../middlewares/validate.js"; // Validator-express
import { authMiddleware, authorizeRoles } from "../middlewares/auth.js";  // Passport para validacion de usuarios
import passport from "passport"; // Paa autenticacion de pioidaes de uso dendpoints
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
    searchReseniasByTitulo,
} from "../controllers/resenia.controller.js";

// Inicializacion de rutas de express
const routes = Router();

// Rutas Publicas
routes.get("/", listarReseniasRules, validate, listarResenias); // Para obtener todas las Reseñas
routes.get("/:id", getReseniaByIdRules, validate, getReseniaById); // Para obtener una Reseña por ID
routes.get("/titulo/:titulo", searchReseniasByTitulo);// Para filtrar por titulo

// Middleware global de autenticación
routes.use(passport.authenticate("jwt", { session: false }), authMiddleware);

// Usuario autenticado
routes.post("/",crearReseniaRules, validate, crearResenia); // POST para crear Reseña
routes.get("/usuario/:id", getReseniasByIdUsuarioRules, validate, getReseniasByIdUsuario); // GET Para obtener las Reseñas creadas por el usuario
routes.patch("/:id", updateReseniaByIdRules, validate, updateResenia); // PATCH para actualizar el contenido de una Reseña
routes.delete( "/:id", authMiddleware, eliminarReseniaRules, validate, eliminarResenia); // Borrar reseña solo el mismo cerador o un admin.

// Interacciones
routes.post("/:id/votar", votarResenia);

// Exportamos todas las rutas en routes
export default routes;