import { prisma } from "../db/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export async function generateTokenPair(user) {
    const token = jwt.sign(
        { userId: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    const refreshToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 días

    await prisma.refreshToken.create({
        data: { token: refreshToken, userId: user.id, expiresAt }
    })

    return { token, refreshToken };
}

export const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "username, email y password son obligatorios" });
        }

        const uname = String(username).trim();
        const mail = String(email).trim().toLowerCase();

        if (password.length < 6) {
            return res.status(400).json({ message: "password debe tener al menos 6 caracteres" });
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                username: uname,
                email: mail,
                passwordHash: hashed
            },
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true
            }
        });

        return res.status(201).json(user);

    } catch (err) {
        if (err.code === "P2002") {
            return res.status(409).json({ message: "username o email ya en uso" });
        }
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "email y password son obligatorios" });
        }

        const mail = String(email).trim().toLowerCase();

        const user = await prisma.user.findUnique({
            where: { email: mail }
        });

        if (!user) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);

        if (!isValid) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        const tokens = await generateTokenPair(user);

        return res.status(200).json(tokens);

    } catch (err) {
        next(err);
    }
};


export const refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: "refreshToken obligatorio" });
        }

        const stored = await prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { user: { select: { id: true, username: true, role: true } } }
        });

        if (!stored || stored.expiresAt < new Date()) {
            return res.status(401).json({ message: "Refresh token inválido o expirado" });
        }

        const token = jwt.sign(
            { userId: stored.user.id, username: stored.user.username, role: stored.user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
        );

        return res.status(200).json({ token });
    } catch (err) {
        next(err);
    }
};

export const logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: "refreshToken obligatorio" });
        }

        // deleteMany en lugar de delete: no falla si el token ya no existe
        await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });

        return res.status(200).json({ message: "Sesión cerrada" });
    } catch (err) {
        next(err);
    }
};