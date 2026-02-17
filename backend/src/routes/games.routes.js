import { Router } from "express";
import { startGame, finishGame } from "../controllers/games.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/start", authMiddleware, startGame);
router.post("/:gameId/finish", finishGame);

export default router;
