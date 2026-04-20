import { Router } from "express";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.middleware.js";
import { getPendingQuestions, approveQuestion, rejectQuestion } from "../controllers/admin.controller.js";

const router = Router();

router.get("/pending", authMiddleware, adminMiddleware, getPendingQuestions);
router.patch("/:id/approve", authMiddleware, adminMiddleware, approveQuestion);
router.patch("/:id/reject", authMiddleware, adminMiddleware, rejectQuestion);

export default router;