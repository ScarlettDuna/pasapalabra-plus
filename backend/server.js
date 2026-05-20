import app from "./src/app.js"
import { initCronJobs } from "./src/utils/timeout.js";

// Inicia el cron que se encarga de limpiar partidas abandonadas
initCronJobs();

// Config
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

// Start
app.listen(PORT, () => {
    console.log(`✅ API corriendo en http://localhost:${PORT}`);
    console.log(`✅ CORS permitido para: ${CORS_ORIGIN}`);
});