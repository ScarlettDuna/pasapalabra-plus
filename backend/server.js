import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Config
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

// Middlewares
app.use(
    cors({
        origin: CORS_ORIGIN,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json({ limit: "1mb" }));

// Routes
app.get("/api/health", (_req, res) => {
    res.status(200).json({
        ok: true,
        service: "pasapalabra-backend",
        time: new Date().toISOString(),
    });
});

// 404
app.use((_req, res) => {
    res.status(404).json({ message: "Ruta no encontrada" });
});

// Error handler
app.use((err, _req, res, _next) => {
    console.error("❌ Error:", err);
    res.status(500).json({ message: "Error interno del servidor" });
});

// Start
app.listen(PORT, () => {
    console.log(`✅ API corriendo en http://localhost:${PORT}`);
    console.log(`✅ CORS permitido para: ${CORS_ORIGIN}`);
});
