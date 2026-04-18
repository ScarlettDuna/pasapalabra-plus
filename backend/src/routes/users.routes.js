import { Router } from "express";
import { createUser, getMe, getMyAchievements, getMyGames, getMyStats } from "../controllers/users.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", createUser);
router.get("/me", authMiddleware, getMe);
router.get("/me/games", authMiddleware, getMyGames)
router.get("/me/stats", authMiddleware, getMyStats)
router.get("/me/achievements", authMiddleware, getMyAchievements)

export default router;