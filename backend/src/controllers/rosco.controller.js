import { prisma } from "../db/prisma.js";
import crypto from "crypto";

export const getRosco = async (req, res, next) => {
    try {
        const { language, categoryId, difficulty } = req.query;

        if (!language || !categoryId || !difficulty) {
            return res.status(400).json({
                message: "Params obligatorios: language, categoryId, difficulty",
            });
        }

        const lang = String(language).toUpperCase();
        const allowedLang = new Set(["ES", "EN", "FR"]);
        if (!allowedLang.has(lang)) {
            return res.status(400).json({ message: "language debe ser ES, EN o FR" });
        }

        const diff = String(difficulty).toLowerCase();
        const allowedDiff = new Set(["easy", "medium", "hard"]);
        if (!allowedDiff.has(diff)) {
            return res.status(400).json({ message: "difficulty debe ser easy, medium o hard" });
        }

        const catId = Number(categoryId);
        if (!Number.isInteger(catId) || catId <= 0) {
            return res.status(400).json({ message: "categoryId debe ser un entero positivo" });
        }

        // Trae preguntas filtradas
        const all = await prisma.question.findMany({
            where: { language: lang, difficulty: diff, categoryId: catId },
            select: { id: true, letter: true, question: true },
        });

        // Agrupa por letra
        const byLetter = new Map();
        for (const q of all) {
            const letter = String(q.letter).toUpperCase();
            if (!byLetter.has(letter)) byLetter.set(letter, []);
            byLetter.get(letter).push(q);
        }

        // Letras del rosco ES (A-Z)
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

        // Elige 1 pregunta por letra (si existe)
        const questions = letters
            .map((L) => {
                const candidates = byLetter.get(L);
                if (!candidates || candidates.length === 0) return null;
                const pick = candidates[Math.floor(Math.random() * candidates.length)];
                return { letter: L, questionId: pick.id, question: pick.question };
            })
            .filter(Boolean);

        // De momento devolvemos un gameId temporal (luego lo persistimos en Game)
        const gameId = crypto.randomUUID();

        return res.status(200).json({ gameId, questions });
    } catch (err) {
        next(err);
    }
};
