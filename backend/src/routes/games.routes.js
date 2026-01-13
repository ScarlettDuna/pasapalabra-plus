import { Router } from "express";
import { startGame, finishGame } from "../controllers/games.controller.js";

const router = Router();

router.post("/start", startGame);
router.post("/:gameId/finish", finishGame);

export default router;
