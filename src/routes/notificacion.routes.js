// Zona de importacion de modulos
import { Router } from "express"; // rutas de express
import { validate } from "../middlewares/validate.js"; // Validator-express
import { authMiddleware, authorizeRoles } from "../middlewares/auth.js";  // Pasport para autenticacion de usuarios
import passport from "passport"; // Para autenticacion de prioridades de uso dendpoints
import { 
    listarPublicoTodasRules,
    crearNotificacionRules,
    actualizarEstadoNotificacionRules
} from "../validators/notificacion.validators.js";
import { 
    listarNotificaciones,
    crearNotificacion,
    actualizarEstadoNotificacion
} from "../controllers/notificacion.controller.js";

// Inicializacion de rutas de express
const routes = Router();

// Rutas
routes.get("/", listarPublicoTodasRules, validate, listarNotificaciones); // Obtener todas las notificiones

routes.use(passport.authenticate("jwt", { session: false }), authMiddleware);

routes.post("/", crearNotificacionRules, validate, crearNotificacion); // Post para crear notificacion 

routes.patch("/:id/estado", authorizeRoles("admin"), actualizarEstadoNotificacionRules, validate, actualizarEstadoNotificacion); // Para Actualizar estado de una notificacion


// Exportamos todas las rutas en routes
export default routes;