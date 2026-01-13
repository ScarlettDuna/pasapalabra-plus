import { prisma } from "../db/prisma.js";

const ALLOWED_LANG = new Set(["ES", "EN", "FR"]);
const ALLOWED_DIFF = new Set(["easy", "medium", "hard"]);

// Fórmula simple (ajustable)
function calcScore({ correct, wrong, duration }) {
    // ejemplo: premio aciertos, penalizo fallos y tiempo
    return correct * 100 - wrong * 25 - duration;
}

export const startGame = async (req, res, next) => {
    try {
        const { language, difficulty, categoryId } = req.body;

        if (!language || !difficulty || !categoryId) {
            return res.status(400).json({
                message: "Body obligatorio: language, difficulty, categoryId",
            });
        }

        const lang = String(language).toUpperCase();
        if (!ALLOWED_LANG.has(lang)) {
            return res.status(400).json({ message: "language debe ser ES, EN o FR" });
        }

        const diff = String(difficulty).toLowerCase();
        if (!ALLOWED_DIFF.has(diff)) {
            return res.status(400).json({ message: "difficulty debe ser easy, medium o hard" });
        }

        const catId = Number(categoryId);
        if (!Number.isInteger(catId) || catId <= 0) {
            return res.status(400).json({ message: "categoryId debe ser un entero positivo" });
        }

        // Verifica que la categoría exista (evita FK error)
        const category = await prisma.category.findUnique({ where: { id: catId } });
        if (!category) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }

        const game = await prisma.game.create({
            data: {
                language: lang,
                difficulty: diff,
                categoryId: catId,
                // startedAt lo pone Prisma con @default(now())
            },
            select: {
                id: true,
                language: true,
                difficulty: true,
                categoryId: true,
                startedAt: true,
            },
        });

        return res.status(201).json({ gameId: game.id, game });
    } catch (err) {
        next(err);
    }
};

export const finishGame = async (req, res, next) => {
    try {
        const { gameId } = req.params;
        const { correct, wrong } = req.body;

        if (correct === undefined || wrong === undefined) {
            return res.status(400).json({ message: "Body obligatorio: correct, wrong" });
        }

        const c = Number(correct);
        const w = Number(wrong);

        if (!Number.isInteger(c) || c < 0 || !Number.isInteger(w) || w < 0) {
            return res.status(400).json({ message: "correct y wrong deben ser enteros >= 0" });
        }

        // Traemos la partida
        const game = await prisma.game.findUnique({
            where: { id: gameId },
            select: { id: true, startedAt: true, endedAt: true, duration: true, categoryId: true, language: true, difficulty: true },
        });

        if (!game) {
            return res.status(404).json({ message: "Partida no encontrada" });
        }

        if (game.endedAt) {
            return res.status(409).json({ message: "Esta partida ya fue finalizada" });
        }

        const endedAt = new Date();
        const duration = Math.max(
            0,
            Math.round((endedAt.getTime() - new Date(game.startedAt).getTime()) / 1000)
        );

        const points = calcScore({ correct: c, wrong: w, duration });

        // Transacción: actualizar Game + crear Score (1–1)
        const result = await prisma.$transaction(async (tx) => {
            const updatedGame = await tx.game.update({
                where: { id: gameId },
                data: { endedAt, duration },
                select: { id: true, endedAt: true, duration: true },
            });

            const score = await tx.score.create({
                data: {
                    gameId,
                    correct: c,
                    wrong: w,
                    duration,
                    score: points,
                },
                select: { id: true, correct: true, wrong: true, duration: true, score: true, createdAt: true, gameId: true },
            });

            return { updatedGame, score };
        });

        return res.status(201).json(result);
    } catch (err) {
        // Si intentas crear Score dos veces, saltará unique constraint, Prisma lo lanza un error;
        next(err);
    }
};
