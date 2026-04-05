import { prisma } from "../db/prisma.js";

export const createUser = async (req, res, next) => {
    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({ message: "Body param 'username' es obligatorio" })
        }
        const uname = String(username).trim();
        if (!uname) {
            return res.status(400).json({ message: "username no puede estar vacío" });
        }
        
        const user = await prisma.user.create({
            data: {
                username: uname
            },
            select: {
                id: true,
                username: true,
                createdAt: true
            }
        });

        return res.status(201).json({user})
    } catch (err) {
        if (err.code === "P2002") { 
            return res.status(409).json({ message: "Username already in use" });
        }
        next(err)
    }
}

export const getMe = async (req, res, next) => {
    try {

    const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        select: {
                id: true,
                username: true,
                email: true,
                createdAt: true
            }
    });

    if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }
    
    return res.status(200).json(user)

    } catch (err) {
        next(err)
    }

    
}

export const getMyGames = async (req, res, next) => {
    try {

        const user = req.user.userId;
        const games = await prisma.game.findMany({
            where: { userId: user, endedAt: { not: null }},
            include: { score: true },
            orderBy: { score: { score: 'desc' }}
        })
        
        return res.status(200).json(games)
        
    } catch (err) {
        next(err)
    }
}

export const getMyStats = async (req, res, next) => {

    try {
        // totales generados 
    const totals = await prisma.score.aggregate({
        where: { game: { userId: req.user.userId } },
        _sum: { correct: true, wrong: true },
        _avg: { score: true },
        _max: { score: true },
        _count: true
    });

    // partidas perfectas
    const perfectGames = await prisma.score.count({
        where: {
            game: { userId: req.user.userId },
            correct: 26
        }
    });

    // mejor partida
    const bestGame = await prisma.score.findFirst({
        where: { game: { userId: req.user.userId } },
        orderBy: { score: "desc" },
        select: { id: true, correct: true, score: true, createdAt: true, gameId: true }
    });

    // letra más fallada
    const hardestLetter = await prisma.gameAnswer.groupBy({
        by: ["letter"],
        where: { game: { userId: req.user.userId }, isCorrect: false },
        _count: { letter: true },
        orderBy: { _count: { letter: "desc" } },
        take: 1
    });

    // por categoría
    const gamesByCategory = await prisma.game.findMany({
        where: { userId: req.user.userId, endedAt: { not: null } },
        include: {
            category: { select: { id: true, name: true } },
            score: { select: { score: true } }
        }
    });

    const byCategory = Object.values(
        gamesByCategory.reduce((acc, game) => {
            const key = game.categoryId;
            if (!acc[key]) {
                acc[key] = { categoryId: key, name: game.category.name, games: 0, totalScore: 0 };
            }
            acc[key].games += 1;
            acc[key].totalScore += game.score?.score ?? 0;
            return acc;
        }, {})
    ).map(c => ({ ...c, avgScore: Math.round(c.totalScore / c.games), totalScore: undefined }));
    
    // por idioma
    const byLanguage = Object.values(
        gamesByCategory.reduce((acc, game) => {
            const key = game.language;
            if (!acc[key]) acc[key] = { language: key, games: 0, totalScore: 0 };
            acc[key].games += 1;
            acc[key].totalScore += game.score?.score ?? 0;
            return acc;
        }, {})
    ).map(l => ({ ...l, avgScore: Math.round(l.totalScore / l.games), totalScore: undefined }));

    res.status(200).json({
        totalGames: totals._count,
        totalCorrect: totals._sum.correct ?? 0,
        totalWrong: totals._sum.wrong ?? 0,
        avgScore: Math.round(totals._avg.score ?? 0),
        bestScore: totals._max.score ?? 0,
        perfectGames,
        bestGame,
        hardestLetter: hardestLetter[0]?.letter ?? null,
        byCategory,
        byLanguage
    });

    } catch (err) {
        next(err)
    }
    
}

export const getMyAchievements = async (req, res, next) => {
    try {
        const achievements = await prisma.userAchievement.findMany({
            where: { userId: req.user.userId },
            orderBy: { unlockedAt: "asc" }
        });
        return res.status(200).json(achievements)
    } catch (err) {
        next(err)
    }
}