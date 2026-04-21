import { prisma } from "../db/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


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

        return res.status(201).json({ user });

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

        const token = jwt.sign(
            {
                userId: user.id,
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
        );

        return res.status(200).json({ token });

    } catch (err) {
        next(err);
    }
};
