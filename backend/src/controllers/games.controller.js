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
        console.log("Usuario autenticado:", req.user);
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
                userId: req.user?.userId ?? null,
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
        const { answers } = req.body;

        if (answers === undefined ) {
            return res.status(400).json({ message: "Body obligatorio: array de answers" });
        }

        let correct = 0;
        let wrong = 0;

        const questionIds = answers.map(a => a.questionId);
        const dbQuestions = await prisma.question.findMany({
            where: { id: { in: questionIds } },
            select: { id: true, answer: true }
        });
        // Convertir a mapa para acceso rápido
        const answerMap = new Map(dbQuestions.map(q => [q.id, q.answer]));

        for (let answer of answers) {
            const correctAnswer = answerMap.get(answer.questionId);
            if (answer.answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) {
                correct += 1;
            } else {
                wrong += 1;
            }
        }

        // Traemos la partida
        const game = await prisma.game.findUnique({
            where: { id: gameId },
            select: { id: true, startedAt: true, endedAt: true, userId: true, duration: true, categoryId: true, language: true, difficulty: true },
        });

        if (!game) {
            return res.status(404).json({ message: "Partida no encontrada" });
        }
        // Si la partida pertenece a alguien y o no hay token o el token es de otro usuario -> error 403
        if (game.userId && (!req.user || game.userId !== req.user.userId)){   
            return res.status(403).json({ message: "No tienes permiso para finalizar esta partida" });
        }

        if (game.endedAt) {
            return res.status(409).json({ message: "Esta partida ya fue finalizada" });
        }

        const endedAt = new Date();
        const duration = Math.max(
            0,
            Math.round((endedAt.getTime() - new Date(game.startedAt).getTime()) / 1000)
        );

        const points = calcScore({ correct: correct, wrong: wrong, duration });

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
                    correct: correct,
                    wrong: wrong,
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
