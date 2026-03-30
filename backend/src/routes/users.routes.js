import { Router } from "express";
import { createUser, getMe, getMyGames } from "../controllers/users.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", createUser);
router.get("/me", authMiddleware, getMe);
router.get("/me/games", authMiddleware, getMyGames)

export default router;