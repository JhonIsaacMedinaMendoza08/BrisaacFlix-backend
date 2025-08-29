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
    listarPorTipoRules
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
    getContenidosByCategoria,
    searchContenidosByTitulo,
    listarPorPopularidad,
    listarPorTipo 
} from "../controllers/contenido.controller.js";

// Inicializacion de rutas de express
const routes = Router();

// Rutas Publicas
routes.get("/populares", listarPorPopularidad); // Listar contenido por popularidad
routes.get("/categoria/:categoria", getContenidosByCategoria); // Filtrar por categoria
routes.get("/titulo/:titulo", searchContenidosByTitulo); // Filtrar por titulo
routes.get("/tipo/:tipo", listarPorTipoRules, validate, listarPorTipo); // Listar por tipo (pelicula o serie)
routes.get("/", listarPublicoRules, validate, listarPublico); // Obtener todo el contenido
routes.get("/:id", getContenidoByIdRules, validate, getContenidoById); // Obtener por ID


// Rutas Rutas protegidas (requieren login)
routes.use(passport.authenticate("jwt", { session: false }), authMiddleware);

routes.get("/:id/listado", listarMisContenidosRules, validate, listarMisContenidos); // GET Para obetern el contenido creado por el usuario
routes.patch("/:id", editarContenidoRules, validate, editarContenido); // PATCH para editar el contenido propio
// Usuario autenticado
routes.post("/", crearContenidoRules, validate, crearContenido); // Post para crear Contenido 

// Admin
routes.patch("/:id/estado", authorizeRoles("admin"), actualizarEstadoContenidoRules, validate, actualizarEstadoContenido); // Para Actualizar estado de un Contenido
routes.get("/:id/admin/listado", authorizeRoles("admin"), listarAdminRules, validate, listarAdmin); // GET todo el contenido
routes.delete("/:id", authorizeRoles("admin"), eliminarContenidoRules, validate, eliminarContenido); // Para Borrar Contenido


// Exportamos todas las rutas en routes
export default routes;