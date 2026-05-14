import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createQuestion, getMyQuestions } from "../controllers/questions.controller.js";

const router = Router();

router.get("/mine", authMiddleware, getMyQuestions)
router.post("/", authMiddleware, createQuestion);

export default router;