// Zona de importacion de modulos
import { Router } from "express"; // rutas de express
import { validate } from "../middlewares/validate.js"; // Validator-express
import { authMiddleware, authorizeRoles } from "../middlewares/auth.js";  // Paspotr para autenticacion de usuarios
import passport from "passport"; // Paa autenticacion de pioidaes de uso dendpoints
import { 
    listarPublicoRules,
    listarAdminRules,
    getContenidoByIdRules,
    crearContenidoRules,
    listarMisContenidosRules,
    actualizarEstadoContenidoRules,
    editarContenidoRules,
    eliminarContenidoRules,
} from "../validators/contenido.validators.js";
import { 
    listarPublico,
    listarAdmin,
    getContenidoById,
    crearContenido,
    listarMisContenidos,
    editarContenido,
    actualizarEstadoContenido,
    eliminarContenido,
} from "../controllers/contenido.controller.js";

// Inicializacion de rutas de express
const routes = Router();

// Rutas Publicas
routes.get("/", listarPublicoRules, validate, listarPublico); // Para obtener Todo el contenido
routes.get("/:id", getContenidoByIdRules, validate, getContenidoById); // Para obtener un Contenido por ID

// Rutas Rutas protegidas (requieren login)
routes.use(passport.authenticate("jwt", { session: false }), authMiddleware);

// Usuario autenticado
routes.post("/", crearContenidoRules, validate, crearContenido); // Post para crear Contenido 
routes.get("/mios/listado", listarMisContenidosRules, validate, listarMisContenidos); // GET Para obetern el contenido creado por el usuario
routes.patch("/:id", editarContenidoRules, validate, editarContenido); // PATCH para editar el contenido propio

// Admin
routes.get("/admin/listado", authorizeRoles("admin"), listarAdminRules, validate, listarAdmin); // GET todo el contenido
routes.patch("/:id/estado", authorizeRoles("admin"), actualizarEstadoContenidoRules, validate, actualizarEstadoContenido); // Para Actualizar estado de un Contenido
routes.delete("/:id", authorizeRoles("admin"), eliminarContenidoRules, validate, eliminarContenido); // Para Borrar Contenido


// Exportamos todas las rutas en routes
export default routes;