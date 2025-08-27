// Zona de importacion de modulos
import express from "express";
//import swaggerUi from "swagger-ui-express";
//import fs from "fs";
//import path from "path";
import { fileURLToPath } from "url";
import contenidoRoutes from "./routes/contenido.routes.js";
import reseniasRoutes from "./routes/resenia.routes.js";

//import userRoutes from "./routes/routers.js";
//import errorHandler from "./middlewares/errorHandler.js";
//import { limiter } from "./middlewares/limiter.js";
//import versionRouter from "./routes/versionRouter.js";

//const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);

// Cargar el JSON manualmente
//const swaggerDocumentJson = JSON.parse(
//    fs.readFileSync(path.join(__dirname, "swagger/swagger.json"), "utf-8")
//);

const app = express();

// Middlewares globales
app.use(express.json());
//app.use(limiter);

// Healthcheck
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
});

// Rutas de Contenido
app.use("/api/contenido", contenidoRoutes);

// Rutas de Reseñas
app.use("/api/resenias", reseniasRoutes);

// Rutas principales
//app.use("/api/user", userRoutes);

// Swagger Docs
//app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocumentJson));

// Version endpoint
//app.use("/version", versionRouter);

// 404 Handler
//app.use((req, res) => res.status(404).json({ message: "Not Found" }));

// Error handler
//app.use(errorHandler);

export default app;
