import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";
import passport from "../config/passport.js";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/register", register);
router.post("/login", login);

// Google OATH
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false}));
router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: `${process.env.FRONTEND_URL}/login`, session: false}),
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user.id, username: req.user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`)
  }
);

// Github OATH
router.get("/github", passport.authenticate("github", { scope: ["user:email"], session: false}));
router.get("/github/callback",
  passport.authenticate("github", { failureRedirect: `${process.env.FRONTEND_URL}/login`, session: false }),
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user.id, username: req.user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`)
  }
)


export default router;
