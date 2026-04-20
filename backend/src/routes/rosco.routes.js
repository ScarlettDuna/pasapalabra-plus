import { Router } from "express";
import { getRosco } from "../controllers/rosco.controller.js";
import { optionalAuth } from "../middlewares/auth.middleware.js";

const router = Router();

// GET /api/rosco?language=ES&categoryId=1&difficulty=easy
router.get("/", optionalAuth, getRosco);

export default router;
