import dotenv from "dotenv";
import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

(async () => {
    try {
        await connectDB(process.env.MONGODB_URI, process.env.DB_NAME);
        app.listen(PORT, () =>
            console.log(`🚀 API lista en http://localhost:${PORT}`)
        );
    } catch (err) {
        console.error("No se pudo iniciar el servidor:", err);
        process.exit(1);
    }
})();
