import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createQuestion } from "../controllers/questions.controller.js";

const router = Router();

router.post("/", authMiddleware, createQuestion);

export default router;