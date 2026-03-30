import { Router } from "express";
import { startGame, finishGame } from "../controllers/games.controller.js";
import { optionalAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/start", optionalAuth, startGame);
router.post("/:gameId/finish", optionalAuth, finishGame);

export default router;
