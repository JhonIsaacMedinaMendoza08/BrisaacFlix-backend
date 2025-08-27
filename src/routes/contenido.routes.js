// Zona de importacion de modulos
import { Router } from "express"; // rutas de express
import { validate } from "../middlewares/validate.js"; // Validator-express
import passport from "passport"; // Paa autenticacion de pioidaes de uso dendpoints
import { 
    listarContenidoRules, 
    listarContenidoAceptadaRules, 
    listarContenidoPendienteRules, 
    getContenidoByIdRules, 
    crearContenidoRules, 
    getContenidoByIdUsuarioRules, 
    actualizarEstadoContenidoRules, 
    eliminarContenidoRules
} from "../validators/contenido.validators.js";
import { 
    listarContenido, 
    getContenidoAprobada, 
    listarContenidoPendiente, 
    getContenidoById, 
    crearContenido, 
    getContenidoByIdUsuario, 
    actualizarEstadoContenido, 
    eliminarContenido
} from "../controllers/contenido.controller.js";

// Inicializacion de rutas de express
const routes = Router();

// Rutas Publicas
routes.get("/", listarContenidoRules, validate, listarContenido); // Para obtener Todo el contenido
routes.get("/aprobada", listarContenidoAceptadaRules, validate, getContenidoAprobada); // Obtener contenido con estado aprobada
routes.get("/:id", getContenidoByIdRules, validate, getContenidoById); // Para obtener un Contenido por ID

// Rutas Rutas protegidas (requieren login)
routes.use(passport.authenticate("jwt", { session: false }));

// Usuario autenticado
routes.post("/", crearContenidoRules, validate, crearContenido); // Post para crear Contenido 
routes.get("/usuario/:id", getContenidoByIdUsuarioRules, validate, getContenidoByIdUsuario); // GET Para obetern el contenido creado por el usuario

// Admin
routes.patch("/:id/estado", actualizarEstadoContenidoRules, validate, actualizarEstadoContenido); // Para Actualizar estado de un Contenido (Exclusivo Admistrador)
routes.delete("/:id", eliminarContenidoRules, validate, eliminarContenido); // Para Borrar Contenido (Exclusivo Admistrador)
routes.get("/pendiente/all", listarContenidoPendienteRules, validate, listarContenidoPendiente);// Para Borrar Contenido (Exclusivo Admistrador)


// Exportamos todas las rutas en routes
export default routes;