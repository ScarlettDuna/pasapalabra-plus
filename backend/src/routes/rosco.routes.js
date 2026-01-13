import { Router } from "express";
import { getRosco } from "../controllers/rosco.controller.js";

const router = Router();

// GET /api/rosco?language=ES&categoryId=1&difficulty=easy
router.get("/", getRosco);

export default router;
