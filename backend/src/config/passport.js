import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GithubStrategy } from "passport-github2";
import { prisma } from "../db/prisma.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
    },
    async ( accessToken, refreshToken, profile, done ) => {
      try {
        const email = profile.emails[0].value;
        const username = profile.displayName;

        // Buscamos si ya existe un usuario con ese email
        // Si no existe, lo creamos. Si existe, lo devolvemos tal cual
        let user = await prisma.user.findUnique({ 
          where: { email },
          select: { id: true, username: true, email: true, role: true }
        });
        if (!user) {
          user = await prisma.user.create({
            data: { username, email}
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null)
      }
    }
  )
)

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/github/callback`,
      scope: ["user:email"], // le pedimos permiso para ver el email
    },
    async ( accessToken, refreshToken, profile, done ) => {
      try {
        const email = profile.emails?.[0].value ?? `${profile.username}@github.local`; // fallback si no hay email
        const username = profile.username;

        // Buscamos si ya existe un usuario con ese email
        // Si no existe, lo creamos. Si existe, lo devolvemos tal cual
        let user = await prisma.user.findUnique({ 
          where: { email },
          select: { id: true, username: true, email: true, role: true }
        });
        if (!user) {
          user = await prisma.user.create({
            data: { username, email}
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null)
      }
    }
  )
)

export default passport;