import { Router } from "express";
import { register, login, refresh, logout, generateTokenPair } from "../controllers/auth.controller.js";
import passport from "../config/passport.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

// Google OATH
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false}));
router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: `${process.env.FRONTEND_URL}/login`, session: false}),
  async (req, res) => {
    const { token, refreshToken } = await generateTokenPair(req.user);
      res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}&refreshToken=${refreshToken}`);
  }
);

// Github OATH
router.get("/github", passport.authenticate("github", { scope: ["user:email"], session: false}));
router.get("/github/callback",
  passport.authenticate("github", { failureRedirect: `${process.env.FRONTEND_URL}/login`, session: false }),
  async (req, res) => {
    const { token, refreshToken } = await generateTokenPair(req.user);
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}&refreshToken=${refreshToken}`);
  }
)


export default router;
