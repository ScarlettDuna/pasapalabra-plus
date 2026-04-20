import { prisma } from "../db/prisma.js";

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

        const questions = await getRoscoQuestions(lang, catId, diff, req.user?.userId);

        return res.status(200).json({ questions });
    } catch (err) {
        next(err);
    }
};

export async function getRoscoQuestions(lang, catId, diff, userId) {
    // Trae preguntas filtradas
    const all = await prisma.question.findMany({
        where: {
            language: lang,
            difficulty: diff,
            categoryId: catId,
            OR: [
                { status: "approved", isPersonal: false },
                ...(userId ? [{ isPersonal: true, createdBy: userId}] : [])
            ]
        },
        select: { id: true, letter: true, question: true, answer: true },
    });

    // Agrupa por letra
    const byLetter = new Map();
    for (const q of all) {
        const letter = String(q.letter).toUpperCase();
        if (!byLetter.has(letter)) byLetter.set(letter, []);
        byLetter.get(letter).push(q);
    }
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    // Elige 1 pregunta por letra (si existe)
    return letters
        .map((L) => {
            const candidates = byLetter.get(L);
            if (!candidates || candidates.length === 0) return null;
            const pick = candidates[Math.floor(Math.random() * candidates.length)];
            return { letter: L, questionId: pick.id, question: pick.question, answer: pick.answer };
        })
        .filter(Boolean)
}