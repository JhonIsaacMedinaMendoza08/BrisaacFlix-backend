// Zona de importacion de modulos
import { Router } from "express"; // rutas de express
import { validate } from "../middlewares/validate.js"; // Validator-express
import { listarContenidoRules, getContenidoByIdRules, crearContenidoRules, getContenidoByIdUsuarioRules, actualizarEstadoContenidoRules, eliminarContenidoRules} from "../validators/contenido.rules.js";
import { listarContenido, getContenidoById, crearContenido, getContenidoByIdUsuario, actualizarEstadoContenido, eliminarContenido} from "../controllers/contenido.controller.js";

// Inicializacion de rutas de express
const routes = Router();

// Rutas de Contenido

// Rutas Publicas

routes.get("/", listarContenidoRules, validate, listarContenido); // Para obtener Contenido
routes.get("/:id", getContenidoByIdRules, validate, getContenidoById); // Para obtener un Contenido por ID

// Rutas de Usuario (Iniciado Session)
routes.post("/", crearContenidoRules, validate, crearContenido); // Post para crear Contenido
routes.get("/usuario/:id", getContenidoByIdUsuarioRules, validate, getContenidoByIdUsuario); // GET Para obetern el contenido creado por el usuario

// Rutas de Administrador
routes.patch("/:id/estado", actualizarEstadoContenidoRules, validate, actualizarEstadoContenido);// Para Actualizar estado de un Contenido (Exclusivo Admistrador)
routes.delete("/:id", eliminarContenidoRules, validate, eliminarContenido); // Para Borrar Contenido (Exclusivo Admistrador)

// Por requerimientos debe ponerse pero en logica justificada un adminis deberia cambiar sue stado a rechazado y ai el contenido dejaria de estar disponible sin necesidad e borrarlo

// Exportamos todas las rutas en routes
export default routes;