import express from "express";
import cors from "cors";
import helmet from "helmet";
import passport from "./config/passport.js";

import categoriesRoutes from "./routes/categories.routes.js";
import roscoRoutes from "./routes/rosco.routes.js";
import gamesRoutes from "./routes/games.routes.js";
import rankingRoutes from "./routes/ranking.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/users.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import questionRoutes from "./routes/questions.routes.js"

const app = express();
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(helmet());

// Middlewares
app.use(
    cors({
        origin: CORS_ORIGIN,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json({ limit: "1mb" }));
app.use(passport.initialize())

// Routes
app.get("/api/health", (_req, res) => {
    res.status(200).json({
        ok: true,
        service: "pasapalabra-backend",
        time: new Date().toISOString(),
    });
});
app.use("/api/categories", categoriesRoutes);
app.use("/api/rosco", roscoRoutes);
app.use("/api/games", gamesRoutes);
app.use("/api/ranking", rankingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes)
app.use("/api/admin", adminRoutes);
app.use("/api/questions", questionRoutes);

// 404
app.use((_req, res) => {
    res.status(404).json({ message: "Ruta no encontrada" });
});

// Error handler
app.use((err, _req, res, _next) => {
    console.error("❌ Error:", err);
    res.status(500).json({ message: "Error interno del servidor" });
});

export default app;
