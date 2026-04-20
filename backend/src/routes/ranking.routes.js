import { Router } from "express";
import { getRanking } from "../controllers/ranking.controllers.js"

const router = Router()

// GET /api/ranking?language=ES$cathegory=1
router.get("/", getRanking);

export default router;